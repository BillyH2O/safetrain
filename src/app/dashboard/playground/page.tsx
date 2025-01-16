"use client";

import React from 'react';
import Chat from '@/app/components/chat/Chat';
import { Terminal } from '@/app/components/terminal/Terminal';
import { useChatSettings } from '@/app/components/context/ChatContext';


export default function ChatPage() {
  const { setChatId } = useChatSettings();
  
  React.useEffect(() => {
    setChatId(null);
  }, [setChatId]);


  return (
    <div className="h-full w-full flex justify-center items-center">
      <div className="w-[80%] h-full relative ">
        <Chat variant='large'/>
      </div>
      
      <div className='w-[20%] h-full flex-1 border-l border-border'>
      <Terminal isPlayground={true}/>
      </div>
    </div>
  );
}
