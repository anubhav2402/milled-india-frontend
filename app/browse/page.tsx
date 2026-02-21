"use client";

import { useState, useEffect, useCallback, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Logo from "../components/Logo";
import EmailCard, { EmailCardSkeleton } from "../components/EmailCard";
import Button from "../components/Button";
import Badge from "../components/Badge";
import Input from "../components/Input";
import { API_BASE } from "../lib/constants";
import { useAuth } from "../context/AuthContext";
import { getNavLinks } from "../lib/nav";

type Email = {
  id: number;
  subject: string;
  brand?: string;
  preview?: string;
  type?: string;
  industry?: string;
  received_at: string;
};

type BrandStats = {
  [brand: string]: {
    email_count: number;
    send_frequency: string;
  };
};

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

const DATE_FILTERS = [
  { label: "All Time", value: "all" },
  { label: "Last 7 Days", value: "7" },
  { label: "Last 30 Days", value: "30" },
  { label: "Last 90 Days", value: "90" },
];

const ITEMS_PER_PAGE = 24;

// Search Icon
const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8" />
    <path d="M21 21l-4.35-4.35" />
  </svg>
);

// Filter Icon
const FilterIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="4" y1="6" x2="20" y2="6" />
    <line x1="6" y1="12" x2="18" y2="12" />
    <line x1="8" y1="18" x2="16" y2="18" />
  </svg>
);

// Close Icon
const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

// Chevron Icon
const ChevronIcon = ({ open }: { open: boolean }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    style={{
      transform: open ? "rotate(180deg)" : "rotate(0deg)",
      transition: "transform 200ms ease",
    }}
  >
    <path d="M6 9l6 6 6-6" />
  </svg>
);

// Header Component
function BrowseHeader({ searchQuery, setSearchQuery, filterCount, onOpenFilters }: {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  filterCount: number;
  onOpenFilters: () => void;
}) {
  const [scrolled, setScrolled] = useState(false);
  const { user } = useAuth();
  const navLinks = getNavLinks(user).filter((l) => l.href !== "/browse");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: scrolled ? "rgba(255, 255, 255, 0.9)" : "white",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: "1px solid var(--color-border)",
        transition: "all 200ms ease",
      }}
    >
      <div style={{
        maxWidth: 1400,
        margin: "0 auto",
        padding: "14px 24px",
        display: "flex",
        alignItems: "center",
        gap: 24,
      }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}>
          <Logo size={32} />
          <span className="hide-mobile" style={{ fontFamily: "var(--font-dm-serif)", fontSize: 20, color: "var(--color-primary)" }}>
            Mail <em style={{ fontStyle: "italic", color: "var(--color-accent)" }}>Muse</em>
          </span>
        </Link>

        {/* Search */}
        <div style={{ flex: 1, maxWidth: 480 }}>
          <Input
            type="search"
            placeholder="Search emails..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<SearchIcon />}
            size="sm"
          />
        </div>

        {/* Nav Links */}
        <nav className="hide-mobile" style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{ fontSize: 14, fontWeight: 500, color: "var(--color-secondary)", textDecoration: "none" }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile Filter Button */}
        <button
          onClick={onOpenFilters}
          className="show-mobile"
          style={{
            display: "none",
            alignItems: "center",
            gap: 6,
            padding: "10px 14px",
            background: filterCount > 0 ? "var(--color-accent)" : "var(--color-surface)",
            color: filterCount > 0 ? "white" : "var(--color-secondary)",
            border: filterCount > 0 ? "none" : "1px solid var(--color-border)",
            borderRadius: 10,
            fontSize: 14,
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          <FilterIcon />
          {filterCount > 0 && filterCount}
        </button>
      </div>
    </header>
  );
}

// Filter Section Component
function FilterSection({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div style={{ borderBottom: "1px solid var(--color-border)", paddingBottom: 16, marginBottom: 16 }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "none",
          border: "none",
          padding: 0,
          marginBottom: open ? 12 : 0,
          cursor: "pointer",
          fontSize: 13,
          fontWeight: 600,
          color: "var(--color-primary)",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        }}
      >
        {title}
        <ChevronIcon open={open} />
      </button>
      {open && <div>{children}</div>}
    </div>
  );
}

