"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "./components/Header";
import Button from "./components/Button";
import EmailCard, { EmailCardSkeleton } from "./components/EmailCard";
import BrandLogo from "./components/BrandLogo";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://milled-india-api.onrender.com";

// ---- Types ----
interface EmailPreview {
  id: number;
  subject: string;
  brand: string | null;
  sender: string | null;
  type: string | null;
  industry: string | null;
  received_at: string;
}

function logoUrlFromSender(sender: string | null | undefined): string | undefined {
  if (!sender) return undefined;
  const match = sender.match(/@([^\s>]+)/);
  if (!match) return undefined;
  const parts = match[1].split(".");
  const domain =
    parts.length > 2 && ["co", "com", "org", "net"].includes(parts[parts.length - 2])
      ? parts.slice(-3).join(".")
      : parts.slice(-2).join(".");
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
}

// ============================================================
// SECTION 1: Hero — Bold Headline + CTA + Email Grid
// ============================================================
function HeroSection({ defaultEmails }: { defaultEmails: EmailPreview[] }) {
  return (
    <section
      style={{
        background: "linear-gradient(180deg, var(--color-surface) 0%, #ffffff 70%)",
        padding: "120px 24px 80px",
      }}
    >
      <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
        <h1
          style={{
            fontFamily: "var(--font-dm-serif)",
            fontSize: "clamp(36px, 5.5vw, 56px)",
            fontWeight: 400,
            color: "var(--color-primary)",
            lineHeight: 1.08,
            letterSpacing: "-0.02em",
            marginBottom: 20,
          }}
        >
          India&apos;s largest email marketing
          <br />
          <span style={{ color: "var(--color-accent)" }}>inspiration library</span>
        </h1>

        <p
          style={{
            fontSize: "clamp(17px, 2vw, 20px)",
            color: "var(--color-secondary)",
            lineHeight: 1.5,
            marginBottom: 36,
          }}
        >
          100,000+ emails from 10,000+ brands across 17 industries
        </p>

        <Button href="/signup" size="lg">
          Start Free Account
        </Button>

        <p style={{ fontSize: 13, color: "var(--color-tertiary)", marginTop: 14 }}>
          Free forever &middot; No credit card &middot; 7-day Starter trial included
        </p>
      </div>

      {/* 6-email decorative grid */}
      <div
        className="hero-email-grid"
        style={{
          maxWidth: 960,
          margin: "60px auto 0",
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 16,
        }}
      >
        {defaultEmails.length === 0
          ? Array.from({ length: 6 }).map((_, i) => (
              <EmailCardSkeleton key={i} />
            ))
          : defaultEmails.slice(0, 6).map((email) => (
              <EmailCard
                key={email.id}
                id={email.id}
                subject={email.subject}
                brand={email.brand || undefined}
                industry={email.industry || undefined}
                received_at={email.received_at}
                campaignType={email.type || undefined}
                logoUrl={logoUrlFromSender(email.sender)}
                compact
                previewHeight={200}
              />
            ))}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .hero-email-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            max-width: 480px !important;
          }
        }
      `}</style>
    </section>
  );
}

// ============================================================
// SECTION 2: Brand Carousel
// ============================================================
const TOP_BRANDS = [
  "Uniqlo",
  "Calvin Klein",
  "Balenciaga",
  "Givenchy",
  "Mango",
  "Net-A-Porter",
  "Anthropologie",
  "Mytheresa",
  "AJIO",
  "Fossil",
  "Nykaa",
  "Reformation",
  "Zomato",
  "Bobbi Brown Cosmetics",
  "Kiehl'S Since 1851",
  "Nyx Professional Makeup",
  "Urban Decay",
  "Innisfree",
  "Caratlane, A Tanishq Partnership",
  "Luisaviaroma",
];

function BrandCarousel({
  brandStats,
}: {
  brandStats: Record<string, { logo_url?: string | null }>;
}) {
  const marqueeItems = [...TOP_BRANDS, ...TOP_BRANDS];

  return (
    <section
      style={{
        padding: "40px 24px 48px",
        background: "var(--color-surface)",
        borderBottom: "1px solid var(--color-border)",
        overflow: "hidden",
      }}
    >
      <p
        style={{
          textAlign: "center",
          fontSize: 11,
          fontWeight: 600,
          color: "var(--color-tertiary)",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          marginBottom: 20,
        }}
      >
        Tracking 10,000+ brands across 17 industries
      </p>
      <div
        style={{
          position: "relative",
          maskImage:
            "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
        }}
      >
        <div
          className="marquee-track"
          style={{
            display: "flex",
            gap: 24,
            alignItems: "center",
            width: "max-content",
            animation: "marqueeScroll 35s linear infinite",
          }}
        >
          {marqueeItems.map((brand, i) => (
            <div
              key={`${brand}-${i}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                whiteSpace: "nowrap",
              }}
            >
              <BrandLogo
                brandName={brand}
                logoUrl={brandStats[brand]?.logo_url}
                size={28}
                borderRadius={7}
              />
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: "var(--color-secondary)",
                  textTransform: "capitalize",
                }}
              >
                {brand}
              </span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marqueeScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}

