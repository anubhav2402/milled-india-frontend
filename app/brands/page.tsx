"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Logo from "../components/Logo";
import { useAuth } from "../context/AuthContext";

type BrandStats = {
  email_count: number | string;
  send_frequency: string;
};

type BrandWithStats = {
  name: string;
  email_count: number | string;
  send_frequency: string;
  industry?: string;
};

export default function BrandsPage() {
  const router = useRouter();
  const { user, token, logout, isLoading: authLoading } = useAuth();
  
  const [brands, setBrands] = useState<BrandWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [followedBrands, setFollowedBrands] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<"name" | "emails" | "frequency">("emails");

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://milled-india-api.onrender.com";

  // Fetch followed brands from API for logged-in users
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

  // Fetch brands and stats
  useEffect(() => {
    const fetchBrands = async () => {
      if (!API_BASE) return;

      try {
        const headers: HeadersInit = {};
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }

        // Fetch both brands list and stats
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

  // Fetch followed brands when token changes
  useEffect(() => {
    fetchFollowedBrands();
  }, [fetchFollowedBrands]);

  const toggleFollow = async (brandName: string) => {
    if (!user) {
      // Redirect to login
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

  // Filter and sort brands
  const filteredBrands = brands
    .filter((brand) =>
      brand.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      // Always put followed brands first
      const aFollowed = followedBrands.has(a.name);
      const bFollowed = followedBrands.has(b.name);
      if (aFollowed && !bFollowed) return -1;
      if (!aFollowed && bFollowed) return 1;

      // Then sort by selected criteria
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      } else if (sortBy === "emails") {
        const aCount = typeof a.email_count === "number" ? a.email_count : 0;
        const bCount = typeof b.email_count === "number" ? b.email_count : 0;
        return bCount - aCount;
      } else {
        // Sort by frequency (extract number from string like "3x/week")
        const aNum = typeof a.send_frequency === "string" ? parseInt(a.send_frequency) || 0 : 0;
        const bNum = typeof b.send_frequency === "string" ? parseInt(b.send_frequency) || 0 : 0;
        return bNum - aNum;
      }
    });

  const isAuthenticated = !!user;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
      {/* Header */}
      <header
        style={{
          backgroundColor: "#fff",
          borderBottom: "1px solid #e2e8f0",
          padding: "16px 24px",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <div
          style={{
            maxWidth: 1400,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 24,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
            <Link
              href="/"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                textDecoration: "none",
              }}
            >
              <Logo size={36} />
              <span style={{ fontFamily: "var(--font-dm-serif)", fontSize: 20, color: "var(--color-primary)", letterSpacing: "-0.01em" }}>
                Mail <em style={{ fontStyle: "italic", color: "var(--color-accent)" }}>Muse</em>
              </span>
            </Link>

            <nav style={{ display: "flex", gap: 24, alignItems: "center" }}>
              <Link
                href="/browse"
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: "#64748b",
                  textDecoration: "none",
                }}
              >
                Browse Emails
              </Link>
              <Link
                href="/brands"
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#C2714A",
                  textDecoration: "none",
                }}
              >
                Browse Brands
              </Link>
              <Link
                href="/analytics"
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: "#64748b",
                  textDecoration: "none",
                }}
              >
                Analytics
              </Link>
            </nav>
          </div>

          {/* Auth Section */}
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            {authLoading ? (
              <div style={{ width: 80, height: 36 }} />
            ) : user ? (
              <>
                <span style={{ fontSize: 14, color: "#64748b" }}>
                  {user.name || user.email}
                </span>
                <button
                  onClick={logout}
                  style={{
                    padding: "8px 16px",
                    fontSize: 14,
                    fontWeight: 500,
                    color: "#64748b",
                    backgroundColor: "#f1f5f9",
                    border: "none",
                    borderRadius: 8,
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  style={{
                    padding: "10px 20px",
                    fontSize: 14,
                    fontWeight: 500,
                    color: "#64748b",
                    textDecoration: "none",
                    transition: "all 0.2s",
                  }}
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  style={{
                    padding: "10px 20px",
                    fontSize: 14,
                    fontWeight: 600,
                    color: "#fff",
                    backgroundColor: "#C2714A",
                    textDecoration: "none",
                    borderRadius: 8,
                    transition: "all 0.2s",
                  }}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: 1400, margin: "0 auto", padding: "32px 24px" }}>
        {/* Page Header */}
        <div style={{ marginBottom: 32 }}>
          <h1
            style={{
              fontSize: 32,
              fontWeight: 700,
              color: "#0f172a",
              margin: "0 0 8px 0",
            }}
          >
            Browse Brands
          </h1>
          <p style={{ fontSize: 16, color: "#64748b", margin: 0 }}>
            Discover and follow {brands.length} brands to track their email campaigns
          </p>
        </div>

        {/* Login Banner for non-authenticated users */}
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

        {/* Search and Sort */}
        <div
          style={{
            display: "flex",
            gap: 16,
            marginBottom: 24,
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
            <span style={{ fontSize: 13, color: "#64748b" }}>Sort by:</span>
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

          {/* Following count */}
          {followedBrands.size > 0 && (
            <div
              style={{
                padding: "8px 14px",
                backgroundColor: "#F5E6DC",
                borderRadius: 8,
                fontSize: 13,
                color: "#C2714A",
                fontWeight: 500,
              }}
            >
              Following {followedBrands.size} brand{followedBrands.size !== 1 ? "s" : ""}
            </div>
          )}
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
            <p style={{ fontSize: 14, margin: 0 }}>
              Try adjusting your search query
            </p>
          </div>
        )}
      </main>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
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

  // Generate a consistent color based on brand name
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
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        {/* Brand Logo/Initial */}
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

        {/* Brand Info */}
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
          <p
            style={{
              margin: "4px 0 0 0",
              fontSize: 13,
              color: isMasked ? "#94a3b8" : "#64748b",
            }}
          >
            {isMasked ? "Login to see stats" : `${brand.email_count} emails`}
          </p>
        </div>
      </div>

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
