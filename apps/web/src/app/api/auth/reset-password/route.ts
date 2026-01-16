import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword } from '@/lib/auth';
import { resetPasswordSchema } from '@/lib/validation';
import { ValidationError, NotFoundError, handleApiError, getErrorStatus } from '@/lib/errors';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const validationResult = resetPasswordSchema.safeParse(body);

        if (!validationResult.success) {
            throw new ValidationError('Validation failed', validationResult.error.flatten());
        }

        const { token, password } = validationResult.data;

        // Find password reset token
        const resetToken = await db.passwordReset.findUnique({
            where: { token },
        });

        if (!resetToken) {
            throw new NotFoundError('Invalid or expired password reset token');
        }

        // Check if token is expired
        if (resetToken.expires < new Date()) {
            await db.passwordReset.delete({
                where: { token },
            });
            throw new ValidationError('Password reset token has expired');
        }

        // Check if token has already been used
        if (resetToken.used) {
            throw new ValidationError('Password reset token has already been used');
        }

        // Hash new password
        const hashedPassword = await hashPassword(password);

        // Update user's password
        await db.user.update({
            where: { email: resetToken.email },
            data: { password: hashedPassword },
        });

        // Mark token as used
        await db.passwordReset.update({
            where: { token },
            data: { used: true },
        });

        return NextResponse.json({
            success: true,
            message: 'Password reset successful. You can now login with your new password.',
        });
    } catch (error) {
        const status = getErrorStatus(error);
        const errorResponse = handleApiError(error);
        return NextResponse.json(errorResponse, { status });
    }
}
