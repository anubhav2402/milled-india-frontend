type Email = {
  id: number;
  subject: string;
  brand?: string;
  preview?: string;
  received_at: string;
};

async function fetchEmails(q?: string, brand?: string): Promise<Email[]> {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!base) {
    console.error("NEXT_PUBLIC_API_BASE_URL is not set");
    return [];
  }
  try {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (brand) params.set("brand", brand);
    const res = await fetch(`${base}/emails?${params.toString()}`, {
      cache: "no-store",
    });
    if (!res.ok) {
      console.error(`API error: ${res.status}`);
      return [];
    }
    return res.json();
  } catch (error) {
    console.error("Failed to fetch emails:", error);
    return [];
  }
}

function getBrands(emails: Email[]): string[] {
  const brands = new Set(emails.map((e) => e.brand).filter(Boolean));
  return Array.from(brands).sort() as string[];
}

export default async function Home({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string; brand?: string }>;
}) {
  const resolvedParams = searchParams ? await searchParams : { q: undefined, brand: undefined };
  const q = resolvedParams.q;
  const brand = resolvedParams.brand;
  const emails = await fetchEmails(q, brand);
  const allBrands = getBrands(emails);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#fafafa" }}>
      {/* Header */}
      <header
        style={{
          backgroundColor: "#fff",
          borderBottom: "1px solid #e5e5e5",
          padding: "20px 0",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 16 }}>
            <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: "#1a1a1a" }}>
              Milled India
            </h1>
            <div style={{ flex: 1, maxWidth: 400 }}>
              <form method="get" style={{ display: "flex", gap: 8 }}>
                <input
                  type="text"
                  name="q"
                  placeholder="Search emails..."
                  defaultValue={q}
                  style={{
                    flex: 1,
                    padding: "10px 16px",
                    border: "1px solid #ddd",
                    borderRadius: 8,
                    fontSize: 14,
                  }}
                />
                <button
                  type="submit"
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#1a1a1a",
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    cursor: "pointer",
                    fontWeight: 500,
                  }}
                >
                  Search
                </button>
              </form>
            </div>
          </div>

          {/* Brand filters */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <a
              href="/"
              style={{
                padding: "6px 12px",
                borderRadius: 20,
                backgroundColor: brand ? "#f0f0f0" : "#1a1a1a",
                color: brand ? "#666" : "#fff",
                textDecoration: "none",
                fontSize: 13,
                fontWeight: 500,
              }}
            >
              All
            </a>
            {allBrands.map((b) => (
              <a
                key={b}
                href={`/?brand=${encodeURIComponent(b)}`}
                style={{
                  padding: "6px 12px",
                  borderRadius: 20,
                  backgroundColor: brand === b ? "#1a1a1a" : "#f0f0f0",
                  color: brand === b ? "#fff" : "#666",
                  textDecoration: "none",
                  fontSize: 13,
                  fontWeight: 500,
                  textTransform: "capitalize",
                }}
              >
                {b}
              </a>
            ))}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px" }}>
        {emails.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px", color: "#999" }}>
            <p style={{ fontSize: 16 }}>No emails found.</p>
          </div>
        ) : (
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
        )}
      </main>
    </div>
  );
}