import Header from "../components/Header";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "MailMuse is an email marketing intelligence platform. Track 100,000+ real emails from 10,000+ brands across 17 industries.",
};

export default function AboutPage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--color-surface)" }}>
      <Header />

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "64px 24px" }}>
        <h1
          style={{
            fontFamily: "var(--font-bricolage)",
            fontSize: 40,
            fontWeight: 400,
            color: "var(--color-primary)",
            marginBottom: 16,
          }}
        >
          About{" "}
          <em style={{ fontStyle: "italic", color: "var(--color-accent)" }}>
            MailMuse
          </em>
        </h1>

        <p
          style={{
            fontSize: 18,
            color: "var(--color-secondary)",
            lineHeight: 1.7,
            marginBottom: 32,
          }}
        >
          MailMuse is an email marketing intelligence platform that helps
          marketers, founders, and agencies learn from the best by studying real
          email campaigns.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 24,
            marginBottom: 48,
          }}
        >
          {[
            { stat: "100,000+", label: "Emails tracked" },
            { stat: "10,000+", label: "Brands" },
            { stat: "17", label: "Industries" },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                textAlign: "center",
                padding: "24px 16px",
                background: "white",
                borderRadius: 12,
                border: "1px solid var(--color-border)",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-bricolage)",
                  fontSize: 28,
                  color: "var(--color-accent)",
                  marginBottom: 4,
                }}
              >
                {item.stat}
              </div>
              <div style={{ fontSize: 13, color: "var(--color-secondary)" }}>
                {item.label}
              </div>
            </div>
          ))}
        </div>

        <h2
          style={{
            fontFamily: "var(--font-bricolage)",
            fontSize: 24,
            fontWeight: 400,
            color: "var(--color-primary)",
            marginBottom: 12,
          }}
        >
          Our Mission
        </h2>
        <p
          style={{
            fontSize: 16,
            color: "var(--color-secondary)",
            lineHeight: 1.7,
            marginBottom: 24,
          }}
        >
          We believe the best way to improve your email marketing is to study
          what top brands actually send. MailMuse archives real emails from
          thousands of brands — every subject line, every design, every strategy
          — so you can see what works, get inspired, and build better campaigns.
        </p>
        <p
          style={{
            fontSize: 16,
            color: "var(--color-secondary)",
            lineHeight: 1.7,
            marginBottom: 48,
          }}
        >
          Whether you&apos;re a D2C founder crafting your first welcome
          sequence, an agency managing multiple brands, or a marketer looking for
          competitive intelligence — MailMuse gives you the data and inspiration
          you need.
        </p>

        <div
          style={{
            padding: "32px",
            background: "white",
            borderRadius: 12,
            border: "1px solid var(--color-border)",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontSize: 16,
              color: "var(--color-secondary)",
              marginBottom: 16,
              marginTop: 0,
            }}
          >
            Have questions or feedback? We&apos;d love to hear from you.
          </p>
          <Link
            href="/contact"
            style={{
              display: "inline-block",
              fontSize: 14,
              fontWeight: 600,
              color: "white",
              background: "var(--color-accent)",
              textDecoration: "none",
              padding: "10px 24px",
              borderRadius: 8,
            }}
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
