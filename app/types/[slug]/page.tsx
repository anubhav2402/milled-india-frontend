import type { Metadata } from "next";
import Link from "next/link";
import Header from "../../components/Header";
import JsonLd from "../../components/JsonLd";
import Breadcrumb from "../../components/Breadcrumb";
import SeoEmailLink from "../../components/SeoEmailLink";
import { slugToType } from "../../lib/type-utils";
import { industryToSlug } from "../../lib/industry-utils";
import { TYPE_DESCRIPTIONS } from "../../lib/type-descriptions";
import { apiFetch } from "../../lib/api-fetch";

type TypeSeoData = {
  type: string;
  slug: string;
  total_emails: number;
  total_brands: number;
  example_emails: {
    id: number;
    subject: string;
    brand: string;
    industry: string;
    received_at: string | null;
  }[];
  top_brands: { brand: string; count: number }[];
  industry_breakdown: {
    industry: string;
    count: number;
    percentage: number;
  }[];
  avg_subject_length: number;
  emoji_usage_rate: number;
  top_subject_words: string[];
  sample_subjects: string[];
  peak_send_day: string | null;
  related_types: string[];
};

async function fetchTypeData(slug: string): Promise<TypeSeoData | null> {
  return apiFetch<TypeSeoData>(`/seo/types/${slug}`);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const typeName = slugToType(slug);
  const data = await fetchTypeData(slug);

  const brandCount = data?.total_brands || 0;
  const emailCount = data?.total_emails || 0;
  const title = `Best ${typeName} Email Examples from Top Brands | MailMuse`;
  const description = `Browse ${emailCount}+ real ${typeName.toLowerCase()} email examples from ${brandCount} top brands. See subject lines, designs, and strategies that work.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      siteName: "MailMuse",
      url: `https://www.mailmuse.in/types/${slug}`,
    },
    twitter: { card: "summary", title, description },
    alternates: { canonical: `https://www.mailmuse.in/types/${slug}` },
  };
}

