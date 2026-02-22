"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Header from "../../components/Header";
import Badge from "../../components/Badge";
import EmailCard from "../../components/EmailCard";
import AuthGate from "../../components/AuthGate";
import { useAuth } from "../../context/AuthContext";
import { API_BASE, CAMPAIGN_TYPE_COLORS } from "../../lib/constants";

type BrandAnalytics = {
  brand: string;
  total_emails: number | string;
  primary_industry: string | null;
  emails_per_week: number | string;
  first_email: string | null;
  last_email: string | null;
  campaign_breakdown: Record<string, number | string>;
  send_day_distribution: Record<string, number> | string;
  send_time_distribution: Record<string, number> | string;
  subject_line_stats:
    | { avg_length: number; emoji_usage_rate: number; top_words: string[] }
    | string;
};

type EmailItem = {
  id: number;
  subject: string;
  brand?: string;
  preview?: string;
  type?: string;
  industry?: string;
  received_at: string;
};

export default function BrandPageClient({
  serverAnalytics,
}: {
  serverAnalytics?: BrandAnalytics | null;
}) {
  const params = useParams();
  const brandName = decodeURIComponent(params.name as string);
  const { user, token } = useAuth();

  const [analytics, setAnalytics] = useState<BrandAnalytics | null>(
    serverAnalytics ?? null
  );
  const [emails, setEmails] = useState<EmailItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("All");

  useEffect(() => {
    const headers: Record<string, string> = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const fetchAll = async () => {
      setLoading(true);
      try {
        const [analyticsRes, emailsRes] = await Promise.all([
          fetch(`${API_BASE}/analytics/brand/${encodeURIComponent(brandName)}`, { headers }),
          fetch(`${API_BASE}/emails?brand=${encodeURIComponent(brandName)}&limit=50`),
        ]);

        if (analyticsRes.ok) setAnalytics(await analyticsRes.json());
        if (emailsRes.ok) setEmails(await emailsRes.json());

        if (token) {
          const followsRes = await fetch(`${API_BASE}/user/follows`, { headers });
          if (followsRes.ok) {
            const data = await followsRes.json();
            setIsFollowing(data.follows.includes(brandName));
          }
        }
      } catch (err) {
        console.error("Failed to fetch:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [brandName, token]);

  const toggleFollow = async () => {
    if (!token) return;
    const method = isFollowing ? "DELETE" : "POST";
    try {
      await fetch(`${API_BASE}/user/follows/${encodeURIComponent(brandName)}`, {
        method,
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsFollowing(!isFollowing);
    } catch (err) {
      console.error("Failed to toggle follow:", err);
    }
  };

  const shareUrl = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isAuthenticated = typeof analytics?.total_emails === "number";

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--color-surface)" }}>
        <Header />
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px" }}>
          <div style={{ background: "white", borderRadius: 14, padding: 32, textAlign: "center" }}>
            <div style={{
              width: 40, height: 40, border: "3px solid var(--color-border)",
              borderTopColor: "var(--color-accent)", borderRadius: "50%",
              animation: "spin 1s linear infinite", margin: "40px auto",
            }} />
          </div>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--color-surface)" }}>
        <Header />
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px", textAlign: "center" }}>
          <h2 style={{ fontSize: 20, color: "var(--color-primary)" }}>Brand not found</h2>
          <p style={{ color: "var(--color-secondary)" }}>No data available for &quot;{brandName}&quot;</p>
          <Link href="/brands" style={{ color: "var(--color-accent)" }}>Browse all brands</Link>
        </div>
      </div>
    );
  }

  const sendDays = typeof analytics.send_day_distribution === "object" ? analytics.send_day_distribution : null;
  const subjectStats = typeof analytics.subject_line_stats === "object" ? analytics.subject_line_stats : null;
  const campaignBreakdown = analytics.campaign_breakdown;

  const maxDayCount = sendDays ? Math.max(...Object.values(sendDays)) : 0;
  const campaignTotal = Object.values(campaignBreakdown).reduce<number>(
    (sum, v) => sum + (typeof v === "number" ? v : 0), 0
  );

  const campaignTypes = ["All", ...Array.from(new Set(emails.map(e => e.type).filter(Boolean))) as string[]];
  const filteredEmails = activeTab === "All" ? emails : emails.filter(e => e.type === activeTab);

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-surface)" }}>
      <Header />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px" }}>
        {/* Brand Header — Compact */}
        <div style={{
          background: "white", borderRadius: 14, padding: "24px 28px",
          marginBottom: 24, border: "1px solid var(--color-border)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <div style={{
              width: 52, height: 52, borderRadius: 14,
              background: "var(--color-accent-light)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 22, fontWeight: 700, color: "var(--color-accent)",
              flexShrink: 0,
            }}>
              {brandName.charAt(0).toUpperCase()}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 4 }}>
                <h1 style={{
                  fontFamily: "var(--font-dm-serif)", fontSize: 24,
                  color: "var(--color-primary)", margin: 0,
                  textTransform: "capitalize",
                }}>
                  {brandName}
                </h1>
                {analytics.primary_industry && (
                  <Badge>{analytics.primary_industry}</Badge>
                )}
              </div>
              {/* Inline stats */}
              <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap", fontSize: 13, color: "var(--color-secondary)" }}>
                <span style={{ fontWeight: 600, color: "var(--color-primary)" }}>
                  {analytics.total_emails} emails
                </span>
                <span>·</span>
                <span>{analytics.emails_per_week}/week</span>
                {subjectStats && (
                  <>
                    <span>·</span>
                    <span>Avg {subjectStats.avg_length}ch subject</span>
                    <span>·</span>
                    <span>{subjectStats.emoji_usage_rate}% emoji</span>
                  </>
                )}
                {analytics.first_email && analytics.first_email !== "xx" && (
                  <>
                    <span>·</span>
                    <span style={{ color: "var(--color-tertiary)" }}>
                      Since {new Date(analytics.first_email).toLocaleDateString("en-IN", { month: "short", year: "2-digit" })}
                    </span>
                  </>
                )}
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
              {user && (
                <button
                  onClick={toggleFollow}
                  style={{
                    padding: "8px 18px", borderRadius: 8, fontSize: 13, fontWeight: 500,
                    cursor: "pointer", transition: "all 150ms ease",
                    background: isFollowing ? "var(--color-accent)" : "white",
                    color: isFollowing ? "white" : "var(--color-primary)",
                    border: isFollowing ? "none" : "1px solid var(--color-border)",
                  }}
                >
                  {isFollowing ? "Following" : "Follow"}
                </button>
              )}
              <button
                onClick={shareUrl}
                style={{
                  padding: "8px 18px", borderRadius: 8, fontSize: 13, fontWeight: 500,
                  cursor: "pointer", background: "white", color: "var(--color-secondary)",
                  border: "1px solid var(--color-border)",
                }}
              >
                {copied ? "Copied!" : "Share"}
              </button>
            </div>
          </div>
        </div>

        {/* Two-column layout: Emails + Insights sidebar */}
        <div
          className="email-detail-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 340px",
            gap: 24,
            alignItems: "start",
          }}
        >
          {/* Left: Email Grid */}
          <div>
            {/* Filter Tabs */}
            {emails.length > 0 && (
              <>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                  <h2 style={{ fontSize: 16, fontWeight: 600, color: "var(--color-primary)", margin: 0 }}>
                    Emails
                  </h2>
                  <Link
                    href={`/browse?brand=${encodeURIComponent(brandName)}`}
                    style={{ fontSize: 13, color: "var(--color-accent)", textDecoration: "none", fontWeight: 500 }}
                  >
                    View all →
                  </Link>
                </div>

                <div style={{
                  display: "flex", gap: 8, marginBottom: 20,
                  overflowX: "auto", paddingBottom: 4,
                }}>
                  {campaignTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => setActiveTab(type)}
                      style={{
                        padding: "6px 16px",
                        borderRadius: 100,
                        fontSize: 13,
                        fontWeight: 500,
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                        border: activeTab === type ? "1px solid var(--color-accent)" : "1px solid var(--color-border)",
                        background: activeTab === type ? "var(--color-accent)" : "white",
                        color: activeTab === type ? "white" : "var(--color-secondary)",
                        transition: "all 150ms ease",
                      }}
                    >
                      {type}
                    </button>
                  ))}
                </div>

                {filteredEmails.length > 0 ? (
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                    gap: 16,
                  }}>
                    {filteredEmails.slice(0, 12).map((email) => (
                      <EmailCard
                        key={email.id}
                        id={email.id}
                        subject={email.subject}
                        brand={email.brand}
                        preview={email.preview}
                        industry={email.industry}
                        received_at={email.received_at}
                        campaignType={email.type}
                      />
                    ))}
                  </div>
                ) : (
                  <div style={{
                    background: "white", borderRadius: 14, padding: "48px 24px",
                    border: "1px solid var(--color-border)", textAlign: "center",
                  }}>
                    <p style={{ fontSize: 14, color: "var(--color-tertiary)", margin: 0 }}>
                      No {activeTab} campaigns found
                    </p>
                  </div>
                )}

                {filteredEmails.length > 12 && (
                  <div style={{ textAlign: "center", marginTop: 20 }}>
                    <Link
                      href={`/browse?brand=${encodeURIComponent(brandName)}`}
                      style={{
                        display: "inline-block", padding: "10px 24px",
                        borderRadius: 8, fontSize: 14, fontWeight: 500,
                        color: "var(--color-accent)", border: "1px solid var(--color-accent)",
                        textDecoration: "none", transition: "all 150ms ease",
                      }}
                    >
                      View all {filteredEmails.length} emails →
                    </Link>
                  </div>
                )}
              </>
            )}

            {emails.length === 0 && (
              <div style={{
                background: "white", borderRadius: 14, padding: "64px 24px",
                border: "1px solid var(--color-border)", textAlign: "center",
              }}>
                <p style={{ fontSize: 16, color: "var(--color-secondary)", margin: "0 0 8px" }}>
                  No emails tracked yet
                </p>
                <p style={{ fontSize: 14, color: "var(--color-tertiary)", margin: 0 }}>
                  We&apos;re working on adding emails from {brandName}
                </p>
              </div>
            )}
          </div>

          {/* Right: Insights Sidebar */}
          <div style={{ position: "sticky", top: 80, display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Campaign Types */}
            {isAuthenticated ? (
              <>
                <div style={{
                  background: "white", borderRadius: 14, padding: 20,
                  border: "1px solid var(--color-border)",
                }}>
                  <h3 style={{ fontSize: 12, fontWeight: 600, color: "var(--color-tertiary)", margin: "0 0 14px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    Campaign Types
                  </h3>
                  {Object.entries(campaignBreakdown)
                    .sort(([, a], [, b]) => (b as number) - (a as number))
                    .map(([type, count]) => {
                      const pct = campaignTotal > 0 ? ((count as number) / campaignTotal) * 100 : 0;
                      return (
                        <div key={type} style={{ marginBottom: 10 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 3 }}>
                            <span style={{ color: "var(--color-primary)", fontWeight: 500 }}>{type}</span>
                            <span style={{ color: "var(--color-tertiary)", fontSize: 12 }}>{Math.round(pct)}%</span>
                          </div>
                          <div style={{ height: 5, borderRadius: 3, background: "var(--color-surface)" }}>
                            <div style={{
                              height: "100%", borderRadius: 3, width: `${pct}%`,
                              background: CAMPAIGN_TYPE_COLORS[type] || "var(--color-accent)",
                              transition: "width 500ms ease",
                            }} />
                          </div>
                        </div>
                      );
                    })}
                </div>

                {/* Send Days */}
                {sendDays && (
                  <div style={{
                    background: "white", borderRadius: 14, padding: 20,
                    border: "1px solid var(--color-border)",
                  }}>
                    <h3 style={{ fontSize: 12, fontWeight: 600, color: "var(--color-tertiary)", margin: "0 0 14px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                      Send Days
                    </h3>
                    {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => {
                      const count = sendDays[day] || 0;
                      const pct = maxDayCount > 0 ? (count / maxDayCount) * 100 : 0;
                      const isPeak = count === maxDayCount && count > 0;
                      return (
                        <div key={day} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                          <span style={{ width: 28, fontSize: 12, color: "var(--color-tertiary)", textAlign: "right" }}>
                            {day.slice(0, 3)}
                          </span>
                          <div style={{ flex: 1, height: 5, borderRadius: 3, background: "var(--color-surface)" }}>
                            <div style={{
                              height: "100%", borderRadius: 3, width: `${pct}%`,
                              background: isPeak ? "var(--color-accent)" : "#94a3b8",
                              transition: "width 500ms ease",
                            }} />
                          </div>
                          <span style={{ width: 20, fontSize: 12, color: isPeak ? "var(--color-accent)" : "var(--color-tertiary)", fontWeight: isPeak ? 600 : 400, textAlign: "right" }}>
                            {count}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Top Words */}
                {subjectStats && subjectStats.top_words.length > 0 && (
                  <div style={{
                    background: "white", borderRadius: 14, padding: 20,
                    border: "1px solid var(--color-border)",
                  }}>
                    <h3 style={{ fontSize: 12, fontWeight: 600, color: "var(--color-tertiary)", margin: "0 0 12px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                      Top Subject Words
                    </h3>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {subjectStats.top_words.map((word) => (
                        <Badge key={word} variant="accent" size="sm">{word}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <AuthGate previewRows={4}>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div style={{ background: "white", borderRadius: 14, padding: 20, height: 200 }} />
                  <div style={{ background: "white", borderRadius: 14, padding: 20, height: 180 }} />
                </div>
              </AuthGate>
            )}
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
