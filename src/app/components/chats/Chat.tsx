'use client';

import { Message, useChat } from 'ai/react';
import Messages from '../Messages';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import ChatInput from '../ChatInput';
import { useChatSettings } from '../context/ChatContext';

type Props = { chatId?: number };

export default function Chat({ chatId }: Props) {
  const [selectedModel, setSelectedModel] = useState<string | undefined>(undefined);
  const { temperature, setTemperature, topP, setTopP, topK, setTopK, maxSteps, setMaxSteps, stopSequences, setStopSequences, prompt, setPrompt} = useChatSettings(); 
  const isPlayground = !chatId
  // Chargement initial (messages)
  const { data, isLoading } = useQuery({
    queryKey: ["chat", chatId],
    queryFn: async () => {
      const response = await axios.post<Message[]>("/api/get-messages", {
        chatId,
      });
      return response.data;
    },
    enabled: !!chatId,
  });

  // Hook AI pour gérer l’envoi/réception de messages
  const { messages, input, setInput, handleInputChange, handleSubmit } = useChat({
    api: chatId ? '/api/chat' : '/api/playground',
    body: { 
      ...(chatId ? { chatId } : {}), 
      config: {
        selectedModel,
        temperature,
        topP,
        topK,
        maxSteps,
        stopSequences,
        prompt
      }
    },
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
          isPlayground={isPlayground}
        />
      </div>
    </div>
  );
}
