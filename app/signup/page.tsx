"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
        };
      };
    };
  }
}

export default function SignupPage() {
  const router = useRouter();
  const { user, register, googleLogin, isLoading } = useAuth();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (!isLoading && user) {
      router.push("/brands");
    }
  }, [user, isLoading, router]);

  // Initialize Google Sign-In
  useEffect(() => {
    const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!googleClientId) return;

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: handleGoogleCallback,
        });
        
        const buttonDiv = document.getElementById("google-signup-button");
        if (buttonDiv) {
          window.google.accounts.id.renderButton(buttonDiv, {
            theme: "outline",
            size: "large",
            width: 320,
          });
        }
      }
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleGoogleCallback = async (response: { credential: string }) => {
    setError("");
    setSubmitting(true);
    
    const result = await googleLogin(response.credential);
    
    if (result.success) {
      router.push("/brands");
    } else {
      setError(result.error || "Google signup failed");
    }
    
    setSubmitting(false);
  };

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
      router.push("/brands");
    } else {
      setError(result.error || "Registration failed");
    }
    
    setSubmitting(false);
  };

  if (isLoading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#f8fafc" }}>
        <div style={{ width: 40, height: 40, border: "3px solid #e2e8f0", borderTopColor: "#C2714A", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
      {/* Header */}
      <header style={{ padding: "20px 24px", backgroundColor: "#fff", borderBottom: "1px solid #e2e8f0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <Logo size={36} />
            <span style={{ fontFamily: "var(--font-dm-serif)", fontSize: 22, color: "var(--color-primary)" }}>Mail <em style={{ fontStyle: "italic", color: "var(--color-accent)" }}>Muse</em></span>
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ fontSize: 14, color: "#64748b" }}>Already have an account?</span>
            <Link
              href="/login"
              style={{
                padding: "10px 20px",
                fontSize: 14,
                fontWeight: 600,
                color: "#C2714A",
                border: "1px solid #C2714A",
                textDecoration: "none",
                borderRadius: 8,
              }}
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content - Split Layout */}
      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
        
        {/* Left Side - Value Proposition */}
        <div>
          <div style={{ marginBottom: 32 }}>
            <span style={{
              display: "inline-block",
              padding: "6px 12px",
              backgroundColor: "#F5E6DC",
              color: "#C2714A",
              fontSize: 13,
              fontWeight: 600,
              borderRadius: 20,
              marginBottom: 16,
            }}>
              100% FREE - No Credit Card Required
            </span>
            <h1 style={{ fontSize: 42, fontWeight: 700, color: "#0f172a", lineHeight: 1.2, margin: "0 0 16px 0" }}>
              Unlock the secrets behind India's best email campaigns
            </h1>
            <p style={{ fontSize: 18, color: "#64748b", lineHeight: 1.6, margin: 0 }}>
              Join 500+ marketers who use MailMuse to spy on competitors, steal winning strategies, and 10x their email performance.
            </p>
          </div>

          {/* Benefits */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20, marginBottom: 40 }}>
            {[
              {
                icon: "📊",
                title: "See Hidden Brand Stats",
                description: "Unlock email frequency, send patterns, and campaign insights for 200+ brands"
              },
              {
                icon: "🔔",
                title: "Follow Your Competitors",
                description: "Get notified when your competitors launch new campaigns"
              },
              {
                icon: "📋",
                title: "Copy Winning Formulas",
                description: "Access 3,000+ real emails with subject lines that convert"
              },
            ].map((benefit, i) => (
              <div key={i} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                <div style={{
                  width: 48,
                  height: 48,
                  backgroundColor: "#F5E6DC",
                  borderRadius: 12,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 24,
                  flexShrink: 0,
                }}>
                  {benefit.icon}
                </div>
                <div>
                  <h3 style={{ margin: "0 0 4px 0", fontSize: 16, fontWeight: 600, color: "#0f172a" }}>
                    {benefit.title}
                  </h3>
                  <p style={{ margin: 0, fontSize: 14, color: "#64748b", lineHeight: 1.5 }}>
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Social Proof */}
          <div style={{
            padding: "20px 24px",
            backgroundColor: "#fff",
            borderRadius: 12,
            border: "1px solid #e2e8f0",
          }}>
            <div style={{ display: "flex", gap: 32, alignItems: "center", flexWrap: "wrap" }}>
              <div>
                <div style={{ fontSize: 28, fontWeight: 700, color: "#C2714A" }}>3,000+</div>
                <div style={{ fontSize: 13, color: "#64748b" }}>Emails Tracked</div>
              </div>
              <div style={{ width: 1, height: 40, backgroundColor: "#e2e8f0" }} />
              <div>
                <div style={{ fontSize: 28, fontWeight: 700, color: "#C2714A" }}>200+</div>
                <div style={{ fontSize: 13, color: "#64748b" }}>Brands Monitored</div>
              </div>
              <div style={{ width: 1, height: 40, backgroundColor: "#e2e8f0" }} />
              <div>
                <div style={{ fontSize: 28, fontWeight: 700, color: "#C2714A" }}>Daily</div>
                <div style={{ fontSize: 13, color: "#64748b" }}>Updates</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Signup Form */}
        <div style={{
          backgroundColor: "#fff",
          borderRadius: 20,
          border: "1px solid #e2e8f0",
          padding: "40px",
          boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
        }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: "#0f172a", marginBottom: 8, textAlign: "center" }}>
            Create your free account
          </h2>
          <p style={{ fontSize: 14, color: "#64748b", marginBottom: 28, textAlign: "center" }}>
            Takes less than 30 seconds
          </p>

          {/* Error Message */}
          {error && (
            <div style={{
              backgroundColor: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: 8,
              padding: "12px 16px",
              marginBottom: 20,
              color: "#dc2626",
              fontSize: 14,
            }}>
              {error}
            </div>
          )}

          {/* Google Sign-Up Button */}
          <div id="google-signup-button" style={{ marginBottom: 24, display: "flex", justifyContent: "center" }} />

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
            <div style={{ flex: 1, height: 1, backgroundColor: "#e2e8f0" }} />
            <span style={{ fontSize: 12, color: "#94a3b8" }}>or continue with email</span>
            <div style={{ flex: 1, height: 1, backgroundColor: "#e2e8f0" }} />
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 14, fontWeight: 500, color: "#374151", marginBottom: 6 }}>
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  fontSize: 15,
                  color: "#0f172a",
                  border: "1px solid #e2e8f0",
                  borderRadius: 10,
                  outline: "none",
                  transition: "border-color 0.2s",
                  backgroundColor: "#fff",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#C2714A")}
                onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                placeholder="John Doe"
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 14, fontWeight: 500, color: "#374151", marginBottom: 6 }}>
                Work Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  fontSize: 15,
                  color: "#0f172a",
                  border: "1px solid #e2e8f0",
                  borderRadius: 10,
                  outline: "none",
                  transition: "border-color 0.2s",
                  backgroundColor: "#fff",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#C2714A")}
                onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                placeholder="you@company.com"
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: "block", fontSize: 14, fontWeight: 500, color: "#374151", marginBottom: 6 }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  fontSize: 15,
                  color: "#0f172a",
                  border: "1px solid #e2e8f0",
                  borderRadius: 10,
                  outline: "none",
                  transition: "border-color 0.2s",
                  backgroundColor: "#fff",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#C2714A")}
                onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                placeholder="Min. 6 characters"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              style={{
                width: "100%",
                padding: "16px",
                backgroundColor: submitting ? "#94a3b8" : "#C2714A",
                color: "#fff",
                fontSize: 16,
                fontWeight: 600,
                border: "none",
                borderRadius: 10,
                cursor: submitting ? "not-allowed" : "pointer",
                transition: "all 0.2s",
                marginBottom: 16,
              }}
              onMouseEnter={(e) => !submitting && (e.currentTarget.style.backgroundColor = "#A85E3A")}
              onMouseLeave={(e) => !submitting && (e.currentTarget.style.backgroundColor = "#C2714A")}
            >
              {submitting ? "Creating account..." : "Create Free Account"}
            </button>

            {/* Trust Signals */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#64748b" }}>
                <svg width="14" height="14" fill="#C2714A" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                </svg>
                Free forever
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#64748b" }}>
                <svg width="14" height="14" fill="#C2714A" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                </svg>
                No credit card
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#64748b" }}>
                <svg width="14" height="14" fill="#C2714A" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                </svg>
                Instant access
              </div>
            </div>
          </form>

          {/* Terms */}
          <p style={{ marginTop: 24, textAlign: "center", fontSize: 12, color: "#94a3b8", lineHeight: 1.6 }}>
            By creating an account, you agree to our{" "}
            <a href="#" style={{ color: "#64748b", textDecoration: "underline" }}>Terms of Service</a>
            {" "}and{" "}
            <a href="#" style={{ color: "#64748b", textDecoration: "underline" }}>Privacy Policy</a>
          </p>
        </div>
      </main>

      {/* Mobile Styles */}
      <style>{`
        @media (max-width: 900px) {
          main {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
            padding: 40px 20px !important;
          }
        }
        @media (max-width: 600px) {
          header > div {
            flex-direction: column !important;
            gap: 16px !important;
          }
        }
      `}</style>
    </div>
  );
}
