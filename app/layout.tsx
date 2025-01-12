import type { Metadata } from "next";
import { Inter } from 'next/font/google'
import "./globals.css";

import { cn } from "@/utils";
import Script from "next/script";
import { config } from "@/lib/config";
import { ClerkProvider } from '@clerk/nextjs'
import Head from 'next/head';

export const metadata: Metadata = {
  title: "StarCyv1",
  description: "AI that feels Human",
};

// Validate config ID at runtime
if (!config.humeConfigId) {
  console.error("Hume Config ID is not set!");
}

const inter = Inter({ subsets: ['latin'] })


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
       afterSignOutUrl="/sign-in"
    >
      <html lang="en">
        <body
          className={cn(

            "flex flex-col min-h-screen", inter.className
          )}
        >
          <Head>
            <link rel="icon" href="/favicon.ico" />
            <title>StarCy</title>
          </Head>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
