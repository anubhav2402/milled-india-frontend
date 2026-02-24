import type { Metadata } from "next";
import Header from "../../components/Header";
import JsonLd from "../../components/JsonLd";
import Breadcrumb from "../../components/Breadcrumb";
import Content from "./content.mdx";

export const metadata: Metadata = {
  title: "Email Deliverability: Getting Past the Inbox Gatekeepers",
  description:
    "Practical deliverability tips for brands. Authentication, list hygiene, content optimization, and sender reputation management.",
  openGraph: {
    title: "Email Deliverability: Getting Past the Inbox Gatekeepers",
    description:
      "Practical deliverability tips for brands. Authentication, list hygiene, content optimization, and sender reputation management.",
    type: "article",
    siteName: "MailMuse",
    url: "https://www.mailmuse.in/blog/email-deliverability-tips",
  },
  twitter: {
    card: "summary",
    title: "Email Deliverability: Getting Past the Inbox Gatekeepers",
    description:
      "Practical deliverability tips for brands. Authentication, list hygiene, content optimization, and sender reputation management.",
  },
  alternates: {
    canonical: "https://www.mailmuse.in/blog/email-deliverability-tips",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: "Email Deliverability: Getting Past the Inbox Gatekeepers",
  datePublished: "2026-01-22",
  author: { "@type": "Organization", name: "MailMuse" },
  publisher: {
    "@type": "Organization",
    name: "MailMuse",
    url: "https://www.mailmuse.in",
  },
  url: "https://www.mailmuse.in/blog/email-deliverability-tips",
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
                "Email Deliverability: Getting Past the Inbox Gatekeepers",
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
          Published January 22, 2026
        </p>
        <article>
          <Content />
        </article>
      </div>
    </div>
  );
}
