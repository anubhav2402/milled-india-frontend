import type { Metadata } from "next";
import Link from "next/link";
import Header from "../../components/Header";
import JsonLd from "../../components/JsonLd";
import Breadcrumb from "../../components/Breadcrumb";
import SeoEmailLink from "../../components/SeoEmailLink";
import { slugToBrandPair } from "../../lib/compare-utils";
import { industryToSlug } from "../../lib/industry-utils";
import { typeToSlug } from "../../lib/type-utils";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://milled-india-api.onrender.com";

type BrandSide = {
  name: string;
  industry: string;
  total_emails: number;
  emails_per_week: number;
  top_campaign_type: string;
  campaign_breakdown: Record<string, number>;
  avg_subject_length: number;
  emoji_usage_rate: number;
  peak_send_day: string | null;
  peak_send_time: string | null;
  sample_subjects: string[];
  recent_emails: {
    id: number;
    subject: string;
    type: string;
    received_at: string | null;
  }[];
};

type CompareData = {
  brand_a: BrandSide;
  brand_b: BrandSide;
  shared_industry: string | null;
  comparison_summary: {
    more_active: string;
    longer_subjects: string;
    more_emoji: string;
  };
};

async function fetchCompareData(
  brandA: string,
  brandB: string
): Promise<CompareData | null> {
  try {
    const res = await fetch(
      `${API_BASE}/seo/compare/${encodeURIComponent(brandA)}/${encodeURIComponent(brandB)}`,
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
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const pair = slugToBrandPair(slug);
  if (!pair) {
    return { title: "Brand Comparison | MailMuse" };
  }

  const title = `${pair[0]} vs ${pair[1]} Email Marketing Compared | MailMuse`;
  const description = `Compare email marketing strategies of ${pair[0]} and ${pair[1]}. See send frequency, subject line patterns, campaign types, and more.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      siteName: "MailMuse",
      url: `https://www.mailmuse.in/compare/${slug}`,
    },
    twitter: { card: "summary", title, description },
    alternates: { canonical: `https://www.mailmuse.in/compare/${slug}` },
  };
}

