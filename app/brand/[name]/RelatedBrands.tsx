import Link from "next/link";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://milled-india-api.onrender.com";

export default async function RelatedBrands({
  industry,
  currentBrand,
}: {
  industry: string | null;
  currentBrand: string;
}) {
  if (!industry) return null;

  let brands: string[] = [];
  try {
    const res = await fetch(
      `${API_BASE}/brands/by-industry/${encodeURIComponent(industry)}`,
      { next: { revalidate: 3600 } }
    );
    if (res.ok) brands = await res.json();
  } catch {
    return null;
  }

  const related = brands
    .filter((b) => b.toLowerCase() !== currentBrand.toLowerCase())
    .slice(0, 12);

  if (related.length === 0) return null;

  return (
    <div
      style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: "0 24px 48px",
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: 14,
          padding: "28px 32px",
          border: "1px solid var(--color-border)",
        }}
      >
        <h2
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: "var(--color-primary)",
            margin: "0 0 16px",
            fontFamily: "var(--font-dm-serif)",
          }}
        >
          More {industry} Brands
        </h2>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 10,
          }}
        >
          {related.map((brand) => (
            <Link
              key={brand}
              href={`/brand/${encodeURIComponent(brand)}`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 16px",
                borderRadius: 100,
                background: "var(--color-surface)",
                color: "var(--color-primary)",
                textDecoration: "none",
                fontSize: 13,
                fontWeight: 500,
                transition: "all 150ms ease",
                border: "1px solid var(--color-border)",
                textTransform: "capitalize",
              }}
            >
              <span
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 6,
                  background: "var(--color-accent-light)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 11,
                  fontWeight: 700,
                  color: "var(--color-accent)",
                  flexShrink: 0,
                }}
              >
                {brand.charAt(0).toUpperCase()}
              </span>
              {brand}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
