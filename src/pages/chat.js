import { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';

const Chat = () => {
  const [message, setMessage] = useState('');
  const [room, setRoom] = useState('test');
  const [roomInput, setRoomInput] = useState('test');
  const [messages, setMessages] = useState([]);
  const socketRef = useRef();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socketRef.current = io('http://localhost:3550');
    socketRef.current.emit('join_room', room);
    socketRef.current.on('receive_message', (data) => {
      getMessage(data);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const handleSendMessage = (e) => {
    e.preventDefault();
    socketRef.current.emit('send_message', { room, message });
    setMessage('');
  };

  const handleJoinRoom = (e) => {
    e.preventDefault();
    socketRef.current.emit('join_room', roomInput);
    setRoom(roomInput);
    setMessages([]);
    setRoomInput('');
  };

  const getMessage = (data) => {
    setMessages((prevData) => [...prevData, data.message]);
    console.log({ messages, data: data.message });
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
                Join room
              </button>
            </div>
          </form>
        </div>
        <div className="p-4 border space-y-2 max-h-[400px] min-h-[400px] overflow-y-auto relative bg-gray-100 ">
          {messages.map((msg, index) => (
            <div key={index} className="p-2 bg-emerald-600 rounded-md text-white w-fit">
              {msg}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleSendMessage}>
          <div className="flex items-center gap-2 w-full">
            <input placeholder="message" className="px-4 py-2 border border-emerald-600 rounded-md grow" value={message} onChange={({ target: { value } }) => setMessage(value)} />
            <button type="submit" className="px-4 py-2 bg-emerald-600 rounded-md text-white grow-0">
              Send message
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Chat;
