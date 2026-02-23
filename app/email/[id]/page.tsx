import type { Metadata } from "next";
import EmailPageClient from "./EmailPageClient";
import EmailSeoContent from "./EmailSeoContent";
import JsonLd from "../../components/JsonLd";
import Breadcrumb from "../../components/Breadcrumb";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://milled-india-api.onrender.com";

type EmailSeoData = {
  id: number;
  subject: string;
  brand: string;
  type: string;
  industry: string;
  received_at: string | null;
  preview: string | null;
  analysis: {
    char_count: number;
    word_count: number;
    has_emoji: boolean;
    has_question: boolean;
    has_number: boolean;
    has_personalization: boolean;
    has_urgency: boolean;
  };
  more_from_brand: {
    id: number;
    subject: string;
    type: string;
    received_at: string | null;
  }[];
  similar_emails: {
    id: number;
    subject: string;
    brand: string;
    type: string;
    received_at: string | null;
  }[];
};

async function fetchEmailSeoData(id: string): Promise<EmailSeoData | null> {
  try {
    const res = await fetch(`${API_BASE}/seo/email/${id}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const data = await fetchEmailSeoData(id);

  if (!data) {
    return {
      title: "Email | MailMuse",
      description: "View email marketing campaigns from top D2C brands on MailMuse.",
    };
  }

  const brand = data.brand || "Unknown Brand";
  const title = `${brand} — "${data.subject}" | MailMuse`;
  const description = [
    brand,
    data.type ? `${data.type} email` : "email",
    data.received_at
      ? `from ${new Date(data.received_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })}`
      : "",
    data.preview ? `— ${data.preview.slice(0, 140)}` : "",
    `Browse ${brand}'s email marketing strategy on MailMuse.`,
  ]
    .filter(Boolean)
    .join(" ");

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      siteName: "MailMuse",
      url: `https://www.mailmuse.in/email/${id}`,
    },
    twitter: { card: "summary", title, description },
    alternates: { canonical: `https://www.mailmuse.in/email/${id}` },
  };
}

export default async function EmailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const seoData = await fetchEmailSeoData(id);

  const pageUrl = `https://www.mailmuse.in/email/${id}`;

  const breadcrumbLd = seoData
    ? {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://www.mailmuse.in" },
          { "@type": "ListItem", position: 2, name: seoData.brand, item: `https://www.mailmuse.in/brand/${encodeURIComponent(seoData.brand)}` },
          { "@type": "ListItem", position: 3, name: seoData.subject.slice(0, 60), item: pageUrl },
        ],
      }
    : null;

  const creativeWorkLd = seoData
    ? {
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        name: seoData.subject,
        author: { "@type": "Organization", name: seoData.brand },
        datePublished: seoData.received_at,
        url: pageUrl,
        description: seoData.preview || `${seoData.type} email from ${seoData.brand}`,
      }
    : null;

  return (
    <>
      {breadcrumbLd && <JsonLd data={breadcrumbLd} />}
      {creativeWorkLd && <JsonLd data={creativeWorkLd} />}
      {seoData && (
        <div style={{ display: "none" }}>
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: seoData.brand, href: `/brand/${encodeURIComponent(seoData.brand)}` },
              { label: seoData.subject.slice(0, 50) },
            ]}
          />
        </div>
      )}
      <EmailPageClient />
      {seoData && <EmailSeoContent data={seoData} />}
    </>
  );
}
