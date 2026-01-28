import Logo from "../components/Logo";

type Email = {
  id: number;
  subject: string;
  brand?: string;
  preview?: string;
  type?: string;
  category?: string;
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
    params.set("limit", "200");
    const url = `${base}/emails?${params.toString()}`;
    const res = await fetch(url, { cache: "no-store" });
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

export default async function BrowsePage({
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
            <a href="/" style={{ textDecoration: "none", color: "inherit", display: "flex", alignItems: "center", gap: 8 }}>
              <Logo size={32} />
              <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: "#1a1a1a" }}>
                MailMuse
              </h1>
            </a>
            <div style={{ flex: 1, maxWidth: 400 }}>
              <form method="get" action="/browse" style={{ display: "flex", gap: 8 }}>
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
                    color: "#1a1a1a",
                    backgroundColor: "#fff",
                  }}
                />
                <button
                  type="submit"
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#14b8a6",
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
              href="/browse"
              style={{
                padding: "6px 12px",
                borderRadius: 20,
                backgroundColor: brand ? "#f0f0f0" : "#14b8a6",
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
                href={`/browse?brand=${encodeURIComponent(b)}`}
                style={{
                  padding: "6px 12px",
                  borderRadius: 20,
                  backgroundColor: brand === b ? "#14b8a6" : "#f0f0f0",
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
              gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))",
              gap: 24,
            }}
          >
            {emails.map((e) => {
              // Get brand initial for logo
              const brandInitial = e.brand ? e.brand.charAt(0).toUpperCase() : "?";
              // Format date with time
              const receivedDate = new Date(e.received_at);
              const formattedDate = receivedDate.toLocaleDateString("en-IN", {
                month: "short",
                day: "numeric",
                year: "numeric",
              });
              const formattedTime = receivedDate.toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <a
                  key={e.id}
                  href={`/email/${e.id}`}
                  style={{
                    backgroundColor: "#fff",
                    borderRadius: 16,
                    border: "2px solid #e2e8f0",
                    padding: 24,
                    textDecoration: "none",
                    color: "inherit",
                    display: "block",
                    transition: "all 0.2s",
                    cursor: "pointer",
                  }}
                  className="hover-button"
                >
                  {/* Top Section: Brand Logo, Name, and Badges */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "start",
                      marginBottom: 16,
                    }}
                  >
                    {e.brand && (
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div
                          style={{
                            width: 40,
                            height: 40,
                            background: "#f0fdfa",
                            borderRadius: 8,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: 700,
                            color: "#14b8a6",
                            fontSize: 18,
                          }}
                        >
                          {brandInitial}
                        </div>
                        <div>
                          <div
                            style={{
                              fontSize: 16,
                              fontWeight: 700,
                              color: "#1a1a1a",
                              textTransform: "uppercase",
                              marginBottom: 4,
                            }}
                          >
                            {e.brand}
                          </div>
                          {(e.type || e.category) && (
                            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                              {e.type && (
                                <span
                                  style={{
                                    padding: "4px 10px",
                                    background: "#f0fdfa",
                                    border: "1px solid #14b8a6",
                                    borderRadius: 6,
                                    fontSize: 11,
                                    fontWeight: 600,
                                    color: "#14b8a6",
                                    textTransform: "uppercase",
                                  }}
                                >
                                  {e.type}
                                </span>
                              )}
                              {e.category && (
                                <span
                                  style={{
                                    padding: "4px 10px",
                                    background: "#f0fdfa",
                                    border: "1px solid #14b8a6",
                                    borderRadius: 6,
                                    fontSize: 11,
                                    fontWeight: 600,
                                    color: "#14b8a6",
                                    textTransform: "uppercase",
                                  }}
                                >
                                  {e.category}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Subject Line */}
                  <h2
                    style={{
                      margin: "0 0 12px 0",
                      fontSize: 20,
                      fontWeight: 700,
                      color: "#1a1a1a",
                      lineHeight: 1.3,
                    }}
                  >
                    {e.subject}
                  </h2>

                  {/* Preview Text */}
                  {e.preview && (
                    <p
                      style={{
                        margin: "0 0 16px 0",
                        fontSize: 15,
                        color: "#4a5568",
                        lineHeight: 1.6,
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {e.preview}
                    </p>
                  )}

                  {/* Footer: Date and View Button */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      paddingTop: 16,
                      borderTop: "1px solid #e5e5e5",
                    }}
                  >
                    <time
                      style={{
                        fontSize: 13,
                        color: "#999",
                      }}
                    >
                      {formattedDate} • {formattedTime}
                    </time>
                    <span
                      style={{
                        padding: "8px 20px",
                        background: "#14b8a6",
                        color: "#fff",
                        borderRadius: 8,
                        fontSize: 14,
                        fontWeight: 600,
                      }}
                    >
                      View Email →
                    </span>
                  </div>
                </a>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
