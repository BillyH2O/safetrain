"use client";

import React from "react";
import { SidebarLink } from "./sidebar";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
} from "@tabler/icons-react";
import { BrainCircuit, Compass } from "lucide-react";

const SidebarLinks = () => {
  const topLinks = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: (
        <IconBrandTabler className="foreground h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Playground",
      href: "/dashboard/playground",
      icon: (
        <BrainCircuit className="foreground h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Profile",
      href: "#",
      icon: (
        <IconUserBolt className="foreground h-5 w-5 flex-shrink-0" />
      ),
    },
  ];

  const bottomLinks = [
    {
      label: "Paramètres",
      href: "/dashboard/parametres",
      icon: (
        <IconSettings className="foreground h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Réference",
      href: "/dashboard/reference",
      icon: (
        <Compass className="foreground h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Logout",
      href: "#/sign-out",
      icon: (
        <IconArrowLeft className="foreground h-5 w-5 flex-shrink-0" />
      ),
    },
  ];

  return (
    <div className="mt-8 flex h-[70%] flex-col items-center text-foreground">
      <div className="flex flex-col gap-10">
        {topLinks.map((link, idx) => (
          <SidebarLink key={idx} link={link} />
        ))}
      </div>

      <div className="mt-auto flex flex-col gap-5 border-t border-foreground pt-5">
        {bottomLinks.map((link, idx) => (
          <SidebarLink key={idx} link={link} />
        ))}
      </div>
    </div>
  );
};

export default SidebarLinks;
