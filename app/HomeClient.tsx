"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Header from "./components/Header";
import Button from "./components/Button";
import Badge from "./components/Badge";
import Card from "./components/Card";
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
// SECTION 1: Hero — Interactive Search Demo
// ============================================================
const HERO_PLACEHOLDERS = [
  "Search 'Nike sale emails'...",
  "Search 'welcome email beauty'...",
  "Search 'cart abandonment fashion'...",
  "Search 'Nykaa promotional'...",
  "Search 'newsletter SaaS'...",
];

const QUICK_FILTERS = [
  { label: "Welcome Emails", query: "welcome" },
  { label: "Sale Campaigns", query: "sale" },
  { label: "Cart Abandonment", query: "cart abandonment" },
  { label: "Newsletters", query: "newsletter" },
  { label: "New Arrivals", query: "new arrival" },
];

function HeroSection({
  defaultEmails,
}: {
  defaultEmails: EmailPreview[];
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<EmailPreview[]>([]);
  const [searching, setSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Rotate placeholder text
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIdx((i) => (i + 1) % HERO_PLACEHOLDERS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Debounced search
  const doSearch = useCallback((q: string) => {
    if (!q.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }
    setSearching(true);
    setHasSearched(true);
    fetch(`${API_BASE}/emails?q=${encodeURIComponent(q.trim())}&limit=6`)
      .then((r) => (r.ok ? r.json() : { emails: [] }))
      .then((data) => {
        const emails = data.emails || data || [];
        setResults(emails.slice(0, 6));
      })
      .catch(() => setResults([]))
      .finally(() => setSearching(false));
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSearch(val), 400);
  };

  const handleQuickFilter = (q: string) => {
    setQuery(q);
    doSearch(q);
  };

  const displayEmails = hasSearched ? results : defaultEmails.slice(0, 6);

  return (
    <section
      style={{
        background:
          "linear-gradient(180deg, var(--color-surface) 0%, #ffffff 70%)",
        padding: "80px 24px 64px",
      }}
    >
      <div
        style={{
          maxWidth: 860,
          margin: "0 auto",
          textAlign: "center",
          opacity: 0,
          animation: "fadeInUp 0.6s ease forwards",
        }}
      >
        <h1
          style={{
            fontFamily: "var(--font-dm-serif)",
            fontSize: "clamp(32px, 5vw, 52px)",
            fontWeight: 400,
            color: "var(--color-primary)",
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            marginBottom: 16,
          }}
        >
          See what your competitors are emailing{" "}
          <span style={{ color: "var(--color-accent)" }}>&mdash; right now</span>
        </h1>
        <p
          style={{
            fontSize: "clamp(16px, 1.8vw, 18px)",
            color: "var(--color-secondary)",
            lineHeight: 1.6,
            maxWidth: 640,
            margin: "0 auto 32px",
          }}
        >
          Browse 100,000+ real emails from 10,000+ brands. Analyze their
          strategy. Edit any email as your own template.
        </p>

        {/* Search bar */}
        <div
          style={{
            maxWidth: 600,
            margin: "0 auto 16px",
            position: "relative",
          }}
        >
          <div style={{ position: "relative" }}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--color-tertiary)"
              strokeWidth="2"
              strokeLinecap="round"
              style={{
                position: "absolute",
                left: 18,
                top: "50%",
                transform: "translateY(-50%)",
                pointerEvents: "none",
              }}
            >
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={handleInputChange}
              placeholder={HERO_PLACEHOLDERS[placeholderIdx]}
              style={{
                width: "100%",
                padding: "18px 22px 18px 52px",
                fontSize: 16,
                border: "2px solid var(--color-border)",
                borderRadius: 14,
                background: "white",
                color: "var(--color-primary)",
                outline: "none",
                transition: "border-color 200ms ease, box-shadow 200ms ease",
                boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "var(--color-accent)";
                e.currentTarget.style.boxShadow = "0 4px 20px rgba(194,113,74,0.12)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "var(--color-border)";
                e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.06)";
              }}
            />
            {searching && (
              <div
                style={{
                  position: "absolute",
                  right: 18,
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: 20,
                  height: 20,
                  border: "2px solid var(--color-border)",
                  borderTopColor: "var(--color-accent)",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite",
                }}
              />
            )}
          </div>
        </div>

        {/* Quick filter pills */}
        <div
          className="hero-pills horizontal-scroll"
          style={{
            display: "flex",
            gap: 8,
            justifyContent: "center",
            flexWrap: "wrap",
            marginBottom: 24,
          }}
        >
          {QUICK_FILTERS.map((f) => (
            <button
              key={f.query}
              onClick={() => handleQuickFilter(f.query)}
              style={{
                padding: "6px 14px",
                fontSize: 13,
                fontWeight: 500,
                border: query === f.query
                  ? "1px solid var(--color-accent)"
                  : "1px solid var(--color-border)",
                borderRadius: 20,
                background: query === f.query
                  ? "var(--color-accent-light)"
                  : "white",
                color: query === f.query
                  ? "var(--color-accent)"
                  : "var(--color-secondary)",
                cursor: "pointer",
                transition: "all 150ms ease",
                whiteSpace: "nowrap",
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* CTAs */}
        <div
          className="hero-cta-row"
          style={{
            display: "flex",
            gap: 12,
            justifyContent: "center",
            flexWrap: "wrap",
            marginBottom: 12,
          }}
        >
          <Button href="/signup" size="lg">
            Start Free Account
          </Button>
          <Button href="/browse" size="lg" variant="outline">
            Explore 100K+ Email Templates
          </Button>
        </div>

        <p style={{ fontSize: 13, color: "var(--color-tertiary)", marginBottom: 40 }}>
          Free forever plan &middot; No credit card &middot; 7-day Starter trial
          included
        </p>
      </div>

      {/* Results grid */}
      <div
        style={{
          maxWidth: 960,
          margin: "0 auto",
          opacity: 0,
          animation: "fadeInUp 0.6s ease 0.3s forwards",
        }}
      >
        <div
          className="hero-results-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 16,
          }}
        >
          {displayEmails.length > 0
            ? displayEmails.map((email) => (
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
              ))
            : searching
              ? Array.from({ length: 6 }).map((_, i) => (
                  <EmailCardSkeleton key={i} compact previewHeight={200} />
                ))
              : hasSearched
                ? (
                  <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "40px 0", color: "var(--color-tertiary)" }}>
                    No emails found for &ldquo;{query}&rdquo;. Try a different search.
                  </div>
                )
                : Array.from({ length: 6 }).map((_, i) => (
                    <EmailCardSkeleton key={i} compact previewHeight={200} />
                  ))
          }
        </div>

        {hasSearched && results.length > 0 && (
          <div style={{ textAlign: "center", marginTop: 16 }}>
            <Link
              href={`/browse?q=${encodeURIComponent(query)}`}
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: "var(--color-accent)",
                textDecoration: "none",
              }}
            >
              See all results in browse &rarr;
            </Link>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .hero-results-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .hero-cta-row {
            flex-direction: column !important;
            align-items: center !important;
          }
          .hero-pills {
            flex-wrap: nowrap !important;
            justify-content: flex-start !important;
            overflow-x: auto !important;
            scrollbar-width: none !important;
            -webkit-overflow-scrolling: touch !important;
            padding: 0 16px !important;
          }
          .hero-pills::-webkit-scrollbar { display: none; }
        }
        @media (max-width: 480px) {
          .hero-results-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

// ============================================================
// SECTION 2: Brand Trust Bar + Metrics
// ============================================================
// Top 20 brands by revenue/recognition in our database
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

function BrandTrustBar({
  brandStats,
}: {
  brandStats: Record<string, { logo_url?: string | null }>;
}) {
  const displayBrands = TOP_BRANDS;
  const marqueeItems = [...displayBrands, ...displayBrands];

  const metrics = [
    { number: "100,000+", label: "Emails Tracked" },
    { number: "10,000+", label: "Brands Covered" },
    { number: "17", label: "Industries" },
    { number: "17+", label: "Campaign Types" },
  ];

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
          marginBottom: 40,
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

      {/* Metric counters */}
      <div
        className="metrics-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 24,
          maxWidth: 800,
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        {metrics.map((m) => (
          <div key={m.label}>
            <div
              style={{
                fontFamily: "var(--font-dm-serif)",
                fontSize: 32,
                color: "var(--color-primary)",
                lineHeight: 1.1,
                marginBottom: 4,
              }}
            >
              {m.number}
            </div>
            <div
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: "var(--color-tertiary)",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              {m.label}
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes marqueeScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
        @media (max-width: 640px) {
          .metrics-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 20px !important;
          }
        }
      `}</style>
    </section>
  );
}

// ============================================================
// SECTION 3: Problem-Agitation
// ============================================================
function ProblemSection() {
  const pains = [
    {
      icon: (
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="#C2714A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="18" cy="18" r="14" />
          <path d="M18 10v8l5 3" />
        </svg>
      ),
      title: "Hours lost to manual research",
      body: "You subscribe to competitor newsletters, screenshot designs, and paste subject lines into spreadsheets. There has to be a better way.",
    },
    {
      icon: (
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="#C2714A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 18s5-10 13-10 13 10 13 10-5 10-13 10S5 18 5 18z" />
          <circle cx="18" cy="18" r="4" />
          <line x1="5" y1="5" x2="31" y2="31" />
        </svg>
      ),
      title: "Flying blind on competitor strategy",
      body: "You see one email at a time and have no idea about their send frequency, campaign calendar, or seasonal patterns.",
    },
    {
      icon: (
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="#C2714A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="6" y="6" width="10" height="10" rx="2" />
          <rect x="20" y="6" width="10" height="10" rx="2" />
          <rect x="6" y="20" width="10" height="10" rx="2" />
          <path d="M24 24l4 4M28 24l-4 4" />
        </svg>
      ),
      title: "Inspiration without execution",
      body: "You find a great email but can\u2019t easily turn it into a template. Copy-pasting HTML breaks layouts, and rebuilding from scratch wastes hours.",
    },
  ];

  return (
    <section style={{ padding: "96px 24px", background: "white" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <h2
          style={{
            fontFamily: "var(--font-dm-serif)",
            fontSize: "clamp(28px, 4vw, 36px)",
            fontWeight: 400,
            color: "var(--color-primary)",
            textAlign: "center",
            marginBottom: 48,
          }}
        >
          MailMuse solves all three &mdash; in one platform
        </h2>

        <div
          className="problem-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 24,
          }}
        >
          {pains.map((p) => (
            <Card key={p.title} padding="lg">
              <div style={{ marginBottom: 16 }}>{p.icon}</div>
              <h3
                style={{
                  fontSize: 17,
                  fontWeight: 600,
                  color: "var(--color-primary)",
                  marginBottom: 8,
                }}
              >
                {p.title}
              </h3>
              <p
                style={{
                  fontSize: 14,
                  color: "var(--color-secondary)",
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                {p.body}
              </p>
            </Card>
          ))}
        </div>

        <p
          style={{
            textAlign: "center",
            fontSize: 17,
            fontWeight: 500,
            color: "var(--color-accent)",
            marginTop: 40,
          }}
        >
          Stop guessing. Start knowing.
        </p>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .problem-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

// ============================================================
// SECTION 4: Three-Step Workflow
// ============================================================
function WorkflowSection() {
  const steps = [
    {
      num: "01",
      title: "Discover what competitors send",
      body: "Search 10,000+ brands by name, industry, or campaign type. See their full email history \u2014 from welcome flows to flash sale blasts \u2014 with send timing and frequency data.",
      cta: "Browse emails free",
      href: "/browse",
      icon: (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="#C2714A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="17" cy="17" r="10" />
          <path d="M24 24l8 8" />
          <rect x="12" y="13" width="10" height="2" rx="1" />
          <rect x="12" y="18" width="7" height="2" rx="1" />
        </svg>
      ),
    },
    {
      num: "02",
      title: "Decode what drives conversions",
      body: "Every email gets AI-scored on 5 dimensions: Subject Line, Copy Quality, CTA Effectiveness, Design, and Strategy. Plus brand-level analytics on send frequency, timing patterns, and campaign mix.",
      cta: "See sample analysis",
      href: "/browse",
      icon: (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="#C2714A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="6" y="24" width="6" height="10" rx="1" />
          <rect x="17" y="16" width="6" height="18" rx="1" />
          <rect x="28" y="8" width="6" height="26" rx="1" />
          <path d="M6 8l10-2 10 4 8-4" />
        </svg>
      ),
    },
    {
      num: "03",
      title: "Edit any email as your template",
      body: "Found a campaign you love? One click opens it in our drag-and-drop editor. Change text, swap images, update colors \u2014 export production-ready HTML for Klaviyo, Mailchimp, or any ESP.",
      cta: "Try the editor",
      href: "/editor",
      icon: (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="#C2714A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="6" y="6" width="28" height="28" rx="3" />
          <path d="M14 20l4 4 8-8" />
          <path d="M30 14h4" />
          <path d="M30 20h4" />
          <path d="M30 26h4" />
        </svg>
      ),
    },
  ];

  return (
    <section style={{ padding: "96px 24px", background: "var(--color-surface)" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
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
            From research to ready-to-send in 3 steps
          </h2>
          <p style={{ fontSize: 17, color: "var(--color-secondary)", maxWidth: 540, margin: "0 auto" }}>
            Stop guessing. See exactly what top brands send, understand why it works, then make it your own.
          </p>
        </div>

        <div className="workflow-steps" style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          {steps.map((step, idx) => (
            <div key={step.num}>
              <Card padding="lg" hover>
                <div
                  className="workflow-step-inner"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "auto 1fr auto",
                    gap: 24,
                    alignItems: "center",
                  }}
                >
                  {/* Step number */}
                  <div
                    style={{
                      fontFamily: "var(--font-dm-serif)",
                      fontSize: 48,
                      color: "var(--color-accent)",
                      opacity: 0.3,
                      lineHeight: 1,
                      minWidth: 64,
                    }}
                  >
                    {step.num}
                  </div>

                  {/* Content */}
                  <div>
                    <h3
                      style={{
                        fontSize: 20,
                        fontWeight: 600,
                        color: "var(--color-primary)",
                        marginBottom: 8,
                      }}
                    >
                      {step.title}
                    </h3>
                    <p
                      style={{
                        fontSize: 15,
                        color: "var(--color-secondary)",
                        lineHeight: 1.6,
                        margin: "0 0 12px",
                      }}
                    >
                      {step.body}
                    </p>
                    <Link
                      href={step.href}
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: "var(--color-accent)",
                        textDecoration: "none",
                      }}
                    >
                      {step.cta} &rarr;
                    </Link>
                  </div>

                  {/* Icon */}
                  <div className="workflow-step-icon" style={{ flexShrink: 0 }}>{step.icon}</div>
                </div>
              </Card>

              {/* Connector arrow */}
              {idx < steps.length - 1 && (
                <div style={{ textAlign: "center", padding: "8px 0" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-border)" strokeWidth="2" strokeLinecap="round">
                    <path d="M12 5v14M19 12l-7 7-7-7" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .workflow-step-inner {
            grid-template-columns: 1fr !important;
            gap: 12px !important;
            text-align: center;
          }
          .workflow-step-icon {
            display: none !important;
          }
        }
      `}</style>
    </section>
  );
}

// ============================================================
// SECTION 5: AI Analysis Showcase
// ============================================================
function AnalysisShowcase() {
  const dimensions = [
    { name: "Subject Line", grade: "A", pct: 92, desc: "Clarity, length, urgency, personalization triggers" },
    { name: "Copy Quality", grade: "B+", pct: 78, desc: "Tone, readability, persuasion techniques" },
    { name: "CTA Effectiveness", grade: "A", pct: 90, desc: "Placement, wording, visual prominence" },
    { name: "Design & Layout", grade: "B", pct: 72, desc: "Mobile-responsiveness, hierarchy, whitespace" },
    { name: "Strategic Fit", grade: "A-", pct: 85, desc: "Campaign type alignment, timing, audience match" },
  ];

  return (
    <section style={{ padding: "96px 24px", background: "white" }}>
      <div
        className="analysis-grid"
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 64,
          alignItems: "center",
        }}
      >
        {/* Left — Copy */}
        <div>
          <Badge variant="accent" style={{ marginBottom: 16 }}>
            AI-POWERED ANALYSIS
          </Badge>
          <h2
            style={{
              fontFamily: "var(--font-dm-serif)",
              fontSize: "clamp(28px, 4vw, 40px)",
              fontWeight: 400,
              color: "var(--color-primary)",
              letterSpacing: "-0.02em",
              marginBottom: 16,
            }}
          >
            Every email, scored and decoded
          </h2>
          <p
            style={{
              fontSize: 17,
              color: "var(--color-secondary)",
              lineHeight: 1.6,
              marginBottom: 28,
            }}
          >
            Our AI engine evaluates every email across 5 dimensions &mdash;
            giving you actionable intelligence, not just pretty screenshots.
          </p>

          <ul style={{ listStyle: "none", padding: 0, margin: "0 0 32px", display: "flex", flexDirection: "column", gap: 14 }}>
            {dimensions.map((d) => (
              <li key={d.name} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 28,
                    height: 28,
                    borderRadius: 6,
                    background: "var(--color-accent-light)",
                    color: "var(--color-accent)",
                    fontSize: 11,
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  {d.grade}
                </span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "var(--color-primary)" }}>{d.name}</div>
                  <div style={{ fontSize: 13, color: "var(--color-tertiary)" }}>{d.desc}</div>
                </div>
              </li>
            ))}
          </ul>

          <Button href="/browse" size="lg">
            Analyze Your First Email
          </Button>
        </div>

        {/* Right — Mock Analysis Card */}
        <div
          style={{
            background: "#1C1917",
            borderRadius: 16,
            overflow: "hidden",
            boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
            padding: 24,
          }}
        >
          {/* Email header */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 11, color: "#9D9490", marginBottom: 4 }}>Subject Line</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: "white", marginBottom: 8 }}>
              Flash Sale: 40% Off Everything &mdash; Today Only
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <span style={{ fontSize: 10, fontWeight: 600, background: "rgba(194,113,74,0.2)", color: "#E8956E", padding: "2px 8px", borderRadius: 4 }}>Nykaa</span>
              <span style={{ fontSize: 10, fontWeight: 600, background: "rgba(239,68,68,0.15)", color: "#f87171", padding: "2px 8px", borderRadius: 4 }}>Sale</span>
            </div>
          </div>

          {/* Score */}
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                border: "3px solid #10b981",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 8px",
              }}
            >
              <div style={{ fontSize: 22, fontWeight: 700, color: "white", lineHeight: 1 }}>87</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#10b981" }}>A</div>
            </div>
            <div style={{ fontSize: 11, color: "#9D9490" }}>Overall Score</div>
          </div>

          {/* Dimension bars */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
            {dimensions.map((d) => (
              <div key={d.name}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 11, color: "#9D9490" }}>{d.name}</span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: "white" }}>{d.grade}</span>
                </div>
                <div style={{ height: 4, background: "#333", borderRadius: 2, overflow: "hidden" }}>
                  <div
                    style={{
                      height: "100%",
                      width: `${d.pct}%`,
                      background: d.pct >= 85 ? "#10b981" : d.pct >= 70 ? "#3b82f6" : "#f59e0b",
                      borderRadius: 2,
                      transition: "width 0.6s ease",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Key insights */}
          <div style={{ borderTop: "1px solid #333", paddingTop: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#9D9490", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Key Insights</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {[
                "Strong urgency in subject line with time constraint",
                "Clear, single CTA above the fold",
                "Consider adding alt text to hero image",
              ].map((insight) => (
                <div key={insight} style={{ display: "flex", gap: 6, alignItems: "flex-start" }}>
                  <span style={{ color: "#10b981", fontSize: 10, marginTop: 3 }}>&#9679;</span>
                  <span style={{ fontSize: 12, color: "#ccc", lineHeight: 1.4 }}>{insight}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .analysis-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
        }
      `}</style>
    </section>
  );
}

// ============================================================
// SECTION 6: Template Editor Showcase
// ============================================================
function EditorShowcase() {
  return (
    <section style={{ padding: "96px 24px", background: "var(--color-surface)" }}>
      <div
        className="editor-grid"
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 64,
          alignItems: "center",
        }}
      >
        {/* Left — Editor Mock */}
        <div
          style={{
            background: "#1C1917",
            borderRadius: 16,
            overflow: "hidden",
            boxShadow: "0 20px 40px rgba(0,0,0,0.15), 0 8px 16px rgba(0,0,0,0.1)",
          }}
        >
          <div style={{ padding: "10px 16px", borderBottom: "1px solid #333", display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ display: "flex", gap: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f57" }} />
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ffbd2e" }} />
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#28c840" }} />
            </div>
            <span style={{ fontSize: 12, color: "#888", marginLeft: 8 }}>Template Editor</span>
          </div>
          <div style={{ display: "flex" }}>
            <div style={{ flex: 1, padding: 20 }}>
              <div style={{ background: "white", borderRadius: 8, padding: 20, maxWidth: 320, margin: "0 auto" }}>
                <div style={{ background: "var(--color-accent)", borderRadius: 6, padding: "16px 12px", textAlign: "center", marginBottom: 12 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "white" }}>SUMMER SALE</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.8)" }}>Up to 50% off everything</div>
                </div>
                <div style={{ border: "2px solid var(--color-accent)", borderRadius: 6, padding: 12, marginBottom: 12, position: "relative" }}>
                  <div style={{ position: "absolute", top: -10, left: 8, background: "var(--color-accent)", color: "white", fontSize: 9, fontWeight: 600, padding: "2px 6px", borderRadius: 3 }}>TEXT</div>
                  <div style={{ fontSize: 12, color: "#333", lineHeight: 1.5 }}>
                    Shop our biggest sale of the year.
                    <span style={{ borderRight: "2px solid var(--color-accent)", animation: "pulse 1s infinite" }} />
                  </div>
                </div>
                <div style={{ background: "#333", borderRadius: 6, padding: "10px 16px", textAlign: "center", fontSize: 12, fontWeight: 600, color: "white" }}>SHOP NOW</div>
              </div>
            </div>
            <div className="editor-mock-sidebar" style={{ width: 100, borderLeft: "1px solid #333", padding: "12px 8px" }}>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} style={{ height: 8, background: "#333", borderRadius: 4, marginBottom: 8, width: `${60 + i * 10}%` }} />
              ))}
            </div>
          </div>
          <div style={{ padding: "8px 16px", borderTop: "1px solid #333", display: "flex", justifyContent: "center", gap: 8 }}>
            <span style={{ fontSize: 11, background: "var(--color-accent)", color: "white", padding: "4px 16px", borderRadius: 4, fontWeight: 500 }}>Use as Template</span>
            <span style={{ fontSize: 11, background: "#333", color: "#ccc", padding: "4px 12px", borderRadius: 4, fontWeight: 500 }}>Export HTML</span>
          </div>
        </div>

        {/* Right — Copy */}
        <div>
          <Badge variant="accent" style={{ marginBottom: 16 }}>
            ONLY ON MAILMUSE
          </Badge>
          <h2
            style={{
              fontFamily: "var(--font-dm-serif)",
              fontSize: "clamp(28px, 4vw, 40px)",
              fontWeight: 400,
              color: "var(--color-primary)",
              letterSpacing: "-0.02em",
              marginBottom: 16,
            }}
          >
            Don&apos;t just admire great emails.{" "}
            <span style={{ color: "var(--color-accent)" }}>Steal them.</span>
          </h2>
          <p
            style={{
              fontSize: 17,
              color: "var(--color-secondary)",
              lineHeight: 1.6,
              marginBottom: 28,
            }}
          >
            Every email in our database is one click away from becoming your
            template. Open any campaign in our drag-and-drop editor &mdash;
            change text, swap images, update colors &mdash; and export
            production-ready HTML.
          </p>

          <ul style={{ listStyle: "none", padding: 0, margin: "0 0 32px", display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              "Works with any email from our 100,000+ archive",
              "Drag-and-drop \u2014 no code required",
              "Export as HTML or copy to clipboard",
              "Mobile-responsive preview built in",
              "Compatible with Klaviyo, Mailchimp, and every ESP",
            ].map((item) => (
              <li key={item} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 15, color: "var(--color-secondary)" }}>
                <span style={{ color: "var(--color-accent)", fontSize: 16, fontWeight: 600 }}>&#10003;</span>
                {item}
              </li>
            ))}
          </ul>

          <Button href="/editor" size="lg">
            Try the Template Editor
          </Button>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .editor-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
        }
        @media (max-width: 480px) {
          .editor-mock-sidebar {
            display: none !important;
          }
        }
      `}</style>
    </section>
  );
}

