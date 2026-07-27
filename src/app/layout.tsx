import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/Toast";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Compass — AI Career Navigator",
  description: "Navigate your career with AI. Find paths that match your skills, survive automation, and thrive in the future of work.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased" style={{ background: "#0a0a0f", color: "#f0f0f5", minHeight: "100vh" }}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
