import React from 'react'

type Props = { 
    selectedTab: string
}

export const ReferenceDisplay = ({ selectedTab }: Props) => {
    return (
      <div className="w-[90%] h-full flex justify-center items-center">
        {selectedTab === "rapport" && (
          <iframe 
            src="/docs/rapport.pdf"
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
            src="https://www.youtube.com/embed/rrB13utjYV4" 
            className="w-full h-full  border border-gray-300 rounded-md" 
            title="Démo"
            allowFullScreen
          ></iframe>
        )}
      </div>
    );
  };
  