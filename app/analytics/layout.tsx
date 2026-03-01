import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Email Analytics & Benchmarks | MailMuse",
  description:
    "Email marketing analytics and benchmarks from 150+ brands. Send frequency, subject line trends, campaign type breakdowns, and competitive intelligence.",
  alternates: {
    canonical: "https://www.mailmuse.in/analytics",
  },
};

export default function AnalyticsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
