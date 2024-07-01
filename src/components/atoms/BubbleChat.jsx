import classNames from 'classnames';
import dayjs from 'dayjs';
import React from 'react';

const BubbleChat = ({ message, sender, userId, date }) => {
  const isSender = sender == userId;
  return (
    <div className={classNames('flex', isSender ? 'justify-end ml-6' : 'justify-start mr-6')}>
      <div
        className={classNames(
          'py-1 px-2 w-fit min-w-16',
          isSender ? 'bg-emerald-600 text-white rounded-l-lg rounded-br-lg' : 'bg-gray-50 text-black rounded-r-lg rounded-bl-lg',
          'flex gap-x-2'
        )}
      >
        <div className={classNames(isSender ? 'text-right' : 'text-left', ' self-start pb-[10px] text-wrap')}>{message}</div>
        <div className={classNames('text-right text-[10px] self-end')}>{dayjs(date).format('HH:mm')}</div>
      </div>
    </div>
  );
};

export default BubbleChat;
