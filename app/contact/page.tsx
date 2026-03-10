import Header from "../components/Header";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with the MailMuse team. We'd love to hear your questions, feedback, or partnership ideas.",
};

export default function ContactPage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--color-surface)" }}>
      <Header />

      <div
        style={{
          maxWidth: 600,
          margin: "0 auto",
          padding: "64px 24px",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontFamily: "var(--font-bricolage)",
            fontSize: 40,
            fontWeight: 400,
            color: "var(--color-primary)",
            marginBottom: 12,
          }}
        >
          Contact Us
        </h1>

        <p
          style={{
            fontSize: 18,
            color: "var(--color-secondary)",
            lineHeight: 1.7,
            marginBottom: 48,
          }}
        >
          We&apos;d love to hear from you — whether it&apos;s a question,
          feedback, partnership idea, or just to say hello.
        </p>

        <div
          style={{
            padding: "40px 32px",
            background: "white",
            borderRadius: 12,
            border: "1px solid var(--color-border)",
            marginBottom: 32,
          }}
        >
          <div style={{ marginBottom: 24 }}>
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "var(--color-secondary)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginBottom: 8,
              }}
            >
              Email
            </div>
            <a
              href="mailto:anubhavgpt08@gmail.com"
              style={{
                fontSize: 20,
                fontFamily: "var(--font-bricolage)",
                color: "var(--color-accent)",
                textDecoration: "none",
              }}
            >
              anubhavgpt08@gmail.com
            </a>
          </div>

          <div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "var(--color-secondary)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginBottom: 8,
              }}
            >
              Twitter / X
            </div>
            <a
              href="https://x.com/mailmuse_01"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: 20,
                fontFamily: "var(--font-bricolage)",
                color: "var(--color-accent)",
                textDecoration: "none",
              }}
            >
              @mailmuse_01
            </a>
          </div>
        </div>

        <p
          style={{
            fontSize: 14,
            color: "var(--color-secondary)",
            lineHeight: 1.6,
          }}
        >
          Want to explore the platform first?{" "}
          <Link
            href="/browse"
            style={{
              color: "var(--color-accent)",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Browse emails
          </Link>{" "}
          or check out our{" "}
          <Link
            href="/pricing"
            style={{
              color: "var(--color-accent)",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            pricing plans
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
