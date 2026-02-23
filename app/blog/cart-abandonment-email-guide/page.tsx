import type { Metadata } from "next";
import Header from "../../components/Header";
import JsonLd from "../../components/JsonLd";
import Breadcrumb from "../../components/Breadcrumb";
import Content from "./content.mdx";

export const metadata: Metadata = {
  title: "The Complete Guide to Cart Abandonment Emails for Indian D2C",
  description:
    "Recovery strategies and real examples from top Indian D2C brands. How to win back abandoned carts with timely, compelling emails.",
  openGraph: {
    title: "The Complete Guide to Cart Abandonment Emails for Indian D2C",
    description:
      "Recovery strategies and real examples from top Indian D2C brands. How to win back abandoned carts with timely, compelling emails.",
    type: "article",
    siteName: "MailMuse",
    url: "https://www.mailmuse.in/blog/cart-abandonment-email-guide",
  },
  twitter: {
    card: "summary",
    title: "The Complete Guide to Cart Abandonment Emails for Indian D2C",
    description:
      "Recovery strategies and real examples from top Indian D2C brands. How to win back abandoned carts with timely, compelling emails.",
  },
  alternates: {
    canonical: "https://www.mailmuse.in/blog/cart-abandonment-email-guide",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: "The Complete Guide to Cart Abandonment Emails for Indian D2C",
  datePublished: "2026-02-13",
  author: { "@type": "Organization", name: "MailMuse" },
  publisher: {
    "@type": "Organization",
    name: "MailMuse",
    url: "https://www.mailmuse.in",
  },
  url: "https://www.mailmuse.in/blog/cart-abandonment-email-guide",
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
                "The Complete Guide to Cart Abandonment Emails for Indian D2C",
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
          Published February 13, 2026
        </p>
        <article>
          <Content />
        </article>
      </div>
    </div>
  );
}
