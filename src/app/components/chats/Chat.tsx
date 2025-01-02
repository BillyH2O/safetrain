'use client';

import { Message, useChat } from 'ai/react';
import Messages from '../Messages';
import { ChatInput } from '../ChatInput';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

type Props = {chatId: number};

export default function Chat({chatId}: Props) {

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
    <div className='relative min-h-full bg-zinc-900 flex divide-y divide-zinc-700 flex-col justify-between gap-2'>
        <div className= 'flex-1 text-black bg-zinc-800 justify-between flex flex-col'>
            <Messages messages={messages}/>
        </div>
        
        {/*<form onSubmit={handleSubmit}> 
            <input className='text-black' value={input} onChange={handleInputChange} type="text"/>
            <button type='submit'>Submit</button>
        </form>*/}

        <ChatInput 
            input={input}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit} 
            setInput={setInput}
        />
    </div>
  );
}