"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Logo from "../components/Logo";
import { API_BASE } from "../lib/constants";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (!token) {
      setError("Invalid reset link. Please request a new one.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch(`${API_BASE}/auth/reset-password-with-token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, new_password: password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({ detail: "Something went wrong" }));
        throw new Error(data.detail || "Something went wrong");
      }

      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (!token) {
    return (
      <div style={{ textAlign: "center" }}>
        <div style={{
          width: 56,
          height: 56,
          borderRadius: 14,
          background: "#fef2f2",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 20px",
        }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "#0f172a", marginBottom: 12 }}>
          Invalid Reset Link
        </h1>
        <p style={{ fontSize: 15, color: "#64748b", lineHeight: 1.6, marginBottom: 24 }}>
          This password reset link is invalid or has expired.
        </p>
        <Link
          href="/forgot-password"
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
          Request New Link
        </Link>
      </div>
    );
  }

  if (success) {
    return (
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
        }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "#0f172a", marginBottom: 12 }}>
          Password Reset!
        </h1>
        <p style={{ fontSize: 15, color: "#64748b", lineHeight: 1.6, marginBottom: 24 }}>
          Your password has been reset successfully. You can now log in with your new password.
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
          Go to Login
        </Link>
      </div>
    );
  }

  return (
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
          Set new password
        </h1>
        <p style={{ fontSize: 15, color: "#64748b" }}>
          Choose a new password for your account
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
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", fontSize: 14, fontWeight: 500, color: "#374151", marginBottom: 6 }}>
            New Password
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
              boxSizing: "border-box",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#C2714A")}
            onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
            placeholder="At least 6 characters"
          />
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={{ display: "block", fontSize: 14, fontWeight: 500, color: "#374151", marginBottom: 6 }}>
            Confirm Password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
            placeholder="Re-enter your password"
          />
        </div>

        <button
          type="submit"
          disabled={submitting || !password || !confirmPassword}
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
          {submitting ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </>
  );
}

export default function ResetPasswordPage() {
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
          <Suspense fallback={
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <div style={{ width: 36, height: 36, border: "3px solid #e2e8f0", borderTopColor: "#C2714A", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto" }} />
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          }>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
