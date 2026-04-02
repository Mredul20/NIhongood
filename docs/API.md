# NIhongood API Documentation

The NIhongood API allows developers to programmatically access and manage Japanese learning data.

## Base URL

```
https://n-ihongood.vercel.app/api
```

## Authentication

All API requests require a valid Supabase session. Include your session token in the request:

```bash
curl -H "Authorization: Bearer YOUR_SESSION_TOKEN" \
  https://n-ihongood.vercel.app/api/cards
```

## Endpoints

### Cards

#### GET /api/cards

Retrieve user's SRS cards.

**Query Parameters:**
- `type` (optional): Filter by card type - `kana`, `vocab`, or `grammar`
- `limit` (optional): Number of results (default: 100, max: 1000)
- `offset` (optional): Pagination offset (default: 0)

**Example:**
```bash
curl -H "Authorization: Bearer TOKEN" \
  "https://n-ihongood.vercel.app/api/cards?type=vocab&limit=50&offset=0"
```

**Response:**
```json
{
  "cards": [
    {
      "id": "card-123",
      "front": "漢字",
      "back": "Kanji - Japanese characters",
      "reading": "かんじ",
      "type": "vocab",
      "interval": 10,
      "ease_factor": 2.5,
      "next_review": "2024-04-10T00:00:00Z",
      "repetitions": 5
    }
  ],
  "total": 150,
  "limit": 50,
  "offset": 0
}
```

#### POST /api/cards

Import cards into the user's deck.

**Request Body:**
```json
{
  "cards": [
    {
      "front": "漢字",
      "back": "Kanji",
      "reading": "かんじ",
      "type": "vocab",
      "tags": ["common", "n5"]
    }
  ]
}
```

Or directly as an array:
```json
[
  {
    "front": "漢字",
    "back": "Kanji",
    "reading": "かんじ",
    "type": "vocab"
  }
]
```

**Response:**
```json
{
  "message": "Successfully imported 10 cards",
  "imported": 10,
  "cards": [...]
}
```

### Progress

#### GET /api/progress

Get user's learning progress and statistics.

**Response:**
```json
{
  "progress": {
    "id": "progress-123",
    "user_id": "user-123",
    "total_xp": 500,
    "level": 5,
    "current_streak": 10,
    "longest_streak": 25,
    "total_reviews": 150,
    "total_study_minutes": 480,
    "last_review_date": "2024-04-03T12:00:00Z",
    "unlocked_badges": ["first-review", "streak-3", "streak-7"]
  },
  "dailyLogs": [
    {
      "id": "log-123",
      "user_id": "user-123",
      "date": "2024-04-03",
      "xp_earned": 50,
      "reviews_completed": 10,
      "study_minutes": 30
    }
  ],
  "reviewHistory": [
    {
      "id": "history-123",
      "user_id": "user-123",
      "date": "2024-04-03",
      "correct": 8,
      "total": 10
    }
  ]
}
```

#### PUT /api/progress

Update user's progress data.

**Request Body:**
```json
{
  "total_xp": 600,
  "level": 6,
  "current_streak": 11
}
```

**Response:**
```json
{
  "message": "Progress updated successfully",
  "progress": {...}
}
```

### Export

#### GET /api/export

Export all user data in JSON or CSV format.

**Query Parameters:**
- `format` (optional): `json` or `csv` (default: `json`)

**Examples:**

Export as JSON:
```bash
curl -H "Authorization: Bearer TOKEN" \
  https://n-ihongood.vercel.app/api/export?format=json \
  -o nihongood-export.json
```

Export as CSV:
```bash
curl -H "Authorization: Bearer TOKEN" \
  https://n-ihongood.vercel.app/api/export?format=csv \
  -o nihongood-export.csv
```

**JSON Response:**
```json
{
  "exportedAt": "2024-04-03T12:00:00Z",
  "version": "1.0",
  "user": {
    "id": "user-123",
    "email": "user@example.com"
  },
  "profile": {...},
  "progress": {...},
  "cards": [...],
  "learningProgress": {...},
  "preferences": {...},
  "dailyLogs": [...],
  "reviewHistory": [...]
}
```

## File Formats

### CSV Format

For importing cards via CSV:

```csv
Front,Back,Reading,Type,Tags
漢字,Kanji,かんじ,vocab,common;n5
あ,Hiragana a,あ,kana,hiragana
です,To be,です,grammar,present;formal
```

**Columns:**
- `Front`: Japanese term (required)
- `Back`: English meaning (required)
- `Reading`: Hiragana reading (optional)
- `Type`: `kana`, `vocab`, or `grammar` (optional, defaults to `vocab`)
- `Tags`: Semicolon-separated tags (optional)

### JSON Format

For importing cards via JSON:

```json
{
  "cards": [
    {
      "front": "漢字",
      "back": "Kanji",
      "reading": "かんじ",
      "type": "vocab",
      "tags": ["common", "n5"]
    }
  ]
}
```

## Error Handling

All endpoints return appropriate HTTP status codes and error messages:

```json
{
  "error": "Unauthorized"
}
```

**Common Status Codes:**
- `200` - Success
- `400` - Bad request (invalid parameters)
- `401` - Unauthorized (missing or invalid token)
- `500` - Server error

## Rate Limiting

Currently unlimited. Rate limiting will be added in future releases.

## SDK / Clients

Coming soon:
- JavaScript/TypeScript SDK
- Python SDK
- Mobile SDKs

## Examples

### JavaScript/Fetch

```javascript
// Get cards
const response = await fetch(
  'https://n-ihongood.vercel.app/api/cards?type=vocab&limit=10',
  {
    headers: {
      'Authorization': `Bearer ${sessionToken}`
    }
  }
);
const data = await response.json();
console.log(data.cards);

// Import cards
await fetch('https://n-ihongood.vercel.app/api/cards', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${sessionToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    cards: [
      {
        front: '漢字',
        back: 'Kanji',
        reading: 'かんじ',
        type: 'vocab'
      }
    ]
  })
});
```

### cURL

```bash
# Get progress
curl -H "Authorization: Bearer TOKEN" \
  https://n-ihongood.vercel.app/api/progress

# Import from CSV file
curl -H "Authorization: Bearer TOKEN" \
  -F "file=@cards.csv" \
  https://n-ihongood.vercel.app/api/cards

# Export data
curl -H "Authorization: Bearer TOKEN" \
  https://n-ihongood.vercel.app/api/export?format=json \
  > export.json
```

## Webhooks (Coming Soon)

Webhooks for real-time notifications:
- `review.completed` - When user completes a review
- `card.imported` - When cards are imported
- `milestone.reached` - When user reaches a milestone

## Questions or Issues?

Report issues on GitHub: https://github.com/Mredul20/NIhongood/issues
