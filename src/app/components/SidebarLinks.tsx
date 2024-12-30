"use client";

import React from "react";
import { SidebarLink } from "./dashboard/sidebar";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
} from "@tabler/icons-react";
import Image from "next/image";

const SidebarLinks = () => {
  const links = [
    {
      label: "Dashboard",
      href: "#",
      icon: (
        <IconBrandTabler className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Profile",
      href: "#",
      icon: (
        <IconUserBolt className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Settings",
      href: "#",
      icon: (
        <IconSettings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Logout",
      href: "#",
      icon: (
        <IconArrowLeft className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
  ];

  return (
    <div className="mt-8 flex flex-col gap-2">
      {links.map((link, idx) => (
        <SidebarLink key={idx} link={link} />
      ))}
      <SidebarLink
        link={{
          label: "Manu Arora",
          href: "#",
          icon: (
            <Image
              src="https://assets.aceternity.com/manu.png"
              className="h-7 w-7 flex-shrink-0 rounded-full"
              width={50}
              height={50}
              alt="Avatar"
            />
          ),
        }}
      />
    </div>
  );
};

export default SidebarLinks;
