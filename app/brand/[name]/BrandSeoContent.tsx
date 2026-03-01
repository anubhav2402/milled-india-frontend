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
  const industry = data.industry || "Brand";
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

  // --- Email strategy analysis computations ---

  // Strategy characterisation based on campaign mix
  const saleTypes = ["Sale", "Promotion", "Flash Sale", "Clearance"];
  const relationshipTypes = ["Welcome", "Newsletter", "Loyalty", "Thank You"];
  const festiveTypes = ["Festive", "Festival", "Holiday"];
  const salePct = sortedCampaigns.reduce(
    (sum, [type, count]) =>
      sum +
      (saleTypes.some((s) => type.toLowerCase().includes(s.toLowerCase()))
        ? campaignTotal > 0
          ? (count / campaignTotal) * 100
          : 0
        : 0),
    0
  );
  const relationshipPct = sortedCampaigns.reduce(
    (sum, [type, count]) =>
      sum +
      (relationshipTypes.some((r) =>
        type.toLowerCase().includes(r.toLowerCase())
      )
        ? campaignTotal > 0
          ? (count / campaignTotal) * 100
          : 0
        : 0),
    0
  );
  const festivePct = sortedCampaigns.reduce(
    (sum, [type, count]) =>
      sum +
      (festiveTypes.some((f) => type.toLowerCase().includes(f.toLowerCase()))
        ? campaignTotal > 0
          ? (count / campaignTotal) * 100
          : 0
        : 0),
    0
  );

  let strategyLabel = "balanced";
  if (salePct > 40) strategyLabel = "promotion-heavy";
  else if (relationshipPct > 40) strategyLabel = "relationship-building";
  else if (festivePct > 25) strategyLabel = "seasonally-driven";
  else if (sortedCampaigns.length >= 4) strategyLabel = "diversified";

  // Frequency tier
  let frequencyTier = "conservative";
  if (epw >= 7) frequencyTier = "aggressive";
  else if (epw >= 4) frequencyTier = "active";
  else if (epw >= 2) frequencyTier = "moderate";

  // Second-peak day for send timing analysis
  const sortedDays = Object.entries(data.send_day_distribution).sort(
    ([, a], [, b]) => b - a
  );
  const secondPeakDay = sortedDays[1]?.[0];
  const totalDaySends = sortedDays.reduce((sum, [, v]) => sum + v, 0);
  const peakDayPct =
    peakDay && totalDaySends > 0
      ? Math.round(
          ((data.send_day_distribution[peakDay] || 0) / totalDaySends) * 100
        )
      : 0;

  // Subject line benchmark comparisons
  const avgSubjectBenchmark = 50;
  const avgEmojiBenchmark = 20;
  const subjectLengthDiff = stats.avg_length - avgSubjectBenchmark;
  const emojiDiff = stats.emoji_usage_rate - avgEmojiBenchmark;

  let subjectLengthVerdict = "right at the industry average";
  if (subjectLengthDiff > 10) subjectLengthVerdict = "notably longer than average";
  else if (subjectLengthDiff > 3)
    subjectLengthVerdict = "slightly above average";
  else if (subjectLengthDiff < -10)
    subjectLengthVerdict = "considerably shorter than average";
  else if (subjectLengthDiff < -3)
    subjectLengthVerdict = "slightly below average";

  let emojiVerdict = "in line with the typical benchmark";
  if (emojiDiff > 15) emojiVerdict = "well above the industry norm";
  else if (emojiDiff > 5) emojiVerdict = "moderately above average";
  else if (emojiDiff < -15) emojiVerdict = "well below the industry norm";
  else if (emojiDiff < -5) emojiVerdict = "below the typical benchmark";

  // Festive campaign calendar insights
  const uniqueFestivals = [
    ...new Set(data.festive_campaigns.map((f) => f.festival)),
  ];
  const uniqueYears = [...new Set(data.festive_campaigns.map((f) => f.year))];
  const totalFestiveEmails = data.festive_campaigns.reduce(
    (sum, f) => sum + f.count,
    0
  );

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
                  from top brands.
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

        {/* Email Strategy Analysis */}
        {sortedCampaigns.length > 0 && (
          <div style={{ ...cardStyle, marginBottom: 20 }}>
            <h2 style={headingStyle}>
              {brandName}&apos;s Email Strategy Analysis
            </h2>

            {/* Strategy characterisation paragraph */}
            <p style={textStyle}>
              Based on our analysis of {totalEmails} emails, {brandName} employs
              a <strong>{strategyLabel}</strong> email marketing strategy.{" "}
              {salePct > 40
                ? `Promotional and sale-driven emails make up roughly ${Math.round(salePct)}% of their campaigns, suggesting a strong focus on driving immediate conversions and revenue through discounts and offers.`
                : relationshipPct > 40
                ? `Relationship-oriented emails like newsletters and welcome sequences represent about ${Math.round(relationshipPct)}% of their output, indicating a priority on nurturing subscriber loyalty over hard selling.`
                : festivePct > 25
                ? `Seasonal and festive campaigns account for around ${Math.round(festivePct)}% of their emails, showing that ${brandName} heavily leverages cultural and seasonal moments to engage their audience.`
                : `Their campaign mix spans ${sortedCampaigns.length} different email types, reflecting a well-rounded approach that balances promotions, content, and seasonal messaging.`}{" "}
              With an average of {epw} emails per week, their cadence falls
              into the <strong>{frequencyTier}</strong> tier
              {frequencyTier === "conservative"
                ? " — sending fewer than 2 emails weekly, which helps avoid subscriber fatigue but may limit touchpoints"
                : frequencyTier === "moderate"
                ? " — a measured pace of 2\u20134 emails per week that balances visibility with subscriber comfort"
                : frequencyTier === "active"
                ? " — maintaining 4\u20137 weekly touchpoints, which keeps the brand top-of-mind without overwhelming inboxes"
                : " — an intensive 7+ emails per week cadence that maximises exposure, though it risks higher unsubscribe rates"}
              .
            </p>

            {/* Send timing paragraph */}
            {peakDay && (
              <p style={textStyle}>
                {brandName}&apos;s preferred send day is{" "}
                <strong>{peakDay}</strong>
                {peakDayPct > 0
                  ? `, accounting for ${peakDayPct}% of all sends`
                  : ""}
                {secondPeakDay
                  ? `, with ${secondPeakDay} as their second most active day`
                  : ""}
                .{" "}
                {peakTime
                  ? `Their peak sending window is the ${peakTime} slot, which `
                  : "This "}
                {peakTime &&
                  (peakTime === "Morning"
                    ? "targets subscribers early in the day when open rates tend to be highest for many industries."
                    : peakTime === "Afternoon"
                    ? "aims to catch subscribers during the midday break, a popular window for retail and lifestyle brands."
                    : peakTime === "Evening"
                    ? "reaches subscribers after work hours, aligning with peak online shopping periods."
                    : "is an unconventional timing choice that may help the brand stand out in less crowded inboxes.")}
                {!peakTime &&
                  "Their send times are distributed throughout the day without a single dominant window."}
              </p>
            )}

            {/* Subject line benchmarks paragraph */}
            <p style={textStyle}>
              {brandName}&apos;s subject lines average{" "}
              <strong>{stats.avg_length} characters</strong>, which is{" "}
              {subjectLengthVerdict} (industry benchmark: ~{avgSubjectBenchmark}{" "}
              characters).{" "}
              {subjectLengthDiff > 3
                ? "Longer subject lines can convey more detail but risk getting truncated on mobile devices."
                : subjectLengthDiff < -3
                ? "Shorter subject lines improve mobile readability and can boost open rates through curiosity."
                : "This length works well across both desktop and mobile email clients."}{" "}
              Their emoji usage rate of{" "}
              <strong>{stats.emoji_usage_rate}%</strong> is {emojiVerdict}{" "}
              (~{avgEmojiBenchmark}% across brands).{" "}
              {stats.emoji_usage_rate > avgEmojiBenchmark + 5
                ? "Frequent emoji use can increase visual stand-out in the inbox, though overuse may appear less professional for certain audiences."
                : stats.emoji_usage_rate < avgEmojiBenchmark - 5
                ? "A lower emoji rate lends a more formal tone, which may resonate well with their target demographic."
                : "This balanced approach keeps subject lines engaging without over-relying on visual gimmicks."}
            </p>
          </div>
        )}

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
              {brandName} actively participates in festive email
              campaigns.{" "}
              {data.festive_campaigns.length === 1
                ? `During ${data.festive_campaigns[0].festival} ${data.festive_campaigns[0].year}, they sent ${data.festive_campaigns[0].count} targeted campaign emails.`
                : `Across recent festive seasons, ${brandName} has sent emails for ${data.festive_campaigns.map((f) => f.festival).join(", ")}.`}
            </p>

            {/* Campaign Calendar insights */}
            <p style={textStyle}>
              {brandName}&apos;s festive calendar spans{" "}
              <strong>
                {uniqueFestivals.length}{" "}
                {uniqueFestivals.length === 1 ? "festival" : "different festivals"}
              </strong>
              {uniqueYears.length > 1
                ? ` across ${uniqueYears.length} years (${uniqueYears.sort().join(", ")})`
                : uniqueYears.length === 1
                ? ` in ${uniqueYears[0]}`
                : ""}
              , totalling {totalFestiveEmails} festive campaign emails.{" "}
              {uniqueFestivals.length >= 3
                ? `This broad seasonal participation indicates that ${brandName} treats festive marketing as a core part of their annual strategy, engaging customers across multiple cultural moments.`
                : uniqueFestivals.length === 2
                ? `By targeting two key seasonal events, ${brandName} focuses their festive efforts on the occasions most relevant to their audience.`
                : `Concentrating on a single festive period allows ${brandName} to invest more creative effort into a focused seasonal push.`}
              {" "}
              {data.festive_campaigns.some((f) =>
                ["Diwali", "Navratri", "Durga Puja", "Onam"].some((d) =>
                  f.festival.toLowerCase().includes(d.toLowerCase())
                )
              )
                ? "Their presence in major Indian festivals highlights a strategy tuned to the domestic market."
                : data.festive_campaigns.some((f) =>
                    ["Christmas", "Black Friday", "Cyber Monday", "New Year"].some(
                      (w) => f.festival.toLowerCase().includes(w.toLowerCase())
                    )
                  )
                ? "Their focus on global shopping events suggests a strategy aimed at an internationally-minded customer base."
                : "Their festival selection reflects a tailored approach to seasonal consumer demand."}
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

          {/* How Brand Compares paragraph */}
          <p style={textStyle}>
            {brandName} sends {epw} emails per week, putting them in the{" "}
            <strong>{frequencyTier}</strong> tier for{" "}
            {data.industry ? `${data.industry} brands` : "email marketers"}.{" "}
            {frequencyTier === "aggressive"
              ? "This places them among the most prolific senders in their category."
              : frequencyTier === "active"
              ? "This is an above-average sending frequency within their category."
              : frequencyTier === "moderate"
              ? "This is a typical frequency that balances engagement with inbox respect."
              : "This conservative cadence is lower than most brands in the space."}{" "}
            {data.industry ? (
              <>
                Browse other{" "}
                <Link
                  href={`/industry/${industryToSlug(data.industry)}`}
                  style={{ color: "var(--color-accent)" }}
                >
                  {data.industry} brands
                </Link>{" "}
                to compare strategies
                {data.related_brands.length > 0
                  ? `, or see how ${brandName} stacks up directly against ${data.related_brands.slice(0, 2).join(" and ")}.`
                  : "."}
              </>
            ) : (
              <>
                Explore more brands on MailMuse to benchmark email strategies
                across industries.
              </>
            )}
          </p>

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
