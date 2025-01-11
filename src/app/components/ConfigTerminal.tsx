import React from 'react'
import { Button, Input, Slider, Textarea } from '@nextui-org/react'
import { useChatSettings } from './context/ChatContext';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';
import { PromptSelector } from './PromptSelector';
import TerminalDoc from './TerminalDoc';

type Props = {
    isPlayground: boolean
}

export const ConfigTerminal = ({isPlayground}: Props) => {
  const { name, setName, temperature, setTemperature, topP, setTopP, topK, setTopK, maxSteps, setMaxSteps, stopSequences, setStopSequences, prompt, setPrompt, resetConfig, idConfigSelected, setIdConfigSelected} = useChatSettings(); 
  
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
    setTemperature,
    setTopP,
    setTopK,
    setMaxSteps,
    setStopSequences,
    setPrompt,
  ]);
    

  const { mutate } = useMutation({
    mutationFn: async (config: { temperature: number; topP: number; topK: number; maxSteps: number; stopSequences: string; prompt: string }) => {
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
        <div className='flex flex-col gap-3'>
            <div className='font-semibold text-lg text-white'>Terminal Safetrain IA</div>
            <div className='text-sm'>Modifier les paramètres de votre modèle très simplement dans le Playground Safetrain IA.</div> 
            <div className='mt-10 flex gap-2'>
                <PromptSelector name={name}/>
            {isPlayground && <TerminalDoc label={"Doc"}/>}
            </div>
        </div>

        <div className='flex flex-1 flex-col justify-center gap-4 overflow-hidden'>
            <Input
                isRequired
                className="emax-w-non"
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                label="Nom"
                isDisabled={!isPlayground}
            />
            <Slider
                value={temperature}
                onChange={(value) => setTemperature(value as number)}
                className="max-w-md"
                color='warning'
                defaultValue={0.4}
                label="Temperature"
                maxValue={1}
                minValue={0}
                step={0.01}
                isDisabled={!isPlayground}
            />

            <Slider
                value={topP}
                onChange={(value) => setTopP(value as number)}
                className="max-w-md"
                color='warning'
                defaultValue={0.4}
                label="topP"
                maxValue={1}
                minValue={0}
                step={0.01}
                isDisabled={!isPlayground}
            />

            <Slider
                value={topK}
                onChange={(value) => setTopK(value as number)}
                className="max-w-md"
                color='warning'
                defaultValue={40}
                label="topK"
                maxValue={100}
                minValue={5}
                step={1}
                isDisabled={!isPlayground}
            />
            
            <Slider
                value={maxSteps}
                onChange={(value) => setMaxSteps(value as number)}
                className="max-w-md"
                color='warning'
                defaultValue={50}
                label="maxSteps"
                maxValue={200}
                minValue={2}
                step={1}
                isDisabled={!isPlayground}
            />

            <Input label="stopSequences"  
                value={stopSequences} 
                onChange={(e) => setStopSequences(e.target.value)} 
                isDisabled={!isPlayground}
            />
            <Textarea className="w-full" maxRows={3} isClearable label="Prompt" placeholder="Entrez votre prompt" value={prompt} onChange={(e) => setPrompt(e.target.value)} isDisabled={!isPlayground}/>
        </div>

        {isPlayground ? (
            <div className='flex gap-5 items-center justify-center'>
                <Button color="secondary" variant="flat" onPress={handleNew}>Nouvelle Config</Button>
                <Button color="success" variant="flat" onPress={handleSave}>Sauvegarder</Button>
            </div>
        ) : (
            <div className='flex gap-5 items-center justify-center'>
                <TerminalDoc label={"Documentation"}/>
            </div>
        )}

    </div>
  )
}