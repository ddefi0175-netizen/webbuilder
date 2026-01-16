import { DefaultSession, DefaultUser } from 'next-auth';
import { JWT as DefaultJWT } from 'next-auth/jwt';

declare module 'next-auth' {
    interface Session {
        user: {
            id: string;
            role: string;
            emailVerified: Date | null;
        } & DefaultSession['user'];
    }

    interface User extends DefaultUser {
        role: string;
        emailVerified: Date | null;
    }
}

declare module 'next-auth/jwt' {
    interface JWT extends DefaultJWT {
        id: string;
        role: string;
        emailVerified: Date | null;
    }
}
