"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Logo from "../components/Logo";

type BrandStats = {
  email_count: number;
  send_frequency: string;
};

type BrandWithStats = {
  name: string;
  email_count: number;
  send_frequency: string;
  industry?: string;
};

export default function BrandsPage() {
  const [brands, setBrands] = useState<BrandWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [followedBrands, setFollowedBrands] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<"name" | "emails" | "frequency">("emails");

  useEffect(() => {
    // Load followed brands from localStorage
    const saved = localStorage.getItem("followedBrands");
    if (saved) {
      setFollowedBrands(new Set(JSON.parse(saved)));
    }
  }, []);

  useEffect(() => {
    const fetchBrands = async () => {
      const base = process.env.NEXT_PUBLIC_API_BASE_URL;
      if (!base) return;

      try {
        // Fetch both brands list and stats
        const [brandsRes, statsRes] = await Promise.all([
          fetch(`${base}/brands`),
          fetch(`${base}/brands/stats`),
        ]);

        if (brandsRes.ok && statsRes.ok) {
          const brandsList: string[] = await brandsRes.json();
          const stats: Record<string, BrandStats> = await statsRes.json();

          const brandsWithStats: BrandWithStats[] = brandsList.map((name) => ({
            name,
            email_count: stats[name]?.email_count || 0,
            send_frequency: stats[name]?.send_frequency || "Unknown",
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
  }, []);

  const toggleFollow = (brandName: string) => {
    setFollowedBrands((prev) => {
      const updated = new Set(prev);
      if (updated.has(brandName)) {
        updated.delete(brandName);
      } else {
        updated.add(brandName);
      }
      localStorage.setItem("followedBrands", JSON.stringify([...updated]));
      return updated;
    });
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
        return b.email_count - a.email_count;
      } else {
        // Sort by frequency (extract number from string like "3x/week")
        const aNum = parseInt(a.send_frequency) || 0;
        const bNum = parseInt(b.send_frequency) || 0;
        return bNum - aNum;
      }
    });

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
            <span
              style={{
                fontWeight: 700,
                fontSize: 20,
                color: "#0f172a",
                letterSpacing: "-0.02em",
              }}
            >
              MailMuse
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
                color: "#14b8a6",
                textDecoration: "none",
              }}
            >
              Browse Brands
            </Link>
          </nav>
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
                backgroundColor: "#f0fdfa",
                borderRadius: 8,
                fontSize: 13,
                color: "#14b8a6",
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
                borderTopColor: "#14b8a6",
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
}: {
  brand: BrandWithStats;
  isFollowed: boolean;
  onToggleFollow: () => void;
}) {
  const brandInitial = brand.name.charAt(0).toUpperCase();

  // Generate a consistent color based on brand name
  const colors = [
    "#14b8a6", "#6366f1", "#f59e0b", "#ec4899", "#8b5cf6",
    "#10b981", "#3b82f6", "#ef4444", "#84cc16", "#06b6d4",
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
              color: "#64748b",
            }}
          >
            {brand.email_count} email{brand.email_count !== 1 ? "s" : ""}
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
          <div style={{ fontSize: 18, fontWeight: 600, color: "#0f172a" }}>
            {brand.email_count}
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 2 }}>
            Send Frequency
          </div>
          <div style={{ fontSize: 18, fontWeight: 600, color: "#0f172a" }}>
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
            backgroundColor: isFollowed ? "#f1f5f9" : brandColor,
            color: isFollowed ? "#64748b" : "#fff",
          }}
        >
          {isFollowed ? (
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
