import ChatLayout from '@/components/layouts/ChatLayout';
import { io } from 'socket.io-client';
import { useEffect, useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import ProtectedRoute from '@/utils/ProtectedRoute';
import { Button } from '@/components/ui/button';

const ChatDetail = () => {
  const socketRef = useRef();
  const [isConnected, setIsConnected] = useState(false);
  const [isExist, setIsExist] = useState(false);
  const router = useRouter();
  const { data } = useSession();

  useEffect(() => {
    socketRef.current = io('http://localhost:3550');
    socketRef.current.emit('ask_room', { userId: data?.user?.id, targetId: router.query.id });
    socketRef.current.on('receive_room', (data) => {
      setIsExist(data.isExist);
    });

    socketRef.current.on('connect', () => {
      setIsConnected(true);
    });
    socketRef.current.on('disconnect', () => {
      setIsConnected(false);
    });
    return () => {
      socketRef.current.disconnect();
    };
  }, [data]);

  const handleStartChat = () => {
    socketRef.current.emit('create_room_chat', { userId: data?.user?.id, targetId: router.query.id });
  };

  return <ChatLayout>{!isExist && <Button onClick={handleStartChat}>Start chat</Button>}</ChatLayout>;
};

export default ProtectedRoute(ChatDetail);
