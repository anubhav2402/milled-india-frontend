import type { Metadata } from "next";
import Link from "next/link";
import Header from "../components/Header";
import JsonLd from "../components/JsonLd";
import Breadcrumb from "../components/Breadcrumb";
import { INDUSTRIES } from "../lib/constants";
import { industryToSlug } from "../lib/industry-utils";

export const metadata: Metadata = {
  title: "Industries — Email Marketing by Category | MailMuse",
  description:
    "Explore email marketing strategies across 17 industries including Fashion, Beauty, Food & Beverage, and more.",
  alternates: {
    canonical: "https://www.mailmuse.in/industry",
  },
};

export default function IndustryIndex() {
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
        name: "Industries",
        item: "https://www.mailmuse.in/industry",
      },
    ],
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-surface)" }}>
      <JsonLd data={breadcrumbLd} />
      <Header />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px" }}>
        <Breadcrumb
          items={[{ label: "Home", href: "/" }, { label: "Industries" }]}
        />

        <h1
          style={{
            fontFamily: "var(--font-dm-serif)",
            fontSize: 28,
            color: "var(--color-primary)",
            margin: "0 0 12px",
          }}
        >
          Email Marketing by Industry
        </h1>
        <p
          style={{
            fontSize: 16,
            lineHeight: 1.6,
            color: "var(--color-secondary)",
            margin: "0 0 20px",
            maxWidth: 700,
          }}
        >
          Explore how brands approach email marketing across {INDUSTRIES.length}{" "}
          industries. Each industry page includes brand directories, campaign
          breakdowns, send frequency benchmarks, subject line analytics, and real
          email examples you can browse and reuse as templates.
        </p>

        <div
          style={{
            background: "white",
            borderRadius: 14,
            padding: "24px 28px",
            border: "1px solid var(--color-border)",
            marginBottom: 32,
          }}
        >
          <h2
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: "var(--color-primary)",
              margin: "0 0 14px",
              fontFamily: "var(--font-dm-serif)",
            }}
          >
            Key Insights
          </h2>
          <ul
            style={{
              margin: 0,
              padding: "0 0 0 20px",
              listStyle: "disc",
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            <li
              style={{
                fontSize: 14,
                lineHeight: 1.5,
                color: "var(--color-secondary)",
              }}
            >
              {INDUSTRIES.length} industries tracked
            </li>
            <li
              style={{
                fontSize: 14,
                lineHeight: 1.5,
                color: "var(--color-secondary)",
              }}
            >
              Average send frequency, top campaign types, and subject line trends
              per industry
            </li>
            <li
              style={{
                fontSize: 14,
                lineHeight: 1.5,
                color: "var(--color-secondary)",
              }}
            >
              Real email examples from every category — browse, analyze, and
              reuse
            </li>
            <li
              style={{
                fontSize: 14,
                lineHeight: 1.5,
                color: "var(--color-secondary)",
              }}
            >
              Updated daily with new campaigns
            </li>
          </ul>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: 16,
          }}
        >
          {INDUSTRIES.map((industry) => (
            <Link
              key={industry}
              href={`/industry/${industryToSlug(industry)}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                padding: "20px 24px",
                background: "white",
                borderRadius: 14,
                border: "1px solid var(--color-border)",
                textDecoration: "none",
                color: "inherit",
                transition: "all 150ms ease",
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: "var(--color-accent-light)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                  fontWeight: 700,
                  color: "var(--color-accent)",
                  flexShrink: 0,
                }}
              >
                {industry.charAt(0)}
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: 15,
                    fontWeight: 600,
                    color: "var(--color-primary)",
                  }}
                >
                  {industry}
                </div>
                <div
                  style={{ fontSize: 13, color: "var(--color-tertiary)" }}
                >
                  View brands & campaigns →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
