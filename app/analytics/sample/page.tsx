"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "../../components/Header";

type BrandAnalytics = {
  brand: string;
  total_emails: number;
  primary_industry: string | null;
  emails_per_week: number;
  first_email: string | null;
  last_email: string | null;
  campaign_breakdown: Record<string, number>;
  send_day_distribution: Record<string, number>;
  send_time_distribution: Record<string, number>;
  subject_line_stats: {
    avg_length: number;
    emoji_usage_rate: number;
    top_words: string[];
  };
};

const SAMPLE_BRAND = "Nykaa";

export default function SampleAnalyticsPage() {
  const [data, setData] = useState<BrandAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  const API_BASE =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "https://milled-india-api.onrender.com";

  useEffect(() => {
    fetch(`${API_BASE}/analytics/brand/${encodeURIComponent(SAMPLE_BRAND)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((d) => setData(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [API_BASE]);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
      <Header activeRoute="/analytics" />

      <main style={{ maxWidth: 1000, margin: "0 auto", padding: "32px 24px" }}>
        {/* Page Header */}
        <div style={{ marginBottom: 8 }}>
          <div style={{
            display: "inline-block",
            padding: "5px 12px",
            backgroundColor: "#dbeafe",
            color: "#1d4ed8",
            fontSize: 13,
            fontWeight: 600,
            borderRadius: 20,
            marginBottom: 16,
          }}>
            Sample Report — Free Preview
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 700, color: "#0f172a", margin: "0 0 8px 0" }}>
            {SAMPLE_BRAND} — Email Analytics Deep Dive
          </h1>
          <p style={{ fontSize: 16, color: "#64748b", margin: "0 0 24px 0" }}>
            See exactly what a full brand analytics report looks like. Sign up free to unlock reports for any of our 150+ brands.
          </p>
        </div>

        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: 80 }}>
            <div style={{
              width: 40, height: 40,
              border: "3px solid #e2e8f0", borderTopColor: "#C2714A",
              borderRadius: "50%", animation: "spin 1s linear infinite",
            }} />
          </div>
        ) : !data ? (
          <div style={{
            padding: 40, textAlign: "center",
            backgroundColor: "#fff", borderRadius: 16, border: "1px solid #e2e8f0",
          }}>
            <p style={{ fontSize: 16, color: "#64748b" }}>
              Unable to load sample analytics. Please try again later.
            </p>
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: 16, marginBottom: 28,
            }}>
              {[
                { label: "Total Emails", value: data.total_emails, icon: "📧" },
                { label: "Emails / Week", value: data.emails_per_week, icon: "📅" },
                { label: "Industry", value: data.primary_industry || "N/A", icon: "🏷️" },
                { label: "Avg Subject Length", value: typeof data.subject_line_stats === "object" ? data.subject_line_stats.avg_length : "—", icon: "✉️" },
              ].map((s) => (
                <div key={s.label} style={{
                  backgroundColor: "#fff", borderRadius: 14,
                  border: "1px solid #e2e8f0", padding: 20,
                  display: "flex", alignItems: "center", gap: 14,
                }}>
                  <div style={{
                    width: 44, height: 44, backgroundColor: "#F5E6DC",
                    borderRadius: 10, display: "flex", alignItems: "center",
                    justifyContent: "center", fontSize: 22, flexShrink: 0,
                  }}>{s.icon}</div>
                  <div>
                    <div style={{ fontSize: 24, fontWeight: 700, color: "#0f172a" }}>{s.value}</div>
                    <div style={{ fontSize: 12, color: "#64748b" }}>{s.label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Two-Column: Campaign Breakdown + Send Days */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 28 }}>
              {/* Campaign Breakdown */}
              <div style={{
                backgroundColor: "#fff", borderRadius: 14,
                border: "1px solid #e2e8f0", padding: 24,
              }}>
                <h2 style={{ fontSize: 17, fontWeight: 600, color: "#0f172a", margin: "0 0 16px 0" }}>
                  Campaign Type Breakdown
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {Object.entries(data.campaign_breakdown)
                    .sort(([, a], [, b]) => b - a)
                    .map(([type, count]) => {
                      const max = Math.max(...Object.values(data.campaign_breakdown));
                      return (
                        <div key={type}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                            <span style={{ fontSize: 14, color: "#374151" }}>{type}</span>
                            <span style={{ fontSize: 14, fontWeight: 600, color: "#C2714A" }}>{count}</span>
                          </div>
                          <div style={{ height: 6, backgroundColor: "#f1f5f9", borderRadius: 3 }}>
                            <div style={{
                              height: 6, backgroundColor: "#C2714A", borderRadius: 3,
                              width: `${(count / max) * 100}%`, transition: "width 0.5s ease",
                            }} />
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Send Day Distribution */}
              <div style={{
                backgroundColor: "#fff", borderRadius: 14,
                border: "1px solid #e2e8f0", padding: 24,
              }}>
                <h2 style={{ fontSize: 17, fontWeight: 600, color: "#0f172a", margin: "0 0 16px 0" }}>
                  Send Day Distribution
                </h2>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {Object.entries(data.send_day_distribution).map(([day, count]) => {
                    const max = Math.max(...Object.values(data.send_day_distribution));
                    const intensity = max > 0 ? count / max : 0;
                    return (
                      <div key={day} style={{
                        flex: 1, minWidth: 60, padding: "12px 8px",
                        backgroundColor: `rgba(194, 113, 74, ${0.08 + intensity * 0.25})`,
                        borderRadius: 10, textAlign: "center",
                        border: "1px solid #e2e8f0",
                      }}>
                        <div style={{ fontSize: 11, color: "#64748b", marginBottom: 4 }}>{day.slice(0, 3)}</div>
                        <div style={{ fontSize: 18, fontWeight: 700, color: "#0f172a" }}>{count}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Subject Line Stats */}
            {typeof data.subject_line_stats === "object" && (
              <div style={{
                backgroundColor: "#fff", borderRadius: 14,
                border: "1px solid #e2e8f0", padding: 24, marginBottom: 28,
              }}>
                <h2 style={{ fontSize: 17, fontWeight: 600, color: "#0f172a", margin: "0 0 16px 0" }}>
                  Subject Line Analysis
                </h2>
                <div style={{ display: "flex", gap: 24, flexWrap: "wrap", marginBottom: 20 }}>
                  <div style={{ padding: "12px 20px", backgroundColor: "#f8fafc", borderRadius: 10, border: "1px solid #e2e8f0" }}>
                    <div style={{ fontSize: 12, color: "#64748b" }}>Avg Length</div>
                    <div style={{ fontSize: 22, fontWeight: 700, color: "#0f172a" }}>{data.subject_line_stats.avg_length} chars</div>
                  </div>
                  <div style={{ padding: "12px 20px", backgroundColor: "#f8fafc", borderRadius: 10, border: "1px solid #e2e8f0" }}>
                    <div style={{ fontSize: 12, color: "#64748b" }}>Emoji Usage</div>
                    <div style={{ fontSize: 22, fontWeight: 700, color: "#0f172a" }}>{data.subject_line_stats.emoji_usage_rate}%</div>
                  </div>
                </div>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: "#374151", margin: "0 0 10px 0" }}>
                  Top Subject Line Words
                </h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {data.subject_line_stats.top_words.map((word) => (
                    <span key={word} style={{
                      padding: "6px 14px", backgroundColor: "#F5E6DC",
                      borderRadius: 20, fontSize: 13, color: "#A85E3A", fontWeight: 500,
                    }}>
                      {word}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* CTA Banner */}
            <div style={{
              background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
              borderRadius: 16, padding: "40px 32px", textAlign: "center",
            }}>
              <h2 style={{ fontSize: 24, fontWeight: 700, color: "white", marginBottom: 12 }}>
                Want this for any brand?
              </h2>
              <p style={{ fontSize: 16, color: "rgba(255,255,255,0.7)", marginBottom: 24, maxWidth: 480, margin: "0 auto 24px" }}>
                Sign up free to unlock detailed analytics for 150+ brands — campaign breakdowns, send timing, subject line insights, and more.
              </p>
              <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                <Link href="/signup" style={{
                  padding: "14px 32px", fontSize: 15, fontWeight: 600,
                  color: "#0f172a", backgroundColor: "#fff",
                  textDecoration: "none", borderRadius: 10,
                  transition: "transform 0.15s ease",
                }}>
                  Create Free Account
                </Link>
                <Link href="/analytics" style={{
                  padding: "14px 32px", fontSize: 15, fontWeight: 600,
                  color: "rgba(255,255,255,0.9)", backgroundColor: "transparent",
                  textDecoration: "none", borderRadius: 10,
                  border: "1px solid rgba(255,255,255,0.3)",
                }}>
                  View Analytics Dashboard
                </Link>
              </div>
            </div>
          </>
        )}
      </main>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 768px) {
          main div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
