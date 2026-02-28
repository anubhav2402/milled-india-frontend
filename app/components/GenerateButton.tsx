"use client";

import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { canAccess, getMinPlanFor, type PlanTier } from "../lib/plans";
import UpgradeModal from "./UpgradeModal";
import GeneratorModal from "./GeneratorModal";

interface GenerateButtonProps {
  emailId: number;
  emailSubject: string;
  emailBrand?: string;
}

export default function GenerateButton({ emailId, emailSubject, emailBrand }: GenerateButtonProps) {
  const { user } = useAuth();
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [showGenerator, setShowGenerator] = useState(false);

  const userPlan = (user?.effective_plan || "free") as PlanTier;
  const hasAccess = canAccess(userPlan, "ai_generator");

  const handleClick = () => {
    if (!user) {
      // Redirect to signup
      window.location.href = "/signup";
      return;
    }
    if (!hasAccess) {
      setShowUpgrade(true);
      return;
    }
    setShowGenerator(true);
  };

  return (
    <>
      <button
        onClick={handleClick}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          padding: "8px 14px",
          fontSize: 12,
          fontWeight: 500,
          color: "#7c3aed",
          background: "#f5f3ff",
          border: "1px solid #ddd6fe",
          borderRadius: 8,
          cursor: "pointer",
          transition: "all 150ms ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#ede9fe";
          e.currentTarget.style.borderColor = "#c4b5fd";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "#f5f3ff";
          e.currentTarget.style.borderColor = "#ddd6fe";
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
        Create One Like This
        {!hasAccess && (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" opacity="0.6">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" fill="none" stroke="currentColor" strokeWidth="2" />
          </svg>
        )}
      </button>

      <UpgradeModal
        isOpen={showUpgrade}
        onClose={() => setShowUpgrade(false)}
        feature="ai_generator"
        requiredPlan={getMinPlanFor("ai_generator")}
      />

      <GeneratorModal
        isOpen={showGenerator}
        onClose={() => setShowGenerator(false)}
        emailId={emailId}
        emailSubject={emailSubject}
        emailBrand={emailBrand}
      />
    </>
  );
}
