import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { getServerSession } from 'next-auth';
import { getCsrfToken, getProviders, getSession, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

const AuthMiddleware = (handler) => async (req, res) => {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: 'You must be logged in.' });
  }

  return handler(req, res, session);
};

export default AuthMiddleware;
