"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PLAN_NAMES, PLAN_PRICES, formatPrice, type PlanTier, type FeatureKey, FEATURE_LABELS } from "../lib/plans";

type UpgradeModalProps = {
  isOpen: boolean;
  onClose: () => void;
  feature: FeatureKey;
  requiredPlan: PlanTier;
};

export default function UpgradeModal({ isOpen, onClose, feature, requiredPlan }: UpgradeModalProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      const t = setTimeout(() => setVisible(false), 200);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  if (!visible) return null;

  const planName = PLAN_NAMES[requiredPlan];
  const price = PLAN_PRICES[requiredPlan];
  const featureLabel = FEATURE_LABELS[feature];

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.4)",
        backdropFilter: "blur(4px)",
        opacity: isOpen ? 1 : 0,
        transition: "opacity 0.2s ease",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "white",
          borderRadius: 16,
          padding: "32px 28px",
          maxWidth: 420,
          width: "90%",
          textAlign: "center",
          boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
          transform: isOpen ? "scale(1)" : "scale(0.95)",
          transition: "transform 0.2s ease",
        }}
      >
        {/* Icon */}
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 14,
            background: "linear-gradient(135deg, var(--color-accent-light), #f0ddd0)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px",
          }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </div>

        <h2
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: "var(--color-primary)",
            margin: "0 0 8px",
          }}
        >
          Upgrade to {planName}
        </h2>

        <p
          style={{
            fontSize: 14,
            color: "var(--color-secondary)",
            margin: "0 0 24px",
            lineHeight: 1.6,
          }}
        >
          {featureLabel} requires the {planName} plan or higher.
          Starting at {formatPrice(price.monthly)}/month.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <Link
            href="/pricing"
            style={{
              display: "inline-block",
              fontSize: 14,
              fontWeight: 600,
              color: "white",
              background: "linear-gradient(135deg, var(--color-accent), var(--color-accent-hover))",
              textDecoration: "none",
              padding: "12px 24px",
              borderRadius: 10,
            }}
          >
            View Plans
          </Link>
          <button
            onClick={onClose}
            style={{
              fontSize: 14,
              fontWeight: 500,
              color: "var(--color-secondary)",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "8px 0",
            }}
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}
