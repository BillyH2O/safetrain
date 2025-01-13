import React, { ReactNode } from 'react'
import { Button } from './Button'

type Props = {
    config_id: number,
    label: string;
    icon?: ReactNode;
    size: "icon" | "default" | "sm" | "lg" | null | undefined;
    onButtonClick: (config_id: number, label: string) => void; 
}

export const ButtonFeature = ({config_id, label, icon, size, onButtonClick}: Props) => {
  return (
    <Button 
      variant="outline" 
      className='flex gap-3'
      size={size}
      onClick={() => onButtonClick(config_id, label)} 
    >
      {label}
      {icon}
    </Button>
  )
}