"use client";

import { useEffect, useState } from "react";

type Email = {
  id: number;
  subject: string;
  brand?: string;
  preview?: string;
  received_at: string;
};

export default function EmailList({ initialEmails }: { initialEmails: Email[] }) {
  const [emails, setEmails] = useState(initialEmails);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Log for debugging
    console.log("Initial emails:", initialEmails.length);
    console.log("API URL:", process.env.NEXT_PUBLIC_API_BASE_URL);
  }, [initialEmails]);

  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "60px 20px", color: "#d00" }}>
        <p style={{ fontSize: 16 }}>Error: {error}</p>
        <p style={{ fontSize: 14, marginTop: 8, color: "#666" }}>
          Check browser console for details.
        </p>
      </div>
    );
  }

  if (emails.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "60px 20px", color: "#999" }}>
        <p style={{ fontSize: 16 }}>No emails found.</p>
        <p style={{ fontSize: 14, marginTop: 8 }}>
          API URL: {process.env.NEXT_PUBLIC_API_BASE_URL || "Not set"}
        </p>
        <p style={{ fontSize: 12, marginTop: 4, color: "#666" }}>
          Check that your backend is running and has emails in the database.
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
        gap: 24,
      }}
    >
      {emails.map((e) => (
        <a
          key={e.id}
          href={`/email/${e.id}`}
          style={{
            backgroundColor: "#fff",
            borderRadius: 12,
            border: "1px solid #e5e5e5",
            padding: 20,
            textDecoration: "none",
            color: "inherit",
            display: "block",
            transition: "all 0.2s",
            cursor: "pointer",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 12 }}>
            {e.brand && (
              <span
                style={{
                  padding: "4px 10px",
                  backgroundColor: "#f0f0f0",
                  borderRadius: 12,
                  fontSize: 11,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  color: "#666",
                }}
              >
                {e.brand}
              </span>
            )}
            <time
              style={{
                fontSize: 12,
                color: "#999",
              }}
            >
              {new Date(e.received_at).toLocaleDateString("en-IN", {
                month: "short",
                day: "numeric",
              })}
            </time>
          </div>
          <h2
            style={{
              margin: "0 0 12px 0",
              fontSize: 18,
              fontWeight: 600,
              color: "#1a1a1a",
              lineHeight: 1.4,
            }}
          >
            {e.subject}
          </h2>
          {e.preview && (
            <p
              style={{
                margin: 0,
                fontSize: 14,
                color: "#666",
                lineHeight: 1.5,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {e.preview}
            </p>
          )}
        </a>
      ))}
    </div>
  );
}
