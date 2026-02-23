import Link from "next/link";
import SeoEmailLink from "../../components/SeoEmailLink";
import { industryToSlug } from "../../lib/industry-utils";
import { typeToSlug } from "../../lib/type-utils";

type EmailSeoData = {
  id: number;
  subject: string;
  brand: string;
  type: string;
  industry: string;
  received_at: string | null;
  preview: string | null;
  analysis: {
    char_count: number;
    word_count: number;
    has_emoji: boolean;
    has_question: boolean;
    has_number: boolean;
    has_personalization: boolean;
    has_urgency: boolean;
  };
  more_from_brand: {
    id: number;
    subject: string;
    type: string;
    received_at: string | null;
  }[];
  similar_emails: {
    id: number;
    subject: string;
    brand: string;
    type: string;
    received_at: string | null;
  }[];
};

export default function EmailSeoContent({ data }: { data: EmailSeoData }) {
  const a = data.analysis;

  // Build analysis paragraph
  const traits: string[] = [];
  if (a.has_emoji) traits.push("includes emoji");
  if (a.has_question) traits.push("uses a question format");
  if (a.has_number) traits.push("contains numbers");
  if (a.has_urgency) traits.push("conveys urgency");
  if (a.has_personalization) traits.push("uses personalization");

  const traitStr = traits.length > 0
    ? `The subject line ${traits.slice(0, -1).join(", ")}${traits.length > 1 ? " and " : ""}${traits[traits.length - 1]}.`
    : "";

  const dateStr = data.received_at
    ? new Date(data.received_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
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

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px 48px" }}>
      {/* Analysis */}
      <div style={cardStyle}>
        <h2 style={headingStyle}>Subject Line Analysis</h2>
        <p style={{ fontSize: 15, lineHeight: 1.7, color: "var(--color-secondary)", margin: "0 0 16px" }}>
          This {data.type.toLowerCase()} email from {data.brand} has a subject line of {a.char_count} characters
          ({a.word_count} words).{" "}{traitStr}{" "}
          {dateStr && `It was sent on ${dateStr}.`}
        </p>

        {/* Trait badges */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          <span style={{ padding: "4px 12px", borderRadius: 6, background: "var(--color-surface)", fontSize: 12, color: "var(--color-secondary)", fontWeight: 500 }}>
            {a.char_count} chars
          </span>
          <span style={{ padding: "4px 12px", borderRadius: 6, background: "var(--color-surface)", fontSize: 12, color: "var(--color-secondary)", fontWeight: 500 }}>
            {a.word_count} words
          </span>
          {a.has_emoji && (
            <span style={{ padding: "4px 12px", borderRadius: 6, background: "#fef3c7", fontSize: 12, color: "#92400e", fontWeight: 500 }}>
              Emoji
            </span>
          )}
          {a.has_urgency && (
            <span style={{ padding: "4px 12px", borderRadius: 6, background: "#fee2e2", fontSize: 12, color: "#991b1b", fontWeight: 500 }}>
              Urgency
            </span>
          )}
          {a.has_question && (
            <span style={{ padding: "4px 12px", borderRadius: 6, background: "#dbeafe", fontSize: 12, color: "#1e40af", fontWeight: 500 }}>
              Question
            </span>
          )}
          {a.has_number && (
            <span style={{ padding: "4px 12px", borderRadius: 6, background: "#d1fae5", fontSize: 12, color: "#065f46", fontWeight: 500 }}>
              Numbers
            </span>
          )}
          {a.has_personalization && (
            <span style={{ padding: "4px 12px", borderRadius: 6, background: "#ede9fe", fontSize: 12, color: "#5b21b6", fontWeight: 500 }}>
              Personalized
            </span>
          )}
        </div>
      </div>

      {/* More from brand */}
      {data.more_from_brand.length > 0 && (
        <div style={cardStyle}>
          <h2 style={headingStyle}>More Emails from {data.brand}</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {data.more_from_brand.map((email) => (
              <SeoEmailLink
                key={email.id}
                id={email.id}
                subject={email.subject}
                type={email.type}
                received_at={email.received_at || undefined}
              />
            ))}
          </div>
          <div style={{ marginTop: 16 }}>
            <Link
              href={`/brand/${encodeURIComponent(data.brand)}`}
              style={{ fontSize: 13, fontWeight: 500, color: "var(--color-accent)", textDecoration: "none" }}
            >
              View all from {data.brand} →
            </Link>
          </div>
        </div>
      )}

      {/* Similar emails */}
      {data.similar_emails.length > 0 && (
        <div style={cardStyle}>
          <h2 style={headingStyle}>Similar {data.type} Emails</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {data.similar_emails.map((email) => (
              <SeoEmailLink
                key={email.id}
                id={email.id}
                subject={email.subject}
                brand={email.brand}
                received_at={email.received_at || undefined}
              />
            ))}
          </div>
          <div style={{ marginTop: 16 }}>
            <Link
              href={`/types/${typeToSlug(data.type)}`}
              style={{ fontSize: 13, fontWeight: 500, color: "var(--color-accent)", textDecoration: "none" }}
            >
              Browse all {data.type} emails →
            </Link>
          </div>
        </div>
      )}

      {/* Internal links */}
      <div style={cardStyle}>
        <h2 style={headingStyle}>Explore More</h2>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {data.brand && (
            <Link
              href={`/brand/${encodeURIComponent(data.brand)}`}
              style={{
                padding: "8px 16px", borderRadius: 8,
                background: "var(--color-surface)", border: "1px solid var(--color-border)",
                color: "var(--color-accent)", fontSize: 13, fontWeight: 500, textDecoration: "none",
              }}
            >
              {data.brand} Emails
            </Link>
          )}
          {data.industry && (
            <Link
              href={`/industry/${industryToSlug(data.industry)}`}
              style={{
                padding: "8px 16px", borderRadius: 8,
                background: "var(--color-surface)", border: "1px solid var(--color-border)",
                color: "var(--color-accent)", fontSize: 13, fontWeight: 500, textDecoration: "none",
              }}
            >
              {data.industry} Emails
            </Link>
          )}
          {data.type && (
            <Link
              href={`/types/${typeToSlug(data.type)}`}
              style={{
                padding: "8px 16px", borderRadius: 8,
                background: "var(--color-surface)", border: "1px solid var(--color-border)",
                color: "var(--color-accent)", fontSize: 13, fontWeight: 500, textDecoration: "none",
              }}
            >
              {data.type} Emails
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