// Checkbox Component
function Checkbox({
  checked,
  onChange,
  label,
  count,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
  count?: number;
}) {
  return (
    <label
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "8px 0",
        cursor: "pointer",
        fontSize: 14,
        color: checked ? "var(--color-primary)" : "var(--color-secondary)",
        transition: "color 150ms ease",
      }}
    >
      <div
        style={{
          width: 18,
          height: 18,
          borderRadius: 5,
          border: checked ? "none" : "2px solid var(--color-border)",
          background: checked ? "var(--color-accent)" : "transparent",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 150ms ease",
          flexShrink: 0,
        }}
      >
        {checked && (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        )}
      </div>
      <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {label}
      </span>
      {count !== undefined && (
        <span style={{ fontSize: 12, color: "var(--color-tertiary)" }}>{count}</span>
      )}
    </label>
  );
}

// Sidebar Filters
function Sidebar({
  open,
  onClose,
  industries,
  selectedIndustries,
  toggleIndustry,
  brands,
  selectedBrands,
  toggleBrand,
  brandSearch,
  setBrandSearch,
  selectedDate,
  setSelectedDate,
  clearAll,
  brandStats,
}: {
  open: boolean;
  onClose: () => void;
  industries: string[];
  selectedIndustries: string[];
  toggleIndustry: (i: string) => void;
  brands: string[];
  selectedBrands: string[];
  toggleBrand: (b: string) => void;
  brandSearch: string;
  setBrandSearch: (s: string) => void;
  selectedDate: string;
  setSelectedDate: (d: string) => void;
  clearAll: () => void;
  brandStats: BrandStats;
}) {
  const filteredBrands = brands.filter((b) =>
    b.toLowerCase().includes(brandSearch.toLowerCase())
  );

  const activeCount = selectedIndustries.length + selectedBrands.length + (selectedDate !== "all" ? 1 : 0);

  return (
    <>
      {/* Mobile Overlay */}
      {open && (
        <div
          onClick={onClose}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.3)",
            backdropFilter: "blur(4px)",
            zIndex: 200,
          }}
          className="show-mobile"
        />
      )}

      {/* Sidebar */}
      <aside
        style={{
          width: 280,
          flexShrink: 0,
          position: "sticky",
          top: 80,
          height: "fit-content",
          maxHeight: "calc(100vh - 100px)",
          overflowY: "auto",
          background: "white",
          borderRadius: 14,
          padding: 20,
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04), 0 4px 20px rgba(0, 0, 0, 0.04)",
        }}
        className="hide-mobile"
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: "var(--color-primary)", margin: 0 }}>
            Filters
          </h3>
          {activeCount > 0 && (
            <button
              onClick={clearAll}
              style={{
                background: "none",
                border: "none",
                fontSize: 13,
                color: "var(--color-accent)",
                cursor: "pointer",
                fontWeight: 500,
              }}
            >
              Clear all
            </button>
          )}
        </div>

        {/* Industry Filter */}
        <FilterSection title="Industry">
          <div style={{ maxHeight: 240, overflowY: "auto" }}>
            {industries.map((industry) => (
              <Checkbox
                key={industry}
                checked={selectedIndustries.includes(industry)}
                onChange={() => toggleIndustry(industry)}
                label={industry}
              />
            ))}
          </div>
        </FilterSection>

        {/* Brand Filter */}
        <FilterSection title="Brand">
          <Input
            type="search"
            placeholder="Search brands..."
            value={brandSearch}
            onChange={(e) => setBrandSearch(e.target.value)}
            size="sm"
            style={{ marginBottom: 12 }}
          />
          <div style={{ maxHeight: 200, overflowY: "auto" }}>
            {filteredBrands.slice(0, 30).map((brand) => (
              <Checkbox
                key={brand}
                checked={selectedBrands.includes(brand)}
                onChange={() => toggleBrand(brand)}
                label={brand}
                count={brandStats[brand]?.email_count}
              />
            ))}
            {filteredBrands.length > 30 && (
              <p style={{ fontSize: 12, color: "var(--color-tertiary)", margin: "8px 0 0" }}>
                +{filteredBrands.length - 30} more brands
              </p>
            )}
          </div>
        </FilterSection>

        {/* Date Filter */}
        <FilterSection title="Date" defaultOpen={false}>
          {DATE_FILTERS.map((filter) => (
            <Checkbox
              key={filter.value}
              checked={selectedDate === filter.value}
              onChange={() => setSelectedDate(filter.value)}
              label={filter.label}
            />
          ))}
        </FilterSection>
      </aside>

      {/* Mobile Sidebar */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          maxHeight: "80vh",
          background: "white",
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          padding: 24,
          zIndex: 201,
          overflowY: "auto",
          transform: open ? "translateY(0)" : "translateY(100%)",
          transition: "transform 300ms ease",
          boxShadow: "0 -4px 20px rgba(0, 0, 0, 0.1)",
        }}
        className="show-mobile"
      >
        {/* Mobile Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <h3 style={{ fontSize: 18, fontWeight: 600, color: "var(--color-primary)", margin: 0 }}>
            Filters
          </h3>
          <button
            onClick={onClose}
            style={{
              background: "var(--color-surface)",
              border: "none",
              borderRadius: 8,
              padding: 8,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CloseIcon />
          </button>
        </div>

        {/* Same filter sections */}
        <FilterSection title="Industry">
          <div style={{ maxHeight: 200, overflowY: "auto" }}>
            {industries.map((industry) => (
              <Checkbox
                key={industry}
                checked={selectedIndustries.includes(industry)}
                onChange={() => toggleIndustry(industry)}
                label={industry}
              />
            ))}
          </div>
        </FilterSection>

        <FilterSection title="Brand">
          <Input
            type="search"
            placeholder="Search brands..."
            value={brandSearch}
            onChange={(e) => setBrandSearch(e.target.value)}
            size="sm"
            style={{ marginBottom: 12 }}
          />
          <div style={{ maxHeight: 160, overflowY: "auto" }}>
            {filteredBrands.slice(0, 20).map((brand) => (
              <Checkbox
                key={brand}
                checked={selectedBrands.includes(brand)}
                onChange={() => toggleBrand(brand)}
                label={brand}
              />
            ))}
          </div>
        </FilterSection>

        <FilterSection title="Date" defaultOpen={false}>
          {DATE_FILTERS.map((filter) => (
            <Checkbox
              key={filter.value}
              checked={selectedDate === filter.value}
              onChange={() => setSelectedDate(filter.value)}
              label={filter.label}
            />
          ))}
        </FilterSection>

        {/* Apply Button */}
        <div style={{ marginTop: 24 }}>
          <Button fullWidth onClick={onClose}>
            Apply Filters {activeCount > 0 && `(${activeCount})`}
          </Button>
        </div>
      </div>
    </>
  );
}

