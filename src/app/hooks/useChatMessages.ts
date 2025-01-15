"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Message } from "ai";

export function useChatMessages(chatId: number | null) {
  const [data, setData] = useState<Message[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    if (chatId === null || chatId <= 0) {
      return;
    }

    const fetchMessages = async () => {
      try {
        setIsLoading(true);
        setError(null);
        console.log('useChatMessages: fetching messages pour le chat id = ', chatId);
        
        const response = await axios.post<Message[]>('/api/get-messages', { chatId });
        
        console.log('useChatMessages: fetched messages', response.data);
        setData(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, [chatId]);

  return { data, isLoading, error };
}
