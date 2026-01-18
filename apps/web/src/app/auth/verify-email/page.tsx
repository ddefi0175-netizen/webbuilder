'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, AlertCircle, Loader } from 'lucide-react';

export default function VerifyEmailPage() {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('Verifying your email...');

    useEffect(() => {
        if (!token) {
            setStatus('error');
            setMessage('No verification token provided. Please check your email link.');
            return;
        }

        const verifyEmail = async () => {
            try {
                const response = await fetch(`/api/auth/verify-email?token=${token}`, {
                    method: 'GET',
                });

                const data = await response.json();

                if (response.ok) {
                    setStatus('success');
                    setMessage('Email verified successfully! You can now log in to your account.');
                } else {
                    setStatus('error');
                    setMessage(data.message || 'Failed to verify email. Please try again.');
                }
            } catch (error) {
                setStatus('error');
                setMessage('An error occurred while verifying your email. Please try again.');
                console.error('Verification error:', error);
            }
        };

        verifyEmail();
    }, [token]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-slate-800 rounded-lg shadow-xl p-8 border border-slate-700">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-white mb-2">Email Verification</h1>
                        <p className="text-slate-400">Verify your email address to activate your account</p>
                    </div>

                    {/* Status Content */}
                    <div className="text-center">
                        {status === 'loading' && (
                            <>
                                <div className="flex justify-center mb-6">
                                    <Loader className="w-12 h-12 text-blue-500 animate-spin" />
                                </div>
                                <h2 className="text-xl font-semibold text-white mb-2">Verifying...</h2>
                                <p className="text-slate-400">{message}</p>
                            </>
                        )}

                        {status === 'success' && (
                            <>
                                <div className="flex justify-center mb-6">
                                    <CheckCircle className="w-12 h-12 text-green-500" />
                                </div>
                                <h2 className="text-xl font-semibold text-white mb-2">Verification Successful!</h2>
                                <p className="text-slate-400 mb-6">{message}</p>
                                <Link
                                    href="/auth/login"
                                    className="inline-block px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                                >
                                    Go to Login
                                </Link>
                            </>
                        )}

                        {status === 'error' && (
                            <>
                                <div className="flex justify-center mb-6">
                                    <AlertCircle className="w-12 h-12 text-red-500" />
                                </div>
                                <h2 className="text-xl font-semibold text-white mb-2">Verification Failed</h2>
                                <p className="text-slate-400 mb-6">{message}</p>
                                <div className="space-y-3">
                                    <p className="text-sm text-slate-400">
                                        {token
                                            ? 'The verification link may have expired. Please request a new verification email.'
                                            : 'Please use the verification link from your email.'}
                                    </p>
                                    <Link
                                        href="/auth/register"
                                        className="inline-block px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                                    >
                                        Back to Register
                                    </Link>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="mt-8 pt-8 border-t border-slate-700 text-center">
                        <p className="text-slate-400 text-sm">
                            Already verified?{' '}
                            <Link href="/auth/login" className="text-blue-500 hover:text-blue-400 font-semibold">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
