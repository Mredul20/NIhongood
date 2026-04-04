/**
 * Anki APKG Parser
 *
 * APKG files are ZIP archives containing:
 *   - collection.anki2  (SQLite database with notes, cards, models)
 *   - media             (JSON mapping of filenames to media)
 *   - 0, 1, 2, ...      (actual media files)
 *
 * This parser runs entirely in the browser using:
 *   - jszip   – to unzip the .apkg file
 *   - sql.js  – a pure-JS SQLite port (no Node.js required)
 */

import JSZip from 'jszip';
import initSqlJs, { type Database } from 'sql.js';
import type { ImportedCard, ImportResult, ImportError } from '@/types/import';

// ---------------------------------------------------------------------------
// Internal Anki DB row shapes
// ---------------------------------------------------------------------------

interface AnkiNoteRow {
  id: number;
  guid: string;
  mid: number;   // model id
  tags: string;  // space-separated
  flds: string;  // fields separated by \x1f
}

interface AnkiModelField {
  name: string;
  ord: number;
}

interface AnkiModelInfo {
  name: string;
  flds: AnkiModelField[];
}

// ---------------------------------------------------------------------------
// HTML / LaTeX cleaning helpers
// ---------------------------------------------------------------------------

/**
 * Strip HTML tags and convert common entities to plain text.
 * Preserves Japanese characters and furigana where possible.
 */
