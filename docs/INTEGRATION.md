# Integration Guide

This guide explains how to integrate with NIhongood and extend its functionality.

## Overview

NIhongood provides multiple ways to integrate:
1. **REST API** - Direct HTTP access to data
2. **File Imports** - CSV/JSON format support
3. **Browser Extensions** - Extend functionality in the browser
4. **Webhooks** - Real-time event notifications (coming soon)

## Getting Started

### 1. Authentication

First, obtain your session token:

```javascript
// After logging in to NIhongood
const token = localStorage.getItem('supabase.auth.token');
// Or use the session from the auth context
```

### 2. API Requests

Use the session token to authenticate API requests:

```javascript
const headers = {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
};

const response = await fetch(
  'https://n-ihongood.vercel.app/api/cards',
  { headers }
);
```

## Use Cases

### Bulk Card Import

Import study materials from other sources:

```javascript
// 1. Convert your data to JSON format
const cards = [
  {
    front: '漢字',
    back: 'Kanji characters',
    reading: 'かんじ',
    type: 'vocab',
    tags: ['common', 'n5']
  },
  // ... more cards
];

// 2. Send to NIhongood API
const response = await fetch(
  'https://n-ihongood.vercel.app/api/cards',
  {
    method: 'POST',
    headers,
    body: JSON.stringify({ cards })
  }
);

const result = await response.json();
console.log(`Imported ${result.imported} cards`);
```

### Data Export & Backup

Export all your learning data:

```javascript
// Export as JSON
const response = await fetch(
  'https://n-ihongood.vercel.app/api/export?format=json',
  { headers }
);
const data = await response.json();

// Save to file
const blob = new Blob([JSON.stringify(data, null, 2)], {
  type: 'application/json'
});
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = `nihongood-backup-${new Date().toISOString()}.json`;
a.click();
```

### Sync with Anki

*Coming soon* - Sync your NIhongood cards with Anki decks.

### Custom Learning Tools

Build your own learning applications:

```javascript
// Fetch all vocabulary cards
const response = await fetch(
  'https://n-ihongood.vercel.app/api/cards?type=vocab&limit=1000',
  { headers }
);
const { cards } = await response.json();

// Use the data in your application
cards.forEach(card => {
  console.log(`Study: ${card.front} = ${card.back}`);
  // Build your custom learning interface
});
```

### Track Progress

Monitor learning progress programmatically:

```javascript
// Get current progress
const response = await fetch(
  'https://n-ihongood.vercel.app/api/progress',
  { headers }
);
const { progress, dailyLogs } = await response.json();

console.log(`Level: ${progress.level}`);
console.log(`Current Streak: ${progress.current_streak} days`);
console.log(`Total XP: ${progress.total_xp}`);

// Analyze trends
const last7Days = dailyLogs.slice(0, 7);
const avgMinutesPerDay = last7Days.reduce((sum, log) => sum + log.study_minutes, 0) / 7;
console.log(`Average study time: ${avgMinutesPerDay} minutes/day`);
```

## Browser Extension

Create a browser extension to enhance NIhongood:

### Extension Structure

```
my-nihongood-extension/
├── manifest.json
├── popup.html
├── popup.js
├── content.js
└── background.js
```

### manifest.json

```json
{
  "manifest_version": 3,
  "name": "NIhongood Enhancer",
  "version": "1.0.0",
  "permissions": ["activeTab", "scripting", "storage"],
  "host_permissions": [
    "https://n-ihongood.vercel.app/*"
  ],
  "action": {
    "default_popup": "popup.html"
  }
}
```

### Example Extension: Quick Add Card

```javascript
// popup.js
document.getElementById('addCard').addEventListener('click', async () => {
  const front = document.getElementById('front').value;
  const back = document.getElementById('back').value;
  const reading = document.getElementById('reading').value;

  const token = await chrome.storage.local.get('sessionToken');
  
  const response = await fetch(
    'https://n-ihongood.vercel.app/api/cards',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token.sessionToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        cards: [{
          front,
          back,
          reading,
          type: 'vocab'
        }]
      })
    }
  );

  if (response.ok) {
    alert('Card added!');
  }
});
```

