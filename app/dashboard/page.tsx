"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "../components/Header";
import EmailCard from "../components/EmailCard";
import { useAuth } from "../context/AuthContext";
import { useBookmarks } from "../hooks/useBookmarks";
import { API_BASE } from "../lib/constants";

type EmailItem = {
  id: number;
  subject: string;
  brand?: string;
  preview?: string;
  type?: string;
  industry?: string;
  received_at: string;
};

export default function DashboardPage() {
  const { user, token, isLoading: authLoading } = useAuth();
  const { bookmarkedIds, toggleBookmark, isBookmarked } = useBookmarks();
  const router = useRouter();

  const [follows, setFollows] = useState<string[]>([]);
  const [feedEmails, setFeedEmails] = useState<EmailItem[]>([]);
  const [savedEmails, setSavedEmails] = useState<EmailItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!token) return;

    const fetchDashboard = async () => {
      setLoading(true);
      const headers = { Authorization: `Bearer ${token}` };

      try {
        // Fetch follows
        const followsRes = await fetch(`${API_BASE}/user/follows`, { headers });
        let brandList: string[] = [];
        if (followsRes.ok) {
          const data = await followsRes.json();
          brandList = data.follows || [];
          setFollows(brandList);
        }

        // Fetch latest emails from followed brands (cap at 10 brands)
        const brandsToFetch = brandList.slice(0, 10);
        if (brandsToFetch.length > 0) {
          const emailPromises = brandsToFetch.map((brand) =>
            fetch(`${API_BASE}/emails?brand=${encodeURIComponent(brand)}&limit=5`)
              .then((r) => (r.ok ? r.json() : []))
              .catch(() => [])
          );
          const allEmails = (await Promise.all(emailPromises)).flat();
          allEmails.sort((a, b) => new Date(b.received_at).getTime() - new Date(a.received_at).getTime());
          setFeedEmails(allEmails.slice(0, 20));
        }

        // Fetch saved emails
        const savedRes = await fetch(`${API_BASE}/user/bookmarks`, { headers });
        if (savedRes.ok) {
          const data = await savedRes.json();
          setSavedEmails((data.bookmarks || []).slice(0, 4));
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [token]);

  if (authLoading || !user) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--color-surface)" }}>
        <Header activeRoute="/dashboard" />
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

  const thisWeekCount = feedEmails.filter((e) => {
    const d = new Date(e.received_at);
    const now = new Date();
    return now.getTime() - d.getTime() < 7 * 24 * 60 * 60 * 1000;
  }).length;

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-surface)" }}>
      <Header activeRoute="/dashboard" />

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px" }}>
        {/* Welcome */}
        <h1 style={{
          fontFamily: "var(--font-dm-serif)", fontSize: 28,
          color: "var(--color-primary)", margin: "0 0 24px",
        }}>
          Welcome back{user.name ? `, ${user.name.split(" ")[0]}` : ""}
        </h1>

        {/* Summary Stats */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 16, marginBottom: 32,
        }}>
          {[
            { label: "Following", value: follows.length, suffix: "brands" },
            { label: "New this week", value: thisWeekCount, suffix: "emails" },
            { label: "Saved", value: bookmarkedIds.size, suffix: "emails" },
          ].map((stat) => (
            <div key={stat.label} style={{
              background: "white", borderRadius: 12, padding: "20px 24px",
              border: "1px solid var(--color-border)",
            }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: "var(--color-primary)", marginBottom: 2 }}>
                {stat.value}
              </div>
              <div style={{ fontSize: 12, color: "var(--color-tertiary)" }}>
                {stat.label} · {stat.suffix}
              </div>
            </div>
          ))}
        </div>

        {/* Feed */}
        {follows.length === 0 ? (
          <div style={{
            background: "white", borderRadius: 14, padding: "48px 24px",
            textAlign: "center", border: "1px solid var(--color-border)", marginBottom: 32,
          }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📬</div>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: "var(--color-primary)", marginBottom: 8 }}>
              Follow brands to build your feed
            </h3>
            <p style={{ fontSize: 14, color: "var(--color-secondary)", marginBottom: 20 }}>
              Follow your favorite brands to see their latest email campaigns here.
            </p>
            <Link
              href="/brands"
              style={{
                display: "inline-block", padding: "10px 24px", borderRadius: 10,
                background: "var(--color-accent)", color: "white",
                textDecoration: "none", fontSize: 14, fontWeight: 500,
              }}
            >
              Browse Brands
            </Link>
          </div>
        ) : (
          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, color: "var(--color-primary)", margin: "0 0 16px" }}>
              Latest from your brands
            </h2>
            {loading ? (
              <p style={{ color: "var(--color-tertiary)", fontSize: 14 }}>Loading feed...</p>
            ) : feedEmails.length === 0 ? (
              <p style={{ color: "var(--color-tertiary)", fontSize: 14 }}>No recent emails from followed brands.</p>
            ) : (
              <div style={{
                display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20,
              }}>
                {feedEmails.slice(0, 12).map((email) => (
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
        )}

        {/* Saved Emails Preview */}
        {savedEmails.length > 0 && (
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <h2 style={{ fontSize: 16, fontWeight: 600, color: "var(--color-primary)", margin: 0 }}>
                Saved Emails ({bookmarkedIds.size})
              </h2>
              <Link href="/saved" style={{ fontSize: 13, color: "var(--color-accent)", textDecoration: "none", fontWeight: 500 }}>
                View all →
              </Link>
            </div>
            <div style={{
              display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20,
            }}>
              {savedEmails.map((email) => (
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
          </div>
        )}
      </div>
    </div>
  );
}
