import { Button } from '@/components/ui/button';
import Avvvatars from 'avvvatars-react';
import axios from 'axios';
import { getSession, useSession } from 'next-auth/react';
import Link from 'next/link';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';

const SideNav = ({ page = 'chat', chats }) => {
  const [users, setUsers] = useState([]);

  const getUser = async () => {
    const {
      data: { data },
    } = await axios.get('/api/contact');

    console.log({ sideNav: data });
    setUsers(data);
  };
  useEffect(() => {
    getUser();
  }, []);

  return (
    <div className="bg-white grow-0 h-screen min-w-[340px] max-w-[340px]">
      {page == 'newChat' && (
        <div className="w-full h-full ">
          <div className="p-4 bg-emerald-600 text-white">
            <p className="text-xl font-semibold">New Chat</p>
          </div>
          <div className="p-4 text-xl text-emerald-600">Users</div>
          <div className="w-full ">
            {users.map((item, index) => {
              const { name, id, isHasRoom, userRoom } = item;
              return (
                <Link href={isHasRoom ? `/chat/${userRoom[0].roomId}` : `/chat/newChat/${id}`}>
                  <div key={index} className="px-4 hover:bg-gray-100 cursor-pointer">
                    <div className="w-full h-[1px] bg-emerald-600 bg-opacity-50"></div>
                    <div className="flex items-center gap-4 py-4">
                      <Avvvatars value={name} />
                      <p>{name}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
      {page == 'chat' && (
        <div className="w-full h-full ">
          <div className="w-full ">
            {chats &&
              chats.map(({ user, roomId }, index) => (
                <Link href={`/chat/${roomId}`}>
                  <div key={index} className="px-4 hover:bg-gray-100 cursor-pointer">
                    <div className="w-full h-[1px] bg-emerald-600 bg-opacity-50"></div>
                    <div className="flex items-center gap-4 py-4">
                      <Avvvatars value={user.name} />
                      <p>{user.name}</p>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SideNav;
