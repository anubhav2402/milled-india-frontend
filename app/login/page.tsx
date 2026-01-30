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

export default function LoginPage() {
  const router = useRouter();
  const { user, login, googleLogin, isLoading } = useAuth();
  
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
        
        const buttonDiv = document.getElementById("google-signin-button");
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
      setError(result.error || "Google login failed");
    }
    
    setSubmitting(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const result = await login(email, password);
    
    if (result.success) {
      router.push("/brands");
    } else {
      setError(result.error || "Login failed");
    }
    
    setSubmitting(false);
  };

  if (isLoading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#f8fafc" }}>
        <div style={{ width: 40, height: 40, border: "3px solid #e2e8f0", borderTopColor: "#14b8a6", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <header style={{ padding: "20px 24px", backgroundColor: "#fff", borderBottom: "1px solid #e2e8f0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <Logo size={36} />
            <span style={{ fontSize: 22, fontWeight: 700, color: "#0f172a" }}>MailMuse</span>
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ fontSize: 14, color: "#64748b" }}>Don't have an account?</span>
            <Link
              href="/signup"
              style={{
                padding: "10px 20px",
                fontSize: 14,
                fontWeight: 600,
                color: "#fff",
                backgroundColor: "#14b8a6",
                textDecoration: "none",
                borderRadius: 8,
              }}
            >
              Sign Up Free
            </Link>
          </div>
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
          <h1 style={{ fontSize: 28, fontWeight: 700, color: "#0f172a", marginBottom: 8, textAlign: "center" }}>
            Welcome back
          </h1>
          <p style={{ fontSize: 15, color: "#64748b", marginBottom: 32, textAlign: "center" }}>
            Sign in to continue tracking brand campaigns
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

          {/* Google Sign-In Button */}
          <div id="google-signin-button" style={{ marginBottom: 24, display: "flex", justifyContent: "center" }} />

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
            <div style={{ flex: 1, height: 1, backgroundColor: "#e2e8f0" }} />
            <span style={{ fontSize: 12, color: "#94a3b8" }}>or continue with email</span>
            <div style={{ flex: 1, height: 1, backgroundColor: "#e2e8f0" }} />
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 14, fontWeight: 500, color: "#374151", marginBottom: 6 }}>
                Email
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
                onFocus={(e) => (e.target.style.borderColor = "#14b8a6")}
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
                onFocus={(e) => (e.target.style.borderColor = "#14b8a6")}
                onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              style={{
                width: "100%",
                padding: "16px",
                backgroundColor: submitting ? "#94a3b8" : "#14b8a6",
                color: "#fff",
                fontSize: 16,
                fontWeight: 600,
                border: "none",
                borderRadius: 10,
                cursor: submitting ? "not-allowed" : "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => !submitting && (e.currentTarget.style.backgroundColor = "#0d9488")}
              onMouseLeave={(e) => !submitting && (e.currentTarget.style.backgroundColor = "#14b8a6")}
            >
              {submitting ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Sign Up Link */}
          <div style={{
            marginTop: 28,
            padding: "20px",
            backgroundColor: "#f8fafc",
            borderRadius: 12,
            textAlign: "center",
          }}>
            <p style={{ margin: 0, fontSize: 14, color: "#64748b" }}>
              New to MailMuse?{" "}
              <Link href="/signup" style={{ color: "#14b8a6", fontWeight: 600, textDecoration: "none" }}>
                Create a free account
              </Link>
            </p>
            <p style={{ margin: "8px 0 0 0", fontSize: 12, color: "#94a3b8" }}>
              Unlock brand stats, follow competitors, and more
            </p>
          </div>
        </div>
      </main>

      {/* Mobile Styles */}
      <style>{`
        @media (max-width: 600px) {
          header > div {
            flex-direction: column !important;
            gap: 16px !important;
            text-align: center !important;
          }
        }
      `}</style>
    </div>
  );
}
