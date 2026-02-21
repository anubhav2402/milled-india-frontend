"use client";

import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://milled-india-api.onrender.com";

const features = [
  { name: "Browse emails", free: "Last 30 days", pro: "Full archive" },
  { name: "Analytics & benchmarks", free: false, pro: true },
  { name: "Subject line database", free: false, pro: true },
  { name: "Brand pages", free: "5 per day", pro: "Unlimited" },
  { name: "Email HTML view", free: "10 per day", pro: "Unlimited" },
  { name: "Follow brands", free: "Up to 3", pro: "Unlimited" },
  { name: "Bookmarks", free: "Up to 10", pro: "Unlimited" },
  { name: "Campaign calendar", free: false, pro: true },
  { name: "Export data", free: false, pro: true },
];

const faqs = [
  {
    q: "Can I cancel anytime?",
    a: "Yes. Cancel anytime from your account page. You keep Pro access until the end of your billing period.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major credit/debit cards, UPI, net banking, and wallets via Razorpay.",
  },
  {
    q: "Is there a free trial?",
    a: "The Free plan lets you explore MailMuse with limited access. Upgrade when you're ready for full analytics.",
  },
  {
    q: "How many brands do you track?",
    a: "We track 300+ Indian D2C brands and growing. New brands are added every week based on user requests.",
  },
  {
    q: "How often is data updated?",
    a: "Daily — we capture every email as it's sent, so you always see the latest campaigns.",
  },
  {
    q: "Can I get a refund?",
    a: "We offer a 7-day money-back guarantee. If you're not satisfied, contact us for a full refund.",
  },
];

