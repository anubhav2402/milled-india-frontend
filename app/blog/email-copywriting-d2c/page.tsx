import type { Metadata } from "next";
import Header from "../../components/Header";
import JsonLd from "../../components/JsonLd";
import Breadcrumb from "../../components/Breadcrumb";
import Content from "./content.mdx";

export const metadata: Metadata = {
  title: "Email Copywriting That Sells: Lessons from Top Brands",
  description:
    "Copywriting patterns from high-performing brand emails. Subject lines, preview text, body copy, and CTAs that drive action.",
  openGraph: {
    title: "Email Copywriting That Sells: Lessons from Top Brands",
    description:
      "Copywriting patterns from high-performing brand emails. Subject lines, preview text, body copy, and CTAs that drive action.",
    type: "article",
    siteName: "MailMuse",
    url: "https://www.mailmuse.in/blog/email-copywriting-d2c",
  },
  twitter: {
    card: "summary",
    title: "Email Copywriting That Sells: Lessons from Top Brands",
    description:
      "Copywriting patterns from high-performing brand emails. Subject lines, preview text, body copy, and CTAs that drive action.",
  },
  alternates: {
    canonical: "https://www.mailmuse.in/blog/email-copywriting-d2c",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: "Email Copywriting That Sells: Lessons from Top Brands",
  datePublished: "2026-01-18",
  author: { "@type": "Organization", name: "MailMuse" },
  publisher: {
    "@type": "Organization",
    name: "MailMuse",
    url: "https://www.mailmuse.in",
  },
  url: "https://www.mailmuse.in/blog/email-copywriting-d2c",
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
                "Email Copywriting That Sells: Lessons from Top Brands",
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
          Published January 18, 2026
        </p>
        <article>
          <Content />
        </article>
      </div>
    </div>
  );
}
