type Email = { id: number; subject: string; brand?: string; preview?: string };

export default async function Home() {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL!;
  const res = await fetch(`${base}/emails`, { cache: "no-store" });
  const emails: Email[] = await res.json();

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <h1>Milled India</h1>
      <ul style={{ display: "grid", gap: 12, padding: 0, listStyle: "none" }}>
        {emails.map((e) => (
          <li key={e.id} style={{ border: "1px solid #ddd", padding: 12, borderRadius: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
              <strong>{e.subject}</strong>
              <span style={{ color: "#666" }}>{e.brand}</span>
            </div>
            <div style={{ color: "#666", marginTop: 6 }}>{e.preview}</div>
          </li>
        ))}
      </ul>
    </main>
  );
}