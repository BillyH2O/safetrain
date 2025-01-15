"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Chat from '@/app/components/chat/Chat';
import ChatList from '@/app/components/chat/ChatList';
import PDFViewer from '@/app/components/chat/PDFViewer';
import { cn } from '@/app/lib/utils';
import { useChatSettings } from '@/app/components/context/ChatContext';
import { SwitchPDFMode } from '@/app/components/chat/SwitchPDFMode';
import { useChats } from '@/app/hooks/useChats';
import { Loader2 } from 'lucide-react';
import { LoadingPage } from '@/app/components/ui/LoadingPage';

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
  const { chats, isLoading, getChatById } = useChats();

  // Récupérer et vérifier le paramètre
  const params = useParams();
  const newChatId = Array.isArray(params.chatId) ? params.chatId[0] : params.chatId;
  const chatIdNumber = parseInt(newChatId ?? '0', 10);

  useEffect(() => {
    console.log('newChatId:', newChatId, 'chatIdNumber:', chatIdNumber);
    setChatId(chatIdNumber);
    console.log('Provider chatId:', chatId);
  }, [chatIdNumber, setChatId]);

  const chat = getChatById(chatIdNumber);

  const handleSwitchChange = () => setIsEnabled((prev) => !prev);

  if (isLoading) {
    return <LoadingPage/>
  }

  return (
    <div className="h-full w-full flex justify-center items-center">
      <div className="w-[15%] max-w-96 h-full">
        <ChatList chats={chats} chatId={chatIdNumber} />
      </div>

      <div className={cn(
        " h-full relative",
        {
          "w-[45%]": isEnabled,
          "w-full" : !isEnabled,
        }
        )}>
        <SwitchPDFMode isEnabled={isEnabled} onToggle={handleSwitchChange} />
        <Chat chatId={chatIdNumber} variant='small'/>
      </div>

      {isEnabled && (
        <div className="flex-1 h-full">
          <PDFViewer pdf_url={chat?.pdfUrl ?? ''} />
        </div>
      )}
    </div>
  );
}
