import type { Metadata } from "next";
import { Geist, Geist_Mono, DM_Serif_Display, Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./context/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const dmSerifDisplay = DM_Serif_Display({
  variable: "--font-dm-serif",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "MailMuse — Email Marketing Intelligence for D2C Brands",
    template: "%s | MailMuse",
  },
  description: "Track 7,000+ real emails from 150+ D2C brands across 13 industries. See what top brands send, when they send it, and what works.",
  metadataBase: new URL("https://www.mailmuse.in"),
  openGraph: {
    type: "website",
    siteName: "MailMuse",
    title: "MailMuse — Email Marketing Intelligence for D2C Brands",
    description: "Track 7,000+ real emails from 150+ D2C brands. Competitive intelligence for email marketers.",
    url: "https://www.mailmuse.in",
  },
  twitter: {
    card: "summary_large_image",
    title: "MailMuse — Email Marketing Intelligence",
    description: "Track 7,000+ real emails from 150+ D2C brands across 13 industries.",
  },
  alternates: {
    canonical: "https://www.mailmuse.in",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${dmSerifDisplay.variable} ${inter.variable} antialiased`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
