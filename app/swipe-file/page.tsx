"use client";

import { useState, useEffect, useMemo } from "react";
import Header from "../components/Header";
import Badge from "../components/Badge";
import AuthGate from "../components/AuthGate";
import { useAuth } from "../context/AuthContext";
import { API_BASE, INDUSTRIES, CAMPAIGN_TYPES, CAMPAIGN_TYPE_COLORS } from "../lib/constants";

type SubjectLine = {
  subject: string;
  brand: string;
  industry: string;
  campaign_type: string;
  date: string;
  length: number;
  has_emoji: boolean;
};

const CopyIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
  </svg>
);

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

export default function SwipeFilePage() {
  const { user, token } = useAuth();
  const [subjects, setSubjects] = useState<SubjectLine[]>([]);
  const [loading, setLoading] = useState(true);
  const [brands, setBrands] = useState<string[]>([]);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  // Filters
  const [filterIndustry, setFilterIndustry] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterBrand, setFilterBrand] = useState("");
  const [filterEmoji, setFilterEmoji] = useState(false);
  const [sortBy, setSortBy] = useState<"newest" | "shortest" | "longest">("newest");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const headers: Record<string, string> = {};
        if (token) headers["Authorization"] = `Bearer ${token}`;

        const [subRes, brandRes] = await Promise.all([
          fetch(`${API_BASE}/analytics/subject-lines?limit=500`, { headers }),
          fetch(`${API_BASE}/brands`),
        ]);

        if (subRes.ok) {
          const data = await subRes.json();
          if (data.subjects) setSubjects(data.subjects);
        }
        if (brandRes.ok) setBrands(await brandRes.json());
      } catch (err) {
        console.error("Failed to fetch:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  const filtered = useMemo(() => {
    let result = [...subjects];
    if (filterIndustry) result = result.filter((s) => s.industry === filterIndustry);
    if (filterType) result = result.filter((s) => s.campaign_type === filterType);
    if (filterBrand) result = result.filter((s) => s.brand === filterBrand);
    if (filterEmoji) result = result.filter((s) => s.has_emoji);

    if (sortBy === "shortest") result.sort((a, b) => a.length - b.length);
    else if (sortBy === "longest") result.sort((a, b) => b.length - a.length);
    // newest is default order from API

    return result;
  }, [subjects, filterIndustry, filterType, filterBrand, filterEmoji, sortBy]);

  const copySubject = async (text: string, idx: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 2000);
    } catch {
      // fallback
    }
  };

  const activeFilterCount =
    (filterIndustry ? 1 : 0) +
    (filterType ? 1 : 0) +
    (filterBrand ? 1 : 0) +
    (filterEmoji ? 1 : 0);

  const clearFilters = () => {
    setFilterIndustry("");
    setFilterType("");
    setFilterBrand("");
    setFilterEmoji(false);
    setSortBy("newest");
  };

  const selectStyle: React.CSSProperties = {
    padding: "8px 12px",
    fontSize: 13,
    border: "1px solid var(--color-border)",
    borderRadius: 8,
    background: "white",
    color: "var(--color-primary)",
    cursor: "pointer",
    minWidth: 140,
  };

  // Show preview rows for non-auth users
  const previewCount = 5;
  const visibleSubjects = user ? filtered : filtered.slice(0, previewCount);

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-surface)" }}>
      <Header activeRoute="/swipe-file" />

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "32px 24px" }}>
        {/* Page Header */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <div>
              <h1 style={{
                fontFamily: "var(--font-dm-serif)",
                fontSize: 28,
                color: "var(--color-primary)",
                margin: "0 0 6px",
              }}>
                Subject Line Swipe File
              </h1>
              <p style={{ fontSize: 14, color: "var(--color-secondary)", margin: 0 }}>
                {loading ? "Loading..." : `${filtered.length} subject lines from top brands`}
              </p>
            </div>

            {/* Mobile filter toggle */}
            <button
              className="show-mobile"
              onClick={() => setShowFilters(!showFilters)}
              style={{
                display: "none",
                alignItems: "center",
                gap: 6,
                padding: "10px 14px",
                background: activeFilterCount > 0 ? "var(--color-accent)" : "white",
                color: activeFilterCount > 0 ? "white" : "var(--color-secondary)",
                border: activeFilterCount > 0 ? "none" : "1px solid var(--color-border)",
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="6" y1="12" x2="18" y2="12" />
                <line x1="8" y1="18" x2="16" y2="18" />
              </svg>
              Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
            </button>
          </div>
        </div>

        {/* Filters */}
        <div
          className={showFilters ? "" : "hide-mobile"}
          style={{
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
            marginBottom: 24,
            padding: 16,
            background: "white",
            borderRadius: 12,
            border: "1px solid var(--color-border)",
            alignItems: "center",
          }}
        >
          <select value={filterIndustry} onChange={(e) => setFilterIndustry(e.target.value)} style={selectStyle}>
            <option value="">All Industries</option>
            {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
          </select>

          <select value={filterType} onChange={(e) => setFilterType(e.target.value)} style={selectStyle}>
            <option value="">All Types</option>
            {CAMPAIGN_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>

          <select value={filterBrand} onChange={(e) => setFilterBrand(e.target.value)} style={selectStyle}>
            <option value="">All Brands</option>
            {brands.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>

          <label style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: 13,
            color: "var(--color-secondary)",
            cursor: "pointer",
            padding: "8px 12px",
            borderRadius: 8,
            border: filterEmoji ? "1px solid var(--color-accent)" : "1px solid var(--color-border)",
            background: filterEmoji ? "var(--color-accent-light)" : "white",
          }}>
            <input
              type="checkbox"
              checked={filterEmoji}
              onChange={(e) => setFilterEmoji(e.target.checked)}
              style={{ display: "none" }}
            />
            Has Emoji
          </label>

          <select value={sortBy} onChange={(e) => setSortBy(e.target.value as typeof sortBy)} style={selectStyle}>
            <option value="newest">Newest first</option>
            <option value="shortest">Shortest first</option>
            <option value="longest">Longest first</option>
          </select>

          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              style={{
                fontSize: 13,
                color: "var(--color-accent)",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontWeight: 500,
                padding: "8px 12px",
              }}
            >
              Clear all
            </button>
          )}
        </div>

        {/* Subject Lines List */}
        {loading ? (
          <div style={{ background: "white", borderRadius: 14, overflow: "hidden" }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} style={{
                padding: "16px 20px",
                borderBottom: "1px solid var(--color-border)",
                display: "flex",
                gap: 12,
                alignItems: "center",
              }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: "#f1f5f9", animation: "shimmer 1.5s infinite", backgroundSize: "200% 100%", backgroundImage: "linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)" }} />
                <div style={{ flex: 1 }}>
                  <div style={{ width: "60%", height: 16, borderRadius: 4, background: "#f1f5f9", marginBottom: 6, animation: "shimmer 1.5s infinite", backgroundSize: "200% 100%", backgroundImage: "linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)" }} />
                  <div style={{ width: "30%", height: 12, borderRadius: 4, background: "#f1f5f9", animation: "shimmer 1.5s infinite", backgroundSize: "200% 100%", backgroundImage: "linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)" }} />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px", background: "white", borderRadius: 14 }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📝</div>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: "var(--color-primary)", marginBottom: 8 }}>No subject lines found</h3>
            <p style={{ fontSize: 14, color: "var(--color-secondary)" }}>Try adjusting your filters</p>
          </div>
        ) : (
          <div style={{ position: "relative" }}>
            {/* Visible rows */}
            <div style={{ background: "white", borderRadius: 14, overflow: "hidden", border: "1px solid var(--color-border)" }}>
              {visibleSubjects.map((s, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: "14px 20px",
                    borderBottom: idx < visibleSubjects.length - 1 ? "1px solid var(--color-border)" : "none",
                    display: "flex",
                    gap: 12,
                    alignItems: "flex-start",
                    transition: "background 150ms ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-surface)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "white")}
                >
                  {/* Copy button */}
                  <button
                    onClick={() => copySubject(s.subject, idx)}
                    style={{
                      flexShrink: 0,
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      border: "1px solid var(--color-border)",
                      background: copiedIdx === idx ? "#dcfce7" : "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      transition: "all 150ms ease",
                      marginTop: 2,
                    }}
                    title="Copy subject line"
                  >
                    {copiedIdx === idx ? <CheckIcon /> : <CopyIcon />}
                  </button>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: 14,
                      fontWeight: 500,
                      color: "var(--color-primary)",
                      marginBottom: 6,
                      lineHeight: 1.4,
                    }}>
                      {s.subject}
                    </div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                      <span style={{ fontSize: 12, fontWeight: 500, color: "var(--color-accent)" }}>
                        {s.brand}
                      </span>
                      {s.campaign_type && (
                        <Badge
                          variant="accent"
                          size="sm"
                          style={{
                            background: `${CAMPAIGN_TYPE_COLORS[s.campaign_type] || "#8b5cf6"}15`,
                            color: CAMPAIGN_TYPE_COLORS[s.campaign_type] || "#8b5cf6",
                            fontSize: 10,
                            padding: "2px 8px",
                          }}
                        >
                          {s.campaign_type}
                        </Badge>
                      )}
                      {s.industry && (
                        <span style={{ fontSize: 11, color: "var(--color-tertiary)" }}>
                          {s.industry}
                        </span>
                      )}
                      <span style={{ fontSize: 11, color: "var(--color-tertiary)" }}>
                        {s.date}
                      </span>
                      <span style={{ fontSize: 11, color: "var(--color-tertiary)" }}>
                        {s.length}ch
                      </span>
                      {s.has_emoji && (
                        <span style={{ fontSize: 11 }} title="Contains emoji">✨</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Auth gate for non-logged-in users */}
            {!user && filtered.length > previewCount && (
              <AuthGate previewRows={8}>
                <div style={{ background: "white", borderRadius: 14, overflow: "hidden", border: "1px solid var(--color-border)" }}>
                  {filtered.slice(previewCount, previewCount + 10).map((s, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: "14px 20px",
                        borderBottom: "1px solid var(--color-border)",
                        display: "flex",
                        gap: 12,
                        alignItems: "flex-start",
                      }}
                    >
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: "#f1f5f9", flexShrink: 0 }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 500, color: "var(--color-primary)", marginBottom: 6 }}>
                          {s.subject}
                        </div>
                        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                          <span style={{ fontSize: 12, color: "var(--color-accent)" }}>{s.brand}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </AuthGate>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
