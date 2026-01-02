import { AuthForm } from '@/components/auth/auth-form';

export default function ForgotPasswordPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20 p-4">
            <AuthForm mode="forgot-password" />
        </div>
    );
}
