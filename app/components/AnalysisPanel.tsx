"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { API_BASE } from "../lib/constants";
import ScoreBadge from "./ScoreBadge";

type DimensionResult = {
  score: number;
  grade: string;
  findings: string[];
};

type AnalysisData = {
  overall_score: number;
  overall_grade: string;
  dimensions: Record<string, DimensionResult> | null;
  gated?: boolean;
  required_plan?: string;
};

interface AnalysisPanelProps {
  emailId: number;
}

const DIMENSION_META: Record<string, { label: string; icon: string }> = {
  subject: { label: "Subject Line", icon: "\u2709" },
  copy: { label: "Copy & Content", icon: "\u270D" },
  cta: { label: "Call to Action", icon: "\u261B" },
  design: { label: "Design & Layout", icon: "\u25A6" },
  strategy: { label: "Strategy", icon: "\u2691" },
};

function getBarColor(score: number): string {
  if (score >= 85) return "#10b981";
  if (score >= 70) return "#3b82f6";
  if (score >= 60) return "#f59e0b";
  return "#ef4444";
}

export default function AnalysisPanel({ emailId }: AnalysisPanelProps) {
  const { user, token } = useAuth();
  const [data, setData] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);

  const fetchAnalysis = async () => {
    setLoading(true);
    setError(null);
    try {
      const headers: Record<string, string> = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;
      const res = await fetch(`${API_BASE}/emails/${emailId}/analysis`, { headers });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const json = await res.json();
      setData(json);
      setExpanded(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load analysis");
    } finally {
      setLoading(false);
    }
  };

  if (!expanded && !data) {
    return (
      <button
        onClick={fetchAnalysis}
        disabled={loading}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          padding: "6px 14px",
          fontSize: 12,
          fontWeight: 500,
          color: "#C2714A",
          background: "#FEF7F3",
          border: "1px solid #F0D5C5",
          borderRadius: 8,
          cursor: loading ? "wait" : "pointer",
          transition: "all 150ms ease",
        }}
      >
        {loading ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: "spin 1s linear infinite" }}>
            <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
            <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
          </svg>
        )}
        {loading ? "Analyzing..." : "Analyze Email"}
      </button>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 12, fontSize: 13, color: "#ef4444", background: "#fef2f2", borderRadius: 8 }}>
        {error}
      </div>
    );
  }

  if (!data) return null;

  return (
    <div
      style={{
        background: "white",
        border: "1px solid #e2e8f0",
        borderRadius: 12,
        padding: 20,
        marginTop: 16,
      }}
    >
      {/* Header with overall score */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
        <ScoreBadge score={data.overall_score} grade={data.overall_grade} size="md" />
        <div>
          <div style={{ fontSize: 16, fontWeight: 600, color: "#0f172a" }}>
            Email Score
          </div>
          <div style={{ fontSize: 13, color: "#64748b" }}>
            Scored across 5 dimensions
          </div>
        </div>
        <button
          onClick={() => setExpanded(false)}
          style={{
            marginLeft: "auto",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#94a3b8",
            fontSize: 18,
          }}
          title="Collapse"
        >
          &times;
        </button>
      </div>

      {/* Dimensions */}
      {data.dimensions ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {Object.entries(data.dimensions).map(([key, dim]) => {
            const meta = DIMENSION_META[key] || { label: key, icon: "" };
            const barColor = getBarColor(dim.score);
            return (
              <div key={key}>
                {/* Dimension header */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#334155" }}>
                    {meta.icon} {meta.label}
                  </span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: barColor }}>
                    {dim.score} {dim.grade}
                  </span>
                </div>
                {/* Progress bar */}
                <div style={{ height: 6, background: "#f1f5f9", borderRadius: 3, overflow: "hidden" }}>
                  <div
                    style={{
                      height: "100%",
                      width: `${dim.score}%`,
                      background: barColor,
                      borderRadius: 3,
                      transition: "width 0.5s ease",
                    }}
                  />
                </div>
                {/* Findings */}
                {dim.findings.length > 0 && (
                  <ul style={{ margin: "6px 0 0 0", padding: "0 0 0 16px", listStyle: "none" }}>
                    {dim.findings.map((f, i) => (
                      <li key={i} style={{ fontSize: 12, color: "#64748b", lineHeight: 1.6 }}>
                        <span style={{ color: "#94a3b8", marginRight: 4 }}>&bull;</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      ) : data.gated ? (
        <div
          style={{
            padding: 24,
            textAlign: "center",
            background: "#f8fafc",
            borderRadius: 8,
            border: "1px dashed #e2e8f0",
          }}
        >
          <div style={{ fontSize: 14, fontWeight: 500, color: "#475569", marginBottom: 8 }}>
            Full analysis available on Starter+
          </div>
          <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 12 }}>
            See detailed scores for Subject, Copy, CTA, Design & Strategy
          </div>
          <a
            href="/pricing"
            style={{
              display: "inline-block",
              padding: "8px 20px",
              fontSize: 13,
              fontWeight: 500,
              color: "white",
              background: "#C2714A",
              borderRadius: 8,
              textDecoration: "none",
            }}
          >
            Upgrade Now
          </a>
        </div>
      ) : null}
    </div>
  );
}
