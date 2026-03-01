import type { Metadata } from "next";
import Link from "next/link";
import Header from "../components/Header";
import JsonLd from "../components/JsonLd";
import Breadcrumb from "../components/Breadcrumb";
import { getAllTypes } from "../lib/type-utils";

export const metadata: Metadata = {
  title: "Email Types — Email Campaign Examples by Category | MailMuse",
  description:
    "Browse real email marketing examples by type: sale emails, welcome series, abandoned cart, newsletters, festive campaigns, and more from 10,000+ top brands.",
  alternates: {
    canonical: "https://www.mailmuse.in/types",
  },
  openGraph: {
    title: "Email Campaign Examples by Type | MailMuse",
    description:
      "Browse email marketing examples by type from 10,000+ top brands.",
    url: "https://www.mailmuse.in/types",
    siteName: "MailMuse",
  },
};

const TYPE_ICONS: Record<string, string> = {
  Sale: "S",
  Welcome: "W",
  "Abandoned Cart": "AC",
  Newsletter: "N",
  "New Arrival": "NA",
  "Re-engagement": "RE",
  "Order Update": "OU",
  Festive: "F",
  Loyalty: "L",
  Feedback: "FB",
  "Back in Stock": "BS",
  Educational: "E",
  "Product Showcase": "PS",
  Promotional: "P",
  Confirmation: "C",
};

export default function TypesIndexPage() {
  const types = getAllTypes();

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.mailmuse.in",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Email Types",
        item: "https://www.mailmuse.in/types",
      },
    ],
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-surface)" }}>
      <JsonLd data={breadcrumbLd} />
      <Header />
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px" }}>
        <Breadcrumb
          items={[{ label: "Home", href: "/" }, { label: "Email Types" }]}
        />

        <div
          style={{
            background: "white",
            borderRadius: 14,
            padding: "32px 36px",
            border: "1px solid var(--color-border)",
            marginBottom: 24,
          }}
        >
          <h1
            style={{
              fontFamily: "var(--font-dm-serif)",
              fontSize: 28,
              color: "var(--color-primary)",
              margin: "0 0 12px",
            }}
          >
            Email Types
          </h1>
          <p
            style={{
              fontSize: 16,
              lineHeight: 1.6,
              color: "var(--color-secondary)",
              margin: "0 0 14px",
              maxWidth: 700,
            }}
          >
            Browse real email marketing examples from top brands,
            organized by campaign type. See how top brands craft sale emails,
            welcome sequences, festive campaigns, and more.
          </p>
          <p
            style={{
              fontSize: 16,
              lineHeight: 1.6,
              color: "var(--color-secondary)",
              margin: 0,
              maxWidth: 700,
            }}
          >
            Each type page includes real examples from 10,000+ brands, subject line
            patterns, send timing benchmarks, and campaign analysis. Use any
            email as a starting point in our drag-and-drop template editor.
          </p>
        </div>

        <div
          style={{
            background: "white",
            borderRadius: 14,
            padding: "24px 28px",
            border: "1px solid var(--color-border)",
            marginBottom: 24,
          }}
        >
          <h2
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: "var(--color-primary)",
              margin: "0 0 16px",
              fontFamily: "var(--font-dm-serif)",
            }}
          >
            Popular Email Types
          </h2>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            {[
              {
                name: "Sale",
                description:
                  "Discount announcements, flash sales, and limited-time offers that drive urgency and conversions.",
              },
              {
                name: "Welcome",
                description:
                  "First-touch emails that introduce new subscribers to a brand and set the tone for future campaigns.",
              },
              {
                name: "Abandoned Cart",
                description:
                  "Recovery emails that remind shoppers about items left in their cart and nudge them to complete the purchase.",
              },
              {
                name: "Newsletter",
                description:
                  "Regular updates featuring curated content, product highlights, and brand stories to keep subscribers engaged.",
              },
              {
                name: "Festive",
                description:
                  "Seasonal campaigns tied to holidays and festivals like Diwali, Holi, and end-of-season events.",
              },
            ].map((type) => (
              <div
                key={type.name}
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: 10,
                }}
              >
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: "var(--color-accent)",
                    flexShrink: 0,
                    minWidth: 110,
                  }}
                >
                  {type.name}
                </span>
                <span
                  style={{
                    fontSize: 14,
                    lineHeight: 1.5,
                    color: "var(--color-secondary)",
                  }}
                >
                  {type.description}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 16,
          }}
        >
          {types.map(({ name, slug }) => (
            <Link
              key={slug}
              href={`/types/${slug}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "16px 20px",
                background: "white",
                borderRadius: 12,
                border: "1px solid var(--color-border)",
                textDecoration: "none",
                color: "inherit",
                transition: "all 150ms ease",
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: "var(--color-accent-light)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 13,
                  fontWeight: 700,
                  color: "var(--color-accent)",
                  flexShrink: 0,
                }}
              >
                {TYPE_ICONS[name] || name.charAt(0)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: "var(--color-primary)",
                  }}
                >
                  {name} Emails
                </div>
                <div style={{ fontSize: 12, color: "var(--color-tertiary)" }}>
                  View examples & benchmarks
                </div>
              </div>
              <span
                style={{
                  fontSize: 13,
                  color: "var(--color-accent)",
                  fontWeight: 500,
                }}
              >
                View →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
