import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Browse Email Campaigns — D2C Brand Emails | MailMuse",
  description: "Browse 7,000+ email campaigns from 150+ D2C brands. Filter by industry, brand, and campaign type. Find email marketing inspiration.",
  alternates: {
    canonical: "https://www.mailmuse.in/browse",
  },
};

export default function BrowseLayout({ children }: { children: React.ReactNode }) {
  return children;
}
