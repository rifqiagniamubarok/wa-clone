import { Button } from '@/components/ui/button';
import ProtectedRoute from '@/utils/ProtectedRoute';
import { signOut } from 'next-auth/react';

const Home = () => {
  return (
    <div className="w-screen h-screen">
      <Button onClick={() => signOut()}>Logout</Button>
      <p>Welcome</p>
    </div>
  );
};

export default ProtectedRoute(Home);
