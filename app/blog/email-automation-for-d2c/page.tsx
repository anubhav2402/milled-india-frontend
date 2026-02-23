import type { Metadata } from "next";
import Header from "../../components/Header";
import JsonLd from "../../components/JsonLd";
import Breadcrumb from "../../components/Breadcrumb";
import Content from "./content.mdx";

export const metadata: Metadata = {
  title: "Essential Email Automations Every D2C Brand Needs",
  description:
    "The must-have automated email flows for Indian D2C brands. From welcome sequences to win-back campaigns — set up once, convert forever.",
  openGraph: {
    title: "Essential Email Automations Every D2C Brand Needs",
    description:
      "The must-have automated email flows for Indian D2C brands. From welcome sequences to win-back campaigns — set up once, convert forever.",
    type: "article",
    siteName: "MailMuse",
    url: "https://www.mailmuse.in/blog/email-automation-for-d2c",
  },
  twitter: {
    card: "summary",
    title: "Essential Email Automations Every D2C Brand Needs",
    description:
      "The must-have automated email flows for Indian D2C brands. From welcome sequences to win-back campaigns — set up once, convert forever.",
  },
  alternates: {
    canonical: "https://www.mailmuse.in/blog/email-automation-for-d2c",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: "Essential Email Automations Every D2C Brand Needs",
  datePublished: "2026-01-28",
  author: { "@type": "Organization", name: "MailMuse" },
  publisher: {
    "@type": "Organization",
    name: "MailMuse",
    url: "https://www.mailmuse.in",
  },
  url: "https://www.mailmuse.in/blog/email-automation-for-d2c",
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
              label: "Essential Email Automations Every D2C Brand Needs",
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
          Published January 28, 2026
        </p>
        <article>
          <Content />
        </article>
      </div>
    </div>
  );
}
