import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { db } from '@/lib/database';

/**
 * GET /api/progress - Get user's progress data
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [progress, dailyLogs, reviewHistory] = await Promise.all([
      db.getProgress(session.user.id),
      db.getDailyLogs(session.user.id, 365), // Last year
      db.getReviewHistory(session.user.id, 365),
    ]);

    return NextResponse.json({
      progress,
      dailyLogs,
      reviewHistory,
    });
  } catch (error) {
    console.error('Error fetching progress:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/progress - Update progress data
 */
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    const { error } = await db.updateProgress(session.user.id, body);

    if (error) {
      return NextResponse.json(
        { error: `Update error: ${error.message}` },
        { status: 500 }
      );
    }

    const updated = await db.getProgress(session.user.id);

    return NextResponse.json({
      message: 'Progress updated successfully',
      progress: updated,
    });
  } catch (error) {
    console.error('Error updating progress:', error);
    return NextResponse.json(
      {
        error: `Update error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      },
      { status: 400 }
    );
  }
}
