import type { Metadata } from "next";
import Header from "../../components/Header";
import JsonLd from "../../components/JsonLd";
import Breadcrumb from "../../components/Breadcrumb";
import Content from "./content.mdx";

export const metadata: Metadata = {
  title: "How to Build a Welcome Email Sequence That Converts",
  description:
    "Data-backed best practices for welcome emails from 150+ top brands. Timing, content, and strategies that turn new subscribers into customers.",
  openGraph: {
    title: "How to Build a Welcome Email Sequence That Converts",
    description:
      "Data-backed best practices for welcome emails from 150+ top brands. Timing, content, and strategies that turn new subscribers into customers.",
    type: "article",
    siteName: "MailMuse",
    url: "https://www.mailmuse.in/blog/welcome-email-best-practices",
  },
  twitter: {
    card: "summary",
    title: "How to Build a Welcome Email Sequence That Converts",
    description:
      "Data-backed best practices for welcome emails from 150+ top brands. Timing, content, and strategies that turn new subscribers into customers.",
  },
  alternates: {
    canonical: "https://www.mailmuse.in/blog/welcome-email-best-practices",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: "How to Build a Welcome Email Sequence That Converts",
  datePublished: "2026-02-15",
  author: { "@type": "Organization", name: "MailMuse" },
  publisher: {
    "@type": "Organization",
    name: "MailMuse",
    url: "https://www.mailmuse.in",
  },
  url: "https://www.mailmuse.in/blog/welcome-email-best-practices",
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
            { label: "How to Build a Welcome Email Sequence That Converts" },
          ]}
        />
        <p
          style={{
            fontSize: 13,
            color: "var(--color-tertiary)",
            margin: "0 0 16px",
          }}
        >
          Published February 15, 2026
        </p>
        <article>
          <Content />
        </article>
      </div>
    </div>
  );
}
