"use client"

import React, { useState } from 'react';
import { ReferenceTabs } from './local-component/ReferenceTabs';
import { ReferenceDisplay } from './local-component/ReferenceDisplay';

export default function Page() {
  const [selectedTab, setSelectedTab] = useState<string>("rapport");

  return (
    <div className='h-full w-full flex p-10 gap-10 '>
      <div className='flex flex-col gap-10 '>
        <h1 className="text-4xl font-normal w-full">
            Référence
        </h1>
        <ReferenceTabs selectedTab={selectedTab} setSelectedTab={setSelectedTab}/>
      </div>
      <div className="flex w-full h-[full] items-center justify-center">
        <ReferenceDisplay selectedTab={selectedTab}/>
      </div>
    </div>
  );
}
