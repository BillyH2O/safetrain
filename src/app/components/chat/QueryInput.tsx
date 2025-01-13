import React from 'react'
import { useChatSettings } from '../context/ChatContext';
import { PlaceholdersAndVanishInput } from '../ui/placeholdersAndVanishInput';

type Props = {}

export const QueryInput = (props: Props) => {
  const { input, handleInputChange, handleSubmit} = useChatSettings();
  const placeholders = [
    "Quels sont les objectifs du document ?",
    "Quels sont les concepts ou idées clés ?",
    "Quelles données ou preuves sont utilisées pour étayer les arguments ?",
    "Quelle est la structure générale du document ?",
    "Quelle est la conclusion ?",
  ];

  return (
    <PlaceholdersAndVanishInput
        input={input}
        placeholders={placeholders}
        onChange={handleInputChange}
        onSubmit={handleSubmit}
    />
  )
}