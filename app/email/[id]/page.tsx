import type { Metadata } from "next";
import EmailPageClient from "./EmailPageClient";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://milled-india-api.onrender.com";

type EmailMeta = {
  id: number;
  subject: string;
  brand?: string;
  type?: string;
  industry?: string;
  received_at: string;
  preview?: string;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  try {
    const res = await fetch(`${API_BASE}/emails/${id}`, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error("Not found");
    const email: EmailMeta = await res.json();

    const brand = email.brand || "Unknown Brand";
    const title = `${brand} — "${email.subject}" | MailMuse`;
    const description = [
      brand,
      email.type ? `${email.type} email` : "email",
      email.received_at ? `from ${new Date(email.received_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })}` : "",
      email.preview ? `— ${email.preview.slice(0, 140)}` : "",
      `Browse ${brand}'s email marketing strategy on MailMuse.`,
    ].filter(Boolean).join(" ");

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
      twitter: {
        card: "summary",
        title,
        description,
      },
      alternates: {
        canonical: `https://www.mailmuse.in/email/${id}`,
      },
    };
  } catch {
    return {
      title: "Email | MailMuse",
      description: "View email marketing campaigns from top D2C brands on MailMuse.",
    };
  }
}

export default function EmailPage() {
  return <EmailPageClient />;
}
