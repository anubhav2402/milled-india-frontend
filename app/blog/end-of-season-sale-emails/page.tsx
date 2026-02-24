import type { Metadata } from "next";
import Header from "../../components/Header";
import JsonLd from "../../components/JsonLd";
import Breadcrumb from "../../components/Breadcrumb";
import Content from "./content.mdx";

export const metadata: Metadata = {
  title: "End-of-Season Sale Emails: Planning, Timing, and Execution",
  description:
    "How brands maximize revenue during EOSS periods. Multi-email sequences, discount strategies, and subject line formulas.",
  openGraph: {
    title: "End-of-Season Sale Emails: Planning, Timing, and Execution",
    description:
      "How brands maximize revenue during EOSS periods. Multi-email sequences, discount strategies, and subject line formulas.",
    type: "article",
    siteName: "MailMuse",
    url: "https://www.mailmuse.in/blog/end-of-season-sale-emails",
  },
  twitter: {
    card: "summary",
    title: "End-of-Season Sale Emails: Planning, Timing, and Execution",
    description:
      "How brands maximize revenue during EOSS periods. Multi-email sequences, discount strategies, and subject line formulas.",
  },
  alternates: {
    canonical: "https://www.mailmuse.in/blog/end-of-season-sale-emails",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: "End-of-Season Sale Emails: Planning, Timing, and Execution",
  datePublished: "2026-01-16",
  author: { "@type": "Organization", name: "MailMuse" },
  publisher: {
    "@type": "Organization",
    name: "MailMuse",
    url: "https://www.mailmuse.in",
  },
  url: "https://www.mailmuse.in/blog/end-of-season-sale-emails",
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
                "End-of-Season Sale Emails: Planning, Timing, and Execution",
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
          Published January 16, 2026
        </p>
        <article>
          <Content />
        </article>
      </div>
    </div>
  );
}
