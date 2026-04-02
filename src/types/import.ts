/**
 * Content import/export types and interfaces
 * Supports multiple formats: Anki, CSV, JSON
 */

export interface ImportedCard {
  id?: string;
  front: string;
  back: string;
  reading?: string;
  type: 'kana' | 'vocab' | 'grammar';
  tags?: string[];
  source?: string;
  importedAt: string;
}

export interface ImportResult {
  success: boolean;
  cardsImported: number;
  cardsSkipped: number;
  errors: ImportError[];
  warnings: string[];
  importedCards: ImportedCard[];
}

export interface ImportError {
  row: number;
  message: string;
  data?: Record<string, unknown>;
}

export interface ExportOptions {
  format: 'json' | 'csv' | 'anki';
  includeProgress?: boolean;
  includeReviewHistory?: boolean;
  filterByType?: 'kana' | 'vocab' | 'grammar';
  filterByTags?: string[];
}

export interface AnkiCard {
  id: number;
  nid: number; // note id
  did: number; // deck id
  ord: number; // card ordinal
  mod: number; // modification timestamp
  usn: number; // usn
  type: number; // card type
  queue: number; // card queue
  due: number; // due number
  ivl: number; // interval
  factor: number; // ease factor
  reps: number; // reviews
  lapses: number; // lapses
  left: number; // reviews left
  odue: number; // original due
  odid: number; // original did
  flags: number; // flags
  data: string; // data
}

export interface AnkiNote {
  id: number;
  guid: string;
  mid: number; // model id
  mod: number; // modification timestamp
  usn: number; // usn
  tags: string; // space separated tags
  flds: string; // field values separated by \x1f
  sfld: string; // sort field
  csum: number; // checksum
  flags: number; // flags
  data: string; // data
}

export interface AnkiModel {
  id: number;
  name: string;
  type: number;
  did: number;
  usn: number;
  sortf: number;
  latexPost: string;
  latexPre: string;
  latexsvg: boolean;
  inlineCSS: boolean;
  css: string;
  csum: number;
  id_: number;
  mod: number;
  flds: AnkiField[];
  tmpls: AnkiTemplate[];
  tags: string[];
  vers: unknown[];
  req: number[][];
}

export interface AnkiField {
  name: string;
  ord: number;
  sticky: boolean;
  rtl: boolean;
  font: string;
  media: unknown[];
  size: number;
}

export interface AnkiTemplate {
  name: string;
  ord: number;
  qfmt: string;
  afmt: string;
  brid: number;
  did: number;
  bafmt: string;
  front: string;
  back: string;
}

export interface AnkiDeck {
  id: number;
  name: string;
  desc: string;
  dyn: number;
  collapsed: boolean;
  browserCollapsed: boolean;
  extendNew: number;
  extendRev: number;
}

export interface AnkiCollection {
  id: number;
  crt: number;
  mod: number;
  scm: number;
  ver: number;
  dty: number;
  usn: number;
  ls: number;
  conf: unknown;
  models: Record<string, AnkiModel>;
  decks: Record<string, AnkiDeck>;
  dconf: unknown;
  tags: unknown;
}

// CSV format: front,back,reading,type,tags
export interface CSVRow {
  front: string;
  back: string;
  reading?: string;
  type?: string;
  tags?: string;
}

// JSON format for bulk import
export interface JSONImportPayload {
  cards: ImportedCard[];
  metadata?: {
    name?: string;
    description?: string;
    version?: string;
  };
}
