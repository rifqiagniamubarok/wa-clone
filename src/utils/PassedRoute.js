import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const PassedRoute = (WrappedComponent) => {
  return (props) => {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
      if (status === 'loading') {
        return;
      }
      if (session) {
        router.push('/');
      }
    }, [session, status, router]);

    if (!session) {
      return <WrappedComponent {...props} />;
    }

    return null;
  };
};

export default PassedRoute;
