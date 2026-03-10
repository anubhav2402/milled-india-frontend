"use client";

import { useState, useEffect, useCallback, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Logo from "../components/Logo";
import EmailCard, { EmailCardSkeleton } from "../components/EmailCard";
import Button from "../components/Button";
import Badge from "../components/Badge";
import Input from "../components/Input";
import { API_BASE, SUBCATEGORIES } from "../lib/constants";
import { useAuth } from "../context/AuthContext";
import { getNavLinks } from "../lib/nav";

type Email = {
  id: number;
  subject: string;
  brand?: string;
  preview?: string;
  type?: string;
  industry?: string;
  category?: string;
  received_at: string;
};

type BrandStats = {
  [brand: string]: {
    email_count: number;
    send_frequency: string;
    logo_url?: string | null;
  };
};

const DATE_FILTERS = [
  { label: "All Time", value: "all" },
  { label: "Last 7 Days", value: "7" },
  { label: "Last 30 Days", value: "30" },
  { label: "Last 90 Days", value: "90" },
];

const EMAIL_TYPES = [
  "Sale",
  "Welcome",
  "Newsletter",
  "New Arrival",
  "Abandoned Cart",
  "Re-engagement",
  "Festive",
  "Loyalty",
  "Promotional",
  "Product Showcase",
  "Back in Stock",
  "Educational",
  "Order Update",
  "Feedback",
  "Confirmation",
];

const ITEMS_PER_PAGE = 40;
const FREE_LIST_LIMIT = 25;

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
function BrowseHeader({ searchQuery, setSearchQuery }: {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navLinks = getNavLinks(user).filter((l) => l.href !== "/browse");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
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
          gap: 16,
        }}>
          {/* Logo */}
          <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            <Logo size={32} />
            <span className="hide-mobile" style={{ fontFamily: "var(--font-bricolage)", fontSize: 20, color: "var(--color-primary)" }}>
              Mail <em style={{ fontStyle: "italic", color: "var(--color-accent)" }}>Muse</em>
            </span>
          </Link>

          {/* Search */}
          <div style={{ flex: 1, maxWidth: 480, minWidth: 0 }}>
            <Input
              type="search"
              placeholder="Search emails..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<SearchIcon />}
              size="sm"
            />
          </div>

          {/* Desktop Nav Links */}
          <nav className="hide-mobile" style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{ fontSize: 14, fontWeight: 500, color: "var(--color-secondary)", textDecoration: "none", padding: "8px 14px", borderRadius: 8 }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Auth */}
          <div className="hide-mobile" style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
            {user ? (
              <Link href="/account" style={{ fontSize: 13, fontWeight: 500, color: "var(--color-secondary)", textDecoration: "none", padding: "6px 14px", borderRadius: 8, border: "1px solid var(--color-border)" }}>
                {user.name || user.email}
              </Link>
            ) : (
              <>
                <Link href="/login" style={{ fontSize: 13, fontWeight: 500, color: "var(--color-secondary)", textDecoration: "none", padding: "8px 14px" }}>Log in</Link>
                <Link href="/signup" style={{ fontSize: 13, fontWeight: 500, color: "white", background: "var(--color-accent)", textDecoration: "none", padding: "8px 18px", borderRadius: 8 }}>Sign up free</Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            className="show-mobile"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ display: "none", background: "none", border: "none", padding: 8, cursor: "pointer", marginLeft: "auto", flexShrink: 0 }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2">
              {menuOpen ? (
                <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>
              ) : (
                <><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></>
              )}
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      {menuOpen && (
        <div
          className="show-mobile"
          style={{
            display: "none",
            position: "fixed",
            top: 65,
            left: 0,
            right: 0,
            bottom: 0,
            background: "white",
            zIndex: 99,
            padding: 24,
            overflowY: "auto",
          }}
        >
          <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                style={{
                  fontSize: 16, fontWeight: 500, color: "var(--color-primary)",
                  textDecoration: "none", padding: "14px 16px", borderRadius: 10,
                }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div style={{ marginTop: 24, paddingTop: 24, borderTop: "1px solid var(--color-border)" }}>
            {user ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <span style={{ fontSize: 14, color: "var(--color-secondary)" }}>{user.name || user.email}</span>
                <div style={{ display: "flex", gap: 12 }}>
                  <Link href="/account" onClick={() => setMenuOpen(false)} style={{
                    flex: 1, textAlign: "center", fontSize: 14, fontWeight: 500, color: "var(--color-primary)",
                    textDecoration: "none", padding: "12px 18px", borderRadius: 10, border: "1px solid var(--color-border)",
                  }}>Account</Link>
                  {user.effective_plan === "free" && (
                    <Link href="/pricing" onClick={() => setMenuOpen(false)} style={{
                      flex: 1, textAlign: "center", fontSize: 14, fontWeight: 500, color: "white",
                      background: "var(--color-accent)", textDecoration: "none", padding: "12px 18px", borderRadius: 10,
                    }}>Upgrade</Link>
                  )}
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", gap: 12 }}>
                <Link href="/login" onClick={() => setMenuOpen(false)} style={{
                  flex: 1, textAlign: "center", fontSize: 14, fontWeight: 500, color: "var(--color-primary)",
                  textDecoration: "none", padding: "12px 18px", borderRadius: 10, border: "1px solid var(--color-border)",
                }}>Log in</Link>
                <Link href="/signup" onClick={() => setMenuOpen(false)} style={{
                  flex: 1, textAlign: "center", fontSize: 14, fontWeight: 500, color: "white",
                  background: "var(--color-accent)", textDecoration: "none", padding: "12px 18px", borderRadius: 10,
                }}>Sign up free</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </>
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
    <div
      onClick={onChange}
      role="checkbox"
      aria-checked={checked}
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
    </div>
  );
}

// All unique subcategories across all industries (excluding "Others" duplicates)
const ALL_SUBCATEGORIES = Array.from(
  new Set(Object.values(SUBCATEGORIES).flat())
).filter((s) => s !== "Others").sort();

// Sidebar Filters
function Sidebar({
  open,
  onClose,
  selectedCategories,
  toggleCategory,
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
  selectedCategories: string[];
  toggleCategory: (c: string) => void;
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
  const [categorySearch, setCategorySearch] = useState("");
  const filteredCategories = ALL_SUBCATEGORIES.filter((c) =>
    c.toLowerCase().includes(categorySearch.toLowerCase())
  );

  const activeCount = selectedCategories.length + selectedBrands.length + (selectedDate !== "all" ? 1 : 0);

  const filterContent = (
    <>
      {/* Subcategory Filter */}
      <FilterSection title="Subcategory">
        <div style={{ marginBottom: 12 }}>
          <Input
            type="search"
            placeholder="Search subcategories..."
            value={categorySearch}
            onChange={(e) => setCategorySearch(e.target.value)}
            size="sm"
            style={{ padding: "10px 14px", fontSize: 13 }}
          />
        </div>
        <div style={{ maxHeight: 240, overflowY: "auto" }}>
          {filteredCategories.map((cat) => (
            <Checkbox
              key={cat}
              checked={selectedCategories.includes(cat)}
              onChange={() => toggleCategory(cat)}
              label={cat}
            />
          ))}
        </div>
      </FilterSection>

      {/* Brand Filter */}
      <FilterSection title="Brand">
        <div style={{ marginBottom: 12 }}>
          <Input
            type="search"
            placeholder="Search brands..."
            value={brandSearch}
            onChange={(e) => setBrandSearch(e.target.value)}
            size="sm"
            style={{ padding: "10px 14px", fontSize: 13 }}
          />
        </div>
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
    </>
  );

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

      {/* Desktop Sidebar */}
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

        {filterContent}
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

        {filterContent}

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
      className="browse-grid"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
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
  const { user, token } = useAuth();
  const brandFromUrl = searchParams.get("brand");
  const categoryFromUrl = searchParams.get("category");
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
  const [selectedCategories, setSelectedCategories] = useState<string[]>(categoryFromUrl ? [categoryFromUrl] : []);
  const [selectedDate, setSelectedDate] = useState("all");
  const [selectedType, setSelectedType] = useState<string | null>(null);

  // Debounce search query (400ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch emails — send all active filters to the API
  const fetchEmails = useCallback(async () => {
    const base = API_BASE;

    try {
      const params = new URLSearchParams();
      params.set("limit", "500");

      // Send filters to the API for server-side filtering
      if (selectedBrands.length === 1) params.set("brand", selectedBrands[0]);
      if (selectedCategories.length === 1) params.set("category", selectedCategories[0]);
      if (selectedType) params.set("type", selectedType);
      if (debouncedQuery) params.set("q", debouncedQuery);

      const headers: Record<string, string> = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch(`${base}/emails?${params.toString()}`, { headers });
      if (res.ok) {
        const data = await res.json();
        setEmails(data);
        setHasMore(data.length === 500);
      }
    } catch (error) {
      console.error("Failed to fetch emails:", error);
    }
  }, [selectedBrands, selectedCategories, selectedType, selectedDate, debouncedQuery, token]);

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

  // Filter emails client-side (for multi-select and type/date filters)
  const filteredEmails = emails.filter((email) => {
    if (selectedBrands.length > 1 && !selectedBrands.includes(email.brand || "")) return false;
    if (selectedCategories.length > 1 && !selectedCategories.includes(email.category || "")) return false;
    if (selectedType && email.type !== selectedType) return false;

    if (selectedDate !== "all") {
      const days = parseInt(selectedDate);
      const emailDate = new Date(email.received_at);
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - days);
      if (emailDate < cutoff) return false;
    }

    return true;
  });

  const isFreeUser = !user || user.effective_plan === "free";
  const maxDisplay = isFreeUser ? Math.min(displayCount, FREE_LIST_LIMIT) : displayCount;
  const displayedEmails = filteredEmails.slice(0, maxDisplay);
  const hitFreeLimit = isFreeUser && filteredEmails.length > FREE_LIST_LIMIT;

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

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
    setDisplayCount(ITEMS_PER_PAGE);
  };

  const clearAllFilters = () => {
    setSelectedBrands([]);
    setSelectedCategories([]);
    setSelectedDate("all");
    setSelectedType(null);
    setSearchQuery("");
    setDisplayCount(ITEMS_PER_PAGE);
  };

  const activeFilterCount = selectedBrands.length + selectedCategories.length + (selectedDate !== "all" ? 1 : 0) + (selectedType ? 1 : 0);

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-surface)" }}>
      <BrowseHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <div className="browse-layout" style={{ maxWidth: 1400, margin: "0 auto", padding: 24, display: "flex", gap: 24 }}>
        <Sidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          selectedCategories={selectedCategories}
          toggleCategory={toggleCategory}
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
          {/* Email Type Quick Filters */}
          <div style={{
            display: "flex",
            gap: 8,
            marginBottom: 16,
            overflowX: "auto",
            paddingBottom: 4,
            scrollbarWidth: "none",
          }}>
            <button
              onClick={() => { setSelectedType(null); setDisplayCount(ITEMS_PER_PAGE); }}
              style={{
                padding: "6px 14px",
                fontSize: 13,
                fontWeight: 500,
                borderRadius: 20,
                border: `1px solid ${!selectedType ? "var(--color-accent)" : "var(--color-border)"}`,
                background: !selectedType ? "var(--color-accent)" : "white",
                color: !selectedType ? "white" : "var(--color-secondary)",
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "all 150ms ease",
                flexShrink: 0,
              }}
            >
              All Types
            </button>
            {EMAIL_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => { setSelectedType(selectedType === type ? null : type); setDisplayCount(ITEMS_PER_PAGE); }}
                style={{
                  padding: "6px 14px",
                  fontSize: 13,
                  fontWeight: 500,
                  borderRadius: 20,
                  border: `1px solid ${selectedType === type ? "var(--color-accent)" : "var(--color-border)"}`,
                  background: selectedType === type ? "var(--color-accent)" : "white",
                  color: selectedType === type ? "white" : "var(--color-secondary)",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "all 150ms ease",
                  flexShrink: 0,
                }}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Results Header */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 20,
            flexWrap: "wrap",
            gap: 12,
          }}>
            {(loading || searching) && (
              <p style={{ fontSize: 14, color: "var(--color-secondary)", margin: 0 }}>
                {loading ? "Loading..." : "Searching..."}
              </p>
            )}

            {/* Active Filters */}
            {activeFilterCount > 0 && (
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {selectedCategories.map((c) => (
                  <Badge key={c} variant="accent">
                    {c}
                    <button
                      onClick={() => toggleCategory(c)}
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

          {/* Archive limit banner for non-pro users */}
          {user && user.effective_plan !== "pro" && user.effective_plan !== "agency" && (
            <div style={{
              background: "linear-gradient(135deg, #fff7f5, #fef3ee)",
              border: "1px solid #f5d0c5",
              borderRadius: 12,
              padding: "14px 20px",
              marginBottom: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 12,
            }}>
              <span style={{ fontSize: 13, color: "var(--color-secondary)" }}>
                {user.effective_plan === "free"
                  ? "Showing emails from last 30 days. Upgrade to Starter for 6 months, or Pro for full archive."
                  : "Showing emails from last 6 months. Upgrade to Pro for full archive access."}
                {" "}
                <Link href="/pricing" style={{ color: "var(--color-accent)", fontWeight: 600, textDecoration: "none" }}>
                  View Plans
                </Link>
              </span>
            </div>
          )}

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
                className="browse-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
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
                      logoUrl={email.brand ? brandStats[email.brand]?.logo_url : undefined}
                    />
                  </div>
                ))}
              </div>

              {/* Free user limit CTA */}
              {hitFreeLimit && (
                <div style={{
                  textAlign: "center",
                  marginTop: 40,
                  padding: "40px 24px",
                  background: "linear-gradient(to bottom, rgba(250,249,247,0.3), rgba(250,249,247,0.95))",
                  borderRadius: 16,
                  border: "1px solid var(--color-border)",
                }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: 12,
                    background: "var(--color-accent-light)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    margin: "0 auto 16px",
                  }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0110 0v4" />
                    </svg>
                  </div>
                  <h3 style={{ fontSize: 18, fontWeight: 600, color: "var(--color-primary)", margin: "0 0 8px" }}>
                    {!user ? "Sign up to see more emails" : "Upgrade to browse more"}
                  </h3>
                  <p style={{ fontSize: 14, color: "var(--color-secondary)", margin: "0 0 20px", lineHeight: 1.5 }}>
                    {!user
                      ? "Create a free account to browse beyond 25 emails and unlock filters, bookmarks, and more."
                      : "Upgrade your plan to access the full email archive with unlimited browsing."}
                  </p>
                  <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
                    {!user ? (
                      <>
                        <Link href="/signup" style={{
                          fontSize: 14, fontWeight: 500, color: "white",
                          background: "var(--color-accent)", textDecoration: "none",
                          padding: "10px 24px", borderRadius: 10,
                        }}>
                          Sign up free
                        </Link>
                        <Link href="/login" style={{
                          fontSize: 14, fontWeight: 500, color: "var(--color-secondary)",
                          textDecoration: "none", padding: "10px 24px", borderRadius: 10,
                          border: "1px solid var(--color-border)",
                        }}>
                          Log in
                        </Link>
                      </>
                    ) : (
                      <Link href="/pricing" style={{
                        fontSize: 14, fontWeight: 500, color: "white",
                        background: "var(--color-accent)", textDecoration: "none",
                        padding: "10px 24px", borderRadius: 10,
                      }}>
                        View Plans
                      </Link>
                    )}
                  </div>
                </div>
              )}

              {/* Load More — only for logged-in non-free users */}
              {!hitFreeLimit && displayCount < filteredEmails.length && (
                <div style={{ textAlign: "center", marginTop: 40 }}>
                  <Button variant="secondary" onClick={loadMore} loading={loadingMore}>
                    Load More
                  </Button>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Floating mobile filter button — fixed at bottom */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="show-mobile"
        style={{
          display: "none",
          position: "fixed",
          bottom: 20,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 90,
          alignItems: "center",
          gap: 8,
          padding: "12px 24px",
          background: activeFilterCount > 0 ? "var(--color-accent)" : "#1C1917",
          color: "white",
          border: "none",
          borderRadius: 50,
          fontSize: 14,
          fontWeight: 600,
          cursor: "pointer",
          boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
        }}
      >
        <FilterIcon />
        Filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
      </button>
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
