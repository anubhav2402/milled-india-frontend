"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Header from "./components/Header";
import Button from "./components/Button";
import EmailCard, { EmailCardSkeleton } from "./components/EmailCard";

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

// ---- Scroll animation hook ----
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, isVisible };
}

// ============================================================
// SECTION 1: Hero — Floating Brand Logos + Global Copy
// ============================================================
const HERO_BRANDS = [
  { name: "Net-A-Porter", domain: "net-a-porter.com", top: "6%", left: "4%", delay: 0.2, size: 80 },
  { name: "Calvin Klein", domain: "calvinklein.com", top: "14%", right: "5%", delay: 0.5, size: 76 },
  { name: "Balenciaga", domain: "balenciaga.com", top: "10%", left: "16%", delay: 0.3, size: 84 },
  { name: "Nykaa", domain: "nykaa.com", top: "60%", right: "3%", delay: 1.0, size: 80 },
  { name: "Zomato", domain: "zomato.com", top: "50%", left: "2%", delay: 0.8, size: 72 },
  { name: "Fossil", domain: "fossil.com", top: "72%", left: "8%", delay: 1.1, size: 76 },
  { name: "Givenchy", domain: "givenchy.com", top: "38%", right: "2%", delay: 0.4, size: 80 },
  { name: "Uniqlo", domain: "uniqlo.com", top: "30%", left: "6%", delay: 0.6, size: 72 },
  { name: "Allbirds", domain: "allbirds.com", top: "76%", right: "10%", delay: 0.9, size: 76 },
  { name: "Reformation", domain: "thereformation.com", top: "22%", right: "14%", delay: 0.7, size: 68 },
  { name: "AJIO", domain: "ajio.com", top: "45%", left: "14%", delay: 1.2, size: 72 },
  { name: "Urban Decay", domain: "urbandecay.com", top: "65%", left: "16%", delay: 1.3, size: 68 },
  { name: "Mango", domain: "mango.com", top: "82%", right: "6%", delay: 1.4, size: 76 },
  { name: "Anthropologie", domain: "anthropologie.com", top: "55%", right: "12%", delay: 1.0, size: 72 },
  { name: "Mytheresa", domain: "mytheresa.com", top: "18%", left: "10%", delay: 1.5, size: 64 },
  { name: "Bombas", domain: "bombas.com", top: "85%", left: "18%", delay: 1.6, size: 68 },
  { name: "Innisfree", domain: "innisfree.com", top: "35%", right: "16%", delay: 1.1, size: 64 },
  { name: "Bobbi Brown", domain: "bobbibrown.com", top: "70%", right: "18%", delay: 1.7, size: 72 },
];

function HeroSection() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <section
      style={{
        background: "linear-gradient(180deg, var(--color-surface) 0%, #ffffff 100%)",
        padding: "140px 24px 100px",
        position: "relative",
        overflow: "hidden",
        minHeight: 600,
      }}
    >
      {/* Floating brand logos */}
      {HERO_BRANDS.map((b) => (
        <div
          key={b.name}
          className="hero-brand-bubble"
          style={{
            position: "absolute",
            top: b.top,
            left: b.left,
            right: (b as Record<string, unknown>).right as string | undefined,
            width: b.size,
            height: b.size,
            borderRadius: "50%",
            background: "white",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: mounted ? 1 : 0,
            transform: mounted ? "scale(1)" : "scale(0)",
            transition: `all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${b.delay}s`,
            zIndex: 1,
            animation: mounted ? `floatBubble ${3 + b.delay}s ease-in-out ${b.delay + 0.5}s infinite` : "none",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://www.google.com/s2/favicons?domain=${b.domain}&sz=128`}
            alt={b.name}
            width={b.size * 0.55}
            height={b.size * 0.55}
            style={{ borderRadius: 6 }}
          />
        </div>
      ))}

      <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 2 }}>
        <h1
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(36px, 5.5vw, 56px)",
            fontWeight: 600,
            color: "var(--color-primary)",
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            marginBottom: 20,
          }}
        >
          Email inspiration & research
          <br />
          for <span style={{ color: "var(--color-accent)" }}>high-performing teams</span>
        </h1>

        <p
          style={{
            fontSize: "clamp(17px, 2vw, 20px)",
            color: "var(--color-secondary)",
            lineHeight: 1.5,
            marginBottom: 36,
            maxWidth: 560,
            margin: "0 auto 36px",
          }}
        >
          The all-in-one platform to find, save, and analyze the web&apos;s best emails.
          Featuring <strong>100,000+ curated emails</strong> with new brands added daily.
        </p>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Button href="/signup" size="lg">
            Join for free
          </Button>
          <Button href="/browse" size="lg" variant="outline">
            Browse Email Templates
          </Button>
        </div>

        <p style={{ fontSize: 13, color: "var(--color-tertiary)", marginTop: 14 }}>
          Free forever &middot; No credit card &middot; 7-day Starter trial included
        </p>
      </div>

      <style>{`
        @keyframes floatBubble {
          0%, 100% { transform: scale(1) translateY(0); }
          50% { transform: scale(1) translateY(-8px); }
        }
        @media (max-width: 768px) {
          .hero-brand-bubble { display: none !important; }
        }
      `}</style>
    </section>
  );
}