// Loading State
function LoadingGrid() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
        gap: 20,
      }}
    >
      {Array.from({ length: 6 }).map((_, i) => (
        <EmailCardSkeleton key={i} />
      ))}
    </div>
  );
}

// Main Browse Content
function BrowseContent() {
  const searchParams = useSearchParams();
  const brandFromUrl = searchParams.get("brand");
  const industryFromUrl = searchParams.get("industry");
  const queryFromUrl = searchParams.get("q");

  const [emails, setEmails] = useState<Email[]>([]);
  const [allBrands, setAllBrands] = useState<string[]>([]);
  const [brandStats, setBrandStats] = useState<BrandStats>({});
  const [totalEmailCount, setTotalEmailCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState(queryFromUrl || "");
  const [debouncedQuery, setDebouncedQuery] = useState(queryFromUrl || "");
  const [brandSearch, setBrandSearch] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE);
  const isInitialLoad = useRef(true);

  const [selectedBrands, setSelectedBrands] = useState<string[]>(brandFromUrl ? [brandFromUrl] : []);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>(industryFromUrl ? [industryFromUrl] : []);
  const [selectedDate, setSelectedDate] = useState("all");

  // Debounce search query (400ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch emails
  const fetchEmails = useCallback(async () => {
    const base = API_BASE;

    try {
      const params = new URLSearchParams();
      params.set("limit", "500");
      if (selectedIndustries.length === 1) params.set("industry", selectedIndustries[0]);
      if (selectedBrands.length === 1) params.set("brand", selectedBrands[0]);
      if (debouncedQuery) params.set("q", debouncedQuery);

      const res = await fetch(`${base}/emails?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setEmails(data);
        setHasMore(data.length === 500);
      }
    } catch (error) {
      console.error("Failed to fetch emails:", error);
    }
  }, [selectedIndustries, selectedBrands, debouncedQuery]);

  // Fetch brands and total count
  const fetchBrands = useCallback(async () => {
    const base = API_BASE;

    try {
      const [brandsRes, statsRes, countRes] = await Promise.all([
        fetch(`${base}/brands`),
        fetch(`${base}/brands/stats`),
        fetch(`${base}/emails/count`),
      ]);

      if (brandsRes.ok) setAllBrands(await brandsRes.json());
      if (statsRes.ok) setBrandStats(await statsRes.json());
      if (countRes.ok) {
        const countData = await countRes.json();
        setTotalEmailCount(countData.total);
      }
    } catch (error) {
      console.error("Failed to fetch brands:", error);
    }
  }, []);

  // Initial load
  useEffect(() => {
    const load = async () => {
      if (isInitialLoad.current) {
        setLoading(true);
        await Promise.all([fetchEmails(), fetchBrands()]);
        setLoading(false);
        isInitialLoad.current = false;
      } else {
        setSearching(true);
        await fetchEmails();
        setSearching(false);
      }
      setDisplayCount(ITEMS_PER_PAGE);
    };
    load();
  }, [fetchEmails, fetchBrands]);

  // Filter emails client-side
  const filteredEmails = emails.filter((email) => {
    if (selectedBrands.length > 1 && !selectedBrands.includes(email.brand || "")) return false;
    if (selectedIndustries.length > 1 && !selectedIndustries.includes(email.industry || "")) return false;

    if (selectedDate !== "all") {
      const days = parseInt(selectedDate);
      const emailDate = new Date(email.received_at);
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - days);
      if (emailDate < cutoff) return false;
    }

    return true;
  });

  const displayedEmails = filteredEmails.slice(0, displayCount);

  const loadMore = () => {
    setLoadingMore(true);
    setTimeout(() => {
      setDisplayCount((prev) => prev + ITEMS_PER_PAGE);
      setLoadingMore(false);
    }, 300);
  };

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
    setDisplayCount(ITEMS_PER_PAGE);
  };

  const toggleIndustry = (industry: string) => {
    setSelectedIndustries((prev) =>
      prev.includes(industry) ? prev.filter((i) => i !== industry) : [...prev, industry]
    );
    setDisplayCount(ITEMS_PER_PAGE);
  };

  const clearAllFilters = () => {
    setSelectedBrands([]);
    setSelectedIndustries([]);
    setSelectedDate("all");
    setSearchQuery("");
    setDisplayCount(ITEMS_PER_PAGE);
  };

  const activeFilterCount = selectedBrands.length + selectedIndustries.length + (selectedDate !== "all" ? 1 : 0);

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-surface)" }}>
      <BrowseHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filterCount={activeFilterCount}
        onOpenFilters={() => setSidebarOpen(true)}
      />

      <div style={{ maxWidth: 1400, margin: "0 auto", padding: 24, display: "flex", gap: 24 }}>
        <Sidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          industries={INDUSTRIES}
          selectedIndustries={selectedIndustries}
          toggleIndustry={toggleIndustry}
          brands={allBrands}
          selectedBrands={selectedBrands}
          toggleBrand={toggleBrand}
          brandSearch={brandSearch}
          setBrandSearch={setBrandSearch}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          clearAll={clearAllFilters}
          brandStats={brandStats}
        />

        {/* Main Content */}
        <main style={{ flex: 1, minWidth: 0 }}>
          {/* Results Header */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 20,
            flexWrap: "wrap",
            gap: 12,
          }}>
            <p style={{ fontSize: 14, color: "var(--color-secondary)", margin: 0 }}>
              {loading ? "Loading..." : searching ? "Searching..." : (() => {
                const hasFilters = debouncedQuery || selectedBrands.length > 0 || selectedIndustries.length > 0 || selectedDate !== "all";
                const count = hasFilters ? filteredEmails.length.toLocaleString() : (totalEmailCount !== null ? totalEmailCount.toLocaleString() : filteredEmails.length.toLocaleString());
                return `${count} emails`;
              })()}
            </p>

            {/* Active Filters */}
            {activeFilterCount > 0 && (
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {selectedIndustries.map((i) => (
                  <Badge key={i} variant="accent">
                    {i}
                    <button
                      onClick={() => toggleIndustry(i)}
                      style={{
                        background: "none",
                        border: "none",
                        marginLeft: 6,
                        cursor: "pointer",
                        color: "inherit",
                        padding: 0,
                        lineHeight: 1,
                      }}
                    >
                      ×
                    </button>
                  </Badge>
                ))}
                {selectedBrands.map((b) => (
                  <Badge key={b} variant="accent">
                    {b}
                    <button
                      onClick={() => toggleBrand(b)}
                      style={{
                        background: "none",
                        border: "none",
                        marginLeft: 6,
                        cursor: "pointer",
                        color: "inherit",
                        padding: 0,
                        lineHeight: 1,
                      }}
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Email Grid */}
          {loading ? (
            <LoadingGrid />
          ) : displayedEmails.length === 0 ? (
            <div style={{
              textAlign: "center",
              padding: "80px 20px",
              background: "white",
              borderRadius: 14,
            }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: "var(--color-primary)", marginBottom: 8 }}>
                No emails found
              </h3>
              <p style={{ fontSize: 14, color: "var(--color-secondary)", marginBottom: 20 }}>
                Try adjusting your filters or search query
              </p>
              <Button variant="secondary" onClick={clearAllFilters}>
                Clear Filters
              </Button>
            </div>
          ) : (
            <>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                  gap: 20,
                }}
              >
                {displayedEmails.map((email, idx) => (
                  <div
                    key={email.id}
                    style={{
                      opacity: 0,
                      animation: `fadeInUp 0.4s ease ${Math.min(idx * 30, 300)}ms forwards`,
                    }}
                  >
                    <EmailCard
                      id={email.id}
                      subject={email.subject}
                      brand={email.brand}
                      preview={email.preview}
                      industry={email.industry}
                      received_at={email.received_at}
                      campaignType={email.type}
                      sendFrequency={email.brand ? brandStats[email.brand]?.send_frequency : undefined}
                    />
                  </div>
                ))}
              </div>

              {/* Load More */}
              {displayCount < filteredEmails.length && (
                <div style={{ textAlign: "center", marginTop: 40 }}>
                  <Button variant="secondary" onClick={loadMore} loading={loadingMore}>
                    Load More
                  </Button>
                  <p style={{ fontSize: 13, color: "var(--color-tertiary)", marginTop: 12 }}>
                    Showing {displayCount} of {filteredEmails.length}
                  </p>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

// Main Export with Suspense
export default function BrowsePage() {
  return (
    <Suspense
      fallback={
        <div style={{
          minHeight: "100vh",
          background: "var(--color-surface)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                width: 40,
                height: 40,
                border: "3px solid var(--color-border)",
                borderTopColor: "var(--color-accent)",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
                margin: "0 auto 16px",
              }}
            />
            <p style={{ color: "var(--color-secondary)", fontSize: 14 }}>Loading...</p>
          </div>
        </div>
      }
    >
      <BrowseContent />
    </Suspense>
  );
}
