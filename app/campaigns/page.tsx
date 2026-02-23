import type { Metadata } from "next";
import Link from "next/link";
import Header from "../components/Header";
import JsonLd from "../components/JsonLd";
import Breadcrumb from "../components/Breadcrumb";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://milled-india-api.onrender.com";

type Campaign = {
  festival: string;
  slug: string;
  year: number;
  count: number;
};

export const metadata: Metadata = {
  title: "Indian D2C Festive Email Campaigns | MailMuse",
  description:
    "Explore festive email campaigns from top Indian D2C brands. Discover Diwali, Holi, Navratri, and other festival marketing strategies with real examples.",
  alternates: { canonical: "https://www.mailmuse.in/campaigns" },
  openGraph: {
    title: "Indian D2C Festive Email Campaigns | MailMuse",
    description:
      "Explore festive email campaigns from top Indian D2C brands.",
    type: "website",
    siteName: "MailMuse",
    url: "https://www.mailmuse.in/campaigns",
  },
  twitter: {
    card: "summary",
    title: "Indian D2C Festive Email Campaigns | MailMuse",
    description:
      "Explore festive email campaigns from top Indian D2C brands.",
  },
};

async function fetchCampaigns(): Promise<Campaign[]> {
  try {
    const res = await fetch(`${API_BASE}/seo/campaigns`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export default async function CampaignsIndex() {
  const campaigns = await fetchCampaigns();

  const byYear: Record<number, Campaign[]> = {};
  for (const c of campaigns) {
    if (!byYear[c.year]) byYear[c.year] = [];
    byYear[c.year].push(c);
  }
  const sortedYears = Object.keys(byYear)
    .map(Number)
    .sort((a, b) => b - a);

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.mailmuse.in" },
      { "@type": "ListItem", position: 2, name: "Campaigns", item: "https://www.mailmuse.in/campaigns" },
    ],
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-surface)" }}>
      <JsonLd data={breadcrumbLd} />
      <Header />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px" }}>
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Campaigns" }]} />

        {/* Hero */}
        <div
          style={{
            background: "white",
            borderRadius: 14,
            padding: "32px 36px",
            border: "1px solid var(--color-border)",
            marginBottom: 32,
          }}
        >
          <h1
            style={{
              fontFamily: "var(--font-dm-serif)",
              fontSize: 28,
              color: "var(--color-primary)",
              margin: "0 0 8px",
            }}
          >
            Festive Email Campaigns
          </h1>
          <p style={{ fontSize: 16, color: "var(--color-secondary)", margin: 0, maxWidth: 680, lineHeight: 1.6 }}>
            Indian D2C brands go all-out during festivals. Browse curated collections of
            Diwali, Holi, Navratri, and other festive email campaigns to see how leading
            brands craft subject lines and promotional sequences for every major occasion.
          </p>
        </div>

        {campaigns.length === 0 && (
          <div style={{ textAlign: "center", padding: "48px 24px", color: "var(--color-tertiary)" }}>
            <p style={{ fontSize: 16 }}>No campaign data available yet. Check back soon!</p>
          </div>
        )}

        {sortedYears.map((year) => (
          <section key={year} style={{ marginBottom: 36 }}>
            <h2 style={{ fontFamily: "var(--font-dm-serif)", fontSize: 22, color: "var(--color-primary)", margin: "0 0 16px" }}>
              {year}
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
              {byYear[year]
                .sort((a, b) => b.count - a.count)
                .map((campaign) => (
                  <Link
                    key={`${campaign.slug}-${campaign.year}`}
                    href={`/campaigns/${campaign.slug}-${campaign.year}`}
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
                    }}
                  >
                    <div
                      style={{
                        width: 48, height: 48, borderRadius: 12,
                        background: "var(--color-accent-light)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 20, fontWeight: 700, color: "var(--color-accent)", flexShrink: 0,
                      }}
                    >
                      {campaign.festival.charAt(0)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 15, fontWeight: 600, color: "var(--color-primary)" }}>
                        {campaign.festival}
                      </div>
                      <div style={{ display: "flex", gap: 8, marginTop: 4, fontSize: 13, color: "var(--color-tertiary)" }}>
                        <span>{campaign.count.toLocaleString()} emails</span>
                      </div>
                    </div>
                    <span style={{ fontSize: 13, color: "var(--color-accent)", fontWeight: 500, flexShrink: 0 }}>
                      View →
                    </span>
                  </Link>
                ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
