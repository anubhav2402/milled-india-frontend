import Logo from "../../components/Logo";

type Email = {
  id: number;
  subject: string;
  brand?: string;
  received_at: string;
  html: string;
};

async function fetchEmail(id: string): Promise<Email> {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL!;
  const res = await fetch(`${base}/emails/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch email");
  return res.json();
}

export default async function EmailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const email = await fetchEmail(id);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#fafafa" }}>
      {/* Sticky Header */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          backgroundColor: "#fff",
          borderBottom: "1px solid #e5e5e5",
          padding: "16px 0",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <a href="/" style={{ textDecoration: "none", color: "inherit", display: "flex", alignItems: "center", gap: 8 }}>
            <Logo size={32} />
            <span style={{ fontSize: 24, fontWeight: 700, color: "#1a1a1a" }}>MailMuse</span>
          </a>
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <a
              href="/browse"
              style={{
                color: "#666",
                textDecoration: "none",
                fontSize: 14,
                fontWeight: 500,
              }}
            >
              ← Back to Browse
            </a>
            <a
              href="/browse"
              style={{
                padding: "10px 24px",
                backgroundColor: "#14b8a6",
                color: "#fff",
                textDecoration: "none",
                borderRadius: 8,
                fontWeight: 500,
                fontSize: 14,
              }}
            >
              Browse More
            </a>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px" }}>
        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: 16,
            border: "1px solid #e5e5e5",
            padding: 40,
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          }}
        >
          {/* Email header */}
          <div style={{ marginBottom: 32, paddingBottom: 24, borderBottom: "2px solid #f0fdfa" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 16, flexWrap: "wrap", gap: 12 }}>
              {email.brand && (
                <span
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#f0fdfa",
                    borderRadius: 20,
                    fontSize: 13,
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    color: "#14b8a6",
                    border: "1px solid #ccfbf1",
                  }}
                >
                  {email.brand}
                </span>
              )}
              <time
                style={{
                  fontSize: 14,
                  color: "#999",
                  fontWeight: 500,
                }}
              >
                {new Date(email.received_at).toLocaleString("en-IN", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </time>
            </div>
            <h1
              style={{
                margin: 0,
                fontSize: 32,
                fontWeight: 700,
                color: "#1a1a1a",
                lineHeight: 1.3,
              }}
            >
              {email.subject}
            </h1>
          </div>

          {/* Email body */}
          <article
            style={{
              fontSize: 16,
              lineHeight: 1.7,
              color: "#333",
            }}
            dangerouslySetInnerHTML={{ __html: email.html }}
          />
        </div>

        {/* Bottom CTA */}
        <div style={{ marginTop: 40, textAlign: "center" }}>
          <a
            href="/browse"
            style={{
              padding: "14px 28px",
              backgroundColor: "#14b8a6",
              color: "#fff",
              textDecoration: "none",
              borderRadius: 12,
              fontWeight: 600,
              fontSize: 16,
              display: "inline-block",
              transition: "background-color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#0d9488")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#14b8a6")}
          >
            Browse More Emails
          </a>
        </div>
      </main>
    </div>
  );
}