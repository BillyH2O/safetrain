import React from 'react'
import { useChatSettings } from '../context/ChatContext';
import { useQueryClient } from '@tanstack/react-query';
import { TerminalHeader } from './TerminalHeader';
import { TerminalBody } from './TerminalBody';
import { TerminalFooter } from './TerminalFooter';
import { useConfigSelected } from '@/app/hooks/useConfigSelected';
import { useCreateConfig } from '@/app/hooks/useCreateConfig';

type Props = {
    isPlayground: boolean
}

export const Terminal = ({isPlayground}: Props) => {
  const { name, setName, chunkingStrategy, setChunkingStrategy, rerankingModel, setRerankingModel ,isHybridSearch, setHybridSearch ,temperature, setTemperature, topP, setTopP, topK, setTopK, maxSteps, setMaxSteps, stopSequences, setStopSequences, prompt, setPrompt, resetConfig, idConfigSelected, embeddingModel, setEmbeddingModel, setIdConfigSelected} = useChatSettings(); 
  
  const queryClient = useQueryClient();

    const { data: configData } = useConfigSelected(idConfigSelected);

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
    
  const { mutate } = useCreateConfig();

  const handleNew = () => {
    resetConfig();
    queryClient.invalidateQueries({queryKey: ["configs-selector"],}); 
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
      onSuccess: () => {resetConfig();},
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