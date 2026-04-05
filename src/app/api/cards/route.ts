import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { db } from '@/lib/database';
import { checkRateLimit } from '@/lib/rateLimiter';

/**
 * GET /api/cards - List user's SRS cards (with optional filtering)
 * Query params:
 *   - type: kana | vocab | grammar (filter by type)
 *   - limit: number (default 100, max 1000)
 *   - offset: number (for pagination)
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check rate limit: 60 requests per minute per user
    const limit = checkRateLimit(session.user.id, '/api/cards', {
      windowMs: 60 * 1000,
      maxRequests: 60,
    });

    if (limit.isLimited) {
      return NextResponse.json(
        {
          error: 'Too many requests. Please try again later.',
          retryAfter: Math.ceil((limit.resetAt - Date.now()) / 1000),
        },
        {
          status: 429,
          headers: {
            'Retry-After': Math.ceil((limit.resetAt - Date.now()) / 1000).toString(),
            'X-RateLimit-Limit': '60',
            'X-RateLimit-Remaining': limit.remaining.toString(),
            'X-RateLimit-Reset': new Date(limit.resetAt).toISOString(),
          },
        }
      );
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') as 'kana' | 'vocab' | 'grammar' | null;
    const limit_param = Math.min(parseInt(searchParams.get('limit') || '100'), 1000);
    const offset = parseInt(searchParams.get('offset') || '0');

    const cards = await db.getSRSCards(session.user.id);

    // Filter by type if specified
    let filtered = cards;
    if (type) {
      filtered = cards.filter((c) => c.type === type);
    }

    // Apply pagination
    const paginated = filtered.slice(offset, offset + limit_param);

    return NextResponse.json(
      {
        cards: paginated,
        total: filtered.length,
        limit: limit_param,
        offset,
      },
      {
        headers: {
          'X-RateLimit-Limit': '60',
          'X-RateLimit-Remaining': limit.remaining.toString(),
          'X-RateLimit-Reset': new Date(limit.resetAt).toISOString(),
        },
      }
    );
  } catch (error) {
    console.error('Error fetching cards:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/cards - Import cards
 * Body: { cards: Array<{ front, back, reading?, type, tags? }> }
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check rate limit: 20 requests per minute for POST (more restrictive)
    const limit = checkRateLimit(session.user.id, '/api/cards/POST', {
      windowMs: 60 * 1000,
      maxRequests: 20,
    });

    if (limit.isLimited) {
      return NextResponse.json(
        {
          error: 'Too many requests. Please try again later.',
          retryAfter: Math.ceil((limit.resetAt - Date.now()) / 1000),
        },
        {
          status: 429,
          headers: {
            'Retry-After': Math.ceil((limit.resetAt - Date.now()) / 1000).toString(),
            'X-RateLimit-Limit': '20',
            'X-RateLimit-Remaining': limit.remaining.toString(),
            'X-RateLimit-Reset': new Date(limit.resetAt).toISOString(),
          },
        }
      );
    }

    const body = await request.json();
    const cards = Array.isArray(body) ? body : body.cards;

    if (!Array.isArray(cards)) {
      return NextResponse.json(
        { error: 'Invalid request: expected array of cards or { cards: [...] }' },
        { status: 400 }
      );
    }

    // Limit to 500 cards per import to prevent abuse
    if (cards.length > 500) {
      return NextResponse.json(
        { error: 'Too many cards. Maximum 500 cards per request.' },
        { status: 400 }
      );
    }

    // Validate each card has required fields
    const validationErrors: string[] = [];
    cards.forEach((card: Record<string, unknown>, index: number) => {
      if (!card.front || typeof card.front !== 'string' || !card.front.trim()) {
        validationErrors.push(`Card ${index + 1}: missing or empty "front" field`);
      }
      if (!card.back || typeof card.back !== 'string' || !card.back.trim()) {
        validationErrors.push(`Card ${index + 1}: missing or empty "back" field`);
      }
      if (card.type && !['kana', 'vocab', 'grammar'].includes(card.type as string)) {
        validationErrors.push(`Card ${index + 1}: "type" must be kana, vocab, or grammar`);
      }
    });

    if (validationErrors.length > 0) {
      return NextResponse.json(
        { error: 'Validation failed', details: validationErrors.slice(0, 10) },
        { status: 400 }
      );
    }

    const cardsToInsert = cards.map((card: Record<string, unknown>, index: number) => ({
      id: `api-${Date.now()}-${index}`,
      front: (card.front as string).trim(),
      back: (card.back as string).trim(),
      reading: card.reading as string | undefined,
      type: (card.type as string) || 'vocab',
    }));

    // Bulk insert to database
    const result = await db.bulkUpsertSRSCards(session.user.id, cardsToInsert);

    if (result.error) {
      return NextResponse.json(
        { error: `Database error: ${result.error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: `Successfully imported ${cardsToInsert.length} cards`,
        imported: cardsToInsert.length,
        cards: result.data,
      },
      {
        headers: {
          'X-RateLimit-Limit': '20',
          'X-RateLimit-Remaining': limit.remaining.toString(),
          'X-RateLimit-Reset': new Date(limit.resetAt).toISOString(),
        },
      }
    );
  } catch (error) {
    console.error('Error importing cards:', error);
    return NextResponse.json(
      {
        error: `Import error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      },
      { status: 400 }
    );
  }
}
