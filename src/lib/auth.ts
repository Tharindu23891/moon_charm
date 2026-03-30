import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import { connectToDatabase } from '@/lib/mongoose';
import { User } from '@/models/User';
import { hashPassword, verifyPassword } from '@/lib/password';

const credentialsSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});

export const authOptions: NextAuthOptions = {
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login',
  },
  providers: [
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) return null;

        await connectToDatabase();

        const user = await User.findOne({ email: parsed.data.email }).lean();
        if (!user) return null;

        const ok = await verifyPassword(parsed.data.password, user.passwordHash);
        if (!ok) return null;

        return {
          id: user._id.toString(),
          name: user.name || user.email,
          email: user.email,
          role: user.role,
        } as any;
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== 'google') return true;

      const email = user.email;
      if (!email) return false;

      await connectToDatabase();

      const existing = await User.findOne({ email }).lean();
      if (!existing) {
        const passwordHash = await hashPassword(randomUUID());
        await User.create({
          email,
          name: user.name ?? email,
          passwordHash,
          role: 'user',
        });
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        const userWithRole = user as any;
        if (userWithRole.role) token.role = userWithRole.role;
        if (userWithRole.id) token.sub = userWithRole.id;
      }

      // For Google OAuth (JWT strategy, no adapter), ensure token.sub maps to our Mongo user id
      if (token.email && (!token.sub || !(token as any).role)) {
        await connectToDatabase();
        const dbUser = await User.findOne({ email: token.email }).lean();
        if (dbUser) {
          token.sub = dbUser._id.toString();
          token.role = dbUser.role as any;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.sub;
        (session.user as any).role = (token as any).role;
      }
      return session;
    },
  },
};
