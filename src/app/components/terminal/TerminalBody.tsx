import React from 'react'
import { ChunkingSelector } from './selector/ChunkingSelector';
import { RerankingSelector } from './selector/RerankingSelector';
import HybridSearchSelector from './selector/HybridSearchSelector';
import { EmbeddingModelSelector } from './selector/EmbeddingModelSelector';
import { Input, Slider, Textarea } from '@nextui-org/react'

type TerminalBodyProps = {
    isPlayground: boolean;
    name: string;
    setName: (value: string) => void;
    temperature: number;
    setTemperature: (value: number) => void;
    topP: number;
    setTopP: (value: number) => void;
    topK: number;
    setTopK: (value: number) => void;
    maxSteps: number;
    setMaxSteps: (value: number) => void;
    stopSequences: string;
    setStopSequences: (value: string) => void;
    prompt: string;
    setPrompt: (value: string) => void;
  };

export const TerminalBody = ({isPlayground, name, setName, temperature, setTemperature, topP, setTopP, topK, setTopK, maxSteps, setMaxSteps, stopSequences, setStopSequences, prompt, setPrompt,}: TerminalBodyProps) => {
  return (
    <div className='flex flex-1 flex-col justify-center items-center gap-4 overflow-hidden w-full'>
        <div className='w-full flex justify-between'>
            <HybridSearchSelector isPlayground={isPlayground}/>
            <EmbeddingModelSelector disabled={true} />
        </div>
        
        <div className='flex gap-3 justify-between items-center w-full'>
            <RerankingSelector isPlayground={isPlayground}/>
            <ChunkingSelector isPlayground={isPlayground}/>
        </div>
        
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

        <Textarea className="w-full" maxRows={3} isClearable label="Prompt" placeholder="Entrez votre prompt" value={prompt} variant='faded' onChange={(e) => setPrompt(e.target.value)} isDisabled={!isPlayground}/>
        <div className='flex gap-3 justify-between items-center'>
            <Input
                isRequired
                className="max-w-none w-1/2"
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                label="Nom"
                isDisabled={!isPlayground}
                size='sm'
                variant='faded'
            />
            <Input 
                className="max-w-none w-1/2" 
                value={stopSequences} 
                onChange={(e) => setStopSequences(e.target.value)} 
                label="stopSequences" 
                isDisabled={!isPlayground}
                size='sm'
                variant='faded'
            />
        </div>
    </div>
  )
}