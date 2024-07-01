import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        const { email, password } = credentials;
        const getUser = await prisma.user.findUnique({ where: { email } });
        if (!getUser) {
          throw new Error('Email or password wrong');
        }

        const isPasswordValid = await bcrypt.compare(password, getUser.password);
        if (!isPasswordValid) {
          throw new Error('Email or password wrong');
        }

        const user = { id: Number(getUser.id), name: getUser.name, email: getUser.email, type: 'admin' };
        return user;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (account) {
        token.accessToken = account.access_token; // GitHubProvider
      } else if (user) {
        token.accessToken = user.token; // CredentialsProvider
      }

      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.user.id = token.sub;

      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
export default NextAuth(authOptions);
