// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs';
import "./globals.css";
import { ThemeProvider } from "./provider";
import { FloatingNav } from "@/components/ui/FloatingNavbar";
import { navItems } from "@/data";  // ← importiere deine navItems auch hier

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Giuseppe's Portfolio",
  description: "Modern & Minimal Design and Dev Portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          <link rel="icon" href="/jsm-logo.png" sizes="any" />
        </head>
        <body className={inter.className} suppressHydrationWarning>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {/* Floating Navigation – jetzt global auf allen Seiten */}
            <FloatingNav navItems={navItems} />

            {/* Clerk User Button (optional rechts oben) */}
            <header className="fixed top-4 right-4 z-[9999]">
              <SignedIn>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
            </header>

            {/* Hauptinhalt */}
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}