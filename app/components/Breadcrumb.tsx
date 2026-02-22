import Link from "next/link";

type BreadcrumbItem = { label: string; href?: string };

export default function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav
      aria-label="Breadcrumb"
      style={{
        fontSize: 13,
        color: "var(--color-tertiary)",
        marginBottom: 16,
        padding: "8px 0",
      }}
    >
      {items.map((item, i) => (
        <span key={i}>
          {i > 0 && <span style={{ margin: "0 6px", opacity: 0.5 }}>/</span>}
          {item.href ? (
            <Link
              href={item.href}
              style={{
                color: "var(--color-secondary)",
                textDecoration: "none",
              }}
            >
              {item.label}
            </Link>
          ) : (
            <span style={{ color: "var(--color-primary)", fontWeight: 500 }}>
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}