export default async function ComparePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pair = slugToBrandPair(slug);

  if (!pair) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--color-surface)" }}>
        <Header />
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px", textAlign: "center" }}>
          <h2 style={{ fontSize: 20, color: "var(--color-primary)" }}>Invalid comparison</h2>
          <Link href="/brands" style={{ color: "var(--color-accent)" }}>Browse all brands</Link>
        </div>
      </div>
    );
  }

  const data = await fetchCompareData(pair[0], pair[1]);

  if (!data) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--color-surface)" }}>
        <Header />
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px", textAlign: "center" }}>
          <h2 style={{ fontSize: 20, color: "var(--color-primary)" }}>Comparison not available</h2>
          <Link href="/brands" style={{ color: "var(--color-accent)" }}>Browse all brands</Link>
        </div>
      </div>
    );
  }

  const a = data.brand_a;
  const b = data.brand_b;
  const pageUrl = `https://www.mailmuse.in/compare/${slug}`;

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.mailmuse.in" },
      { "@type": "ListItem", position: 2, name: "Brands", item: "https://www.mailmuse.in/brands" },
      { "@type": "ListItem", position: 3, name: `${a.name} vs ${b.name}`, item: pageUrl },
    ],
  };

  const faqItems = [
    {
      q: `Which brand sends more emails, ${a.name} or ${b.name}?`,
      a: `${data.comparison_summary.more_active} sends more emails. ${a.name} sends ${a.emails_per_week.toFixed(1)} emails/week (${a.total_emails} total) while ${b.name} sends ${b.emails_per_week.toFixed(1)} emails/week (${b.total_emails} total).`,
    },
    {
      q: `How do ${a.name} and ${b.name} subject lines compare?`,
      a: `${data.comparison_summary.longer_subjects} uses longer subject lines. ${a.name} averages ${Math.round(a.avg_subject_length)} characters while ${b.name} averages ${Math.round(b.avg_subject_length)} characters. ${data.comparison_summary.more_emoji} uses more emoji in subject lines.`,
    },
    {
      q: `What types of emails do ${a.name} and ${b.name} send?`,
      a: `${a.name}'s most common email type is ${a.top_campaign_type}, while ${b.name} primarily sends ${b.top_campaign_type} emails.`,
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

  const metrics = [
    { label: "Total Emails", a: a.total_emails.toLocaleString(), b: b.total_emails.toLocaleString() },
    { label: "Emails/Week", a: a.emails_per_week.toFixed(1), b: b.emails_per_week.toFixed(1) },
    { label: "Top Campaign Type", a: a.top_campaign_type, b: b.top_campaign_type },
    { label: "Avg Subject Length", a: `${Math.round(a.avg_subject_length)} chars`, b: `${Math.round(b.avg_subject_length)} chars` },
    { label: "Emoji Usage", a: `${a.emoji_usage_rate}%`, b: `${b.emoji_usage_rate}%` },
    { label: "Peak Send Day", a: a.peak_send_day || "N/A", b: b.peak_send_day || "N/A" },
    { label: "Peak Send Time", a: a.peak_send_time || "N/A", b: b.peak_send_time || "N/A" },
  ];

  // Collect all campaign types across both brands
  const allTypes = new Set([
    ...Object.keys(a.campaign_breakdown),
    ...Object.keys(b.campaign_breakdown),
  ]);

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-surface)" }}>
      <JsonLd data={breadcrumbLd} />
      <JsonLd data={faqLd} />
      <Header />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px" }}>
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Brands", href: "/brands" },
            { label: `${a.name} vs ${b.name}` },
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
            {a.name} vs {b.name}: Email Marketing Compared
          </h1>
          <p style={{ fontSize: 15, lineHeight: 1.7, color: "var(--color-secondary)", margin: 0 }}>
            Compare email marketing strategies between {a.name} and {b.name}.
            {data.shared_industry && ` Both brands operate in the ${data.shared_industry} industry.`}
            {" "}{data.comparison_summary.more_active} is the more active emailer,
            sending {data.comparison_summary.more_active === a.name ? a.emails_per_week.toFixed(1) : b.emails_per_week.toFixed(1)} emails per week.
            {" "}{data.comparison_summary.longer_subjects} tends to use longer subject lines,
            while {data.comparison_summary.more_emoji} uses emoji more frequently.
          </p>
        </div>

        {/* Comparison Table */}
        <div style={cardStyle}>
          <h2 style={headingStyle}>Side-by-Side Comparison</h2>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left", padding: "10px 12px", borderBottom: "2px solid var(--color-border)", color: "var(--color-tertiary)", fontWeight: 600, fontSize: 12, textTransform: "uppercase" }}>Metric</th>
                  <th style={{ textAlign: "center", padding: "10px 12px", borderBottom: "2px solid var(--color-border)", color: "var(--color-accent)", fontWeight: 600 }}>{a.name}</th>
                  <th style={{ textAlign: "center", padding: "10px 12px", borderBottom: "2px solid var(--color-border)", color: "var(--color-accent)", fontWeight: 600 }}>{b.name}</th>
                </tr>
              </thead>
              <tbody>
                {metrics.map((row, i) => (
                  <tr key={row.label} style={{ background: i % 2 === 0 ? "var(--color-surface)" : "white" }}>
                    <td style={{ padding: "10px 12px", fontWeight: 500, color: "var(--color-primary)" }}>{row.label}</td>
                    <td style={{ padding: "10px 12px", textAlign: "center", color: "var(--color-secondary)" }}>{row.a}</td>
                    <td style={{ padding: "10px 12px", textAlign: "center", color: "var(--color-secondary)" }}>{row.b}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Strategy Prose */}
        <div style={cardStyle}>
          <h2 style={headingStyle}>Email Strategy Analysis</h2>
          <p style={{ fontSize: 15, lineHeight: 1.7, color: "var(--color-secondary)", margin: "0 0 12px" }}>
            {a.name} focuses primarily on {a.top_campaign_type} emails, which make up the largest share of their email campaigns.
            Their subject lines average {Math.round(a.avg_subject_length)} characters and they use emoji in {a.emoji_usage_rate}% of emails.
            {a.peak_send_day && ` Their preferred send day is ${a.peak_send_day}`}
            {a.peak_send_time && ` during the ${a.peak_send_time} time slot`}.
          </p>
          <p style={{ fontSize: 15, lineHeight: 1.7, color: "var(--color-secondary)", margin: "0 0 12px" }}>
            {b.name}, on the other hand, leans toward {b.top_campaign_type} emails as their primary campaign type.
            With an average subject line of {Math.round(b.avg_subject_length)} characters and {b.emoji_usage_rate}% emoji usage,
            {b.name} takes a {b.avg_subject_length > a.avg_subject_length ? "more descriptive" : "more concise"} approach to subject lines.
            {b.peak_send_day && ` They prefer sending emails on ${b.peak_send_day}`}
            {b.peak_send_time && ` in the ${b.peak_send_time}`}.
          </p>
          <p style={{ fontSize: 15, lineHeight: 1.7, color: "var(--color-secondary)", margin: 0 }}>
            Overall, {data.comparison_summary.more_active} maintains a higher email cadence
            at {data.comparison_summary.more_active === a.name ? a.emails_per_week.toFixed(1) : b.emails_per_week.toFixed(1)} emails per week
            compared to {data.comparison_summary.more_active === a.name ? b.name : a.name}&apos;s{" "}
            {data.comparison_summary.more_active === a.name ? b.emails_per_week.toFixed(1) : a.emails_per_week.toFixed(1)} emails per week.
          </p>
        </div>

        {/* Subject Line Examples */}
        {((a.sample_subjects?.length ?? 0) > 0 || (b.sample_subjects?.length ?? 0) > 0) && (
          <div style={cardStyle}>
            <h2 style={headingStyle}>Subject Line Examples</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
              <div>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: "var(--color-accent)", margin: "0 0 12px" }}>{a.name}</h3>
                {(a.sample_subjects || []).slice(0, 5).map((subj, i) => (
                  <div key={i} style={{ fontSize: 13, lineHeight: 1.5, color: "var(--color-secondary)", padding: "6px 0", borderBottom: "1px solid var(--color-border)" }}>
                    &ldquo;{subj}&rdquo;
                  </div>
                ))}
              </div>
              <div>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: "var(--color-accent)", margin: "0 0 12px" }}>{b.name}</h3>
                {(b.sample_subjects || []).slice(0, 5).map((subj, i) => (
                  <div key={i} style={{ fontSize: 13, lineHeight: 1.5, color: "var(--color-secondary)", padding: "6px 0", borderBottom: "1px solid var(--color-border)" }}>
                    &ldquo;{subj}&rdquo;
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Recent Emails */}
        {((a.recent_emails?.length ?? 0) > 0 || (b.recent_emails?.length ?? 0) > 0) && (
          <div style={cardStyle}>
            <h2 style={headingStyle}>Recent Emails</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
              <div>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: "var(--color-accent)", margin: "0 0 12px" }}>{a.name}</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {(a.recent_emails || []).slice(0, 5).map((email) => (
                    <SeoEmailLink
                      key={email.id}
                      id={email.id}
                      subject={email.subject}
                      type={email.type}
                      received_at={email.received_at || undefined}
                    />
                  ))}
                </div>
              </div>
              <div>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: "var(--color-accent)", margin: "0 0 12px" }}>{b.name}</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {(b.recent_emails || []).slice(0, 5).map((email) => (
                    <SeoEmailLink
                      key={email.id}
                      id={email.id}
                      subject={email.subject}
                      type={email.type}
                      received_at={email.received_at || undefined}
                    />
                  ))}
                </div>
              </div>
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

        {/* Internal Links */}
        <div style={cardStyle}>
          <h2 style={headingStyle}>Explore More</h2>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link
              href={`/brand/${encodeURIComponent(a.name)}`}
              style={{
                padding: "8px 16px", borderRadius: 8,
                background: "var(--color-surface)", border: "1px solid var(--color-border)",
                color: "var(--color-accent)", fontSize: 13, fontWeight: 500, textDecoration: "none",
              }}
            >
              {a.name} Emails
            </Link>
            <Link
              href={`/brand/${encodeURIComponent(b.name)}`}
              style={{
                padding: "8px 16px", borderRadius: 8,
                background: "var(--color-surface)", border: "1px solid var(--color-border)",
                color: "var(--color-accent)", fontSize: 13, fontWeight: 500, textDecoration: "none",
              }}
            >
              {b.name} Emails
            </Link>
            {data.shared_industry && (
              <Link
                href={`/industry/${industryToSlug(data.shared_industry)}`}
                style={{
                  padding: "8px 16px", borderRadius: 8,
                  background: "var(--color-surface)", border: "1px solid var(--color-border)",
                  color: "var(--color-accent)", fontSize: 13, fontWeight: 500, textDecoration: "none",
                }}
              >
                {data.shared_industry} Emails
              </Link>
            )}
            {[...allTypes].slice(0, 3).map((type) => (
              <Link
                key={type}
                href={`/types/${typeToSlug(type)}`}
                style={{
                  padding: "8px 16px", borderRadius: 8,
                  background: "var(--color-surface)", border: "1px solid var(--color-border)",
                  color: "var(--color-accent)", fontSize: 13, fontWeight: 500, textDecoration: "none",
                }}
              >
                {type} Emails
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
