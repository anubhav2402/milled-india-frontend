"use client";

import Link from "next/link";
import Logo from "./Logo";

const exploreLinks = [
  { label: "Browse Emails", href: "/browse" },
  { label: "Brands", href: "/brands" },
  { label: "Industries", href: "/industry" },
  { label: "Email Types", href: "/types" },
  { label: "Campaigns", href: "/campaigns" },
];

const companyLinks = [
  { label: "About", href: "/about" },
  { label: "Contact Us", href: "/contact" },
  { label: "Pricing", href: "/pricing" },
  { label: "Blog", href: "/blog" },
];

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
];

export default function Footer() {
  return (
    <footer
      style={{
        background: "#0f172a",
        color: "white",
        padding: "64px 24px 0",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "2fr 1fr 1fr 1fr",
          gap: 48,
        }}
        className="footer-grid"
      >
        {/* Brand Column */}
        <div>
          <Link
            href="/"
            style={{
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 16,
            }}
          >
            <Logo size={28} />
            <span
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: 20,
                color: "white",
              }}
            >
              Mail{" "}
              <em style={{ fontStyle: "italic", color: "#E8A882" }}>Muse</em>
            </span>
          </Link>
          <p
            style={{
              fontSize: 14,
              color: "rgba(255, 255, 255, 0.5)",
              lineHeight: 1.6,
              maxWidth: 280,
              margin: 0,
            }}
          >
            Email marketing intelligence for brands. Track what top brands send,
            when they send it, and what works.
          </p>
        </div>

        {/* Explore Column */}
        <div>
          <h4
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: 15,
              fontWeight: 400,
              color: "white",
              marginTop: 0,
              marginBottom: 16,
            }}
          >
            Explore
          </h4>
          <nav style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {exploreLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  fontSize: 13,
                  color: "rgba(255, 255, 255, 0.5)",
                  textDecoration: "none",
                  transition: "color 150ms ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "white";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "rgba(255, 255, 255, 0.5)";
                }}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Company Column */}
        <div>
          <h4
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: 15,
              fontWeight: 400,
              color: "white",
              marginTop: 0,
              marginBottom: 16,
            }}
          >
            Company
          </h4>
          <nav style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {companyLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  fontSize: 13,
                  color: "rgba(255, 255, 255, 0.5)",
                  textDecoration: "none",
                  transition: "color 150ms ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "white";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "rgba(255, 255, 255, 0.5)";
                }}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Legal Column */}
        <div>
          <h4
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: 15,
              fontWeight: 400,
              color: "white",
              marginTop: 0,
              marginBottom: 16,
            }}
          >
            Legal
          </h4>
          <nav style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {legalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  fontSize: 13,
                  color: "rgba(255, 255, 255, 0.5)",
                  textDecoration: "none",
                  transition: "color 150ms ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "white";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "rgba(255, 255, 255, 0.5)";
                }}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Bottom Bar */}
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          marginTop: 48,
          padding: "24px 0",
          borderTop: "1px solid rgba(255, 255, 255, 0.1)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <p
          style={{
            fontSize: 13,
            color: "rgba(255, 255, 255, 0.35)",
            margin: 0,
          }}
        >
          &copy; 2026 MailMuse. All rights reserved.
        </p>
        <a
          href="https://x.com/mailmuse_01"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: "rgba(255, 255, 255, 0.4)",
            transition: "color 150ms ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "white";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "rgba(255, 255, 255, 0.4)";
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </a>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 32px !important;
          }
        }
        @media (max-width: 480px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
        }
      `}</style>
    </footer>
  );
}
