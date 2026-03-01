import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Blog — Email Marketing Insights | MailMuse",
    template: "%s | MailMuse Blog",
  },
  description:
    "Expert analysis and trends in email marketing. Data-driven insights from 100,000+ emails across 10,000+ brands.",
  alternates: {
    canonical: "https://www.mailmuse.in/blog",
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
