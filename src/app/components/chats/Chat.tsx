'use client';

import { Message, useChat } from 'ai/react';
import Messages from '../Messages';
import { ChatInput } from '../ChatInput';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { PlaceholdersAndVanishInput } from '../ui/placeholders-and-vanish_input';

type Props = {chatId: number};

export default function Chat({chatId}: Props) {

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  };
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submitted");
  };

  const placeholders = [
    "Quels sont les objectifs du document ?",
    "Quels sont les concepts ou idées clés ?",
    "Quelles données ou preuves sont utilisées pour étayer les arguments ?",
    "Quelle est la structure générale du document ?",
    "Quelle est la conclusion ?",
  ];

    const { data, isLoading } = useQuery({
        queryKey: ["chat", chatId],
        queryFn: async () => {
          const response = await axios.post<Message[]>("/api/get-messages", {
            chatId,
          });
          return response.data;
        },
      });
  
  const { messages, input, setInput, handleInputChange, handleSubmit } = useChat({
    api: "/api/chat",
    body: {chatId},
    initialMessages: data || [],
  });

  return (
    <div className='relative h-full flex divide-y divide-zinc-700 flex-col justify-between gap-2'>
        <div className= ''>
            <Messages messages={messages}/>
        </div>

        {/*
        <ChatInput 
            input={input}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit} 
            setInput={setInput}
        />*/}
        
      <div className="flex justify-center items-center px-4 h-full">
        <PlaceholdersAndVanishInput
          input={input}
          placeholders={placeholders}
          onChange={handleInputChange}
          onSubmit={handleSubmit}
        />
    </div>
    </div>
  );
}