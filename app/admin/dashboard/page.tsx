"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "../../components/Header";
import { useAuth } from "../../context/AuthContext";

type Metrics = {
  total_users: number;
  active_users_7d: number;
  active_trials: number;
  total_emails: number;
  total_brands: number;
  total_page_views: number;
  page_views_7d: number;
  newsletter_subscribers: number;
  users_by_plan: Record<string, number>;
  daily_signups: { date: string; count: number }[];
  recent_signups: {
    id: number;
    email: string;
    name: string | null;
    plan: string;
    is_on_trial: boolean;
    created_at: string | null;
  }[];
};

export default function AdminDashboard() {
  const { user, token, isLoading: authLoading } = useAuth();
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://milled-india-api.onrender.com";

  useEffect(() => {
    if (!token) return;

    const fetchMetrics = async () => {
      try {
        const res = await fetch(`${API_BASE}/admin/metrics`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          setMetrics(await res.json());
        } else if (res.status === 403) {
          setError("Admin access required");
        } else {
          setError("Failed to load metrics");
        }
      } catch {
        setError("Network error");
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [token, API_BASE]);

  if (!authLoading && (!user || !user.is_admin)) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
        <Header />
        <div style={{
          maxWidth: 480, margin: "80px auto", padding: "40px 32px",
          textAlign: "center", background: "white", borderRadius: 16,
          border: "1px solid #e2e8f0",
        }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>🔒</div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0f172a", margin: "0 0 8px" }}>
            Admin Access Only
          </h1>
          <p style={{ fontSize: 15, color: "#64748b", margin: "0 0 24px" }}>
            This page is restricted to admin accounts.
          </p>
          <Link href="/" style={{
            display: "inline-block", padding: "10px 24px", fontSize: 14,
            fontWeight: 600, color: "#fff", backgroundColor: "#C2714A",
            textDecoration: "none", borderRadius: 8,
          }}>
            Go to Homepage
          </Link>
        </div>
      </div>
    );
  }

  // Max value for chart scaling
  const maxSignup = metrics?.daily_signups
    ? Math.max(...metrics.daily_signups.map((d) => d.count), 1)
    : 1;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
      <Header />

      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 700, color: "#0f172a", margin: "0 0 4px" }}>
              Admin Dashboard
            </h1>
            <p style={{ fontSize: 14, color: "#64748b", margin: 0 }}>
              Overview of platform metrics
            </p>
          </div>
          <Link href="/admin/tweets" style={{
            fontSize: 13, fontWeight: 500, color: "#C2714A", textDecoration: "none",
            padding: "8px 16px", borderRadius: 8, border: "1px solid #C2714A",
          }}>
            Tweet Manager
          </Link>
        </div>

        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: 80 }}>
            <div style={{
              width: 36, height: 36, border: "3px solid #e2e8f0",
              borderTopColor: "#C2714A", borderRadius: "50%",
              animation: "spin 1s linear infinite",
            }} />
          </div>
        ) : error ? (
          <div style={{
            padding: 40, textAlign: "center", background: "white",
            borderRadius: 16, border: "1px solid #e2e8f0",
          }}>
            <p style={{ fontSize: 16, color: "#ef4444" }}>{error}</p>
          </div>
        ) : metrics ? (
          <>
            {/* Stat Cards */}
            <div className="admin-stats" style={{
              display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
              gap: 16, marginBottom: 32,
            }}>
              <StatCard label="Total Users" value={metrics.total_users} />
              <StatCard label="Active (7d)" value={metrics.active_users_7d} />
              <StatCard label="Page Views (7d)" value={metrics.page_views_7d} />
              <StatCard label="Active Trials" value={metrics.active_trials} />
              <StatCard label="Total Emails" value={metrics.total_emails} />
              <StatCard label="Total Brands" value={metrics.total_brands} />
              <StatCard label="All-Time Views" value={metrics.total_page_views} />
              <StatCard label="Newsletter Subs" value={metrics.newsletter_subscribers} />
            </div>

            {/* Two column layout */}
            <div className="admin-grid" style={{
              display: "grid", gridTemplateColumns: "2fr 1fr",
              gap: 20, marginBottom: 32,
            }}>
              {/* Signups Chart */}
              <div style={{
                background: "white", borderRadius: 16,
                border: "1px solid #e2e8f0", padding: 24,
              }}>
                <h2 style={{ fontSize: 16, fontWeight: 600, color: "#0f172a", margin: "0 0 20px" }}>
                  Signups (Last 30 Days)
                </h2>
                {metrics.daily_signups.length > 0 ? (
                  <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 160 }}>
                    {metrics.daily_signups.map((d) => (
                      <div
                        key={d.date}
                        title={`${d.date}: ${d.count} signups`}
                        style={{
                          flex: 1,
                          height: `${(d.count / maxSignup) * 100}%`,
                          minHeight: d.count > 0 ? 4 : 1,
                          background: d.count > 0
                            ? "linear-gradient(180deg, #C2714A, #A85E3A)"
                            : "#e2e8f0",
                          borderRadius: "3px 3px 0 0",
                          cursor: "default",
                          transition: "opacity 150ms",
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  <p style={{ color: "#94a3b8", fontSize: 14, textAlign: "center", padding: 40 }}>
                    No signups in the last 30 days
                  </p>
                )}
                {metrics.daily_signups.length > 0 && (
                  <div style={{
                    display: "flex", justifyContent: "space-between",
                    marginTop: 8, fontSize: 11, color: "#94a3b8",
                  }}>
                    <span>{metrics.daily_signups[0]?.date.slice(5)}</span>
                    <span>{metrics.daily_signups[metrics.daily_signups.length - 1]?.date.slice(5)}</span>
                  </div>
                )}
              </div>

              {/* Users by Plan */}
              <div style={{
                background: "white", borderRadius: 16,
                border: "1px solid #e2e8f0", padding: 24,
              }}>
                <h2 style={{ fontSize: 16, fontWeight: 600, color: "#0f172a", margin: "0 0 20px" }}>
                  Users by Plan
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {Object.entries(metrics.users_by_plan)
                    .sort((a, b) => b[1] - a[1])
                    .map(([plan, count]) => {
                      const pct = metrics.total_users > 0
                        ? Math.round((count / metrics.total_users) * 100)
                        : 0;
                      return (
                        <div key={plan}>
                          <div style={{
                            display: "flex", justifyContent: "space-between",
                            marginBottom: 4, fontSize: 13,
                          }}>
                            <span style={{ fontWeight: 500, color: "#374151", textTransform: "capitalize" }}>
                              {plan || "free"}
                            </span>
                            <span style={{ color: "#64748b" }}>{count} ({pct}%)</span>
                          </div>
                          <div style={{
                            height: 6, background: "#f1f5f9", borderRadius: 3,
                            overflow: "hidden",
                          }}>
                            <div style={{
                              height: "100%", width: `${pct}%`,
                              background: plan === "agency" ? "#8b5cf6"
                                : plan === "pro" ? "#C2714A"
                                : plan === "starter" ? "#f59e0b"
                                : "#94a3b8",
                              borderRadius: 3,
                              transition: "width 500ms ease",
                            }} />
                          </div>
                        </div>
                      );
                    })}
                </div>
                {metrics.active_trials > 0 && (
                  <div style={{
                    marginTop: 16, padding: "10px 14px",
                    background: "#f5f3ff", borderRadius: 8,
                    fontSize: 13, color: "#6d28d9",
                  }}>
                    {metrics.active_trials} users on active trial
                  </div>
                )}
              </div>
            </div>

            {/* Recent Signups Table */}
            <div style={{
              background: "white", borderRadius: 16,
              border: "1px solid #e2e8f0", padding: 24,
            }}>
              <h2 style={{ fontSize: 16, fontWeight: 600, color: "#0f172a", margin: "0 0 16px" }}>
                Recent Signups
              </h2>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid #e2e8f0" }}>
                      <th style={{ textAlign: "left", padding: "10px 12px", color: "#64748b", fontWeight: 500 }}>Email</th>
                      <th style={{ textAlign: "left", padding: "10px 12px", color: "#64748b", fontWeight: 500 }}>Name</th>
                      <th style={{ textAlign: "center", padding: "10px 12px", color: "#64748b", fontWeight: 500 }}>Plan</th>
                      <th style={{ textAlign: "right", padding: "10px 12px", color: "#64748b", fontWeight: 500 }}>Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {metrics.recent_signups.map((u) => (
                      <tr key={u.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                        <td style={{ padding: "10px 12px", color: "#0f172a", fontWeight: 500 }}>
                          {u.email}
                        </td>
                        <td style={{ padding: "10px 12px", color: "#64748b" }}>
                          {u.name || "—"}
                        </td>
                        <td style={{ padding: "10px 12px", textAlign: "center" }}>
                          <span style={{
                            display: "inline-block", padding: "2px 10px",
                            borderRadius: 20, fontSize: 11, fontWeight: 600,
                            background: u.is_on_trial ? "#f5f3ff"
                              : u.plan === "pro" || u.plan === "agency" ? "#F5E6DC"
                              : "#f1f5f9",
                            color: u.is_on_trial ? "#7c3aed"
                              : u.plan === "pro" || u.plan === "agency" ? "#C2714A"
                              : "#64748b",
                            textTransform: "capitalize",
                          }}>
                            {u.is_on_trial ? "Trial" : u.plan}
                          </span>
                        </td>
                        <td style={{ padding: "10px 12px", textAlign: "right", color: "#64748b" }}>
                          {u.created_at
                            ? new Date(u.created_at).toLocaleDateString("en-IN", {
                                day: "numeric", month: "short", year: "numeric",
                              })
                            : "—"
                          }
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : null}
      </main>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @media (max-width: 900px) {
          .admin-stats {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .admin-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 480px) {
          .admin-stats {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div style={{
      background: "white", borderRadius: 12,
      border: "1px solid #e2e8f0", padding: "18px 20px",
    }}>
      <div style={{ fontSize: 24, fontWeight: 700, color: "#0f172a", marginBottom: 2 }}>
        {typeof value === "number" ? value.toLocaleString() : value}
      </div>
      <div style={{ fontSize: 12, color: "#64748b" }}>{label}</div>
    </div>
  );
}
