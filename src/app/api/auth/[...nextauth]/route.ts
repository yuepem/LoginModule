import NextAuth, { NextAuthOptions } from "next-auth";
import google from "next-auth/providers/google";

// session interface
export interface Session {
  user: {
    name: string | null;
    email: string | null;
  };
}

export const authOptions: NextAuthOptions = {
    providers: [
      google({
        clientId: process.env.GOOGLE_CLIENT_ID || '',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      }),
    ],
    callbacks: {
      async session({ session, token }) {
        if (session.user) {
          session.user.name = token.name || null;
          session.user.email = token.email || null;
        }
        return session;
      },
    },
  };
  
  const handler = NextAuth(authOptions);
  
  export { handler as GET, handler as POST };
