"use client";

import React, { createContext, useContext, useState } from 'react';

// Définition du type pour le contexte (props du provider)
type ChatContextType = {
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
  prompt: string,
  setPrompt: (value: string) => void;
};

// Création du contexte
const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Hook pour consommer le contexte
export const useChatSettings = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatSettings must be used within a ChatProvider');
  }
  return context;
};

// Composant fournisseur du contexte
export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [temperature, setTemperature] = useState<number>(0.4);
  const [topP, setTopP] = useState<number>(0.4);
  const [topK, setTopK] = useState<number>(0.4);
  const [maxSteps, setMaxSteps] = useState<number>(0);
  const [stopSequences, setStopSequences] = useState<string>("");
  const [prompt, setPrompt] = useState<string>("");

  return (
    <ChatContext.Provider
      value={{
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
        setPrompt
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
