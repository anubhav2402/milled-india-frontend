import type { Metadata } from "next";
import Link from "next/link";
import Header from "../../components/Header";
import JsonLd from "../../components/JsonLd";
import Breadcrumb from "../../components/Breadcrumb";
import { slugToIndustry, industryToSlug } from "../../lib/industry-utils";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://milled-india-api.onrender.com";

type IndustrySeoData = {
  industry: string;
  total_brands: number;
  total_emails: number;
  brands: string[];
  top_brands: { brand: string; email_count: number }[];
  top_campaign_types: string[];
};

async function fetchIndustryData(
  industry: string
): Promise<IndustrySeoData | null> {
  try {
    const res = await fetch(
      `${API_BASE}/industries/${encodeURIComponent(industry)}/seo`,
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
    ...(data.top_campaign_types.length > 0
      ? [
          {
            question: `What types of emails do ${industry} brands send?`,
            answer: `The most common email types in ${industry} are: ${data.top_campaign_types.join(", ")}.`,
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
              <div
                style={{
                  fontSize: 24,
                  fontWeight: 700,
                  color: "var(--color-accent)",
                }}
              >
                {data.total_brands}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: "var(--color-tertiary)",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Brands
              </div>
            </div>
            <div>
              <div
                style={{
                  fontSize: 24,
                  fontWeight: 700,
                  color: "var(--color-accent)",
                }}
              >
                {data.total_emails.toLocaleString()}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: "var(--color-tertiary)",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Emails Tracked
              </div>
            </div>
            {data.top_campaign_types.length > 0 && (
              <div>
                <div
                  style={{
                    fontSize: 24,
                    fontWeight: 700,
                    color: "var(--color-accent)",
                  }}
                >
                  {data.top_campaign_types[0]}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: "var(--color-tertiary)",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Top Campaign Type
                </div>
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
