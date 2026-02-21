import type { MetadataRoute } from "next";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://milled-india-api.onrender.com";
const SITE_URL = "https://www.mailmuse.in";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  // Static pages
  entries.push(
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${SITE_URL}/browse`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/brands`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/analytics`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/benchmarks`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
  );

  // Brand pages
  try {
    const brandsRes = await fetch(`${API_BASE}/brands`, { next: { revalidate: 3600 } });
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

  // Email pages
  try {
    const emailsRes = await fetch(`${API_BASE}/emails/ids`, { next: { revalidate: 3600 } });
    if (emailsRes.ok) {
      const emails: { id: number; received_at: string | null }[] = await emailsRes.json();
      for (const email of emails) {
        entries.push({
          url: `${SITE_URL}/email/${email.id}`,
          lastModified: email.received_at ? new Date(email.received_at) : new Date(),
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
