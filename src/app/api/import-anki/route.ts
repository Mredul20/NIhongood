import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { db } from '@/lib/database';
import { checkRateLimit } from '@/lib/rateLimiter';
import { parseAnkiAPKG } from '@/lib/ankiParser';

/**
 * POST /api/import-anki
 *
 * Accepts a multipart/form-data request with an "apkg" file field.
 * Parses the Anki deck and bulk-imports cards into the user's account.
 *
 * Rate limit: 5 requests per minute (APKG parsing is CPU-intensive).
 * Max file size enforced by Next.js (default 4 MB) – callers should
 * chunk large decks or use the client-side parser for bigger files.
 */
export async function POST(request: NextRequest) {
  try {
    // ── Auth ──────────────────────────────────────────────────────────────
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // ── Rate limit ────────────────────────────────────────────────────────
    const limit = checkRateLimit(session.user.id, '/api/import-anki', {
      windowMs:    60 * 1000,
      maxRequests: 5,
    });

    const rateLimitHeaders = {
      'X-RateLimit-Limit':     '5',
      'X-RateLimit-Remaining': Math.max(0, limit.remaining - 1).toString(),
      'X-RateLimit-Reset':     new Date(limit.resetAt).toISOString(),
    };

    if (limit.isLimited) {
      return NextResponse.json(
        {
          error:      'Too many requests. Please wait before importing again.',
          retryAfter: Math.ceil((limit.resetAt - Date.now()) / 1000),
        },
        {
          status:  429,
          headers: {
            ...rateLimitHeaders,
            'Retry-After': Math.ceil((limit.resetAt - Date.now()) / 1000).toString(),
          },
        }
      );
    }

    // ── Read file from multipart body ─────────────────────────────────────
    let formData: FormData;
    try {
      formData = await request.formData();
    } catch {
      return NextResponse.json(
        { error: 'Request must be multipart/form-data' },
        { status: 400, headers: rateLimitHeaders }
      );
    }

    const apkgFile = formData.get('apkg');
    if (!apkgFile || !(apkgFile instanceof Blob)) {
      return NextResponse.json(
        { error: 'Missing "apkg" file field in form data' },
        { status: 400, headers: rateLimitHeaders }
      );
    }

    // 50 MB hard cap on the server side
    const MAX_BYTES = 50 * 1024 * 1024;
    if (apkgFile.size > MAX_BYTES) {
      return NextResponse.json(
        { error: 'File too large. Maximum allowed size is 50 MB.' },
        { status: 413, headers: rateLimitHeaders }
      );
    }

    // ── Parse APKG ────────────────────────────────────────────────────────
    const buffer   = await apkgFile.arrayBuffer();
    const filename = apkgFile instanceof File ? apkgFile.name : 'deck.apkg';
    const deckName = filename.replace(/\.apkg$/i, '');

    const parseResult = await parseAnkiAPKG(buffer, deckName);

    if (!parseResult.success && parseResult.cardsImported === 0) {
      return NextResponse.json(
        {
          error:    'Failed to parse APKG file',
          details:  parseResult.errors,
          warnings: parseResult.warnings,
        },
        { status: 422, headers: rateLimitHeaders }
      );
    }

    // ── Limit to 500 cards per request ────────────────────────────────────
    const cards = parseResult.importedCards.slice(0, 500);
    if (parseResult.importedCards.length > 500) {
      parseResult.warnings.push(
        `Only the first 500 of ${parseResult.importedCards.length} cards were imported. ` +
        'Split your deck into smaller files to import the rest.'
      );
    }

    // ── Bulk insert to database ───────────────────────────────────────────
    const cardsToInsert = cards.map((card, idx) => ({
      id:      card.id ?? `anki-${Date.now()}-${idx}`,
      front:   card.front,
      back:    card.back,
      reading: card.reading,
      type:    card.type,
    }));

    const dbResult = await db.bulkUpsertSRSCards(session.user.id, cardsToInsert);

    if (dbResult.error) {
      return NextResponse.json(
        { error: `Database error: ${dbResult.error.message}` },
        { status: 500, headers: rateLimitHeaders }
      );
    }

    return NextResponse.json(
      {
        message:         `Successfully imported ${cards.length} cards from ${deckName}`,
        imported:        cards.length,
        skipped:         parseResult.cardsSkipped,
        warnings:        parseResult.warnings,
        errors:          parseResult.errors,
      },
      { status: 200, headers: rateLimitHeaders }
    );
  } catch (error) {
    console.error('[import-anki] Unexpected error:', error);
    return NextResponse.json(
      { error: `Unexpected error: ${error instanceof Error ? error.message : 'unknown'}` },
      { status: 500 }
    );
  }
}
