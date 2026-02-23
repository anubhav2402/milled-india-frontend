import type { Metadata } from "next";
import Header from "../../components/Header";
import JsonLd from "../../components/JsonLd";
import Breadcrumb from "../../components/Breadcrumb";
import Content from "./content.mdx";

export const metadata: Metadata = {
  title: "Why Mobile-First Email Design Is Non-Negotiable for D2C",
  description:
    "Over 70% of Indian D2C emails are opened on mobile. Design principles, layout strategies, and CTA placement for mobile-first email campaigns.",
  openGraph: {
    title: "Why Mobile-First Email Design Is Non-Negotiable for D2C",
    description:
      "Over 70% of Indian D2C emails are opened on mobile. Design principles, layout strategies, and CTA placement for mobile-first email campaigns.",
    type: "article",
    siteName: "MailMuse",
    url: "https://www.mailmuse.in/blog/mobile-first-email-design",
  },
  twitter: {
    card: "summary",
    title: "Why Mobile-First Email Design Is Non-Negotiable for D2C",
    description:
      "Over 70% of Indian D2C emails are opened on mobile. Design principles, layout strategies, and CTA placement for mobile-first email campaigns.",
  },
  alternates: {
    canonical: "https://www.mailmuse.in/blog/mobile-first-email-design",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: "Why Mobile-First Email Design Is Non-Negotiable for D2C",
  datePublished: "2026-01-14",
  author: { "@type": "Organization", name: "MailMuse" },
  publisher: {
    "@type": "Organization",
    name: "MailMuse",
    url: "https://www.mailmuse.in",
  },
  url: "https://www.mailmuse.in/blog/mobile-first-email-design",
};

export default function Post() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--color-surface)" }}>
      <JsonLd data={jsonLd} />
      <Header />
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "32px 24px" }}>
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Blog", href: "/blog" },
            {
              label:
                "Why Mobile-First Email Design Is Non-Negotiable for D2C",
            },
          ]}
        />
        <p
          style={{
            fontSize: 13,
            color: "var(--color-tertiary)",
            margin: "0 0 16px",
          }}
        >
          Published January 14, 2026
        </p>
        <article>
          <Content />
        </article>
      </div>
    </div>
  );
}
