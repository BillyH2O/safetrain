"use client";

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import Chat from '@/app/components/chats/Chat';
import ChatList from '@/app/components/chats/ChatList';
import PDFViewer from '@/app/components/PDFViewer';

import { Switch } from '@nextui-org/react';
import { FileText, Text } from 'lucide-react';
import { cn } from '@/app/lib/utils';
import Terminal from '@/app/components/Terminal';
import { ConfigTerminal } from '@/app/components/ConfigTerminal';
import { useChatSettings } from '@/app/components/context/ChatContext';

type ChatType = {
  userId: string;
  id: number;
  pdfName: string;
  pdfUrl: string;
  createdAt: Date;
  fileKey: string;
};

export default function ChatPage() {
  const [isEnabled, setIsEnabled] = useState(true);
  const { chatId, setChatId } = useChatSettings();
  
  React.useEffect(() => {
    setChatId(null);
  }, [setChatId]);

  const handleSwitchChange = () => setIsEnabled((prev) => !prev);

  return (
    <div className="h-full w-full flex justify-center items-center">

      <div className="w-[80%] h-full relative ">
        <Chat />
      </div>
      
      <div className='w-[20%] h-full flex-1 border-l border-zinc-700 bg-neutral-950'>
      <ConfigTerminal isPlayground={true}/>
      </div>
    </div>
  );
}
