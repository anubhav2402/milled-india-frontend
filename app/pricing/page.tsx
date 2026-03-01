"use client";

import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  PLAN_LIMITS,
  PLAN_PRICES,
  PLAN_NAMES,
  formatPrice,
  type PlanTier,
  type FeatureKey,
  FEATURE_LABELS,
} from "../lib/plans";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://milled-india-api.onrender.com";

/* ── Feature rows displayed on each card ── */
type FeatureRow = {
  label: string;
  values: Record<PlanTier, string | boolean>;
};

const featureRows: FeatureRow[] = [
  {
    label: "Archive",
    values: { free: "30 days", starter: "6 months", pro: "Full archive", agency: "Full archive" },
  },
  {
    label: "Email views/day",
    values: { free: "20", starter: "75", pro: "Unlimited", agency: "Unlimited" },
  },
  {
    label: "Brand pages/day",
    values: { free: "5", starter: "25", pro: "Unlimited", agency: "Unlimited" },
  },
  {
    label: "Collections",
    values: { free: "5 collections", starter: "15 collections", pro: "Unlimited", agency: "Unlimited" },
  },
  {
    label: "Search",
    values: { free: "Basic keyword", starter: "Advanced filters", pro: "Full multi-param", agency: "Full" },
  },
  {
    label: "Analytics",
    values: { free: false, starter: "Send frequency", pro: "Full suite", agency: "Full suite" },
  },
  {
    label: "Campaign calendar",
    values: { free: false, starter: false, pro: true, agency: true },
  },
  {
    label: "Template editor",
    values: { free: "View only", starter: "Edit + 3 exports", pro: "Unlimited", agency: "Unlimited" },
  },
  {
    label: "Brand alerts",
    values: { free: false, starter: false, pro: "5 alerts", agency: "Unlimited" },
  },
  {
    label: "Brand follows",
    values: { free: "3", starter: "10", pro: "Unlimited", agency: "Unlimited" },
  },
  {
    label: "Bookmarks",
    values: { free: "10", starter: "50", pro: "Unlimited", agency: "Unlimited" },
  },
  {
    label: "Emails per collection",
    values: { free: "10", starter: "50", pro: "Unlimited", agency: "Unlimited" },
  },
  {
    label: "Email analysis",
    values: { free: "Score only", starter: "Full breakdown", pro: "Full breakdown", agency: "Full breakdown" },
  },
  {
    label: "AI email generator",
    values: { free: false, starter: false, pro: "10/month", agency: "Unlimited" },
  },
  {
    label: "Bulk export",
    values: { free: false, starter: false, pro: false, agency: true },
  },
  {
    label: "Reports",
    values: { free: false, starter: false, pro: false, agency: true },
  },
];

const faqs = [
  {
    q: "Can I cancel anytime?",
    a: "Yes. Cancel anytime from your account page. You keep access until the end of your billing period.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major credit/debit cards, UPI, net banking, and wallets via Razorpay.",
  },
  {
    q: "Is there a free trial?",
    a: "Every new account gets a 7-day Starter trial with no credit card required. After the trial, you can continue on the Free plan or upgrade to keep your features.",
  },
  {
    q: "How many brands do you track?",
    a: "We track 10,000+ brands and growing. New brands are added every week based on user requests.",
  },
  {
    q: "How often is data updated?",
    a: "Daily \u2014 we capture every email as it\u2019s sent, so you always see the latest campaigns.",
  },
  {
    q: "Can I get a refund?",
    a: "We offer a 7-day money-back guarantee. If you\u2019re not satisfied, contact us for a full refund.",
  },
];

const tiers: PlanTier[] = ["free", "starter", "pro", "agency"];

const tierDescriptions: Record<PlanTier, string> = {
  free: "Explore email marketing trends",
  starter: "For growing marketers",
  pro: "Full email marketing intelligence",
  agency: "For teams and agencies",
};

