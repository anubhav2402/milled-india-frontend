import type { Metadata } from "next";
import Link from "next/link";
import Header from "../../components/Header";
import JsonLd from "../../components/JsonLd";
import Breadcrumb from "../../components/Breadcrumb";
import SeoEmailLink from "../../components/SeoEmailLink";
import { slugToIndustry, industryToSlug } from "../../lib/industry-utils";
import { typeToSlug } from "../../lib/type-utils";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://milled-india-api.onrender.com";

type IndustrySeoData = {
  industry: string;
  total_brands: number;
  total_emails: number;
  brands: string[];
  top_brands: { brand: string; email_count: number }[];
  top_campaign_types: { type: string; count: number; percentage: number }[];
  recent_emails: {
    id: number;
    subject: string;
    brand: string;
    type: string;
    received_at: string | null;
  }[];
  avg_emails_per_brand_per_week: number;
  avg_subject_length: number;
  emoji_usage_rate: number;
  peak_send_day: string | null;
  peak_send_time: string | null;
  seasonal_activity: { month: string; count: number }[];
};

async function fetchIndustryData(
  industry: string
): Promise<IndustrySeoData | null> {
  try {
    const res = await fetch(
      `${API_BASE}/seo/industry/${encodeURIComponent(industry)}`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ name: string }>;
}): Promise<Metadata> {
  const { name } = await params;
  const industry = slugToIndustry(name);
  const data = await fetchIndustryData(industry);

  const title = `${industry} Email Marketing — D2C Brand Campaigns | MailMuse`;
  const description = data
    ? `Explore email marketing strategies from ${data.total_brands} ${industry} brands. ${data.total_emails.toLocaleString()} emails tracked on MailMuse.`
    : `Explore ${industry} D2C brand email marketing strategies on MailMuse.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      siteName: "MailMuse",
      url: `https://www.mailmuse.in/industry/${industryToSlug(industry)}`,
    },
    twitter: { card: "summary", title, description },
    alternates: {
      canonical: `https://www.mailmuse.in/industry/${industryToSlug(industry)}`,
    },
  };
}

