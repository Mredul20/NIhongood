# Anki APKG Import Parser - Technical Design

## Overview

APKG (Anki Package) files are ZIP archives containing flashcard decks. This parser will extract cards from APKG files and import them into the NIhongood SRS system.

## APKG File Structure

```
deck.apkg (ZIP file)
├── collection.anki2 (SQLite database)
├── media (directory with images/audio)
│   ├── 0.jpg
│   ├── 1.mp3
│   └── ...
└── [media manifest file]
```

### Key Tables in collection.anki2:
- `cards` - Flashcard instances
- `notes` - Base note content
- `models` - Card templates/types
- `col` - Collection metadata

## Implementation Plan

### Step 1: Extract ZIP
- Use `unzipper` or `jszip` library
- Extract collection.anki2 (SQLite database)
- Extract media files

### Step 2: Read SQLite Database
- Use `better-sqlite3` or similar
- Query notes and cards tables
- Extract front/back content and tags

### Step 3: Transform to NIhongood Format
- Convert HTML/LATEX to plain text or markdown
- Extract Japanese content
- Categorize by level (if detected from tags)

### Step 4: Import Cards
- Use existing API: `POST /api/cards`
- Batch import (max 100 cards per request)
- Handle duplicates by ID

## Dependencies to Add

```json
{
  "jszip": "^3.10.1",
  "better-sqlite3": "^9.0.0"
}
```

## File Structure

```
src/lib/ankiParser.ts - Main parser logic
src/types/anki.ts - TypeScript types
src/app/(app)/import-export/page.tsx - Updated to handle APKG
```

## Example Usage

```typescript
import { parseAnkiAPKG } from '@/lib/ankiParser';

const file = new File([fileBuffer], 'deck.apkg', { type: 'application/zip' });
const cards = await parseAnkiAPKG(file);
// cards: Array<{ front: string; back: string; tags: string[] }>
```

## Challenges & Solutions

| Challenge | Solution |
|-----------|----------|
| Large APKG files (100MB+) | Stream processing, batch importing |
| HTML/LaTeX in cards | Strip tags, convert LaTeX to text |
| Media references (images/audio) | Extract media, store URLs in card HTML |
| SQLite in browser | Use better-sqlite3 with Node.js backend OR use sql.js (pure JS) |
| Unicode/Japanese handling | Use proper UTF-8 decoding |

## Current Status

- Not yet implemented
- Waiting for dependencies to be added to package.json
- Test APKG file needed for development

