import { AuthForm } from '@/components/auth/auth-form';

export default function RegisterPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20 p-4">
            <AuthForm mode="register" />
        </div>
    );
}
