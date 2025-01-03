'use client';

import { Message, useChat } from 'ai/react';
import Messages from '../Messages';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { PlaceholdersAndVanishInput } from '../ui/placeholders-and-vanish_input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from 'next/image';
import OpenAiLogo from "../../../assets/openai-logo.png";
import OpenAiLogo2 from "../../../assets/openai-logo2.png";
import GrokLogo from "../../../assets/grok-logo.png";
import GeminiLogo from "../../../assets/gemini-logo.png";
import GeminiLogo2 from "../../../assets/gemini-logo2.png";
import { useState } from 'react';
import ChatInput from '../ChatInput';

type Props = { chatId: number };

export default function Chat({ chatId }: Props) {
  const [selectedModel, setSelectedModel] = useState<string | undefined>(undefined);

  // Chargement initial (messages)
  const { data, isLoading } = useQuery({
    queryKey: ["chat", chatId],
    queryFn: async () => {
      const response = await axios.post<Message[]>("/api/get-messages", {
        chatId,
        selectedModel,
      });
      return response.data;
    },
  });

  // Hook AI pour gérer l’envoi/réception de messages
  const { messages, input, setInput, handleInputChange, handleSubmit } = useChat({
    api: "/api/chat",
    body: { chatId, selectedModel },
    initialMessages: data || [],
  });

  return (
    <div className='h-full w-full flex flex-col'>
      <div className='h-[80%] overflow-auto border-b border-zinc-700'>
        <Messages messages={messages} />
      </div>

      <div className='flex-1'>
        <ChatInput
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          selectedModel={selectedModel}
          onModelChange={(newModel: string | undefined) => setSelectedModel(newModel)}
        />
      </div>
    </div>
  );
}
