import React from 'react'
import { Button, Input, Slider, Textarea } from '@nextui-org/react'
import { useChatSettings } from '../context/ChatContext';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';
import TerminalDoc from './TerminalDoc';
import { TerminalHeader } from './TerminalHeader';
import { TerminalBody } from './TerminalBody';
import { TerminalFooter } from './TerminalFooter';

type Props = {
    isPlayground: boolean
}

export const Terminal = ({isPlayground}: Props) => {
  const { name, setName, chunkingStrategy, setChunkingStrategy, rerankingModel, setRerankingModel ,isHybridSearch, setHybridSearch ,temperature, setTemperature, topP, setTopP, topK, setTopK, maxSteps, setMaxSteps, stopSequences, setStopSequences, prompt, setPrompt, resetConfig, idConfigSelected, embeddingModel, setEmbeddingModel, setIdConfigSelected} = useChatSettings(); 
  
  const queryClient = useQueryClient();

    const { data: configData } = useQuery({
        queryKey: ["config-selected", idConfigSelected ],
        queryFn: async () => {
            const response = await axios.get("/api/get-config", {
            params: { idConfigSelected },
            });
            return response.data;
        },
        enabled: !!idConfigSelected, // sera répétée automatiquement par React Query à chaque fois que idConfigSelected change de valeur
    });

    // Met à jour le state à chaque fois qu'on obtient la configData
  React.useEffect(() => {
    // Si configData est défini et qu'il y a au moins un élément
    if (configData && configData.length > 0) {
      const [config] = configData;
      setName(config.name);
      setChunkingStrategy(config.chunkingStrategy);
      setRerankingModel(config.rerankingModel);
      setHybridSearch(config.isHybridSearch);
      setTemperature(config.temperature);
      setTopP(config.topP);
      setTopK(config.topK);
      setMaxSteps(config.maxSteps);
      setStopSequences(config.stopSequences);
      setPrompt(config.prompt);
      console.log("Nouvelle config : ", config.name);
      console.log("Temperature mise à jour : ", config.temperature);
      console.log("topP mis à jour : ", config.topP);
    }
  }, [
    configData,
    setName,
    setChunkingStrategy,
    setRerankingModel,
    setHybridSearch,
    setTemperature,
    setTopP,
    setTopK,
    setMaxSteps,
    setStopSequences,
    setPrompt,
  ]);
    
  const { mutate } = useMutation({
    mutationFn: async (config: { chunkingStrategy: string, rerankingModel: string, temperature: number; topP: number; topK: number; maxSteps: number; stopSequences: string; prompt: string }) => {
      const response = await axios.post("/api/create-config", {config});
      return response.data;
    },       
  });

  const handleNew = () => {
    resetConfig();
    queryClient.invalidateQueries({
        queryKey: ["configs-selector"],
      }); 
  }

  const handleSave = () => { 
    const config = {
        name,
        chunkingStrategy, 
        rerankingModel,
        isHybridSearch,
        temperature,
        topP,
        topK,
        maxSteps,
        stopSequences,
        prompt,
      };

    mutate(config, {
    onSuccess: () => {
        toast.success("La config a été créée");
        queryClient.invalidateQueries({
            queryKey: ["configs-selector"],
          }); 
        resetConfig();
    },
    onError: (error: any) => {
        if (error?.response?.status === 400 && error?.response?.data?.error === "no_name"){
            toast.error("Le nom est requis");
        } 
        if (error?.response?.status === 400 && error?.response?.data?.error === "duplicate_name") {
            toast.error("Vous avez déjà une config avec ce nom.");
        } 
        else {
            toast.error("Erreur lors de la création de la config");
        }
    },
    });
   }
  
  return (
    <div className='flex flex-col h-full overflow-hidden p-6'>
        <TerminalHeader name={name}/>

        <TerminalBody isPlayground={isPlayground} name={name} setName={setName} temperature={temperature} setTemperature={setTemperature}
        topP={topP} setTopP={setTopP} topK={topK} setTopK={setTopK} maxSteps={maxSteps} setMaxSteps={setMaxSteps} 
        stopSequences={stopSequences} setStopSequences={setStopSequences} prompt={prompt} setPrompt={setPrompt}/>

        <TerminalFooter isPlayground={isPlayground} handleNew={handleNew} handleSave={handleSave} />
    </div>
  )
}