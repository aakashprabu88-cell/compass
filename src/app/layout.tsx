import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/Toast";
import { LanguageProvider } from "@/components/LanguageProvider";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Compass — AI Career Counselor for Every Indian Student",
  description: "India has 350 million students and only 10,000 career counselors. Compass is the AI career counselor that works in Hindi and English. Free. For every student.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased" style={{ background: "#0a0a0f", color: "#f0f0f5", minHeight: "100vh" }}>
        <LanguageProvider>
          {children}
        </LanguageProvider>
        <Toaster />
      </body>
    </html>
  );
}
