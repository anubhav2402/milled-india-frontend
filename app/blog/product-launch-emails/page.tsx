import type { Metadata } from "next";
import Header from "../../components/Header";
import JsonLd from "../../components/JsonLd";
import Breadcrumb from "../../components/Breadcrumb";
import Content from "./content.mdx";

export const metadata: Metadata = {
  title: "How Indian D2C Brands Announce New Products via Email",
  description:
    "Analyze new arrival email strategies from leading Indian D2C brands. Teaser sequences, launch day tactics, and follow-up approaches.",
  openGraph: {
    title: "How Indian D2C Brands Announce New Products via Email",
    description:
      "Analyze new arrival email strategies from leading Indian D2C brands. Teaser sequences, launch day tactics, and follow-up approaches.",
    type: "article",
    siteName: "MailMuse",
    url: "https://www.mailmuse.in/blog/product-launch-emails",
  },
  twitter: {
    card: "summary",
    title: "How Indian D2C Brands Announce New Products via Email",
    description:
      "Analyze new arrival email strategies from leading Indian D2C brands. Teaser sequences, launch day tactics, and follow-up approaches.",
  },
  alternates: {
    canonical: "https://www.mailmuse.in/blog/product-launch-emails",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: "How Indian D2C Brands Announce New Products via Email",
  datePublished: "2026-02-09",
  author: { "@type": "Organization", name: "MailMuse" },
  publisher: {
    "@type": "Organization",
    name: "MailMuse",
    url: "https://www.mailmuse.in",
  },
  url: "https://www.mailmuse.in/blog/product-launch-emails",
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
              label: "How Indian D2C Brands Announce New Products via Email",
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
          Published February 9, 2026
        </p>
        <article>
          <Content />
        </article>
      </div>
    </div>
  );
}
