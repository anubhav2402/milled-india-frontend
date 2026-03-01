import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing — Free & Pro Plans | MailMuse",
  description:
    "MailMuse is free forever with 10 email views per day. Upgrade to Pro for unlimited access to 7,000+ emails, analytics, template editor, and more.",
  alternates: {
    canonical: "https://www.mailmuse.in/pricing",
  },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
