import { NextResponse } from "next/server";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://milled-india-api.onrender.com";
const SITE_URL = "https://www.mailmuse.in";
const EMAILS_PER_SITEMAP = 1000;
const FETCH_TIMEOUT_MS = 8000;

async function fetchWithTimeout(url: string): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

export async function GET() {
  let emailCount = 0;
  try {
    const res = await fetchWithTimeout(`${API_BASE}/emails/count`);
    if (res.ok) {
      const data = await res.json();
      emailCount = data.total || 0;
    }
  } catch {
    // If API is down, still generate index with at least sitemap 0
  }

  const emailSitemapCount = Math.max(
    1,
    Math.ceil(emailCount / EMAILS_PER_SITEMAP)
  );
  const totalSitemaps = emailSitemapCount + 1; // +1 for id=0 (static + brands)

  const sitemapEntries = [];
  for (let i = 0; i < totalSitemaps; i++) {
    sitemapEntries.push(`  <sitemap>
    <loc>${SITE_URL}/sitemap/${i}.xml</loc>
  </sitemap>`);
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries.join("\n")}
</sitemapindex>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
