import classNames from 'classnames';
import React from 'react';

const BubbleChat = ({ message, sender, username }) => {
  const isSender = sender == username;
  return (
    <div className={classNames('flex', isSender ? 'justify-end' : 'justify-start')}>
      <div className={classNames('p-2 rounded-md w-fit min-w-16', isSender ? 'bg-emerald-600 text-white text-left' : 'bg-gray-50 text-black text-right')}>{message}</div>
    </div>
  );
};

export default BubbleChat;