export default async function TypePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const typeName = slugToType(slug);
  const data = await fetchTypeData(slug);

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
            Could not load email type data
          </h2>
          <p style={{ fontSize: 14, color: "var(--color-tertiary)", margin: "8px 0 16px" }}>
            This may be a temporary issue. Try refreshing the page.
          </p>
          <Link href="/types" style={{ color: "var(--color-accent)" }}>
            Browse all email types
          </Link>
        </div>
      </div>
    );
  }

  const desc = TYPE_DESCRIPTIONS[typeName];
  const pageUrl = `https://www.mailmuse.in/types/${slug}`;

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.mailmuse.in" },
      { "@type": "ListItem", position: 2, name: "Email Types", item: "https://www.mailmuse.in/types" },
      { "@type": "ListItem", position: 3, name: `${typeName} Emails`, item: pageUrl },
    ],
  };

  const collectionLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${typeName} Email Examples`,
    url: pageUrl,
    description: `Real ${typeName.toLowerCase()} email examples from ${data.total_brands} top brands.`,
  };

  const faqItems = desc?.faqItems || [];
  const faqLd = faqItems.length > 0
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqItems.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      }
    : null;

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

  const textStyle: React.CSSProperties = {
    fontSize: 15,
    lineHeight: 1.7,
    color: "var(--color-secondary)",
    margin: "0 0 12px",
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-surface)" }}>
      <JsonLd data={breadcrumbLd} />
      <JsonLd data={collectionLd} />
      {faqLd && <JsonLd data={faqLd} />}
      <Header />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px" }}>
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Email Types", href: "/types" },
            { label: `${typeName} Emails` },
          ]}
        />

        {/* Hero */}
        <div style={{ ...cardStyle, padding: "32px 36px" }}>
          <h1
            style={{
              fontFamily: "var(--font-dm-serif)",
              fontSize: 28,
              color: "var(--color-primary)",
              margin: "0 0 12px",
            }}
          >
            {typeName} Email Examples from Top Brands
          </h1>
          <div style={{ display: "flex", gap: 32, flexWrap: "wrap", marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 24, fontWeight: 700, color: "var(--color-accent)" }}>{data.total_emails.toLocaleString()}</div>
              <div style={{ fontSize: 12, color: "var(--color-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Emails</div>
            </div>
            <div>
              <div style={{ fontSize: 24, fontWeight: 700, color: "var(--color-accent)" }}>{data.avg_subject_length}</div>
              <div style={{ fontSize: 12, color: "var(--color-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Avg Subject Length</div>
            </div>
            <div>
              <div style={{ fontSize: 24, fontWeight: 700, color: "var(--color-accent)" }}>{data.emoji_usage_rate}%</div>
              <div style={{ fontSize: 12, color: "var(--color-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Emoji Usage</div>
            </div>
          </div>
          {desc && <p style={textStyle}>{desc.intro}</p>}
        </div>

        {/* Best Examples */}
        {data.example_emails.length > 0 && (
          <div style={cardStyle}>
            <h2 style={headingStyle}>Best {typeName} Email Examples</h2>
            <p style={textStyle}>
              Here are {data.example_emails.length} real {typeName.toLowerCase()} email examples from leading brands,
              curated from our database of {data.total_emails.toLocaleString()} tracked emails.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {data.example_emails.map((email) => (
                <SeoEmailLink
                  key={email.id}
                  id={email.id}
                  subject={email.subject}
                  brand={email.brand}
                  received_at={email.received_at || undefined}
                />
              ))}
            </div>
          </div>
        )}

        {/* Top Brands */}
        {data.top_brands.length > 0 && (
          <div style={cardStyle}>
            <h2 style={headingStyle}>Top Brands for {typeName} Emails</h2>
            <p style={textStyle}>
              These brands send the most {typeName.toLowerCase()} emails in our database.
            </p>
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
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "12px 16px",
                    borderRadius: 10,
                    background: "var(--color-surface)",
                    border: "1px solid var(--color-border)",
                    textDecoration: "none",
                    color: "inherit",
                  }}
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      background: "var(--color-accent-light)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 14,
                      fontWeight: 700,
                      color: "var(--color-accent)",
                      flexShrink: 0,
                    }}
                  >
                    {brand.brand.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "var(--color-primary)" }}>
                      {brand.brand}
                    </div>
                    <div style={{ fontSize: 12, color: "var(--color-tertiary)" }}>
                      {brand.count} emails
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Industry Breakdown */}
        {data.industry_breakdown.length > 0 && (
          <div style={cardStyle}>
            <h2 style={headingStyle}>Industry Breakdown</h2>
            <p style={textStyle}>
              {typeName} emails are most common in the{" "}
              {data.industry_breakdown[0].industry} industry ({data.industry_breakdown[0].percentage}%),
              followed by{" "}
              {data.industry_breakdown
                .slice(1, 3)
                .map((ind) => `${ind.industry} (${ind.percentage}%)`)
                .join(" and ")}
              .
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {data.industry_breakdown.slice(0, 8).map((ind) => (
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

        {/* Tips */}
        {desc && desc.tips.length > 0 && (
          <div style={cardStyle}>
            <h2 style={headingStyle}>{typeName} Email Best Practices</h2>
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              {desc.tips.map((tip, i) => (
                <li
                  key={i}
                  style={{
                    fontSize: 14,
                    lineHeight: 1.7,
                    color: "var(--color-secondary)",
                    marginBottom: 8,
                  }}
                >
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* FAQ */}
        {faqItems.length > 0 && (
          <div style={cardStyle}>
            <h2 style={headingStyle}>Frequently Asked Questions</h2>
            {faqItems.map((item, i) => (
              <div
                key={i}
                style={{
                  marginBottom: i < faqItems.length - 1 ? 20 : 0,
                  paddingBottom: i < faqItems.length - 1 ? 20 : 0,
                  borderBottom:
                    i < faqItems.length - 1 ? "1px solid var(--color-border)" : "none",
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
        )}

        {/* Related Types */}
        {data.related_types.length > 0 && (
          <div style={cardStyle}>
            <h2 style={headingStyle}>Browse Other Email Types</h2>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {data.related_types.map((relSlug) => (
                <Link
                  key={relSlug}
                  href={`/types/${relSlug}`}
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
                  {slugToType(relSlug)} Emails
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
