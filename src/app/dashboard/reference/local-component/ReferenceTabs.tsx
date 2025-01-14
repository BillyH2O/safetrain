import React from 'react'
import { Tabs, Tab } from "@nextui-org/react";
import { FileChartColumnIncreasing, MonitorPlay, Presentation } from "lucide-react";
    
type Props = { 
    selectedTab: string; 
    setSelectedTab: (key: string) => void 
}

export const ReferenceTabs = ({ selectedTab, setSelectedTab }: Props) => {
    return (
        <Tabs 
          aria-label="Options" 
          color="secondary" 
          variant="bordered" 
          isVertical
          selectedKey={selectedTab} 
          onSelectionChange={(key) => setSelectedTab(String(key))}
        >
          <Tab
            key="rapport"
            title={
              <div className="flex items-center space-x-2">
                <FileChartColumnIncreasing size={20} />
                <span>Rapport</span>
              </div>
            }
          />
          <Tab
            key="présentation"
            title={
              <div className="flex items-center space-x-2">
                <Presentation size={20} />
                <span>Diapo</span>
              </div>
            }
          />
          <Tab
            key="démo"
            title={
              <div className="flex items-center space-x-2">
                <MonitorPlay size={20} />
                <span>Démo</span>
              </div>
            }
          />
        </Tabs>
      );
};
