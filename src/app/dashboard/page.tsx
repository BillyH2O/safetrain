"use client";

import React, { useState } from "react";
import { Sidebar, SidebarBody } from "../components/dashboard/sidebar";
import { cn } from "../lib/utils";
import Logo from "../components/dashboard/Logo";
import SidebarLinks from "../components/SidebarLinks";
import Dashboard from "../components/dashboard/Dashboard";

const Page = () => {
  const [open, setOpen] = useState(false);

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
      <Dashboard />
    </div>
  );
};

export default Page;