// ============================================================
// SECTION 2: Platform Description — What MailMuse Does
// ============================================================
function PlatformDescription() {
  const { ref, isVisible } = useInView(0.2);

  const pillars = [
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
        </svg>
      ),
      title: "Find & browse",
      desc: "Search 100K+ emails by brand, industry, or campaign type. No more subscribing to competitor lists with a junk inbox.",
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
        </svg>
      ),
      title: "AI-powered analysis",
      desc: "Every email is scored by AI across 5 dimensions — Subject Line, Copy, CTA, Design, and Strategy — with an overall grade and actionable insights.",
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
      ),
      title: "Edit & export templates",
      desc: "Open any email in our drag-and-drop editor. Change text, swap images, update colors — export production-ready HTML in one click.",
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
        </svg>
      ),
      title: "Save & organize",
      desc: "Bookmark emails, create collections, and build swipe files. Share inspiration boards with your entire team.",
    },
  ];

  return (
    <section ref={ref} style={{ padding: "96px 24px", background: "white" }}>
      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
          textAlign: "center",
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(40px)",
          transition: "all 0.7s ease-out",
        }}
      >
        <h2
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(28px, 4vw, 40px)",
            fontWeight: 600,
            color: "var(--color-primary)",
            letterSpacing: "-0.02em",
            lineHeight: 1.15,
            marginBottom: 16,
          }}
        >
          Stop tracking competitors with your inbox
        </h2>
        <p
          style={{
            fontSize: 18,
            color: "var(--color-secondary)",
            lineHeight: 1.6,
            maxWidth: 640,
            margin: "0 auto 56px",
          }}
        >
          MailMuse automatically captures, organizes, and analyzes emails from 10,000+ brands
          so you can focus on creating campaigns that convert.
        </p>

        <div
          className="pillars-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 32,
            textAlign: "left",
          }}
        >
          {pillars.map((p, i) => (
            <div
              key={p.title}
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(30px)",
                transition: `all 0.6s ease-out ${0.2 + i * 0.15}s`,
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: "var(--color-accent-light)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 16,
                }}
              >
                {p.icon}
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: "var(--color-primary)", marginBottom: 8 }}>
                {p.title}
              </h3>
              <p style={{ fontSize: 15, color: "var(--color-secondary)", lineHeight: 1.6, margin: 0 }}>
                {p.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 960px) {
          .pillars-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 640px) {
          .pillars-grid {
            grid-template-columns: 1fr !important;
            gap: 28px !important;
            max-width: 400px !important;
            margin: 0 auto !important;
          }
        }
      `}</style>
    </section>
  );
}

// ============================================================
// SECTION 3: Video / Demo Section
// ============================================================
function DemoSection() {
  const { ref, isVisible } = useInView(0.1);
  const [step, setStep] = useState(0);

  // Auto-advance demo steps
  useEffect(() => {
    if (!isVisible) return;
    const timer = setInterval(() => {
      setStep((s) => (s + 1) % 4);
    }, 3000);
    return () => clearInterval(timer);
  }, [isVisible]);

  const steps = [
    { label: "Search", desc: "Search by brand, industry, or keyword" },
    { label: "Browse", desc: "Explore thousands of real email campaigns" },
    { label: "Analyze", desc: "AI scores every email on 5 dimensions" },
    { label: "Export", desc: "Edit and export as production-ready HTML" },
  ];

  return (
    <section ref={ref} style={{ padding: "96px 24px", background: "var(--color-surface)" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <div
          style={{
            textAlign: "center",
            marginBottom: 48,
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(30px)",
            transition: "all 0.6s ease-out",
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(28px, 4vw, 36px)",
              fontWeight: 600,
              color: "var(--color-primary)",
              letterSpacing: "-0.02em",
              marginBottom: 12,
            }}
          >
            See MailMuse in action
          </h2>
          <p style={{ fontSize: 17, color: "var(--color-secondary)" }}>
            From research to ready-to-send in under 2 minutes
          </p>
        </div>

        {/* Step indicator pills */}
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 24 }}>
          {steps.map((s, i) => (
            <button
              key={s.label}
              onClick={() => setStep(i)}
              style={{
                padding: "8px 20px",
                borderRadius: 20,
                border: "none",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.3s ease",
                background: step === i ? "var(--color-accent)" : "var(--color-border)",
                color: step === i ? "white" : "var(--color-secondary)",
              }}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div
          style={{
            borderRadius: 20,
            overflow: "hidden",
            boxShadow: "0 20px 60px rgba(0,0,0,0.12)",
            background: "#1C1917",
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "scale(1)" : "scale(0.95)",
            transition: "all 0.7s ease-out 0.2s",
          }}
        >
          {/* Browser chrome */}
          <div style={{ padding: "10px 16px", borderBottom: "1px solid #333", display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ display: "flex", gap: 6 }}>
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ff5f57" }} />
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ffbd2e" }} />
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#28c840" }} />
            </div>
            <div style={{ flex: 1, background: "#2a2725", borderRadius: 6, padding: "5px 12px", fontSize: 12, color: "#888", marginLeft: 8 }}>
              mailmuse.in/{step === 0 ? "browse" : step === 1 ? "browse?q=nykaa" : step === 2 ? "email/4521" : "editor"}
            </div>
          </div>

          {/* Animated demo screens */}
          <div style={{ height: 420, position: "relative", overflow: "hidden" }}>
            {/* Step 0: Search */}
            <div style={{ position: "absolute", inset: 0, padding: 32, opacity: step === 0 ? 1 : 0, transition: "opacity 0.5s ease", pointerEvents: step === 0 ? "auto" : "none" }}>
              <div style={{ background: "#2a2725", borderRadius: 10, padding: "12px 16px", display: "flex", alignItems: "center", gap: 10, marginBottom: 20, maxWidth: 500 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
                <span className="demo-typing" style={{ fontSize: 14, color: "#ccc" }}>nykaa sale emails...</span>
              </div>
              <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
                {["All Types", "Sale", "Welcome", "Newsletter", "Cart Recovery"].map((t, i) => (
                  <span key={t} style={{ fontSize: 11, padding: "4px 12px", borderRadius: 12, background: i === 1 ? "rgba(194,113,74,0.2)" : "#333", color: i === 1 ? "#E8956E" : "#888" }}>{t}</span>
                ))}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
                {[{ c: "#2d4a3e", b: "Nykaa" }, { c: "#4a2d3e", b: "Sephora" }, { c: "#3e3a2d", b: "Fossil" }, { c: "#2d3a4a", b: "Mango" }].map((e) => (
                  <div key={e.b} style={{ background: "#2a2725", borderRadius: 8, overflow: "hidden" }}>
                    <div style={{ height: 120, background: e.c }} />
                    <div style={{ padding: 8 }}>
                      <div style={{ fontSize: 10, color: "#aaa", marginBottom: 4 }}>{e.b}</div>
                      <div style={{ height: 3, background: "#444", borderRadius: 2, width: "80%" }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 1: Browse results */}
            <div style={{ position: "absolute", inset: 0, padding: 32, opacity: step === 1 ? 1 : 0, transition: "opacity 0.5s ease", pointerEvents: step === 1 ? "auto" : "none" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: "white", marginBottom: 4 }}>Nykaa</div>
                  <div style={{ fontSize: 11, color: "#888" }}>116 emails &middot; Beauty &middot; Last sent 2 days ago</div>
                </div>
                <span style={{ fontSize: 11, padding: "4px 12px", borderRadius: 12, background: "rgba(194,113,74,0.2)", color: "#E8956E" }}>Following</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                {[
                  { t: "Flash Sale - 50% Off!", c: "#4a2d3e", type: "Sale" },
                  { t: "New Arrivals Just Dropped", c: "#2d4a3e", type: "New Arrival" },
                  { t: "Your Cart is Waiting", c: "#3e3a2d", type: "Cart Recovery" },
                  { t: "Welcome to Nykaa!", c: "#2d3a4a", type: "Welcome" },
                  { t: "Beauty Awards Winners", c: "#4a3e2d", type: "Newsletter" },
                  { t: "Last Chance: Mega Sale", c: "#3a2d4a", type: "Sale" },
                ].map((e) => (
                  <div key={e.t} style={{ background: "#2a2725", borderRadius: 8, overflow: "hidden" }}>
                    <div style={{ height: 80, background: e.c, position: "relative" }}>
                      <span style={{ position: "absolute", top: 4, left: 4, fontSize: 9, padding: "2px 6px", borderRadius: 4, background: "rgba(0,0,0,0.5)", color: "#ccc" }}>{e.type}</span>
                    </div>
                    <div style={{ padding: 6 }}>
                      <div style={{ fontSize: 10, color: "#ccc", lineHeight: 1.3 }}>{e.t}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 2: AI Analysis */}
            <div style={{ position: "absolute", inset: 0, padding: 32, opacity: step === 2 ? 1 : 0, transition: "opacity 0.5s ease", pointerEvents: step === 2 ? "auto" : "none" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "white", marginBottom: 4 }}>Flash Sale - 50% Off!</div>
                  <div style={{ fontSize: 11, color: "#888", marginBottom: 16 }}>Nykaa &middot; Sale Campaign &middot; Sent Dec 15</div>
                  <div style={{ background: "#2a2725", borderRadius: 10, height: 220, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ background: "#4a2d3e", borderRadius: 6, width: "80%", height: "85%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#888" }}>
                      Email Preview
                    </div>
                  </div>
                </div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                    <div style={{ width: 60, height: 60, borderRadius: "50%", border: "3px solid #10b981", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontSize: 22, fontWeight: 700, color: "white", lineHeight: 1 }}>87</span>
                      <span style={{ fontSize: 10, color: "#10b981", fontWeight: 600 }}>A</span>
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "white" }}>Overall Score</div>
                      <div style={{ fontSize: 11, color: "#10b981" }}>High-performing email</div>
                    </div>
                  </div>
                  {[
                    { label: "Subject Line", pct: 92, grade: "A" },
                    { label: "Copy Quality", pct: 78, grade: "B+" },
                    { label: "CTA Effectiveness", pct: 90, grade: "A" },
                    { label: "Design & Layout", pct: 72, grade: "B" },
                    { label: "Strategy", pct: 85, grade: "A-" },
                  ].map((d) => (
                    <div key={d.label} style={{ marginBottom: 10 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                        <span style={{ fontSize: 11, color: "#aaa" }}>{d.label}</span>
                        <span style={{ fontSize: 11, color: "white", fontWeight: 600 }}>{d.grade} &middot; {d.pct}%</span>
                      </div>
                      <div style={{ height: 5, background: "#333", borderRadius: 3 }}>
                        <div
                          className="demo-bar"
                          style={{
                            height: "100%",
                            width: step === 2 ? `${d.pct}%` : "0%",
                            background: d.pct >= 85 ? "#10b981" : d.pct >= 70 ? "#3b82f6" : "#f59e0b",
                            borderRadius: 3,
                            transition: "width 1s ease-out 0.3s",
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Step 3: Template Editor */}
            <div style={{ position: "absolute", inset: 0, padding: 32, opacity: step === 3 ? 1 : 0, transition: "opacity 0.5s ease", pointerEvents: step === 3 ? "auto" : "none" }}>
              <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 16, height: "100%" }}>
                {/* Sidebar */}
                <div style={{ background: "#2a2725", borderRadius: 10, padding: 12 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "#888", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 12 }}>Components</div>
                  {["Header", "Hero Image", "Body Text", "CTA Button", "Footer"].map((c, i) => (
                    <div key={c} style={{ padding: "8px 10px", borderRadius: 6, fontSize: 12, color: i === 3 ? "white" : "#888", background: i === 3 ? "rgba(194,113,74,0.2)" : "transparent", marginBottom: 4, cursor: "pointer" }}>
                      {c}
                    </div>
                  ))}
                  <div style={{ marginTop: 16, borderTop: "1px solid #333", paddingTop: 12 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: "#888", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>Export</div>
                    <div style={{ padding: "8px 12px", borderRadius: 6, background: "#C2714A", color: "white", fontSize: 12, fontWeight: 600, textAlign: "center" }}>
                      Download HTML
                    </div>
                  </div>
                </div>
                {/* Canvas */}
                <div style={{ background: "white", borderRadius: 10, padding: 16, overflow: "hidden" }}>
                  <div style={{ background: "#C2714A", borderRadius: 6, padding: "20px 16px", textAlign: "center", marginBottom: 12 }}>
                    <div style={{ fontSize: 18, fontWeight: 700, color: "white" }}>FLASH SALE</div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.8)" }}>Up to 50% off everything</div>
                  </div>
                  <div style={{ background: "#f0f0f0", borderRadius: 6, height: 100, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12, fontSize: 12, color: "#888" }}>
                    Hero Image
                  </div>
                  <div style={{ fontSize: 12, color: "#333", lineHeight: 1.5, marginBottom: 12, padding: "0 4px" }}>
                    Shop our biggest sale of the year. Exclusive deals across beauty, skincare, and wellness...
                  </div>
                  <div style={{ background: "#333", borderRadius: 5, padding: "10px 20px", textAlign: "center", fontSize: 12, fontWeight: 600, color: "white", maxWidth: 160, margin: "0 auto" }}>
                    SHOP NOW
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Step description */}
        <p style={{ textAlign: "center", fontSize: 15, color: "var(--color-secondary)", marginTop: 20, minHeight: 24 }}>
          {steps[step].desc}
        </p>
      </div>

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .demo-typing::after {
          content: '|';
          animation: blink 1s step-end infinite;
          color: var(--color-accent);
        }
      `}</style>
    </section>
  );
}


