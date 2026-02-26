"use client";

import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { PLAN_NAMES, PLAN_PRICES, formatPrice, canAccess, getMinPlanFor, type PlanTier, type FeatureKey, FEATURE_LABELS } from "../lib/plans";

type BlurredOverlayProps = {
  children: React.ReactNode;
  feature: FeatureKey;
  previewRows?: number;
};

export default function BlurredOverlay({ children, feature, previewRows = 5 }: BlurredOverlayProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) return <>{children}</>;

  const plan = (user?.effective_plan || "free") as PlanTier;
  if (canAccess(plan, feature)) return <>{children}</>;

  const isLoggedIn = !!user;
  const requiredPlan = getMinPlanFor(feature);
  const planName = PLAN_NAMES[requiredPlan];
  const price = PLAN_PRICES[requiredPlan];
  const featureLabel = FEATURE_LABELS[feature];

  return (
    <div style={{ position: "relative" }}>
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

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(to bottom, rgba(250,249,247,0.5), rgba(250,249,247,0.95))",
        }}
      >
        <div style={{ textAlign: "center", maxWidth: 420, padding: 24 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: isLoggedIn
                ? "linear-gradient(135deg, var(--color-accent-light), #f0ddd0)"
                : "var(--color-accent-light)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}
          >
            {isLoggedIn ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
            )}
          </div>

          <h3 style={{ fontSize: 18, fontWeight: 600, color: "var(--color-primary)", margin: "0 0 8px" }}>
            {isLoggedIn ? `Upgrade to ${planName}` : "Sign up to unlock"}
          </h3>

          <p style={{ fontSize: 14, color: "var(--color-secondary)", margin: "0 0 20px", lineHeight: 1.5 }}>
            {isLoggedIn
              ? `${featureLabel} is available on the ${planName} plan. Starting at ${formatPrice(price.monthly)}/month.`
              : `Sign up to access ${featureLabel.toLowerCase()} and more.`}
          </p>

          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            {isLoggedIn ? (
              <Link
                href="/pricing"
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: "white",
                  background: "linear-gradient(135deg, var(--color-accent), var(--color-accent-hover))",
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
