"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Logo from "./components/Logo";
import Header from "./components/Header";
import Button from "./components/Button";
import Badge from "./components/Badge";
import Card from "./components/Card";
import EmailCard, { EmailCardSkeleton } from "./components/EmailCard";
import { CAMPAIGN_TYPE_COLORS } from "./lib/constants";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://milled-india-api.onrender.com";

// ---- Types ----
interface EmailPreview {
  id: number;
  subject: string;
  brand: string | null;
  type: string | null;
  industry: string | null;
  received_at: string;
}

// ---- Helpers ----
function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return `${Math.floor(days / 7)}w ago`;
}

// ============================================================
// SECTION 1: Hero — Benefit-Driven with Product Preview
// ============================================================
function HeroSection({ emails }: { emails: EmailPreview[] }) {
  return (
    <section
      style={{
        minHeight: "calc(100vh - 68px)",
        background:
          "linear-gradient(180deg, var(--color-surface) 0%, #ffffff 60%)",
        display: "flex",
        alignItems: "center",
        padding: "80px 24px 64px",
      }}
    >
      <div
        className="hero-grid"
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          width: "100%",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 64,
          alignItems: "center",
        }}
      >
        {/* Left — Copy */}
        <div
          style={{
            opacity: 0,
            animation: "fadeInUp 0.6s ease forwards",
          }}
        >
          <Badge variant="accent" style={{ marginBottom: 24 }}>
            The #1 Email Intelligence Platform
          </Badge>
          <h1
            style={{
              fontFamily: "var(--font-dm-serif)",
              fontSize: "clamp(36px, 5vw, 56px)",
              fontWeight: 400,
              color: "var(--color-primary)",
              lineHeight: 1.08,
              letterSpacing: "-0.02em",
              marginBottom: 20,
            }}
          >
            Steal the email playbook of top brands
          </h1>
          <p
            style={{
              fontSize: "clamp(16px, 1.8vw, 18px)",
              color: "var(--color-secondary)",
              lineHeight: 1.6,
              maxWidth: 520,
              marginBottom: 32,
            }}
          >
            See every email from 10,000+ top brands &mdash; subject lines,
            designs, timing, and strategy. Then edit and reuse them as
            your own templates.
          </p>

          <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
            <Button href="/browse" size="lg">
              Browse Emails Free
            </Button>
            <Button href="/pricing" size="lg" variant="ghost">
              See Pricing
            </Button>
          </div>

          <p style={{ fontSize: 13, color: "var(--color-tertiary)" }}>
            Free forever plan &middot; No credit card &middot; 7-day money-back
            on Pro
          </p>
        </div>

        {/* Right — Pinterest Masonry Feed */}
        <div
          className="hero-masonry-wrap"
          style={{
            opacity: 0,
            animation: "fadeInUp 0.6s ease 0.2s forwards",
            maxHeight: 560,
            overflow: "hidden",
            position: "relative",
          }}
        >
          <div
            className="hero-cards"
            style={{
              columns: 2,
              columnGap: 12,
            }}
          >
            {(() => {
              const heights = [420, 340, 360, 400];
              if (emails.length > 0) {
                return emails.slice(0, 4).map((email, i) => (
                  <div key={email.id} style={{ breakInside: "avoid", marginBottom: 12 }}>
                    <EmailCard
                      id={email.id}
                      subject={email.subject}
                      brand={email.brand || undefined}
                      industry={email.industry || undefined}
                      received_at={email.received_at}
                      campaignType={email.type || undefined}
                      previewHeight={heights[i % heights.length]}
                    />
                  </div>
                ));
              }
              return heights.map((h, i) => (
                <div key={i} style={{ breakInside: "avoid", marginBottom: 12 }}>
                  <EmailCardSkeleton previewHeight={h} />
                </div>
              ));
            })()}
          </div>
          {/* Fade-out at bottom for partial visibility effect */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 120,
              background: "linear-gradient(transparent, #ffffff)",
              pointerEvents: "none",
            }}
          />
        </div>
      </div>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
            text-align: center;
          }
          .hero-masonry-wrap {
            max-height: 400px !important;
          }
          .hero-cards {
            columns: 2 !important;
          }
        }
        @media (max-width: 480px) {
          .hero-masonry-wrap {
            max-height: 320px !important;
          }
          .hero-cards {
            columns: 2 !important;
          }
        }
      `}</style>
    </section>
  );
}

// ============================================================
// SECTION 2: Brand Trust Bar — Marquee Social Proof
// ============================================================
function BrandTrustBar({ brands }: { brands: string[] }) {
  if (brands.length === 0) return null;

  const displayBrands = brands.slice(0, 20);
  // Double the list for seamless infinite scroll
  const marqueeItems = [...displayBrands, ...displayBrands];

  return (
    <section
      style={{
        padding: "32px 24px",
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
        Tracking emails from {brands.length}+ brands including
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
            gap: 32,
            width: "max-content",
            animation: "marqueeScroll 30s linear infinite",
          }}
        >
          {marqueeItems.map((brand, i) => (
            <span
              key={`${brand}-${i}`}
              style={{
                fontSize: 14,
                fontWeight: 500,
                color: "var(--color-secondary)",
                whiteSpace: "nowrap",
              }}
            >
              {brand}
            </span>
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
// SECTION 4: Value Pillars — Discover / Analyze / Create
// ============================================================
function ValuePillars() {
  const pillars = [
    {
      icon: (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="#C2714A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="17" cy="17" r="10" />
          <path d="M24 24l8 8" />
          <rect x="12" y="13" width="10" height="2" rx="1" />
          <rect x="12" y="18" width="7" height="2" rx="1" />
        </svg>
      ),
      title: "Spy on any brand\u2019s email strategy",
      description:
        "Search 10,000+ brands by name, industry, or campaign type. See their full email history \u2014 from welcome flows to sale blasts.",
      cta: "Browse by industry",
      href: "/industry",
    },
    {
      icon: (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="#C2714A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="6" y="24" width="6" height="10" rx="1" />
          <rect x="17" y="16" width="6" height="18" rx="1" />
          <rect x="28" y="8" width="6" height="26" rx="1" />
          <path d="M6 8l10-2 10 4 8-4" />
        </svg>
      ),
      title: "Decode what drives conversions",
      description:
        "Subject line analytics, send frequency patterns, campaign type breakdowns. Know when competitors run sales before your team does.",
      cta: "See sample analytics",
      href: "/analytics/sample",
    },
    {
      icon: (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="#C2714A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="6" y="6" width="28" height="28" rx="3" />
          <path d="M14 20l4 4 8-8" />
          <path d="M30 14h4" />
          <path d="M30 20h4" />
          <path d="M30 26h4" />
        </svg>
      ),
      title: "Edit any email as your own template",
      description:
        "Found a campaign you love? Click \u201CUse as Template\u201D to open it in our drag-and-drop editor. Customize text, colors, images \u2014 export ready-to-send HTML.",
      cta: "Try the editor",
      href: "/editor",
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
            Your competitive advantage in 3 steps
          </h2>
          <p
            style={{
              fontSize: 17,
              color: "var(--color-secondary)",
              maxWidth: 500,
              margin: "0 auto",
            }}
          >
            Stop guessing. See exactly what your competitors send, analyze why it works, then make it your own.
          </p>
        </div>

        <div
          className="pillars-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 24,
          }}
        >
          {pillars.map((pillar, idx) => (
            <Card key={idx} padding="lg" hover>
              <div style={{ marginBottom: 20 }}>{pillar.icon}</div>
              <h3
                style={{
                  fontSize: 18,
                  fontWeight: 600,
                  color: "var(--color-primary)",
                  marginBottom: 10,
                }}
              >
                {pillar.title}
              </h3>
              <p
                style={{
                  fontSize: 15,
                  color: "var(--color-secondary)",
                  lineHeight: 1.6,
                  margin: "0 0 16px",
                }}
              >
                {pillar.description}
              </p>
              <Link
                href={pillar.href}
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "var(--color-accent)",
                  textDecoration: "none",
                }}
              >
                {pillar.cta} &rarr;
              </Link>
            </Card>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .pillars-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

// ============================================================
// SECTION 5: Template Editor Showcase
// ============================================================
function EditorShowcase() {
  return (
    <section style={{ padding: "96px 24px", background: "white" }}>
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
        {/* Left — Copy */}
        <div>
          <Badge variant="accent" style={{ marginBottom: 16 }}>
            EXCLUSIVE FEATURE
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
            Don&apos;t just study emails.{" "}
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
            production-ready HTML for Klaviyo, Mailchimp, or any ESP.
          </p>

          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: "0 0 32px",
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            {[
              "Works with any email from our 100,000+ archive",
              "Drag-and-drop \u2014 no code required",
              "Export as HTML or copy to clipboard",
              "Mobile-responsive preview built in",
            ].map((item) => (
              <li
                key={item}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  fontSize: 15,
                  color: "var(--color-secondary)",
                }}
              >
                <span
                  style={{
                    color: "var(--color-accent)",
                    fontSize: 16,
                    fontWeight: 600,
                  }}
                >
                  &#10003;
                </span>
                {item}
              </li>
            ))}
          </ul>

          <Button href="/editor" size="lg">
            Try the Template Editor
          </Button>
        </div>

        {/* Right — Editor Mock */}
        <div
          style={{
            background: "#1C1917",
            borderRadius: 16,
            overflow: "hidden",
            boxShadow:
              "0 20px 40px rgba(0, 0, 0, 0.15), 0 8px 16px rgba(0, 0, 0, 0.1)",
          }}
        >
          {/* Toolbar */}
          <div
            style={{
              padding: "10px 16px",
              borderBottom: "1px solid #333",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <div style={{ display: "flex", gap: 6 }}>
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: "#ff5f57",
                }}
              />
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: "#ffbd2e",
                }}
              />
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: "#28c840",
                }}
              />
            </div>
            <span style={{ fontSize: 12, color: "#888", marginLeft: 8 }}>
              Template Editor
            </span>
          </div>

          {/* Editor content mock */}
          <div style={{ display: "flex" }}>
            {/* Canvas area */}
            <div style={{ flex: 1, padding: 20 }}>
              {/* Mock email being edited */}
              <div
                style={{
                  background: "white",
                  borderRadius: 8,
                  padding: 20,
                  maxWidth: 320,
                  margin: "0 auto",
                }}
              >
                {/* Header */}
                <div
                  style={{
                    background: "var(--color-accent)",
                    borderRadius: 6,
                    padding: "16px 12px",
                    textAlign: "center",
                    marginBottom: 12,
                  }}
                >
                  <div
                    style={{ fontSize: 16, fontWeight: 700, color: "white" }}
                  >
                    SUMMER SALE
                  </div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.8)" }}>
                    Up to 50% off everything
                  </div>
                </div>

                {/* Selected component with accent border */}
                <div
                  style={{
                    border: "2px solid var(--color-accent)",
                    borderRadius: 6,
                    padding: 12,
                    marginBottom: 12,
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: -10,
                      left: 8,
                      background: "var(--color-accent)",
                      color: "white",
                      fontSize: 9,
                      fontWeight: 600,
                      padding: "2px 6px",
                      borderRadius: 3,
                    }}
                  >
                    TEXT
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "#333",
                      lineHeight: 1.5,
                    }}
                  >
                    Shop our biggest sale of the year.
                    <span
                      style={{
                        borderRight: "2px solid var(--color-accent)",
                        animation: "pulse 1s infinite",
                      }}
                    />
                  </div>
                </div>

                {/* CTA button */}
                <div
                  style={{
                    background: "#333",
                    borderRadius: 6,
                    padding: "10px 16px",
                    textAlign: "center",
                    fontSize: 12,
                    fontWeight: 600,
                    color: "white",
                  }}
                >
                  SHOP NOW
                </div>
              </div>
            </div>

            {/* Right sidebar mock */}
            <div
              style={{
                width: 100,
                borderLeft: "1px solid #333",
                padding: "12px 8px",
              }}
            >
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  style={{
                    height: 8,
                    background: "#333",
                    borderRadius: 4,
                    marginBottom: 8,
                    width: `${60 + i * 10}%`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Bottom bar */}
          <div
            style={{
              padding: "8px 16px",
              borderTop: "1px solid #333",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                fontSize: 11,
                background: "var(--color-accent)",
                color: "white",
                padding: "4px 16px",
                borderRadius: 4,
                fontWeight: 500,
              }}
            >
              Use as Template
            </span>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .editor-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
        }
      `}</style>
    </section>
  );
}

