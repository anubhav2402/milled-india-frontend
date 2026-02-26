"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Logo from "../components/Logo";
import { useAuth } from "../context/AuthContext";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
          }) => void;
          renderButton: (
            element: HTMLElement,
            config: { theme: string; size: string; width: number }
          ) => void;
          prompt: () => void;
        };
      };
    };
  }
}

export default function SignupPage() {
  return (
    <Suspense>
      <SignupContent />
    </Suspense>
  );
}

function SignupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, register, googleLogin, isLoading } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const redirect = searchParams.get("redirect") || "/browse";

  // Redirect if already logged in
  useEffect(() => {
    if (!isLoading && user) {
      router.push(redirect);
    }
  }, [user, isLoading, router, redirect]);

  // Initialize Google Sign-In
  // Uses getElementById instead of useRef to survive Suspense remounts.
  // Does not remove the script on cleanup — the GSI library is idempotent
  // and removing it mid-remount causes the button to silently break.
  useEffect(() => {
    const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!googleClientId) return;

    const handleGoogleCallback = async (response: { credential: string }) => {
      setError("");
      setSubmitting(true);

      const result = await googleLogin(response.credential);

      if (result.success) {
        router.push(redirect);
      } else {
        setError(result.error || "Google signup failed");
      }

      setSubmitting(false);
    };

    const renderGoogleButton = () => {
      if (!window.google) return;
      const buttonDiv = document.getElementById("google-signup-button");
      if (!buttonDiv) return;

      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: handleGoogleCallback,
      });
      window.google.accounts.id.renderButton(buttonDiv, {
        theme: "outline",
        size: "large",
        width: 320,
      });
    };

    // If the GSI script is already loaded (e.g. after Suspense remount),
    // just re-render the button into the new DOM element.
    if (window.google) {
      renderGoogleButton();
      return;
    }

    // Check if a GSI script tag already exists (from a prior mount that was
    // unmounted by Suspense before the script finished loading).
    const existingScript = document.querySelector(
      'script[src="https://accounts.google.com/gsi/client"]'
    );

    if (existingScript) {
      // Script is still loading — wait for it
      existingScript.addEventListener("load", renderGoogleButton);
      return () => {
        existingScript.removeEventListener("load", renderGoogleButton);
      };
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      renderGoogleButton();
    };

    // Intentionally NOT removing the script on cleanup.
    // The GSI library is safe to keep loaded, and removing it during
    // Suspense remounts is what caused the button to break.
  }, [googleLogin, redirect, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setSubmitting(true);

    const result = await register(email, password, name || undefined);

    if (result.success) {
      router.push(redirect);
    } else {
      setError(result.error || "Registration failed");
    }

    setSubmitting(false);
  };

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "var(--color-background, #faf9f7)",
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            border: "3px solid #e2e8f0",
            borderTopColor: "var(--color-accent)",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--color-background, #faf9f7)" }}>
      {/* Header */}
      <header
        style={{
          padding: "16px 24px",
          backgroundColor: "white",
          borderBottom: "1px solid var(--color-border, #e5e5e5)",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              textDecoration: "none",
            }}
          >
            <Logo size={32} />
            <span
              style={{
                fontFamily: "var(--font-dm-serif)",
                fontSize: 20,
                color: "var(--color-primary)",
              }}
            >
              Mail{" "}
              <em style={{ fontStyle: "italic", color: "var(--color-accent)" }}>
                Muse
              </em>
            </span>
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span
              className="signup-header-text"
              style={{ fontSize: 13, color: "var(--color-secondary)" }}
            >
              Already have an account?
            </span>
            <Link
              href="/login"
              style={{
                padding: "8px 18px",
                fontSize: 13,
                fontWeight: 600,
                color: "var(--color-accent)",
                border: "1px solid var(--color-accent)",
                textDecoration: "none",
                borderRadius: 8,
              }}
            >
              Log in
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main
        className="signup-main"
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "48px 24px 60px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 64,
          alignItems: "center",
        }}
      >
        {/* Left Side — Value Proposition */}
        <div>
          {/* Trial badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 14px",
              background:
                "linear-gradient(135deg, var(--color-accent-light, #f5e6dc), #fef3ec)",
              borderRadius: 20,
              marginBottom: 20,
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "var(--color-accent)",
                display: "inline-block",
              }}
            />
            <span
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "var(--color-accent)",
              }}
            >
              14-day Pro trial included — no card required
            </span>
          </div>

          <h1
            style={{
              fontSize: 38,
              fontWeight: 700,
              color: "var(--color-primary)",
              lineHeight: 1.2,
              margin: "0 0 14px",
              fontFamily: "var(--font-dm-serif)",
            }}
          >
            See what the best brands send — before they send it to you
          </h1>
          <p
            style={{
              fontSize: 17,
              color: "var(--color-secondary)",
              lineHeight: 1.6,
              margin: "0 0 36px",
            }}
          >
            Track 8,000+ real emails from 300+ brands. Decode subject lines,
            send times, and campaign strategies that actually convert.
          </p>

          {/* Benefits */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 22,
              marginBottom: 36,
            }}
          >
            {[
              {
                icon: (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--color-accent)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                ),
                title: "Full email archive",
                desc: "Every campaign from 300+ brands, captured daily with full HTML and subject lines",
              },
              {
                icon: (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--color-accent)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="20" x2="18" y2="10" />
                    <line x1="12" y1="20" x2="12" y2="4" />
                    <line x1="6" y1="20" x2="6" y2="14" />
                  </svg>
                ),
                title: "Analytics & benchmarks",
                desc: "Send frequency, peak days, subject line patterns — see what works across industries",
              },
              {
                icon: (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--color-accent)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ),
                title: "Swipe file & templates",
                desc: "Save the best emails, export HTML templates, and build your own inspiration library",
              },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: 14,
                  alignItems: "flex-start",
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    background: "var(--color-accent-light, #f5e6dc)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {item.icon}
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 15,
                      fontWeight: 600,
                      color: "var(--color-primary)",
                      marginBottom: 2,
                    }}
                  >
                    {item.title}
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: "var(--color-secondary)",
                      lineHeight: 1.5,
                    }}
                  >
                    {item.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Stats bar */}
          <div
            style={{
              display: "flex",
              gap: 28,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            {[
              { value: "8,000+", label: "Emails tracked" },
              { value: "300+", label: "Brands" },
              { value: "Daily", label: "Updates" },
            ].map((stat, i) => (
              <div key={i} style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                <span
                  style={{
                    fontSize: 22,
                    fontWeight: 700,
                    color: "var(--color-accent)",
                  }}
                >
                  {stat.value}
                </span>
                <span
                  style={{
                    fontSize: 13,
                    color: "var(--color-secondary)",
                  }}
                >
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side — Signup Form */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: 16,
            border: "1px solid var(--color-border, #e5e5e5)",
            padding: "36px 32px",
            boxShadow: "0 4px 24px rgba(0,0,0,0.05)",
          }}
        >
          <h2
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: "var(--color-primary)",
              marginBottom: 6,
              textAlign: "center",
            }}
          >
            Start your free Pro trial
          </h2>
          <p
            style={{
              fontSize: 14,
              color: "var(--color-secondary)",
              marginBottom: 28,
              textAlign: "center",
            }}
          >
            14 days of full Pro access. No credit card.
          </p>

          {/* Error Message */}
          {error && (
            <div
              style={{
                backgroundColor: "#fef2f2",
                border: "1px solid #fecaca",
                borderRadius: 8,
                padding: "10px 14px",
                marginBottom: 20,
                color: "#dc2626",
                fontSize: 13,
              }}
            >
              {error}
            </div>
          )}

          {/* Google Sign-Up Button */}
          <div
            id="google-signup-button"
            style={{
              marginBottom: 24,
              display: "flex",
              justifyContent: "center",
              minHeight: 44,
            }}
          />

          {/* Divider */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              marginBottom: 24,
            }}
          >
            <div
              style={{
                flex: 1,
                height: 1,
                backgroundColor: "var(--color-border, #e5e5e5)",
              }}
            />
            <span style={{ fontSize: 12, color: "var(--color-muted, #999)" }}>
              or sign up with email
            </span>
            <div
              style={{
                flex: 1,
                height: 1,
                backgroundColor: "var(--color-border, #e5e5e5)",
              }}
            />
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 14 }}>
              <label
                style={{
                  display: "block",
                  fontSize: 13,
                  fontWeight: 500,
                  color: "var(--color-primary)",
                  marginBottom: 5,
                }}
              >
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Smith"
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  fontSize: 14,
                  color: "var(--color-primary)",
                  border: "1px solid var(--color-border, #e5e5e5)",
                  borderRadius: 8,
                  outline: "none",
                  backgroundColor: "white",
                  boxSizing: "border-box",
                  fontFamily: "var(--font-inter)",
                }}
                onFocus={(e) =>
                  (e.target.style.borderColor = "var(--color-accent)")
                }
                onBlur={(e) =>
                  (e.target.style.borderColor = "var(--color-border, #e5e5e5)")
                }
              />
            </div>

            <div style={{ marginBottom: 14 }}>
              <label
                style={{
                  display: "block",
                  fontSize: 13,
                  fontWeight: 500,
                  color: "var(--color-primary)",
                  marginBottom: 5,
                }}
              >
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@company.com"
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  fontSize: 14,
                  color: "var(--color-primary)",
                  border: "1px solid var(--color-border, #e5e5e5)",
                  borderRadius: 8,
                  outline: "none",
                  backgroundColor: "white",
                  boxSizing: "border-box",
                  fontFamily: "var(--font-inter)",
                }}
                onFocus={(e) =>
                  (e.target.style.borderColor = "var(--color-accent)")
                }
                onBlur={(e) =>
                  (e.target.style.borderColor = "var(--color-border, #e5e5e5)")
                }
              />
            </div>

            <div style={{ marginBottom: 22 }}>
              <label
                style={{
                  display: "block",
                  fontSize: 13,
                  fontWeight: 500,
                  color: "var(--color-primary)",
                  marginBottom: 5,
                }}
              >
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                placeholder="Min. 6 characters"
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  fontSize: 14,
                  color: "var(--color-primary)",
                  border: "1px solid var(--color-border, #e5e5e5)",
                  borderRadius: 8,
                  outline: "none",
                  backgroundColor: "white",
                  boxSizing: "border-box",
                  fontFamily: "var(--font-inter)",
                }}
                onFocus={(e) =>
                  (e.target.style.borderColor = "var(--color-accent)")
                }
                onBlur={(e) =>
                  (e.target.style.borderColor = "var(--color-border, #e5e5e5)")
                }
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              style={{
                width: "100%",
                padding: "14px",
                background: submitting
                  ? "#94a3b8"
                  : "linear-gradient(135deg, var(--color-accent), var(--color-accent-hover))",
                color: "white",
                fontSize: 15,
                fontWeight: 600,
                border: "none",
                borderRadius: 10,
                cursor: submitting ? "not-allowed" : "pointer",
                marginBottom: 16,
                fontFamily: "var(--font-inter)",
              }}
            >
              {submitting ? "Creating account..." : "Start Free Pro Trial"}
            </button>

            {/* Trust signals */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 16,
                flexWrap: "wrap",
              }}
            >
              {["14-day Pro trial", "No credit card", "Cancel anytime"].map(
                (text) => (
                  <span
                    key={text}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                      fontSize: 12,
                      color: "var(--color-secondary)",
                    }}
                  >
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="var(--color-accent)"
                    >
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                    </svg>
                    {text}
                  </span>
                )
              )}
            </div>
          </form>

          {/* What you get with trial */}
          <div
            style={{
              marginTop: 24,
              padding: "16px 18px",
              background: "var(--color-accent-light, #faf5f2)",
              borderRadius: 10,
            }}
          >
            <div
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: "var(--color-primary)",
                marginBottom: 8,
                textTransform: "uppercase",
                letterSpacing: 0.5,
              }}
            >
              Your Pro trial includes
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "6px 12px",
              }}
            >
              {[
                "Full email archive",
                "Unlimited views",
                "Analytics & benchmarks",
                "Campaign calendar",
                "Template exports",
                "Advanced search",
              ].map((feature) => (
                <span
                  key={feature}
                  style={{
                    fontSize: 12,
                    color: "var(--color-secondary)",
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                  }}
                >
                  <span style={{ color: "var(--color-accent)", fontSize: 11 }}>
                    &#10003;
                  </span>
                  {feature}
                </span>
              ))}
            </div>
          </div>

          {/* Terms */}
          <p
            style={{
              marginTop: 20,
              textAlign: "center",
              fontSize: 11,
              color: "var(--color-muted, #999)",
              lineHeight: 1.6,
            }}
          >
            By creating an account, you agree to our{" "}
            <Link
              href="/terms"
              style={{
                color: "var(--color-secondary)",
                textDecoration: "underline",
              }}
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              style={{
                color: "var(--color-secondary)",
                textDecoration: "underline",
              }}
            >
              Privacy Policy
            </Link>
          </p>
        </div>
      </main>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 900px) {
          .signup-main {
            grid-template-columns: 1fr !important;
            gap: 36px !important;
            padding: 32px 20px 48px !important;
          }
        }
        @media (max-width: 500px) {
          .signup-header-text {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
