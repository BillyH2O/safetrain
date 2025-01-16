import { useState } from 'react';
import axios from 'axios';

// types.ts
export interface DeleteChatSuccessResponse {
  message: string;
}

export interface DeleteChatErrorResponse {
  error: string;
  details?: unknown;
}


export const useDeleteChat = (onSuccess: (data: any) => void) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const deleteChat = async (id: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.delete(`/api/delete-chat/${id}`);
      onSuccess(response.data); // Appel du callback onSuccess pour rafraîchir les données
      return response.data;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { deleteChat, isLoading, error };
};
