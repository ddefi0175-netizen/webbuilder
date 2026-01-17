import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyEmailSchema } from '@/lib/validation';
import { ValidationError, NotFoundError, handleApiError, getErrorStatus } from '@/lib/errors';

export async function GET(req: NextRequest) {
    try {
        const token = req.nextUrl.searchParams.get('token');

        if (!token) {
            throw new ValidationError('Verification token is required');
        }

        // Find and validate verification token
        const verificationToken = await db.verificationToken.findUnique({
            where: { token },
        });

        if (!verificationToken) {
            throw new NotFoundError('Invalid verification token');
        }

        // Check if token has expired
        if (verificationToken.expires < new Date()) {
            await db.verificationToken.delete({
                where: { token },
            });
            throw new ValidationError('Verification token has expired. Please request a new verification email.');
        }

        // Find user and update emailVerified
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

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // Support both token-based verification and email-based resend
        const { token, email } = body;

        if (token) {
            // Verify token
            const validationResult = verifyEmailSchema.safeParse({ token });
            if (!validationResult.success) {
                throw new ValidationError('Validation failed', validationResult.error.flatten());
            }

            const verificationToken = await db.verificationToken.findUnique({
                where: { token },
            });

            if (!verificationToken) {
                throw new NotFoundError('Invalid or expired verification token');
            }

            if (verificationToken.expires < new Date()) {
                await db.verificationToken.delete({ where: { token } });
                throw new ValidationError('Verification token has expired');
            }

            const user = await db.user.update({
                where: { email: verificationToken.identifier },
                data: { emailVerified: new Date() },
            });

            await db.verificationToken.delete({ where: { token } });

            return NextResponse.json({
                success: true,
                message: 'Email verified successfully',
                user: {
                    id: user.id,
                    email: user.email,
                emailVerified: user.emailVerified,
            },
        });
        } else if (email) {
            // Resend verification token
            const user = await db.user.findUnique({ where: { email } });
            if (!user) {
                throw new NotFoundError('User not found');
            }

            if (user.emailVerified) {
                return NextResponse.json({
                    success: false,
                    message: 'Email is already verified',
                });
            }

            // Delete old tokens
            await db.verificationToken.deleteMany({ where: { identifier: email } });

            // Create new token
            const { generateToken } = await import('@/lib/auth');
            const newToken = generateToken();
            const expires = new Date();
            expires.setHours(expires.getHours() + 24);

            await db.verificationToken.create({
                data: { identifier: email, token: newToken, expires },
            });

            return NextResponse.json({
                success: true,
                message: 'Verification token has been sent',
                token: newToken, // In dev only
            });
        } else {
            throw new ValidationError('Either token or email is required');
        }
    } catch (error) {
        const status = getErrorStatus(error);
        const errorResponse = handleApiError(error);
        return NextResponse.json(errorResponse, { status });
    }
}
