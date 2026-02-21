import type { MetadataRoute } from "next";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://milled-india-api.onrender.com";
const SITE_URL = "https://www.mailmuse.in";

// Each sitemap chunk holds up to 1000 URLs to stay well under Google's 50k/50MB limits
const EMAILS_PER_SITEMAP = 1000;

/**
 * Generate sitemap index entries.
 * Sitemap 0 = static pages + brands
 * Sitemap 1..N = email pages in chunks of EMAILS_PER_SITEMAP
 */
export async function generateSitemaps() {
  let emailCount = 0;
  try {
    const res = await fetch(`${API_BASE}/emails/count`, {
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const data = await res.json();
      emailCount = data.total || 0;
    }
  } catch (e) {
    console.error("Failed to fetch email count for sitemap index:", e);
  }

  const emailSitemapCount = Math.max(
    1,
    Math.ceil(emailCount / EMAILS_PER_SITEMAP)
  );

  // id=0 → static + brands, id=1..N → email chunks
  const sitemaps = [];
  for (let i = 0; i <= emailSitemapCount; i++) {
    sitemaps.push({ id: i });
  }
  return sitemaps;
}

export default async function sitemap({
  id,
}: {
  id: number;
}): Promise<MetadataRoute.Sitemap> {
  // Sitemap 0: static pages + all brands
  if (id === 0) {
    const entries: MetadataRoute.Sitemap = [
      {
        url: SITE_URL,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 1.0,
      },
      {
        url: `${SITE_URL}/browse`,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 0.9,
      },
      {
        url: `${SITE_URL}/brands`,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 0.9,
      },
      {
        url: `${SITE_URL}/pricing`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.7,
      },
      {
        url: `${SITE_URL}/analytics`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.7,
      },
      {
        url: `${SITE_URL}/benchmarks`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.7,
      },
    ];

    try {
      const brandsRes = await fetch(`${API_BASE}/brands`, {
        next: { revalidate: 3600 },
      });
      if (brandsRes.ok) {
        const brands: string[] = await brandsRes.json();
        for (const brand of brands) {
          entries.push({
            url: `${SITE_URL}/brand/${encodeURIComponent(brand)}`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.8,
          });
        }
      }
    } catch (e) {
      console.error("Failed to fetch brands for sitemap:", e);
    }

    return entries;
  }

  // Sitemaps 1..N: email pages in chunks
  const chunkIndex = id - 1;
  const entries: MetadataRoute.Sitemap = [];

  try {
    const emailsRes = await fetch(`${API_BASE}/emails/ids`, {
      next: { revalidate: 3600 },
    });
    if (emailsRes.ok) {
      const allEmails: { id: number; received_at: string | null }[] =
        await emailsRes.json();
      const start = chunkIndex * EMAILS_PER_SITEMAP;
      const chunk = allEmails.slice(start, start + EMAILS_PER_SITEMAP);

      for (const email of chunk) {
        entries.push({
          url: `${SITE_URL}/email/${email.id}`,
          lastModified: email.received_at
            ? new Date(email.received_at)
            : new Date(),
          changeFrequency: "monthly",
          priority: 0.6,
        });
      }
    }
  } catch (e) {
    console.error("Failed to fetch emails for sitemap:", e);
  }

  return entries;
}
