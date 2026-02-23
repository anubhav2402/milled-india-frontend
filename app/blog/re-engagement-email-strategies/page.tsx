import type { Metadata } from "next";
import Header from "../../components/Header";
import JsonLd from "../../components/JsonLd";
import Breadcrumb from "../../components/Breadcrumb";
import Content from "./content.mdx";

export const metadata: Metadata = {
  title: "Win Back Inactive Subscribers: Re-engagement Email Strategies",
  description:
    "Data-driven re-engagement tactics from Indian D2C brands. When to send, what to offer, and how to clean your list effectively.",
  openGraph: {
    title: "Win Back Inactive Subscribers: Re-engagement Email Strategies",
    description:
      "Data-driven re-engagement tactics from Indian D2C brands. When to send, what to offer, and how to clean your list effectively.",
    type: "article",
    siteName: "MailMuse",
    url: "https://www.mailmuse.in/blog/re-engagement-email-strategies",
  },
  twitter: {
    card: "summary",
    title: "Win Back Inactive Subscribers: Re-engagement Email Strategies",
    description:
      "Data-driven re-engagement tactics from Indian D2C brands. When to send, what to offer, and how to clean your list effectively.",
  },
  alternates: {
    canonical:
      "https://www.mailmuse.in/blog/re-engagement-email-strategies",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline:
    "Win Back Inactive Subscribers: Re-engagement Email Strategies",
  datePublished: "2026-02-07",
  author: { "@type": "Organization", name: "MailMuse" },
  publisher: {
    "@type": "Organization",
    name: "MailMuse",
    url: "https://www.mailmuse.in",
  },
  url: "https://www.mailmuse.in/blog/re-engagement-email-strategies",
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
                "Win Back Inactive Subscribers: Re-engagement Email Strategies",
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
          Published February 7, 2026
        </p>
        <article>
          <Content />
        </article>
      </div>
    </div>
  );
}
