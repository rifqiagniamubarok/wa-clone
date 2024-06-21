import BubbleChat from '@/components/atoms/BubbleChat';
import { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';

const Chat = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  function generateString(length) {
    let result = ' ';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
  }

  const [message, setMessage] = useState('');
  const [room, setRoom] = useState('test');
  const [roomInput, setRoomInput] = useState('test');
  const [username, setUsername] = useState('');
  const [usernameInput, setUsernameInput] = useState('');
  const [messages, setMessages] = useState([]);
  const socketRef = useRef();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    setUsername(generateString(4));
  }, []);

  useEffect(() => {
    socketRef.current = io('http://localhost:3550');
    socketRef.current.emit('join_room', room);
    socketRef.current.on('receive_message', (data) => {
      getMessage(data, username);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [username]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (username) {
      socketRef.current.emit('send_message', { room, message, sender: username });
      setMessage('');
    }
  };

  const handleChangeName = (e) => {
    e.preventDefault();
    setUsername(usernameInput);
    setUsernameInput('');
  };

  const handleJoinRoom = (e) => {
    e.preventDefault();
    socketRef.current.emit('join_room', roomInput);
    setRoom(roomInput);
    setMessages([]);
    setRoomInput('');
  };

  const getMessage = (data, username) => {
    const payload = { ...data };
    payload.username = username;

    setMessages((prevData) => [...prevData, { ...payload }]);
  };

  useEffect(() => {
    // Scroll to the bottom every time messages change
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="w-screen h-screen bg-white">
      <div className="w-1/3 space-y-4">
        <div>
          <div>Username: {username}</div>
          <form onSubmit={handleChangeName}>
            <div className="flex items-center gap-2">
              <input
                className="px-4 py-2 border grow border-emerald-600 rounded-md "
                placeholder="username"
                value={usernameInput}
                onChange={({ target: { value } }) => setUsernameInput(value)}
              />
              <button type="submit" className="grow-0 px-4 py-2 bg-emerald-600 rounded-md text-white">
                Change
              </button>
            </div>
          </form>
        </div>
        <div>
          <div>Room: {room}</div>
          <form onSubmit={handleJoinRoom}>
            <div className="flex items-center gap-2">
              <input
                className="px-4 py-2 border grow border-emerald-600 rounded-md "
                placeholder="room"
                value={roomInput}
                onChange={({ target: { value } }) => setRoomInput(value)}
              />
              <button type="submit" className="grow-0 px-4 py-2 bg-emerald-600 rounded-md text-white">
                Join
              </button>
            </div>
          </form>
        </div>
        <div className="py-4 px-2 border space-y-2 max-h-[400px] min-h-[400px] overflow-y-auto relative bg-[#efeae2] ">
          {messages.map((msg, index) => (
            <BubbleChat key={index} message={msg.message} sender={msg.sender} username={msg.username} />
          ))}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleSendMessage}>
          <div className="flex items-center gap-2 w-full">
            <input placeholder="message" className="px-4 py-2 border border-emerald-600 rounded-md grow" value={message} onChange={({ target: { value } }) => setMessage(value)} />
            <button type="submit" className="px-4 py-2 bg-emerald-600 rounded-md text-white grow-0">
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Chat;
