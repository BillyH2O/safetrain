"use client";

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Message } from 'ai';

export function useChatMessages(chatId: number | null) {
  return useQuery({
    queryKey: ['chat', chatId],
    queryFn: async () => {
    console.log('useChatMessages: fetching messages pour le chat id = ', chatId);
      const response = await axios.post<Message[]>('/api/get-messages', { chatId });
      console.log('useChatMessages: fetched messages', response.data);
      return response.data;
    },
    enabled: chatId !== null && chatId > 0,
  });
}
