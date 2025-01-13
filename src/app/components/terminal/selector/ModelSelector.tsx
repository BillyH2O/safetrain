import React from 'react';
import {Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue} from "@/app/components/ui/select";
import Image from 'next/image';
import { useChatSettings } from '../../context/ChatContext';
import { modelOptions } from '../../../../data/model'

type Props = {}



export const ModelSelector = (props: Props) => {
  const { selectedModel, setSelectedModel } = useChatSettings();

  return (
    <Select onValueChange={(value) => setSelectedModel(value)} value={selectedModel}>
      <SelectTrigger className="w-auto">
        <SelectValue placeholder="Modèle" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Modèle</SelectLabel>
          {modelOptions.map(({ value, label, logo, width, height }) => (
            <SelectItem key={value} value={value}>
              <div className="flex gap-3">
                {label}
                <Image src={logo} alt={`logo ${label}`} width={width} height={height} />
              </div>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
