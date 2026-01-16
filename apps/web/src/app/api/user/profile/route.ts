import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession, requireAuth } from '@/lib/auth';
import { updateProfileSchema } from '@/lib/validation';
import { ValidationError, handleApiError, getErrorStatus } from '@/lib/errors';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

// GET - Get user profile
export async function GET(req: NextRequest) {
    try {
        const session = await getSession();
        await requireAuth(session);

        const user = await db.user.findUnique({
            where: { id: session!.user.id },
            select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
                role: true,
                emailVerified: true,
                createdAt: true,
                updatedAt: true,
                subscription: {
                    select: {
                        tier: true,
                        status: true,
                        creditsRemaining: true,
                        creditsTotal: true,
                    },
                },
            },
        });

        return NextResponse.json({
            success: true,
            user,
        });
    } catch (error) {
        const status = getErrorStatus(error);
        const errorResponse = handleApiError(error);
        return NextResponse.json(errorResponse, { status });
    }
}

// PATCH - Update user profile
export async function PATCH(req: NextRequest) {
    try {
        const session = await getSession();
        await requireAuth(session);

        const body = await req.json();
        const validationResult = updateProfileSchema.safeParse(body);

        if (!validationResult.success) {
            throw new ValidationError('Validation failed', validationResult.error.flatten());
        }

        const updatedUser = await db.user.update({
            where: { id: session!.user.id },
            data: validationResult.data,
            select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
                role: true,
                emailVerified: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        return NextResponse.json({
            success: true,
            message: 'Profile updated successfully',
            user: updatedUser,
        });
    } catch (error) {
        const status = getErrorStatus(error);
        const errorResponse = handleApiError(error);
        return NextResponse.json(errorResponse, { status });
    }
}