// ============================================================
// SECTION 5-7: Feature Rows with Scroll Animations
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
  const { ref, isVisible } = useInView(0.15);
  const textFrom = direction === "left" ? "-40px" : "40px";
  const visualFrom = direction === "left" ? "40px" : "-40px";

  return (
    <section ref={ref} style={{ padding: "96px 24px", background: bg }}>
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
        <div
          style={{
            order: direction === "left" ? 1 : 2,
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateX(0)" : `translateX(${textFrom})`,
            transition: "all 0.7s ease-out",
          }}
        >
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
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(26px, 3.5vw, 36px)",
              fontWeight: 600,
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
            style={{ fontSize: 15, fontWeight: 600, color: "var(--color-accent)", textDecoration: "none" }}
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
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateX(0)" : `translateX(${visualFrom})`,
            transition: "all 0.7s ease-out 0.15s",
          }}
        >
          {visual}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// SECTION 8: Horizontal Email Carousel
// ============================================================
function EmailCarousel({ emails }: { emails: EmailPreview[] }) {
  const { ref: sectionRef, isVisible } = useInView(0.1);

  // Split emails into two rows
  const mid = Math.ceil(emails.length / 2);
  const row1Emails = emails.slice(0, mid);
  const row2Emails = emails.slice(mid);

  // Duplicate for seamless loop
  const displayRow1 = row1Emails.length > 0 ? [...row1Emails, ...row1Emails] : [];
  const displayRow2 = row2Emails.length > 0 ? [...row2Emails, ...row2Emails] : [];

  const renderRow = (
    displayEmails: EmailPreview[],
    className: string,
    animationName: string,
    duration: string,
  ) => (
    <div
      style={{
        position: "relative",
        maskImage: "linear-gradient(to right, transparent, black 5%, black 95%, transparent)",
        WebkitMaskImage: "linear-gradient(to right, transparent, black 5%, black 95%, transparent)",
        opacity: isVisible ? 1 : 0,
        transition: "opacity 0.7s ease-out 0.2s",
      }}
    >
      <div
        className={className}
        style={{
          display: "flex",
          gap: 16,
          width: "max-content",
          animation: `${animationName} ${duration} linear infinite`,
        }}
      >
        {displayEmails.length === 0
          ? Array.from({ length: 16 }).map((_, i) => (
              <div key={i} style={{ width: 260, flexShrink: 0 }}>
                <EmailCardSkeleton />
              </div>
            ))
          : displayEmails.map((email, i) => (
              <div key={`${email.id}-${i}`} style={{ width: 260, flexShrink: 0 }}>
                <EmailCard
                  id={email.id}
                  subject={email.subject}
                  brand={email.brand || undefined}
                  industry={email.industry || undefined}
                  received_at={email.received_at}
                  campaignType={email.type || undefined}
                  logoUrl={logoUrlFromSender(email.sender)}
                  compact
                  previewHeight={240}
                />
              </div>
            ))}
      </div>
    </div>
  );

  return (
    <section
      ref={sectionRef}
      style={{
        padding: "96px 0",
        background: "var(--color-surface)",
        overflow: "hidden",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        <div
          style={{
            textAlign: "center",
            marginBottom: 40,
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.6s ease-out",
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(28px, 4vw, 36px)",
              fontWeight: 600,
              color: "var(--color-primary)",
              letterSpacing: "-0.02em",
              marginBottom: 8,
            }}
          >
            Browse the latest emails
          </h2>
          <p style={{ fontSize: 16, color: "var(--color-secondary)", margin: 0 }}>
            Updated daily with 1,000+ new emails from top brands
          </p>
        </div>
      </div>

      {/* Row 1: scrolls left */}
      {renderRow(displayRow1, "email-marquee-row1", "emailMarqueeLeft", "45s")}

      {/* Row 2: scrolls right, offset start */}
      <div style={{ marginTop: 16 }}>
        {renderRow(displayRow2, "email-marquee-row2", "emailMarqueeRight", "50s")}
      </div>

      <div style={{ textAlign: "center", marginTop: 40 }}>
        <Button href="/browse" variant="outline" size="lg">
          Browse All Emails
        </Button>
      </div>

      <style>{`
        @keyframes emailMarqueeLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes emailMarqueeRight {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .email-marquee-row1:hover { animation-play-state: paused; }
        .email-marquee-row2:hover { animation-play-state: paused; }
      `}</style>
    </section>
  );
}

// ============================================================
// SECTION 9: Pricing
// ============================================================
function PricingAnchor() {
  const { ref, isVisible } = useInView(0.1);
  const plans = [
    {
      name: "Free", price: "0", period: "/forever",
      features: ["Last 30 days of emails", "20 email views/day", "5 brand pages/day", "Basic search"],
      cta: "Create Free Account", ctaHref: "/signup",
      variant: "secondary" as const, highlight: false,
    },
    {
      name: "Starter", price: "9", period: "/mo", annual: "89/yr", savings: "Save 18%",
      features: ["6 months of emails", "75 email views/day", "Advanced filters", "Edit + 3 template exports"],
      cta: "Start 7-Day Trial", ctaHref: "/pricing",
      variant: "secondary" as const, highlight: false,
    },
    {
      name: "Pro", price: "19", period: "/mo", annual: "189/yr", savings: "Save 17%",
      features: ["Full email archive", "Unlimited views & analytics", "Campaign calendar & alerts", "Template editor & AI generator"],
      cta: "Start 7-Day Trial", ctaHref: "/pricing",
      variant: "primary" as const, highlight: true,
    },
    {
      name: "Agency", price: "49", period: "/mo", annual: "489/yr",
      features: ["Everything in Pro", "10 team seats", "Unlimited brand alerts", "Unlimited AI generator"],
      cta: "Contact Sales", ctaHref: "/pricing",
      variant: "secondary" as const, highlight: false,
    },
  ];

  return (
    <section ref={ref} style={{ padding: "96px 24px", background: "white" }}>
      <div
        style={{
          maxWidth: 1100, margin: "0 auto",
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(30px)",
          transition: "all 0.7s ease-out",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <h2
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(28px, 4vw, 36px)",
              fontWeight: 600, color: "var(--color-primary)",
              letterSpacing: "-0.02em", marginBottom: 12,
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
            background: "var(--color-accent-light)", borderRadius: 10,
            padding: "10px 20px", textAlign: "center", fontSize: 13,
            fontWeight: 500, color: "var(--color-accent-hover)",
            maxWidth: 480, margin: "0 auto 32px",
          }}
        >
          7-day Starter trial included with every new account
        </div>

        <div className="pricing-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          {plans.map((plan, i) => (
            <div
              key={plan.name}
              style={{
                border: plan.highlight ? "2px solid var(--color-accent)" : "1px solid var(--color-border)",
                borderRadius: 16, padding: 28, background: "white", position: "relative",
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(20px)",
                transition: `all 0.5s ease-out ${0.1 + i * 0.1}s`,
              }}
            >
              {plan.highlight && (
                <div
                  style={{
                    position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)",
                    background: "linear-gradient(135deg, var(--color-accent), var(--color-accent-hover))",
                    color: "white", fontSize: 11, fontWeight: 600,
                    padding: "4px 14px", borderRadius: 20, whiteSpace: "nowrap",
                  }}
                >
                  MOST POPULAR
                </div>
              )}
              <h3 style={{ fontSize: 16, fontWeight: 600, color: "var(--color-primary)", margin: "0 0 4px" }}>{plan.name}</h3>
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
              <Button href={plan.ctaHref} variant={plan.variant} fullWidth>{plan.cta}</Button>
              {plan.highlight && (
                <p style={{ fontSize: 11, color: "var(--color-tertiary)", textAlign: "center", marginTop: 8, marginBottom: 0 }}>7-day money-back guarantee</p>
              )}
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: 20 }}>
          <Link href="/pricing" style={{ fontSize: 14, fontWeight: 500, color: "var(--color-accent)", textDecoration: "none" }}>
            See full feature comparison &rarr;
          </Link>
        </div>
      </div>

      <style>{`
        @media (max-width: 960px) { .pricing-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 640px) {
          .pricing-grid { grid-template-columns: 1fr !important; max-width: 400px !important; margin: 0 auto !important; }
          .pricing-grid > div:nth-child(3) { order: -1; }
        }
      `}</style>
    </section>
  );
}

