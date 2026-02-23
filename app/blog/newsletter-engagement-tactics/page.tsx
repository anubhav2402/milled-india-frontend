import type { Metadata } from "next";
import Header from "../../components/Header";
import JsonLd from "../../components/JsonLd";
import Breadcrumb from "../../components/Breadcrumb";
import Content from "./content.mdx";

export const metadata: Metadata = {
  title: "D2C Newsletter Strategies That Keep Subscribers Engaged",
  description:
    "How top Indian D2C brands use newsletters to build loyalty between purchases. Content mix, frequency, and engagement tactics that work.",
  openGraph: {
    title: "D2C Newsletter Strategies That Keep Subscribers Engaged",
    description:
      "How top Indian D2C brands use newsletters to build loyalty between purchases. Content mix, frequency, and engagement tactics that work.",
    type: "article",
    siteName: "MailMuse",
    url: "https://www.mailmuse.in/blog/newsletter-engagement-tactics",
  },
  twitter: {
    card: "summary",
    title: "D2C Newsletter Strategies That Keep Subscribers Engaged",
    description:
      "How top Indian D2C brands use newsletters to build loyalty between purchases. Content mix, frequency, and engagement tactics that work.",
  },
  alternates: {
    canonical: "https://www.mailmuse.in/blog/newsletter-engagement-tactics",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: "D2C Newsletter Strategies That Keep Subscribers Engaged",
  datePublished: "2026-02-05",
  author: { "@type": "Organization", name: "MailMuse" },
  publisher: {
    "@type": "Organization",
    name: "MailMuse",
    url: "https://www.mailmuse.in",
  },
  url: "https://www.mailmuse.in/blog/newsletter-engagement-tactics",
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
                "D2C Newsletter Strategies That Keep Subscribers Engaged",
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
          Published February 5, 2026
        </p>
        <article>
          <Content />
        </article>
      </div>
    </div>
  );
}
