"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Logo from "./components/Logo";

// Industry list for filtering
const INDUSTRIES = [
  "All",
  "Beauty & Personal Care",
  "Women's Fashion",
  "Men's Fashion",
  "Food & Beverages",
  "Travel & Hospitality",
  "Electronics & Gadgets",
  "Home & Living",
  "Health & Wellness",
  "Finance & Fintech",
  "Kids & Baby",
  "Sports & Fitness",
  "Entertainment",
  "General Retail",
];

type Email = {
  id: number;
  subject: string;
  brand?: string;
  industry?: string;
  received_at: string;
  preview?: string;
  type?: string;
  category?: string;
};

function BrowseSection() {
  const [selectedIndustry, setSelectedIndustry] = useState("All");
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmails = async () => {
      setLoading(true);
      try {
        const base = process.env.NEXT_PUBLIC_API_BASE_URL;
        if (!base) return;
        
        let url = `${base}/emails?limit=12`;
        if (selectedIndustry !== "All") {
          url += `&industry=${encodeURIComponent(selectedIndustry)}`;
        }
        
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setEmails(data);
        }
      } catch (err) {
        console.error("Failed to fetch emails:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmails();
  }, [selectedIndustry]);

  return (
    <section style={{ 
      padding: "100px 24px", 
      backgroundColor: "#fff",
      borderTop: "1px solid #e2e8f0",
      borderBottom: "1px solid #e2e8f0",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Section badge */}
        <div style={{ 
          display: "flex", 
          justifyContent: "center", 
          marginBottom: 24 
        }}>
          <span style={{
            padding: "8px 20px",
            backgroundColor: "#fef3c7",
            color: "#d97706",
            fontSize: 13,
            fontWeight: 600,
            borderRadius: 50,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
          }}>
            Explore
          </span>
        </div>
        <h2 style={{ textAlign: "center", fontSize: 44, fontWeight: 800, marginBottom: 16, color: "#1a1a1a", letterSpacing: "-0.02em" }}>
          Browse by Industry
        </h2>
        <p style={{ textAlign: "center", fontSize: 20, color: "#4a5568", marginBottom: 40, fontWeight: 400 }}>
          Explore email campaigns from India's top brands across industries
        </p>

        {/* Industry Filter Tabs */}
        <div style={{ 
          display: "flex", 
          flexWrap: "wrap", 
          gap: 12, 
          justifyContent: "center", 
          marginBottom: 48,
        }}>
          {INDUSTRIES.map((industry) => (
            <button
              key={industry}
              onClick={() => setSelectedIndustry(industry)}
              style={{
                padding: "10px 20px",
                borderRadius: 24,
                border: selectedIndustry === industry ? "2px solid #14b8a6" : "2px solid #e2e8f0",
                backgroundColor: selectedIndustry === industry ? "#14b8a6" : "#fff",
                color: selectedIndustry === industry ? "#fff" : "#4a5568",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                if (selectedIndustry !== industry) {
                  e.currentTarget.style.borderColor = "#14b8a6";
                  e.currentTarget.style.backgroundColor = "#f0fdfa";
                }
              }}
              onMouseLeave={(e) => {
                if (selectedIndustry !== industry) {
                  e.currentTarget.style.borderColor = "#e2e8f0";
                  e.currentTarget.style.backgroundColor = "#fff";
                }
              }}
            >
              {industry}
            </button>
          ))}
        </div>

        {/* Email Cards Grid */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#666" }}>
            Loading emails...
          </div>
        ) : emails.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#666" }}>
            No emails found for this industry yet.
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
              gap: 24,
            }}
          >
            {emails.map((email) => (
              <a
                key={email.id}
                href={`/email/${email.id}`}
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  display: "block",
                }}
              >
                <div
                  style={{
                    backgroundColor: "#fff",
                    borderRadius: 16,
                    border: "1px solid #e5e5e5",
                    padding: 24,
                    transition: "all 0.2s",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.1)";
                    e.currentTarget.style.borderColor = "#14b8a6";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.borderColor = "#e5e5e5";
                  }}
                >
                  {/* Brand & Industry */}
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 10,
                        backgroundColor: "#f0fdfa",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                        fontSize: 18,
                        color: "#14b8a6",
                        flexShrink: 0,
                      }}
                    >
                      {email.brand?.[0]?.toUpperCase() || "?"}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: 15, color: "#1a1a1a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {email.brand || "Unknown Brand"}
                      </div>
                      {email.industry && (
                        <div style={{ fontSize: 12, color: "#14b8a6", fontWeight: 500 }}>
                          {email.industry}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Subject */}
                  <h3
                    style={{
                      fontSize: 16,
                      fontWeight: 600,
                      color: "#1a1a1a",
                      marginBottom: 8,
                      lineHeight: 1.4,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      flex: 1,
                    }}
                  >
                    {email.subject}
                  </h3>

                  {/* Preview */}
                  {email.preview && (
                    <p
                      style={{
                        fontSize: 14,
                        color: "#666",
                        lineHeight: 1.5,
                        margin: 0,
                        marginBottom: 16,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {email.preview}
                    </p>
                  )}

                  {/* Footer */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto", paddingTop: 16, borderTop: "1px solid #f0f0f0" }}>
                    <time style={{ fontSize: 12, color: "#999" }}>
                      {new Date(email.received_at).toLocaleDateString("en-IN", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </time>
                    <span style={{ fontSize: 13, color: "#14b8a6", fontWeight: 600 }}>
                      View Email →
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}

        {/* View All Button */}
        <div style={{ textAlign: "center", marginTop: 48 }}>
          <a
            href={selectedIndustry === "All" ? "/browse" : `/browse?industry=${encodeURIComponent(selectedIndustry)}`}
            style={{
              padding: "16px 32px",
              backgroundColor: "#14b8a6",
              color: "#fff",
              textDecoration: "none",
              borderRadius: 12,
              fontWeight: 600,
              fontSize: 16,
              display: "inline-block",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#0d9488";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#14b8a6";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            View All {selectedIndustry !== "All" ? selectedIndustry : ""} Emails →
          </a>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/browse?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/browse");
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#ffffff" }}>
      {/* Sticky Navbar */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1000,
          backgroundColor: "#ffffff",
          borderBottom: "1px solid #e5e5e5",
          padding: "16px 0",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <a href="/" style={{ textDecoration: "none", color: "inherit", display: "flex", alignItems: "center" }}>
            <Logo size={32} />
            <span style={{ fontSize: 24, fontWeight: 700, color: "#1a1a1a" }}>MailMuse</span>
          </a>
          <a
            href="/browse"
            style={{
              padding: "10px 24px",
              backgroundColor: "#14b8a6",
              color: "#ffffff",
              textDecoration: "none",
              borderRadius: 8,
              fontWeight: 600,
              fontSize: 14,
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#0d9488";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#14b8a6";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            Explore Database
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        style={{
          padding: "120px 24px",
          backgroundColor: "#ffffff",
          position: "relative",
          overflow: "hidden",
          minHeight: "90vh",
          display: "flex",
          alignItems: "center",
        }}
      >

        <div style={{ maxWidth: 1400, margin: "0 auto", width: "100%", position: "relative", zIndex: 1 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(500px, 1fr))",
              gap: 80,
              alignItems: "center",
            }}
          >
            {/* Left Side: Content */}
            <div>
              <h1
                style={{
                  fontSize: "clamp(38px, 5vw, 58px)",
                  fontWeight: 800,
                  color: "#1a1a1a",
                  marginBottom: 32,
                  lineHeight: 1.1,
                  letterSpacing: "-0.03em",
                }}
              >
                India's Largest Search Engine for Marketing Emails
              </h1>
              <p
                style={{
                  fontSize: "clamp(18px, 2vw, 24px)",
                  color: "#4a5568",
                  marginBottom: 48,
                  lineHeight: 1.6,
                  fontWeight: 400,
                }}
              >
                From Nykaa to Myntra, Zomato to Swiggy—access thousands of real emails sent by India's top D2C brands. Copy winning campaigns, steal subject lines, and see what actually converts.
              </p>

              {/* Search Bar */}
              <form onSubmit={handleSearch} style={{ marginBottom: 32 }}>
                <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by brand, campaign type, or keyword..."
                    style={{
                      flex: 1,
                      padding: "18px 24px",
                      border: "none",
                      borderRadius: 14,
                      fontSize: 16,
                      outline: "none",
                      transition: "all 0.2s",
                      color: "#1a1a1a",
                      backgroundColor: "#ffffff",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.2)";
                      e.currentTarget.style.transform = "translateY(-2px)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.15)";
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  />
                  <button
                    type="submit"
                    style={{
                      padding: "18px 36px",
                      backgroundColor: "#14b8a6",
                      color: "#ffffff",
                      border: "none",
                      borderRadius: 14,
                      fontSize: 16,
                      fontWeight: 700,
                      cursor: "pointer",
                      transition: "all 0.2s",
                      boxShadow: "0 4px 12px rgba(20, 184, 166, 0.3)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#0d9488";
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = "0 6px 16px rgba(20, 184, 166, 0.4)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#14b8a6";
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 4px 12px rgba(20, 184, 166, 0.3)";
                    }}
                  >
                    Search
                  </button>
                </div>
                <p style={{ fontSize: 14, color: "#666", margin: 0 }}>
                  Free access • No sign-up required • Updated daily
                </p>
              </form>

              {/* CTA Buttons */}
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                <a
                  href="/browse"
                  style={{
                    padding: "18px 36px",
                    backgroundColor: "#14b8a6",
                    color: "#ffffff",
                    textDecoration: "none",
                    borderRadius: 14,
                    fontWeight: 700,
                    fontSize: 17,
                    transition: "all 0.2s",
                    display: "inline-block",
                    boxShadow: "0 4px 12px rgba(20, 184, 166, 0.3)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#0d9488";
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 6px 16px rgba(20, 184, 166, 0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#14b8a6";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(20, 184, 166, 0.3)";
                  }}
                >
                  Start Exploring Now →
                </a>
                <a
                  href="/browse"
                  style={{
                    padding: "18px 36px",
                    backgroundColor: "#ffffff",
                    color: "#14b8a6",
                    textDecoration: "none",
                    borderRadius: 14,
                    fontWeight: 700,
                    fontSize: 17,
                    border: "2px solid #14b8a6",
                    transition: "all 0.2s",
                    display: "inline-block",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#f0fdfa";
                    e.currentTarget.style.borderColor = "#0d9488";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#ffffff";
                    e.currentTarget.style.borderColor = "#14b8a6";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  Browse All Emails
                </a>
              </div>
            </div>

            {/* Right Side: Image */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
              }}
            >
                <div
                  style={{
                    width: "100%",
                    maxWidth: "600px",
                    height: "500px",
                    borderRadius: 24,
                    overflow: "hidden",
                    boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
                    backgroundColor: "#f8fafc",
                    border: "1px solid #e5e5e5",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                  }}
                >
                <img
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80"
                  alt="Marketing person working on email campaign"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: 24,
                  }}
                  onError={(e) => {
                    // Fallback if image fails
                    e.currentTarget.style.display = "none";
                    const parent = e.currentTarget.parentElement;
                    if (parent) {
                      parent.innerHTML = `
                        <div style="padding: 60px; text-align: center; color: rgba(102,126,234,0.9);">
                          <div style="font-size: 80px; margin-bottom: 24px;">👨‍💼</div>
                          <div style="font-size: 24px; font-weight: 700; margin-bottom: 12px;">Marketing Professional</div>
                          <div style="font-size: 18px; opacity: 0.8;">Working on Email Campaign</div>
                        </div>
                      `;
                    }
                  }}
                />
              </div>
            </div>
          </div>

          {/* Brand Logos - Moved below */}
          <div style={{ marginTop: 80, textAlign: "center" }}>
            <p
              style={{
                fontSize: 14,
                color: "#666",
                marginBottom: 32,
                fontWeight: 500,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              Trusted by India's Top Brands
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 32,
                flexWrap: "wrap",
              }}
            >
              {[
                { name: "Nykaa", logo: "https://upload.wikimedia.org/wikipedia/commons/7/7a/Nykaa_New_Logo.svg" },
                { name: "Myntra", logo: "https://upload.wikimedia.org/wikipedia/commons/b/bc/Myntra_Logo.png" },
                { name: "Zomato", logo: "https://upload.wikimedia.org/wikipedia/commons/b/bd/Zomato_Logo.svg" },
                { name: "Swiggy", logo: "https://upload.wikimedia.org/wikipedia/commons/1/13/Swiggy_logo.png" },
                { name: "Meesho", logo: "https://upload.wikimedia.org/wikipedia/commons/3/33/Meesho_logo.png" },
                { name: "Mamaearth", logo: "https://mamaearth.com/cdn/shop/files/mama.svg" },
              ].map((brand, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: "16px 28px",
                    backgroundColor: "#ffffff",
                    borderRadius: 12,
                    border: "1px solid #e2e8f0",
                    transition: "all 0.2s",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: 56,
                    minWidth: 110,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#f8f9fa";
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.12)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#ffffff";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)";
                  }}
                >
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    style={{
                      maxHeight: "36px",
                      maxWidth: "110px",
                      objectFit: "contain",
                    }}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                      const parent = e.currentTarget.parentElement;
                      if (parent) {
                        parent.innerHTML = `<span style="font-size: 14px; font-weight: 700; color: #1a1a1a;">${brand.name}</span>`;
                      }
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section Divider */}
      <div style={{ 
        height: 1, 
        background: "linear-gradient(90deg, transparent 0%, #e2e8f0 20%, #e2e8f0 80%, transparent 100%)",
        margin: "0 auto",
        maxWidth: 800,
      }} />

      {/* Value Proposition / Features */}
      <section style={{ 
        padding: "100px 24px", 
        backgroundColor: "#fff",
        position: "relative",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          {/* Section badge */}
          <div style={{ 
            display: "flex", 
            justifyContent: "center", 
            marginBottom: 24 
          }}>
            <span style={{
              padding: "8px 20px",
              backgroundColor: "#f0fdfa",
              color: "#14b8a6",
              fontSize: 13,
              fontWeight: 600,
              borderRadius: 50,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}>
              Why MailMuse
            </span>
          </div>
          <h2 style={{ textAlign: "center", fontSize: 44, fontWeight: 800, marginBottom: 16, color: "#1a1a1a", letterSpacing: "-0.02em" }}>
            Why Ecommerce Brands Love MailMuse
          </h2>
          <p style={{ textAlign: "center", fontSize: 20, color: "#4a5568", marginBottom: 60, fontWeight: 400 }}>
            Stop guessing. See exactly what Nykaa, Myntra, and other top brands send their customers—then copy what works.
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: 40,
            }}
          >
            {[
              {
                icon: "🎯",
                title: "Steal Winning Campaigns",
                description: "See every email Nykaa, Myntra, and Zomato send. Copy their subject lines, CTAs, and messaging—then watch your conversions soar.",
                color: "#14b8a6",
              },
              {
                icon: "📧",
                title: "Complete Email Archive",
                description: "Welcome emails, flash sales, cart abandonment, re-engagement—every campaign from India's top D2C brands, all in one place.",
                color: "#6366f1",
              },
              {
                icon: "⚡",
                title: "Find What Works Fast",
                description: "Search by brand, campaign type, or keyword. See what messaging converts, what subject lines get opens, and what CTAs drive clicks.",
                color: "#f59e0b",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                style={{
                  textAlign: "center",
                  padding: "48px 32px",
                  backgroundColor: "#fff",
                  borderRadius: 24,
                  border: "1px solid #e2e8f0",
                  transition: "all 0.3s",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
                  position: "relative",
                  overflow: "hidden",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-8px)";
                  e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.03)";
                }}
              >
                {/* Accent bar at top */}
                <div style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 4,
                  backgroundColor: feature.color,
                }} />
                <div style={{ 
                  fontSize: 56, 
                  marginBottom: 24,
                  filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.1))",
                }}>{feature.icon}</div>
                <h3 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16, color: "#1a1a1a" }}>
                  {feature.title}
                </h3>
                <p style={{ fontSize: 16, color: "#64748b", lineHeight: 1.7, margin: 0 }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who Is This For */}
      <section style={{ 
        padding: "100px 24px", 
        background: "linear-gradient(180deg, #f0fdfa 0%, #ecfdf5 100%)",
        position: "relative",
      }}>
        {/* Decorative pattern */}
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(20, 184, 166, 0.08) 1px, transparent 0)",
          backgroundSize: "40px 40px",
          pointerEvents: "none",
        }} />
        
        <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative" }}>
          {/* Section badge */}
          <div style={{ 
            display: "flex", 
            justifyContent: "center", 
            marginBottom: 24 
          }}>
            <span style={{
              padding: "8px 20px",
              backgroundColor: "#14b8a6",
              color: "#fff",
              fontSize: 13,
              fontWeight: 600,
              borderRadius: 50,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}>
              Perfect For
            </span>
          </div>
          <h2 style={{ textAlign: "center", fontSize: 44, fontWeight: 800, marginBottom: 16, color: "#1a1a1a", letterSpacing: "-0.02em" }}>
            Who Is This For?
          </h2>
          <p style={{ textAlign: "center", fontSize: 20, color: "#4a5568", marginBottom: 60, fontWeight: 400 }}>
            Built for teams who want to win at email marketing
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
              gap: 32,
            }}
          >
            {/* Marketing Teams */}
            <div
              style={{
                padding: "48px 40px",
                backgroundColor: "#fff",
                borderRadius: 24,
                border: "none",
                transition: "all 0.3s",
                boxShadow: "0 10px 40px rgba(0,0,0,0.06)",
                position: "relative",
                overflow: "hidden",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-8px)";
                e.currentTarget.style.boxShadow = "0 20px 50px rgba(20, 184, 166, 0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 10px 40px rgba(0,0,0,0.06)";
              }}
            >
              {/* Gradient accent */}
              <div style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 5,
                background: "linear-gradient(90deg, #14b8a6 0%, #06b6d4 100%)",
              }} />
              <div style={{ 
                width: 72,
                height: 72,
                borderRadius: 20,
                backgroundColor: "#f0fdfa",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 36,
                marginBottom: 24,
              }}>🏢</div>
              <h3 style={{ fontSize: 26, fontWeight: 700, marginBottom: 16, color: "#1a1a1a" }}>
                Brand Marketing Teams
              </h3>
              <p style={{ fontSize: 16, color: "#64748b", lineHeight: 1.7, marginBottom: 24 }}>
                D2C brands, ecommerce platforms, and retail companies who want to spy on competitor campaigns and steal winning strategies.
              </p>
              <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                {[
                  "See what competitors are sending",
                  "Copy high-converting campaigns",
                  "Get inspiration for seasonal sales",
                  "Benchmark against industry leaders",
                ].map((item, idx) => (
                  <li key={idx} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14, fontSize: 15, color: "#475569" }}>
                    <span style={{ 
                      width: 22,
                      height: 22,
                      borderRadius: "50%",
                      backgroundColor: "#f0fdfa",
                      color: "#14b8a6", 
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 12,
                      flexShrink: 0,
                    }}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Marketing Agencies */}
            <div
              style={{
                padding: "48px 40px",
                backgroundColor: "#fff",
                borderRadius: 24,
                border: "none",
                transition: "all 0.3s",
                boxShadow: "0 10px 40px rgba(0,0,0,0.06)",
                position: "relative",
                overflow: "hidden",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-8px)";
                e.currentTarget.style.boxShadow = "0 20px 50px rgba(20, 184, 166, 0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 10px 40px rgba(0,0,0,0.06)";
              }}
            >
              {/* Gradient accent */}
              <div style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 5,
                background: "linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)",
              }} />
              <div style={{ 
                width: 72,
                height: 72,
                borderRadius: 20,
                backgroundColor: "#eef2ff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 36,
                marginBottom: 24,
              }}>🚀</div>
              <h3 style={{ fontSize: 26, fontWeight: 700, marginBottom: 16, color: "#1a1a1a" }}>
                Marketing Agencies
              </h3>
              <p style={{ fontSize: 16, color: "#64748b", lineHeight: 1.7, marginBottom: 24 }}>
                Digital agencies, email marketing consultants, and freelancers who need to deliver winning campaigns for clients.
              </p>
              <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                {[
                  "Research client industries quickly",
                  "Build campaigns based on proven winners",
                  "Impress clients with competitor insights",
                  "Save hours of research time",
                ].map((item, idx) => (
                  <li key={idx} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14, fontSize: 15, color: "#475569" }}>
                    <span style={{ 
                      width: 22,
                      height: 22,
                      borderRadius: "50%",
                      backgroundColor: "#eef2ff",
                      color: "#6366f1", 
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 12,
                      flexShrink: 0,
                    }}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Browse by Industry */}
      <BrowseSection />

      {/* How It Works */}
      <section style={{ 
        padding: "100px 24px", 
        background: "linear-gradient(180deg, #1e293b 0%, #0f172a 100%)",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Decorative elements */}
        <div style={{
          position: "absolute",
          top: -100,
          right: -100,
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(20, 184, 166, 0.15) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute",
          bottom: -100,
          left: -100,
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        <div style={{ maxWidth: 1000, margin: "0 auto", position: "relative" }}>
          {/* Section badge */}
          <div style={{ 
            display: "flex", 
            justifyContent: "center", 
            marginBottom: 24 
          }}>
            <span style={{
              padding: "8px 20px",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              color: "#5eead4",
              fontSize: 13,
              fontWeight: 600,
              borderRadius: 50,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              border: "1px solid rgba(94, 234, 212, 0.3)",
            }}>
              How It Works
            </span>
          </div>
          <h2 style={{ textAlign: "center", fontSize: 44, fontWeight: 800, marginBottom: 16, color: "#fff", letterSpacing: "-0.02em" }}>
            How Top Brands Use MailMuse
          </h2>
          <p style={{ textAlign: "center", fontSize: 20, color: "#94a3b8", marginBottom: 60, fontWeight: 400 }}>
            Three steps to steal winning email campaigns
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 32 }}>
            {[
              {
                step: "1",
                title: "Search Any Brand",
                description: "Type 'Nykaa', 'Myntra', or any brand name. Instantly see every email they've sent—welcome sequences, flash sales, cart abandonment, everything.",
              },
              {
                step: "2",
                title: "Copy What Works",
                description: "Study subject lines that get opens. See CTAs that drive clicks. Analyze messaging that converts. Then steal the best parts.",
              },
              {
                step: "3",
                title: "Launch & Win",
                description: "Copy proven campaigns, adapt them to your brand, and watch your email revenue grow. No A/B testing needed—these campaigns already work.",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                style={{
                  textAlign: "center",
                  padding: "40px 32px",
                  backgroundColor: "rgba(255, 255, 255, 0.03)",
                  borderRadius: 20,
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  transition: "all 0.3s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-8px)";
                  e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.06)";
                  e.currentTarget.style.borderColor = "rgba(20, 184, 166, 0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.03)";
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
                }}
              >
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 16,
                    background: "linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%)",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 28,
                    fontWeight: 700,
                    margin: "0 auto 24px",
                    boxShadow: "0 8px 24px rgba(20, 184, 166, 0.3)",
                  }}
                >
                  {item.step}
                </div>
                <h3 style={{ fontSize: 22, fontWeight: 600, marginBottom: 14, color: "#fff" }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: 15, color: "#94a3b8", lineHeight: 1.7, margin: 0 }}>
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section style={{ 
        padding: "100px 24px", 
        background: "linear-gradient(180deg, #faf5ff 0%, #f3e8ff 50%, #faf5ff 100%)",
        position: "relative",
      }}>
        {/* Decorative pattern */}
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(139, 92, 246, 0.06) 1px, transparent 0)",
          backgroundSize: "32px 32px",
          pointerEvents: "none",
        }} />

        <div style={{ maxWidth: 1200, margin: "0 auto", textAlign: "center", position: "relative" }}>
          {/* Section badge */}
          <div style={{ 
            display: "flex", 
            justifyContent: "center", 
            marginBottom: 24 
          }}>
            <span style={{
              padding: "8px 20px",
              backgroundColor: "#8b5cf6",
              color: "#fff",
              fontSize: 13,
              fontWeight: 600,
              borderRadius: 50,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}>
              Trusted
            </span>
          </div>
          <h2 style={{ fontSize: 40, fontWeight: 800, marginBottom: 16, color: "#1a1a1a", letterSpacing: "-0.02em" }}>
            Used by India's Fastest-Growing Ecommerce Brands
          </h2>
          <p style={{ fontSize: 20, color: "#4a5568", marginBottom: 50, fontWeight: 400 }}>
            Join D2C brands and marketing teams who use MailMuse to outsmart competitors and boost email revenue.
          </p>
          
          {/* Indian D2C Brand Logos */}
          <div style={{ display: "flex", justifyContent: "center", gap: 24, flexWrap: "wrap", marginBottom: 60 }}>
            {[
              { name: "Nykaa", logo: "https://upload.wikimedia.org/wikipedia/commons/7/7a/Nykaa_New_Logo.svg" },
              { name: "Myntra", logo: "https://upload.wikimedia.org/wikipedia/commons/b/bc/Myntra_Logo.png" },
              { name: "Zomato", logo: "https://upload.wikimedia.org/wikipedia/commons/b/bd/Zomato_Logo.svg" },
              { name: "Swiggy", logo: "https://upload.wikimedia.org/wikipedia/commons/1/13/Swiggy_logo.png" },
              { name: "Meesho", logo: "https://upload.wikimedia.org/wikipedia/commons/3/33/Meesho_logo.png" },
              { name: "Mamaearth", logo: "https://mamaearth.com/cdn/shop/files/mama.svg" },
            ].map((brand, idx) => (
              <div
                key={idx}
                style={{
                  padding: "20px 32px",
                  backgroundColor: "#fff",
                  borderRadius: 12,
                  border: "none",
                  boxShadow: "0 4px 20px rgba(139, 92, 246, 0.08)",
                  transition: "all 0.2s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: 64,
                  minWidth: 120,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0 12px 32px rgba(139, 92, 246, 0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 20px rgba(139, 92, 246, 0.08)";
                }}
              >
                <img
                  src={brand.logo}
                  alt={brand.name}
                  style={{
                    maxHeight: "40px",
                    maxWidth: "110px",
                    objectFit: "contain",
                  }}
                  onError={(e) => {
                    // Fallback to text if image fails to load
                    e.currentTarget.style.display = "none";
                    const parent = e.currentTarget.parentElement;
                    if (parent) {
                      parent.innerHTML = `<span style="font-size: 16px; font-weight: 700; color: #1a1a1a;">${brand.name}</span>`;
                    }
                  }}
                />
              </div>
            ))}
          </div>

          {/* Testimonials */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24 }}>
            {[
              {
                quote: "We copied Nykaa's welcome email sequence and saw a 40% increase in first-purchase conversions. MailMuse pays for itself in one campaign.",
                author: "Priya Sharma",
                role: "Head of Marketing, D2C Beauty Brand",
                avatar: "PS",
              },
              {
                quote: "Every week I check what Myntra and Zomato are sending. Their subject lines are gold—we've doubled our open rates by copying their best campaigns.",
                author: "Rahul Mehta",
                role: "Email Marketing Lead, Ecommerce Startup",
                avatar: "RM",
              },
            ].map((testimonial, idx) => (
              <div
                key={idx}
                style={{
                  padding: "32px",
                  backgroundColor: "#fff",
                  borderRadius: 20,
                  border: "none",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
                  textAlign: "left",
                  position: "relative",
                }}
              >
                {/* Quote mark */}
                <div style={{
                  position: "absolute",
                  top: 20,
                  right: 24,
                  fontSize: 48,
                  color: "#e9d5ff",
                  fontFamily: "Georgia, serif",
                  lineHeight: 1,
                }}>"</div>
                <p style={{ fontSize: 16, color: "#475569", lineHeight: 1.7, marginBottom: 24, fontStyle: "italic", position: "relative" }}>
                  "{testimonial.quote}"
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontWeight: 600,
                    fontSize: 14,
                  }}>{testimonial.avatar}</div>
                  <div>
                    <div style={{ fontWeight: 600, color: "#1a1a1a", marginBottom: 2 }}>
                      {testimonial.author}
                    </div>
                    <div style={{ fontSize: 13, color: "#64748b" }}>{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section
        style={{
          padding: "100px 24px",
          background: "linear-gradient(135deg, #14b8a6 0%, #0d9488 50%, #059669 100%)",
          textAlign: "center",
          color: "#fff",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ maxWidth: 800, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <h2 style={{ fontSize: 48, fontWeight: 800, marginBottom: 24, color: "#fff", letterSpacing: "-0.02em" }}>
            Start Stealing Winning Campaigns Today
          </h2>
          <p style={{ fontSize: 22, marginBottom: 50, opacity: 0.95, fontWeight: 400, lineHeight: 1.6 }}>
            Free access to thousands of real emails from Nykaa, Myntra, Zomato, and more. Copy what works, boost your conversions, and grow your email revenue—no credit card required.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <a
              href="/browse"
              style={{
                padding: "16px 32px",
                backgroundColor: "#fff",
                color: "#14b8a6",
                textDecoration: "none",
                borderRadius: 12,
                fontWeight: 600,
                fontSize: 16,
                transition: "transform 0.2s",
                display: "inline-block",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              Start Exploring Now →
            </a>
            <a
              href="/browse"
              style={{
                padding: "16px 32px",
                backgroundColor: "transparent",
                color: "#fff",
                textDecoration: "none",
                borderRadius: 12,
                fontWeight: 600,
                fontSize: 16,
                border: "2px solid #fff",
                transition: "background-color 0.2s",
                display: "inline-block",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
            >
              Explore Database
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: "60px 24px 40px", backgroundColor: "#1a1a1a", color: "#fff" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 40, marginBottom: 40 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <Logo size={40} />
              <span style={{ fontSize: 24, fontWeight: 700 }}>MailMuse</span>
            </div>
              <p style={{ fontSize: 14, color: "#999", lineHeight: 1.6 }}>
                The complete database of emails sent by India's top D2C brands. Copy winning campaigns and boost your email revenue.
              </p>
            </div>
            <div>
              <h4 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Company</h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {["About", "Pricing", "Contact"].map((link) => (
                  <li key={link} style={{ marginBottom: 8 }}>
                    <a href="/browse" style={{ color: "#999", textDecoration: "none", fontSize: 14 }}>
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Legal</h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {["Privacy", "Terms", "Cookies"].map((link) => (
                  <li key={link} style={{ marginBottom: 8 }}>
                    <a href="/browse" style={{ color: "#999", textDecoration: "none", fontSize: 14 }}>
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div style={{ borderTop: "1px solid #333", paddingTop: 40, textAlign: "center", color: "#999", fontSize: 14 }}>
            © 2026 MailMuse. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
