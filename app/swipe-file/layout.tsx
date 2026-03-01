import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Email Swipe File — Save & Organize Campaigns | MailMuse",
  description:
    "Save your favorite email campaigns to your personal swipe file. Organize inspiration from 150+ brands for your next campaign.",
  alternates: {
    canonical: "https://www.mailmuse.in/swipe-file",
  },
};

export default function SwipeFileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
