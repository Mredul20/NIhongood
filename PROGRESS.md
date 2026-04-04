# NIhongood Development Progress

## Project Overview

NIhongood is a modern Japanese language learning app using Spaced Repetition System (SRS) flashcards for JLPT N5/N4 preparation. Built with Next.js, TypeScript, Tailwind CSS, Zustand, and Supabase.

**Live Project:** https://mkcimanpcghmzqwievsz.supabase.co

## Completed Work ✅

### Phase 1: Authentication & Database (Completed)
- ✅ Supabase project setup with 7 relational tables
- ✅ Real authentication (email/password, OAuth placeholders)
- ✅ Auth state management with Zustand
- ✅ Automatic store synchronization with Supabase (5-min intervals)
- ✅ Auth guard protecting all app routes

### Phase 2: Integration & APIs (Completed)
- ✅ REST API endpoints:
  - `GET /api/cards` - List cards with filtering/pagination
  - `POST /api/cards` - Bulk import cards
  - `GET /api/progress` - Get progress data
  - `PUT /api/progress` - Update progress
  - `GET /api/export` - Export data as JSON/CSV
- ✅ CSV/JSON import and export
- ✅ Comprehensive API documentation (docs/API.md)

### Phase 3: UI Redesign (Completed)
- ✅ Login page redesigned with clean light theme
- ✅ Humanized copy and progressive disclosure
- ✅ Password visibility toggle
- ✅ Form accessibility improvements
- ✅ Error message display

### Phase 4: API Rate Limiting (Completed)
- ✅ In-memory rate limiter utility
- ✅ Rate limiting applied to all API endpoints:
  - GET: 60-100 req/min
  - POST: 20 req/min
  - PUT: 30 req/min
  - Export: 10 req/min (expensive)
- ✅ X-RateLimit headers in responses
- ✅ Automatic cleanup of expired entries
- ✅ Card import limited to 500 per request

## Current Status & Recent Fixes

### Auth Form Issue (FIXED ✅)
**Problem:** Login form inputs were disabled/frozen, showing "Signing in..." indefinitely
**Solution:** 
- Added `isAuthReady` state to track initialization completion
- Fixed `isDisabled` logic: `isSubmitting || isLoading || !isAuthReady`
- Proper error handling with state reset on failure
- Test result: **Build succeeds, no TypeScript errors**

### OAuth Setup (PENDING)
**Status:** Code is ready, awaiting manual Supabase configuration
**What's needed:**
1. Create Google OAuth credentials at Google Cloud Console
2. Create GitHub OAuth app at GitHub Developer Settings
3. Configure both in Supabase dashboard
4. Test the flow in browser

**Documentation:** See OAUTH_SETUP.md for step-by-step instructions

## Pending Features

### High Priority
1. **OAuth Integration Testing** - Manual setup + testing
   - Google and GitHub providers
   - Redirect flow verification
   - Profile auto-creation verification

2. **End-to-End Auth Testing** - Verify complete flows:
   - Email/password login
   - Email/password registration
   - Password reset (if applicable)
   - OAuth providers

### Medium Priority
1. **Anki APKG Import Parser** ✅ COMPLETED
   - jszip + sql.js (browser-compatible SQLite) installed
   - `src/lib/ankiParser.ts` — full parser: unzip → SQLite → transform → ImportResult
   - `src/app/api/import-anki/route.ts` — server-side API endpoint (5 req/min, 50 MB cap)
   - `src/lib/importExport.ts` — updated with `importCardsFromFile()` supporting CSV/JSON/APKG
   - `src/app/(app)/import-export/page.tsx` — UI updated with APKG support & warnings display
   - `public/sql-wasm.wasm` — sql.js WASM binary served from public/

2. **Advanced Features:**
   - Learning curves & analytics dashboards
   - Spaced repetition algorithm optimization
   - Pronunciation & listening support

### Low Priority
1. **Community & Social Features**
   - Leaderboards
   - Profile sharing
   - Study groups

2. **Content Expansion**
   - N3/N2 level cards
   - Kanji/radicals
   - Listening comprehension

3. **Offline Support**
   - PWA implementation
   - Service workers
   - Local sync when online

## Technology Stack

```
Frontend:        Next.js 16.2.2, React 19, TypeScript
Styling:         Tailwind CSS 3
State Mgmt:      Zustand 4 + localStorage + Supabase sync
Database:        Supabase (PostgreSQL)
Authentication:  Supabase Auth (email/password, OAuth)
API:             Next.js Route Handlers
Deployment:      Ready for Vercel/self-hosted
```

