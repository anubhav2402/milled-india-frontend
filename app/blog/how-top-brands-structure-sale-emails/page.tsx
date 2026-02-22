import type { Metadata } from "next";
import Content from "./content.mdx";
import Header from "../../components/Header";
import JsonLd from "../../components/JsonLd";
import Breadcrumb from "../../components/Breadcrumb";

export const metadata: Metadata = {
  title: "How Top Indian D2C Brands Structure Sale Emails",
  description:
    "Breaking down the anatomy of high-performing sale emails from brands like Nykaa, Mamaearth, and boAt.",
  alternates: {
    canonical:
      "https://www.mailmuse.in/blog/how-top-brands-structure-sale-emails",
  },
  openGraph: {
    type: "article",
    title: "How Top Indian D2C Brands Structure Sale Emails",
    description:
      "Anatomy of high-performing sale emails from leading D2C brands.",
    url: "https://www.mailmuse.in/blog/how-top-brands-structure-sale-emails",
  },
};

export default function Post() {
  const blogPostingLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: "How Top Indian D2C Brands Structure Sale Emails",
    datePublished: "2026-02-25",
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
    url: "https://www.mailmuse.in/blog/how-top-brands-structure-sale-emails",
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
            { label: "How Top Brands Structure Sale Emails" },
          ]}
        />
        <div
          style={{
            fontSize: 12,
            color: "var(--color-tertiary)",
            marginBottom: 8,
          }}
        >
          February 25, 2026
        </div>
        <Content />
      </article>
    </div>
  );
}
