"use client";

import Logo from "../components/Logo";
import EmailCard from "../components/EmailCard";
import { useState, useEffect, useCallback } from "react";

type Email = {
  id: number;
  subject: string;
  brand?: string;
  preview?: string;
  type?: string;
  category?: string;
  industry?: string;
  received_at: string;
};

// Industry list for filtering
const INDUSTRIES = [
  "Beauty & Personal Care",
  "Women's Fashion",
  "Men's Fashion",
  "Food & Beverages",
  "Travel & Hospitality",
  "Electronics & Gadgets",
  "Home & Living",
  "Health & Wellness",
  "Finance & Fintech",
  "Kids & Baby",
  "Sports & Fitness",
  "Entertainment",
  "General Retail",
];

// Date filter options
const DATE_FILTERS = [
  { label: "All Time", value: "all" },
  { label: "Last 7 Days", value: "7" },
  { label: "Last 30 Days", value: "30" },
  { label: "Last 90 Days", value: "90" },
];

const ITEMS_PER_PAGE = 24;
const FETCH_BATCH_SIZE = 100; // Fetch 100 emails at a time from server

type BrandStats = {
  [brand: string]: {
    email_count: number;
    send_frequency: string;
  };
};

export default function BrowsePage() {
  const [emails, setEmails] = useState<Email[]>([]);
  const [allBrands, setAllBrands] = useState<string[]>([]);
  const [brandStats, setBrandStats] = useState<BrandStats>({});
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [hasMoreOnServer, setHasMoreOnServer] = useState(true);
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  
  // Filter states
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState("all");
  
  // Sidebar collapse state for mobile
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Fetch emails with filters from API (with pagination)
  const fetchEmails = useCallback(async (
    industry?: string, 
    brand?: string, 
    search?: string,
    skip: number = 0,
    append: boolean = false
  ) => {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!base) return;
    
    try {
      const params = new URLSearchParams();
      params.set("limit", String(FETCH_BATCH_SIZE));
      params.set("skip", String(skip));
      if (industry) params.set("industry", industry);
      if (brand) params.set("brand", brand);
      if (search) params.set("q", search);
      
      const res = await fetch(`${base}/emails?${params.toString()}`, {
        cache: "no-store",
      });
      if (res.ok) {
        const data: Email[] = await res.json();
        if (append) {
          setEmails(prev => [...prev, ...data]);
        } else {
          setEmails(data);
        }
        // If we got fewer than batch size, no more on server
        setHasMoreOnServer(data.length === FETCH_BATCH_SIZE);
      }
    } catch (error) {
      console.error("Failed to fetch emails:", error);
    }
  }, []);

  // Fetch brands list separately (cached)
  const fetchBrands = useCallback(async () => {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!base) return;
    
    try {
      const res = await fetch(`${base}/brands`, {
        cache: "force-cache",
        next: { revalidate: 300 },
      });
      if (res.ok) {
        const data = await res.json();
        setAllBrands(data);
      }
    } catch {
      // Brands endpoint might not exist, that's ok
      console.log("Brands endpoint not available");
    }
  }, []);

  // Fetch brand stats (send frequency)
  const fetchBrandStats = useCallback(async () => {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!base) return;
    
    try {
      const res = await fetch(`${base}/brands/stats`, {
        cache: "force-cache",
        next: { revalidate: 300 },
      });
      if (res.ok) {
        const data = await res.json();
        setBrandStats(data);
      }
    } catch {
      console.log("Brand stats endpoint not available");
    }
  }, []);

  // Initial load
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([fetchEmails(), fetchBrands(), fetchBrandStats()]);
      setLoading(false);
      setInitialLoadDone(true);
    };
    init();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Refetch when filters change (only after initial load)
  useEffect(() => {
    if (!initialLoadDone) return;
    
    const industry = selectedIndustries.length === 1 ? selectedIndustries[0] : undefined;
    const brand = selectedBrands.length === 1 ? selectedBrands[0] : undefined;
    fetchEmails(industry, brand, searchQuery || undefined, 0, false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIndustries, selectedBrands, searchQuery]);

  // Filter emails based on selections (client-side filtering for multi-select and date)
  const filteredEmails = emails.filter((email) => {
    // Multi-brand filter (client side)
    if (selectedBrands.length > 1 && !selectedBrands.includes(email.brand || "")) {
      return false;
    }
    
    // Multi-industry filter (client side)
    if (selectedIndustries.length > 1 && !selectedIndustries.includes(email.industry || "")) {
      return false;
    }
    
    // Date filter
    if (selectedDate !== "all") {
      const days = parseInt(selectedDate);
      const emailDate = new Date(email.received_at);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      if (emailDate < cutoffDate) return false;
    }
    
    return true;
  });

  // Load more from server
  const loadMore = async () => {
    setLoadingMore(true);
    const industry = selectedIndustries.length === 1 ? selectedIndustries[0] : undefined;
    const brand = selectedBrands.length === 1 ? selectedBrands[0] : undefined;
    await fetchEmails(industry, brand, searchQuery || undefined, emails.length, true);
    setLoadingMore(false);
  };

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const toggleIndustry = (industry: string) => {
    setSelectedIndustries((prev) =>
      prev.includes(industry) ? prev.filter((i) => i !== industry) : [...prev, industry]
    );
  };

  const clearAllFilters = () => {
    setSelectedBrands([]);
    setSelectedIndustries([]);
    setSelectedDate("all");
    setSearchQuery("");
  };

  const activeFilterCount = selectedBrands.length + selectedIndustries.length + (selectedDate !== "all" ? 1 : 0);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
      {/* Header */}
      <header
        style={{
          backgroundColor: "#fff",
          borderBottom: "1px solid #e5e5e5",
          padding: "16px 0",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <a href="/" style={{ textDecoration: "none", color: "inherit", display: "flex", alignItems: "center", gap: 8 }}>
              <Logo size={36} />
              <span style={{ fontSize: 24, fontWeight: 700, color: "#1a1a1a" }}>MailMuse</span>
            </a>
            
            {/* Search bar */}
            <div style={{ flex: 1, maxWidth: 500 }}>
              <div style={{ position: "relative" }}>
                <input
                  type="text"
                  placeholder="Search by brand, subject, or keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px 16px 12px 44px",
                    border: "1px solid #e2e8f0",
                    borderRadius: 10,
                    fontSize: 14,
                    color: "#1a1a1a",
                    backgroundColor: "#f8fafc",
                    outline: "none",
                  }}
                />
                <svg
                  style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }}
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            
            {/* Mobile filter toggle */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{
                display: "none",
                padding: "10px 16px",
                backgroundColor: "#14b8a6",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                fontWeight: 600,
                fontSize: 14,
                cursor: "pointer",
              }}
              className="mobile-filter-btn"
            >
              Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
            </button>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "24px", display: "flex", gap: 24 }}>
        {/* Left Sidebar - Filters */}
        <aside
          className={`filter-sidebar ${sidebarOpen ? "open" : ""}`}
          style={{
            width: 280,
            flexShrink: 0,
            position: "sticky",
            top: 100,
            height: "fit-content",
            maxHeight: "calc(100vh - 120px)",
            overflowY: "auto",
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: 16,
              border: "1px solid #e2e8f0",
              overflow: "hidden",
            }}
          >
            {/* Filter Header */}
            <div
              style={{
                padding: "16px 20px",
                borderBottom: "1px solid #e2e8f0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ fontSize: 16, fontWeight: 700, color: "#1a1a1a" }}>Filters</span>
              {activeFilterCount > 0 && (
                <button
                  onClick={clearAllFilters}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#14b8a6",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                    padding: 0,
                  }}
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Industry Filter */}
            <div style={{ borderBottom: "1px solid #e2e8f0" }}>
              <div style={{ padding: "16px 20px 12px", fontSize: 13, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Industry
              </div>
              <div style={{ padding: "0 12px 16px", maxHeight: 240, overflowY: "auto" }}>
                {INDUSTRIES.map((industry) => (
                  <label
                    key={industry}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "8px 8px",
                      borderRadius: 8,
                      cursor: "pointer",
                      transition: "background-color 0.15s",
                      backgroundColor: selectedIndustries.includes(industry) ? "#f0fdfa" : "transparent",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedIndustries.includes(industry)}
                      onChange={() => toggleIndustry(industry)}
                      style={{
                        width: 18,
                        height: 18,
                        accentColor: "#14b8a6",
                        cursor: "pointer",
                      }}
                    />
                    <span style={{ fontSize: 14, color: "#374151" }}>{industry}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Brand Filter */}
            <div style={{ borderBottom: "1px solid #e2e8f0" }}>
              <div style={{ padding: "16px 20px 12px", fontSize: 13, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Brand ({allBrands.length})
              </div>
              <div style={{ padding: "0 12px 16px", maxHeight: 280, overflowY: "auto" }}>
                {allBrands.length === 0 ? (
                  <p style={{ fontSize: 13, color: "#94a3b8", padding: "8px" }}>Loading brands...</p>
                ) : (
                  allBrands.map((brand) => (
                    <label
                      key={brand}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "8px 8px",
                        borderRadius: 8,
                        cursor: "pointer",
                        transition: "background-color 0.15s",
                        backgroundColor: selectedBrands.includes(brand) ? "#f0fdfa" : "transparent",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand)}
                        onChange={() => toggleBrand(brand)}
                        style={{
                          width: 18,
                          height: 18,
                          accentColor: "#14b8a6",
                          cursor: "pointer",
                        }}
                      />
                      <span style={{ fontSize: 14, color: "#374151", textTransform: "capitalize" }}>{brand}</span>
                    </label>
                  ))
                )}
              </div>
            </div>

            {/* Date Filter */}
            <div>
              <div style={{ padding: "16px 20px 12px", fontSize: 13, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Date
              </div>
              <div style={{ padding: "0 12px 16px" }}>
                {DATE_FILTERS.map((option) => (
                  <label
                    key={option.value}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "8px 8px",
                      borderRadius: 8,
                      cursor: "pointer",
                      transition: "background-color 0.15s",
                      backgroundColor: selectedDate === option.value ? "#f0fdfa" : "transparent",
                    }}
                  >
                    <input
                      type="radio"
                      name="date"
                      checked={selectedDate === option.value}
                      onChange={() => setSelectedDate(option.value)}
                      style={{
                        width: 18,
                        height: 18,
                        accentColor: "#14b8a6",
                        cursor: "pointer",
                      }}
                    />
                    <span style={{ fontSize: 14, color: "#374151" }}>{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main style={{ flex: 1, minWidth: 0 }}>
          {/* Results header */}
          <div style={{ marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <span style={{ fontSize: 14, color: "#64748b" }}>
                {loading ? "Loading..." : `${filteredEmails.length} emails found`}
              </span>
              {activeFilterCount > 0 && (
                <span style={{ fontSize: 14, color: "#14b8a6", marginLeft: 8 }}>
                  ({activeFilterCount} filter{activeFilterCount > 1 ? "s" : ""} applied)
                </span>
              )}
            </div>
            
            {/* Active filter chips */}
            {activeFilterCount > 0 && (
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {selectedIndustries.map((ind) => (
                  <span
                    key={ind}
                    onClick={() => toggleIndustry(ind)}
                    style={{
                      padding: "4px 10px",
                      backgroundColor: "#f0fdfa",
                      border: "1px solid #14b8a6",
                      borderRadius: 20,
                      fontSize: 12,
                      color: "#14b8a6",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    {ind} <span style={{ fontWeight: 700 }}>×</span>
                  </span>
                ))}
                {selectedBrands.map((b) => (
                  <span
                    key={b}
                    onClick={() => toggleBrand(b)}
                    style={{
                      padding: "4px 10px",
                      backgroundColor: "#f0fdfa",
                      border: "1px solid #14b8a6",
                      borderRadius: 20,
                      fontSize: 12,
                      color: "#14b8a6",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      textTransform: "capitalize",
                    }}
                  >
                    {b} <span style={{ fontWeight: 700 }}>×</span>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Email Grid */}
          {loading ? (
            <div style={{ textAlign: "center", padding: "80px 20px", color: "#94a3b8" }}>
              <div style={{ 
                width: 40, 
                height: 40, 
                border: "3px solid #e2e8f0", 
                borderTopColor: "#14b8a6", 
                borderRadius: "50%", 
                margin: "0 auto 16px",
                animation: "spin 1s linear infinite",
              }} />
              <div style={{ fontSize: 15 }}>Loading emails...</div>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          ) : filteredEmails.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 20px", color: "#94a3b8" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
              <div style={{ fontSize: 18, fontWeight: 600, color: "#64748b", marginBottom: 8 }}>No emails found</div>
              <div style={{ fontSize: 14 }}>Try adjusting your filters or search query</div>
              {activeFilterCount > 0 && (
                <button
                  onClick={clearAllFilters}
                  style={{
                    marginTop: 16,
                    padding: "10px 20px",
                    backgroundColor: "#14b8a6",
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Clear All Filters
                </button>
              )}
            </div>
          ) : (
            <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: 20,
              }}
            >
              {filteredEmails.map((e) => (
                <EmailCard
                  key={e.id}
                  id={e.id}
                  subject={e.subject}
                  brand={e.brand}
                  preview={e.preview}
                  industry={e.industry}
                  received_at={e.received_at}
                  campaignType={e.type}
                  sendFrequency={e.brand ? brandStats[e.brand]?.send_frequency : undefined}
                />
              ))}
            </div>
            
            {/* Load More Button */}
            {hasMoreOnServer && (
              <div style={{ textAlign: "center", marginTop: 32 }}>
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  style={{
                    padding: "14px 40px",
                    backgroundColor: loadingMore ? "#94a3b8" : "#14b8a6",
                    color: "#fff",
                    border: "none",
                    borderRadius: 10,
                    fontWeight: 600,
                    fontSize: 15,
                    cursor: loadingMore ? "wait" : "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  {loadingMore ? "Loading..." : "Load More Emails"}
                </button>
              </div>
            )}
            
            {/* Showing count */}
            <div style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: "#94a3b8" }}>
              Showing {filteredEmails.length} emails {hasMoreOnServer && "(more available)"}
            </div>
            </>
          )}
        </main>
      </div>

      {/* Mobile filter overlay */}
      {sidebarOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 200,
          }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <style>{`
        @media (max-width: 900px) {
          .filter-sidebar {
            position: fixed !important;
            top: 0 !important;
            left: -300px;
            bottom: 0;
            width: 280px !important;
            max-height: 100vh !important;
            z-index: 300;
            transition: left 0.3s ease;
            padding: 20px;
            background: #f8fafc;
          }
          .filter-sidebar.open {
            left: 0;
          }
          .mobile-filter-btn {
            display: flex !important;
          }
        }
      `}</style>
    </div>
  );
}
