import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import { connectToDatabase } from '@/lib/mongoose';
import { User } from '@/models/User';
import { hashPassword, verifyPassword } from '@/lib/password';
import { isAdminEmail } from '@/lib/admin-emails';

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

        const ok = await verifyPassword(
          parsed.data.password,
          user.passwordHash,
        );
        if (!ok) return null;

        // Allowlisted emails are always admins, even if their stored role is
        // still 'user' (e.g. they registered before being added). Keep the DB
        // in sync so the role is correct everywhere it's read.
        const role = isAdminEmail(user.email) ? 'admin' : user.role;
        if (role !== user.role) {
          await User.updateOne({ _id: user._id }, { role });
        }

        return {
          id: user._id.toString(),
          name: user.name || user.email,
          email: user.email,
          role,
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

      const existing = await User.findOne({ email });
      if (!existing) {
        const passwordHash = await hashPassword(randomUUID());
        await User.create({
          email,
          name: user.name ?? email,
          passwordHash,
          role: isAdminEmail(email) ? 'admin' : 'user',
        });
      } else if (isAdminEmail(email) && existing.role !== 'admin') {
        // Promote an allowlisted account that signed up earlier as a customer.
        existing.role = 'admin';
        await existing.save();
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

      // Final word: allowlisted emails are always admin, whatever the DB says.
      if (isAdminEmail(token.email)) {
        token.role = 'admin';
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.sub;
        (session.user as any).role = (token as any).role;
        // token.picture holds the Google profile photo (set by NextAuth on
        // OAuth sign-in). Credentials users have none, so this stays null and
        // the navbar falls back to the initial.
        (session.user as any).image = (token as any).picture ?? null;
      }
      return session;
    },
  },
};
