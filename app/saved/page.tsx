"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "../components/Header";
import EmailCard, { EmailCardSkeleton } from "../components/EmailCard";
import { useAuth } from "../context/AuthContext";
import { API_BASE } from "../lib/constants";

type SavedEmail = {
  id: number;
  subject: string;
  brand?: string;
  preview?: string;
  type?: string;
  industry?: string;
  received_at: string;
  bookmarked_at?: string;
};

export default function SavedPage() {
  const { user, token, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [emails, setEmails] = useState<SavedEmail[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!token) return;

    const fetchSaved = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/user/bookmarks`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setEmails(data.bookmarks || []);
        }
      } catch (err) {
        console.error("Failed to fetch bookmarks:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSaved();
  }, [token]);

  if (authLoading || !user) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--color-surface)" }}>
        <Header activeRoute="/saved" />
        <div style={{ padding: 60, textAlign: "center" }}>
          <div style={{
            width: 40, height: 40, border: "3px solid var(--color-border)",
            borderTopColor: "var(--color-accent)", borderRadius: "50%",
            animation: "spin 1s linear infinite", margin: "0 auto",
          }} />
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-surface)" }}>
      <Header activeRoute="/saved" />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px" }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{
            fontFamily: "var(--font-dm-serif)", fontSize: 28,
            color: "var(--color-primary)", margin: "0 0 6px",
          }}>
            Saved Emails
          </h1>
          <p style={{ fontSize: 14, color: "var(--color-secondary)", margin: 0 }}>
            {loading ? "Loading..." : `${emails.length} saved emails`}
          </p>
        </div>

        {loading ? (
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20,
          }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <EmailCardSkeleton key={i} />
            ))}
          </div>
        ) : emails.length === 0 ? (
          <div style={{
            background: "white", borderRadius: 14, padding: "60px 24px",
            textAlign: "center", border: "1px solid var(--color-border)",
          }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📑</div>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: "var(--color-primary)", marginBottom: 8 }}>
              No saved emails yet
            </h3>
            <p style={{ fontSize: 14, color: "var(--color-secondary)", marginBottom: 20 }}>
              Browse and bookmark emails you love to build your personal swipe file.
            </p>
            <Link
              href="/browse"
              style={{
                display: "inline-block", padding: "10px 24px", borderRadius: 10,
                background: "var(--color-accent)", color: "white",
                textDecoration: "none", fontSize: 14, fontWeight: 500,
              }}
            >
              Browse Emails
            </Link>
          </div>
        ) : (
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20,
          }}>
            {emails.map((email) => (
              <EmailCard
                key={email.id}
                id={email.id}
                subject={email.subject}
                brand={email.brand}
                preview={email.preview}
                industry={email.industry}
                received_at={email.received_at}
                campaignType={email.type}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
