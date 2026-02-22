import type { Metadata } from "next";
import Content from "./content.mdx";
import Header from "../../components/Header";
import JsonLd from "../../components/JsonLd";
import Breadcrumb from "../../components/Breadcrumb";

export const metadata: Metadata = {
  title: "D2C Email Marketing Trends to Watch in 2026",
  description:
    "Key email marketing trends shaping Indian D2C brands — from hyper-personalization to AI-generated subject lines.",
  alternates: {
    canonical:
      "https://www.mailmuse.in/blog/d2c-email-marketing-trends-2026",
  },
  openGraph: {
    type: "article",
    title: "D2C Email Marketing Trends to Watch in 2026",
    description:
      "Key email marketing trends shaping Indian D2C brands.",
    url: "https://www.mailmuse.in/blog/d2c-email-marketing-trends-2026",
  },
};

export default function Post() {
  const blogPostingLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: "D2C Email Marketing Trends to Watch in 2026",
    datePublished: "2026-02-20",
    author: {
      "@type": "Organization",
      name: "MailMuse",
      url: "https://www.mailmuse.in",
    },
    publisher: {
      "@type": "Organization",
      name: "MailMuse",
      url: "https://www.mailmuse.in",
    },
    url: "https://www.mailmuse.in/blog/d2c-email-marketing-trends-2026",
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-surface)" }}>
      <JsonLd data={blogPostingLd} />
      <Header />
      <article
        style={{ maxWidth: 720, margin: "0 auto", padding: "32px 24px" }}
      >
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Blog", href: "/blog" },
            { label: "D2C Email Marketing Trends 2026" },
          ]}
        />
        <div
          style={{
            fontSize: 12,
            color: "var(--color-tertiary)",
            marginBottom: 8,
          }}
        >
          February 20, 2026
        </div>
        <Content />
      </article>
    </div>
  );
}