function stripHtml(html: string): string {
  return html
    // Remove style / script blocks entirely
    .replace(/<(style|script)[^>]*>[\s\S]*?<\/\1>/gi, '')
    // Replace <br> variants with newline
    .replace(/<br\s*\/?>/gi, '\n')
    // Remove all remaining tags
    .replace(/<[^>]+>/g, '')
    // Decode common HTML entities
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    // Collapse excessive whitespace (keep single newlines)
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/**
 * Remove LaTeX delimiters and try to keep the inner expression.
 * e.g. [latex]...[/latex]  or  \(...\)  or  \[...\]
 */
function stripLatex(text: string): string {
  return text
    .replace(/\[latex\][\s\S]*?\[\/latex\]/gi, '[formula]')
    .replace(/\\\([\s\S]*?\\\)/g, '[formula]')
    .replace(/\\\[[\s\S]*?\\\]/g, '[formula]')
    .replace(/{{c\d+::(.*?)}}/g, '$1'); // cloze deletions → reveal answer
}

function cleanField(raw: string): string {
  return stripLatex(stripHtml(raw)).trim();
}

// ---------------------------------------------------------------------------
// Type inference heuristics
// ---------------------------------------------------------------------------

const HIRAGANA = /[\u3041-\u3096]/;
const KATAKANA = /[\u30A1-\u30FA]/;
const KANJI    = /[\u4E00-\u9FAF\u3400-\u4DBF]/;

/**
 * Guess the card type from its content and Anki model name.
 */
function inferCardType(
  front: string,
  back: string,
  modelName: string,
  tags: string[]
): 'kana' | 'vocab' | 'grammar' {
  const combined = `${front} ${back} ${modelName}`.toLowerCase();
  const tagStr   = tags.join(' ').toLowerCase();

  // Explicit tag hints
  if (tagStr.includes('grammar') || combined.includes('grammar')) return 'grammar';
  if (tagStr.includes('kana') || combined.includes('kana'))       return 'kana';

  // Content-based: if front is purely kana with no kanji → kana card
  if ((HIRAGANA.test(front) || KATAKANA.test(front)) && !KANJI.test(front)) {
    return 'kana';
  }

  // If front contains kanji → vocabulary
  if (KANJI.test(front)) return 'vocab';

  return 'vocab'; // safe default
}

// ---------------------------------------------------------------------------
// Model parsing
// ---------------------------------------------------------------------------

/**
 * Parse the `models` JSON blob from the `col` table.
 * Anki stores it as  { "<model_id>": { name, flds: [...], ... }, ... }
 */
function parseModels(modelsJson: string): Record<string, AnkiModelInfo> {
  try {
    const raw = JSON.parse(modelsJson) as Record<string, {
      name: string;
      flds: Array<{ name: string; ord: number }>;
    }>;

    const result: Record<string, AnkiModelInfo> = {};
    for (const [id, model] of Object.entries(raw)) {
      result[id] = {
        name: model.name,
        flds: (model.flds || []).map((f) => ({ name: f.name, ord: f.ord })),
      };
    }
    return result;
  } catch {
    return {};
  }
}

// ---------------------------------------------------------------------------
// Core parser
// ---------------------------------------------------------------------------

/**
 * Parse an Anki .apkg file (as an ArrayBuffer) and return ImportResult.
 *
 * @param buffer - Raw bytes of the .apkg file
 * @param deckName - Optional deck name for tagging; defaults to "anki-import"
 */
export async function parseAnkiAPKG(
  buffer: ArrayBuffer,
  deckName = 'anki-import'
): Promise<ImportResult> {
  const errors: ImportError[] = [];
  const warnings: string[] = [];
  const importedCards: ImportedCard[] = [];

  // ── 1. Unzip ──────────────────────────────────────────────────────────────
  let zip: JSZip;
  try {
    zip = await JSZip.loadAsync(buffer);
  } catch (e) {
    return {
      success: false,
      cardsImported: 0,
      cardsSkipped: 0,
      errors: [{ row: 0, message: `Failed to unzip APKG: ${e instanceof Error ? e.message : 'unknown error'}` }],
      warnings: [],
      importedCards: [],
    };
  }

  // ── 2. Extract the SQLite database ────────────────────────────────────────
  // Anki 2 uses "collection.anki2"; Anki 21 package may also have "collection.anki21"
  const dbFile =
    zip.file('collection.anki21') ||
    zip.file('collection.anki2');

  if (!dbFile) {
    return {
      success: false,
      cardsImported: 0,
      cardsSkipped: 0,
      errors: [{ row: 0, message: 'Invalid APKG: collection database not found inside ZIP.' }],
      warnings: [],
      importedCards: [],
    };
  }

  const dbBuffer = await dbFile.async('arraybuffer');

  // ── 3. Open SQLite ────────────────────────────────────────────────────────
  let SQL: Awaited<ReturnType<typeof initSqlJs>>;
  try {
    SQL = await initSqlJs({
      // sql.js ships a WASM file; in Next.js we serve it from /public
      locateFile: (filename: string) => `/${filename}`,
    });
  } catch (e) {
    return {
      success: false,
      cardsImported: 0,
      cardsSkipped: 0,
      errors: [{ row: 0, message: `Failed to initialize SQLite engine: ${e instanceof Error ? e.message : 'unknown error'}` }],
      warnings: [],
      importedCards: [],
    };
  }

  let db: Database;
  try {
    db = new SQL.Database(new Uint8Array(dbBuffer));
  } catch (e) {
    return {
      success: false,
      cardsImported: 0,
      cardsSkipped: 0,
      errors: [{ row: 0, message: `Failed to open SQLite database: ${e instanceof Error ? e.message : 'unknown error'}` }],
      warnings: [],
      importedCards: [],
    };
  }

  try {
    // ── 4. Read collection metadata (models) ──────────────────────────────
    let models: Record<string, AnkiModelInfo> = {};
    try {
      const colResult = db.exec('SELECT models FROM col LIMIT 1');
      if (colResult.length > 0 && colResult[0].values.length > 0) {
        const modelsJson = colResult[0].values[0][0] as string;
        models = parseModels(modelsJson);
      }
    } catch {
      warnings.push('Could not read model information – field names will be generic.');
    }

    // ── 5. Query notes ────────────────────────────────────────────────────
    let noteRows: AnkiNoteRow[] = [];
    try {
      const noteResult = db.exec('SELECT id, guid, mid, tags, flds FROM notes');
      if (noteResult.length > 0) {
        noteRows = noteResult[0].values.map((row) => ({
          id:   row[0] as number,
          guid: row[1] as string,
          mid:  row[2] as number,
          tags: row[3] as string,
          flds: row[4] as string,
        }));
      }
    } catch (e) {
      errors.push({ row: 0, message: `Failed to read notes table: ${e instanceof Error ? e.message : 'unknown error'}` });
      return { success: false, cardsImported: 0, cardsSkipped: 0, errors, warnings, importedCards };
    }

    if (noteRows.length === 0) {
      warnings.push('No notes found in the Anki deck.');
      return { success: true, cardsImported: 0, cardsSkipped: 0, errors, warnings, importedCards };
    }

    // ── 6. Convert notes → ImportedCard ──────────────────────────────────
    for (let i = 0; i < noteRows.length; i++) {
      const note = noteRows[i];

      try {
        // Fields are separated by ASCII unit separator \x1f
        const rawFields = note.flds.split('\x1f');
        const fields    = rawFields.map(cleanField);

        if (fields.length < 2) {
          errors.push({ row: i + 1, message: `Note ${note.id}: not enough fields (found ${fields.length})` });
          continue;
        }

        const front = fields[0];
        const back  = fields[1];

        if (!front || !back) {
          errors.push({ row: i + 1, message: `Note ${note.id}: front or back field is empty after cleaning` });
          continue;
        }

        // Reading is often in the 3rd field for Japanese decks
        const reading = fields.length > 2 && fields[2] ? fields[2] : undefined;

        // Tags come as a space-separated string in Anki
        const tags = note.tags
          .trim()
          .split(/\s+/)
          .filter(Boolean);

        // Deck name tag
        if (deckName && deckName !== 'anki-import') {
          tags.unshift(deckName);
        }

        // Look up model for this note
        const model     = models[String(note.mid)];
        const modelName = model?.name ?? '';

        const cardType = inferCardType(front, back, modelName, tags);

        importedCards.push({
          id:         `anki-${note.guid}`,
          front,
          back,
          reading,
          type:       cardType,
          tags:       tags.length > 0 ? tags : undefined,
          source:     'anki-import',
          importedAt: new Date().toISOString(),
        });
      } catch (e) {
        errors.push({
          row:     i + 1,
          message: `Note ${note.id}: ${e instanceof Error ? e.message : 'unknown error'}`,
        });
      }
    }

    return {
      success:       importedCards.length > 0,
      cardsImported: importedCards.length,
      cardsSkipped:  errors.length,
      errors,
      warnings,
      importedCards,
    };
  } finally {
    // Always close the DB to free WASM memory
    db.close();
  }
}

// ---------------------------------------------------------------------------
// File-based entry point (for use in the browser file upload handler)
// ---------------------------------------------------------------------------

/**
 * Parse an Anki .apkg File object (from a browser file input).
 */
export async function parseAnkiFile(file: File): Promise<ImportResult> {
  const buffer = await file.arrayBuffer();
  // Use filename (without extension) as the deck name tag
  const deckName = file.name.replace(/\.apkg$/i, '').replace(/[^a-zA-Z0-9_\-\u3000-\u9fff]/g, '-');
  return parseAnkiAPKG(buffer, deckName);
}