// ============================================================
// SECTION 10: Final CTA
// ============================================================
function FinalCTA() {
  const { ref, isVisible } = useInView(0.2);

  return (
    <section ref={ref} style={{ padding: "96px 24px", background: "var(--color-surface)", textAlign: "center" }}>
      <div
        style={{
          maxWidth: 600, margin: "0 auto",
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(30px)",
          transition: "all 0.7s ease-out",
        }}
      >
        <h2
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(28px, 4vw, 36px)",
            fontWeight: 600, color: "var(--color-primary)",
            letterSpacing: "-0.02em", marginBottom: 16,
          }}
        >
          Your next email campaign starts here
        </h2>
        <p style={{ fontSize: 17, color: "var(--color-secondary)", marginBottom: 32, lineHeight: 1.6 }}>
          Join thousands of marketers who research smarter, create faster,
          and send better emails with MailMuse.
        </p>
        <Button href="/signup" size="lg">
          Create Your Free Account
        </Button>
        <p style={{ marginTop: 20, fontSize: 13, color: "var(--color-tertiary)" }}>
          Free forever plan &middot; No credit card required &middot; Takes 10 seconds to start
        </p>

        <div
          className="trust-signals"
          style={{
            display: "flex", gap: 24, justifyContent: "center",
            marginTop: 32, paddingTop: 32, borderTop: "1px solid var(--color-border)",
          }}
        >
          {[
            "Updated daily with 1,000+ new emails",
            "10,000+ brands tracked",
            "7-day money-back on all paid plans",
          ].map((sig) => (
            <div key={sig} style={{ fontSize: 12, color: "var(--color-tertiary)", display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ color: "var(--color-accent)", fontSize: 12 }}>&#10003;</span>
              {sig}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .trust-signals { flex-direction: column !important; gap: 12px !important; align-items: center !important; }
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

  useEffect(() => {
    fetch(`${API_BASE}/emails?limit=30`)
      .then((r) => (r.ok ? r.json() : []))
      .then((emails) => {
        const emailList = emails.emails || emails || [];
        setRecentEmails(emailList.slice(0, 20));
      })
      .catch(() => {});
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-surface)" }}>
      <Header transparent />
      <HeroSection />
      <PlatformDescription />
      <EmailCarousel emails={recentEmails} />
      <DemoSection />
      <FeatureRow
        direction="left"
        badge="BROWSE"
        heading="Browse 100K+ real emails from top brands"
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
      <PricingAnchor />
      <FinalCTA />
    </div>
  );
}
