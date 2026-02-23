import type { Metadata } from "next";
import Header from "../../components/Header";
import JsonLd from "../../components/JsonLd";
import Breadcrumb from "../../components/Breadcrumb";
import Content from "./content.mdx";

export const metadata: Metadata = {
  title:
    "A/B Testing Your Emails: What Indian D2C Brands Should Test First",
  description:
    "A practical guide to email A/B testing for Indian D2C brands. Subject lines, send times, CTAs — what to test and how to measure results.",
  openGraph: {
    title:
      "A/B Testing Your Emails: What Indian D2C Brands Should Test First",
    description:
      "A practical guide to email A/B testing for Indian D2C brands. Subject lines, send times, CTAs — what to test and how to measure results.",
    type: "article",
    siteName: "MailMuse",
    url: "https://www.mailmuse.in/blog/ab-testing-email-campaigns",
  },
  twitter: {
    card: "summary",
    title:
      "A/B Testing Your Emails: What Indian D2C Brands Should Test First",
    description:
      "A practical guide to email A/B testing for Indian D2C brands. Subject lines, send times, CTAs — what to test and how to measure results.",
  },
  alternates: {
    canonical: "https://www.mailmuse.in/blog/ab-testing-email-campaigns",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline:
    "A/B Testing Your Emails: What Indian D2C Brands Should Test First",
  datePublished: "2026-01-30",
  author: { "@type": "Organization", name: "MailMuse" },
  publisher: {
    "@type": "Organization",
    name: "MailMuse",
    url: "https://www.mailmuse.in",
  },
  url: "https://www.mailmuse.in/blog/ab-testing-email-campaigns",
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
                "A/B Testing Your Emails: What Indian D2C Brands Should Test First",
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
          Published January 30, 2026
        </p>
        <article>
          <Content />
        </article>
      </div>
    </div>
  );
}
