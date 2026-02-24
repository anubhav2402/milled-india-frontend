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

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-surface)" }}>
      <JsonLd data={breadcrumbLd} />
      <Header />

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "32px 24px" }}>
        <Breadcrumb
          items={[{ label: "Home", href: "/" }, { label: "Blog" }]}
        />

        <h1
          style={{
            fontFamily: "var(--font-dm-serif)",
            fontSize: 28,
            color: "var(--color-primary)",
            margin: "0 0 8px",
          }}
        >
          MailMuse Blog
        </h1>
        <p
          style={{
            fontSize: 16,
            color: "var(--color-secondary)",
            margin: "0 0 32px",
          }}
        >
          Data-driven insights on email marketing.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {posts
            .sort(
              (a, b) =>
                new Date(b.date).getTime() - new Date(a.date).getTime()
            )
            .map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                style={{
                  display: "block",
                  padding: "24px 28px",
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
                    fontSize: 18,
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
                    fontSize: 14,
                    color: "var(--color-secondary)",
                    margin: "0 0 12px",
                    lineHeight: 1.5,
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
    </div>
  );
}
