import classNames from 'classnames';
import { LogOut, MessageSquareText, MessageSquareDiff } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import Avvvatars from 'avvvatars-react';
import { signOut, useSession } from 'next-auth/react';
import { Button } from '../ui/button';
import Link from 'next/link';
import SideNav from '../organisms/SideNav';
import ProtectedRoute from '@/utils/ProtectedRoute';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

const ChatLayout = ({ children, className }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [chats, setChats] = useState([]);

  const [contacts, setContacts] = useState([]);
  const [sideBar, setSideBar] = useState('chat');

  const socketRef = useRef();
  const { data } = useSession();

  useEffect(() => {
    socketRef.current = io('http://localhost:3550');
    socketRef.current.emit('ask_users', { userId: data?.user?.id });
    socketRef.current.on('receive_users', (data) => {
      console.log({ data });
      setChats(data?.rooms);
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

  return (
    <div className="w-screen h-screen flex">
      <div className="bg-gray-200 grow-0 w-12 h-screen p-1 flex flex-col justify-between">
        <div className="flex flex-col gap-4 items-center">
          <div className={classNames('w-full aspect-square flex justify-center items-center  rounded-full', isConnected ? 'bg-green-600' : 'bg-red-600')}></div>
          <div className="w-full aspect-square flex justify-center items-center bg-gray-50 rounded-full hover:bg-gray-100 cursor-pointer" onClick={() => setSideBar('chat')}>
            <MessageSquareText />
          </div>
          <div className="w-full aspect-square flex justify-center items-center bg-gray-50 rounded-full hover:bg-gray-100 cursor-pointer" onClick={() => setSideBar('newChat')}>
            <MessageSquareDiff />
          </div>
        </div>
        <div className="flex flex-col gap-4 items-center">
          {isConnected && (
            <Popover>
              <PopoverTrigger>
                <Avvvatars value={data?.user?.name} />
              </PopoverTrigger>
              <PopoverContent>
                <div className="flex items-center gap-4 p-4">
                  <Avvvatars value={data?.user?.name} />
                  <p className="text-emerald-600">{data?.user?.name}</p>
                </div>
              </PopoverContent>
            </Popover>
          )}
          <Button className="w-full aspect-square flex justify-center items-centerrounded-full" onClick={() => signOut()}>
            <LogOut />
          </Button>
        </div>
      </div>
      <SideNav page={sideBar} chats={chats} />
      <div className={classNames('bg-gray-200 grow h-screen', className)}>{children}</div>
    </div>
  );
};

export default ProtectedRoute(ChatLayout);