export default async function IndustryPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const industry = slugToIndustry(name);
  const data = await fetchIndustryData(industry);

  if (!data) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--color-surface)" }}>
        <Header />
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "32px 24px",
            textAlign: "center",
          }}
        >
          <h2 style={{ fontSize: 20, color: "var(--color-primary)" }}>
            Industry not found
          </h2>
          <Link href="/industry" style={{ color: "var(--color-accent)" }}>
            Browse all industries
          </Link>
        </div>
      </div>
    );
  }

  const slug = industryToSlug(industry);
  const pageUrl = `https://www.mailmuse.in/industry/${slug}`;

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
      { "@type": "ListItem", position: 3, name: industry, item: pageUrl },
    ],
  };

  const collectionLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${industry} Email Marketing`,
    url: pageUrl,
    description: `Email marketing strategies from ${data.total_brands} ${industry} D2C brands.`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: data.total_brands,
      itemListElement: data.brands.slice(0, 20).map((brand, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: brand,
        url: `https://www.mailmuse.in/brand/${encodeURIComponent(brand)}`,
      })),
    },
  };

  // FAQ
  const faqItems = [
    {
      question: `How many ${industry} brands does MailMuse track?`,
      answer: `MailMuse currently tracks email campaigns from ${data.total_brands} ${industry} brands, with ${data.total_emails.toLocaleString()} total emails analyzed.`,
    },
    {
      question: `What are the email marketing benchmarks for ${industry}?`,
      answer: `${industry} brands send an average of ${data.avg_emails_per_brand_per_week.toFixed(1)} emails per week with an average subject line length of ${Math.round(data.avg_subject_length)} characters. Emoji usage rate is ${data.emoji_usage_rate}%.${data.peak_send_day ? ` The most popular send day is ${data.peak_send_day}.` : ""}`,
    },
    ...(data.top_campaign_types.length > 0
      ? [
          {
            question: `What types of emails do ${industry} brands send?`,
            answer: `The most common email types in ${industry} are: ${data.top_campaign_types.map((t) => t.type).join(", ")}. Browse each type to see real examples from leading brands.`,
          },
        ]
      : []),
    ...(data.top_brands.length > 0
      ? [
          {
            question: `Which ${industry} brands send the most emails?`,
            answer: `The most active ${industry} brands by email volume are: ${data.top_brands.map((b) => `${b.brand} (${b.email_count} emails)`).join(", ")}.`,
          },
        ]
      : []),
  ];

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-surface)" }}>
      <JsonLd data={breadcrumbLd} />
      <JsonLd data={collectionLd} />
      <JsonLd data={faqLd} />
      <Header />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px" }}>
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Industries", href: "/industry" },
            { label: industry },
          ]}
        />

        {/* Hero */}
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
            {industry} Email Marketing
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
            Explore email marketing strategies from {data.total_brands}{" "}
            {industry} D2C brands. MailMuse has tracked{" "}
            {data.total_emails.toLocaleString()} emails to help you benchmark
            and improve your campaigns.
          </p>

          {/* Stats row */}
          <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: 24, fontWeight: 700, color: "var(--color-accent)" }}>{data.total_brands}</div>
              <div style={{ fontSize: 12, color: "var(--color-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Brands</div>
            </div>
            <div>
              <div style={{ fontSize: 24, fontWeight: 700, color: "var(--color-accent)" }}>{data.total_emails.toLocaleString()}</div>
              <div style={{ fontSize: 12, color: "var(--color-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Emails Tracked</div>
            </div>
            {data.avg_emails_per_brand_per_week > 0 && (
              <div>
                <div style={{ fontSize: 24, fontWeight: 700, color: "var(--color-accent)" }}>{data.avg_emails_per_brand_per_week.toFixed(1)}</div>
                <div style={{ fontSize: 12, color: "var(--color-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Emails/Brand/Week</div>
              </div>
            )}
            {data.avg_subject_length > 0 && (
              <div>
                <div style={{ fontSize: 24, fontWeight: 700, color: "var(--color-accent)" }}>{Math.round(data.avg_subject_length)}</div>
                <div style={{ fontSize: 12, color: "var(--color-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Avg Subject Length</div>
              </div>
            )}
            {data.emoji_usage_rate > 0 && (
              <div>
                <div style={{ fontSize: 24, fontWeight: 700, color: "var(--color-accent)" }}>{data.emoji_usage_rate}%</div>
                <div style={{ fontSize: 12, color: "var(--color-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Emoji Usage</div>
              </div>
            )}
          </div>
        </div>

        {/* Brand grid */}
        <h2
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: "var(--color-primary)",
            margin: "0 0 16px",
          }}
        >
          {industry} Brands
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 16,
            marginBottom: 32,
          }}
        >
          {data.brands.map((brand) => {
            const topBrand = data.top_brands.find((b) => b.brand === brand);
            return (
              <Link
                key={brand}
                href={`/brand/${encodeURIComponent(brand)}`}
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
                    fontSize: 16,
                    fontWeight: 700,
                    color: "var(--color-accent)",
                    flexShrink: 0,
                  }}
                >
                  {brand.charAt(0).toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: "var(--color-primary)",
                      textTransform: "capitalize",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {brand}
                  </div>
                  {topBrand && (
                    <div
                      style={{
                        fontSize: 12,
                        color: "var(--color-tertiary)",
                      }}
                    >
                      {topBrand.email_count} emails
                    </div>
                  )}
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
            );
          })}
        </div>

        {/* Benchmarks Prose */}
        <div
          style={{
            background: "white",
            borderRadius: 14,
            padding: "28px 32px",
            border: "1px solid var(--color-border)",
            marginBottom: 24,
          }}
        >
          <h2
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: "var(--color-primary)",
              margin: "0 0 16px",
              fontFamily: "var(--font-dm-serif)",
            }}
          >
            {industry} Email Marketing Benchmarks
          </h2>
          <p style={{ fontSize: 15, lineHeight: 1.7, color: "var(--color-secondary)", margin: "0 0 12px" }}>
            Based on our analysis of {data.total_emails.toLocaleString()} emails from {data.total_brands} {industry} brands,
            the average brand in this industry sends approximately {data.avg_emails_per_brand_per_week.toFixed(1)} emails per week.
            Subject lines average {Math.round(data.avg_subject_length)} characters, with {data.emoji_usage_rate}% of emails
            using emojis in the subject line.
            {data.peak_send_day && ` The most popular day to send emails is ${data.peak_send_day}.`}
            {data.peak_send_time && ` Most emails are sent during the ${data.peak_send_time} time slot.`}
          </p>
        </div>

        {/* Campaign Types */}
        {data.top_campaign_types.length > 0 && (
          <div
            style={{
              background: "white",
              borderRadius: 14,
              padding: "28px 32px",
              border: "1px solid var(--color-border)",
              marginBottom: 24,
            }}
          >
            <h2
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: "var(--color-primary)",
                margin: "0 0 16px",
                fontFamily: "var(--font-dm-serif)",
              }}
            >
              Popular Email Types in {industry}
            </h2>
            <p style={{ fontSize: 15, lineHeight: 1.7, color: "var(--color-secondary)", margin: "0 0 16px" }}>
              {industry} brands most commonly send {data.top_campaign_types.slice(0, 3).map((t) => t.type).join(", ")} emails.
              Explore each campaign type to see real examples and best practices.
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {data.top_campaign_types.map((t) => (
                <Link
                  key={t.type}
                  href={`/types/${typeToSlug(t.type)}`}
                  style={{
                    padding: "8px 16px",
                    borderRadius: 8,
                    background: "var(--color-surface)",
                    border: "1px solid var(--color-border)",
                    color: "var(--color-accent)",
                    fontSize: 13,
                    fontWeight: 500,
                    textDecoration: "none",
                  }}
                >
                  {t.type} Emails
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Recent Emails */}
        {data.recent_emails && data.recent_emails.length > 0 && (
          <div
            style={{
              background: "white",
              borderRadius: 14,
              padding: "28px 32px",
              border: "1px solid var(--color-border)",
              marginBottom: 24,
            }}
          >
            <h2
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: "var(--color-primary)",
                margin: "0 0 16px",
                fontFamily: "var(--font-dm-serif)",
              }}
            >
              Recent {industry} Emails
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {data.recent_emails.map((email) => (
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

        {/* Seasonal Activity */}
        {data.seasonal_activity && data.seasonal_activity.length > 0 && (() => {
          const peak = data.seasonal_activity.reduce((a, b) => a.count > b.count ? a : b);
          const peakMonth = new Date(peak.month + "-01").toLocaleDateString("en-US", { month: "long", year: "numeric" });
          return (
            <div
              style={{
                background: "white",
                borderRadius: 14,
                padding: "28px 32px",
                border: "1px solid var(--color-border)",
                marginBottom: 24,
              }}
            >
              <h2
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: "var(--color-primary)",
                  margin: "0 0 16px",
                  fontFamily: "var(--font-dm-serif)",
                }}
              >
                Seasonal Email Patterns
              </h2>
              <p style={{ fontSize: 15, lineHeight: 1.7, color: "var(--color-secondary)", margin: 0 }}>
                Email activity in {industry} peaks during {peakMonth} with {peak.count} emails sent.
                This typically aligns with major Indian shopping festivals and seasonal campaigns.
                Brands in this industry ramp up their email frequency during festive seasons to maximize engagement and sales.
              </p>
            </div>
          );
        })()}

        {/* FAQ */}
        {faqItems.length > 0 && (
          <div
            style={{
              background: "white",
              borderRadius: 14,
              padding: "28px 32px",
              border: "1px solid var(--color-border)",
            }}
          >
            <h2
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: "var(--color-primary)",
                margin: "0 0 16px",
                fontFamily: "var(--font-dm-serif)",
              }}
            >
              Frequently Asked Questions
            </h2>
            {faqItems.map((item, i) => (
              <div
                key={i}
                style={{
                  marginBottom: i < faqItems.length - 1 ? 20 : 0,
                  paddingBottom: i < faqItems.length - 1 ? 20 : 0,
                  borderBottom:
                    i < faqItems.length - 1
                      ? "1px solid var(--color-border)"
                      : "none",
                }}
              >
                <h3
                  style={{
                    fontSize: 15,
                    fontWeight: 600,
                    color: "var(--color-primary)",
                    margin: "0 0 8px",
                  }}
                >
                  {item.question}
                </h3>
                <p
                  style={{
                    fontSize: 14,
                    lineHeight: 1.6,
                    color: "var(--color-secondary)",
                    margin: 0,
                  }}
                >
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
