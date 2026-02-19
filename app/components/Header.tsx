"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Logo from "./Logo";
import { useAuth } from "../context/AuthContext";

const NAV_LINKS = [
  { label: "Browse", href: "/browse" },
  { label: "Brands", href: "/brands" },
  { label: "Swipe File", href: "/swipe-file" },
  { label: "Benchmarks", href: "/benchmarks" },
  { label: "Analytics", href: "/analytics" },
];

const AUTH_LINKS = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Saved", href: "/saved" },
];

export default function Header({ activeRoute }: { activeRoute?: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const allLinks = user ? [...NAV_LINKS, ...AUTH_LINKS] : NAV_LINKS;

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
        <div
          style={{
            maxWidth: 1400,
            margin: "0 auto",
            padding: "14px 24px",
            display: "flex",
            alignItems: "center",
            gap: 24,
          }}
        >
          {/* Logo */}
          <Link
            href="/"
            style={{
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: 8,
              flexShrink: 0,
            }}
          >
            <Logo size={32} />
            <span
              className="hide-mobile"
              style={{
                fontFamily: "var(--font-dm-serif)",
                fontSize: 20,
                color: "var(--color-primary)",
              }}
            >
              Mail{" "}
              <em style={{ fontStyle: "italic", color: "var(--color-accent)" }}>
                Muse
              </em>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav
            className="hide-mobile"
            style={{ display: "flex", alignItems: "center", gap: 4, flex: 1 }}
          >
            {allLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  color:
                    activeRoute === link.href
                      ? "var(--color-accent)"
                      : "var(--color-secondary)",
                  textDecoration: "none",
                  padding: "8px 14px",
                  borderRadius: 8,
                  background:
                    activeRoute === link.href
                      ? "var(--color-accent-light)"
                      : "transparent",
                  transition: "all 150ms ease",
                }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Auth Section */}
          <div
            className="hide-mobile"
            style={{ display: "flex", alignItems: "center", gap: 12 }}
          >
            {user ? (
              <>
                <span
                  style={{
                    fontSize: 13,
                    color: "var(--color-secondary)",
                    fontWeight: 500,
                  }}
                >
                  {user.name || user.email}
                </span>
                <button
                  onClick={logout}
                  style={{
                    fontSize: 13,
                    fontWeight: 500,
                    color: "var(--color-tertiary)",
                    background: "none",
                    border: "1px solid var(--color-border)",
                    padding: "6px 14px",
                    borderRadius: 8,
                    cursor: "pointer",
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
                    fontSize: 13,
                    fontWeight: 500,
                    color: "var(--color-secondary)",
                    textDecoration: "none",
                    padding: "8px 14px",
                  }}
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  style={{
                    fontSize: 13,
                    fontWeight: 500,
                    color: "white",
                    background: "var(--color-accent)",
                    textDecoration: "none",
                    padding: "8px 18px",
                    borderRadius: 8,
                  }}
                >
                  Sign up free
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            className="show-mobile"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: "none",
              background: "none",
              border: "none",
              padding: 8,
              cursor: "pointer",
              marginLeft: "auto",
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--color-primary)"
              strokeWidth="2"
            >
              {mobileMenuOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
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
            {allLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  fontSize: 16,
                  fontWeight: 500,
                  color:
                    activeRoute === link.href
                      ? "var(--color-accent)"
                      : "var(--color-primary)",
                  textDecoration: "none",
                  padding: "14px 16px",
                  borderRadius: 10,
                  background:
                    activeRoute === link.href
                      ? "var(--color-accent-light)"
                      : "transparent",
                }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div
            style={{
              marginTop: 24,
              paddingTop: 24,
              borderTop: "1px solid var(--color-border)",
            }}
          >
            {user ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span
                  style={{ fontSize: 14, color: "var(--color-secondary)" }}
                >
                  {user.name || user.email}
                </span>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  style={{
                    fontSize: 14,
                    fontWeight: 500,
                    color: "var(--color-accent)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Logout
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", gap: 12 }}>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    flex: 1,
                    textAlign: "center",
                    fontSize: 14,
                    fontWeight: 500,
                    color: "var(--color-primary)",
                    textDecoration: "none",
                    padding: "12px 18px",
                    borderRadius: 10,
                    border: "1px solid var(--color-border)",
                  }}
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    flex: 1,
                    textAlign: "center",
                    fontSize: 14,
                    fontWeight: 500,
                    color: "white",
                    background: "var(--color-accent)",
                    textDecoration: "none",
                    padding: "12px 18px",
                    borderRadius: 10,
                  }}
                >
                  Sign up free
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
