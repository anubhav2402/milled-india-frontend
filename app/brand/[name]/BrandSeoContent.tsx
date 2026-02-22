import JsonLd from "../../components/JsonLd";

type BrandAnalytics = {
  brand: string;
  total_emails: number | string;
  primary_industry: string | null;
  emails_per_week: number | string;
  first_email: string | null;
  campaign_breakdown: Record<string, number | string>;
  send_day_distribution: Record<string, number> | string;
  subject_line_stats:
    | { avg_length: number; emoji_usage_rate: number; top_words: string[] }
    | string;
};

export default function BrandSeoContent({
  analytics,
  brandName,
}: {
  analytics: BrandAnalytics;
  brandName: string;
}) {
  const totalEmails = analytics.total_emails;
  const industry = analytics.primary_industry || "D2C";
  const epw = analytics.emails_per_week;

  // Campaign breakdown
  const campaigns =
    typeof analytics.campaign_breakdown === "object"
      ? analytics.campaign_breakdown
      : {};
  const sortedCampaigns = Object.entries(campaigns)
    .filter(([, v]) => typeof v === "number")
    .sort(([, a], [, b]) => (b as number) - (a as number));
  const campaignTotal = sortedCampaigns.reduce(
    (sum, [, v]) => sum + (v as number),
    0
  );

  // Send days
  const sendDays =
    typeof analytics.send_day_distribution === "object"
      ? analytics.send_day_distribution
      : null;
  const peakDay = sendDays
    ? Object.entries(sendDays).sort(([, a], [, b]) => b - a)[0]?.[0]
    : null;

  // Subject stats
  const subjectStats =
    typeof analytics.subject_line_stats === "object"
      ? analytics.subject_line_stats
      : null;

  // First email date
  const sinceDate =
    analytics.first_email && analytics.first_email !== "xx"
      ? new Date(analytics.first_email).toLocaleDateString("en-IN", {
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
          campaignTotal > 0
            ? Math.round(((count as number) / campaignTotal) * 100)
            : 0;
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

  if (subjectStats) {
    faqItems.push({
      question: `What is ${brandName}'s average email subject line length?`,
      answer: `${brandName}'s subject lines average ${subjectStats.avg_length} characters. About ${subjectStats.emoji_usage_rate}% of their subject lines include emojis.`,
    });
  }

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
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
            {brandName} is a {industry} brand tracked by MailMuse.{" "}
            {typeof totalEmails === "number"
              ? `We have analyzed ${totalEmails} emails from ${brandName}`
              : `We track emails from ${brandName}`}
            {sinceDate ? ` since ${sinceDate}` : ""}.{" "}
            {brandName} sends approximately {epw} emails per week.
          </p>

          {sortedCampaigns.length > 0 && (
            <p style={textStyle}>
              The most common campaign type is{" "}
              <strong>{sortedCampaigns[0][0]}</strong>
              {campaignTotal > 0 &&
                ` (${Math.round(((sortedCampaigns[0][1] as number) / campaignTotal) * 100)}% of all emails)`}
              {sortedCampaigns.length > 1 &&
                `, followed by ${sortedCampaigns
                  .slice(1, 3)
                  .map(([type]) => type)
                  .join(" and ")}`}
              .
            </p>
          )}

          {peakDay && (
            <p style={textStyle}>
              {brandName} sends most frequently on{" "}
              <strong>{peakDay}s</strong>.
              {subjectStats &&
                ` Their subject lines average ${subjectStats.avg_length} characters, with ${subjectStats.emoji_usage_rate}% containing emojis.`}
            </p>
          )}
        </div>

        {/* FAQ */}
        {faqItems.length > 0 && (
          <div style={cardStyle}>
            <h2 style={headingStyle}>
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
    </>
  );
}
