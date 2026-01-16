import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword, generateToken } from '@/lib/auth';
import { registerSchema } from '@/lib/validation';
import { ValidationError, handleApiError, getErrorStatus } from '@/lib/errors';
import { checkRateLimit, getRateLimitIdentifier } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
    try {
        // Rate limit registration attempts
        const identifier = getRateLimitIdentifier(req);
        await checkRateLimit(identifier, 'auth');

        // Parse and validate request body
        const body = await req.json();
        const validationResult = registerSchema.safeParse(body);

        if (!validationResult.success) {
            throw new ValidationError('Validation failed', validationResult.error.flatten());
        }

        const { email, password, name } = validationResult.data;

        // Check if user already exists
        const existingUser = await db.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            throw new ValidationError('User with this email already exists');
        }

        // Hash password
        const hashedPassword = await hashPassword(password);

        // Create user
        const user = await db.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
            },
        });

        // Create verification token
        const verificationToken = generateToken();
        const expires = new Date();
        expires.setHours(expires.getHours() + 24); // Token expires in 24 hours

        await db.verificationToken.create({
            data: {
                identifier: email,
                token: verificationToken,
                expires,
            },
        });

        // Create default subscription
        await db.subscription.create({
            data: {
                userId: user.id,
                tier: 'FREE',
                status: 'ACTIVE',
                creditsRemaining: 100,
                creditsTotal: 100,
            },
        });

        // TODO: Send verification email
        // For now, we'll just return success
        console.log(`Verification token for ${email}: ${verificationToken}`);
        console.log(`Verification URL: ${process.env.NEXT_PUBLIC_APP_URL}/auth/verify-email?token=${verificationToken}`);

        return NextResponse.json(
            {
                success: true,
                message: 'Registration successful. Please check your email to verify your account.',
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                },
            },
            { status: 201 }
        );
    } catch (error) {
        const status = getErrorStatus(error);
        const errorResponse = handleApiError(error);
        return NextResponse.json(errorResponse, { status });
    }
}
