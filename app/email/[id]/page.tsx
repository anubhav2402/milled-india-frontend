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
      {/* Header */}
      <header
        style={{
          backgroundColor: "#fff",
          borderBottom: "1px solid #e5e5e5",
          padding: "20px 0",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <a
            href="/"
            style={{
              color: "#1a1a1a",
              textDecoration: "none",
              fontSize: 14,
              fontWeight: 500,
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            ← Back to feed
          </a>
        </div>
      </header>

      {/* Main content */}
      <main style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px" }}>
        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: 12,
            border: "1px solid #e5e5e5",
            padding: 32,
          }}
        >
          {/* Email header */}
          <div style={{ marginBottom: 24, paddingBottom: 24, borderBottom: "1px solid #e5e5e5" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 12 }}>
              {email.brand && (
                <span
                  style={{
                    padding: "6px 12px",
                    backgroundColor: "#f0f0f0",
                    borderRadius: 12,
                    fontSize: 12,
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    color: "#666",
                  }}
                >
                  {email.brand}
                </span>
              )}
              <time
                style={{
                  fontSize: 14,
                  color: "#999",
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
                fontSize: 28,
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
              lineHeight: 1.6,
              color: "#333",
            }}
            dangerouslySetInnerHTML={{ __html: email.html }}
          />
        </div>
      </main>
    </div>
  );
}