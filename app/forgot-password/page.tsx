"use client";

import { useState } from "react";
import Link from "next/link";
import Logo from "../components/Logo";
import { API_BASE } from "../lib/constants";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch(`${API_BASE}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({ detail: "Something went wrong" }));
        throw new Error(data.detail || "Something went wrong");
      }

      setSent(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <header style={{ padding: "20px 24px", backgroundColor: "#fff", borderBottom: "1px solid #e2e8f0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <Logo size={36} />
            <span style={{ fontFamily: "var(--font-dm-serif)", fontSize: 22, color: "var(--color-primary)" }}>Mail <em style={{ fontStyle: "italic", color: "var(--color-accent)" }}>Muse</em></span>
          </Link>
          <Link
            href="/login"
            style={{
              padding: "10px 20px",
              fontSize: 14,
              fontWeight: 600,
              color: "#C2714A",
              textDecoration: "none",
              borderRadius: 8,
              border: "1px solid #C2714A",
            }}
          >
            Back to Login
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
        <div style={{
          backgroundColor: "#fff",
          borderRadius: 20,
          border: "1px solid #e2e8f0",
          padding: "48px 40px",
          width: "100%",
          maxWidth: 420,
          boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
        }}>
          {sent ? (
            /* Success state */
            <div style={{ textAlign: "center" }}>
              <div style={{
                width: 56,
                height: 56,
                borderRadius: 14,
                background: "#f0fdf4",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px",
                fontSize: 28,
              }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h1 style={{ fontSize: 24, fontWeight: 700, color: "#0f172a", marginBottom: 12 }}>
                Check your email
              </h1>
              <p style={{ fontSize: 15, color: "#64748b", lineHeight: 1.6, marginBottom: 24 }}>
                If an account exists for <strong style={{ color: "#334155" }}>{email}</strong>, we've sent a password reset link.
                The link expires in 15 minutes.
              </p>
              <p style={{ fontSize: 13, color: "#94a3b8", marginBottom: 24 }}>
                Don't see it? Check your spam folder.
              </p>
              <Link
                href="/login"
                style={{
                  display: "inline-block",
                  padding: "12px 28px",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#fff",
                  backgroundColor: "#C2714A",
                  textDecoration: "none",
                  borderRadius: 10,
                }}
              >
                Back to Login
              </Link>
            </div>
          ) : (
            /* Form state */
            <>
              <div style={{ textAlign: "center", marginBottom: 32 }}>
                <div style={{
                  width: 56,
                  height: 56,
                  borderRadius: 14,
                  background: "linear-gradient(135deg, #FEF7F3, #f0ddd0)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 20px",
                }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C2714A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <h1 style={{ fontSize: 28, fontWeight: 700, color: "#0f172a", marginBottom: 8 }}>
                  Forgot your password?
                </h1>
                <p style={{ fontSize: 15, color: "#64748b" }}>
                  Enter your email and we'll send you a reset link
                </p>
              </div>

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

              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: "block", fontSize: 14, fontWeight: 500, color: "#374151", marginBottom: 6 }}>
                    Email address
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
                      boxSizing: "border-box",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#C2714A")}
                    onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                    placeholder="you@company.com"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting || !email.trim()}
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
                  }}
                  onMouseEnter={(e) => !submitting && (e.currentTarget.style.backgroundColor = "#A85E3A")}
                  onMouseLeave={(e) => !submitting && (e.currentTarget.style.backgroundColor = "#C2714A")}
                >
                  {submitting ? "Sending..." : "Send Reset Link"}
                </button>
              </form>

              <div style={{ textAlign: "center", marginTop: 24 }}>
                <Link href="/login" style={{ fontSize: 14, color: "#64748b", textDecoration: "none" }}>
                  <span style={{ marginRight: 4 }}>&larr;</span> Back to login
                </Link>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
