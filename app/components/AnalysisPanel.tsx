"use client";

import React, { useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { API_BASE } from "../lib/constants";
import ScoreBadge from "./ScoreBadge";

type Finding = {
  text: string;
  type: "good" | "bad" | "neutral";
};

type DimensionResult = {
  score: number;
  grade: string;
  findings: Finding[];
};

type AnalysisData = {
  overall_score: number;
  overall_grade: string;
  dimensions: Record<string, DimensionResult> | null;
  suggestions?: string[];
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

function getGradeBgColor(score: number): string {
  if (score >= 85) return "#dcfce7";
  if (score >= 70) return "#dbeafe";
  if (score >= 60) return "#fef3c7";
  return "#fee2e2";
}

function FindingIcon({ type }: { type: string }) {
  if (type === "good") {
    return (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
        <polyline points="20 6 9 17 4 12" />
      </svg>
    );
  }
  if (type === "bad") {
    return (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
        <circle cx="12" cy="12" r="10" />
        <line x1="15" y1="9" x2="9" y2="15" />
        <line x1="9" y1="9" x2="15" y2="15" />
      </svg>
    );
  }
  return (
    <span style={{ width: 12, height: 12, display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#94a3b8", display: "block" }} />
    </span>
  );
}

function findingColor(type: string): string {
  if (type === "good") return "#15803d";
  if (type === "bad") return "#dc2626";
  return "#64748b";
}

export default function AnalysisPanel({ emailId }: AnalysisPanelProps) {
  const { token } = useAuth();
  const [data, setData] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const fetchAnalysis = async () => {
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      const headers: Record<string, string> = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;
      const res = await fetch(`${API_BASE}/emails/${emailId}/analysis`, { headers });
      if (!res.ok) {
        const body = await res.text().catch(() => "");
        throw new Error(body || `Error ${res.status}`);
      }
      const json = await res.json();
      setData(json);
      // Scroll to analysis results after a brief delay for render
      setTimeout(() => {
        panelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load analysis");
    } finally {
      setLoading(false);
    }
  };

  // Button state — not yet loaded
  if (!data && !error) {
    return (
      <div style={{ marginTop: 16 }}>
        <button
          onClick={fetchAnalysis}
          disabled={loading}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "8px 16px",
            fontSize: 13,
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
          {loading ? "Analyzing..." : "AI Led Analysis"}
        </button>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div style={{
        marginTop: 16,
        padding: 12,
        fontSize: 13,
        color: "#ef4444",
        background: "#fef2f2",
        borderRadius: 8,
        border: "1px solid #fecaca",
      }}>
        {error}
        <button
          onClick={() => { setError(null); setData(null); }}
          style={{
            marginLeft: 12,
            fontSize: 12,
            color: "#C2714A",
            background: "none",
            border: "none",
            cursor: "pointer",
            textDecoration: "underline",
          }}
        >
          Try again
        </button>
      </div>
    );
  }

  // Results panel
  if (!data) return null;
  return (
    <div
      ref={panelRef}
      style={{
        background: "#f8fafc",
        border: "1px solid #e2e8f0",
        borderRadius: 12,
        padding: 20,
        marginTop: 16,
      }}
    >
      {/* Header with overall score */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: data.dimensions ? 20 : 0 }}>
        <ScoreBadge score={data.overall_score} grade={data.overall_grade} size="md" />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 600, color: "#0f172a" }}>
            Email Score: {data.overall_score}/100
          </div>
          <div style={{ fontSize: 13, color: "#64748b" }}>
            {data.dimensions ? "Scored across 5 dimensions" : "Overall email quality score"}
          </div>
        </div>
      </div>

      {/* Dimensions — full analysis for Starter+ */}
      {data.dimensions && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {Object.entries(data.dimensions).map(([key, dim]) => {
            const meta = DIMENSION_META[key] || { label: key, icon: "" };
            const barColor = getBarColor(dim.score);
            const gradeBg = getGradeBgColor(dim.score);
            return (
              <div key={key}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#334155" }}>
                    {meta.icon} {meta.label}
                  </span>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: barColor }}>
                      {dim.score}
                    </span>
                    <span style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: barColor,
                      background: gradeBg,
                      padding: "1px 6px",
                      borderRadius: 4,
                      lineHeight: "16px",
                    }}>
                      {dim.grade}
                    </span>
                  </div>
                </div>
                <div style={{ height: 6, background: "#e2e8f0", borderRadius: 3, overflow: "hidden" }}>
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
                {dim.findings.length > 0 && (
                  <ul style={{ margin: "8px 0 0 0", padding: 0, listStyle: "none" }}>
                    {dim.findings.map((f, i) => {
                      const finding = typeof f === "string" ? { text: f, type: "neutral" as const } : f;
                      return (
                        <li key={i} style={{
                          fontSize: 12,
                          color: findingColor(finding.type),
                          lineHeight: 1.6,
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 6,
                          paddingLeft: 2,
                        }}>
                          <FindingIcon type={finding.type} />
                          {finding.text}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Suggestions — How to Improve */}
      {data.suggestions && data.suggestions.length > 0 && (
        <div style={{
          marginTop: 20,
          padding: 16,
          background: "#fffbeb",
          border: "1px solid #fde68a",
          borderRadius: 10,
        }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 8, marginBottom: 10,
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18h6" />
              <path d="M10 22h4" />
              <path d="M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z" />
            </svg>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#92400e" }}>
              How to Improve
            </span>
          </div>
          <ol style={{ margin: 0, paddingLeft: 20 }}>
            {data.suggestions.map((s, i) => (
              <li key={i} style={{
                fontSize: 12,
                color: "#78350f",
                lineHeight: 1.7,
                marginBottom: i < data.suggestions!.length - 1 ? 4 : 0,
              }}>
                {s}
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Gated — free users see upgrade CTA */}
      {!data.dimensions && data.gated && (
        <div
          style={{
            marginTop: 16,
            padding: 20,
            textAlign: "center",
            background: "white",
            borderRadius: 8,
            border: "1px dashed #e2e8f0",
          }}
        >
          <div style={{ fontSize: 14, fontWeight: 500, color: "#475569", marginBottom: 8 }}>
            Full breakdown available on Starter+
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
      )}
    </div>
  );
}
