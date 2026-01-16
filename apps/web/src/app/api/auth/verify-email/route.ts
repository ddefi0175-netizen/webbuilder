import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyEmailSchema } from '@/lib/validation';
import { ValidationError, NotFoundError, handleApiError, getErrorStatus } from '@/lib/errors';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const validationResult = verifyEmailSchema.safeParse(body);

        if (!validationResult.success) {
            throw new ValidationError('Validation failed', validationResult.error.flatten());
        }

        const { token } = validationResult.data;

        // Find verification token
        const verificationToken = await db.verificationToken.findUnique({
            where: { token },
        });

        if (!verificationToken) {
            throw new NotFoundError('Invalid or expired verification token');
        }

        // Check if token is expired
        if (verificationToken.expires < new Date()) {
            await db.verificationToken.delete({
                where: { token },
            });
            throw new ValidationError('Verification token has expired');
        }

        // Update user's emailVerified field
        const user = await db.user.update({
            where: { email: verificationToken.identifier },
            data: { emailVerified: new Date() },
        });

        // Delete the verification token
        await db.verificationToken.delete({
            where: { token },
        });

        return NextResponse.json({
            success: true,
            message: 'Email verified successfully',
            user: {
                id: user.id,
                email: user.email,
                emailVerified: user.emailVerified,
            },
        });
    } catch (error) {
        const status = getErrorStatus(error);
        const errorResponse = handleApiError(error);
        return NextResponse.json(errorResponse, { status });
    }
}
