"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "../components/Header";
import Badge from "../components/Badge";
import AuthGate from "../components/AuthGate";
import { useAuth } from "../context/AuthContext";
import { API_BASE, INDUSTRIES, CAMPAIGN_TYPE_COLORS } from "../lib/constants";

type IndustryData = {
  industry: string;
  total_emails: number | string;
  total_brands: number;
  top_brands: { brand: string; count: number | string }[];
  campaign_type_mix: Record<string, number> | string;
  send_day_distribution: Record<string, number> | string;
  avg_emails_per_brand: number | string;
  avg_subject_length: number | string;
};

export default function BenchmarksPage() {
  const { user, token } = useAuth();
  const [selectedIndustry, setSelectedIndustry] = useState(INDUSTRIES[0]);
  const [data, setData] = useState<IndustryData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIndustry = async () => {
      setLoading(true);
      try {
        const headers: Record<string, string> = {};
        if (token) headers["Authorization"] = `Bearer ${token}`;

        const res = await fetch(
          `${API_BASE}/analytics/industry/${encodeURIComponent(selectedIndustry)}`,
          { headers }
        );
        if (res.ok) setData(await res.json());
      } catch (err) {
        console.error("Failed to fetch:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchIndustry();
  }, [selectedIndustry, token]);

  const isAuthenticated = data && typeof data.total_emails === "number";
  const campaignMix = isAuthenticated && typeof data.campaign_type_mix === "object" ? data.campaign_type_mix as Record<string, number> : null;
  const sendDays = isAuthenticated && typeof data.send_day_distribution === "object" ? data.send_day_distribution as Record<string, number> : null;
  const maxDayCount = sendDays ? Math.max(...Object.values(sendDays)) : 0;

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-surface)" }}>
      <Header activeRoute="/benchmarks" />

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "32px 24px" }}>
        {/* Page Header */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{
            fontFamily: "var(--font-dm-serif)", fontSize: 28,
            color: "var(--color-primary)", margin: "0 0 6px",
          }}>
            Industry Benchmarks
          </h1>
          <p style={{ fontSize: 14, color: "var(--color-secondary)", margin: 0 }}>
            How does your email program compare?
          </p>
        </div>

        {/* Industry Selector */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 28 }}>
          {INDUSTRIES.map((industry) => (
            <button
              key={industry}
              onClick={() => setSelectedIndustry(industry)}
              style={{
                padding: "8px 16px",
                borderRadius: 20,
                fontSize: 13,
                fontWeight: 500,
                cursor: "pointer",
                border: "none",
                transition: "all 150ms ease",
                background: selectedIndustry === industry ? "var(--color-accent)" : "white",
                color: selectedIndustry === industry ? "white" : "var(--color-secondary)",
                boxShadow: selectedIndustry === industry ? "none" : "0 1px 3px rgba(0,0,0,0.04)",
              }}
            >
              {industry}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ background: "white", borderRadius: 14, padding: 40, textAlign: "center" }}>
            <div style={{
              width: 40, height: 40, border: "3px solid var(--color-border)",
              borderTopColor: "var(--color-accent)", borderRadius: "50%",
              animation: "spin 1s linear infinite", margin: "0 auto",
            }} />
          </div>
        ) : data ? (
          <>
            {/* Stats Grid */}
            <div style={{
              display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: 16, marginBottom: 24,
            }}>
              {[
                { label: "Total Emails", value: data.total_emails },
                { label: "Brands", value: data.total_brands },
                { label: "Avg/Brand", value: data.avg_emails_per_brand },
                { label: "Avg Subject", value: typeof data.avg_subject_length === "number" ? `${data.avg_subject_length}ch` : data.avg_subject_length },
              ].map((stat) => (
                <div key={stat.label} style={{
                  background: "white", borderRadius: 12, padding: "20px 24px",
                  border: "1px solid var(--color-border)", textAlign: "center",
                }}>
                  <div style={{ fontSize: 28, fontWeight: 700, color: "var(--color-primary)", marginBottom: 4 }}>
                    {stat.value}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--color-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Campaign Mix + Send Days */}
            {isAuthenticated ? (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }} className="email-detail-grid">
                {/* Campaign Type Mix */}
                {campaignMix && (
                  <div style={{
                    background: "white", borderRadius: 14, padding: 24,
                    border: "1px solid var(--color-border)",
                  }}>
                    <h3 style={{ fontSize: 14, fontWeight: 600, color: "var(--color-primary)", margin: "0 0 16px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      Campaign Type Mix
                    </h3>
                    {Object.entries(campaignMix)
                      .sort(([, a], [, b]) => b - a)
                      .slice(0, 8)
                      .map(([type, pct]) => (
                        <div key={type} style={{ marginBottom: 12 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
                            <span style={{ color: "var(--color-primary)", fontWeight: 500 }}>{type}</span>
                            <span style={{ color: "var(--color-tertiary)" }}>{Math.round(pct)}%</span>
                          </div>
                          <div style={{ height: 6, borderRadius: 3, background: "var(--color-surface)" }}>
                            <div style={{
                              height: "100%", borderRadius: 3, width: `${pct}%`,
                              background: CAMPAIGN_TYPE_COLORS[type] || "var(--color-accent)",
                              transition: "width 500ms ease",
                            }} />
                          </div>
                        </div>
                      ))}
                  </div>
                )}

                {/* Best Send Days */}
                {sendDays && (
                  <div style={{
                    background: "white", borderRadius: 14, padding: 24,
                    border: "1px solid var(--color-border)",
                  }}>
                    <h3 style={{ fontSize: 14, fontWeight: 600, color: "var(--color-primary)", margin: "0 0 16px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      Best Send Days
                    </h3>
                    {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => {
                      const count = sendDays[day] || 0;
                      const pct = maxDayCount > 0 ? (count / maxDayCount) * 100 : 0;
                      const isPeak = count === maxDayCount && count > 0;
                      return (
                        <div key={day} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                          <span style={{ width: 32, fontSize: 12, color: "var(--color-tertiary)", textAlign: "right" }}>
                            {day.slice(0, 3)}
                          </span>
                          <div style={{ flex: 1, height: 6, borderRadius: 3, background: "var(--color-surface)" }}>
                            <div style={{
                              height: "100%", borderRadius: 3, width: `${pct}%`,
                              background: isPeak ? "var(--color-accent)" : "#94a3b8",
                              transition: "width 500ms ease",
                            }} />
                          </div>
                          <span style={{
                            width: 36, fontSize: 12, textAlign: "right",
                            color: isPeak ? "var(--color-accent)" : "var(--color-tertiary)",
                            fontWeight: isPeak ? 600 : 400,
                          }}>
                            {count}
                            {isPeak && " ←"}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              <AuthGate previewRows={5}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
                  <div style={{ background: "white", borderRadius: 14, padding: 24, height: 280 }} />
                  <div style={{ background: "white", borderRadius: 14, padding: 24, height: 280 }} />
                </div>
              </AuthGate>
            )}

            {/* Top Brands */}
            {data.top_brands.length > 0 && (
              <div style={{
                background: "white", borderRadius: 14, padding: 24,
                border: "1px solid var(--color-border)",
              }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: "var(--color-primary)", margin: "0 0 16px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Top Brands in {selectedIndustry}
                </h3>
                {data.top_brands.map((b, idx) => (
                  <Link
                    key={b.brand}
                    href={`/brand/${encodeURIComponent(b.brand.toLowerCase())}`}
                    style={{
                      display: "flex", alignItems: "center", gap: 12,
                      padding: "10px 0", textDecoration: "none",
                      borderBottom: idx < data.top_brands.length - 1 ? "1px solid var(--color-border)" : "none",
                    }}
                  >
                    <span style={{
                      width: 28, height: 28, borderRadius: 8,
                      background: "var(--color-accent-light)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 12, fontWeight: 600, color: "var(--color-accent)",
                    }}>
                      {idx + 1}
                    </span>
                    <span style={{ flex: 1, fontSize: 14, fontWeight: 500, color: "var(--color-primary)", textTransform: "capitalize" }}>
                      {b.brand}
                    </span>
                    <span style={{ fontSize: 13, color: "var(--color-tertiary)" }}>
                      {b.count} emails
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </>
        ) : (
          <div style={{ textAlign: "center", padding: 40 }}>
            <p style={{ color: "var(--color-secondary)" }}>No data available for this industry.</p>
          </div>
        )}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
