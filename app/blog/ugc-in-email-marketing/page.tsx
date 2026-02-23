import type { Metadata } from "next";
import Header from "../../components/Header";
import JsonLd from "../../components/JsonLd";
import Breadcrumb from "../../components/Breadcrumb";
import Content from "./content.mdx";

export const metadata: Metadata = {
  title: "Using Customer Reviews and UGC in Email Campaigns",
  description:
    "How Indian D2C brands leverage user-generated content in emails to build trust, boost engagement, and drive social proof at scale.",
  openGraph: {
    title: "Using Customer Reviews and UGC in Email Campaigns",
    description:
      "How Indian D2C brands leverage user-generated content in emails to build trust, boost engagement, and drive social proof at scale.",
    type: "article",
    siteName: "MailMuse",
    url: "https://www.mailmuse.in/blog/ugc-in-email-marketing",
  },
  twitter: {
    card: "summary",
    title: "Using Customer Reviews and UGC in Email Campaigns",
    description:
      "How Indian D2C brands leverage user-generated content in emails to build trust, boost engagement, and drive social proof at scale.",
  },
  alternates: {
    canonical: "https://www.mailmuse.in/blog/ugc-in-email-marketing",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: "Using Customer Reviews and UGC in Email Campaigns",
  datePublished: "2026-01-12",
  author: { "@type": "Organization", name: "MailMuse" },
  publisher: {
    "@type": "Organization",
    name: "MailMuse",
    url: "https://www.mailmuse.in",
  },
  url: "https://www.mailmuse.in/blog/ugc-in-email-marketing",
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
              label: "Using Customer Reviews and UGC in Email Campaigns",
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
          Published January 12, 2026
        </p>
        <article>
          <Content />
        </article>
      </div>
    </div>
  );
}
