import React from 'react'

type Props = { 
    selectedTab: string
}

export const ReferenceDisplay = ({ selectedTab }: Props) => {
    return (
      <div className="w-[90%] h-full flex justify-center items-center">
        {selectedTab === "rapport" && (
          <iframe 
            src="/docs/rapport-safetrain.pdf"
            className="w-full h-full border border-gray-300 rounded-md" 
            title="Rapport"
          ></iframe>
        )}
        {selectedTab === "présentation" && (
          <iframe 
          src="/docs/presentation.pdf" 
            className="w-full h-full border border-gray-300 rounded-md" 
            title="Présentation"
          ></iframe>
        )}
        {selectedTab === "démo" && (
          <iframe 
            src="https://youtu.be/CtiYCU3QXWk" 
            className="w-full h-full  border border-gray-300 rounded-md" 
            title="Démo"
            allowFullScreen
          ></iframe>
        )}
      </div>
    );
  };
  