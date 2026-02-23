import SeoEmailLink from "../../components/SeoEmailLink";

type RecentEmail = {
  id: number;
  subject: string;
  type: string;
  received_at: string | null;
};

export default function BrandRecentEmails({
  emails,
  brandName,
}: {
  emails: RecentEmail[];
  brandName: string;
}) {
  if (!emails || emails.length === 0) return null;

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px 48px" }}>
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
          Recent Emails from {brandName}
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {emails.map((email) => (
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
  );
}
