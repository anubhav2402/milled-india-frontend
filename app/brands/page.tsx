"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "../components/Header";
import { useAuth } from "../context/AuthContext";
import { INDUSTRIES } from "../lib/constants";

type BrandStats = {
  email_count: number | string;
  send_frequency: string;
  industry?: string;
};

type BrandWithStats = {
  name: string;
  email_count: number | string;
  send_frequency: string;
  industry?: string;
};

function parseFrequencyPerWeek(freq: string): number {
  if (!freq || freq === "xx" || freq === "1x") return 0;
  const num = parseInt(freq) || 0;
  if (freq.includes("/day")) return num * 7;
  if (freq.includes("/week")) return num;
  if (freq.includes("/month")) return num / 4;
  return 0;
}

function matchesFrequency(freq: string, filter: string): boolean {
  if (filter === "all") return true;
  const perWeek = parseFrequencyPerWeek(freq);
  switch (filter) {
    case "daily": return perWeek >= 7;
    case "active": return perWeek >= 2 && perWeek < 7;
    case "weekly": return perWeek >= 1 && perWeek < 2;
    case "low": return perWeek < 1;
    default: return true;
  }
}

function matchesVolume(count: number | string, filter: string): boolean {
  if (filter === "all") return true;
  if (typeof count !== "number") return true; // don't filter masked stats
  switch (filter) {
    case "100+": return count >= 100;
    case "50-99": return count >= 50 && count < 100;
    case "20-49": return count >= 20 && count < 50;
    case "<20": return count < 20;
    default: return true;
  }
}

