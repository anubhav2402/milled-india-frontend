import type { Metadata } from "next";
import Link from "next/link";
import Header from "../../components/Header";
import JsonLd from "../../components/JsonLd";
import Breadcrumb from "../../components/Breadcrumb";
import SeoEmailLink from "../../components/SeoEmailLink";
import { festivalSlugToName } from "../../lib/festival-utils";
import { industryToSlug } from "../../lib/industry-utils";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://milled-india-api.onrender.com";

type CampaignData = {
  festival: string;
  slug: string;
  year: number;
  date_range: { start: string; end: string };
  total_emails: number;
  total_brands: number;
  industry_breakdown: { industry: string; count: number; percentage: number }[];
  top_brands: { brand: string; count: number }[];
  best_subject_lines: { subject: string; brand: string; id: number }[];
  best_emails: {
    id: number;
    subject: string;
    brand: string;
    type: string;
    received_at: string | null;
  }[];
  insights: {
    avg_subject_length: number;
    emoji_usage_rate: number;
    peak_send_day: string | null;
    top_subject_words: string[];
  };
};

function parseCampaignSlug(slug: string): { festivalSlug: string; year: number } | null {
  const match = slug.match(/^(.+)-(\d{4})$/);
  if (!match) return null;
  return { festivalSlug: match[1], year: parseInt(match[2]) };
}

