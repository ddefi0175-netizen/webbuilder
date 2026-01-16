import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession, requireAuth } from '@/lib/auth';
import { handleApiError, getErrorStatus } from '@/lib/errors';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

// GET - Get user usage statistics
export async function GET(req: NextRequest) {
    try {
        const session = await getSession();
        await requireAuth(session);

        const userId = session!.user.id;

        // Get subscription details
        const subscription = await db.subscription.findUnique({
            where: { userId },
        });

        // Get usage for current month
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const monthlyUsage = await db.usage.findMany({
            where: {
                userId,
                createdAt: {
                    gte: startOfMonth,
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        // Aggregate usage by type
        const usageByType = monthlyUsage.reduce((acc: Record<string, number>, usage: any) => {
            acc[usage.type] = (acc[usage.type] || 0) + usage.amount;
            return acc;
        }, {});

        // Get total usage count
        const totalUsage = await db.usage.count({
            where: { userId },
        });

        return NextResponse.json({
            success: true,
            subscription: {
                tier: subscription?.tier || 'FREE',
                status: subscription?.status || 'ACTIVE',
                creditsRemaining: subscription?.creditsRemaining || 0,
                creditsTotal: subscription?.creditsTotal || 0,
            },
            usage: {
                monthly: usageByType,
                total: totalUsage,
                recentActivity: monthlyUsage.slice(0, 10), // Last 10 activities
            },
        });
    } catch (error) {
        const status = getErrorStatus(error);
        const errorResponse = handleApiError(error);
        return NextResponse.json(errorResponse, { status });
    }
}
