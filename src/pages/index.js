import ChatLayout from '@/components/layouts/ChatLayout';
import { Button } from '@/components/ui/button';
import ProtectedRoute from '@/utils/ProtectedRoute';
import { MessageSquareText } from 'lucide-react';
import { signOut } from 'next-auth/react';

const Home = () => {
  return <ChatLayout className={''}></ChatLayout>;
};

export default ProtectedRoute(Home);
