import type { MetadataRoute } from "next";
import { INDUSTRIES } from "./lib/constants";
import { industryToSlug } from "./lib/industry-utils";
import { getAllTypeSlugs } from "./lib/type-utils";
import { posts } from "./blog/posts";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://milled-india-api.onrender.com";
const SITE_URL = "https://www.mailmuse.in";

// Each sitemap chunk holds up to 1000 URLs to stay well under Google's 50k/50MB limits
const EMAILS_PER_SITEMAP = 1000;

// Timeout for API calls (Render free tier cold-starts can take 30s+)
const FETCH_TIMEOUT_MS = 8000;

/** Fetch with a timeout so sitemap generation never hangs. */
async function fetchWithTimeout(url: string): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    return await fetch(url, {
      signal: controller.signal,
      next: { revalidate: 3600 },
    });
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Generate sitemap index entries.
 * Sitemap 0 = static pages + brands + types + compare + campaigns
 * Sitemap 1..N = email pages in chunks of EMAILS_PER_SITEMAP
 */
export async function generateSitemaps() {
  let emailCount = 0;
  try {
    const res = await fetchWithTimeout(`${API_BASE}/emails/count`);
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
  // Sitemap 0: static pages + all brands + types + compare + campaigns
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

    // Brand pages
    try {
      const brandsRes = await fetchWithTimeout(`${API_BASE}/brands`);
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

    // Industry pages
    entries.push({
      url: `${SITE_URL}/industry`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    });
    for (const industry of INDUSTRIES) {
      entries.push({
        url: `${SITE_URL}/industry/${industryToSlug(industry)}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }

    // Email type pages
    entries.push({
      url: `${SITE_URL}/types`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    });
    for (const slug of getAllTypeSlugs()) {
      entries.push({
        url: `${SITE_URL}/types/${slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }

    // Comparison pages
    try {
      const pairsRes = await fetchWithTimeout(`${API_BASE}/seo/compare/pairs`);
      if (pairsRes.ok) {
        const pairs: { slug: string }[] = await pairsRes.json();
        for (const pair of pairs) {
          entries.push({
            url: `${SITE_URL}/compare/${pair.slug}`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.7,
          });
        }
      }
    } catch (e) {
      console.error("Failed to fetch compare pairs for sitemap:", e);
    }

    // Campaign pages
    try {
      const campaignsRes = await fetchWithTimeout(`${API_BASE}/seo/campaigns`);
      if (campaignsRes.ok) {
        const campaigns: { slug: string }[] = await campaignsRes.json();
        entries.push({
          url: `${SITE_URL}/campaigns`,
          lastModified: new Date(),
          changeFrequency: "weekly",
          priority: 0.7,
        });
        for (const campaign of campaigns) {
          entries.push({
            url: `${SITE_URL}/campaigns/${campaign.slug}`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.7,
          });
        }
      }
    } catch (e) {
      console.error("Failed to fetch campaigns for sitemap:", e);
    }

    // Blog pages
    entries.push({
      url: `${SITE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    });
    for (const post of posts) {
      entries.push({
        url: `${SITE_URL}/blog/${post.slug}`,
        lastModified: new Date(post.date),
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }

    return entries;
  }

  // Sitemaps 1..N: email pages in chunks
  const chunkIndex = id - 1;
  const entries: MetadataRoute.Sitemap = [];

  try {
    const emailsRes = await fetchWithTimeout(`${API_BASE}/emails/ids`);
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