export default function PricingPage() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [billing, setBilling] = useState<"monthly" | "annual">("monthly");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  });
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const currentPlan = user?.effective_plan;

  /* ── Razorpay checkout ── */
  const handleSubscribe = async (selectedTier: PlanTier) => {
    setError(null);

    if (!user) {
      router.push("/signup?redirect=/pricing");
      return;
    }

    if (currentPlan === selectedTier) return;

    const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_live_SLvIYkuVsh4vIr";
    if (!razorpayKey) {
      setError(
        "Payment system is being set up. Please try again in a few minutes, or contact support."
      );
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/subscription/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ plan: billing, tier: selectedTier }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(
          data.detail || "Could not create subscription. Please try again."
        );
        return;
      }

      const options = {
        key: razorpayKey,
        subscription_id: data.subscription_id,
        name: "MailMuse",
        description: `${PLAN_NAMES[selectedTier]} ${billing === "monthly" ? "Monthly" : "Annual"} Plan`,
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_subscription_id: string;
          razorpay_signature: string;
        }) => {
          const verifyRes = await fetch(`${API_BASE}/subscription/verify`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_subscription_id: response.razorpay_subscription_id,
              razorpay_signature: response.razorpay_signature,
              tier: selectedTier,
              billing_cycle: billing,
            }),
          });

          if (verifyRes.ok) {
            window.location.href = "/account?upgraded=true";
          } else {
            setError(
              "Payment was received but verification failed. Please contact support \u2014 your payment is safe."
            );
          }
        },
        prefill: {
          email: user.email,
          name: user.name || "",
        },
        theme: {
          color: "#C2714A",
        },
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Subscribe error:", err);
      setError(
        "Could not connect to the payment server. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  /* ── Contact sales form submit ── */
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/contact-sales`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactForm),
      });
      if (res.ok) {
        setContactSubmitted(true);
      } else {
        setError("Could not submit your request. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    }
  };

  /* ── Render feature value (icon column only) ── */
  const renderFeatureValue = (value: string | boolean) => {
    if (value === true) {
      return <span style={{ color: "#22c55e", fontWeight: 600 }}>&#10003;</span>;
    }
    if (value === false) {
      return <span style={{ color: "#ccc" }}>&times;</span>;
    }
    // String values get a checkmark in the icon column; the text shows in the label
    return <span style={{ color: "#22c55e", fontWeight: 600 }}>&#10003;</span>;
  };

  /* ── Get CTA for each tier ── */
  const renderCTA = (tier: PlanTier) => {
    const isCurrent = currentPlan === tier;

    if (isCurrent) {
      return (
        <button
          disabled
          style={{
            display: "block",
            width: "100%",
            textAlign: "center",
            padding: "12px 24px",
            borderRadius: 10,
            border: "none",
            background: "#22c55e",
            color: "white",
            cursor: "default",
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          Current Plan
        </button>
      );
    }

    if (tier === "free") {
      return (
        <Link
          href={user ? "/browse" : "/signup"}
          style={{
            display: "block",
            textAlign: "center",
            padding: "12px 24px",
            borderRadius: 10,
            border: "1px solid var(--color-border)",
            color: "var(--color-primary)",
            textDecoration: "none",
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          Get Started Free
        </Link>
      );
    }

    if (tier === "agency") {
      return (
        <button
          onClick={() => setShowContactForm(true)}
          style={{
            display: "block",
            width: "100%",
            textAlign: "center",
            padding: "12px 24px",
            borderRadius: 10,
            border: "none",
            background: "var(--color-primary)",
            color: "white",
            cursor: "pointer",
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          Contact Sales
        </button>
      );
    }

    // Starter and Pro
    const isPro = tier === "pro";
    return (
      <button
        onClick={() => handleSubscribe(tier)}
        disabled={loading}
        style={{
          display: "block",
          width: "100%",
          textAlign: "center",
          padding: "12px 24px",
          borderRadius: 10,
          border: "none",
          background: isPro
            ? "linear-gradient(135deg, var(--color-accent), var(--color-accent-hover))"
            : "var(--color-primary)",
          color: "white",
          cursor: "pointer",
          fontSize: 14,
          fontWeight: 600,
          opacity: loading ? 0.7 : 1,
        }}
      >
        {loading ? "Processing..." : `Start ${PLAN_NAMES[tier]} Plan`}
      </button>
    );
  };

  /* ── Price display ── */
  const renderPrice = (tier: PlanTier) => {
    const prices = PLAN_PRICES[tier];
    if (tier === "free") {
      return (
        <div style={{ marginBottom: 24 }}>
          <span
            style={{
              fontSize: "clamp(28px, 4vw, 36px)",
              fontWeight: 700,
              color: "var(--color-primary)",
            }}
          >
            &#8377;0
          </span>
          <span style={{ fontSize: 14, color: "var(--color-secondary)" }}>
            {" "}/forever
          </span>
        </div>
      );
    }

    const monthlyAmount = prices.monthly;
    const annualAmount = prices.annual;
    const annualMonthly = Math.round(annualAmount / 12);

    return (
      <div style={{ marginBottom: 24 }}>
        <span
          style={{
            fontSize: 36,
            fontWeight: 700,
            color: "var(--color-primary)",
          }}
        >
          {formatPrice(billing === "monthly" ? monthlyAmount : annualMonthly)}
        </span>
        <span style={{ fontSize: 14, color: "var(--color-secondary)" }}>
          {" "}/month
        </span>
        {billing === "annual" && (
          <div
            style={{
              fontSize: 12,
              color: "var(--color-secondary)",
              marginTop: 4,
            }}
          >
            Billed {formatPrice(annualAmount)}/year
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Razorpay script */}
      <script src="https://checkout.razorpay.com/v1/checkout.js" async />

      <div
        className="pricing-container"
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "60px 20px",
          fontFamily: "var(--font-inter)",
        }}
      >
        {/* ── Header ── */}
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <h1
            style={{
              fontSize: "clamp(28px, 4vw, 36px)",
              fontWeight: 700,
              color: "var(--color-primary)",
              margin: "0 0 12px",
              fontFamily: "var(--font-dm-serif)",
            }}
          >
            Unlock the full power of email intelligence
          </h1>
          <p
            style={{
              fontSize: 18,
              color: "var(--color-secondary)",
              margin: 0,
              maxWidth: 520,
              marginInline: "auto",
            }}
          >
            Start free. Scale when you&apos;re ready.
          </p>
        </div>

        {/* ── Trial banner ── */}
        <div
          style={{
            textAlign: "center",
            marginBottom: 24,
            padding: "12px 20px",
            background: "var(--color-accent-light)",
            borderRadius: 10,
            maxWidth: 600,
            marginInline: "auto",
          }}
        >
          <p
            style={{
              fontSize: 14,
              color: "var(--color-primary)",
              margin: 0,
              fontWeight: 500,
            }}
          >
            Every new account gets 7 days of full Starter access &mdash; no credit card required
          </p>
        </div>

        {/* ── Social proof ── */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 24,
            marginBottom: 40,
            flexWrap: "wrap",
          }}
        >
          {["100,000+ emails tracked", "10,000+ brands", "Updated daily"].map(
            (stat) => (
              <span
                key={stat}
                style={{
                  fontSize: 13,
                  color: "var(--color-secondary)",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <span style={{ color: "var(--color-accent)" }}>&#10003;</span>
                {stat}
              </span>
            )
          )}
        </div>

        {/* ── Billing toggle ── */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 12,
            marginBottom: 40,
          }}
        >
          <button
            onClick={() => setBilling("monthly")}
            style={{
              padding: "8px 20px",
              borderRadius: 8,
              border: "1px solid var(--color-border)",
              background:
                billing === "monthly" ? "var(--color-primary)" : "transparent",
              color:
                billing === "monthly" ? "white" : "var(--color-secondary)",
              cursor: "pointer",
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            Monthly
          </button>
          <button
            onClick={() => setBilling("annual")}
            style={{
              padding: "8px 20px",
              borderRadius: 8,
              border: "1px solid var(--color-border)",
              background:
                billing === "annual" ? "var(--color-primary)" : "transparent",
              color:
                billing === "annual" ? "white" : "var(--color-secondary)",
              cursor: "pointer",
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            Annual
            <span
              style={{
                marginLeft: 6,
                fontSize: 11,
                background: "#dcfce7",
                color: "#166534",
                padding: "2px 6px",
                borderRadius: 4,
                fontWeight: 600,
              }}
            >
              Save 17%
            </span>
          </button>
        </div>

        {/* ── Error banner ── */}
        {error && (
          <div
            style={{
              background: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: 8,
              padding: "10px 14px",
              marginBottom: 24,
              fontSize: 13,
              color: "#991b1b",
              lineHeight: 1.5,
              maxWidth: 600,
              marginInline: "auto",
              textAlign: "center",
            }}
          >
            {error}
          </div>
        )}

        {/* ── Pricing cards ── */}
        <div
          className="pricing-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 20,
            maxWidth: 1100,
            margin: "0 auto 40px",
          }}
        >
          {tiers.map((tier) => {
            const isPro = tier === "pro";
            return (
              <div
                key={tier}
                className={`pricing-card ${isPro ? "pricing-card-pro" : ""}`}
                style={{
                  border: isPro
                    ? "2px solid var(--color-accent)"
                    : "1px solid var(--color-border)",
                  borderRadius: 16,
                  padding: 28,
                  background: "var(--color-surface, white)",
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/* MOST POPULAR badge */}
                {isPro && (
                  <div
                    style={{
                      position: "absolute",
                      top: -12,
                      left: "50%",
                      transform: "translateX(-50%)",
                      background:
                        "linear-gradient(135deg, var(--color-accent), var(--color-accent-hover))",
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

                {/* Plan name */}
                <h3
                  style={{
                    fontSize: 20,
                    fontWeight: 600,
                    color: "var(--color-primary)",
                    margin: "0 0 4px",
                  }}
                >
                  {PLAN_NAMES[tier]}
                </h3>
                <p
                  style={{
                    fontSize: 13,
                    color: "var(--color-secondary)",
                    margin: "0 0 16px",
                  }}
                >
                  {tierDescriptions[tier]}
                </p>

                {/* Price */}
                {renderPrice(tier)}

                {/* CTA */}
                <div style={{ marginBottom: 20 }}>{renderCTA(tier)}</div>

                {/* Feature list */}
                <ul
                  style={{
                    listStyle: "none",
                    padding: 0,
                    margin: 0,
                    flex: 1,
                  }}
                >
                  {featureRows.map((row) => {
                    const value = row.values[tier];
                    const isAvailable = value !== false;
                    return (
                      <li
                        key={row.label}
                        style={{
                          fontSize: 13,
                          color: isAvailable
                            ? "var(--color-secondary)"
                            : "var(--color-muted, #999)",
                          padding: "7px 0",
                          borderBottom:
                            "1px solid var(--color-border-light, #f0f0f0)",
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <span style={{ width: 18, textAlign: "center", flexShrink: 0 }}>
                          {renderFeatureValue(value)}
                        </span>
                        <span>
                          {row.label}
                          {typeof value === "string" && value !== "View only" && (
                            <span
                              style={{
                                color: isAvailable
                                  ? "var(--color-accent)"
                                  : "var(--color-muted, #999)",
                                marginLeft: 4,
                                fontSize: 11,
                                fontWeight: 500,
                              }}
                            >
                              ({value})
                            </span>
                          )}
                          {typeof value === "string" && value === "View only" && (
                            <span
                              style={{
                                color: "var(--color-muted, #999)",
                                marginLeft: 4,
                                fontSize: 11,
                              }}
                            >
                              ({value})
                            </span>
                          )}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>

        {/* ── Guarantee text ── */}
        <div
          style={{
            textAlign: "center",
            marginBottom: 60,
            display: "flex",
            justifyContent: "center",
            gap: 24,
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              fontSize: 13,
              color: "var(--color-secondary)",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span style={{ fontSize: 16 }}>&#128274;</span>
            7-day money-back guarantee
          </span>
          <span
            style={{
              fontSize: 13,
              color: "var(--color-secondary)",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span style={{ fontSize: 16 }}>&#10003;</span>
            Cancel anytime
          </span>
        </div>

        {/* ── Agency contact form ── */}
        {showContactForm && (
          <div
            style={{
              maxWidth: 500,
              margin: "0 auto 60px",
              border: "1px solid var(--color-border)",
              borderRadius: 16,
              padding: 32,
              background: "var(--color-surface, white)",
            }}
          >
            <h3
              style={{
                fontSize: 20,
                fontWeight: 600,
                color: "var(--color-primary)",
                margin: "0 0 8px",
                fontFamily: "var(--font-dm-serif)",
              }}
            >
              Contact Sales
            </h3>
            <p
              style={{
                fontSize: 14,
                color: "var(--color-secondary)",
                margin: "0 0 24px",
              }}
            >
              Tell us about your team and we&apos;ll get back to you within 24 hours.
            </p>

            {contactSubmitted ? (
              <div
                style={{
                  background: "#f0fdf4",
                  border: "1px solid #bbf7d0",
                  borderRadius: 8,
                  padding: "16px 20px",
                  textAlign: "center",
                }}
              >
                <p
                  style={{
                    fontSize: 15,
                    color: "#166534",
                    margin: 0,
                    fontWeight: 500,
                  }}
                >
                  Thanks! We&apos;ll be in touch soon.
                </p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit}>
                <div style={{ marginBottom: 14 }}>
                  <input
                    type="text"
                    placeholder="Your name"
                    required
                    value={contactForm.name}
                    onChange={(e) =>
                      setContactForm({ ...contactForm, name: e.target.value })
                    }
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: 8,
                      border: "1px solid var(--color-border)",
                      fontSize: 14,
                      fontFamily: "var(--font-inter)",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
                <div style={{ marginBottom: 14 }}>
                  <input
                    type="email"
                    placeholder="Work email"
                    required
                    value={contactForm.email}
                    onChange={(e) =>
                      setContactForm({ ...contactForm, email: e.target.value })
                    }
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: 8,
                      border: "1px solid var(--color-border)",
                      fontSize: 14,
                      fontFamily: "var(--font-inter)",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
                <div style={{ marginBottom: 14 }}>
                  <input
                    type="text"
                    placeholder="Company name"
                    required
                    value={contactForm.company}
                    onChange={(e) =>
                      setContactForm({
                        ...contactForm,
                        company: e.target.value,
                      })
                    }
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: 8,
                      border: "1px solid var(--color-border)",
                      fontSize: 14,
                      fontFamily: "var(--font-inter)",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
                <div style={{ marginBottom: 20 }}>
                  <textarea
                    placeholder="Tell us about your needs..."
                    rows={4}
                    required
                    value={contactForm.message}
                    onChange={(e) =>
                      setContactForm({
                        ...contactForm,
                        message: e.target.value,
                      })
                    }
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: 8,
                      border: "1px solid var(--color-border)",
                      fontSize: 14,
                      fontFamily: "var(--font-inter)",
                      resize: "vertical",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
                <button
                  type="submit"
                  style={{
                    width: "100%",
                    padding: "12px 24px",
                    borderRadius: 10,
                    border: "none",
                    background: "var(--color-primary)",
                    color: "white",
                    cursor: "pointer",
                    fontSize: 14,
                    fontWeight: 600,
                  }}
                >
                  Submit
                </button>
              </form>
            )}
          </div>
        )}

        {/* ── FAQ Section ── */}
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <h2
            style={{
              fontSize: 24,
              fontWeight: 600,
              color: "var(--color-primary)",
              textAlign: "center",
              marginBottom: 32,
              fontFamily: "var(--font-dm-serif)",
            }}
          >
            Frequently asked questions
          </h2>
          {faqs.map((faq, i) => (
            <div
              key={i}
              style={{
                borderBottom: "1px solid var(--color-border)",
                padding: "16px 0",
              }}
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{
                  width: "100%",
                  textAlign: "left",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 15,
                  fontWeight: 500,
                  color: "var(--color-primary)",
                  padding: 0,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                {faq.q}
                <span
                  style={{ fontSize: 18, color: "var(--color-secondary)" }}
                >
                  {openFaq === i ? "\u2212" : "+"}
                </span>
              </button>
              {openFaq === i && (
                <p
                  style={{
                    fontSize: 14,
                    color: "var(--color-secondary)",
                    margin: "12px 0 0",
                    lineHeight: 1.6,
                  }}
                >
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Mobile responsive styles ── */}
      <style>{`
        @media (max-width: 1024px) {
          .pricing-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            max-width: 700px !important;
          }
        }
        @media (max-width: 640px) {
          .pricing-grid {
            grid-template-columns: 1fr !important;
            max-width: 92vw !important;
          }
          .pricing-card-pro {
            order: -1;
          }
          .pricing-container {
            padding: 32px 16px !important;
          }
        }
      `}</style>
    </>
  );
}
