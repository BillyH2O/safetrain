"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';

export function useParametres() {
  const [embeddingModel, setEmbeddingModel] = useState<string | undefined>(undefined);

  const fetchParametres = async () => {
    try {
      const response = await axios.get("/api/parametres");
      setEmbeddingModel(response.data.embeddingModel);
    } catch (error) {
      console.error("Erreur lors du fetch de /api/parametres :", error);
    }
  };

  const updateEmbeddingModel = async (newEmbedding: string) => {
    try {
      await axios.post("/api/parametres", { embeddingModel: newEmbedding });
      fetchParametres();
    } catch (error) {
      console.error("Erreur lors de la mise à jour de /api/parametres :", error);
    }
  };

  useEffect(() => {
    fetchParametres();
  }, []);

  return { embeddingModel, updateEmbeddingModel };
}
