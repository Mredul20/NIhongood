import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { db } from '@/lib/database';

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

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') as 'kana' | 'vocab' | 'grammar' | null;
    const limit = Math.min(parseInt(searchParams.get('limit') || '100'), 1000);
    const offset = parseInt(searchParams.get('offset') || '0');

    const cards = await db.getSRSCards(session.user.id);

    // Filter by type if specified
    let filtered = cards;
    if (type) {
      filtered = cards.filter((c) => c.type === type);
    }

    // Apply pagination
    const paginated = filtered.slice(offset, offset + limit);

    return NextResponse.json({
      cards: paginated,
      total: filtered.length,
      limit,
      offset,
    });
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

    const body = await request.json();
    const cards = Array.isArray(body) ? body : body.cards;

    if (!Array.isArray(cards)) {
      return NextResponse.json(
        { error: 'Invalid request: expected array of cards or { cards: [...] }' },
        { status: 400 }
      );
    }

    const cardsToInsert = cards.map((card, index) => ({
      id: `api-${Date.now()}-${index}`,
      front: card.front,
      back: card.back,
      reading: card.reading,
      type: card.type || 'vocab',
    }));

    // Bulk insert to database
    const result = await db.bulkUpsertSRSCards(session.user.id, cardsToInsert);

    if (result.error) {
      return NextResponse.json(
        { error: `Database error: ${result.error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: `Successfully imported ${cardsToInsert.length} cards`,
      imported: cardsToInsert.length,
      cards: result.data,
    });
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
