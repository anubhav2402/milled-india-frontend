"use client";

import { useAuth } from "../context/AuthContext";
import Link from "next/link";

/**
 * ProGate — Tier-aware content gate.
 *
 * Three states:
 * 1. Not logged in → "Sign up free" CTA
 * 2. Free tier → "Upgrade to Pro" CTA
 * 3. Pro tier → Show content unblurred
 */
export default function ProGate({
  children,
  previewRows = 5,
  feature = "analytics",
}: {
  children: React.ReactNode;
  previewRows?: number;
  feature?: string;
}) {
  const { user, isLoading } = useAuth();

  if (isLoading) return <>{children}</>;
  if (user?.is_pro) return <>{children}</>;

  const isLoggedIn = !!user;

  const featureLabels: Record<string, string> = {
    analytics: "analytics, benchmarks, and detailed insights",
    "subject-lines": "the full subject line database",
    calendar: "campaign calendar and send timing data",
    export: "data export and reports",
    archive: "the full email archive (30+ days)",
  };

  const description = featureLabels[feature] || featureLabels.analytics;

  return (
    <div style={{ position: "relative" }}>
      {/* Blurred content */}
      <div
        style={{
          filter: "blur(6px)",
          pointerEvents: "none",
          userSelect: "none",
          maxHeight: previewRows * 60,
          overflow: "hidden",
        }}
      >
        {children}
      </div>

      {/* Overlay CTA */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(to bottom, rgba(250,249,247,0.5), rgba(250,249,247,0.95))",
        }}
      >
        <div style={{ textAlign: "center", maxWidth: 420, padding: 24 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: isLoggedIn
                ? "linear-gradient(135deg, #f0e6ff, #e0d0ff)"
                : "var(--color-accent-light)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}
          >
            {isLoggedIn ? (
              // Crown/star icon for upgrade
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#7c3aed"
                strokeWidth="2"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            ) : (
              // Lock icon for sign up
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--color-accent)"
                strokeWidth="2"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
            )}
          </div>

          <h3
            style={{
              fontSize: 18,
              fontWeight: 600,
              color: "var(--color-primary)",
              margin: "0 0 8px",
            }}
          >
            {isLoggedIn ? "Upgrade to Pro" : "Sign up free to unlock"}
          </h3>

          <p
            style={{
              fontSize: 14,
              color: "var(--color-secondary)",
              margin: "0 0 20px",
              lineHeight: 1.5,
            }}
          >
            {isLoggedIn
              ? `Get full access to ${description}. Starting at \u20B92,499/month.`
              : `Get full access to subject lines, analytics, benchmarks, and more.`}
          </p>

          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            {isLoggedIn ? (
              <Link
                href="/pricing"
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: "white",
                  background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
                  textDecoration: "none",
                  padding: "10px 24px",
                  borderRadius: 10,
                }}
              >
                View Plans
              </Link>
            ) : (
              <>
                <Link
                  href="/signup"
                  style={{
                    fontSize: 14,
                    fontWeight: 500,
                    color: "white",
                    background: "var(--color-accent)",
                    textDecoration: "none",
                    padding: "10px 24px",
                    borderRadius: 10,
                  }}
                >
                  Sign up free
                </Link>
                <Link
                  href="/login"
                  style={{
                    fontSize: 14,
                    fontWeight: 500,
                    color: "var(--color-secondary)",
                    textDecoration: "none",
                    padding: "10px 24px",
                    borderRadius: 10,
                    border: "1px solid var(--color-border)",
                  }}
                >
                  Log in
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
