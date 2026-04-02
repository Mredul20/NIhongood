import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { db } from '@/lib/database';
import { checkRateLimit } from '@/lib/rateLimiter';

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

    // Check rate limit: 100 requests per minute for GET
    const limit = checkRateLimit(session.user.id, '/api/progress', {
      windowMs: 60 * 1000,
      maxRequests: 100,
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
            'X-RateLimit-Limit': '100',
            'X-RateLimit-Remaining': limit.remaining.toString(),
            'X-RateLimit-Reset': new Date(limit.resetAt).toISOString(),
          },
        }
      );
    }

    const [progress, dailyLogs, reviewHistory] = await Promise.all([
      db.getProgress(session.user.id),
      db.getDailyLogs(session.user.id, 365), // Last year
      db.getReviewHistory(session.user.id, 365),
    ]);

    return NextResponse.json(
      {
        progress,
        dailyLogs,
        reviewHistory,
      },
      {
        headers: {
          'X-RateLimit-Limit': '100',
          'X-RateLimit-Remaining': (limit.remaining - 1).toString(),
          'X-RateLimit-Reset': new Date(limit.resetAt).toISOString(),
        },
      }
    );
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

    // Check rate limit: 30 requests per minute for PUT (write operations)
    const limit = checkRateLimit(session.user.id, '/api/progress/PUT', {
      windowMs: 60 * 1000,
      maxRequests: 30,
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
            'X-RateLimit-Limit': '30',
            'X-RateLimit-Remaining': limit.remaining.toString(),
            'X-RateLimit-Reset': new Date(limit.resetAt).toISOString(),
          },
        }
      );
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

    return NextResponse.json(
      {
        message: 'Progress updated successfully',
        progress: updated,
      },
      {
        headers: {
          'X-RateLimit-Limit': '30',
          'X-RateLimit-Remaining': (limit.remaining - 1).toString(),
          'X-RateLimit-Reset': new Date(limit.resetAt).toISOString(),
        },
      }
    );
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
