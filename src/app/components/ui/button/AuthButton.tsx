"use client";

import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";
import Logo from "../Logo";

export default function AuthButton() {
  const { userId } = useAuth();

  return (
    <div>
      {!!userId ? (
        <Link href="/dashboard">
          <button className="flex gap-2 bg-foreground rounded-full w-fit text-background dark:text-black px-4 py-2">
            Aller au dashboard
          </button>
        </Link>
      ) : (
        <div>
        <Link href="/sign-in">
          <button className="flex items-center gap-2 bg-background rounded-full w-fit text-foreground px-4 py-2 border border-border">
            Connexion
            <Logo isClickable={false} size="xs"/>
          </button>
        </Link>
        </div>
      )}
    </div>
  );
}
