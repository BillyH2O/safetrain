"use client";

import { useAuth } from "@clerk/nextjs";
import { LogInIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function AuthButton() {
  const { userId } = useAuth();

  return (
    <div>
      {!!userId ? (
        <Link href="/dashboard"><button className="flex gap-2 bg-white rounded-full w-fit text-white dark:text-black px-4 py-2">Aller au dashboard</button></Link>
      ) : (
        <Link href="/sign-in">
          <button className="flex gap-2 bg-white rounded-full w-fit text-white dark:text-black px-4 py-2">
            <label>Connexion</label>
            <LogInIcon color="grey" />
          </button>
        </Link>
      )}
    </div>
  );
}
