import type { Metadata } from "next";
import { Geist, Geist_Mono, DM_Serif_Display, Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./context/AuthContext";
import JsonLd from "./components/JsonLd";
import AnnouncementBar from "./components/AnnouncementBar";

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
    default: "MailMuse — Email Marketing Intelligence for Brands",
    template: "%s | MailMuse",
  },
  description: "Track 7,000+ real emails from 150+ brands across 13 industries. See what top brands send, when they send it, and what works.",
  metadataBase: new URL("https://www.mailmuse.in"),
  openGraph: {
    type: "website",
    siteName: "MailMuse",
    title: "MailMuse — Email Marketing Intelligence for Brands",
    description: "Track 7,000+ real emails from 150+ brands. Competitive intelligence for email marketers.",
    url: "https://www.mailmuse.in",
  },
  twitter: {
    card: "summary_large_image",
    title: "MailMuse — Email Marketing Intelligence",
    description: "Track 7,000+ real emails from 150+ brands across 13 industries.",
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
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "MailMuse",
            url: "https://www.mailmuse.in",
            description:
              "Email Marketing Intelligence for Brands",
            potentialAction: {
              "@type": "SearchAction",
              target:
                "https://www.mailmuse.in/browse?q={search_term_string}",
              "query-input": "required name=search_term_string",
            },
          }}
        />
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "MailMuse",
            url: "https://www.mailmuse.in",
            logo: "https://www.mailmuse.in/icon.svg",
            description:
              "Email marketing intelligence platform that tracks and analyzes campaigns from 150+ brands across 13 industries.",
            sameAs: [],
          }}
        />
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "MailMuse",
            url: "https://www.mailmuse.in",
            description:
              "Email marketing intelligence platform. Browse 7,000+ real emails from 150+ brands. Analyze competitor strategies, subject lines, send frequency, and campaign types. Use any email as an editable template.",
            applicationCategory: "BusinessApplication",
            operatingSystem: "Web",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "INR",
              description:
                "Free forever plan with 10 email views per day. Pro plan for unlimited access.",
            },
          }}
        />
        <AuthProvider>
          <AnnouncementBar />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
