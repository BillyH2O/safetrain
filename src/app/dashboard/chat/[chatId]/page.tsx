"use client";

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import Chat from '@/app/components/chats/Chat';
import ChatList from '@/app/components/chats/ChatList';
import PDFViewer from '@/app/components/PDFViewer';

import { Switch } from '@nextui-org/react';
import { FileText, Text } from 'lucide-react';
import { cn } from '@/app/lib/utils';

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

  // Récupérer et vérifier le paramètre
  const params = useParams();
  const chatId = Array.isArray(params.chatId) ? params.chatId[0] : params.chatId;
  const chatIdNumber = parseInt(chatId ?? '0', 10);

  // Récupération des données via React Query
  const { data: chats = [], isLoading } = useQuery<ChatType[]>({
    queryKey: ['chats'],
    queryFn: async () => {
      const response = await axios.get('/api/get-chats');
      return response.data;
    },
  });

  const chat = chats.find((chat) => chat.id === chatIdNumber);

  const handleSwitchChange = () => setIsEnabled((prev) => !prev);

  if (isLoading) {
    return <div>Chargement...</div>;
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
        <Switch
          isSelected={isEnabled}
          onChange={handleSwitchChange}
          color="warning"
          endContent={<FileText />}
          size="lg"
          startContent={<Text />}
          className="absolute right-10 top-10"
        />
        <Chat chatId={chatIdNumber} />
      </div>

      {isEnabled && (
        <div className="flex-1 h-full">
          <PDFViewer pdf_url={chat?.pdfUrl ?? ''} />
        </div>
      )}
    </div>
  );
}
