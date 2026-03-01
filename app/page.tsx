import type { Metadata } from "next";
import Link from "next/link";
import { HomeClient } from "./HomeClient";
import { posts } from "./blog/posts";

export const metadata: Metadata = {
  title: "MailMuse — Email Marketing Intelligence for Brands",
  description:
    "Browse 7,000+ real emails from 150+ brands across 13 industries. Analyze competitor email strategies, subject lines, send timing, and campaign types. Use any email as a reusable template.",
  openGraph: {
    title: "MailMuse — Email Marketing Intelligence for Brands",
    description:
      "Browse 7,000+ real emails from 150+ brands across 13 industries. Analyze competitor email strategies, subject lines, send timing, and campaign types. Use any email as a reusable template.",
    url: "https://www.mailmuse.in",
    siteName: "MailMuse",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MailMuse — Email Marketing Intelligence for Brands",
    description:
      "Browse 7,000+ real emails from 150+ brands across 13 industries. Analyze competitor email strategies, subject lines, send timing, and campaign types. Use any email as a reusable template.",
  },
  alternates: {
    canonical: "https://www.mailmuse.in",
  },
};

const recentPosts = posts.slice(0, 6);

export default function HomePage() {
  return (
    <>
      <HomeClient />

      {/* Server-rendered SEO content section */}
      <section
        style={{
          padding: "80px 24px",
          background: "white",
        }}
      >
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <h2
            style={{
              fontFamily: "var(--font-dm-serif)",
              fontSize: "clamp(28px, 4vw, 36px)",
              fontWeight: 400,
              color: "var(--color-primary)",
              letterSpacing: "-0.02em",
              marginBottom: 24,
              textAlign: "center",
            }}
          >
            What is MailMuse?
          </h2>
          <p
            style={{
              fontSize: 17,
              color: "var(--color-secondary)",
              lineHeight: 1.8,
              textAlign: "center",
              maxWidth: 720,
              margin: "0 auto",
            }}
          >
            MailMuse is an email marketing intelligence platform that tracks and
            analyzes email campaigns from over 150 brands across 13 industries.
            Our database contains more than 7,000 real marketing emails —
            including sale campaigns, welcome sequences, cart abandonment flows,
            festive promotions, and newsletters. Marketers use MailMuse to study
            competitor email strategies, benchmark their own performance, and
            create new campaigns using our drag-and-drop template editor. Whether
            you&apos;re planning a Diwali sale sequence or optimizing your
            welcome flow, MailMuse gives you the competitive intelligence to make
            data-driven decisions.
          </p>
        </div>
      </section>

      {/* Server-rendered blog section for SEO */}
      <section
        style={{
          padding: "80px 24px",
          background: "var(--color-surface)",
        }}
      >
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2
              style={{
                fontFamily: "var(--font-dm-serif)",
                fontSize: "clamp(28px, 4vw, 36px)",
                fontWeight: 400,
                color: "var(--color-primary)",
                letterSpacing: "-0.02em",
                marginBottom: 12,
              }}
            >
              Latest from the MailMuse Blog
            </h2>
            <p
              style={{
                fontSize: 17,
                color: "var(--color-secondary)",
                maxWidth: 540,
                margin: "0 auto",
              }}
            >
              Data-driven insights from 7,000+ emails across 150+ brands
            </p>
          </div>

          <div
            className="blog-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 24,
            }}
          >
            {recentPosts.map((post) => (
              <article
                key={post.slug}
                style={{
                  background: "white",
                  borderRadius: 14,
                  padding: 28,
                  border: "1px solid var(--color-border)",
                  display: "flex",
                  flexDirection: "column",
                  transition: "box-shadow 200ms ease, transform 200ms ease",
                }}
              >
                <time
                  dateTime={post.date}
                  style={{
                    fontSize: 12,
                    fontWeight: 500,
                    color: "var(--color-tertiary)",
                    marginBottom: 10,
                  }}
                >
                  {new Date(post.date).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
                <h3
                  style={{
                    fontSize: 17,
                    fontWeight: 600,
                    color: "var(--color-primary)",
                    lineHeight: 1.4,
                    marginBottom: 10,
                  }}
                >
                  <Link
                    href={`/blog/${post.slug}`}
                    style={{
                      color: "inherit",
                      textDecoration: "none",
                    }}
                  >
                    {post.title}
                  </Link>
                </h3>
                <p
                  style={{
                    fontSize: 14,
                    color: "var(--color-secondary)",
                    lineHeight: 1.6,
                    margin: "0 0 16px",
                    flex: 1,
                  }}
                >
                  {post.description}
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        fontSize: 11,
                        fontWeight: 500,
                        padding: "2px 10px",
                        borderRadius: 20,
                        background: "var(--color-surface)",
                        color: "var(--color-tertiary)",
                        border: "1px solid var(--color-border)",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: 40 }}>
            <Link
              href="/blog"
              style={{
                fontSize: 15,
                fontWeight: 600,
                color: "var(--color-accent)",
                textDecoration: "none",
              }}
            >
              View all posts &rarr;
            </Link>
          </div>
        </div>

        <style>{`
          .blog-grid article:hover {
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
            transform: translateY(-2px);
          }
          @media (max-width: 768px) {
            .blog-grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
      </section>
    </>
  );
}
