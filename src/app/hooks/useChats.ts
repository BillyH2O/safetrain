import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export type ChatType = {
  userId: string;
  id: number;
  pdfName: string;
  pdfUrl: string;
  createdAt: Date;
  fileKey: string;
};

export const useChats = () => {
  const { data = [], isLoading, error } = useQuery<ChatType[]>({
    queryKey: ['chats'],
    queryFn: async () => {
      const response = await axios.get('/api/get-chats');
      return response.data;
    },
  });

  // Fonction pour retrouver un chat spécifique par son ID
  const getChatById = (chatId: number) => data.find((chat) => chat.id === chatId);

  return { chats: data, isLoading, error, getChatById };
};
