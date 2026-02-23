import type { Metadata } from "next";
import Header from "../../components/Header";
import JsonLd from "../../components/JsonLd";
import Breadcrumb from "../../components/Breadcrumb";
import Content from "./content.mdx";

export const metadata: Metadata = {
  title: "Beyond First Names: Advanced Email Personalization for D2C",
  description:
    "Move past basic personalization with behavioral segmentation, dynamic content, and data-driven targeting strategies used by leading Indian D2C brands.",
  openGraph: {
    title: "Beyond First Names: Advanced Email Personalization for D2C",
    description:
      "Move past basic personalization with behavioral segmentation, dynamic content, and data-driven targeting strategies used by leading Indian D2C brands.",
    type: "article",
    siteName: "MailMuse",
    url: "https://www.mailmuse.in/blog/email-personalization-guide",
  },
  twitter: {
    card: "summary",
    title: "Beyond First Names: Advanced Email Personalization for D2C",
    description:
      "Move past basic personalization with behavioral segmentation, dynamic content, and data-driven targeting strategies used by leading Indian D2C brands.",
  },
  alternates: {
    canonical: "https://www.mailmuse.in/blog/email-personalization-guide",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: "Beyond First Names: Advanced Email Personalization for D2C",
  datePublished: "2026-02-03",
  author: { "@type": "Organization", name: "MailMuse" },
  publisher: {
    "@type": "Organization",
    name: "MailMuse",
    url: "https://www.mailmuse.in",
  },
  url: "https://www.mailmuse.in/blog/email-personalization-guide",
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
                "Beyond First Names: Advanced Email Personalization for D2C",
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
          Published February 3, 2026
        </p>
        <article>
          <Content />
        </article>
      </div>
    </div>
  );
}
