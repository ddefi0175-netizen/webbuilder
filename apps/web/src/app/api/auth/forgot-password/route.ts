import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { generateToken } from '@/lib/auth';
import { forgotPasswordSchema } from '@/lib/validation';
import { ValidationError, NotFoundError, handleApiError, getErrorStatus } from '@/lib/errors';
import { checkRateLimit, getRateLimitIdentifier } from '@/lib/rate-limit';
import { sendEmail, getPasswordResetEmailHtml } from '@/lib/email';

export async function POST(req: NextRequest) {
    try {
        // Rate limit password reset requests
        const identifier = getRateLimitIdentifier(req);
        await checkRateLimit(identifier, 'auth');

        const body = await req.json();
        const validationResult = forgotPasswordSchema.safeParse(body);

        if (!validationResult.success) {
            throw new ValidationError('Validation failed', validationResult.error.flatten());
        }

        const { email } = validationResult.data;

        // Find user
        const user = await db.user.findUnique({
            where: { email },
        });

        // Don't reveal if user exists or not (security best practice)
        if (!user) {
            return NextResponse.json({
                success: true,
                message: 'If an account exists with this email, a password reset link has been sent.',
            });
        }

        // Create password reset token
        const resetToken = generateToken();
        const expires = new Date();
        expires.setHours(expires.getHours() + 1); // Token expires in 1 hour

        await db.passwordReset.create({
            data: {
                email,
                token: resetToken,
                expires,
            },
        });

        // Send password reset email
        const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/reset-password?token=${resetToken}`;
        try {
            await sendEmail({
                to: email,
                subject: 'Reset your WebBuilder password',
                html: getPasswordResetEmailHtml(resetUrl, user.name || undefined),
            });
        } catch (emailError) {
            console.error('Failed to send password reset email:', emailError);
            // Don't reveal if email failed for security reasons
        }

        return NextResponse.json({
            success: true,
            message: 'If an account exists with this email, a password reset link has been sent.',
        });
    } catch (error) {
        const status = getErrorStatus(error);
        const errorResponse = handleApiError(error);
        return NextResponse.json(errorResponse, { status });
    }
}
