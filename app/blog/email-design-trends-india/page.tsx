import type { Metadata } from "next";
import Header from "../../components/Header";
import JsonLd from "../../components/JsonLd";
import Breadcrumb from "../../components/Breadcrumb";
import Content from "./content.mdx";

export const metadata: Metadata = {
  title: "Email Design Trends Shaping Indian D2C in 2026",
  description:
    "Visual trends in D2C email marketing — from minimalist layouts to interactive elements. What works in the Indian market right now.",
  openGraph: {
    title: "Email Design Trends Shaping Indian D2C in 2026",
    description:
      "Visual trends in D2C email marketing — from minimalist layouts to interactive elements. What works in the Indian market right now.",
    type: "article",
    siteName: "MailMuse",
    url: "https://www.mailmuse.in/blog/email-design-trends-india",
  },
  twitter: {
    card: "summary",
    title: "Email Design Trends Shaping Indian D2C in 2026",
    description:
      "Visual trends in D2C email marketing — from minimalist layouts to interactive elements. What works in the Indian market right now.",
  },
  alternates: {
    canonical: "https://www.mailmuse.in/blog/email-design-trends-india",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: "Email Design Trends Shaping Indian D2C in 2026",
  datePublished: "2026-02-01",
  author: { "@type": "Organization", name: "MailMuse" },
  publisher: {
    "@type": "Organization",
    name: "MailMuse",
    url: "https://www.mailmuse.in",
  },
  url: "https://www.mailmuse.in/blog/email-design-trends-india",
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
              label: "Email Design Trends Shaping Indian D2C in 2026",
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
          Published February 1, 2026
        </p>
        <article>
          <Content />
        </article>
      </div>
    </div>
  );
}
