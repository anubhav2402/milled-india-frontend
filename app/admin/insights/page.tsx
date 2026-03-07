"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "../../components/Header";
import { useAuth } from "../../context/AuthContext";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://milled-india-api.onrender.com";

type MetricPair = { this_week: number; last_week: number; change_pct: number };
type DayPair = { this_week: string | null; last_week: string | null };
type MoverData = { brand: string | null; change_pct: number; this_week_count: number; last_week_count: number };

type Scoreboard = {
  week: string;
  metrics: {
    total_emails: MetricPair;
    avg_subject_length: MetricPair;
    discount_mention_pct: MetricPair;
    emoji_usage_pct: MetricPair;
    weekend_emails_pct: MetricPair;
    busiest_day: DayPair;
    biggest_mover: MoverData;
  };
};

type SequenceEmail = { subject: string; type: string | null; sent_at: string; gap_hours_from_previous: number | null };
type Sequence = { brand: string; email_count: number; span_days: number; keyword_overlap: string[]; emails: SequenceEmail[] };
type BrandSequences = { week: string; total_sequences_found: number; sequences: Sequence[] };

type FormulaData = { this_week_count: number; this_week_pct: number; trailing_4wk_avg_pct: number; change_pct: number; trend: string };
type SubjectFormulas = {
  week: string;
  this_week_total_subjects: number;
  distribution: Record<string, FormulaData>;
  examples: Record<string, string[]>;
  rising: string[];
  falling: string[];
};

type TacticAlert = { signal: string; this_week: number; trailing_avg: number; change_type: string; change_pct: number | null };
type BrandTactic = { brand: string; email_count_this_week: number; email_count_trailing: number; alerts: TacticAlert[] };
type NewTactics = { week: string; total_brands_with_alerts: number; alerts: BrandTactic[] };

const TREND_COLORS: Record<string, string> = {
  rising: "#16a34a",
  falling: "#dc2626",
  stable: "#64748b",
};

const TREND_ARROWS: Record<string, string> = {
  rising: "\u2191",
  falling: "\u2193",
  stable: "\u2192",
};

const CHANGE_TYPE_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  spike: { bg: "#dcfce7", color: "#16a34a", label: "Spike" },
  drop: { bg: "#fef2f2", color: "#dc2626", label: "Drop" },
  appeared: { bg: "#dbeafe", color: "#2563eb", label: "New" },
  disappeared: { bg: "#fef3c7", color: "#d97706", label: "Gone" },
};

const SIGNAL_LABELS: Record<string, string> = {
  emoji_rate: "Emoji usage",
  discount_rate: "Discount mentions",
  question_rate: "Question marks",
  personalization_rate: "Personalization",
  avg_subject_length: "Subject length",
};

const FORMULA_LABELS: Record<string, string> = {
  discount_led: "Discount-led",
  urgency: "Urgency",
  number_list: "Number/list",
  personalization: "Personalization",
  curiosity_teaser: "Curiosity/teaser",
  social_proof: "Social proof",
  question: "Question",
  command: "Command",
  other: "Other",
};

function ChangeBadge({ value, suffix = "%" }: { value: number; suffix?: string }) {
  const isPositive = value > 0;
  const color = isPositive ? "#16a34a" : value < 0 ? "#dc2626" : "#64748b";
  return (
    <span style={{ fontSize: 12, fontWeight: 600, color }}>
      {isPositive ? "+" : ""}{value.toFixed(1)}{suffix}
    </span>
  );
}

function StatCard({ label, value, change, suffix }: { label: string; value: string | number; change?: number; suffix?: string }) {
  return (
    <div style={{
      background: "white", borderRadius: 12, border: "1px solid #e2e8f0",
      padding: "18px 20px", minWidth: 0,
    }}>
      <div style={{ fontSize: 22, fontWeight: 700, color: "#0f172a" }}>{value}</div>
      <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>{label}</div>
      {change !== undefined && (
        <div style={{ marginTop: 6 }}>
          <ChangeBadge value={change} suffix={suffix} />
          <span style={{ fontSize: 11, color: "#94a3b8", marginLeft: 4 }}>vs last week</span>
        </div>
      )}
    </div>
  );
}

function SectionHeader({ title, subtitle, collapsed, onToggle }: { title: string; subtitle?: string; collapsed: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      style={{
        width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "16px 20px", background: "white", border: "1px solid #e2e8f0",
        borderRadius: collapsed ? 12 : "12px 12px 0 0", cursor: "pointer", textAlign: "left",
      }}
    >
      <div>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", margin: 0 }}>{title}</h2>
        {subtitle && <p style={{ fontSize: 13, color: "#64748b", margin: "4px 0 0" }}>{subtitle}</p>}
      </div>
      <span style={{ fontSize: 18, color: "#94a3b8", transform: collapsed ? "rotate(-90deg)" : "rotate(0)", transition: "transform 0.2s" }}>
        &#9660;
      </span>
    </button>
  );
}

