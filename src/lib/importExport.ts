import { ImportedCard, ImportResult, ImportError, CSVRow, JSONImportPayload } from '@/types/import';
import { parseAnkiFile } from '@/lib/ankiParser';

/**
 * Parse CSV content and extract cards
 * Expected format: front,back,reading,type,tags
 */
export function parseCSV(csvContent: string): ImportResult {
  const lines = csvContent.trim().split('\n');
  const importedCards: ImportedCard[] = [];
  const errors: ImportError[] = [];
  const warnings: string[] = [];

  // Skip header if it exists
  let startIdx = 0;
  if (lines[0]?.toLowerCase().includes('front')) {
    startIdx = 1;
    warnings.push('Skipping header row');
  }

  for (let i = startIdx; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    try {
      const [front, back, reading, type, tags] = line.split(',').map((s) => s.trim());

      if (!front || !back) {
        errors.push({
          row: i + 1,
          message: 'Missing required fields: front and back are required',
          data: { front, back },
        });
        continue;
      }

      const cardType = (type || 'vocab') as 'kana' | 'vocab' | 'grammar';
      if (!['kana', 'vocab', 'grammar'].includes(cardType)) {
        warnings.push(`Row ${i + 1}: Invalid type "${type}", defaulting to "vocab"`);
      }

      const card: ImportedCard = {
        front,
        back,
        reading: reading || undefined,
        type: cardType,
        tags: tags ? tags.split(';').map((t) => t.trim()) : undefined,
        importedAt: new Date().toISOString(),
      };

      importedCards.push(card);
    } catch (error) {
      errors.push({
        row: i + 1,
        message: `Failed to parse row: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
    }
  }

  return {
    success: errors.length === 0,
    cardsImported: importedCards.length,
    cardsSkipped: errors.length,
    errors,
    warnings,
    importedCards,
  };
}

/**
 * Parse JSON content and extract cards
 * Expected format: { cards: [...], metadata?: {...} }
 */
export function parseJSON(jsonContent: string): ImportResult {
  const errors: ImportError[] = [];
  const warnings: string[] = [];
  const importedCards: ImportedCard[] = [];

  try {
    const payload = JSON.parse(jsonContent) as JSONImportPayload;

    if (!Array.isArray(payload.cards)) {
      errors.push({
        row: 0,
        message: 'JSON must contain a "cards" array',
      });
      return {
        success: false,
        cardsImported: 0,
        cardsSkipped: 0,
        errors,
        warnings,
        importedCards: [],
      };
    }

    for (let i = 0; i < payload.cards.length; i++) {
      const card = payload.cards[i];

      if (!card.front || !card.back) {
        errors.push({
          row: i + 1,
          message: 'Missing required fields: front and back are required',
          data: card as unknown as Record<string, unknown>,
        });
        continue;
      }

      const cardType = (card.type || 'vocab') as 'kana' | 'vocab' | 'grammar';
      if (!['kana', 'vocab', 'grammar'].includes(cardType)) {
        warnings.push(`Card ${i + 1}: Invalid type "${card.type}", defaulting to "vocab"`);
      }

      const importedCard: ImportedCard = {
        front: card.front,
        back: card.back,
        reading: card.reading,
        type: cardType,
        tags: card.tags,
        source: 'json-import',
        importedAt: new Date().toISOString(),
      };

      importedCards.push(importedCard);
    }

    return {
      success: errors.length === 0,
      cardsImported: importedCards.length,
      cardsSkipped: errors.length,
      errors,
      warnings,
      importedCards,
    };
  } catch (error) {
    errors.push({
      row: 0,
      message: `Invalid JSON: ${error instanceof Error ? error.message : 'Unknown error'}`,
    });
    return {
      success: false,
      cardsImported: 0,
      cardsSkipped: 0,
      errors,
      warnings,
      importedCards: [],
    };
  }
}

/**
 * Detect import format based on file extension and content
 */
export function detectFormat(
  filename: string,
  content: string
): 'csv' | 'json' | 'anki' | 'unknown' {
  const ext = filename.toLowerCase().split('.').pop();

  if (ext === 'csv') return 'csv';
  if (ext === 'json') return 'json';
  if (ext === 'apkg' || ext === 'colpkg') return 'anki';

  // Try to detect by content
  if (content.trim().startsWith('{')) return 'json';
  if (content.includes(',')) return 'csv';

  return 'unknown';
}

/**
 * Import cards from a File object.
 * Handles CSV, JSON, and Anki APKG formats.
 */
export async function importCardsFromFile(file: File): Promise<ImportResult> {
  const ext = file.name.toLowerCase().split('.').pop();

  if (ext === 'apkg' || ext === 'colpkg') {
    return parseAnkiFile(file);
  }

  // For text formats, read as string
  const content = await file.text();
  return importCards(file.name, content);
}

/**
 * Import cards from file content (text-based formats only).
 * For binary formats (.apkg) use importCardsFromFile instead.
 */
export async function importCards(
  filename: string,
  content: string
): Promise<ImportResult> {
  const format = detectFormat(filename, content);

  switch (format) {
    case 'csv':
      return parseCSV(content);
    case 'json':
      return parseJSON(content);
    case 'anki':
      return {
        success: false,
        cardsImported: 0,
        cardsSkipped: 0,
        errors: [{ row: 0, message: 'APKG files must be imported via importCardsFromFile()' }],
        warnings: [],
        importedCards: [],
      };
    default:
      return {
        success: false,
        cardsImported: 0,
        cardsSkipped: 0,
        errors: [{ row: 0, message: `Unknown file format: ${format}` }],
        warnings: [],
        importedCards: [],
      };
  }
}

/**
 * Export cards to CSV format
 */
export function exportToCSV(cards: ImportedCard[]): string {
  const header = ['Front', 'Back', 'Reading', 'Type', 'Tags'].join(',');
  const rows = cards.map((card) => [
    `"${card.front.replace(/"/g, '""')}"`,
    `"${card.back.replace(/"/g, '""')}"`,
    `"${(card.reading || '').replace(/"/g, '""')}"`,
    card.type,
    card.tags?.join(';') || '',
  ].join(','));

  return [header, ...rows].join('\n');
}

/**
 * Export cards to JSON format
 */
export function exportToJSON(
  cards: ImportedCard[],
  metadata?: Record<string, unknown>
): string {
  const payload = {
    cards,
    metadata: {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      ...metadata,
    },
  };

  return JSON.stringify(payload, null, 2);
}

/**
 * Export cards to downloadable file
 */
export function downloadExport(filename: string, content: string): void {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
