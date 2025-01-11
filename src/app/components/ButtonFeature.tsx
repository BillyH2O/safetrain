import React, { ReactNode } from 'react'
import { Button } from './ui/button'

type Props = {
    config_id: number,
    label: string;
    icon?: ReactNode;
    onButtonClick: (config_id: number, label: string) => void; 
}

export const ButtonFeature = ({config_id, label, icon, onButtonClick}: Props) => {
  return (
    <Button 
      variant="outline" 
      className='p-7 flex gap-3'
      onClick={() => onButtonClick(config_id, label)} 
    >
      {label}
      {icon}
    </Button>
  )
}