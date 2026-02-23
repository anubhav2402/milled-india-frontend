import Link from "next/link";
import JsonLd from "../../components/JsonLd";
import { industryToSlug } from "../../lib/industry-utils";
import { typeToSlug } from "../../lib/type-utils";
import type { BrandSeoData } from "./page";

export default function BrandSeoContent({
  data,
  brandName,
}: {
  data: BrandSeoData;
  brandName: string;
}) {
  const industry = data.industry || "D2C";
  const epw = data.emails_per_week;
  const totalEmails = data.total_emails;

  // Campaign breakdown
  const sortedCampaigns = Object.entries(data.campaign_breakdown).sort(
    ([, a], [, b]) => b - a
  );
  const campaignTotal = sortedCampaigns.reduce((sum, [, v]) => sum + v, 0);

  // Send days
  const peakDay = Object.entries(data.send_day_distribution).sort(
    ([, a], [, b]) => b - a
  )[0]?.[0];

  // Send times
  const peakTime = Object.entries(data.send_time_distribution).sort(
    ([, a], [, b]) => b - a
  )[0]?.[0];

  const stats = data.subject_line_stats;

  const sinceDate = data.first_email
    ? new Date(data.first_email).toLocaleDateString("en-IN", {
        month: "long",
        year: "numeric",
      })
    : null;

  // Build FAQ items
  const faqItems: { question: string; answer: string }[] = [];

  faqItems.push({
    question: `How often does ${brandName} send marketing emails?`,
    answer: `${brandName} sends approximately ${epw} marketing emails per week, based on MailMuse's analysis of ${totalEmails} tracked emails.`,
  });

  if (sortedCampaigns.length > 0) {
    const topTypes = sortedCampaigns
      .slice(0, 3)
      .map(([type, count]) => {
        const pct =
          campaignTotal > 0 ? Math.round((count / campaignTotal) * 100) : 0;
        return `${type} (${pct}%)`;
      })
      .join(", ");
    faqItems.push({
      question: `What types of emails does ${brandName} send?`,
      answer: `${brandName}'s email mix includes: ${topTypes}. These categories are based on automated classification of ${totalEmails} emails.`,
    });
  }

  if (peakDay) {
    faqItems.push({
      question: `What day does ${brandName} send the most emails?`,
      answer: `${brandName} sends the most emails on ${peakDay}s, based on our send-day distribution analysis.`,
    });
  }

  faqItems.push({
    question: `What is ${brandName}'s average email subject line length?`,
    answer: `${brandName}'s subject lines average ${stats.avg_length} characters. About ${stats.emoji_usage_rate}% of their subject lines include emojis.`,
  });

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  const sectionStyle: React.CSSProperties = {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "0 24px 48px",
  };

  const cardStyle: React.CSSProperties = {
    background: "white",
    borderRadius: 14,
    padding: "28px 32px",
    border: "1px solid var(--color-border)",
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
    <>
      <JsonLd data={faqLd} />
      <div style={sectionStyle}>
        {/* Summary */}
        <div style={{ ...cardStyle, marginBottom: 20 }}>
          <h2 style={headingStyle}>
            About {brandName}&apos;s Email Marketing
          </h2>
          <p style={textStyle}>
            {brandName} is a {industry} brand tracked by MailMuse. We have
            analyzed {totalEmails} emails from {brandName}
            {sinceDate ? ` since ${sinceDate}` : ""}. {brandName} sends
            approximately {epw} emails per week.
          </p>

          {sortedCampaigns.length > 0 && (
            <p style={textStyle}>
              The most common campaign type is{" "}
              <strong>{sortedCampaigns[0][0]}</strong>
              {campaignTotal > 0 &&
                ` (${Math.round((sortedCampaigns[0][1] / campaignTotal) * 100)}% of all emails)`}
              {sortedCampaigns.length > 1 &&
                `, followed by ${sortedCampaigns
                  .slice(1, 3)
                  .map(([type]) => type)
                  .join(" and ")}`}
              .{" "}
              {sortedCampaigns.length > 0 && (
                <>
                  Browse all{" "}
                  <Link
                    href={`/types/${typeToSlug(sortedCampaigns[0][0])}`}
                    style={{ color: "var(--color-accent)" }}
                  >
                    {sortedCampaigns[0][0]} email examples
                  </Link>{" "}
                  from Indian D2C brands.
                </>
              )}
            </p>
          )}

          {peakDay && (
            <p style={textStyle}>
              {brandName} sends most frequently on{" "}
              <strong>{peakDay}s</strong>
              {peakTime ? ` during the ${peakTime} window` : ""}.{" "}
              Their subject lines average {stats.avg_length} characters, with{" "}
              {stats.emoji_usage_rate}% containing emojis.
            </p>
          )}
        </div>

        {/* Subject Line Patterns */}
        {stats.sample_subjects.length > 0 && (
          <div style={{ ...cardStyle, marginBottom: 20 }}>
            <h2 style={headingStyle}>
              Subject Line Patterns
            </h2>
            <p style={textStyle}>
              {brandName}&apos;s subject lines average{" "}
              <strong>{stats.avg_length} characters</strong> and{" "}
              <strong>{stats.emoji_usage_rate}%</strong> of them include emojis.
              {stats.top_words.length > 0 && (
                <> Common words include: {stats.top_words.slice(0, 5).join(", ")}.</>
              )}
            </p>
            <h3
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: "var(--color-primary)",
                margin: "16px 0 10px",
              }}
            >
              Example Subject Lines
            </h3>
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              {stats.sample_subjects.map((subj, i) => (
                <li
                  key={i}
                  style={{
                    fontSize: 14,
                    lineHeight: 1.6,
                    color: "var(--color-secondary)",
                    marginBottom: 6,
                  }}
                >
                  &ldquo;{subj}&rdquo;
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Festive Campaigns */}
        {data.festive_campaigns.length > 0 && (
          <div style={{ ...cardStyle, marginBottom: 20 }}>
            <h2 style={headingStyle}>Festive Campaign Activity</h2>
            <p style={textStyle}>
              {brandName} actively participates in Indian festive email
              campaigns.{" "}
              {data.festive_campaigns.length === 1
                ? `During ${data.festive_campaigns[0].festival} ${data.festive_campaigns[0].year}, they sent ${data.festive_campaigns[0].count} targeted campaign emails.`
                : `Across recent festive seasons, ${brandName} has sent emails for ${data.festive_campaigns.map((f) => f.festival).join(", ")}.`}
            </p>
            <div
              style={{
                display: "flex",
                gap: 12,
                flexWrap: "wrap",
                marginTop: 12,
              }}
            >
              {data.festive_campaigns.map((fc, i) => (
                <Link
                  key={i}
                  href={`/campaigns/${fc.festival.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${fc.year}`}
                  style={{
                    display: "inline-block",
                    padding: "6px 14px",
                    borderRadius: 8,
                    background: "var(--color-accent-light)",
                    color: "var(--color-accent)",
                    fontSize: 13,
                    fontWeight: 600,
                    textDecoration: "none",
                  }}
                >
                  {fc.festival} {fc.year} ({fc.count} emails)
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Internal Links */}
        <div style={{ ...cardStyle, marginBottom: 20 }}>
          <h2 style={headingStyle}>Explore More</h2>
          <div
            style={{
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
            }}
          >
            {data.industry && (
              <Link
                href={`/industry/${industryToSlug(data.industry)}`}
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
                Browse {data.industry} brands
              </Link>
            )}
            {sortedCampaigns.slice(0, 3).map(([type]) => (
              <Link
                key={type}
                href={`/types/${typeToSlug(type)}`}
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
                All {type} emails
              </Link>
            ))}
            {data.related_brands.length > 0 && (
              <Link
                href={`/compare/${encodeURIComponent(
                  [brandName, data.related_brands[0]]
                    .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
                    .map((b) =>
                      b.toLowerCase().replace(/[&]/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")
                    )
                    .join("-vs-")
                )}`}
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
                Compare {brandName} vs {data.related_brands[0]}
              </Link>
            )}
          </div>
        </div>

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
    </>
  );
}
