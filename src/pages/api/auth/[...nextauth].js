import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';

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
        if (credentials.email != 'admin@admin.com' || credentials.password != 'adminadmin') {
          throw new Error('Login failed');
        }

        const user = { email: 'admin@admin.com', type: 'admin' };
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
      console.log({ user });

      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      console.log({ session, token: token });
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
export default NextAuth(authOptions);
