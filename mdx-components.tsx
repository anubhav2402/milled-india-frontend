import type { MDXComponents } from "mdx/types";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => (
      <h1
        style={{
          fontFamily: "var(--font-dm-serif)",
          fontSize: 32,
          color: "var(--color-primary)",
          margin: "0 0 16px",
          lineHeight: 1.3,
        }}
      >
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2
        style={{
          fontSize: 22,
          fontWeight: 700,
          color: "var(--color-primary)",
          margin: "32px 0 12px",
          lineHeight: 1.4,
        }}
      >
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3
        style={{
          fontSize: 18,
          fontWeight: 600,
          color: "var(--color-primary)",
          margin: "24px 0 8px",
        }}
      >
        {children}
      </h3>
    ),
    p: ({ children }) => (
      <p
        style={{
          fontSize: 16,
          lineHeight: 1.8,
          color: "var(--color-secondary)",
          margin: "0 0 16px",
        }}
      >
        {children}
      </p>
    ),
    a: ({ href, children }) => (
      <a
        href={href}
        style={{
          color: "var(--color-accent)",
          textDecoration: "underline",
          textUnderlineOffset: 2,
        }}
      >
        {children}
      </a>
    ),
    ul: ({ children }) => (
      <ul
        style={{
          fontSize: 16,
          lineHeight: 1.8,
          color: "var(--color-secondary)",
          margin: "0 0 16px",
          paddingLeft: 24,
        }}
      >
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol
        style={{
          fontSize: 16,
          lineHeight: 1.8,
          color: "var(--color-secondary)",
          margin: "0 0 16px",
          paddingLeft: 24,
        }}
      >
        {children}
      </ol>
    ),
    blockquote: ({ children }) => (
      <blockquote
        style={{
          borderLeft: "3px solid var(--color-accent)",
          margin: "16px 0",
          padding: "8px 20px",
          color: "var(--color-secondary)",
          fontStyle: "italic",
        }}
      >
        {children}
      </blockquote>
    ),
    strong: ({ children }) => (
      <strong style={{ color: "var(--color-primary)", fontWeight: 600 }}>
        {children}
      </strong>
    ),
    ...components,
  };
}