// ============================================================
// SECTION 6: Social Proof — Scenario-Based Use Cases
// ============================================================
function SocialProof() {
  const scenarios = [
    {
      role: "Email Marketer, Beauty Brand",
      quote:
        "\u201CI check MailMuse every Monday to see what subject lines Mamaearth and Sugar tested that week. Last month, I adapted their BOGO format and our open rates jumped 23%.\u201D",
    },
    {
      role: "Founder, Fashion Brand",
      quote:
        "\u201CBefore MailMuse, I had no idea Zudio was sending 4 emails per week during sale season. Now I match their cadence and our revenue from email is up 2x.\u201D",
    },
    {
      role: "Marketing Manager, Electronics",
      quote:
        "\u201CThe campaign calendar alone is worth Pro. I can see every competitor\u2019s festive campaign timeline and plan ours a month ahead.\u201D",
    },
    {
      role: "Freelance Copywriter",
      quote:
        "\u201CI use the template editor to pitch clients. I pull a competitor\u2019s email, customize it with the client\u2019s brand, and share the HTML. Closes deals every time.\u201D",
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
            How marketers use MailMuse
          </h2>
          <p
            style={{
              fontSize: 17,
              color: "var(--color-secondary)",
              maxWidth: 500,
              margin: "0 auto",
            }}
          >
            Real use cases from the marketers, founders, and copywriters who use MailMuse daily.
          </p>
        </div>

        <div
          className="social-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 24,
          }}
        >
          {scenarios.map((scenario, idx) => (
            <div
              key={idx}
              style={{
                background: "white",
                borderRadius: 14,
                padding: 28,
                borderLeft: "4px solid var(--color-accent)",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)",
              }}
            >
              <Badge
                variant="accent"
                size="sm"
                style={{ marginBottom: 16 }}
              >
                {scenario.role}
              </Badge>
              <p
                style={{
                  fontSize: 15,
                  color: "var(--color-primary)",
                  lineHeight: 1.7,
                  fontStyle: "italic",
                  margin: "0 0 12px",
                }}
              >
                {scenario.quote}
              </p>
              <p
                style={{
                  fontSize: 11,
                  color: "var(--color-tertiary)",
                  fontStyle: "italic",
                  margin: 0,
                }}
              >
                Composite scenario based on common use cases
              </p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .social-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

// ============================================================
// SECTION 7: Pricing Anchor
// ============================================================
function PricingAnchor() {
  const plans = [
    {
      name: "Free",
      price: "0",
      period: "/forever",
      features: ["Last 30 days of emails", "20 email views/day", "5 brand pages/day", "Basic search"],
      cta: "Get Started Free",
      ctaHref: "/signup",
      variant: "secondary" as const,
      highlight: false,
    },
    {
      name: "Starter",
      price: "599",
      period: "/mo",
      annual: "5,999/yr",
      features: ["6 months of emails", "75 email views/day", "Advanced search", "3 HTML exports/mo"],
      cta: "Start Starter",
      ctaHref: "/pricing",
      variant: "secondary" as const,
      highlight: false,
    },
    {
      name: "Pro",
      price: "1,599",
      period: "/mo",
      annual: "15,999/yr",
      savings: "Save 17%",
      features: ["Full email archive", "Unlimited views & analytics", "Campaign calendar & alerts", "Template editor & export"],
      cta: "Start Pro Plan",
      ctaHref: "/pricing",
      variant: "primary" as const,
      highlight: true,
    },
    {
      name: "Agency",
      price: "3,999",
      period: "/mo",
      annual: "39,999/yr",
      features: ["Everything in Pro", "10 team seats", "Bulk export & reports", "Unlimited AI generator"],
      cta: "Start Agency",
      ctaHref: "/pricing",
      variant: "secondary" as const,
      highlight: false,
    },
  ];

  return (
    <section style={{ padding: "96px 24px", background: "white" }}>
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
            Start free. Scale when you&apos;re ready.
          </h2>
          <p style={{ fontSize: 17, color: "var(--color-secondary)", margin: "0 0 8px" }}>
            Every new account gets 7 days of full Starter access &mdash; no credit card required.
          </p>
        </div>

        <div
          className="pricing-anchor-grid"
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
                padding: 24,
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
              <h3
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  color: "var(--color-primary)",
                  margin: "0 0 4px",
                }}
              >
                {plan.name}
              </h3>
              <div style={{ marginBottom: 4 }}>
                <span style={{ fontSize: 28, fontWeight: 700, color: "var(--color-primary)" }}>
                  &#8377;{plan.price}
                </span>
                <span style={{ fontSize: 13, color: "var(--color-secondary)" }}>
                  {plan.period}
                </span>
              </div>
              {plan.annual && (
                <p style={{ fontSize: 11, color: "var(--color-secondary)", margin: "0 0 12px" }}>
                  &#8377;{plan.annual}
                  {plan.savings && (
                    <span style={{
                      marginLeft: 6,
                      color: "#16a34a",
                      fontWeight: 600,
                      background: "#dcfce7",
                      padding: "2px 6px",
                      borderRadius: 4,
                      fontSize: 10,
                    }}>
                      {plan.savings}
                    </span>
                  )}
                </p>
              )}
              {!plan.annual && <div style={{ height: 12 }} />}
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: "0 0 16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                }}
              >
                {plan.features.map((item) => (
                  <li
                    key={item}
                    style={{
                      fontSize: 12,
                      color: "var(--color-secondary)",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <span style={{ color: plan.highlight ? "var(--color-accent)" : "#22c55e", fontSize: 12 }}>&#10003;</span>
                    {item}
                  </li>
                ))}
              </ul>
              <Button
                href={plan.ctaHref}
                variant={plan.variant}
                fullWidth
              >
                {plan.cta}
              </Button>
              {plan.highlight && (
                <p style={{ fontSize: 11, color: "var(--color-tertiary)", textAlign: "center", marginTop: 8, marginBottom: 0 }}>
                  7-day money-back guarantee
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .pricing-anchor-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 520px) {
          .pricing-anchor-grid {
            grid-template-columns: 1fr !important;
          }
          .pricing-anchor-grid > div:nth-child(3) {
            order: -1;
          }
        }
      `}</style>
    </section>
  );
}

// ============================================================
// SECTION 8: Urgency Strip
// ============================================================
function UrgencyStrip({
  totalEmails,
  brandCount,
}: {
  totalEmails: number;
  brandCount: number;
}) {
  return (
    <section
      style={{
        padding: "40px 24px",
        background: "var(--color-primary)",
        textAlign: "center",
      }}
    >
      <p
        style={{
          fontSize: 18,
          fontWeight: 600,
          color: "white",
          marginBottom: 8,
        }}
      >
        New emails added every day. Your competitors are already watching.
      </p>
      <p
        style={{
          fontSize: 14,
          color: "rgba(255, 255, 255, 0.7)",
          marginBottom: 24,
        }}
      >
        {totalEmails.toLocaleString()}+ emails and counting &mdash; with{" "}
        {brandCount}+ brands sending new campaigns daily
      </p>
      <Button href="/browse" variant="secondary" size="lg">
        Browse Latest Emails
      </Button>
    </section>
  );
}

// ============================================================
// SECTION 9: Final CTA
// ============================================================
function FinalCTA() {
  return (
    <section
      style={{
        padding: "96px 24px",
        background: "var(--color-surface)",
        textAlign: "center",
      }}
    >
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
          Your email strategy shouldn&apos;t be based on guesswork
        </h2>
        <p
          style={{
            fontSize: 17,
            color: "var(--color-secondary)",
            marginBottom: 32,
            lineHeight: 1.6,
          }}
        >
          Join marketers at top brands who use MailMuse to
          write better emails, send smarter campaigns, and outperform
          competitors.
        </p>
        <Button href="/browse" size="lg">
          Start Exploring Free
        </Button>
        <p style={{ marginTop: 20, fontSize: 13, color: "var(--color-tertiary)" }}>
          Free forever plan &middot; No credit card required &middot; Takes 10
          seconds to start
        </p>
      </div>
    </section>
  );
}

// ============================================================
// SECTION 10: Footer
// ============================================================
function Footer() {
  const links = [
    { label: "Browse", href: "/browse" },
    { label: "Brands", href: "/brand" },
    { label: "Industries", href: "/industry" },
    { label: "Pricing", href: "/pricing" },
    { label: "Blog", href: "/blog" },
  ];

  return (
    <footer
      style={{
        padding: "48px 24px",
        background: "#0f172a",
        color: "white",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 24,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Logo size={32} />
          <span
            style={{
              fontFamily: "var(--font-dm-serif)",
              fontSize: 18,
              color: "white",
            }}
          >
            Mail{" "}
            <em style={{ fontStyle: "italic", color: "#E8A882" }}>Muse</em>
          </span>
        </div>

        <nav style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                fontSize: 13,
                color: "rgba(255, 255, 255, 0.6)",
                textDecoration: "none",
                transition: "color 150ms ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "white";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "rgba(255, 255, 255, 0.6)";
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <p style={{ fontSize: 13, color: "rgba(255, 255, 255, 0.4)" }}>
          &copy; 2026 MailMuse. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

// ============================================================
// MAIN COMPONENT — Named Export
// ============================================================
export function HomeClient() {
  const [recentEmails, setRecentEmails] = useState<EmailPreview[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [totalEmails, setTotalEmails] = useState<number>(100000);

  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE}/emails?limit=8`).then((r) =>
        r.ok ? r.json() : []
      ),
      fetch(`${API_BASE}/brands`).then((r) => (r.ok ? r.json() : [])),
      fetch(`${API_BASE}/emails/count`).then((r) =>
        r.ok ? r.json() : { total: 100000 }
      ),
    ])
      .then(([emails, brandsData, countData]) => {
        setRecentEmails(
          (emails as EmailPreview[]).slice(0, 8)
        );
        setBrands(brandsData as string[]);
        setTotalEmails(Math.max((countData as { total: number }).total || 100000, 100000));
      })
      .catch(() => {});
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-surface)" }}>
      <Header transparent />
      <HeroSection emails={recentEmails.slice(0, 4)} />
      <BrandTrustBar brands={brands} />
      <ValuePillars />
      <EditorShowcase />
      <SocialProof />
      <PricingAnchor />
      <UrgencyStrip
        totalEmails={totalEmails}
        brandCount={Math.max(brands.length, 10000)}
      />
      <FinalCTA />
      <Footer />
    </div>
  );
}
