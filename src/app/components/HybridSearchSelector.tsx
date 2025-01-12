import { Switch } from '@nextui-org/react';
import React from 'react';
import { useChatSettings } from './context/ChatContext';

type Props = {
    isPlayground:boolean
}

const HybridSearchSelector = ({isPlayground}: Props) => {
  const { isHybridSearch, setHybridSearch } = useChatSettings();

  return (
    <Switch isSelected={isHybridSearch} onValueChange={setHybridSearch} color='secondary' isDisabled={!isPlayground}>
      <div className='text-xs w-20'>Hybrid Search</div>
    </Switch>
  );
};

export default HybridSearchSelector;
