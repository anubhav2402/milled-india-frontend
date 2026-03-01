import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Browse Email Campaigns — Brand Emails | MailMuse",
  description: "Browse 100,000+ email campaigns from 10,000+ brands. Filter by industry, brand, and campaign type. Find email marketing inspiration.",
  alternates: {
    canonical: "https://www.mailmuse.in/browse",
  },
};

export default function BrowseLayout({ children }: { children: React.ReactNode }) {
  return children;
}