export default function BrandsPage() {
  const router = useRouter();
  const { user, token, logout, isLoading: authLoading } = useAuth();

  const [brands, setBrands] = useState<BrandWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [followedBrands, setFollowedBrands] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<"name" | "emails" | "frequency">("emails");

  // Filter state
  const [selectedIndustries, setSelectedIndustries] = useState<Set<string>>(new Set());
  const [showFollowingOnly, setShowFollowingOnly] = useState(false);
  const [frequencyFilter, setFrequencyFilter] = useState("all");
  const [volumeFilter, setVolumeFilter] = useState("all");

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://milled-india-api.onrender.com";

  const fetchFollowedBrands = useCallback(async () => {
    if (!token) {
      setFollowedBrands(new Set());
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/user/follows`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setFollowedBrands(new Set(data.follows));
      }
    } catch (error) {
      console.error("Failed to fetch followed brands:", error);
    }
  }, [token, API_BASE]);

  useEffect(() => {
    const fetchBrands = async () => {
      if (!API_BASE) return;

      try {
        const headers: HeadersInit = {};
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }

        const [brandsRes, statsRes] = await Promise.all([
          fetch(`${API_BASE}/brands`),
          fetch(`${API_BASE}/brands/stats`, { headers }),
        ]);

        if (brandsRes.ok && statsRes.ok) {
          const brandsList: string[] = await brandsRes.json();
          const stats: Record<string, BrandStats> = await statsRes.json();

          const brandsWithStats: BrandWithStats[] = brandsList.map((name) => ({
            name,
            email_count: stats[name]?.email_count ?? "xx",
            send_frequency: stats[name]?.send_frequency ?? "xx",
            industry: stats[name]?.industry || undefined,
          }));

          setBrands(brandsWithStats);
        }
      } catch (error) {
        console.error("Failed to fetch brands:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, [API_BASE, token]);

  useEffect(() => {
    fetchFollowedBrands();
  }, [fetchFollowedBrands]);

  const toggleFollow = async (brandName: string) => {
    if (!user) {
      router.push("/login");
      return;
    }

    const isCurrentlyFollowed = followedBrands.has(brandName);

    try {
      const res = await fetch(`${API_BASE}/user/follows/${encodeURIComponent(brandName)}`, {
        method: isCurrentlyFollowed ? "DELETE" : "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setFollowedBrands((prev) => {
          const updated = new Set(prev);
          if (isCurrentlyFollowed) {
            updated.delete(brandName);
          } else {
            updated.add(brandName);
          }
          return updated;
        });
      }
    } catch (error) {
      console.error("Failed to toggle follow:", error);
    }
  };

  const toggleIndustry = (industry: string) => {
    setSelectedIndustries((prev) => {
      const updated = new Set(prev);
      if (updated.has(industry)) {
        updated.delete(industry);
      } else {
        updated.add(industry);
      }
      return updated;
    });
  };

  const activeFilterCount =
    selectedIndustries.size +
    (showFollowingOnly ? 1 : 0) +
    (frequencyFilter !== "all" ? 1 : 0) +
    (volumeFilter !== "all" ? 1 : 0);

  const clearAllFilters = () => {
    setSelectedIndustries(new Set());
    setShowFollowingOnly(false);
    setFrequencyFilter("all");
    setVolumeFilter("all");
    setSearchQuery("");
  };

  // Filter and sort
  const filteredBrands = brands
    .filter((b) => b.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter((b) => selectedIndustries.size === 0 || selectedIndustries.has(b.industry || ""))
    .filter((b) => !showFollowingOnly || followedBrands.has(b.name))
    .filter((b) => matchesFrequency(b.send_frequency, frequencyFilter))
    .filter((b) => matchesVolume(b.email_count, volumeFilter))
    .sort((a, b) => {
      const aFollowed = followedBrands.has(a.name);
      const bFollowed = followedBrands.has(b.name);
      if (aFollowed && !bFollowed) return -1;
      if (!aFollowed && bFollowed) return 1;

      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      } else if (sortBy === "emails") {
        const aCount = typeof a.email_count === "number" ? a.email_count : 0;
        const bCount = typeof b.email_count === "number" ? b.email_count : 0;
        return bCount - aCount;
      } else {
        const aNum = parseFrequencyPerWeek(a.send_frequency);
        const bNum = parseFrequencyPerWeek(b.send_frequency);
        return bNum - aNum;
      }
    });

  const isAuthenticated = !!user;
  const hasActiveFilters = activeFilterCount > 0 || searchQuery.length > 0;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
      <Header activeRoute="/brands" />

      <main style={{ maxWidth: 1400, margin: "0 auto", padding: "32px 24px" }}>
        {/* Page Header */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 32, fontWeight: 700, color: "#0f172a", margin: "0 0 8px 0" }}>
            Browse Brands
          </h1>
          <p style={{ fontSize: 16, color: "#64748b", margin: 0 }}>
            {hasActiveFilters
              ? `Showing ${filteredBrands.length} of ${brands.length} brands`
              : `Discover and follow ${brands.length} brands to track their email campaigns`}
          </p>
        </div>

        {/* Login Banner */}
        {!isAuthenticated && !authLoading && (
          <div
            style={{
              backgroundColor: "#F5E6DC",
              border: "1px solid #C2714A",
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
              <p style={{ margin: 0, fontSize: 15, fontWeight: 500, color: "#0f172a" }}>
                Login to unlock brand stats and follow your favorite brands
              </p>
              <p style={{ margin: "4px 0 0 0", fontSize: 13, color: "#64748b" }}>
                Stats are hidden until you sign in
              </p>
            </div>
            <Link
              href="/login"
              style={{
                padding: "10px 20px",
                fontSize: 14,
                fontWeight: 600,
                color: "#fff",
                backgroundColor: "#C2714A",
                textDecoration: "none",
                borderRadius: 8,
              }}
            >
              Login to See Stats
            </Link>
          </div>
        )}

        {/* Search and Sort Row */}
        <div
          style={{
            display: "flex",
            gap: 12,
            marginBottom: 16,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          {/* Search */}
          <div style={{ position: "relative", flex: "1 1 300px", maxWidth: 400 }}>
            <svg
              style={{
                position: "absolute",
                left: 14,
                top: "50%",
                transform: "translateY(-50%)",
                width: 18,
                height: 18,
                color: "#94a3b8",
              }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search brands..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 16px 12px 44px",
                fontSize: 14,
                color: "#0f172a",
                border: "1px solid #e2e8f0",
                borderRadius: 10,
                outline: "none",
                backgroundColor: "#fff",
              }}
            />
          </div>

          {/* Sort */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 13, color: "#64748b" }}>Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              style={{
                padding: "10px 14px",
                fontSize: 14,
                color: "#0f172a",
                border: "1px solid #e2e8f0",
                borderRadius: 8,
                backgroundColor: "#fff",
                cursor: "pointer",
                outline: "none",
              }}
            >
              <option value="emails">Most Emails</option>
              <option value="name">Name (A-Z)</option>
              <option value="frequency">Send Frequency</option>
            </select>
          </div>

          {/* Following toggle (only when logged in and following brands) */}
          {isAuthenticated && followedBrands.size > 0 && (
            <button
              onClick={() => setShowFollowingOnly(!showFollowingOnly)}
              style={{
                padding: "10px 16px",
                fontSize: 13,
                fontWeight: 600,
                border: showFollowingOnly ? "2px solid #C2714A" : "1px solid #e2e8f0",
                borderRadius: 10,
                cursor: "pointer",
                backgroundColor: showFollowingOnly ? "#FDF2EC" : "#fff",
                color: showFollowingOnly ? "#C2714A" : "#64748b",
                display: "flex",
                alignItems: "center",
                gap: 6,
                whiteSpace: "nowrap",
              }}
            >
              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Following ({followedBrands.size})
            </button>
          )}

          {/* Clear all */}
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              style={{
                padding: "10px 14px",
                fontSize: 13,
                fontWeight: 500,
                border: "none",
                borderRadius: 8,
                cursor: "pointer",
                backgroundColor: "transparent",
                color: "#ef4444",
                whiteSpace: "nowrap",
              }}
            >
              Clear all{activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
            </button>
          )}
        </div>

        {/* Industry Pills */}
        <div
          style={{
            display: "flex",
            gap: 8,
            marginBottom: 16,
            overflowX: "auto",
            paddingBottom: 4,
            WebkitOverflowScrolling: "touch",
          }}
          className="hide-scrollbar"
        >
          {INDUSTRIES.map((industry) => {
            const isSelected = selectedIndustries.has(industry);
            return (
              <button
                key={industry}
                onClick={() => toggleIndustry(industry)}
                style={{
                  padding: "7px 14px",
                  fontSize: 13,
                  fontWeight: 500,
                  border: isSelected ? "2px solid #C2714A" : "1px solid #e2e8f0",
                  borderRadius: 20,
                  cursor: "pointer",
                  backgroundColor: isSelected ? "#FDF2EC" : "#fff",
                  color: isSelected ? "#C2714A" : "#64748b",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                  transition: "all 0.15s",
                }}
              >
                {industry}
              </button>
            );
          })}
        </div>

        {/* Quick Filters Row */}
        <div
          style={{
            display: "flex",
            gap: 12,
            marginBottom: 24,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          {/* Frequency filter */}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 13, color: "#64748b" }}>Activity:</span>
            <select
              value={frequencyFilter}
              onChange={(e) => setFrequencyFilter(e.target.value)}
              style={{
                padding: "8px 12px",
                fontSize: 13,
                color: frequencyFilter !== "all" ? "#C2714A" : "#0f172a",
                fontWeight: frequencyFilter !== "all" ? 600 : 400,
                border: frequencyFilter !== "all" ? "2px solid #C2714A" : "1px solid #e2e8f0",
                borderRadius: 8,
                backgroundColor: frequencyFilter !== "all" ? "#FDF2EC" : "#fff",
                cursor: "pointer",
                outline: "none",
              }}
            >
              <option value="all">All</option>
              <option value="daily">Daily (7+/week)</option>
              <option value="active">Active (2-6x/week)</option>
              <option value="weekly">Weekly (1x/week)</option>
              <option value="low">Low (&lt;1x/week)</option>
            </select>
          </div>

          {/* Volume filter */}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 13, color: "#64748b" }}>Emails:</span>
            <select
              value={volumeFilter}
              onChange={(e) => setVolumeFilter(e.target.value)}
              style={{
                padding: "8px 12px",
                fontSize: 13,
                color: volumeFilter !== "all" ? "#C2714A" : "#0f172a",
                fontWeight: volumeFilter !== "all" ? 600 : 400,
                border: volumeFilter !== "all" ? "2px solid #C2714A" : "1px solid #e2e8f0",
                borderRadius: 8,
                backgroundColor: volumeFilter !== "all" ? "#FDF2EC" : "#fff",
                cursor: "pointer",
                outline: "none",
              }}
            >
              <option value="all">All</option>
              <option value="100+">100+ emails</option>
              <option value="50-99">50-99 emails</option>
              <option value="20-49">20-49 emails</option>
              <option value="<20">Under 20</option>
            </select>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: 300,
            }}
          >
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
          /* Brands Grid */
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: 20,
            }}
          >
            {filteredBrands.map((brand) => (
              <BrandCard
                key={brand.name}
                brand={brand}
                isFollowed={followedBrands.has(brand.name)}
                onToggleFollow={() => toggleFollow(brand.name)}
                isAuthenticated={isAuthenticated}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredBrands.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "60px 20px",
              color: "#64748b",
            }}
          >
            <p style={{ fontSize: 16, margin: "0 0 8px 0" }}>No brands found</p>
            <p style={{ fontSize: 14, margin: "0 0 16px 0" }}>
              Try adjusting your filters or search query
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                style={{
                  padding: "10px 20px",
                  fontSize: 14,
                  fontWeight: 600,
                  border: "1px solid #e2e8f0",
                  borderRadius: 8,
                  cursor: "pointer",
                  backgroundColor: "#fff",
                  color: "#C2714A",
                }}
              >
                Clear all filters
              </button>
            )}
          </div>
        )}
      </main>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}

// Brand Card Component
function BrandCard({
  brand,
  isFollowed,
  onToggleFollow,
  isAuthenticated,
}: {
  brand: BrandWithStats;
  isFollowed: boolean;
  onToggleFollow: () => void;
  isAuthenticated: boolean;
}) {
  const brandInitial = brand.name.charAt(0).toUpperCase();
  const isMasked = brand.email_count === "xx";

  const colors = [
    "#C2714A", "#6366f1", "#f59e0b", "#ec4899", "#8b5cf6",
    "#059669", "#3b82f6", "#ef4444", "#84cc16", "#0ea5e9",
  ];
  const colorIndex = brand.name.charCodeAt(0) % colors.length;
  const brandColor = colors[colorIndex];

  return (
    <div
      style={{
        backgroundColor: "#fff",
        borderRadius: 16,
        border: isFollowed ? `2px solid ${brandColor}` : "1px solid #e2e8f0",
        padding: 20,
        display: "flex",
        flexDirection: "column",
        gap: 16,
        transition: "all 0.2s",
        position: "relative",
      }}
      className="hover-button"
    >
      {/* Following Badge */}
      {isFollowed && (
        <div
          style={{
            position: "absolute",
            top: -1,
            right: 16,
            backgroundColor: brandColor,
            color: "#fff",
            fontSize: 10,
            fontWeight: 600,
            padding: "4px 10px",
            borderRadius: "0 0 8px 8px",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          Following
        </div>
      )}

      {/* Brand Header */}
      <Link
        href={`/brand/${encodeURIComponent(brand.name)}`}
        style={{ display: "flex", alignItems: "center", gap: 14, textDecoration: "none" }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            background: `linear-gradient(135deg, ${brandColor}20 0%, ${brandColor}10 100%)`,
            borderRadius: 14,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 700,
            color: brandColor,
            fontSize: 24,
            flexShrink: 0,
          }}
        >
          {brandInitial}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <h3
            style={{
              margin: 0,
              fontSize: 16,
              fontWeight: 600,
              color: "#0f172a",
              textTransform: "capitalize",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {brand.name}
          </h3>
          {brand.industry ? (
            <p style={{ margin: "4px 0 0 0", fontSize: 12, color: "#94a3b8" }}>
              {brand.industry}
            </p>
          ) : (
            <p
              style={{
                margin: "4px 0 0 0",
                fontSize: 13,
                color: isMasked ? "#94a3b8" : "#64748b",
              }}
            >
              {isMasked ? "Login to see stats" : `${brand.email_count} emails`}
            </p>
          )}
        </div>
      </Link>

      {/* Stats */}
      <div
        style={{
          display: "flex",
          gap: 12,
          padding: "12px 0",
          borderTop: "1px solid #f1f5f9",
          borderBottom: "1px solid #f1f5f9",
        }}
      >
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 2 }}>
            Total Emails
          </div>
          <div style={{ fontSize: 18, fontWeight: 600, color: isMasked ? "#cbd5e1" : "#0f172a" }}>
            {brand.email_count}
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 2 }}>
            Send Frequency
          </div>
          <div style={{ fontSize: 18, fontWeight: 600, color: isMasked ? "#cbd5e1" : "#0f172a" }}>
            {brand.send_frequency}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 10 }}>
        <button
          onClick={onToggleFollow}
          style={{
            flex: 1,
            padding: "12px 16px",
            fontSize: 14,
            fontWeight: 600,
            border: "none",
            borderRadius: 10,
            cursor: "pointer",
            transition: "all 0.2s",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            backgroundColor: isFollowed ? "#f1f5f9" : isAuthenticated ? "#C2714A" : "#e2e8f0",
            color: isFollowed ? "#64748b" : isAuthenticated ? "#fff" : "#64748b",
          }}
        >
          {isAuthenticated ? (
            isFollowed ? (
              <>
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Following
              </>
            ) : (
              <>
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Follow
              </>
            )
          ) : (
            <>
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Login to Follow
            </>
          )}
        </button>

        <Link
          href={`/browse?brand=${encodeURIComponent(brand.name)}`}
          style={{
            padding: "12px 16px",
            fontSize: 14,
            fontWeight: 500,
            border: "1px solid #e2e8f0",
            borderRadius: 10,
            cursor: "pointer",
            textDecoration: "none",
            color: "#64748b",
            backgroundColor: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s",
          }}
        >
          View Emails
        </Link>
      </div>
    </div>
  );
}
