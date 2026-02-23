import type { Metadata } from "next";
import Header from "../../components/Header";
import JsonLd from "../../components/JsonLd";
import Breadcrumb from "../../components/Breadcrumb";
import Content from "./content.mdx";

export const metadata: Metadata = {
  title: "Building a Consistent Brand Voice Across Email Campaigns",
  description:
    "How leading Indian D2C brands maintain a recognizable voice from welcome emails to sale announcements. Tone, language, and identity strategies.",
  openGraph: {
    title: "Building a Consistent Brand Voice Across Email Campaigns",
    description:
      "How leading Indian D2C brands maintain a recognizable voice from welcome emails to sale announcements. Tone, language, and identity strategies.",
    type: "article",
    siteName: "MailMuse",
    url: "https://www.mailmuse.in/blog/brand-voice-email-marketing",
  },
  twitter: {
    card: "summary",
    title: "Building a Consistent Brand Voice Across Email Campaigns",
    description:
      "How leading Indian D2C brands maintain a recognizable voice from welcome emails to sale announcements. Tone, language, and identity strategies.",
  },
  alternates: {
    canonical: "https://www.mailmuse.in/blog/brand-voice-email-marketing",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: "Building a Consistent Brand Voice Across Email Campaigns",
  datePublished: "2026-01-08",
  author: { "@type": "Organization", name: "MailMuse" },
  publisher: {
    "@type": "Organization",
    name: "MailMuse",
    url: "https://www.mailmuse.in",
  },
  url: "https://www.mailmuse.in/blog/brand-voice-email-marketing",
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
                "Building a Consistent Brand Voice Across Email Campaigns",
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
          Published January 8, 2026
        </p>
        <article>
          <Content />
        </article>
      </div>
    </div>
  );
}
