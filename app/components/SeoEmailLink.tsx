import Link from "next/link";

type SeoEmailLinkProps = {
  id: number;
  subject: string;
  brand?: string;
  type?: string;
  received_at?: string;
};

export default function SeoEmailLink({
  id,
  subject,
  brand,
  type,
  received_at,
}: SeoEmailLinkProps) {
  const date = received_at
    ? new Date(received_at).toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <Link
      href={`/email/${id}`}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "12px 16px",
        background: "white",
        borderRadius: 10,
        border: "1px solid var(--color-border)",
        textDecoration: "none",
        color: "inherit",
        transition: "box-shadow 150ms ease",
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: "var(--color-primary)",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {subject}
        </div>
        <div
          style={{
            display: "flex",
            gap: 8,
            marginTop: 4,
            fontSize: 12,
            color: "var(--color-tertiary)",
          }}
        >
          {brand && <span>{brand}</span>}
          {type && (
            <>
              <span style={{ opacity: 0.4 }}>·</span>
              <span>{type}</span>
            </>
          )}
          {date && (
            <>
              <span style={{ opacity: 0.4 }}>·</span>
              <time>{date}</time>
            </>
          )}
        </div>
      </div>
      <span
        style={{ fontSize: 13, color: "var(--color-accent)", fontWeight: 500, flexShrink: 0 }}
      >
        View →
      </span>
    </Link>
  );
}
