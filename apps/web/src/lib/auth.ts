import { NextAuthConfig } from 'next-auth';
import type { Session, User } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { db } from './db';
import bcrypt from 'bcrypt';
import { UnauthorizedError } from './errors';
import NextAuth from 'next-auth';

export const authOptions: NextAuthConfig = {
    adapter: PrismaAdapter(db),
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    pages: {
        signIn: '/auth/login',
        signOut: '/auth/login',
        error: '/auth/login',
        verifyRequest: '/auth/verify-email',
        newUser: '/dashboard',
    },
    providers: [
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Email and password are required');
                }

                const user = await db.user.findUnique({
                    where: { email: credentials.email },
                    include: {
                        subscription: true,
                    },
                });

                if (!user || !user.password) {
                    throw new Error('Invalid email or password');
                }

                const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

                if (!isPasswordValid) {
                    throw new Error('Invalid email or password');
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    avatar: user.avatar,
                    role: user.role,
                    emailVerified: user.emailVerified,
                };
            },
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
            allowDangerousEmailAccountLinking: true,
        }),
        GitHubProvider({
            clientId: process.env.GITHUB_ID || '',
            clientSecret: process.env.GITHUB_SECRET || '',
            allowDangerousEmailAccountLinking: true,
        }),
    ],
    callbacks: {
        async jwt({ token, user, account, trigger, session }: {
            token: JWT;
            user?: User;
            account?: any;
            trigger?: 'signIn' | 'signUp' | 'update';
            session?: any;
        }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
                token.emailVerified = user.emailVerified;
            }

            // Update token if session is updated
            if (trigger === 'update' && session) {
                return { ...token, ...session };
            }

            return token;
        },
        async session({ session, token }: { session: Session; token: JWT }) {
            if (token && session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as string;
                session.user.emailVerified = token.emailVerified as Date | null;
            }
            return session;
        },
        async signIn({ user, account, profile }: { user: User; account: any; profile?: any }) {
            // For OAuth providers, ensure email is verified
            if (account?.provider === 'google' || account?.provider === 'github') {
                if (user.email) {
                    await db.user.update({
                        where: { email: user.email },
                        data: { emailVerified: new Date() },
                    });
                }
            }
            return true;
        },
    },
    events: {
        async createUser({ user }: { user: User }) {
            // Create default subscription for new users
            await db.subscription.create({
                data: {
                    userId: user.id,
                    tier: 'FREE',
                    status: 'ACTIVE',
                    creditsRemaining: 100, // Free tier gets 100 credits
                    creditsTotal: 100,
                },
            });
        },
    },
    debug: process.env.NODE_ENV === 'development',
};

// Export the auth function for use in server components and API routes
export const { auth } = NextAuth(authOptions);

/**
 * Get current user session (for use in API routes)
 */
export async function getSession(): Promise<Session | null> {
    return await auth();
}

/**
 * Require authentication for a request
 * Throws UnauthorizedError if not authenticated
 */
export async function requireAuth(session: Session | null): Promise<Session> {
    if (!session?.user) {
        throw new UnauthorizedError('You must be logged in to access this resource');
    }
    return session;
}

/**
 * Hash password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
}

/**
 * Verify password using bcrypt
 */
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
}

/**
 * Generate a random token for email verification or password reset
 */
export function generateToken(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

/**
 * Check if user has verified their email
 */
export function isEmailVerified(user: User): boolean {
    return !!user.emailVerified;
}

/**
 * Check if user is admin
 */
export function isAdmin(user: User): boolean {
    return user.role === 'ADMIN';
}
