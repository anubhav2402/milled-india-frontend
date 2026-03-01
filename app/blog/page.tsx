import Link from "next/link";
import Header from "../components/Header";
import JsonLd from "../components/JsonLd";
import Breadcrumb from "../components/Breadcrumb";
import { posts } from "./posts";

export default function BlogIndex() {
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.mailmuse.in",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: "https://www.mailmuse.in/blog",
      },
    ],
  };

  const sorted = [...posts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const featured = sorted[0];
  const rest = sorted.slice(1);

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-surface)" }}>
      <JsonLd data={breadcrumbLd} />
      <Header />

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px" }}>
        <Breadcrumb
          items={[{ label: "Home", href: "/" }, { label: "Blog" }]}
        />

        <h1
          style={{
            fontFamily: "var(--font-dm-serif)",
            fontSize: 32,
            color: "var(--color-primary)",
            margin: "0 0 6px",
          }}
        >
          MailMuse Blog
        </h1>
        <p
          style={{
            fontSize: 16,
            color: "var(--color-secondary)",
            margin: "0 0 36px",
          }}
        >
          Data-driven insights on email marketing.
        </p>

        {/* Featured Post */}
        {featured && (
          <Link
            href={`/blog/${featured.slug}`}
            className="blog-featured"
            style={{
              display: "block",
              padding: "32px 36px",
              background: "linear-gradient(135deg, #fff 60%, var(--color-accent-light) 100%)",
              borderRadius: 16,
              border: "1px solid var(--color-border)",
              textDecoration: "none",
              color: "inherit",
              transition: "all 200ms ease",
              marginBottom: 32,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  color: "white",
                  background: "var(--color-accent)",
                  padding: "3px 10px",
                  borderRadius: 4,
                }}
              >
                Latest
              </span>
              <span style={{ fontSize: 13, color: "var(--color-tertiary)" }}>
                {new Date(featured.date).toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            <h2
              style={{
                fontSize: 24,
                fontWeight: 700,
                color: "var(--color-primary)",
                margin: "0 0 10px",
                lineHeight: 1.35,
              }}
            >
              {featured.title}
            </h2>
            <p
              style={{
                fontSize: 15,
                color: "var(--color-secondary)",
                margin: "0 0 16px",
                lineHeight: 1.6,
                maxWidth: 700,
              }}
            >
              {featured.description}
            </p>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {featured.tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    fontSize: 11,
                    padding: "3px 10px",
                    borderRadius: 100,
                    background: "var(--color-accent-light)",
                    color: "var(--color-accent)",
                    fontWeight: 500,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </Link>
        )}

        {/* Post Grid */}
        <div
          className="blog-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 20,
          }}
        >
          {rest.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="blog-card"
              style={{
                display: "flex",
                flexDirection: "column",
                padding: "22px 24px",
                background: "white",
                borderRadius: 14,
                border: "1px solid var(--color-border)",
                textDecoration: "none",
                color: "inherit",
                transition: "all 150ms ease",
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  color: "var(--color-tertiary)",
                  marginBottom: 8,
                }}
              >
                {new Date(post.date).toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              <h2
                style={{
                  fontSize: 17,
                  fontWeight: 700,
                  color: "var(--color-primary)",
                  margin: "0 0 8px",
                  lineHeight: 1.4,
                }}
              >
                {post.title}
              </h2>
              <p
                style={{
                  fontSize: 13,
                  color: "var(--color-secondary)",
                  margin: "0 0 14px",
                  lineHeight: 1.5,
                  flex: 1,
                }}
              >
                {post.description}
              </p>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontSize: 11,
                      padding: "3px 10px",
                      borderRadius: 100,
                      background: "var(--color-accent-light)",
                      color: "var(--color-accent)",
                      fontWeight: 500,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </div>

      <style>{`
        .blog-featured:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(0,0,0,0.06);
        }
        .blog-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 20px rgba(0,0,0,0.06);
        }
        @media (max-width: 700px) {
          .blog-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
