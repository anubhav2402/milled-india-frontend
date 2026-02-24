import type { Metadata } from "next";
import Header from "../../components/Header";
import JsonLd from "../../components/JsonLd";
import Breadcrumb from "../../components/Breadcrumb";
import Content from "./content.mdx";

export const metadata: Metadata = {
  title: "The Email Metrics That Actually Matter for Brands",
  description:
    "Cut through vanity metrics. Focus on the email KPIs that drive revenue — open rates, click rates, conversion, and customer lifetime value.",
  openGraph: {
    title: "The Email Metrics That Actually Matter for Brands",
    description:
      "Cut through vanity metrics. Focus on the email KPIs that drive revenue — open rates, click rates, conversion, and customer lifetime value.",
    type: "article",
    siteName: "MailMuse",
    url: "https://www.mailmuse.in/blog/email-metrics-guide",
  },
  twitter: {
    card: "summary",
    title: "The Email Metrics That Actually Matter for Brands",
    description:
      "Cut through vanity metrics. Focus on the email KPIs that drive revenue — open rates, click rates, conversion, and customer lifetime value.",
  },
  alternates: {
    canonical: "https://www.mailmuse.in/blog/email-metrics-guide",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: "The Email Metrics That Actually Matter for Brands",
  datePublished: "2026-01-10",
  author: { "@type": "Organization", name: "MailMuse" },
  publisher: {
    "@type": "Organization",
    name: "MailMuse",
    url: "https://www.mailmuse.in",
  },
  url: "https://www.mailmuse.in/blog/email-metrics-guide",
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
                "The Email Metrics That Actually Matter for Brands",
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
          Published January 10, 2026
        </p>
        <article>
          <Content />
        </article>
      </div>
    </div>
  );
}
