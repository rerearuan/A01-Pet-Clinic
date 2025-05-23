import { DefaultSession, User as NextAuthUser } from 'next-auth';
import { JWT as NextAuthJWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      role: string;
    } & DefaultSession['user'];
  }

  interface User extends NextAuthUser {
    role: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends NextAuthJWT {
    role?: string;
  }
}