import type { Metadata } from "next";
import Content from "./content.mdx";
import Header from "../../components/Header";
import JsonLd from "../../components/JsonLd";
import Breadcrumb from "../../components/Breadcrumb";

export const metadata: Metadata = {
  title:
    "Subject Line Strategies That Get Opens: Lessons from 7,000+ D2C Emails",
  description:
    "Data-driven analysis of subject line patterns from 150+ Indian D2C brands. What length, emoji usage, and word choices drive opens.",
  alternates: {
    canonical: "https://www.mailmuse.in/blog/subject-line-strategies",
  },
  openGraph: {
    type: "article",
    title: "Subject Line Strategies That Get Opens",
    description:
      "Data-driven subject line analysis from 7,000+ D2C emails.",
    url: "https://www.mailmuse.in/blog/subject-line-strategies",
  },
};

export default function Post() {
  const blogPostingLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline:
      "Subject Line Strategies That Get Opens: Lessons from 7,000+ D2C Emails",
    datePublished: "2026-02-22",
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
    url: "https://www.mailmuse.in/blog/subject-line-strategies",
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
            { label: "Subject Line Strategies" },
          ]}
        />
        <div
          style={{
            fontSize: 12,
            color: "var(--color-tertiary)",
            marginBottom: 8,
          }}
        >
          February 22, 2026
        </div>
        <Content />
      </article>
    </div>
  );
}