export default function PricingPage() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [billing, setBilling] = useState<"monthly" | "annual">("monthly");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const monthlyPrice = 2499;
  const annualPrice = 19188;
  const annualMonthly = Math.round(annualPrice / 12);
  const dailyCost = Math.round(annualPrice / 365);

  const handleSubscribe = async () => {
    setError(null);

    if (!user) {
      router.push("/signup?redirect=/pricing");
      return;
    }

    if (user.is_pro) return;

    const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
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
        body: JSON.stringify({ plan: billing }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(
          data.detail || "Could not create subscription. Please try again."
        );
        return;
      }

      // Open Razorpay checkout
      const options = {
        key: razorpayKey,
        subscription_id: data.subscription_id,
        name: "MailMuse",
        description: `Pro ${billing === "monthly" ? "Monthly" : "Annual"} Plan`,
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
            body: JSON.stringify(response),
          });

          if (verifyRes.ok) {
            window.location.href = "/account?upgraded=true";
          } else {
            setError(
              "Payment was received but verification failed. Please contact support — your payment is safe."
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

  return (
    <>
      {/* Razorpay script */}
      <script src="https://checkout.razorpay.com/v1/checkout.js" async />

      <div
        style={{
          maxWidth: 1000,
          margin: "0 auto",
          padding: "60px 20px",
          fontFamily: "var(--font-inter)",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <h1
            style={{
              fontSize: 36,
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
            Start free. Upgrade when you need the complete toolkit for tracking,
            analyzing, and learning from India&apos;s best D2C email campaigns.
          </p>
        </div>

        {/* Social proof */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 24,
            marginBottom: 40,
            flexWrap: "wrap",
          }}
        >
          {[
            "10,000+ emails tracked",
            "300+ D2C brands",
            "Updated daily",
          ].map((stat) => (
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
          ))}
        </div>

        {/* Billing toggle */}
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
              Save 36%
            </span>
          </button>
        </div>

        {/* Pricing cards */}
        <div
          className="pricing-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 24,
            maxWidth: 800,
            margin: "0 auto 60px",
          }}
        >
          {/* Free Plan */}
          <div
            style={{
              border: "1px solid var(--color-border)",
              borderRadius: 16,
              padding: 32,
              background: "white",
            }}
          >
            <h3
              style={{
                fontSize: 20,
                fontWeight: 600,
                color: "var(--color-primary)",
                margin: "0 0 4px",
              }}
            >
              Free
            </h3>
            <p
              style={{
                fontSize: 14,
                color: "var(--color-secondary)",
                margin: "0 0 20px",
              }}
            >
              Explore email marketing trends
            </p>
            <div style={{ marginBottom: 24 }}>
              <span
                style={{
                  fontSize: 36,
                  fontWeight: 700,
                  color: "var(--color-primary)",
                }}
              >
                &#8377;0
              </span>
              <span style={{ fontSize: 14, color: "var(--color-secondary)" }}>
                {" "}
                /forever
              </span>
            </div>
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
                marginBottom: 24,
              }}
            >
              {user ? "Current Plan" : "Get Started Free"}
            </Link>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {features.map((f) => (
                <li
                  key={f.name}
                  style={{
                    fontSize: 14,
                    color:
                      f.free === false
                        ? "var(--color-muted, #999)"
                        : "var(--color-secondary)",
                    padding: "8px 0",
                    borderBottom: "1px solid var(--color-border-light, #f0f0f0)",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <span style={{ width: 18, textAlign: "center" }}>
                    {f.free === false ? (
                      <span style={{ color: "#ccc" }}>&times;</span>
                    ) : (
                      <span style={{ color: "#22c55e" }}>&#10003;</span>
                    )}
                  </span>
                  <span>
                    {f.name}
                    {typeof f.free === "string" && (
                      <span
                        style={{
                          color: "var(--color-muted, #999)",
                          marginLeft: 4,
                          fontSize: 12,
                        }}
                      >
                        ({f.free})
                      </span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Pro Plan */}
          <div
            style={{
              border: "2px solid var(--color-accent)",
              borderRadius: 16,
              padding: 32,
              background: "white",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: -12,
                left: "50%",
                transform: "translateX(-50%)",
                background:
                  "linear-gradient(135deg, var(--color-accent), var(--color-accent-hover))",
                color: "white",
                fontSize: 12,
                fontWeight: 600,
                padding: "4px 16px",
                borderRadius: 20,
              }}
            >
              MOST POPULAR
            </div>
            <h3
              style={{
                fontSize: 20,
                fontWeight: 600,
                color: "var(--color-primary)",
                margin: "0 0 4px",
              }}
            >
              Pro
            </h3>
            <p
              style={{
                fontSize: 14,
                color: "var(--color-secondary)",
                margin: "0 0 20px",
              }}
            >
              Full email marketing intelligence
            </p>
            <div style={{ marginBottom: 24 }}>
              <span
                style={{
                  fontSize: 36,
                  fontWeight: 700,
                  color: "var(--color-primary)",
                }}
              >
                &#8377;
                {billing === "monthly"
                  ? monthlyPrice.toLocaleString("en-IN")
                  : annualMonthly.toLocaleString("en-IN")}
              </span>
              <span style={{ fontSize: 14, color: "var(--color-secondary)" }}>
                {" "}
                /month
              </span>
              {billing === "annual" && (
                <div
                  style={{
                    fontSize: 12,
                    color: "var(--color-secondary)",
                    marginTop: 4,
                  }}
                >
                  Billed &#8377;{annualPrice.toLocaleString("en-IN")}/year
                  <span
                    style={{
                      marginLeft: 8,
                      color: "var(--color-accent)",
                      fontWeight: 500,
                    }}
                  >
                    (just &#8377;{dailyCost}/day)
                  </span>
                </div>
              )}
            </div>
            <button
              onClick={handleSubscribe}
              disabled={loading || user?.is_pro}
              style={{
                display: "block",
                width: "100%",
                textAlign: "center",
                padding: "12px 24px",
                borderRadius: 10,
                border: "none",
                background: user?.is_pro
                  ? "#22c55e"
                  : "linear-gradient(135deg, var(--color-accent), var(--color-accent-hover))",
                color: "white",
                cursor: user?.is_pro ? "default" : "pointer",
                fontSize: 14,
                fontWeight: 600,
                marginBottom: 8,
                opacity: loading ? 0.7 : 1,
              }}
            >
              {user?.is_pro
                ? "Current Plan"
                : loading
                ? "Processing..."
                : billing === "annual"
                ? "Start Pro Plan (Save 36%)"
                : "Start Pro Plan"}
            </button>

            {/* Guarantee text */}
            <p
              style={{
                fontSize: 12,
                color: "var(--color-secondary)",
                textAlign: "center",
                margin: "0 0 24px",
              }}
            >
              7-day money-back guarantee. Cancel anytime.
            </p>

            {/* Inline error */}
            {error && (
              <div
                style={{
                  background: "#fef2f2",
                  border: "1px solid #fecaca",
                  borderRadius: 8,
                  padding: "10px 14px",
                  marginBottom: 16,
                  fontSize: 13,
                  color: "#991b1b",
                  lineHeight: 1.5,
                }}
              >
                {error}
              </div>
            )}

            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {features.map((f) => (
                <li
                  key={f.name}
                  style={{
                    fontSize: 14,
                    color: "var(--color-secondary)",
                    padding: "8px 0",
                    borderBottom: "1px solid var(--color-border-light, #f0f0f0)",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <span
                    style={{
                      width: 18,
                      textAlign: "center",
                      color: "var(--color-accent)",
                    }}
                  >
                    &#10003;
                  </span>
                  <span>
                    {f.name}
                    {typeof f.pro === "string" && (
                      <span
                        style={{
                          color: "var(--color-accent)",
                          marginLeft: 4,
                          fontSize: 12,
                          fontWeight: 500,
                        }}
                      >
                        ({f.pro})
                      </span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* FAQ Section */}
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

      {/* Mobile responsive styles */}
      <style>{`
        @media (max-width: 640px) {
          .pricing-grid {
            grid-template-columns: 1fr !important;
          }
          .pricing-grid > div:last-child {
            order: -1;
          }
        }
      `}</style>
    </>
  );
}
