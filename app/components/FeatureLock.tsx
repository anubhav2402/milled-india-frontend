"use client";

import { useState } from "react";
import { PLAN_NAMES, type PlanTier } from "../lib/plans";

type FeatureLockProps = {
  requiredPlan: PlanTier;
  size?: number;
};

export default function FeatureLock({ requiredPlan, size = 16 }: FeatureLockProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <span
      style={{ position: "relative", display: "inline-flex", alignItems: "center", cursor: "default" }}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="var(--color-secondary)"
        strokeWidth="2"
        style={{ opacity: 0.5 }}
      >
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0110 0v4" />
      </svg>

      {showTooltip && (
        <span
          style={{
            position: "absolute",
            bottom: "100%",
            left: "50%",
            transform: "translateX(-50%)",
            marginBottom: 8,
            padding: "6px 12px",
            borderRadius: 8,
            background: "var(--color-primary)",
            color: "white",
            fontSize: 12,
            fontWeight: 500,
            whiteSpace: "nowrap",
            zIndex: 100,
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          }}
        >
          Available on {PLAN_NAMES[requiredPlan]}
        </span>
      )}
    </span>
  );
}
