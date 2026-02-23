import type { Metadata } from "next";
import Header from "../../components/Header";
import JsonLd from "../../components/JsonLd";
import Breadcrumb from "../../components/Breadcrumb";
import Content from "./content.mdx";

export const metadata: Metadata = {
  title: "The Post-Purchase Email Sequence That Drives Repeat Buys",
  description:
    "Order confirmations, shipping updates, review requests — build a post-purchase email sequence that turns first-time buyers into loyal customers.",
  openGraph: {
    title: "The Post-Purchase Email Sequence That Drives Repeat Buys",
    description:
      "Order confirmations, shipping updates, review requests — build a post-purchase email sequence that turns first-time buyers into loyal customers.",
    type: "article",
    siteName: "MailMuse",
    url: "https://www.mailmuse.in/blog/post-purchase-email-sequence",
  },
  twitter: {
    card: "summary",
    title: "The Post-Purchase Email Sequence That Drives Repeat Buys",
    description:
      "Order confirmations, shipping updates, review requests — build a post-purchase email sequence that turns first-time buyers into loyal customers.",
  },
  alternates: {
    canonical: "https://www.mailmuse.in/blog/post-purchase-email-sequence",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: "The Post-Purchase Email Sequence That Drives Repeat Buys",
  datePublished: "2026-01-24",
  author: { "@type": "Organization", name: "MailMuse" },
  publisher: {
    "@type": "Organization",
    name: "MailMuse",
    url: "https://www.mailmuse.in",
  },
  url: "https://www.mailmuse.in/blog/post-purchase-email-sequence",
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
                "The Post-Purchase Email Sequence That Drives Repeat Buys",
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
          Published January 24, 2026
        </p>
        <article>
          <Content />
        </article>
      </div>
    </div>
  );
}
