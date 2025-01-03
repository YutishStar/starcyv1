import type { Metadata } from "next";
// import { GeistSans } from "geist/font/sans";
// import { GeistMono } from "geist/font/mono";
import "./globals.css";

import { cn } from "@/utils";
import Script from "next/script";
import { config } from "@/lib/config";
import { ClerkProvider } from '@clerk/nextjs'

export const metadata: Metadata = {
  title: "Hume AI visualizer",
  description: " Hume AI's Empathic Voice Interface",
};

// Validate config ID at runtime
if (!config.humeConfigId) {
  console.error("Hume Config ID is not set!");
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={cn(

            "flex flex-col min-h-screen"
          )}
        >

          {children}
          <Script src="./cursor.js" strategy="afterInteractive"/>
        </body>
      </html>
    </ClerkProvider>
  );
}
