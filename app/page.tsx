"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import Logo from "./components/Logo";
import Header from "./components/Header";
import Button from "./components/Button";
import Badge from "./components/Badge";
import Card from "./components/Card";
import Input from "./components/Input";
import { useAuth } from "./context/AuthContext";

// Search icon component
const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8" />
    <path d="M21 21l-4.35-4.35" />
  </svg>
);


// Hero Section
function HeroSection() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(searchQuery.trim() ? `/browse?q=${encodeURIComponent(searchQuery.trim())}` : "/browse");
  };

  return (
    <section style={{
      minHeight: "calc(100vh - 68px)",
      background: "linear-gradient(180deg, var(--color-surface) 0%, #ffffff 60%)",
      display: "flex",
      alignItems: "center",
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
            7,000+ emails · 150+ brands · 13 industries
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
            The largest collection of D2C brand emails
          </h1>
          <p style={{
            fontSize: "clamp(16px, 2vw, 19px)",
            color: "var(--color-secondary)",
            lineHeight: 1.6,
            maxWidth: 560,
            margin: "0 auto 36px",
          }}>
            Track 7,000+ real emails from 150+ brands across 13 industries. See exactly what top D2C brands send, when they send it, and what works.
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
            Free to use · No credit card · New emails added every day
          </p>
        </div>
      </div>
    </section>
  );
}

// Stats Section — Social Proof
function StatsSection() {
  const stats = [
    { value: "7,000+", label: "Emails Tracked" },
    { value: "150+", label: "Brands Monitored" },
    { value: "13", label: "Industries Covered" },
    { value: "Daily", label: "Updates" },
  ];

  return (
    <section style={{
      padding: "64px 24px",
      background: "white",
      borderBottom: "1px solid var(--color-border)",
    }}>
      <div className="stats-grid" style={{
        maxWidth: 900,
        margin: "0 auto",
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 32,
        textAlign: "center",
      }}>
        {stats.map((stat, idx) => (
          <div
            key={idx}
            style={{
              opacity: 0,
              animation: `fadeInUp 0.5s ease forwards`,
              animationDelay: `${idx * 0.1}s`,
            }}
          >
            <div style={{
              fontFamily: "var(--font-dm-serif)",
              fontSize: "clamp(32px, 4vw, 44px)",
              fontWeight: 400,
              color: "var(--color-accent)",
              lineHeight: 1.1,
              marginBottom: 8,
            }}>
              {stat.value}
            </div>
            <div style={{
              fontSize: 14,
              fontWeight: 500,
              color: "var(--color-secondary)",
              letterSpacing: "0.02em",
              textTransform: "uppercase",
            }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// Brand Logos Section — Social Proof
function BrandLogosSection() {
  const [brands, setBrands] = useState<string[]>([]);
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://milled-india-api.onrender.com";

  useEffect(() => {
    fetch(`${API_BASE}/brands`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data: string[]) => setBrands(data.slice(0, 24)))
      .catch(() => {});
  }, [API_BASE]);

  if (brands.length === 0) return null;

  return (
    <section style={{
      padding: "64px 24px",
      background: "var(--color-surface)",
    }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <p style={{
          textAlign: "center",
          fontSize: 14,
          fontWeight: 500,
          color: "var(--color-secondary)",
          letterSpacing: "0.04em",
          textTransform: "uppercase",
          marginBottom: 32,
        }}>
          Tracking emails from {brands.length}+ brands
        </p>
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 12,
        }}>
          {brands.map((brand) => (
            <Link
              key={brand}
              href={`/brand/${encodeURIComponent(brand)}`}
              style={{
                padding: "10px 20px",
                borderRadius: 100,
                border: "1px solid var(--color-border)",
                background: "white",
                fontSize: 14,
                fontWeight: 500,
                color: "var(--color-secondary)",
                whiteSpace: "nowrap",
                transition: "all 150ms ease",
                textDecoration: "none",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--color-accent)";
                e.currentTarget.style.color = "var(--color-accent)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--color-border)";
                e.currentTarget.style.color = "var(--color-secondary)";
              }}
            >
              {brand}
            </Link>
          ))}
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
      link: "/analytics/sample",
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
              {"link" in feature && feature.link && (
                <Link href={feature.link} style={{
                  display: "inline-block",
                  marginTop: 12,
                  fontSize: 14,
                  fontWeight: 600,
                  color: "var(--color-accent)",
                  textDecoration: "none",
                }}>
                  See a sample report →
                </Link>
              )}
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

// Newsletter Signup Section
function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://milled-india-api.onrender.com";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");
    try {
      const res = await fetch(`${API_BASE}/newsletter/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      if (res.ok) {
        setStatus("success");
        setMessage("You're in! We'll send you the best D2C email insights weekly.");
        setEmail("");
      } else {
        setStatus("error");
        setMessage("Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <section style={{
      padding: "80px 24px",
      background: "white",
      borderTop: "1px solid var(--color-border)",
    }}>
      <div style={{ maxWidth: 560, margin: "0 auto", textAlign: "center" }}>
        <h2 style={{
          fontSize: "clamp(24px, 3vw, 30px)",
          fontWeight: 700,
          color: "var(--color-primary)",
          letterSpacing: "-0.02em",
          marginBottom: 12,
        }}>
          Get weekly D2C email insights
        </h2>
        <p style={{
          fontSize: 16,
          color: "var(--color-secondary)",
          marginBottom: 28,
          lineHeight: 1.6,
        }}>
          Top campaigns, subject line trends, and send-time analysis — delivered to your inbox every week. No spam, unsubscribe anytime.
        </p>

        {status === "success" ? (
          <div style={{
            padding: "16px 24px",
            backgroundColor: "#f0fdf4",
            border: "1px solid #86efac",
            borderRadius: 12,
            color: "#166534",
            fontSize: 15,
            fontWeight: 500,
          }}>
            {message}
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", gap: 12, maxWidth: 480, margin: "0 auto" }}>
            <input
              type="email"
              required
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                flex: 1,
                padding: "14px 16px",
                fontSize: 15,
                color: "var(--color-primary)",
                border: "1px solid var(--color-border)",
                borderRadius: 10,
                outline: "none",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "var(--color-accent)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--color-border)")}
            />
            <button
              type="submit"
              disabled={status === "loading"}
              style={{
                padding: "14px 28px",
                fontSize: 15,
                fontWeight: 600,
                color: "#fff",
                backgroundColor: status === "loading" ? "#94a3b8" : "var(--color-accent)",
                border: "none",
                borderRadius: 10,
                cursor: status === "loading" ? "not-allowed" : "pointer",
                transition: "background-color 0.2s",
                whiteSpace: "nowrap",
              }}
            >
              {status === "loading" ? "..." : "Subscribe"}
            </button>
          </form>
        )}
        {status === "error" && (
          <p style={{ marginTop: 12, fontSize: 14, color: "#dc2626" }}>{message}</p>
        )}
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
          Free access to thousands of real emails from the world&apos;s top D2C brands.
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
      <Header transparent />
      <HeroSection />
      <StatsSection />
      <BrandLogosSection />
      <FeaturesSection />
      <WhoIsThisForSection />
      <NewsletterSection />
      <CTASection />
      <Footer />
    </div>
  );
}
