"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ToastProvider } from "@/components/ui/ToastProvider";
import { AuthGates } from "@/components/auth/AuthGates";
import { LoadingOverlay } from "@/components/ui/LoadingOverlay";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <ToastProvider>
          <div className='min-h-screen flex flex-col'>
            <Header />
            <main className='flex-1'>{children}</main>
            <Footer />
          </div>

          <AuthGates />
          <LoadingOverlay />
        </ToastProvider>
      </body>
    </html>
  );
}
