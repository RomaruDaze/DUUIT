import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import InstallPrompt from '@/components/InstallPrompt';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DUIT - Just Do It",
  description: "Just Do It - Stay organized and productive",
  manifest: "/manifest.webmanifest",
  themeColor: "#000000",
  viewport:
    "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "DUIT",
  },
  icons: {
    icon: "/icon-192x192.ico",
    apple: "/icon-192x192.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.webmanifest" />
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="DUIT" />
        <link rel="apple-touch-icon" href="/icon-192x192.ico" />
        
        {/* Better PWA support */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="DUIT" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="msapplication-tap-highlight" content="no" />
        
        {/* iOS specific */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="DUIT" />
        <link rel="apple-touch-startup-image" href="/icon-512x512.ico" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
        <InstallPrompt />
      </body>
    </html>
  );
}
