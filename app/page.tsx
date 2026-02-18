"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import Logo from "./components/Logo";
import Button from "./components/Button";
import Badge from "./components/Badge";
import Card from "./components/Card";
import Input from "./components/Input";
import { SkeletonCard } from "./components/Skeleton";
import { useAuth } from "./context/AuthContext";

type Email = {
  id: number;
  subject: string;
  brand?: string;
  industry?: string;
  received_at: string;
  preview?: string;
  type?: string;
};

// Search icon component
const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8" />
    <path d="M21 21l-4.35-4.35" />
  </svg>
);

// Header Component
function Header() {
  const { user, logout, isLoading } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: scrolled ? "rgba(255, 255, 255, 0.8)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid var(--color-border)" : "1px solid transparent",
        transition: "all 200ms ease",
      }}
    >
      <div style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: "16px 24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}>
          <Logo size={36} />
          <span style={{ fontFamily: "var(--font-dm-serif)", fontSize: 22, color: "var(--color-primary)", letterSpacing: "-0.01em" }}>
            Mail <em style={{ fontStyle: "italic", color: "var(--color-accent)" }}>Muse</em>
          </span>
        </Link>

        {/* Nav Links */}
        <nav className="hide-mobile" style={{ display: "flex", alignItems: "center", gap: 32 }}>
          <Link
            href="/brands"
            style={{
              fontSize: 14,
              fontWeight: 500,
              color: "var(--color-secondary)",
              textDecoration: "none",
              transition: "color 150ms ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-primary)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-secondary)")}
          >
            Brands
          </Link>
          <Link
            href="/browse"
            style={{
              fontSize: 14,
              fontWeight: 500,
              color: "var(--color-secondary)",
              textDecoration: "none",
              transition: "color 150ms ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-primary)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-secondary)")}
          >
            Browse
          </Link>
          <Link
            href="/analytics"
            style={{
              fontSize: 14,
              fontWeight: 500,
              color: "var(--color-secondary)",
              textDecoration: "none",
              transition: "color 150ms ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-primary)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-secondary)")}
          >
            Analytics
          </Link>
        </nav>

        {/* Auth */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {isLoading ? (
            <div style={{ width: 80, height: 36 }} />
          ) : user ? (
            <>
              <span className="hide-mobile" style={{ fontSize: 14, color: "var(--color-secondary)" }}>
                {user.name || user.email}
              </span>
              <Button variant="ghost" size="sm" onClick={logout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login" className="hide-mobile" style={{ fontSize: 14, fontWeight: 500, color: "var(--color-secondary)", textDecoration: "none" }}>
                Sign In
              </Link>
              <Button href="/signup" size="sm">
                Get Started
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

// Email Preview Card for Hero
function EmailPreviewCard({ email, delay = 0 }: { email: Email; delay?: number }) {
  const formatDate = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  // Generate a subtle gradient based on brand name
  const getGradient = (brand: string) => {
    const gradients = [
      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
      "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
      "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
    ];
    const index = brand ? brand.charCodeAt(0) % gradients.length : 0;
    return gradients[index];
  };

  return (
    <div
      style={{
        background: "white",
        borderRadius: 16,
        boxShadow: "0 4px 24px rgba(0, 0, 0, 0.08)",
        overflow: "hidden",
        opacity: 0,
        animation: `fadeInUp 0.5s ease ${delay}ms forwards`,
        cursor: "pointer",
        transition: "transform 200ms ease, box-shadow 200ms ease",
      }}
      onClick={() => window.location.href = `/email/${email.id}`}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 12px 40px rgba(0, 0, 0, 0.12)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 4px 24px rgba(0, 0, 0, 0.08)";
      }}
    >
      {/* Stylized Email Preview */}
      <div style={{
        height: 120,
        background: getGradient(email.brand || ""),
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        {/* Email icon/visual */}
        <div style={{
          width: 48,
          height: 36,
          background: "rgba(255, 255, 255, 0.9)",
          borderRadius: 4,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
        }}>
          <svg width="24" height="18" viewBox="0 0 24 18" fill="none">
            <rect x="1" y="1" width="22" height="16" rx="2" stroke="#64748b" strokeWidth="1.5" fill="white"/>
            <path d="M1 3L12 10L23 3" stroke="#64748b" strokeWidth="1.5"/>
          </svg>
        </div>
        {/* Industry badge */}
        {email.industry && (
          <span style={{
            position: "absolute",
            top: 10,
            right: 10,
            background: "rgba(255, 255, 255, 0.9)",
            color: "#475569",
            fontSize: 10,
            fontWeight: 500,
            padding: "3px 8px",
            borderRadius: 20,
          }}>
            {email.industry}
          </span>
        )}
      </div>
      <div style={{ padding: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <div style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: "var(--color-accent)",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 12,
            fontWeight: 600,
          }}>
            {email.brand?.[0]?.toUpperCase() || "?"}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--color-primary)" }}>
              {email.brand || "Unknown"}
            </div>
            <div style={{ fontSize: 11, color: "var(--color-tertiary)" }}>
              {formatDate(email.received_at)}
            </div>
          </div>
          {email.type && (
            <span style={{
              background: "#f1f5f9",
              color: "#64748b",
              fontSize: 10,
              fontWeight: 500,
              padding: "3px 8px",
              borderRadius: 4,
            }}>
              {email.type}
            </span>
          )}
        </div>
        <div style={{
          fontSize: 14,
          fontWeight: 500,
          color: "var(--color-primary)",
          lineHeight: 1.4,
          overflow: "hidden",
          textOverflow: "ellipsis",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          marginBottom: 8,
        }}>
          {email.subject}
        </div>
        {email.preview && (
          <div style={{
            fontSize: 12,
            color: "var(--color-tertiary)",
            lineHeight: 1.5,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}>
            {email.preview.slice(0, 100)}...
          </div>
        )}
      </div>
    </div>
  );
}

// Hero Section
function HeroSection() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const base = process.env.NEXT_PUBLIC_API_BASE_URL;
        if (!base) return;
        const res = await fetch(`${base}/emails?limit=6`);
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
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(searchQuery.trim() ? `/browse?q=${encodeURIComponent(searchQuery.trim())}` : "/browse");
  };

  return (
    <section style={{
      minHeight: "calc(100vh - 68px)",
      background: "linear-gradient(180deg, var(--color-surface) 0%, #ffffff 60%)",
      padding: "80px 24px 64px",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%" }}>
        {/* Centered Hero Content */}
        <div style={{
          textAlign: "center",
          maxWidth: 680,
          margin: "0 auto",
          opacity: 0,
          animation: "fadeInUp 0.6s ease forwards",
        }}>
          <Badge variant="accent" style={{ marginBottom: 24 }}>
            3,000+ emails tracked
          </Badge>
          <h1 style={{
            fontFamily: "var(--font-dm-serif)",
            fontSize: "clamp(40px, 6vw, 64px)",
            fontWeight: 400,
            color: "var(--color-primary)",
            lineHeight: 1.08,
            letterSpacing: "-0.02em",
            marginBottom: 20,
          }}>
            Discover what the world&apos;s best brands are sending
          </h1>
          <p style={{
            fontSize: "clamp(16px, 2vw, 19px)",
            color: "var(--color-secondary)",
            lineHeight: 1.6,
            maxWidth: 520,
            margin: "0 auto 36px",
          }}>
            Competitive intelligence for marketing teams. See what brands are sending, when, and why.
          </p>

          {/* Search */}
          <form onSubmit={handleSearch} style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", gap: 12, maxWidth: 560, margin: "0 auto" }}>
              <Input
                type="search"
                placeholder="Search brands or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={<SearchIcon />}
                size="lg"
              />
              <Button type="submit" size="lg">
                Search
              </Button>
            </div>
          </form>

          <p style={{ fontSize: 13, color: "var(--color-tertiary)" }}>
            Free access · No signup required · Updated daily
          </p>
        </div>

        {/* Email Preview Cards — Horizontal Scroll */}
        <div style={{
          marginTop: 56,
          opacity: 0,
          animation: "fadeInUp 0.6s ease 0.2s forwards",
        }}>
          <div className="horizontal-scroll" style={{ padding: "8px 4px" }}>
            {loading ? (
              <>
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="scroll-card" style={{ width: 280, minWidth: 280 }}>
                    <SkeletonCard />
                  </div>
                ))}
              </>
            ) : (
              emails.map((email, idx) => (
                <div key={email.id} className="scroll-card" style={{ width: 280, minWidth: 280 }}>
                  <EmailPreviewCard
                    email={email}
                    delay={idx * 100}
                  />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Trusted By */}
        <div style={{
          marginTop: 64,
          textAlign: "center",
          opacity: 0,
          animation: "fadeIn 0.6s ease 0.4s forwards",
        }}>
          <p style={{
            fontSize: 12,
            fontWeight: 500,
            color: "var(--color-tertiary)",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginBottom: 24,
          }}>
            Tracking emails from India&apos;s top brands
          </p>
          <div style={{
            display: "flex",
            justifyContent: "center",
            gap: 32,
            flexWrap: "wrap",
          }}>
            {["Nykaa", "Myntra", "Zomato", "Swiggy", "Mamaearth", "Meesho"].map((brand) => (
              <span
                key={brand}
                style={{
                  fontSize: 15,
                  fontWeight: 600,
                  color: "var(--color-tertiary)",
                  opacity: 0.7,
                }}
              >
                {brand}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Features Section
function FeaturesSection() {
  const features = [
    {
      icon: "🔍",
      title: "Track Any Brand",
      description: "Monitor every email from top D2C brands. Know when they launch sales, test subject lines, and how often they email.",
    },
    {
      icon: "📋",
      title: "Copy What Works",
      description: "Found a winning subject line? Study campaigns by type—welcome, sale, abandoned cart, and more.",
    },
    {
      icon: "📊",
      title: "Analyze Patterns",
      description: "See send frequency, timing, and messaging strategies that drive results.",
    },
  ];

  return (
    <section style={{
      padding: "96px 24px",
      background: "white",
    }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <h2 style={{
            fontSize: "clamp(28px, 4vw, 36px)",
            fontWeight: 700,
            color: "var(--color-primary)",
            letterSpacing: "-0.02em",
            marginBottom: 16,
          }}>
            Your Competitive Advantage
          </h2>
          <p style={{
            fontSize: 17,
            color: "var(--color-secondary)",
            maxWidth: 500,
            margin: "0 auto",
          }}>
            Stop guessing. See exactly what your competitors send.
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 24,
        }}>
          {features.map((feature, idx) => (
            <Card key={idx} padding="lg" hover>
              <div style={{ fontSize: 40, marginBottom: 20 }}>{feature.icon}</div>
              <h3 style={{
                fontSize: 18,
                fontWeight: 600,
                color: "var(--color-primary)",
                marginBottom: 10,
              }}>
                {feature.title}
              </h3>
              <p style={{
                fontSize: 15,
                color: "var(--color-secondary)",
                lineHeight: 1.6,
                margin: 0,
              }}>
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// Who Is This For Section
function WhoIsThisForSection() {
  const audiences = [
    {
      icon: "📧",
      title: "Email Marketers",
      description: "Get inspiration for subject lines, copy, and design from proven campaigns that drive results.",
    },
    {
      icon: "🎯",
      title: "Marketing Managers",
      description: "Benchmark your email strategy against competitors. Know when they run sales and promotions.",
    },
    {
      icon: "🚀",
      title: "D2C Founders",
      description: "Learn from the best in your industry. See how top brands communicate with their customers.",
    },
    {
      icon: "✍️",
      title: "Copywriters",
      description: "Build a swipe file of high-converting emails. Study what makes subject lines click-worthy.",
    },
  ];

  return (
    <section style={{
      padding: "96px 24px",
      background: "#f8fafc",
    }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <h2 style={{
            fontSize: "clamp(28px, 4vw, 36px)",
            fontWeight: 700,
            color: "var(--color-primary)",
            letterSpacing: "-0.02em",
            marginBottom: 16,
          }}>
            Who Is This For?
          </h2>
          <p style={{
            fontSize: 17,
            color: "var(--color-secondary)",
            maxWidth: 500,
            margin: "0 auto",
          }}>
            MailMuse helps marketing professionals stay ahead of the curve.
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 24,
        }}>
          {audiences.map((audience, idx) => (
            <div
              key={idx}
              style={{
                background: "white",
                borderRadius: 16,
                padding: 28,
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)",
                border: "1px solid var(--color-border)",
                transition: "transform 200ms ease, box-shadow 200ms ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(0, 0, 0, 0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 1px 3px rgba(0, 0, 0, 0.04)";
              }}
            >
              <div style={{ fontSize: 36, marginBottom: 16 }}>{audience.icon}</div>
              <h3 style={{
                fontSize: 17,
                fontWeight: 600,
                color: "var(--color-primary)",
                marginBottom: 8,
              }}>
                {audience.title}
              </h3>
              <p style={{
                fontSize: 14,
                color: "var(--color-secondary)",
                lineHeight: 1.6,
                margin: 0,
              }}>
                {audience.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// CTA Section
function CTASection() {
  return (
    <section style={{
      padding: "96px 24px",
      background: "var(--color-primary)",
      textAlign: "center",
    }}>
      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        <h2 style={{
          fontSize: "clamp(28px, 4vw, 36px)",
          fontWeight: 700,
          color: "white",
          letterSpacing: "-0.02em",
          marginBottom: 16,
        }}>
          Ready to Outsmart Your Competition?
        </h2>
        <p style={{
          fontSize: 17,
          color: "rgba(255, 255, 255, 0.8)",
          marginBottom: 32,
          lineHeight: 1.6,
        }}>
          Free access to thousands of real emails from India's top brands.
        </p>
        <Button href="/browse" size="lg" variant="secondary">
          Start Exploring →
        </Button>
      </div>
    </section>
  );
}

// Footer
function Footer() {
  return (
    <footer style={{
      padding: "48px 24px",
      background: "#0f172a",
      color: "white",
    }}>
      <div style={{
        maxWidth: 1200,
        margin: "0 auto",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 24,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Logo size={32} />
          <span style={{ fontFamily: "var(--font-dm-serif)", fontSize: 18, color: "white" }}>
            Mail <em style={{ fontStyle: "italic", color: "#E8A882" }}>Muse</em>
          </span>
        </div>
        <p style={{ fontSize: 13, color: "rgba(255, 255, 255, 0.5)" }}>
          © 2026 MailMuse. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

// Main Page
export default function Home() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--color-surface)" }}>
      <Header />
      <HeroSection />
      <FeaturesSection />
      <WhoIsThisForSection />
      <CTASection />
      <Footer />
    </div>
  );
}
