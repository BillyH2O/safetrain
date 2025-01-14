import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "./lib/utils";
import { Inter } from "next/font/google";
import { Aleo } from 'next/font/google';
import Providers from "./components/layout/Providers";
import { ClerkProvider, SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import {Toaster} from 'react-hot-toast'


const inter = Inter({ subsets: ["latin"] });

const aleo = Aleo({
  subsets: ['latin'], // Pour inclure le support des caractères latins
  weight: ['300', '400', '700'], // Poids de la police
});

export const metadata: Metadata = {
  title: "Safetrain IA",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="">
        <body className={cn(aleo.className,  "min-h-screen antialiased")}>
          <Providers>
          <main className="h-screen text-foreground bg-background">{children}</main>
          </Providers>
          <Toaster position="bottom-right" reverseOrder={false}/>
        </body>
      </html>
    </ClerkProvider>
  );
}
