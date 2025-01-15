import { useState, useEffect } from 'react';
import axios from 'axios';

export const usePDFList = () => {
  const [chats, setChats] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Fonction pour récupérer les PDF
  const fetchChats = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get('/api/get-chats');
      setChats(response.data); // Met à jour la liste des PDF
    } catch (err: any) {
      setError(err); 
    } finally {
      setIsLoading(false); 
    }
  };


  useEffect(() => {
    fetchChats();
  }, []); // Récupération initiale des PDF au montage du composant

  return {
    chats,
    isLoading,
    error,
    refetch: fetchChats, // Expose la fonction de rafraîchissement
  };
};
