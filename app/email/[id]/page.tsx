type Email = {
  id: number;
  subject: string;
  brand?: string;
  received_at: string;
  html: string;
};

async function fetchEmail(id: string): Promise<Email> {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL!;
  const res = await fetch(`${base}/emails/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch email");
  return res.json();
}

export default async function EmailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const email = await fetchEmail(id);

  return (
    <main style={{ maxWidth: 800, margin: "0 auto", padding: 24 }}>
      <a href="/" style={{ color: "#0066cc", textDecoration: "none" }}>
        ← Back to feed
      </a>
      <h1 style={{ marginTop: 16, marginBottom: 8 }}>{email.subject}</h1>
      <div style={{ color: "#666", fontSize: 14, marginBottom: 24 }}>
        {email.brand && <span style={{ marginRight: 12 }}>{email.brand}</span>}
        <span>{new Date(email.received_at).toLocaleString()}</span>
      </div>
      <article
        style={{ border: "1px solid #ddd", borderRadius: 8, padding: 24, backgroundColor: "#fff" }}
        dangerouslySetInnerHTML={{ __html: email.html }}
      />
    </main>
  );
}