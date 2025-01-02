'use client';

import { Message, useChat } from 'ai/react';
import Messages from '../Messages';
import { ChatInput } from '../ChatInput';
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

type Props = {chatId: number};

export default function Chat({chatId}: Props) {

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  };
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submitted");
  };

  const [selectedModel, setSelectedModel] = useState<string | undefined>(undefined);

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
            selectedModel,
          });
          return response.data;
        },
      });
  
  const { messages, input, setInput, handleInputChange, handleSubmit } = useChat({
    api: "/api/chat",
    body: {chatId, selectedModel},
    initialMessages: data || [],
  });

  return (
    <div className='h-full flex divide-y divide-zinc-700 flex-col justify-between'>
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

     <div className='h-full flex flex-col justify-center items-center'>
        <Select onValueChange={(value) => setSelectedModel(value)}>
          <SelectTrigger className="w-[300px]">
            <SelectValue placeholder="Modèle"/>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>modèle</SelectLabel>
              <SelectItem value="gpt-4o"><div className='flex gap-3'>gpt-4o<Image src={OpenAiLogo2} alt="logo open ai" width={24} height={24}/></div></SelectItem>
              <SelectItem value="gpt-4o-mini"><div className='flex gap-3'>gpt-4o-mini<Image src={OpenAiLogo} alt="logo open ai" width={24} height={24}/></div></SelectItem>
              <SelectItem value="gpt-4-turbo"><div className='flex gap-3'>gpt-4-turbo<Image src={OpenAiLogo} alt="logo open ai" width={24} height={24}/></div></SelectItem>
              <SelectItem value="grok-2-1212"><div className='flex gap-3'>grok-2-1212<Image src={GrokLogo} alt="logo open ai" width={20} height={5}/></div></SelectItem>
              <SelectItem value="grok-beta"><div className='flex gap-3'>grok-beta<Image src={GrokLogo} alt="logo open ai" width={20} height={5}/></div></SelectItem>
              <SelectItem value="gemini-2.0-flash-exp"><div className='flex gap-3'>gemini-2.0-flash-exp<Image src={GeminiLogo} alt="logo open ai" width={17} height={17}/></div></SelectItem>
              <SelectItem value="gemini-1.5-flash-latest"><div className='flex gap-3'>gemini-1.5-flash-latest<Image src={GeminiLogo2} alt="logo open ai" width={17} height={17}/></div></SelectItem>
              <SelectItem value="gemini-1.5-flash"><div className='flex gap-3'>gemini-1.5-flash<Image src={GeminiLogo2} alt="logo open ai" width={17} height={17}/></div></SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
     
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