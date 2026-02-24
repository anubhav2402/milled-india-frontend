import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Brands — Email Marketing Directory | MailMuse",
  description: "Discover 150+ brands and their email marketing strategies. Track send frequency, campaign types, and subject line trends.",
  alternates: {
    canonical: "https://www.mailmuse.in/brands",
  },
};

export default function BrandsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
