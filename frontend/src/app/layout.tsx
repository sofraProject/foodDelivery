// app/layout.tsx
import type { Metadata } from "next";
import localFont from "next/font/local";
import "../styles/globals.css";

import ReduxProvider from "./providers/ReduxProvider"; // Assurez-vous que ce chemin est correct

// Charger les polices locales avec Next.js
const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// Metadonnées pour la page
export const metadata: Metadata = {
  title: "Your App Title",
  description: "Your App Description",
};

// RootLayout qui englobe toute l'application avec Redux et les polices
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Intégration de ReduxProvider pour toute l'application */}
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
