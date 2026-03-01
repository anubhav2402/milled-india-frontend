import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up — Create Your Free Account | MailMuse",
  description:
    "Create a free MailMuse account to browse email campaigns from 150+ brands, track competitors, and build templates.",
  alternates: {
    canonical: "https://www.mailmuse.in/signup",
  },
};

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