async function fetchCampaignData(
  festivalSlug: string,
  year: number
): Promise<CampaignData | null> {
  try {
    const res = await fetch(
      `${API_BASE}/seo/campaigns/${festivalSlug}/${year}`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function generateStaticParams() {
  try {
    const res = await fetch(`${API_BASE}/seo/campaigns`, {
      next: { revalidate: 86400 },
    });
    if (!res.ok) return [];
    const campaigns: { slug: string; year: number }[] = await res.json();
    return campaigns.map((c) => ({ slug: `${c.slug}-${c.year}` }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const parsed = parseCampaignSlug(slug);
  if (!parsed) return { title: "Campaign | MailMuse" };

  const festivalName = festivalSlugToName(parsed.festivalSlug);
  const title = `${festivalName} ${parsed.year} Email Campaigns — Indian D2C Brands | MailMuse`;
  const description = `Browse ${festivalName} ${parsed.year} email campaigns from top Indian D2C brands. See subject lines, industry breakdown, and campaign strategies.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      siteName: "MailMuse",
      url: `https://www.mailmuse.in/campaigns/${slug}`,
    },
    twitter: { card: "summary", title, description },
    alternates: { canonical: `https://www.mailmuse.in/campaigns/${slug}` },
  };
}

export default async function CampaignPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const parsed = parseCampaignSlug(slug);

  if (!parsed) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--color-surface)" }}>
        <Header />
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px", textAlign: "center" }}>
          <h2 style={{ fontSize: 20, color: "var(--color-primary)" }}>Campaign not found</h2>
          <Link href="/campaigns" style={{ color: "var(--color-accent)" }}>Browse all campaigns</Link>
        </div>
      </div>
    );
  }

  const data = await fetchCampaignData(parsed.festivalSlug, parsed.year);

  if (!data) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--color-surface)" }}>
        <Header />
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px", textAlign: "center" }}>
          <h2 style={{ fontSize: 20, color: "var(--color-primary)" }}>Campaign data not available</h2>
          <Link href="/campaigns" style={{ color: "var(--color-accent)" }}>Browse all campaigns</Link>
        </div>
      </div>
    );
  }

  const pageUrl = `https://www.mailmuse.in/campaigns/${slug}`;
  const startDate = new Date(data.date_range.start).toLocaleDateString("en-US", { month: "long", day: "numeric" });
  const endDate = new Date(data.date_range.end).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.mailmuse.in" },
      { "@type": "ListItem", position: 2, name: "Campaigns", item: "https://www.mailmuse.in/campaigns" },
      { "@type": "ListItem", position: 3, name: `${data.festival} ${data.year}`, item: pageUrl },
    ],
  };

  const faqItems = [
    {
      q: `How many ${data.festival} ${data.year} emails does MailMuse track?`,
      a: `MailMuse tracked ${data.total_emails} emails from ${data.total_brands} brands during ${data.festival} ${data.year} (${startDate} to ${endDate}).`,
    },
    {
      q: `Which brands sent the most ${data.festival} emails?`,
      a: data.top_brands.length > 0
        ? `The top brands during ${data.festival} ${data.year} were: ${data.top_brands.slice(0, 5).map((b) => `${b.brand} (${b.count} emails)`).join(", ")}.`
        : `Data is being processed for this campaign.`,
    },
    {
      q: `What are the best ${data.festival} email subject lines?`,
      a: data.best_subject_lines.length > 0
        ? `Some top subject lines include: "${data.best_subject_lines[0].subject}" by ${data.best_subject_lines[0].brand}${data.best_subject_lines.length > 1 ? `, and "${data.best_subject_lines[1].subject}" by ${data.best_subject_lines[1].brand}` : ""}.`
        : `Browse our collection to see real subject line examples.`,
    },
  ];

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  const cardStyle: React.CSSProperties = {
    background: "white",
    borderRadius: 14,
    padding: "28px 32px",
    border: "1px solid var(--color-border)",
    marginBottom: 20,
  };

  const headingStyle: React.CSSProperties = {
    fontSize: 18,
    fontWeight: 700,
    color: "var(--color-primary)",
    margin: "0 0 16px",
    fontFamily: "var(--font-dm-serif)",
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-surface)" }}>
      <JsonLd data={breadcrumbLd} />
      <JsonLd data={faqLd} />
      <Header />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px" }}>
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Campaigns", href: "/campaigns" },
            { label: `${data.festival} ${data.year}` },
          ]}
        />

        {/* Hero */}
        <div style={{ ...cardStyle, padding: "32px 36px" }}>
          <h1
            style={{
              fontFamily: "var(--font-dm-serif)",
              fontSize: 28,
              color: "var(--color-primary)",
              margin: "0 0 8px",
            }}
          >
            {data.festival} {data.year} Email Campaigns
          </h1>
          <p style={{ fontSize: 13, color: "var(--color-tertiary)", margin: "0 0 20px" }}>
            {startDate} — {endDate}
          </p>
          <div style={{ display: "flex", gap: 32, flexWrap: "wrap", marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 24, fontWeight: 700, color: "var(--color-accent)" }}>{data.total_emails}</div>
              <div style={{ fontSize: 12, color: "var(--color-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Emails</div>
            </div>
            <div>
              <div style={{ fontSize: 24, fontWeight: 700, color: "var(--color-accent)" }}>{data.total_brands}</div>
              <div style={{ fontSize: 12, color: "var(--color-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Brands</div>
            </div>
            <div>
              <div style={{ fontSize: 24, fontWeight: 700, color: "var(--color-accent)" }}>{Math.round(data.insights.avg_subject_length)}</div>
              <div style={{ fontSize: 12, color: "var(--color-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Avg Subject Length</div>
            </div>
            <div>
              <div style={{ fontSize: 24, fontWeight: 700, color: "var(--color-accent)" }}>{data.insights.emoji_usage_rate}%</div>
              <div style={{ fontSize: 12, color: "var(--color-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Emoji Usage</div>
            </div>
          </div>
          <p style={{ fontSize: 15, lineHeight: 1.7, color: "var(--color-secondary)", margin: 0 }}>
            During {data.festival} {data.year}, {data.total_brands} Indian D2C brands collectively sent {data.total_emails} email campaigns.
            {data.industry_breakdown.length > 0 && ` The ${data.industry_breakdown[0].industry} industry was most active with ${data.industry_breakdown[0].count} emails (${data.industry_breakdown[0].percentage}%).`}
            {" "}Subject lines averaged {Math.round(data.insights.avg_subject_length)} characters, with {data.insights.emoji_usage_rate}% using emojis.
            {data.insights.peak_send_day && ` Brands preferred sending on ${data.insights.peak_send_day}.`}
            {data.insights.top_subject_words.length > 0 && ` The most common words in subject lines were: ${data.insights.top_subject_words.slice(0, 5).join(", ")}.`}
          </p>
        </div>

        {/* Industry Breakdown */}
        {data.industry_breakdown.length > 0 && (
          <div style={cardStyle}>
            <h2 style={headingStyle}>Industry Breakdown</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {data.industry_breakdown.map((ind) => (
                <Link
                  key={ind.industry}
                  href={`/industry/${industryToSlug(ind.industry)}`}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "8px 12px",
                    borderRadius: 8,
                    background: "var(--color-surface)",
                    textDecoration: "none",
                    color: "inherit",
                    fontSize: 14,
                  }}
                >
                  <span style={{ color: "var(--color-primary)", fontWeight: 500 }}>{ind.industry}</span>
                  <span style={{ color: "var(--color-tertiary)" }}>{ind.count} emails ({ind.percentage}%)</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Best Subject Lines */}
        {data.best_subject_lines.length > 0 && (
          <div style={cardStyle}>
            <h2 style={headingStyle}>Best {data.festival} Subject Lines</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {data.best_subject_lines.map((item, i) => (
                <Link
                  key={i}
                  href={`/email/${item.id}`}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px 14px",
                    borderRadius: 8,
                    background: "var(--color-surface)",
                    textDecoration: "none",
                    color: "inherit",
                    fontSize: 14,
                    gap: 12,
                  }}
                >
                  <span style={{ color: "var(--color-primary)", fontWeight: 500, flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    &ldquo;{item.subject}&rdquo;
                  </span>
                  <span style={{ color: "var(--color-tertiary)", flexShrink: 0, fontSize: 12 }}>
                    {item.brand}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Best Emails */}
        {data.best_emails.length > 0 && (
          <div style={cardStyle}>
            <h2 style={headingStyle}>Top {data.festival} Email Examples</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {data.best_emails.map((email) => (
                <SeoEmailLink
                  key={email.id}
                  id={email.id}
                  subject={email.subject}
                  brand={email.brand}
                  type={email.type}
                  received_at={email.received_at || undefined}
                />
              ))}
            </div>
          </div>
        )}

        {/* Top Brands */}
        {data.top_brands.length > 0 && (
          <div style={cardStyle}>
            <h2 style={headingStyle}>Top Brands During {data.festival} {data.year}</h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                gap: 12,
              }}
            >
              {data.top_brands.map((brand) => (
                <Link
                  key={brand.brand}
                  href={`/brand/${encodeURIComponent(brand.brand)}`}
                  style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "12px 16px", borderRadius: 10,
                    background: "var(--color-surface)", border: "1px solid var(--color-border)",
                    textDecoration: "none", color: "inherit",
                  }}
                >
                  <div
                    style={{
                      width: 32, height: 32, borderRadius: 8,
                      background: "var(--color-accent-light)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 14, fontWeight: 700, color: "var(--color-accent)", flexShrink: 0,
                    }}
                  >
                    {brand.brand.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "var(--color-primary)" }}>{brand.brand}</div>
                    <div style={{ fontSize: 12, color: "var(--color-tertiary)" }}>{brand.count} emails</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* FAQ */}
        <div style={cardStyle}>
          <h2 style={headingStyle}>Frequently Asked Questions</h2>
          {faqItems.map((item, i) => (
            <div
              key={i}
              style={{
                marginBottom: i < faqItems.length - 1 ? 20 : 0,
                paddingBottom: i < faqItems.length - 1 ? 20 : 0,
                borderBottom: i < faqItems.length - 1 ? "1px solid var(--color-border)" : "none",
              }}
            >
              <h3 style={{ fontSize: 15, fontWeight: 600, color: "var(--color-primary)", margin: "0 0 8px" }}>
                {item.q}
              </h3>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: "var(--color-secondary)", margin: 0 }}>
                {item.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
