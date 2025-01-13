import React, { useEffect } from 'react';
import { ButtonFeature } from './ButtonFeature';
import { Book, ChartSpline, LetterText, Pyramid, Radiation, Sigma } from 'lucide-react';
import { useChat } from 'ai/react';
import { useChatSettings } from './context/ChatContext';
import { DeleteButton } from './ui/DeleteButton';

type ListButtonFeatureProps = {
  variant?: "large" | "small";
};

export const ListButtonFeature = ({variant}: ListButtonFeatureProps ) => {
  const { handleSubmit, setInput, idConfigSelected, setIdConfigSelected } = useChatSettings(); 

  const handleButtonClick = (config_id: number, label: string) => {
    setIdConfigSelected(config_id);
    setInput(label);
  };

  useEffect(() => {
    if (idConfigSelected !== null) {
      // Peut-être attendre la fin d'une requête pour récupérer configData ensuite, on lance handleSubmit()
      handleSubmit();
    }
  }, [idConfigSelected]);


  const buttonSize = variant === "large" ? "lg" : "sm";

  return (
    <div className="w-[70%] flex flex-wrap items-center justify-center gap-5">
      <ButtonFeature 
        config_id={41}
        label="Résumer un texte"
        icon={<LetterText color="brown" />}
        onButtonClick={handleButtonClick}
        size={buttonSize}
      />
      <ButtonFeature 
        config_id={42}
        label="Répondre à une question technique"
        icon={<Radiation color="orange" />}
        onButtonClick={handleButtonClick}
        size={buttonSize}
      />
      <ButtonFeature 
        config_id={43}
        label="Analyser des données"
        icon={<Sigma color="cyan" />}
        onButtonClick={handleButtonClick}
        size={buttonSize}
      />
      <ButtonFeature 
        config_id={44}
        label="Générer un QCM"
        icon={<ChartSpline color="green" />}
        onButtonClick={handleButtonClick}
        size={buttonSize}
      />
      <ButtonFeature 
        config_id={45}
        label="Créer une fiche de révision"
        icon={<Book color="violet" />}
        onButtonClick={handleButtonClick}
        size={buttonSize}
      />
      <ButtonFeature 
        config_id={46}
        label="Proposer des idées"
        icon={<Pyramid color="white" />}
        onButtonClick={handleButtonClick}
        size={buttonSize}
      />
    </div>
  );
};