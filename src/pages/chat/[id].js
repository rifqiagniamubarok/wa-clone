import ChatLayout from '@/components/layouts/ChatLayout';
import { io } from 'socket.io-client';
import { useEffect, useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import ProtectedRoute from '@/utils/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import dayjs from 'dayjs';
import BubbleChat from '@/components/atoms/BubbleChat';

const ChatDetail = () => {
  const [isExist, setIsExist] = useState(false);
  const {
    data: { user },
  } = useSession();
  const router = useRouter();

  const [message, setMessage] = useState('');
  const [pastMessages, setPastMessages] = useState([]);
  const [messages, setMessages] = useState([]);
  const socketRef = useRef();
  const messagesEndRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    socketRef.current = io('http://localhost:3550');
    socketRef.current.emit('join_room', router.query.id);
    socketRef.current.on('connect', () => {
      setIsConnected(true);
      socketRef.current.emit('join_room', router.query.id);
    });

    socketRef.current.on('receive_message', (data) => {
      getMessage(data, user);
    });

    socketRef.current.on('past_messages', (data) => {
      getPastMessage(data, user);
    });

    socketRef.current.on('disconnect', () => {
      setIsConnected(false);
    });
    return () => {
      socketRef.current.disconnect();
    };
  }, [router, user]);

  const getPastMessage = (data, user) => {
    let pastData = data.map((item) => {
      let payload = { ...item };
      payload.username = user.name;
      payload.myId = user.id;
      return payload;
    });
    setMessages([]);
    setPastMessages(pastData);
  };
  const getMessage = (data, user) => {
    const payload = { ...data };
    payload.username = user.name;
    payload.myId = user.id;

    setMessages((prevData) => [...prevData, { ...payload }]);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message && isConnected) {
      socketRef.current.emit('send_message', { room: router.query.id, message, sender: user.name, date: dayjs(new Date()), userId: user.id });
      setMessage('');
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({});
    }
  }, [pastMessages]);

  useEffect(() => {
    setMessages([]);
  }, []);

  return (
    <ChatLayout className="flex flex-col">
      <div className="flex-grow-0 h-16 bg-emerald-600"></div>
      <div className="flex-grow py-4 px-2 border space-y-2  overflow-y-auto relative bg-[#efeae2] ">
        {pastMessages.map((msg, index) => (
          <BubbleChat key={index} message={msg.message} sender={msg.userId} userId={msg.myId} date={msg.date} />
        ))}
        {messages.map((msg, index) => (
          <BubbleChat key={index} message={msg.message} sender={msg.userId} userId={msg.myId} date={msg.date} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex-grow-0 w-full bg-white py-4 px-2">
        <form className="flex items-center  gap-2">
          <Input placeholder="Enter message" className="flex-grow" onChange={({ target: { value } }) => setMessage(value)} value={message} />
          <Button className="flex-grow-0" onClick={handleSendMessage}>
            Send
          </Button>
        </form>
      </div>
    </ChatLayout>
  );
};

export default ProtectedRoute(ChatDetail);
