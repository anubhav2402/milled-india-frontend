import type { Metadata } from "next";
import Header from "../../components/Header";
import JsonLd from "../../components/JsonLd";
import Breadcrumb from "../../components/Breadcrumb";
import Content from "./content.mdx";

export const metadata: Metadata = {
  title: "Diwali & Festive Email Campaign Playbook for D2C Brands",
  description:
    "How Indian D2C brands plan and execute festive email campaigns. Timing, sequencing, and subject line strategies for Diwali, Holi, and more.",
  openGraph: {
    title: "Diwali & Festive Email Campaign Playbook for D2C Brands",
    description:
      "How Indian D2C brands plan and execute festive email campaigns. Timing, sequencing, and subject line strategies for Diwali, Holi, and more.",
    type: "article",
    siteName: "MailMuse",
    url: "https://www.mailmuse.in/blog/festive-email-campaign-playbook",
  },
  twitter: {
    card: "summary",
    title: "Diwali & Festive Email Campaign Playbook for D2C Brands",
    description:
      "How Indian D2C brands plan and execute festive email campaigns. Timing, sequencing, and subject line strategies for Diwali, Holi, and more.",
  },
  alternates: {
    canonical:
      "https://www.mailmuse.in/blog/festive-email-campaign-playbook",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: "Diwali & Festive Email Campaign Playbook for D2C Brands",
  datePublished: "2026-02-11",
  author: { "@type": "Organization", name: "MailMuse" },
  publisher: {
    "@type": "Organization",
    name: "MailMuse",
    url: "https://www.mailmuse.in",
  },
  url: "https://www.mailmuse.in/blog/festive-email-campaign-playbook",
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
                "Diwali & Festive Email Campaign Playbook for D2C Brands",
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
          Published February 11, 2026
        </p>
        <article>
          <Content />
        </article>
      </div>
    </div>
  );
}
