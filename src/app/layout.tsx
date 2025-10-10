"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ToastProvider } from "@/components/ui/ToastProvider";
import { OnboardingHandler } from "@/components/auth/OnboardingHandler";
import { LoadingOverlay } from "@/components/ui/LoadingOverlay";
import { RouteGuard } from "@/components/auth/RouteGuard";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <head>
        <script src="https://accounts.google.com/gsi/client" async defer></script>
      </head>
      <body className={inter.className}>
        <ToastProvider>
          <div className='min-h-screen flex flex-col'>
            <Header />
            <main className='flex-1'>{children}</main>
            <Footer />
          </div>

          <RouteGuard />
          <OnboardingHandler />
          <LoadingOverlay />
        </ToastProvider>
      </body>
    </html>
  );
}
