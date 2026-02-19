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

export default function BrandReportCard() {
  const params = useParams();
  const brandName = decodeURIComponent(params.name as string);
  const { user, token } = useAuth();

  const [analytics, setAnalytics] = useState<BrandAnalytics | null>(null);
  const [emails, setEmails] = useState<EmailItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const headers: Record<string, string> = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const fetchAll = async () => {
      setLoading(true);
      try {
        const [analyticsRes, emailsRes] = await Promise.all([
          fetch(`${API_BASE}/analytics/brand/${encodeURIComponent(brandName)}`, { headers }),
          fetch(`${API_BASE}/emails?brand=${encodeURIComponent(brandName)}&limit=10`),
        ]);

        if (analyticsRes.ok) setAnalytics(await analyticsRes.json());
        if (emailsRes.ok) setEmails(await emailsRes.json());

        // Check follow status
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
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 24px" }}>
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
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 24px", textAlign: "center" }}>
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

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-surface)" }}>
      <Header />

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 24px" }}>
        {/* Brand Header */}
        <div style={{
          background: "white", borderRadius: 14, padding: "28px 32px",
          marginBottom: 24, border: "1px solid var(--color-border)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <div style={{
              width: 56, height: 56, borderRadius: 14,
              background: "var(--color-accent-light)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 24, fontWeight: 700, color: "var(--color-accent)",
            }}>
              {brandName.charAt(0).toUpperCase()}
            </div>
            <div style={{ flex: 1 }}>
              <h1 style={{
                fontFamily: "var(--font-dm-serif)", fontSize: 28,
                color: "var(--color-primary)", margin: "0 0 4px",
                textTransform: "capitalize",
              }}>
                {brandName}
              </h1>
              <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                {analytics.primary_industry && (
                  <Badge>{analytics.primary_industry}</Badge>
                )}
                {analytics.first_email && analytics.first_email !== "xx" && (
                  <span style={{ fontSize: 12, color: "var(--color-tertiary)" }}>
                    Tracking since {new Date(analytics.first_email).toLocaleDateString("en-IN", { month: "short", year: "2-digit" })}
                  </span>
                )}
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
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

        {/* Stats Grid */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 16, marginBottom: 24,
        }}>
          {[
            { label: "Emails", value: analytics.total_emails },
            { label: "/week", value: analytics.emails_per_week },
            { label: "Avg Subject", value: subjectStats ? `${subjectStats.avg_length}ch` : "xx" },
            { label: "Emoji Rate", value: subjectStats ? `${subjectStats.emoji_usage_rate}%` : "xx" },
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

        {/* Campaign Types + Send Days */}
        {isAuthenticated ? (
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24,
          }} className="email-detail-grid">
            {/* Campaign Types */}
            <div style={{
              background: "white", borderRadius: 14, padding: 24,
              border: "1px solid var(--color-border)",
            }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: "var(--color-primary)", margin: "0 0 16px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Campaign Types
              </h3>
              {Object.entries(campaignBreakdown)
                .sort(([, a], [, b]) => (b as number) - (a as number))
                .map(([type, count]) => {
                  const pct = campaignTotal > 0 ? ((count as number) / campaignTotal) * 100 : 0;
                  return (
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
                  );
                })}
            </div>

            {/* Send Days */}
            {sendDays && (
              <div style={{
                background: "white", borderRadius: 14, padding: 24,
                border: "1px solid var(--color-border)",
              }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: "var(--color-primary)", margin: "0 0 16px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Send Days
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
                      <span style={{ width: 24, fontSize: 12, color: isPeak ? "var(--color-accent)" : "var(--color-tertiary)", fontWeight: isPeak ? 600 : 400 }}>
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <AuthGate previewRows={4}>
            <div style={{
              display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24,
            }}>
              <div style={{ background: "white", borderRadius: 14, padding: 24, height: 250 }} />
              <div style={{ background: "white", borderRadius: 14, padding: 24, height: 250 }} />
            </div>
          </AuthGate>
        )}

        {/* Top Words */}
        {subjectStats && subjectStats.top_words.length > 0 && (
          <div style={{
            background: "white", borderRadius: 14, padding: 24,
            border: "1px solid var(--color-border)", marginBottom: 24,
          }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: "var(--color-primary)", margin: "0 0 12px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Top Subject Words
            </h3>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {subjectStats.top_words.map((word) => (
                <Badge key={word} variant="accent" size="md">{word}</Badge>
              ))}
            </div>
          </div>
        )}

        {/* Recent Campaigns */}
        {emails.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: "var(--color-primary)", margin: 0, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Recent Campaigns
              </h3>
              <Link
                href={`/browse?brand=${encodeURIComponent(brandName)}`}
                style={{ fontSize: 13, color: "var(--color-accent)", textDecoration: "none", fontWeight: 500 }}
              >
                View all →
              </Link>
            </div>
            <div className="horizontal-scroll">
              {emails.map((email) => (
                <div key={email.id} className="scroll-card" style={{ width: 320, flexShrink: 0 }}>
                  <EmailCard
                    id={email.id}
                    subject={email.subject}
                    brand={email.brand}
                    preview={email.preview}
                    industry={email.industry}
                    received_at={email.received_at}
                    campaignType={email.type}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
