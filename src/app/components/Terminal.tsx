import React from 'react'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet"
import { Input, Slider, Textarea } from '@nextui-org/react'
import { useChatSettings } from './context/ChatContext'
  

type Props = {}

const Terminal = (props: Props) => {
  const { temperature, setTemperature, topP, setTopP, topK, setTopK, maxSteps, setMaxSteps, stopSequences, setStopSequences, prompt, setPrompt} = useChatSettings(); 
  return (
    <Sheet>
        <SheetTrigger className='p-2 bg-orange-500 rounded-lg'>Terminal</SheetTrigger>
        <SheetContent>
            <SheetHeader>
            <SheetTitle>Terminal Safetrain IA</SheetTitle>
            <SheetDescription>
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
                        />

                        <Slider
                        value={topK}
                        onChange={(value) => setTopK(value as number)}
                        className="max-w-md"
                        color='warning'
                        defaultValue={40}
                        label="topK"
                        maxValue={100}
                        minValue={0}
                        step={1}
                        />
                        
                        <Slider
                        value={maxSteps}
                        onChange={(value) => setMaxSteps(value as number)}
                        className="max-w-md"
                        color='warning'
                        //isDisabled
                        defaultValue={50}
                        label="maxSteps"
                        maxValue={200}
                        minValue={0}
                        step={1}
                        />
                    </div>

                    <div className='flex flex-col gap-3'>
                        <Input label="stopSequences"  value={stopSequences} onChange={(e) => setStopSequences(e.target.value)} />
                        <Textarea className="w-full" label="Prompt" placeholder="Entrez votre prompt" value={prompt} onChange={(e) => setPrompt(e.target.value)}/>
                    </div>
                    
                </div>
            </SheetDescription>
            </SheetHeader>
        </SheetContent>
    </Sheet>

  )
}

export default Terminal;