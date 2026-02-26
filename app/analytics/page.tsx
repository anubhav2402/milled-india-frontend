"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Logo from "../components/Logo";
import Header from "../components/Header";
import { useAuth } from "../context/AuthContext";
import BlurredOverlay from "../components/BlurredOverlay";

type OverviewData = {
  total_emails: number | string;
  total_brands: number | string;
  industries: Record<string, number | string>;
  campaign_types: Record<string, number | string>;
  top_brands: { brand: string; count: number | string }[];
};

type BrandAnalytics = {
  brand: string;
  total_emails: number | string;
  primary_industry: string | null;
  emails_per_week: number | string;
  campaign_breakdown: Record<string, number | string>;
  send_day_distribution: Record<string, number> | string;
  send_time_distribution: Record<string, number> | string;
  subject_line_stats: {
    avg_length: number;
    emoji_usage_rate: number;
    top_words: string[];
  } | string;
};

export default function AnalyticsPage() {
  const router = useRouter();
  const { user, token, logout, isLoading: authLoading } = useAuth();
  
  const [overview, setOverview] = useState<OverviewData | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [brandAnalytics, setBrandAnalytics] = useState<BrandAnalytics | null>(null);
  const [brands, setBrands] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [brandLoading, setBrandLoading] = useState(false);

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://milled-india-api.onrender.com";

  // Fetch overview data
  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const headers: HeadersInit = {};
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }

        const [overviewRes, brandsRes] = await Promise.all([
          fetch(`${API_BASE}/analytics/overview`, { headers }),
          fetch(`${API_BASE}/brands`),
        ]);

        if (overviewRes.ok) {
          setOverview(await overviewRes.json());
        }
        if (brandsRes.ok) {
          setBrands(await brandsRes.json());
        }
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
  }, [API_BASE, token]);

  // Fetch brand analytics when selected
  useEffect(() => {
    if (!selectedBrand) {
      setBrandAnalytics(null);
      return;
    }

    const fetchBrandAnalytics = async () => {
      setBrandLoading(true);
      try {
        const headers: HeadersInit = {};
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }

        const res = await fetch(
          `${API_BASE}/analytics/brand/${encodeURIComponent(selectedBrand)}`,
          { headers }
        );

        if (res.ok) {
          setBrandAnalytics(await res.json());
        }
      } catch (error) {
        console.error("Failed to fetch brand analytics:", error);
      } finally {
        setBrandLoading(false);
      }
    };

    fetchBrandAnalytics();
  }, [selectedBrand, API_BASE, token]);

  const isAuthenticated = !!user;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
      <Header activeRoute="/analytics" />

      <main style={{ maxWidth: 1400, margin: "0 auto", padding: "32px 24px" }}>
        {/* Page Header */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 32, fontWeight: 700, color: "#0f172a", margin: "0 0 8px 0" }}>
            Email Analytics
          </h1>
          <p style={{ fontSize: 16, color: "#64748b", margin: 0 }}>
            Insights and benchmarks from {overview?.total_emails || "..."} emails across {overview?.total_brands || "..."} brands
          </p>
        </div>

        {/* Login Banner */}
        {!isAuthenticated && !authLoading && (
          <div
            style={{
              backgroundColor: "#fef3c7",
              border: "1px solid #f59e0b",
              borderRadius: 12,
              padding: "16px 20px",
              marginBottom: 24,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            <div>
              <p style={{ margin: 0, fontSize: 15, fontWeight: 500, color: "#92400e" }}>
                Login to unlock full analytics
              </p>
              <p style={{ margin: "4px 0 0 0", fontSize: 13, color: "#a16207" }}>
                See detailed stats, campaign breakdowns, and timing insights.{" "}
                <Link href="/analytics/sample" style={{ color: "#92400e", fontWeight: 600, textDecoration: "underline" }}>
                  Preview a sample report
                </Link>
              </p>
            </div>
            <Link
              href="/login"
              style={{
                padding: "10px 20px",
                fontSize: 14,
                fontWeight: 600,
                color: "#fff",
                backgroundColor: "#f59e0b",
                textDecoration: "none",
                borderRadius: 8,
              }}
            >
              Login to Unlock
            </Link>
          </div>
        )}

        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: 60 }}>
            <div
              style={{
                width: 40,
                height: 40,
                border: "3px solid #e2e8f0",
                borderTopColor: "#C2714A",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
              }}
            />
          </div>
        ) : (
          <>
            {/* Overview Stats */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: 20,
                marginBottom: 32,
              }}
            >
              <StatCard title="Total Emails" value={overview?.total_emails || 0} icon="📧" />
              <StatCard title="Brands Tracked" value={overview?.total_brands || 0} icon="🏢" />
              <StatCard
                title="Industries"
                value={overview?.industries ? Object.keys(overview.industries).length : 0}
                icon="📊"
              />
              <StatCard
                title="Campaign Types"
                value={overview?.campaign_types ? Object.keys(overview.campaign_types).length : 0}
                icon="🎯"
              />
            </div>

            <BlurredOverlay feature="analytics">
            {/* Two Column Layout */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 32 }}>
              {/* Industry Breakdown */}
              <div
                style={{
                  backgroundColor: "#fff",
                  borderRadius: 16,
                  border: "1px solid #e2e8f0",
                  padding: 24,
                }}
              >
                <h2 style={{ fontSize: 18, fontWeight: 600, color: "#0f172a", margin: "0 0 20px 0" }}>
                  Emails by Industry
                </h2>
                {overview?.industries && typeof overview.industries === "object" ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {Object.entries(overview.industries)
                      .sort((a, b) => (typeof b[1] === "number" && typeof a[1] === "number" ? b[1] - a[1] : 0))
                      .slice(0, 8)
                      .map(([industry, count]) => (
                        <div key={industry} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <div style={{ flex: 1, fontSize: 14, color: "#374151" }}>{industry}</div>
                          <div
                            style={{
                              padding: "4px 12px",
                              backgroundColor: "#F5E6DC",
                              borderRadius: 20,
                              fontSize: 13,
                              fontWeight: 600,
                              color: "#C2714A",
                            }}
                          >
                            {count}
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p style={{ color: "#94a3b8", fontSize: 14 }}>Login to view industry breakdown</p>
                )}
              </div>

              {/* Campaign Types */}
              <div
                style={{
                  backgroundColor: "#fff",
                  borderRadius: 16,
                  border: "1px solid #e2e8f0",
                  padding: 24,
                }}
              >
                <h2 style={{ fontSize: 18, fontWeight: 600, color: "#0f172a", margin: "0 0 20px 0" }}>
                  Campaign Types
                </h2>
                {overview?.campaign_types && typeof overview.campaign_types === "object" ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {Object.entries(overview.campaign_types)
                      .sort((a, b) => (typeof b[1] === "number" && typeof a[1] === "number" ? b[1] - a[1] : 0))
                      .map(([type, count]) => (
                        <div key={type} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <div style={{ flex: 1, fontSize: 14, color: "#374151" }}>{type}</div>
                          <div
                            style={{
                              padding: "4px 12px",
                              backgroundColor: "var(--color-accent-light)",
                              borderRadius: 20,
                              fontSize: 13,
                              fontWeight: 600,
                              color: "var(--color-accent)",
                            }}
                          >
                            {count}
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p style={{ color: "#94a3b8", fontSize: 14 }}>Login to view campaign types</p>
                )}
              </div>
            </div>

            {/* Top Brands */}
            <div
              style={{
                backgroundColor: "#fff",
                borderRadius: 16,
                border: "1px solid #e2e8f0",
                padding: 24,
                marginBottom: 32,
              }}
            >
              <h2 style={{ fontSize: 18, fontWeight: 600, color: "#0f172a", margin: "0 0 20px 0" }}>
                Top Brands by Email Volume
              </h2>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                {overview?.top_brands?.map((brand, i) => (
                  <div
                    key={brand.brand}
                    style={{
                      padding: "12px 20px",
                      backgroundColor: i === 0 ? "#fef3c7" : "#f8fafc",
                      borderRadius: 12,
                      border: "1px solid #e2e8f0",
                    }}
                  >
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#0f172a" }}>{brand.brand}</div>
                    <div style={{ fontSize: 13, color: "#64748b" }}>
                      {brand.count} {typeof brand.count === "number" ? "emails" : ""}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Brand Comparison */}
            <BrandComparison brands={brands} token={token} isAuthenticated={isAuthenticated} API_BASE={API_BASE} />

            {/* Brand Deep Dive */}
            <div
              style={{
                backgroundColor: "#fff",
                borderRadius: 16,
                border: "1px solid #e2e8f0",
                padding: 24,
              }}
            >
              <h2 style={{ fontSize: 18, fontWeight: 600, color: "#0f172a", margin: "0 0 20px 0" }}>
                Brand Deep Dive
              </h2>
              
              {/* Brand Selector */}
              <div style={{ marginBottom: 24 }}>
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  style={{
                    padding: "12px 16px",
                    fontSize: 14,
                    color: "#0f172a",
                    border: "1px solid #e2e8f0",
                    borderRadius: 8,
                    backgroundColor: "#fff",
                    minWidth: 250,
                    cursor: "pointer",
                  }}
                >
                  <option value="">Select a brand to analyze...</option>
                  {brands.map((brand) => (
                    <option key={brand} value={brand}>
                      {brand}
                    </option>
                  ))}
                </select>
              </div>

              {brandLoading ? (
                <div style={{ padding: 40, textAlign: "center" }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      border: "3px solid #e2e8f0",
                      borderTopColor: "#C2714A",
                      borderRadius: "50%",
                      animation: "spin 1s linear infinite",
                      margin: "0 auto",
                    }}
                  />
                </div>
              ) : brandAnalytics ? (
                <div>
                  {/* Brand Stats Grid */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                      gap: 16,
                      marginBottom: 24,
                    }}
                  >
                    <MiniStatCard label="Total Emails" value={brandAnalytics.total_emails} />
                    <MiniStatCard label="Emails/Week" value={brandAnalytics.emails_per_week} />
                    <MiniStatCard label="Industry" value={brandAnalytics.primary_industry || "N/A"} />
                    <MiniStatCard
                      label="Avg Subject Length"
                      value={
                        typeof brandAnalytics.subject_line_stats === "object"
                          ? brandAnalytics.subject_line_stats.avg_length
                          : "xx"
                      }
                    />
                  </div>

                  {/* Campaign Breakdown */}
                  {brandAnalytics.campaign_breakdown &&
                    typeof brandAnalytics.campaign_breakdown === "object" && (
                      <div style={{ marginBottom: 24 }}>
                        <h3 style={{ fontSize: 15, fontWeight: 600, color: "#374151", margin: "0 0 12px 0" }}>
                          Campaign Type Breakdown
                        </h3>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                          {Object.entries(brandAnalytics.campaign_breakdown).map(([type, count]) => (
                            <span
                              key={type}
                              style={{
                                padding: "6px 14px",
                                backgroundColor: "#F5E6DC",
                                borderRadius: 20,
                                fontSize: 13,
                                color: "#A85E3A",
                              }}
                            >
                              {type}: {count}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* Send Day Distribution */}
                  {brandAnalytics.send_day_distribution &&
                    typeof brandAnalytics.send_day_distribution === "object" && (
                      <div style={{ marginBottom: 24 }}>
                        <h3 style={{ fontSize: 15, fontWeight: 600, color: "#374151", margin: "0 0 12px 0" }}>
                          Send Day Distribution
                        </h3>
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                          {Object.entries(brandAnalytics.send_day_distribution).map(([day, count]) => (
                            <div
                              key={day}
                              style={{
                                padding: "8px 12px",
                                backgroundColor: "#f8fafc",
                                borderRadius: 8,
                                border: "1px solid #e2e8f0",
                                textAlign: "center",
                                minWidth: 80,
                              }}
                            >
                              <div style={{ fontSize: 12, color: "#64748b" }}>{day.slice(0, 3)}</div>
                              <div style={{ fontSize: 16, fontWeight: 600, color: "#0f172a" }}>{count}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* Top Words */}
                  {brandAnalytics.subject_line_stats &&
                    typeof brandAnalytics.subject_line_stats === "object" && (
                      <div>
                        <h3 style={{ fontSize: 15, fontWeight: 600, color: "#374151", margin: "0 0 12px 0" }}>
                          Top Subject Line Words
                        </h3>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                          {brandAnalytics.subject_line_stats.top_words.map((word) => (
                            <span
                              key={word}
                              style={{
                                padding: "6px 12px",
                                backgroundColor: "var(--color-accent-light)",
                                borderRadius: 16,
                                fontSize: 13,
                                color: "var(--color-accent-hover)",
                              }}
                            >
                              {word}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              ) : (
                <p style={{ color: "#94a3b8", fontSize: 14 }}>
                  Select a brand above to see detailed analytics
                </p>
              )}
            </div>
            </BlurredOverlay>
          </>
        )}
      </main>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @media (max-width: 768px) {
          main > div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string; value: number | string; icon: string }) {
  return (
    <div
      style={{
        backgroundColor: "#fff",
        borderRadius: 16,
        border: "1px solid #e2e8f0",
        padding: 24,
        display: "flex",
        alignItems: "center",
        gap: 16,
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          backgroundColor: "#F5E6DC",
          borderRadius: 12,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 24,
        }}
      >
        {icon}
      </div>
      <div>
        <div style={{ fontSize: 28, fontWeight: 700, color: "#0f172a" }}>{value}</div>
        <div style={{ fontSize: 13, color: "#64748b" }}>{title}</div>
      </div>
    </div>
  );
}

function MiniStatCard({ label, value }: { label: string; value: string | number | null }) {
  return (
    <div
      style={{
        padding: 16,
        backgroundColor: "#f8fafc",
        borderRadius: 12,
        border: "1px solid #e2e8f0",
      }}
    >
      <div style={{ fontSize: 12, color: "#64748b", marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: 600, color: "#0f172a" }}>{value ?? "N/A"}</div>
    </div>
  );
}

type ComparisonData = {
  comparison: Record<string, {
    total_emails: number | string;
    industry: string | null;
    emails_per_week: number | string;
    top_campaign_type: string | null;
    avg_subject_length: number | string;
    emoji_usage_rate: number | string;
    error?: string;
  }>;
};

function BrandComparison({
  brands,
  token,
  isAuthenticated,
  API_BASE,
}: {
  brands: string[];
  token: string | null;
  isAuthenticated: boolean;
  API_BASE: string;
}) {
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [comparison, setComparison] = useState<ComparisonData | null>(null);
  const [loading, setLoading] = useState(false);

  const addBrand = (brand: string) => {
    if (brand && !selectedBrands.includes(brand) && selectedBrands.length < 5) {
      setSelectedBrands([...selectedBrands, brand]);
    }
  };

  const removeBrand = (brand: string) => {
    setSelectedBrands(selectedBrands.filter((b) => b !== brand));
    setComparison(null);
  };

  const fetchComparison = async () => {
    if (selectedBrands.length < 2) return;

    setLoading(true);
    try {
      const headers: HeadersInit = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const res = await fetch(
        `${API_BASE}/analytics/compare?brands=${selectedBrands.join(",")}`,
        { headers }
      );

      if (res.ok) {
        setComparison(await res.json());
      }
    } catch (error) {
      console.error("Failed to fetch comparison:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#fff",
        borderRadius: 16,
        border: "1px solid #e2e8f0",
        padding: 24,
        marginBottom: 32,
      }}
    >
      <h2 style={{ fontSize: 18, fontWeight: 600, color: "#0f172a", margin: "0 0 8px 0" }}>
        Compare Brands
      </h2>
      <p style={{ fontSize: 14, color: "#64748b", margin: "0 0 20px 0" }}>
        Select 2-5 brands to compare side by side
      </p>

      {/* Brand selector */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
        <select
          onChange={(e) => {
            addBrand(e.target.value);
            e.target.value = "";
          }}
          style={{
            padding: "10px 14px",
            fontSize: 14,
            color: "#0f172a",
            border: "1px solid #e2e8f0",
            borderRadius: 8,
            backgroundColor: "#fff",
            minWidth: 200,
          }}
        >
          <option value="">Add a brand to compare...</option>
          {brands
            .filter((b) => !selectedBrands.includes(b))
            .map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
        </select>

        {selectedBrands.length >= 2 && (
          <button
            onClick={fetchComparison}
            disabled={loading}
            style={{
              padding: "10px 20px",
              fontSize: 14,
              fontWeight: 600,
              color: "#fff",
              backgroundColor: "#C2714A",
              border: "none",
              borderRadius: 8,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Comparing..." : "Compare"}
          </button>
        )}
      </div>

      {/* Selected brands */}
      {selectedBrands.length > 0 && (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
          {selectedBrands.map((brand) => (
            <span
              key={brand}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 12px",
                backgroundColor: "#F5E6DC",
                borderRadius: 20,
                fontSize: 13,
                color: "#A85E3A",
              }}
            >
              {brand}
              <button
                onClick={() => removeBrand(brand)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#A85E3A",
                  cursor: "pointer",
                  padding: 0,
                  fontSize: 16,
                  lineHeight: 1,
                }}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Comparison results */}
      {comparison && (
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: 14,
            }}
          >
            <thead>
              <tr style={{ borderBottom: "2px solid #e2e8f0" }}>
                <th style={{ textAlign: "left", padding: "12px 8px", color: "#64748b", fontWeight: 500 }}>
                  Metric
                </th>
                {Object.keys(comparison.comparison).map((brand) => (
                  <th
                    key={brand}
                    style={{
                      textAlign: "center",
                      padding: "12px 8px",
                      color: "#0f172a",
                      fontWeight: 600,
                    }}
                  >
                    {brand}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
                <td style={{ padding: "12px 8px", color: "#374151" }}>Total Emails</td>
                {Object.values(comparison.comparison).map((data, i) => (
                  <td key={i} style={{ textAlign: "center", padding: "12px 8px", fontWeight: 500 }}>
                    {data.total_emails}
                  </td>
                ))}
              </tr>
              <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
                <td style={{ padding: "12px 8px", color: "#374151" }}>Emails/Week</td>
                {Object.values(comparison.comparison).map((data, i) => (
                  <td key={i} style={{ textAlign: "center", padding: "12px 8px", fontWeight: 500 }}>
                    {data.emails_per_week}
                  </td>
                ))}
              </tr>
              <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
                <td style={{ padding: "12px 8px", color: "#374151" }}>Industry</td>
                {Object.values(comparison.comparison).map((data, i) => (
                  <td key={i} style={{ textAlign: "center", padding: "12px 8px" }}>
                    {data.industry || "N/A"}
                  </td>
                ))}
              </tr>
              <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
                <td style={{ padding: "12px 8px", color: "#374151" }}>Top Campaign Type</td>
                {Object.values(comparison.comparison).map((data, i) => (
                  <td key={i} style={{ textAlign: "center", padding: "12px 8px" }}>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "4px 10px",
                        backgroundColor: "var(--color-accent-light)",
                        borderRadius: 12,
                        fontSize: 12,
                        color: "var(--color-accent)",
                      }}
                    >
                      {data.top_campaign_type || "N/A"}
                    </span>
                  </td>
                ))}
              </tr>
              <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
                <td style={{ padding: "12px 8px", color: "#374151" }}>Avg Subject Length</td>
                {Object.values(comparison.comparison).map((data, i) => (
                  <td key={i} style={{ textAlign: "center", padding: "12px 8px", fontWeight: 500 }}>
                    {data.avg_subject_length}
                  </td>
                ))}
              </tr>
              <tr>
                <td style={{ padding: "12px 8px", color: "#374151" }}>Emoji Usage</td>
                {Object.values(comparison.comparison).map((data, i) => (
                  <td key={i} style={{ textAlign: "center", padding: "12px 8px", fontWeight: 500 }}>
                    {typeof data.emoji_usage_rate === "number" ? `${data.emoji_usage_rate}%` : data.emoji_usage_rate}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {!isAuthenticated && selectedBrands.length >= 2 && !comparison && (
        <p style={{ fontSize: 13, color: "#f59e0b", marginTop: 12 }}>
          Note: Some metrics will be masked. Login for full comparison data.
        </p>
      )}
    </div>
  );
}
