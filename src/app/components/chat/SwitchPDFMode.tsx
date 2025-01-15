import React from 'react'
import { Switch } from '@nextui-org/react';
import { FileText, Text } from 'lucide-react';

type SwitchPdfModeProps = {
  isEnabled: boolean;
  onToggle: () => void;
};

type Props = {}

export const SwitchPDFMode = ({ isEnabled, onToggle }: SwitchPdfModeProps) => {
    return (
        <Switch
            isSelected={isEnabled}
            onChange={onToggle}
            color="primary"
            endContent={<FileText />}
            size="lg"
            startContent={<Text />}
            className="absolute right-10 top-10"
        />
    );
}