## File Structure (Key Files)

```
src/
├── app/
│   ├── login/page.tsx                # Auth screen (FIXED)
│   ├── (app)/                        # Protected routes
│   ├── api/                          # REST endpoints
│   │   ├── cards/route.ts            # Card CRUD + rate limiting
│   │   ├── progress/route.ts         # Progress CRUD + rate limiting
│   │   └── export/route.ts           # Export endpoint + rate limiting
│   └── auth/callback/route.ts        # OAuth callback handler
│
├── store/
│   ├── authStore.ts                  # Auth state (FIXED)
│   ├── srsStore.ts                   # SRS cards state
│   ├── progressStore.ts              # Progress state
│   ├── learningStore.ts              # Learning state
│   └── userPreferencesStore.ts       # Preferences state
│
├── lib/
│   ├── supabase-browser.ts           # Client-side Supabase
│   ├── supabase-server.ts            # Server-side Supabase
│   ├── database.ts                   # Database operations
│   ├── importExport.ts               # CSV/JSON handling
│   └── rateLimiter.ts                # API rate limiting (NEW)
│
├── components/
│   ├── AuthGuard.tsx                 # Auth wrapper
│   ├── Sidebar.tsx                   # Navigation
│   └── ...
│
├── hooks/
│   ├── useInitializeStores.ts        # Auto-loading
│   └── useSyncStores.ts              # Periodic sync

docs/
├── API.md                             # API documentation
├── INTEGRATION.md                     # Integration guide
├── OAUTH_SETUP.md                     # OAuth setup guide (NEW)
└── ANKI_APKG_PARSER.md               # APKG parser design (NEW)
```

## Testing Checklist

### Authentication ✅
- [x] App builds without errors
- [x] TypeScript compiles successfully
- [x] Auth store initializes correctly
- [x] Form inputs enable after initialization
- [ ] Email/password login works end-to-end
- [ ] Registration creates profile correctly
- [ ] OAuth redirects properly configured

### API & Rate Limiting ✅
- [x] Rate limiter utility works
- [x] Rate limits applied to all endpoints
- [x] X-RateLimit headers present
- [x] Card import limited to 500
- [ ] Rate limiting triggers at configured limits
- [ ] Cleanup task runs without errors

### Import/Export
- [x] CSV parser implemented
- [x] JSON import/export works
- [x] Anki APKG parser implemented (jszip + sql.js)
- [x] HTML/LaTeX stripping from Anki card fields
- [x] Auto card-type inference (kana / vocab / grammar)
- [x] Server-side APKG import API route (/api/import-anki)
- [ ] Large file handling tested (>10 MB decks)
- [ ] Unicode/Japanese characters preserved (needs end-to-end test)

## Next Immediate Steps

1. **OAuth Setup** (Manual step required)
   - Configure Google & GitHub in Supabase
   - Test OAuth flow end-to-end
   - Commit changes if successful

2. **Auth Flow Testing** 
   - Test email/password login
   - Test registration
   - Verify profile creation
   - Test logout

3. **Rate Limiting Verification**
   - Confirm limits trigger correctly
   - Verify cleanup task runs
   - Check header values in responses

4. **Documentation**
   - Update API.md with rate limit info
   - Create troubleshooting guide
   - Add usage examples

## Deployment Checklist

Before production:
- [ ] OAuth providers fully configured and tested
- [ ] All auth flows tested end-to-end
- [ ] Rate limiting verified and appropriate
- [ ] Error messages user-friendly
- [ ] CORS properly configured for API
- [ ] Security headers set correctly
- [ ] Database backups configured
- [ ] Monitoring & logging in place
- [ ] Load testing performed
- [ ] Security audit completed

## Recent Commits

1. **Fix auth form state management** - Ensures form becomes interactive after auth check
2. **Add API rate limiting** - Prevents abuse of REST API endpoints
3. **Implement Anki APKG import parser** - Browser-native parser using jszip + sql.js; full UI integration

## How to Continue

### To test locally:
```bash
npm run build    # Verify no errors
npm run dev      # Start dev server at :3000
# Navigate to http://localhost:3000/login
```

### To commit changes:
```bash
git add .
git commit -m "Your message here"
git push origin main
```

### To configure OAuth:
See `OAUTH_SETUP.md` for detailed instructions

---

**Last Updated:** April 4, 2026
**Status:** Core features complete + Anki APKG import done; OAuth + testing pending
**Next Session Goal:** Setup OAuth providers, test complete auth flow, test APKG import with real deck
