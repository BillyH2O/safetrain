"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export function useParametres() {
  const queryClient = useQueryClient();

  // Requête pour récupérer les paramètres
  const { data, isLoading, error } = useQuery({
    queryKey: ['parametres'],
    queryFn: async () => {
      console.log('useParametres: fetching parameters...');
      const response = await axios.get("/api/parametres");
      console.log('useParametres: fetched data', response.data);
      return response.data;
    },
  });

  // Mutation pour mettre à jour l'embeddingModel
  const mutation = useMutation({
    mutationFn: async (newEmbedding: string) => {
      console.log('useParametres: updating embeddingModel to', newEmbedding);
      await axios.post("/api/parametres", { embeddingModel: newEmbedding });
    },
    onSuccess: () => {
      console.log('useParametres: update successful, invalidating queries');
      queryClient.invalidateQueries({ queryKey: ['parametres'] });
    },
    onError: (error) => {
      console.error('useParametres: update error', error);
    },
  });

  // Fonction pour lancer la mutation
  const updateEmbeddingModel = (newEmbedding: string) => {
    console.log('useParametres: calling updateEmbeddingModel with', newEmbedding);
    mutation.mutate(newEmbedding);
  };

  return {
    embeddingModel: data?.embeddingModel,
    updateEmbeddingModel,
    isLoading,
    error,
  };
}
