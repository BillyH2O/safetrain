import React from 'react';
import Image from 'next/image';
import { useChatSettings } from '../../context/ChatContext';
import { modelOptions } from '../../../../data/model'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectLabel, SelectItem } from './select';

export const ModelSelector = () => {
  const { selectedModel, setSelectedModel } = useChatSettings();

  return (
    <Select onValueChange={(value) => setSelectedModel(value)} value={selectedModel}>
      <SelectTrigger className="w-auto active:border-border">
        <SelectValue placeholder="Modèle" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Modèle</SelectLabel>
          {modelOptions.map(({ value, label, logo, width, height }) => (
            <SelectItem key={value} value={value}>
              <div className="flex gap-2 items-center justify-center">
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
