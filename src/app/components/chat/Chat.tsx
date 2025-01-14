'use client';

import Messages from './Messages';
import ChatInput from './ChatInput';

type Props = { 
  chatId?: number,
  variant?: "large" | "small";
 };

export default function Chat({ chatId, variant}: Props) {
  const isPlayground = !chatId;

  return (
    <div className='h-full w-full flex flex-col'>
      <div className='h-[80%] overflow-auto border-b border-border'>
        <Messages variant={variant}/>
      </div>
      <div className='flex-1'>
        <ChatInput isPlayground={isPlayground} />
      </div>
    </div>
  );
}
