// hooks/useCreateConfig.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';

type Config = {
  name: string;
  chunkingStrategy: string;
  rerankingModel: string;
  isHybridSearch: boolean;
  temperature: number;
  topP: number;
  topK: number;
  maxSteps: number;
  stopSequences: string;
  prompt: string;
};

export const useCreateConfig = () => {
  const queryClient = useQueryClient();

  return useMutation<unknown, unknown, Config>({
    mutationFn: async (config) => {
      const response = await axios.post('/api/create-config', { config });
      return response.data;
    },
    onSuccess: () => {
      toast.success('La config a été créée');
      queryClient.invalidateQueries({ queryKey: ['configs-selector'] });
    },
    onError: (error: any) => {
      if (
        error?.response?.status === 400 &&
        error?.response?.data?.error === 'no_name'
      ) {
        toast.error('Le nom est requis');
      } else if (
        error?.response?.status === 400 &&
        error?.response?.data?.error === 'duplicate_name'
      ) {
        toast.error('Vous avez déjà une config avec ce nom.');
      } else {
        toast.error('Erreur lors de la création de la config');
      }
    },
  });
};