export default function AdminInsightsPage() {
  const { user, token, isLoading: authLoading } = useAuth();

  const [scoreboard, setScoreboard] = useState<Scoreboard | null>(null);
  const [sequences, setSequences] = useState<BrandSequences | null>(null);
  const [formulas, setFormulas] = useState<SubjectFormulas | null>(null);
  const [tactics, setTactics] = useState<NewTactics | null>(null);

  const [loading, setLoading] = useState(true);
  const [computing, setComputing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({
    scoreboard: false,
    sequences: false,
    formulas: false,
    tactics: false,
  });

  const [expandedSeqs, setExpandedSeqs] = useState<Set<number>>(new Set());

  const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } : {};

  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const [s1, s2, s3, s4] = await Promise.allSettled([
        fetch(`${API_BASE}/insights/weekly_scoreboard`, { headers }).then(r => r.ok ? r.json() : null),
        fetch(`${API_BASE}/insights/brand_sequences`, { headers }).then(r => r.ok ? r.json() : null),
        fetch(`${API_BASE}/insights/subject_formulas`, { headers }).then(r => r.ok ? r.json() : null),
        fetch(`${API_BASE}/insights/new_tactics`, { headers }).then(r => r.ok ? r.json() : null),
      ]);
      setScoreboard(s1.status === "fulfilled" ? s1.value : null);
      setSequences(s2.status === "fulfilled" ? s2.value : null);
      setFormulas(s3.status === "fulfilled" ? s3.value : null);
      setTactics(s4.status === "fulfilled" ? s4.value : null);
    } catch {
      setError("Failed to load insights");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return;
    fetchAll();
  }, [token]);

  const handleCompute = async () => {
    setComputing(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/admin/insights/compute`, {
        method: "POST", headers,
      });
      if (res.ok) {
        await fetchAll();
      } else {
        const data = await res.json();
        setError(data.detail || "Failed to compute insights");
      }
    } catch {
      setError("Network error during computation");
    } finally {
      setComputing(false);
    }
  };

  const toggleCollapse = (key: string) => {
    setCollapsed(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleSeq = (idx: number) => {
    setExpandedSeqs(prev => {
      const next = new Set(prev);
      next.has(idx) ? next.delete(idx) : next.add(idx);
      return next;
    });
  };

  // Auth gate
  if (!authLoading && (!user || !user.is_admin)) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
        <Header />
        <div style={{
          maxWidth: 480, margin: "80px auto", padding: "40px 32px",
          textAlign: "center", background: "white", borderRadius: 16,
          border: "1px solid #e2e8f0",
        }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>&#128274;</div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0f172a", margin: "0 0 8px" }}>Admin Access Only</h1>
          <p style={{ fontSize: 15, color: "#64748b", margin: "0 0 24px" }}>This page is restricted to admin accounts.</p>
          <Link href="/" style={{
            display: "inline-block", padding: "10px 24px", fontSize: 14,
            fontWeight: 600, color: "#fff", backgroundColor: "#C2714A",
            textDecoration: "none", borderRadius: 8,
          }}>Go to Homepage</Link>
        </div>
      </div>
    );
  }

  const noData = !scoreboard && !sequences && !formulas && !tactics && !loading;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
      <Header />

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "24px 20px" }}>
        {/* Page Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: "#0f172a", margin: 0 }}>Insights Engine</h1>
            <p style={{ fontSize: 14, color: "#64748b", margin: "4px 0 0" }}>
              {scoreboard ? `Week ${scoreboard.week}` : "Weekly intelligence from your email database"}
            </p>
          </div>
          <button
            onClick={handleCompute}
            disabled={computing}
            style={{
              padding: "10px 24px", borderRadius: 10, border: "none",
              background: computing ? "#94a3b8" : "#C2714A", color: "white",
              fontSize: 14, fontWeight: 600, cursor: computing ? "not-allowed" : "pointer",
            }}
          >
            {computing ? "Computing..." : "Compute Insights"}
          </button>
        </div>

        {error && (
          <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: "12px 16px", marginBottom: 16, color: "#dc2626", fontSize: 14 }}>
            {error}
          </div>
        )}

        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: 80 }}>
            <div style={{
              width: 36, height: 36, border: "3px solid #e2e8f0",
              borderTopColor: "#C2714A", borderRadius: "50%",
              animation: "spin 1s linear infinite",
            }} />
          </div>
        ) : noData ? (
          <div style={{ textAlign: "center", padding: "80px 20px", background: "white", borderRadius: 14, border: "1px solid #e2e8f0" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>&#128202;</div>
            <h2 style={{ fontSize: 20, fontWeight: 600, color: "#0f172a", marginBottom: 8 }}>No insights computed yet</h2>
            <p style={{ fontSize: 15, color: "#64748b", marginBottom: 24 }}>Click &quot;Compute Insights&quot; to generate your first weekly analysis.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* ── 1. Weekly Scoreboard ── */}
            {scoreboard && (
              <div>
                <SectionHeader
                  title="Weekly Scoreboard"
                  subtitle={`Week ${scoreboard.week}`}
                  collapsed={collapsed.scoreboard}
                  onToggle={() => toggleCollapse("scoreboard")}
                />
                {!collapsed.scoreboard && (
                  <div style={{ background: "white", border: "1px solid #e2e8f0", borderTop: "none", borderRadius: "0 0 12px 12px", padding: 20 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12 }}>
                      <StatCard
                        label="Total Emails"
                        value={scoreboard.metrics.total_emails.this_week.toLocaleString()}
                        change={scoreboard.metrics.total_emails.change_pct}
                      />
                      <StatCard
                        label="Avg Subject Length"
                        value={`${scoreboard.metrics.avg_subject_length.this_week} chars`}
                        change={scoreboard.metrics.avg_subject_length.change_pct}
                      />
                      <StatCard
                        label="Discount Mentions"
                        value={`${scoreboard.metrics.discount_mention_pct.this_week}%`}
                        change={scoreboard.metrics.discount_mention_pct.change_pct}
                      />
                      <StatCard
                        label="Emoji Usage"
                        value={`${scoreboard.metrics.emoji_usage_pct.this_week}%`}
                        change={scoreboard.metrics.emoji_usage_pct.change_pct}
                      />
                      <StatCard
                        label="Weekend Emails"
                        value={`${scoreboard.metrics.weekend_emails_pct.this_week}%`}
                        change={scoreboard.metrics.weekend_emails_pct.change_pct}
                      />
                      <StatCard
                        label="Busiest Day"
                        value={scoreboard.metrics.busiest_day.this_week || "—"}
                      />
                      {scoreboard.metrics.biggest_mover.brand && (
                        <div style={{
                          background: "linear-gradient(135deg, #fff7f5, #fef3ee)", borderRadius: 12,
                          border: "1px solid #f5d0c5", padding: "18px 20px", gridColumn: "span 2",
                        }}>
                          <div style={{ fontSize: 13, color: "#C2714A", fontWeight: 600, marginBottom: 4 }}>Biggest Mover</div>
                          <div style={{ fontSize: 20, fontWeight: 700, color: "#0f172a" }}>
                            {scoreboard.metrics.biggest_mover.brand}
                          </div>
                          <div style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>
                            {scoreboard.metrics.biggest_mover.last_week_count} &rarr; {scoreboard.metrics.biggest_mover.this_week_count} emails
                            <ChangeBadge value={scoreboard.metrics.biggest_mover.change_pct} />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── 2. Brand Sequences ── */}
            {sequences && sequences.sequences.length > 0 && (
              <div>
                <SectionHeader
                  title="Brand Sequences"
                  subtitle={`${sequences.total_sequences_found} sequences detected`}
                  collapsed={collapsed.sequences}
                  onToggle={() => toggleCollapse("sequences")}
                />
                {!collapsed.sequences && (
                  <div style={{ background: "white", border: "1px solid #e2e8f0", borderTop: "none", borderRadius: "0 0 12px 12px", padding: 20 }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {sequences.sequences.map((seq, idx) => (
                        <div key={idx} style={{ border: "1px solid #e2e8f0", borderRadius: 10, overflow: "hidden" }}>
                          <button
                            onClick={() => toggleSeq(idx)}
                            style={{
                              width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                              padding: "12px 16px", background: "#f8fafc", border: "none", cursor: "pointer", textAlign: "left",
                            }}
                          >
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                              <span style={{ fontSize: 15, fontWeight: 600, color: "#0f172a" }}>{seq.brand}</span>
                              <span style={{
                                fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 4,
                                background: "#dbeafe", color: "#2563eb",
                              }}>
                                {seq.email_count} emails
                              </span>
                              <span style={{ fontSize: 12, color: "#64748b" }}>{seq.span_days}d span</span>
                            </div>
                            <span style={{ fontSize: 14, color: "#94a3b8" }}>{expandedSeqs.has(idx) ? "−" : "+"}</span>
                          </button>
                          {expandedSeqs.has(idx) && (
                            <div style={{ padding: "12px 16px", borderTop: "1px solid #e2e8f0" }}>
                              {seq.emails.map((e, i) => (
                                <div key={i} style={{ display: "flex", gap: 10, padding: "6px 0", borderBottom: i < seq.emails.length - 1 ? "1px solid #f1f5f9" : "none" }}>
                                  <span style={{ fontSize: 11, color: "#94a3b8", minWidth: 50, flexShrink: 0 }}>
                                    {e.gap_hours_from_previous !== null ? `+${e.gap_hours_from_previous}h` : "Start"}
                                  </span>
                                  <span style={{ fontSize: 13, color: "#0f172a", flex: 1 }}>{e.subject}</span>
                                  {e.type && (
                                    <span style={{ fontSize: 11, color: "#64748b", flexShrink: 0 }}>{e.type}</span>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── 3. Subject Line Formulas ── */}
            {formulas && (
              <div>
                <SectionHeader
                  title="Subject Line Formulas"
                  subtitle={`${formulas.this_week_total_subjects} subjects analyzed`}
                  collapsed={collapsed.formulas}
                  onToggle={() => toggleCollapse("formulas")}
                />
                {!collapsed.formulas && (
                  <div style={{ background: "white", border: "1px solid #e2e8f0", borderTop: "none", borderRadius: "0 0 12px 12px", padding: 20 }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                      <thead>
                        <tr style={{ borderBottom: "2px solid #e2e8f0" }}>
                          <th style={{ textAlign: "left", padding: "8px 12px", color: "#64748b", fontWeight: 600 }}>Formula</th>
                          <th style={{ textAlign: "right", padding: "8px 12px", color: "#64748b", fontWeight: 600 }}>This Week</th>
                          <th style={{ textAlign: "right", padding: "8px 12px", color: "#64748b", fontWeight: 600 }}>4wk Avg</th>
                          <th style={{ textAlign: "center", padding: "8px 12px", color: "#64748b", fontWeight: 600 }}>Trend</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(formulas.distribution)
                          .sort(([, a], [, b]) => b.this_week_pct - a.this_week_pct)
                          .map(([name, data]) => (
                            <tr key={name} style={{ borderBottom: "1px solid #f1f5f9" }}>
                              <td style={{ padding: "10px 12px", fontWeight: 500, color: "#0f172a" }}>
                                {FORMULA_LABELS[name] || name}
                                {formulas.examples[name] && formulas.examples[name].length > 0 && (
                                  <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2, fontWeight: 400 }}>
                                    e.g. &ldquo;{formulas.examples[name][0].substring(0, 50)}{formulas.examples[name][0].length > 50 ? "..." : ""}&rdquo;
                                  </div>
                                )}
                              </td>
                              <td style={{ textAlign: "right", padding: "10px 12px", fontWeight: 600, color: "#0f172a" }}>
                                {data.this_week_pct}%
                              </td>
                              <td style={{ textAlign: "right", padding: "10px 12px", color: "#64748b" }}>
                                {data.trailing_4wk_avg_pct}%
                              </td>
                              <td style={{ textAlign: "center", padding: "10px 12px" }}>
                                <span style={{
                                  fontSize: 12, fontWeight: 600, color: TREND_COLORS[data.trend],
                                }}>
                                  {TREND_ARROWS[data.trend]} {data.trend}
                                </span>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* ── 4. New Tactic Detector ── */}
            {tactics && tactics.alerts.length > 0 && (
              <div>
                <SectionHeader
                  title="New Tactic Detector"
                  subtitle={`${tactics.total_brands_with_alerts} brands with unusual behavior`}
                  collapsed={collapsed.tactics}
                  onToggle={() => toggleCollapse("tactics")}
                />
                {!collapsed.tactics && (
                  <div style={{ background: "white", border: "1px solid #e2e8f0", borderTop: "none", borderRadius: "0 0 12px 12px", padding: 20 }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {tactics.alerts.map((brand, idx) => (
                        <div key={idx} style={{ border: "1px solid #e2e8f0", borderRadius: 10, padding: "14px 16px" }}>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                            <span style={{ fontSize: 15, fontWeight: 600, color: "#0f172a" }}>{brand.brand}</span>
                            <span style={{ fontSize: 12, color: "#64748b" }}>
                              {brand.email_count_this_week} emails this week
                            </span>
                          </div>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                            {brand.alerts.map((alert, i) => {
                              const style = CHANGE_TYPE_STYLES[alert.change_type] || CHANGE_TYPE_STYLES.spike;
                              return (
                                <div key={i} style={{
                                  padding: "6px 10px", borderRadius: 8, background: style.bg,
                                  fontSize: 12, color: style.color,
                                }}>
                                  <span style={{ fontWeight: 600 }}>{style.label}</span>{" "}
                                  {SIGNAL_LABELS[alert.signal] || alert.signal}
                                  {alert.change_pct !== null && (
                                    <span style={{ marginLeft: 4 }}>({alert.change_pct > 0 ? "+" : ""}{alert.change_pct.toFixed(0)}%)</span>
                                  )}
                                  <div style={{ fontSize: 11, marginTop: 2, opacity: 0.8 }}>
                                    {alert.trailing_avg} &rarr; {alert.this_week}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
