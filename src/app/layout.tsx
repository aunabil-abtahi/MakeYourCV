import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MakeYourCV - AI-First Resume Builder",
  description: "Your career, engineered by AI. Build tailored, professional resumes in minutes with our intelligent CV builder.",
  openGraph: {
    title: "MakeYourCV - AI-First Resume Builder",
    description: "Your career, engineered by AI. Build tailored, professional resumes in minutes.",
    type: "website",
  }
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
