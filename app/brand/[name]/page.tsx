import type { Metadata } from "next";
import BrandPageClient from "./BrandPageClient";
import BrandSeoContent from "./BrandSeoContent";
import BrandRecentEmails from "./BrandRecentEmails";
import RelatedBrands from "./RelatedBrands";
import JsonLd from "../../components/JsonLd";
import Breadcrumb from "../../components/Breadcrumb";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://milled-india-api.onrender.com";

export type BrandSeoData = {
  brand: string;
  industry: string | null;
  total_emails: number;
  emails_per_week: number;
  first_email: string | null;
  last_email: string | null;
  campaign_breakdown: Record<string, number>;
  send_day_distribution: Record<string, number>;
  send_time_distribution: Record<string, number>;
  subject_line_stats: {
    avg_length: number;
    emoji_usage_rate: number;
    top_words: string[];
    sample_subjects: string[];
  };
  recent_emails: {
    id: number;
    subject: string;
    type: string;
    received_at: string | null;
  }[];
  festive_campaigns: { festival: string; count: number; year: number }[];
  related_brands: string[];
};

async function fetchBrandData(
  brandName: string
): Promise<BrandSeoData | null> {
  try {
    const res = await fetch(
      `${API_BASE}/seo/brand/${encodeURIComponent(brandName)}`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ name: string }>;
}): Promise<Metadata> {
  const { name } = await params;
  const brandName = decodeURIComponent(name);
  const data = await fetchBrandData(brandName);

  if (!data) {
    return {
      title: `${brandName} — Email Campaigns | MailMuse`,
      description: `Browse ${brandName}'s email marketing campaigns and strategy on MailMuse.`,
    };
  }

  const emailCount = `${data.total_emails} emails tracked`;
  const industry = data.industry || "D2C";
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
}

export default async function BrandPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const brandName = decodeURIComponent(name);
  const data = await fetchBrandData(brandName);

  const brandUrl = `https://www.mailmuse.in/brand/${encodeURIComponent(brandName)}`;

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
        name: "Brands",
        item: "https://www.mailmuse.in/brands",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: brandName,
        item: brandUrl,
      },
    ],
  };

  const webPageLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${brandName} Email Marketing Strategy`,
    url: brandUrl,
    description: `Analyze ${brandName}'s email marketing campaigns, send frequency, subject lines, and more.`,
    isPartOf: {
      "@type": "WebSite",
      name: "MailMuse",
      url: "https://www.mailmuse.in",
    },
  };

  return (
    <>
      <JsonLd data={breadcrumbLd} />
      <JsonLd data={webPageLd} />
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 24px",
        }}
      >
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Brands", href: "/brands" },
            { label: brandName },
          ]}
        />
      </div>
      <BrandPageClient />
      {data && (
        <>
          <BrandSeoContent data={data} brandName={brandName} />
          <BrandRecentEmails emails={data.recent_emails} brandName={brandName} />
          <RelatedBrands
            industry={data.industry}
            currentBrand={brandName}
          />
        </>
      )}
    </>
  );
}
