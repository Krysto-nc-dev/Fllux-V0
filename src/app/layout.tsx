import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import {ClerkProvider}  from '@clerk/nextjs'
import {dark}  from '@clerk/themes'
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Fllux | Simplifiez la gestion de votre entreprise avec Dolibarr",
  description: "Fllux est une application conçue pour rendre la gestion des entreprises plus efficace et intuitive.",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
    appearance={{baseTheme: dark}}
    >

    <html lang="fr">
      <body className={inter.className}>{children}</body>
    </html>
    </ClerkProvider>
  );
}
