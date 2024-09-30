import Footer from "@/components/HomePage/Footer";
import Navbar from "@/components/Navbar"; // Assurez-vous que le chemin est correct
import type { Metadata } from "next";
import localFont from "next/font/local";
import React from "react";
import "../styles/globals.css";
import ReduxProvider from "./providers/ReduxProvider";

// Charger les polices locales
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

// RootLayout avec Redux et les polices
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
        <ReduxProvider>
          <Navbar />
          {children}
          <Footer />
        </ReduxProvider>
      </body>
    </html>
  );
}
