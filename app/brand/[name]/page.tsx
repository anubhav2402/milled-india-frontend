import type { Metadata } from "next";
import BrandPageClient from "./BrandPageClient";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://milled-india-api.onrender.com";

type BrandMeta = {
  brand: string;
  total_emails: number | string;
  primary_industry: string | null;
  emails_per_week: number | string;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ name: string }>;
}): Promise<Metadata> {
  const { name } = await params;
  const brandName = decodeURIComponent(name);

  try {
    const res = await fetch(
      `${API_BASE}/analytics/brand/${encodeURIComponent(brandName)}`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) throw new Error("Not found");
    const data: BrandMeta = await res.json();

    const emailCount = typeof data.total_emails === "number" ? `${data.total_emails} emails tracked` : "emails tracked";
    const industry = data.primary_industry || "D2C";
    const title = `${brandName} Email Marketing Strategy & Campaigns | MailMuse`;
    const description = `See ${brandName}'s email marketing strategy. ${emailCount}. Browse ${industry} campaigns, subject lines, send frequency, and more on MailMuse.`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: "profile",
        siteName: "MailMuse",
        url: `https://www.mailmuse.in/brand/${encodeURIComponent(brandName)}`,
      },
      twitter: {
        card: "summary",
        title,
        description,
      },
      alternates: {
        canonical: `https://www.mailmuse.in/brand/${encodeURIComponent(brandName)}`,
      },
    };
  } catch {
    return {
      title: `${brandName} — Email Campaigns | MailMuse`,
      description: `Browse ${brandName}'s email marketing campaigns and strategy on MailMuse.`,
    };
  }
}

export default function BrandPage() {
  return <BrandPageClient />;
}