## Webhooks (Coming Soon)

Subscribe to real-time events:

```javascript
// Register webhook
await fetch(
  'https://n-ihongood.vercel.app/api/webhooks',
  {
    method: 'POST',
    headers,
    body: JSON.stringify({
      url: 'https://your-server.com/webhooks/nihongood',
      events: ['review.completed', 'card.imported']
    })
  }
);

// Receive webhook events
app.post('/webhooks/nihongood', (req, res) => {
  const event = req.body;
  
  if (event.type === 'review.completed') {
    console.log(`User completed review: ${event.cardId}`);
  }
  
  res.json({ ok: true });
});
```

## Best Practices

### 1. Error Handling

```javascript
async function apiCall(endpoint, options = {}) {
  try {
    const response = await fetch(
      `https://n-ihongood.vercel.app${endpoint}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          ...options.headers
        },
        ...options
      }
    );

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    // Handle error (show UI message, retry, etc)
    throw error;
  }
}
```

### 2. Rate Limiting (Prepare for Future)

```javascript
const rateLimitDelay = 100; // ms between requests
let lastRequestTime = 0;

async function throttledAPI(endpoint, options) {
  const now = Date.now();
  const delay = Math.max(0, rateLimitDelay - (now - lastRequestTime));
  
  if (delay > 0) {
    await new Promise(resolve => setTimeout(resolve, delay));
  }
  
  lastRequestTime = Date.now();
  return apiCall(endpoint, options);
}
```

### 3. Secure Token Storage

```javascript
// For browser extensions
chrome.storage.local.set({ sessionToken: token });

// For web apps
// Never store in localStorage - use secure, httpOnly cookies instead
// Or get token from secure server-side session

// For mobile apps
// Use secure storage provided by platform
// iOS: Keychain
// Android: Keystore
```

## Examples

### Python Integration

```python
import requests
import json

class NihongoodAPI:
    def __init__(self, token):
        self.base_url = 'https://n-ihongood.vercel.app/api'
        self.headers = {
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json'
        }
    
    def get_cards(self, card_type=None, limit=100):
        params = {'limit': limit}
        if card_type:
            params['type'] = card_type
        
        response = requests.get(
            f'{self.base_url}/cards',
            headers=self.headers,
            params=params
        )
        return response.json()
    
    def import_cards(self, cards):
        response = requests.post(
            f'{self.base_url}/cards',
            headers=self.headers,
            json={'cards': cards}
        )
        return response.json()
    
    def get_progress(self):
        response = requests.get(
            f'{self.base_url}/progress',
            headers=self.headers
        )
        return response.json()

# Usage
api = NihongoodAPI(token='YOUR_TOKEN')
cards = api.get_cards(card_type='vocab', limit=50)
progress = api.get_progress()
```

### JavaScript SDK (Coming Soon)

```javascript
import { NIhongoodSDK } from '@nihongood/sdk';

const sdk = new NIhongoodSDK({
  token: 'YOUR_TOKEN',
  baseURL: 'https://n-ihongood.vercel.app/api'
});

// Get cards
const cards = await sdk.cards.list({ type: 'vocab' });

// Import cards
await sdk.cards.import([
  {
    front: '漢字',
    back: 'Kanji',
    reading: 'かんじ',
    type: 'vocab'
  }
]);

// Get progress
const progress = await sdk.progress.get();
```

## Support

- Documentation: https://n-ihongood.vercel.app/docs
- API Reference: https://n-ihongood.vercel.app/docs/api
- GitHub: https://github.com/Mredul20/NIhongood
- Issues: https://github.com/Mredul20/NIhongood/issues

## License

NIhongood API is available under the MIT License.
