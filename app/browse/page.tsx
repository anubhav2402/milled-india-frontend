"use client";

import Logo from "../components/Logo";
import { useState, useEffect } from "react";

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

export default function BrowsePage() {
  const [emails, setEmails] = useState<Email[]>([]);
  const [allBrands, setAllBrands] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter states
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState("all");
  
  // Sidebar collapse state for mobile
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Fetch emails
  useEffect(() => {
    const fetchEmails = async () => {
      setLoading(true);
      const base = process.env.NEXT_PUBLIC_API_BASE_URL;
      if (!base) return;
      
      try {
        const params = new URLSearchParams();
        params.set("limit", "500");
        const res = await fetch(`${base}/emails?${params.toString()}`);
        if (res.ok) {
          const data: Email[] = await res.json();
          setEmails(data);
          
          // Extract unique brands
          const brands = new Set(data.map((e) => e.brand).filter(Boolean));
          setAllBrands(Array.from(brands).sort() as string[]);
        }
      } catch (error) {
        console.error("Failed to fetch emails:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchEmails();
  }, []);

  // Filter emails based on selections
  const filteredEmails = emails.filter((email) => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        email.subject?.toLowerCase().includes(query) ||
        email.brand?.toLowerCase().includes(query) ||
        email.preview?.toLowerCase().includes(query);
      if (!matchesSearch) return false;
    }
    
    // Brand filter
    if (selectedBrands.length > 0 && !selectedBrands.includes(email.brand || "")) {
      return false;
    }
    
    // Industry filter
    if (selectedIndustries.length > 0 && !selectedIndustries.includes(email.industry || "")) {
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
              <div style={{ fontSize: 16 }}>Loading emails...</div>
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
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                gap: 20,
              }}
            >
              {filteredEmails.map((e) => {
                const brandInitial = e.brand ? e.brand.charAt(0).toUpperCase() : "?";
                const receivedDate = new Date(e.received_at);
                const formattedDate = receivedDate.toLocaleDateString("en-IN", {
                  month: "short",
                  day: "numeric",
                });

                return (
                  <a
                    key={e.id}
                    href={`/email/${e.id}`}
                    style={{
                      backgroundColor: "#fff",
                      borderRadius: 14,
                      border: "1px solid #e2e8f0",
                      padding: 20,
                      textDecoration: "none",
                      color: "inherit",
                      display: "flex",
                      flexDirection: "column",
                      transition: "all 0.2s",
                      cursor: "pointer",
                    }}
                    className="hover-button"
                  >
                    {/* Brand header */}
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          background: "#f0fdfa",
                          borderRadius: 10,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 700,
                          color: "#14b8a6",
                          fontSize: 16,
                          flexShrink: 0,
                        }}
                      >
                        {brandInitial}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: "#1a1a1a", textTransform: "capitalize", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {e.brand || "Unknown"}
                        </div>
                        {e.industry && (
                          <div style={{ fontSize: 12, color: "#14b8a6", fontWeight: 500 }}>{e.industry}</div>
                        )}
                      </div>
                      <time style={{ fontSize: 12, color: "#94a3b8", flexShrink: 0 }}>{formattedDate}</time>
                    </div>

                    {/* Subject */}
                    <h3
                      style={{
                        margin: "0 0 8px 0",
                        fontSize: 15,
                        fontWeight: 600,
                        color: "#1a1a1a",
                        lineHeight: 1.4,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        flex: 1,
                      }}
                    >
                      {e.subject}
                    </h3>

                    {/* Preview */}
                    {e.preview && (
                      <p
                        style={{
                          margin: 0,
                          fontSize: 13,
                          color: "#64748b",
                          lineHeight: 1.5,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {e.preview}
                      </p>
                    )}
                  </a>
                );
              })}
            </div>
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
