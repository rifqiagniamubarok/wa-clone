import classNames from 'classnames';
import { LogOut, MessageSquareText } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import Avvvatars from 'avvvatars-react';
import { signOut, useSession } from 'next-auth/react';
import { Button } from '../ui/button';
import Link from 'next/link';

const ChatLayout = ({ children, className }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [contacts, setContacts] = useState([]);
  const socketRef = useRef();
  const { data } = useSession();

  useEffect(() => {
    socketRef.current = io('http://localhost:3550');
    socketRef.current.emit('ask_users', { userId: data?.user?.id });
    socketRef.current.on('receive_users', (data) => {
      setContacts(data?.users);
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
          <div className="w-full aspect-square flex justify-center items-center bg-gray-50 rounded-full">
            <MessageSquareText />
          </div>
        </div>
        <div className="flex flex-col gap-4 items-center">
          {isConnected && <Avvvatars value={data?.user?.name} />}
          <Button className="w-full aspect-square flex justify-center items-centerrounded-full" onClick={() => signOut()}>
            <LogOut />
          </Button>
        </div>
      </div>
      <div className="bg-white grow-0 h-screen min-w-[340px] max-w-[340px]">
        {contacts.length &&
          contacts.map(({ id, name }) => (
            <Link href={`/chat/${id}`}>
              <div className="px-4 py-2 flex items-center gap-4 hover:bg-gray-50 cursor-pointer" key={id}>
                <Avvvatars value={name} />
                <div>
                  <p className="text-left text-lg ">{name}</p>
                  <p className="text-left text-base text-gray-400 ">new message</p>
                </div>
              </div>
            </Link>
          ))}
      </div>
      <div className={classNames('bg-gray-200 grow h-screen', className)}>{children}</div>
    </div>
  );
};

export default ChatLayout;