// ============================================================
// SECTION 7: Use Case Tabs
// ============================================================
function UseCaseTabs() {
  const [activeTab, setActiveTab] = useState<"d2c" | "agency">("d2c");

  const tabs = {
    d2c: {
      label: "D2C / In-House Marketers",
      benefits: [
        { title: "See exactly what competitors send", body: "Browse competitor emails and get inspiration backed by data, not guesswork." },
        { title: "Know when rivals run sales", body: "Campaign calendar shows competitor timing patterns so you can plan around them." },
        { title: "Stop building emails from scratch", body: "Use any email as a template and customize in minutes, not hours." },
        { title: "Get AI feedback before you hit send", body: "Score your emails against industry benchmarks before they go live." },
      ],
      features: [
        { name: "Brand Comparison", icon: "&#8644;" },
        { name: "Campaign Calendar", icon: "&#128197;" },
        { name: "Swipe File", icon: "&#128203;" },
        { name: "AI Scoring", icon: "&#9733;" },
      ],
    },
    agency: {
      label: "Email Marketing Agencies",
      benefits: [
        { title: "Pitch clients with competitor intelligence", body: "Show prospects exactly what their competitors send \u2014 instant credibility." },
        { title: "10 team seats on the Agency plan", body: "Give your whole team access to the email intelligence platform." },
        { title: "Bulk export and reporting", body: "Download data and create client-ready reports with one click." },
        { title: "Build client campaigns faster", body: "Use templates from top brands as starting points for client work." },
      ],
      features: [
        { name: "Bulk Export", icon: "&#128230;" },
        { name: "Team Seats (10)", icon: "&#128101;" },
        { name: "Client Reports", icon: "&#128200;" },
        { name: "AI Generator", icon: "&#9889;" },
      ],
    },
  };

  const current = tabs[activeTab];

  return (
    <section style={{ padding: "96px 24px", background: "white" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <h2
          style={{
            fontFamily: "var(--font-dm-serif)",
            fontSize: "clamp(28px, 4vw, 36px)",
            fontWeight: 400,
            color: "var(--color-primary)",
            textAlign: "center",
            marginBottom: 40,
          }}
        >
          Built for the people who actually write emails
        </h2>

        {/* Tab buttons */}
        <div style={{ display: "flex", justifyContent: "center", gap: 4, marginBottom: 40 }}>
          {(["d2c", "agency"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: "10px 24px",
                fontSize: 14,
                fontWeight: 600,
                border: "none",
                borderRadius: 8,
                cursor: "pointer",
                background: activeTab === tab ? "var(--color-accent)" : "var(--color-surface)",
                color: activeTab === tab ? "white" : "var(--color-secondary)",
                transition: "all 150ms ease",
              }}
            >
              {tabs[tab].label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div
          className="usecase-content"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 48,
            alignItems: "start",
          }}
        >
          {/* Benefits */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {current.benefits.map((b) => (
              <div key={b.title}>
                <h4 style={{ fontSize: 16, fontWeight: 600, color: "var(--color-primary)", marginBottom: 4 }}>
                  {b.title}
                </h4>
                <p style={{ fontSize: 14, color: "var(--color-secondary)", lineHeight: 1.5, margin: 0 }}>
                  {b.body}
                </p>
              </div>
            ))}
          </div>

          {/* Feature grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
            }}
          >
            {current.features.map((f) => (
              <Card key={f.name} padding="md" hover>
                <div
                  style={{ fontSize: 24, marginBottom: 8 }}
                  dangerouslySetInnerHTML={{ __html: f.icon }}
                />
                <div style={{ fontSize: 14, fontWeight: 600, color: "var(--color-primary)" }}>
                  {f.name}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .usecase-content {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
        }
      `}</style>
    </section>
  );
}

// ============================================================
// SECTION 8: Competitor Comparison Table
// ============================================================
function ComparisonTable() {
  const rows = [
    { feature: "Email archive", mailmuse: "100K+", milled: "41M+", rge: "~10K", ei: "~3K" },
    { feature: "AI email analysis & scoring", mailmuse: true, milled: false, rge: false, ei: "Basic" },
    { feature: "Template editor (edit any email)", mailmuse: true, milled: false, rge: false, ei: false },
    { feature: "Brand analytics (frequency, timing)", mailmuse: true, milled: false, rge: false, ei: "Limited" },
    { feature: "Brand comparison tool", mailmuse: true, milled: false, rge: false, ei: false },
    { feature: "Campaign calendar", mailmuse: true, milled: false, rge: false, ei: false },
    { feature: "Subject line swipe file", mailmuse: true, milled: false, rge: false, ei: false },
    { feature: "Campaign type filtering (17+ types)", mailmuse: true, milled: "Limited", rge: "Tags", ei: "Limited" },
    { feature: "Industry benchmarks", mailmuse: true, milled: false, rge: false, ei: false },
    { feature: "AI email generator", mailmuse: true, milled: false, rge: false, ei: false },
    { feature: "Built for marketers", mailmuse: true, milled: "Consumer", rge: "Design", ei: "Partial" },
  ];

  const renderCell = (val: boolean | string) => {
    if (val === true) return <span style={{ color: "#22c55e", fontSize: 16 }}>&#10003;</span>;
    if (val === false) return <span style={{ color: "#d4d4d4", fontSize: 14 }}>&times;</span>;
    return <span style={{ fontSize: 12, color: "var(--color-tertiary)" }}>{val}</span>;
  };

  return (
    <section style={{ padding: "96px 24px", background: "var(--color-surface)" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <h2
          style={{
            fontFamily: "var(--font-dm-serif)",
            fontSize: "clamp(28px, 4vw, 36px)",
            fontWeight: 400,
            color: "var(--color-primary)",
            textAlign: "center",
            marginBottom: 12,
          }}
        >
          The only platform that goes from research to action
        </h2>
        <p style={{ textAlign: "center", fontSize: 17, color: "var(--color-secondary)", marginBottom: 40 }}>
          Other tools show you emails. MailMuse helps you actually do something with them.
        </p>

        <div style={{ overflowX: "auto", borderRadius: 14, border: "1px solid var(--color-border)", background: "white" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 640 }}>
            <thead>
              <tr>
                <th style={{ padding: "14px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "var(--color-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid var(--color-border)" }}>Feature</th>
                <th style={{ padding: "14px 16px", textAlign: "center", fontSize: 13, fontWeight: 700, color: "var(--color-accent)", borderBottom: "1px solid var(--color-border)", background: "var(--color-accent-light)" }}>MailMuse</th>
                <th style={{ padding: "14px 16px", textAlign: "center", fontSize: 12, fontWeight: 600, color: "var(--color-tertiary)", borderBottom: "1px solid var(--color-border)" }}>Milled</th>
                <th style={{ padding: "14px 16px", textAlign: "center", fontSize: 12, fontWeight: 600, color: "var(--color-tertiary)", borderBottom: "1px solid var(--color-border)" }}>Really Good Emails</th>
                <th style={{ padding: "14px 16px", textAlign: "center", fontSize: 12, fontWeight: 600, color: "var(--color-tertiary)", borderBottom: "1px solid var(--color-border)" }}>EmailInspire</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr key={row.feature} style={{ background: idx % 2 === 1 ? "var(--color-surface)" : "white" }}>
                  <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 500, color: "var(--color-primary)", borderBottom: "1px solid var(--color-border)" }}>{row.feature}</td>
                  <td style={{ padding: "12px 16px", textAlign: "center", borderBottom: "1px solid var(--color-border)", background: idx % 2 === 1 ? "rgba(245,230,220,0.4)" : "rgba(245,230,220,0.2)" }}>{renderCell(row.mailmuse)}</td>
                  <td style={{ padding: "12px 16px", textAlign: "center", borderBottom: "1px solid var(--color-border)" }}>{renderCell(row.milled)}</td>
                  <td style={{ padding: "12px 16px", textAlign: "center", borderBottom: "1px solid var(--color-border)" }}>{renderCell(row.rge)}</td>
                  <td style={{ padding: "12px 16px", textAlign: "center", borderBottom: "1px solid var(--color-border)" }}>{renderCell(row.ei)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p style={{ textAlign: "center", fontSize: 14, color: "var(--color-tertiary)", marginTop: 20, fontStyle: "italic" }}>
          Fewer emails than Milled, but every email is actionable.
        </p>
      </div>
    </section>
  );
}

// ============================================================
// SECTION 9: Pricing Anchor
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
      features: ["Everything in Pro", "10 team seats", "Bulk export & reports", "Unlimited AI generator"],
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
// SECTION 10: Final CTA
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
      fetch(`${API_BASE}/emails?limit=8`).then((r) =>
        r.ok ? r.json() : []
      ),
      fetch(`${API_BASE}/brands/stats`).then((r) => (r.ok ? r.json() : {})),
    ])
      .then(([emails, statsData]) => {
        const emailList = emails.emails || emails || [];
        setRecentEmails(emailList.slice(0, 8));
        setBrandStats(statsData as Record<string, { logo_url?: string | null }>);
      })
      .catch(() => {});
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-surface)" }}>
      <Header transparent />
      <HeroSection defaultEmails={recentEmails.slice(0, 6)} />
      <BrandTrustBar brandStats={brandStats} />
      <ProblemSection />
      <WorkflowSection />
      <AnalysisShowcase />
      <EditorShowcase />
      <UseCaseTabs />
      <ComparisonTable />
      <PricingAnchor />
      <FinalCTA />
    </div>
  );
}
