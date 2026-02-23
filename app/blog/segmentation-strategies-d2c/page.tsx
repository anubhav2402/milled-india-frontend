import type { Metadata } from "next";
import Header from "../../components/Header";
import JsonLd from "../../components/JsonLd";
import Breadcrumb from "../../components/Breadcrumb";
import Content from "./content.mdx";

export const metadata: Metadata = {
  title: "Smart Segmentation: Sending the Right Email to the Right Customer",
  description:
    "Move beyond batch-and-blast with data-driven segmentation strategies. How top Indian D2C brands personalize at scale.",
  openGraph: {
    title:
      "Smart Segmentation: Sending the Right Email to the Right Customer",
    description:
      "Move beyond batch-and-blast with data-driven segmentation strategies. How top Indian D2C brands personalize at scale.",
    type: "article",
    siteName: "MailMuse",
    url: "https://www.mailmuse.in/blog/segmentation-strategies-d2c",
  },
  twitter: {
    card: "summary",
    title:
      "Smart Segmentation: Sending the Right Email to the Right Customer",
    description:
      "Move beyond batch-and-blast with data-driven segmentation strategies. How top Indian D2C brands personalize at scale.",
  },
  alternates: {
    canonical: "https://www.mailmuse.in/blog/segmentation-strategies-d2c",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline:
    "Smart Segmentation: Sending the Right Email to the Right Customer",
  datePublished: "2026-01-20",
  author: { "@type": "Organization", name: "MailMuse" },
  publisher: {
    "@type": "Organization",
    name: "MailMuse",
    url: "https://www.mailmuse.in",
  },
  url: "https://www.mailmuse.in/blog/segmentation-strategies-d2c",
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
                "Smart Segmentation: Sending the Right Email to the Right Customer",
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
          Published January 20, 2026
        </p>
        <article>
          <Content />
        </article>
      </div>
    </div>
  );
}
