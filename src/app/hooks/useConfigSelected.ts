// hooks/useConfigSelected.ts
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

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

export const useConfigSelected = (idConfigSelected: number | null) => {
  return useQuery<Config[]>({
    queryKey: ['config-selected', idConfigSelected],
    queryFn: async () => {
      const response = await axios.get('/api/get-config', {
        params: { idConfigSelected },
      });
      return response.data;
    },
    enabled: !!idConfigSelected, // sera répétée automatiquement par React Query à chaque fois que idConfigSelected change de valeur
  });
};
