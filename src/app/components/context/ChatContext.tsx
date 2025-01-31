"use client";

import { useChat } from 'ai/react';
import { Message } from 'ai';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useParametres } from '@/app/hooks/useParametres';
import { useChatMessages } from '@/app/hooks/useChatMessages';
//import { useParametresTanstack } from '@/app/hooks/useParametresTanstack';

type ChatContextType = {
  // -- chatId
  chatId: number | null;
  setChatId: (id: number | null) => void;
  // -- Logique Config
  selectedModel: string | undefined;
  setSelectedModel: (value: string) => void;
  name: string,
  setName: (value: string) => void;
  temperature: number;
  setTemperature: (value: number) => void;
  topP: number;
  setTopP: (value: number) => void;
  topK: number;
  setTopK: (value: number) => void;
  maxSteps: number,
  setMaxSteps: (value: number) => void;
  stopSequences: string,
  setStopSequences: (value: string) => void;
  prompt: string;
  setPrompt: (value: string) => void;
  chunkingStrategy: string;
  setChunkingStrategy: (value: string) => void;
  rerankingModel: string;
  setRerankingModel: (value: string) => void;
  isHybridSearch: boolean;
  setHybridSearch: (value: boolean) => void;

  isRAG: boolean;
  setRAG: (value: boolean) => void;

  embeddingModel: string | undefined;
  setEmbeddingModel: (value: string) => void;

  resetConfig: () => void;
  idConfigSelected: number | null; 
  setIdConfigSelected: (value: number | null) => void;

  // -- Logique Chat
  messages: Message[];
  input: string;
  setInput: (value: string) => void;
  handleSubmit: () => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => void,
};

const ChatContext = createContext<ChatContextType | undefined>(undefined); // Création du contexte

// Hook pour consommer le contexte
export const useChatSettings = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatSettings must be used within a ChatProvider');
  }
  return context;
};

type ChatProviderProps = {
  chatId?: string | undefined; 
  children: React.ReactNode;
};

// Composant fournisseur du contexte
export const ChatProvider = ({ children }: ChatProviderProps)  => {
  const [chatId, setChatId] = useState<number | null>(null);
  const [selectedModel, setSelectedModel] = useState<string | undefined>(undefined);
  const [name, setName] = useState<string>("");
  const [temperature, setTemperature] = useState<number>(0.4);
  const [topP, setTopP] = useState<number>(0.4);
  const [topK, setTopK] = useState<number>(0.4);
  const [maxSteps, setMaxSteps] = useState<number>(1);
  const [stopSequences, setStopSequences] = useState<string>("");
  const [chunkingStrategy, setChunkingStrategy] = useState<string>("standard");
  const [rerankingModel, setRerankingModel] = useState<string>("null");
  const [isHybridSearch, setHybridSearch] = useState<boolean>(false);
  const [prompt, setPrompt] = useState<string>("");
  const [idConfigSelected, setIdConfigSelected] = useState<number | null>(null);
  const [isRAG, setRAG] = useState<boolean>(true);

  const resetConfig = () => { 
    setName("")
    setTemperature(0.5);
    setTopP(0.5);
    setTopK(50);
    setMaxSteps(50);
    setStopSequences("");
    setPrompt("");
    setChunkingStrategy("standard");
    setRerankingModel("null");
    setHybridSearch(false);
    setIdConfigSelected(null);
    //setEmbeddingModel("text-embedding-ada-002");
  }

  const { embeddingModel, updateEmbeddingModel } = useParametres(); // Récupération des paramètres de l'application
  //const { embeddingModel, updateEmbeddingModel } = useParametresTanstack();
  const { data: initialMessages } = useChatMessages(chatId); // Récupération des messages du chat
  
  //
  const {messages, setMessages, input, setInput, handleInputChange, handleSubmit} = useChat({
    api: chatId ? '/api/chat' : '/api/playground',
    body: {
      ...(chatId ? { chatId } : {}),
      config: {
        selectedModel,
        chunkingStrategy,
        rerankingModel,
        isHybridSearch,
        temperature,
        topP,
        topK,
        maxSteps,
        stopSequences,
        prompt,
        embeddingModel,
        isRAG
      },
    },
    initialMessages: initialMessages || [],
  });

  useEffect(() => {
    if (initialMessages && initialMessages.length > 0) {
      setMessages(initialMessages.map((msg) => ({
        ...msg,
        id: msg.id.toString(), // S'assurer que l'ID est une chaîne
      })));
    }
  }, [initialMessages, setMessages]);

  return (
    <ChatContext.Provider
      value={{
        // -- Logique chatId
        chatId,
        setChatId,
        // -- Logique Config
        selectedModel,
        setSelectedModel,
        name,
        setName,
        temperature,
        setTemperature,
        topP,
        setTopP,
        topK,
        setTopK,
        maxSteps,
        setMaxSteps,
        stopSequences,
        setStopSequences,
        prompt,
        setPrompt,
        chunkingStrategy, 
        setChunkingStrategy,
        rerankingModel,
        setRerankingModel,
        isHybridSearch,
        setHybridSearch,
        resetConfig,
        idConfigSelected, 
        setIdConfigSelected,
        embeddingModel,
        setEmbeddingModel: updateEmbeddingModel,
        isRAG,
        setRAG,

        // -- Logique Chat
        messages,
        input,
        setInput,
        handleSubmit,
        handleInputChange
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
