import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Compass — AI Career Navigator",
  description: "Navigate your career with AI. Find paths that match your skills, survive automation, and thrive in the future of work.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
