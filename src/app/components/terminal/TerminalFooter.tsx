import React from 'react'
import TerminalDoc from './TerminalDoc';
import { Button } from '@nextui-org/react';

type TerminalFooterProps = {
    isPlayground: boolean;
    handleNew: () => void;
    handleSave: () => void;
};

export const TerminalFooter = ({ isPlayground, handleNew, handleSave }: TerminalFooterProps) => {
  return (
    <div>
        {isPlayground ? (
            <div className='flex gap-5 items-center justify-center'>
                {isPlayground && <TerminalDoc label={"Doc"}/>}
                <Button color="secondary" variant="flat" onPress={handleNew}>Nouveau</Button>
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