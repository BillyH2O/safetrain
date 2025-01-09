import React from 'react'
import { Input, Slider, Textarea } from '@nextui-org/react'
import { useChatSettings } from './context/ChatContext';

type Props = {
    isPlayground: boolean
}

export const ConfigTerminal = ({isPlayground}: Props) => {
  const { temperature, setTemperature, topP, setTopP, topK, setTopK, maxSteps, setMaxSteps, stopSequences, setStopSequences, prompt, setPrompt} = useChatSettings(); 
  return (
    <div>
        <p>Modifier les paramètres de votre modèle très simplement dans le Playground Safetrain IA.</p>
                <div className='flex flex-col gap-28 mt-28'>
                    <div className='flex flex-col gap-5'>
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
                    </div>

                    <div className='flex flex-col gap-3'>
                        <Input label="stopSequences"  value={stopSequences} onChange={(e) => setStopSequences(e.target.value)} isDisabled={!isPlayground}/>
                        <Textarea className="w-full" label="Prompt" placeholder="Entrez votre prompt" value={prompt} onChange={(e) => setPrompt(e.target.value)} isDisabled={!isPlayground}/>
                    </div>
                    
                </div>
    </div>
  )
}