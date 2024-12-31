"use client";

import React, { useState, useEffect } from "react";
import { Sidebar, SidebarBody } from "../components/dashboard/sidebar";
import Logo from "../components/dashboard/Logo";
import { cn } from "../lib/utils";
import SidebarLinks from "../components/SidebarLinks";
import DashboardLoader from "../components/dashboard/DashboardLoader";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simuler un chargement initial de 2 secondes
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <DashboardLoader />;
  }

  return (
    <div
      className={cn(
        "rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 flex-1 mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden",
        "h-screen w-screen"
      )}
    >
      <Sidebar open={open} setOpen={setOpen} animate={true}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            <Logo />
            <SidebarLinks />
          </div>
        </SidebarBody>
      </Sidebar>
      <div className="flex flex-1 h-full bg-white dark:bg-neutral-900 flex-col gap-2 overflow-hidden">
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
