import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { db } from '@/lib/database';

/**
 * GET /api/export - Export all user data
 * Query params:
 *   - format: json | csv (default: json)
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') as 'json' | 'csv' | null;

    // Fetch all user data
    const allData = await db.syncAllData(session.user.id);

    if (format === 'csv') {
      // Convert to CSV (simplified, just cards)
      if (!allData.cards || allData.cards.length === 0) {
        return NextResponse.json({ error: 'No cards to export' }, { status: 400 });
      }

      const header = ['Front', 'Back', 'Reading', 'Type', 'Interval', 'Ease Factor'].join(',');
      const rows = allData.cards.map((card) => [
        `"${card.front.replace(/"/g, '""')}"`,
        `"${card.back.replace(/"/g, '""')}"`,
        `"${(card.reading || '').replace(/"/g, '""')}"`,
        card.type,
        card.interval,
        card.ease_factor,
      ].join(','));

      const csv = [header, ...rows].join('\n');

      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="nihongood-export-${new Date().toISOString().split('T')[0]}.csv"`,
        },
      });
    }

    // Default to JSON
    const exportData = {
      exportedAt: new Date().toISOString(),
      version: '1.0',
      user: {
        id: session.user.id,
        email: session.user.email,
      },
      profile: allData.profile,
      progress: allData.progress,
      cards: allData.cards,
      learningProgress: allData.learning,
      preferences: allData.preferences,
      dailyLogs: allData.dailyLogs,
      reviewHistory: allData.reviewHistory,
    };

    return new NextResponse(JSON.stringify(exportData, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="nihongood-export-${new Date().toISOString().split('T')[0]}.json"`,
      },
    });
  } catch (error) {
    console.error('Error exporting data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
