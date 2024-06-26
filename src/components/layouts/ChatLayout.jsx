import classNames from 'classnames';
import { MessageSquareText } from 'lucide-react';
import React from 'react';

const ChatLayout = ({ children, className }) => {
  return (
    <div className="w-screen h-screen flex">
      <div className="bg-gray-200 grow-0 w-12 h-screen p-1">
        <div className="w-full aspect-square flex justify-center items-center bg-gray-50 rounded-full">
          <MessageSquareText />
        </div>
      </div>
      <div className="bg-white grow-0 h-screen min-w-[340px] max-w-[340px]"></div>
      <div className={classNames('bg-gray-200 grow h-screen', className)}>children</div>
    </div>
  );
};

export default ChatLayout;
