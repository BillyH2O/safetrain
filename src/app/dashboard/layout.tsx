"use client";

import React, { useState, useEffect } from "react";
import { cn } from "../lib/utils";
import DashboardLoader from "../components/layout/DashboardLoader";

import Header from "../components/layout/Header";
import { Sidebar, SidebarBody } from "../components/layout/sidebar";
import SidebarLinks from "../components/layout/SidebarLinks";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // Simuler un chargement initial de 1 secondes

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <DashboardLoader />;
  }

  return (
    <div
      className={cn(
        "rounded-md flex flex-col md:flex-row bg-secondary flex-1 mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden",
        "h-screen w-screen"
      )}
    >      
      <div className="flex flex-col">
        
        <div><Header/></div>

        <div className="rounded-md flex flex-col md:flex-row bg-secondary flex-1 mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden *:* h-screen w-screen">
            <Sidebar open={open} setOpen={setOpen} animate={true}>
            <SidebarBody className="justify-between gap-10">
              <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden"><SidebarLinks /></div>
            </SidebarBody>
          </Sidebar>
          
          <div className="flex flex-1 flex-col items-center
          bg-background overflow-hidden  
            rounded-tl-2xl border border-border"> 
            {children}
          </div>

        </div>

      </div>
    </div>
  );
};

export default DashboardLayout;
