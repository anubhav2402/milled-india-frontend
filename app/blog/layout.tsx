import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Blog — D2C Email Marketing Insights | MailMuse",
    template: "%s | MailMuse Blog",
  },
  description:
    "Expert analysis and trends in D2C email marketing. Data-driven insights from 7,000+ emails across 150+ brands.",
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