// ============================================================
// SECTION 3-5: Feature Rows (Reusable)
// ============================================================
function BrowseMock() {
  return (
    <div style={{ background: "#1C1917", borderRadius: 16, padding: 24, width: "100%" }}>
      <div style={{ background: "#333", borderRadius: 10, padding: "10px 14px", display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
        <span style={{ fontSize: 13, color: "#888" }}>Search brands...</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
        {[{ clr: "#2d4a3e" }, { clr: "#4a2d3e" }, { clr: "#3e3a2d" }].map((c, i) => (
          <div key={i} style={{ background: "#2a2725", borderRadius: 8, overflow: "hidden" }}>
            <div style={{ height: 56, background: c.clr }} />
            <div style={{ padding: "6px 8px" }}>
              <div style={{ height: 4, background: "#444", borderRadius: 2, width: "80%", marginBottom: 4 }} />
              <div style={{ height: 3, background: "#333", borderRadius: 2, width: "55%" }} />
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 6, marginTop: 12 }}>
        <span style={{ fontSize: 11, background: "rgba(194,113,74,0.2)", color: "#E8956E", padding: "3px 10px", borderRadius: 10 }}>Sale</span>
        <span style={{ fontSize: 11, background: "#333", color: "#888", padding: "3px 10px", borderRadius: 10 }}>Welcome</span>
        <span style={{ fontSize: 11, background: "#333", color: "#888", padding: "3px 10px", borderRadius: 10 }}>Newsletter</span>
      </div>
    </div>
  );
}

function AnalysisMock() {
  const bars = [
    { label: "Subject", pct: 92 },
    { label: "Copy", pct: 78 },
    { label: "CTA", pct: 90 },
    { label: "Design", pct: 72 },
    { label: "Strategy", pct: 85 },
  ];
  return (
    <div style={{ background: "#1C1917", borderRadius: 16, padding: 24, width: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
        <div style={{ width: 52, height: 52, borderRadius: "50%", border: "2.5px solid #10b981", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: 18, fontWeight: 700, color: "white", lineHeight: 1 }}>87</span>
          <span style={{ fontSize: 10, color: "#10b981", fontWeight: 600 }}>A</span>
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: "white" }}>Flash Sale Email</div>
          <div style={{ fontSize: 11, color: "#888" }}>Nykaa &middot; Sale Campaign</div>
        </div>
      </div>
      {bars.map((d) => (
        <div key={d.label} style={{ marginBottom: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
            <span style={{ fontSize: 11, color: "#888" }}>{d.label}</span>
            <span style={{ fontSize: 11, color: "white", fontWeight: 600 }}>{d.pct}%</span>
          </div>
          <div style={{ height: 4, background: "#333", borderRadius: 2 }}>
            <div style={{ height: "100%", width: `${d.pct}%`, background: d.pct >= 85 ? "#10b981" : d.pct >= 70 ? "#3b82f6" : "#f59e0b", borderRadius: 2 }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function EditorMock() {
  return (
    <div style={{ background: "#1C1917", borderRadius: 16, overflow: "hidden", width: "100%" }}>
      <div style={{ padding: "8px 14px", borderBottom: "1px solid #333", display: "flex", gap: 6 }}>
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f57" }} />
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ffbd2e" }} />
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#28c840" }} />
      </div>
      <div style={{ padding: 20 }}>
        <div style={{ background: "white", borderRadius: 10, padding: 16, maxWidth: 280, margin: "0 auto" }}>
          <div style={{ background: "#C2714A", borderRadius: 6, padding: "14px 10px", textAlign: "center", marginBottom: 10 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "white" }}>SUMMER SALE</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.8)" }}>Up to 50% off</div>
          </div>
          <div style={{ fontSize: 11, color: "#333", lineHeight: 1.5, marginBottom: 10 }}>Shop our biggest sale of the year with exclusive deals across all categories...</div>
          <div style={{ background: "#333", borderRadius: 5, padding: "8px 16px", textAlign: "center", fontSize: 11, fontWeight: 600, color: "white" }}>SHOP NOW</div>
        </div>
      </div>
      <div style={{ padding: "8px 14px", borderTop: "1px solid #333", display: "flex", justifyContent: "center", gap: 8 }}>
        <span style={{ fontSize: 11, background: "#C2714A", color: "white", padding: "4px 12px", borderRadius: 5, fontWeight: 500 }}>Use Template</span>
        <span style={{ fontSize: 11, background: "#333", color: "#ccc", padding: "4px 10px", borderRadius: 5, fontWeight: 500 }}>Export</span>
      </div>
    </div>
  );
}

function FeatureRow({
  direction,
  badge,
  heading,
  description,
  ctaText,
  ctaHref,
  visual,
  bg,
}: {
  direction: "left" | "right";
  badge: string;
  heading: string;
  description: string;
  ctaText: string;
  ctaHref: string;
  visual: React.ReactNode;
  bg: string;
}) {
  return (
    <section style={{ padding: "96px 24px", background: bg }}>
      <div
        className="feature-row"
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 64,
          alignItems: "center",
        }}
      >
        {/* Text side */}
        <div style={{ order: direction === "left" ? 1 : 2 }}>
          <span
            style={{
              display: "inline-block",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--color-accent)",
              background: "var(--color-accent-light)",
              padding: "4px 12px",
              borderRadius: 6,
              marginBottom: 20,
            }}
          >
            {badge}
          </span>
          <h2
            style={{
              fontFamily: "var(--font-dm-serif)",
              fontSize: "clamp(26px, 3.5vw, 36px)",
              fontWeight: 400,
              color: "var(--color-primary)",
              letterSpacing: "-0.02em",
              lineHeight: 1.15,
              marginBottom: 16,
            }}
          >
            {heading}
          </h2>
          <p
            style={{
              fontSize: 16,
              color: "var(--color-secondary)",
              lineHeight: 1.6,
              marginBottom: 28,
            }}
          >
            {description}
          </p>
          <Link
            href={ctaHref}
            style={{
              fontSize: 15,
              fontWeight: 600,
              color: "var(--color-accent)",
              textDecoration: "none",
            }}
          >
            {ctaText} &rarr;
          </Link>
        </div>

        {/* Visual side */}
        <div
          style={{
            order: direction === "left" ? 2 : 1,
            borderRadius: 20,
            overflow: "hidden",
            boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
          }}
        >
          {visual}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// SECTION 6: Email Grid Showcase
// ============================================================
function EmailGridShowcase({ emails }: { emails: EmailPreview[] }) {
  return (
    <section style={{ padding: "96px 24px", background: "var(--color-surface)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2
            style={{
              fontFamily: "var(--font-dm-serif)",
              fontSize: "clamp(28px, 4vw, 36px)",
              fontWeight: 400,
              color: "var(--color-primary)",
              letterSpacing: "-0.02em",
              marginBottom: 12,
            }}
          >
            See what top Indian brands are sending today
          </h2>
          <p style={{ fontSize: 17, color: "var(--color-secondary)" }}>
            Updated daily with 1,000+ new emails
          </p>
        </div>

        <div
          className="showcase-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 16,
          }}
        >
          {emails.length === 0
            ? Array.from({ length: 8 }).map((_, i) => (
                <EmailCardSkeleton key={i} />
              ))
            : emails.slice(0, 8).map((email) => (
                <EmailCard
                  key={email.id}
                  id={email.id}
                  subject={email.subject}
                  brand={email.brand || undefined}
                  industry={email.industry || undefined}
                  received_at={email.received_at}
                  campaignType={email.type || undefined}
                  logoUrl={logoUrlFromSender(email.sender)}
                  compact
                  previewHeight={220}
                />
              ))}
        </div>

        <div style={{ textAlign: "center", marginTop: 40 }}>
          <Button href="/browse" variant="outline" size="lg">
            Browse All Emails
          </Button>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// SECTION 7: Pricing
// ============================================================
function PricingAnchor() {
  const plans = [
    {
      name: "Free",
      price: "0",
      period: "/forever",
      features: ["Last 30 days of emails", "20 email views/day", "5 brand pages/day", "Basic search"],
      cta: "Create Free Account",
      ctaHref: "/signup",
      variant: "secondary" as const,
      highlight: false,
    },
    {
      name: "Starter",
      price: "9",
      period: "/mo",
      annual: "89/yr",
      savings: "Save 18%",
      features: ["6 months of emails", "75 email views/day", "Advanced filters", "Edit + 3 template exports"],
      cta: "Start 7-Day Trial",
      ctaHref: "/pricing",
      variant: "secondary" as const,
      highlight: false,
    },
    {
      name: "Pro",
      price: "19",
      period: "/mo",
      annual: "189/yr",
      savings: "Save 17%",
      features: ["Full email archive", "Unlimited views & analytics", "Campaign calendar & alerts", "Template editor & AI generator"],
      cta: "Start 7-Day Trial",
      ctaHref: "/pricing",
      variant: "primary" as const,
      highlight: true,
    },
    {
      name: "Agency",
      price: "49",
      period: "/mo",
      annual: "489/yr",
      features: ["Everything in Pro", "10 team seats", "Unlimited brand alerts", "Unlimited AI generator"],
      cta: "Contact Sales",
      ctaHref: "/pricing",
      variant: "secondary" as const,
      highlight: false,
    },
  ];

  return (
    <section style={{ padding: "96px 24px", background: "white" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <h2
            style={{
              fontFamily: "var(--font-dm-serif)",
              fontSize: "clamp(28px, 4vw, 36px)",
              fontWeight: 400,
              color: "var(--color-primary)",
              letterSpacing: "-0.02em",
              marginBottom: 12,
            }}
          >
            Start free. Upgrade when you see the value.
          </h2>
          <p style={{ fontSize: 17, color: "var(--color-secondary)" }}>
            Every new account gets 7 days of full Starter access &mdash; no credit card required.
          </p>
        </div>

        <div
          style={{
            background: "var(--color-accent-light)",
            borderRadius: 10,
            padding: "10px 20px",
            textAlign: "center",
            fontSize: 13,
            fontWeight: 500,
            color: "var(--color-accent-hover)",
            marginBottom: 32,
            maxWidth: 480,
            margin: "0 auto 32px",
          }}
        >
          7-day Starter trial included with every new account
        </div>

        <div
          className="pricing-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 16,
          }}
        >
          {plans.map((plan) => (
            <div
              key={plan.name}
              style={{
                border: plan.highlight ? "2px solid var(--color-accent)" : "1px solid var(--color-border)",
                borderRadius: 16,
                padding: 28,
                background: "white",
                position: "relative",
              }}
            >
              {plan.highlight && (
                <div
                  style={{
                    position: "absolute",
                    top: -12,
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "linear-gradient(135deg, var(--color-accent), var(--color-accent-hover))",
                    color: "white",
                    fontSize: 11,
                    fontWeight: 600,
                    padding: "4px 14px",
                    borderRadius: 20,
                    whiteSpace: "nowrap",
                  }}
                >
                  MOST POPULAR
                </div>
              )}
              <h3 style={{ fontSize: 16, fontWeight: 600, color: "var(--color-primary)", margin: "0 0 4px" }}>
                {plan.name}
              </h3>
              <div style={{ marginBottom: 4 }}>
                <span style={{ fontSize: 32, fontWeight: 700, color: "var(--color-primary)" }}>${plan.price}</span>
                <span style={{ fontSize: 13, color: "var(--color-secondary)" }}>{plan.period}</span>
              </div>
              {plan.annual && (
                <p style={{ fontSize: 11, color: "var(--color-secondary)", margin: "0 0 16px" }}>
                  ${plan.annual}
                  {plan.savings && (
                    <span style={{ marginLeft: 6, color: "#16a34a", fontWeight: 600, background: "#dcfce7", padding: "2px 6px", borderRadius: 4, fontSize: 10 }}>
                      {plan.savings}
                    </span>
                  )}
                </p>
              )}
              {!plan.annual && <div style={{ height: 16 }} />}
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 20px", display: "flex", flexDirection: "column", gap: 8 }}>
                {plan.features.map((item) => (
                  <li key={item} style={{ fontSize: 13, color: "var(--color-secondary)", display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ color: plan.highlight ? "var(--color-accent)" : "#22c55e", fontSize: 12 }}>&#10003;</span>
                    {item}
                  </li>
                ))}
              </ul>
              <Button href={plan.ctaHref} variant={plan.variant} fullWidth>
                {plan.cta}
              </Button>
              {plan.highlight && (
                <p style={{ fontSize: 11, color: "var(--color-tertiary)", textAlign: "center", marginTop: 8, marginBottom: 0 }}>7-day money-back guarantee</p>
              )}
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: 20 }}>
          <Link
            href="/pricing"
            style={{ fontSize: 14, fontWeight: 500, color: "var(--color-accent)", textDecoration: "none" }}
          >
            See full feature comparison &rarr;
          </Link>
        </div>
      </div>

      <style>{`
        @media (max-width: 960px) {
          .pricing-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 640px) {
          .pricing-grid {
            grid-template-columns: 1fr !important;
            max-width: 400px !important;
            margin: 0 auto !important;
          }
          .pricing-grid > div:nth-child(3) {
            order: -1;
          }
        }
      `}</style>
    </section>
  );
}

// ============================================================
// SECTION 8: Final CTA
// ============================================================
function FinalCTA() {
  return (
    <section style={{ padding: "96px 24px", background: "var(--color-surface)", textAlign: "center" }}>
      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        <h2
          style={{
            fontFamily: "var(--font-dm-serif)",
            fontSize: "clamp(28px, 4vw, 36px)",
            fontWeight: 400,
            color: "var(--color-primary)",
            letterSpacing: "-0.02em",
            marginBottom: 16,
          }}
        >
          Your next email campaign starts here
        </h2>
        <p
          style={{
            fontSize: 17,
            color: "var(--color-secondary)",
            marginBottom: 32,
            lineHeight: 1.6,
          }}
        >
          Join thousands of marketers who research smarter, create faster,
          and send better emails with MailMuse.
        </p>
        <Button href="/signup" size="lg">
          Create Your Free Account
        </Button>
        <p style={{ marginTop: 20, fontSize: 13, color: "var(--color-tertiary)" }}>
          Free forever plan &middot; No credit card required &middot; Takes 10
          seconds to start
        </p>

        <div
          className="trust-signals"
          style={{
            display: "flex",
            gap: 24,
            justifyContent: "center",
            marginTop: 32,
            paddingTop: 32,
            borderTop: "1px solid var(--color-border)",
          }}
        >
          {[
            "Updated daily with 1,000+ new emails",
            "10,000+ brands tracked",
            "7-day money-back on all paid plans",
          ].map((sig) => (
            <div
              key={sig}
              style={{
                fontSize: 12,
                color: "var(--color-tertiary)",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <span style={{ color: "var(--color-accent)", fontSize: 12 }}>&#10003;</span>
              {sig}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .trust-signals {
            flex-direction: column !important;
            gap: 12px !important;
            align-items: center !important;
          }
        }
      `}</style>
    </section>
  );
}

// ============================================================
// MAIN COMPONENT
// ============================================================
export function HomeClient() {
  const [recentEmails, setRecentEmails] = useState<EmailPreview[]>([]);
  const [brandStats, setBrandStats] = useState<Record<string, { logo_url?: string | null }>>({});

  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE}/emails?limit=20`).then((r) =>
        r.ok ? r.json() : []
      ),
      fetch(`${API_BASE}/brands/stats`).then((r) => (r.ok ? r.json() : {})),
    ])
      .then(([emails, statsData]) => {
        const emailList = emails.emails || emails || [];
        setRecentEmails(emailList.slice(0, 20));
        setBrandStats(statsData as Record<string, { logo_url?: string | null }>);
      })
      .catch(() => {});
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-surface)" }}>
      <Header transparent />
      <HeroSection defaultEmails={recentEmails.slice(0, 6)} />
      <BrandCarousel brandStats={brandStats} />
      <FeatureRow
        direction="left"
        badge="BROWSE"
        heading="Browse 100K+ real emails from Indian brands"
        description="Search and filter by brand, industry, or campaign type. See full email archives with send timing, frequency data, and competitive intelligence."
        ctaText="Browse emails free"
        ctaHref="/browse"
        visual={<BrowseMock />}
        bg="white"
      />
      <FeatureRow
        direction="right"
        badge="AI-POWERED"
        heading="AI-powered email scoring & analysis"
        description="Every email gets scored on 5 dimensions — Subject Line, Copy Quality, CTA Effectiveness, Design, and Strategy — with actionable insights."
        ctaText="See sample analysis"
        ctaHref="/browse"
        visual={<AnalysisMock />}
        bg="var(--color-surface)"
      />
      <FeatureRow
        direction="left"
        badge="TEMPLATES"
        heading="Save to collections & export as templates"
        description="One click opens any email in our editor. Change text, swap images, update colors — export production-ready HTML for your next campaign."
        ctaText="Try the editor"
        ctaHref="/browse"
        visual={<EditorMock />}
        bg="white"
      />
      <EmailGridShowcase emails={recentEmails.slice(6, 14)} />
      <PricingAnchor />
      <FinalCTA />
    </div>
  );
}
