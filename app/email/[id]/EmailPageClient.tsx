"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Logo from "../../components/Logo";
import Badge from "../../components/Badge";
import Button from "../../components/Button";
import Header from "../../components/Header";
import { useAuth } from "../../context/AuthContext";
import { useBookmarks } from "../../hooks/useBookmarks";

type Email = {
  id: number;
  subject: string;
  brand?: string;
  sender?: string;
  category?: string;
  type?: string;
  industry?: string;
  received_at: string;
  preview?: string;
  html: string;
  preview_image_url?: string;
};

type RelatedEmail = {
  id: number;
  subject: string;
  brand?: string;
  industry?: string;
  type?: string;
  received_at: string;
  preview?: string;
};

type BrandAnalytics = {
  brand: string;
  total_emails: number | string;
  primary_industry: string;
  emails_per_week: number | string;
  campaign_breakdown: Record<string, number | string>;
  first_email: string;
  last_email: string;
};

// Subject line analysis (computed client-side)
function analyzeSubject(subject: string) {
  const charCount = subject.length;
  const wordCount = subject.split(/\s+/).filter(Boolean).length;
  const emojiRegex = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE00}-\u{FE0F}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{200D}\u{20E3}]/gu;
  const hasEmoji = emojiRegex.test(subject);
  const hasQuestion = subject.includes("?");
  const hasNumber = /\d/.test(subject);
  return { charCount, wordCount, hasEmoji, hasQuestion, hasNumber };
}

// Copy icon SVG
const CopyIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export default function EmailPageClient() {
  const params = useParams();
  const id = params?.id as string;
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [email, setEmail] = useState<Email | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [iframeHeight, setIframeHeight] = useState(600);
  const [copied, setCopied] = useState(false);
  const [brandAnalytics, setBrandAnalytics] = useState<BrandAnalytics | null>(null);
  const [brandEmails, setBrandEmails] = useState<RelatedEmail[]>([]);
  const [similarEmails, setSimilarEmails] = useState<RelatedEmail[]>([]);
  const { user } = useAuth();
  const { isBookmarked, toggleBookmark } = useBookmarks();

  const base = process.env.NEXT_PUBLIC_API_BASE_URL || "https://milled-india-api.onrender.com";

  // Fetch email
  useEffect(() => {
    if (!id) return;
    const fetchEmail = async () => {
      try {
        if (!base) throw new Error("API URL not configured");
        const res = await fetch(`${base}/emails/${id}`);
        if (!res.ok) throw new Error(`Failed to fetch email: ${res.status}`);
        const data = await res.json();
        setEmail(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load email");
      } finally {
        setLoading(false);
      }
    };
    fetchEmail();
  }, [id, base]);

  // Fetch brand analytics + related emails once email is loaded
  useEffect(() => {
    if (!email || !base) return;

    if (email.brand) {
      // Brand analytics
      fetch(`${base}/analytics/brand/${encodeURIComponent(email.brand)}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => data && setBrandAnalytics(data))
        .catch(() => {});

      // More from this brand
      fetch(`${base}/emails?brand=${encodeURIComponent(email.brand)}&limit=5`)
        .then((r) => (r.ok ? r.json() : []))
        .then((data: RelatedEmail[]) => setBrandEmails(data.filter((e) => e.id !== email.id).slice(0, 4)))
        .catch(() => {});
    }

    if (email.type) {
      // Similar campaign type
      fetch(`${base}/emails?type=${encodeURIComponent(email.type)}&limit=5`)
        .then((r) => (r.ok ? r.json() : []))
        .then((data: RelatedEmail[]) => setSimilarEmails(data.filter((e) => e.id !== email.id).slice(0, 4)))
        .catch(() => {});
    }
  }, [email, base]);

  // Auto-resize iframe
  useEffect(() => {
    if (!email?.html || !iframeRef.current) return;
    const iframe = iframeRef.current;
    const resizeIframe = () => {
      try {
        const doc = iframe.contentDocument || iframe.contentWindow?.document;
        if (doc && doc.body) {
          const height = Math.max(doc.body.scrollHeight, doc.body.offsetHeight, doc.documentElement.scrollHeight, doc.documentElement.offsetHeight);
          setIframeHeight(Math.max(height + 60, 600));
        }
      } catch (e) {
        console.error("Could not access iframe content:", e);
      }
    };
    const handleLoad = () => {
      resizeIframe();
      setTimeout(resizeIframe, 1000);
      setTimeout(resizeIframe, 2500);
    };
    iframe.addEventListener("load", handleLoad);
    return () => iframe.removeEventListener("load", handleLoad);
  }, [email?.html]);

  const getIframeContent = (html: string) => `<!DOCTYPE html>
<html><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
html, body { margin: 0 !important; padding: 0 !important; width: 100% !important; -webkit-text-size-adjust: 100%; }
body { background-color: #FAF9F7 !important; display: flex; justify-content: center; }
body > table, body > div, body > center { margin: 0 auto !important; }
img { border: 0; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; }
table { border-collapse: collapse !important; }
a { text-decoration: none; }
img[src=""] { display: none !important; }
</style></head><body>${html}</body></html>`;

  const copySubject = async () => {
    if (!email) return;
    try {
      await navigator.clipboard.writeText(email.subject);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textarea = document.createElement("textarea");
      textarea.value = email.subject;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "var(--color-surface)" }}>
        <Header />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{
              width: 32, height: 32, border: "3px solid var(--color-border)",
              borderTopColor: "var(--color-accent)", borderRadius: "50%",
              animation: "spin 1s linear infinite", margin: "0 auto 16px",
            }} />
            <p style={{ fontSize: 15, color: "var(--color-secondary)" }}>Loading email...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !email) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "var(--color-surface)" }}>
        <Header />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh", padding: 40 }}>
          <div style={{ textAlign: "center" }}>
            <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 16, color: "var(--color-primary)" }}>
              Unable to Load Email
            </h1>
            <p style={{ fontSize: 16, color: "var(--color-secondary)", marginBottom: 24 }}>
              {error || "There was an error loading this email."}
            </p>
            <Button href="/browse">Back to Browse</Button>
          </div>
        </div>
      </div>
    );
  }

  const subjectAnalysis = analyzeSubject(email.subject);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--color-surface)" }}>
      <Header />

      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px" }}>
        {/* Main grid: content + sidebar */}
        <div className="email-detail-grid" style={{
          display: "grid",
          gridTemplateColumns: "1fr 300px",
          gap: 32,
          alignItems: "start",
        }}>
          {/* Left: Email content */}
          <div>
            {/* Email card */}
            <div style={{
              backgroundColor: "white",
              borderRadius: 16,
              border: "1px solid var(--color-border)",
              overflow: "hidden",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            }}>
              {/* Metadata bar */}
              <div style={{ padding: "28px 32px", borderBottom: "1px solid var(--color-border)" }}>
                {/* Badges row */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
                  {email.brand && (
                    <Link href={`/browse?brand=${encodeURIComponent(email.brand)}`} style={{ textDecoration: "none" }}>
                      <Badge variant="accent" size="md">{email.brand}</Badge>
                    </Link>
                  )}
                  {email.industry && <Badge variant="default" size="sm">{email.industry}</Badge>}
                  {email.type && <Badge variant="default" size="sm">{email.type}</Badge>}
                  {email.category && <Badge variant="default" size="sm">{email.category}</Badge>}
                </div>

                {/* Sender + Date */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
                  {email.sender && (
                    <span style={{ fontSize: 13, color: "var(--color-secondary)" }}>
                      From: <span style={{ fontWeight: 500, color: "var(--color-primary)" }}>{email.sender}</span>
                    </span>
                  )}
                  <time style={{ fontSize: 13, color: "var(--color-tertiary)", fontWeight: 500 }}>
                    {new Date(email.received_at).toLocaleString("en-IN", {
                      weekday: "short", month: "long", day: "numeric", year: "numeric",
                      hour: "numeric", minute: "2-digit",
                    })}
                  </time>
                </div>

                {/* Subject + Copy */}
                <div style={{ display: "flex", alignItems: "start", gap: 12 }}>
                  <h1 style={{
                    margin: 0, flex: 1,
                    fontFamily: "var(--font-dm-serif)",
                    fontSize: "clamp(22px, 3vw, 28px)",
                    fontWeight: 400,
                    color: "var(--color-primary)",
                    lineHeight: 1.3,
                  }}>
                    {email.subject}
                  </h1>
                  <div style={{ display: "flex", gap: 8, flexShrink: 0, marginTop: 4 }}>
                    <button
                      onClick={copySubject}
                      title="Copy subject line"
                      style={{
                        background: copied ? "#dcfce7" : "var(--color-surface)",
                        border: `1px solid ${copied ? "#86efac" : "var(--color-border)"}`,
                        borderRadius: 8, padding: "8px 12px",
                        cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
                        fontSize: 12, fontWeight: 500,
                        color: copied ? "#16a34a" : "var(--color-secondary)",
                        transition: "all 150ms ease",
                      }}
                    >
                      {copied ? <CheckIcon /> : <CopyIcon />}
                      {copied ? "Copied!" : "Copy"}
                    </button>
                    {user && (
                      <button
                        onClick={() => toggleBookmark(Number(id))}
                        title={isBookmarked(Number(id)) ? "Remove bookmark" : "Bookmark email"}
                        style={{
                          background: isBookmarked(Number(id)) ? "#fef2f2" : "var(--color-surface)",
                          border: `1px solid ${isBookmarked(Number(id)) ? "#fecaca" : "var(--color-border)"}`,
                          borderRadius: 8, padding: "8px 12px",
                          cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
                          fontSize: 12, fontWeight: 500,
                          color: isBookmarked(Number(id)) ? "#ef4444" : "var(--color-secondary)",
                          transition: "all 150ms ease",
                        }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill={isBookmarked(Number(id)) ? "#ef4444" : "none"} stroke="currentColor" strokeWidth="2">
                          <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                        </svg>
                        {isBookmarked(Number(id)) ? "Saved" : "Save"}
                      </button>
                    )}
                  </div>
                </div>

                {/* Subject Analysis Strip */}
                <div style={{
                  marginTop: 16, display: "flex", flexWrap: "wrap", gap: 16,
                  padding: "12px 16px",
                  background: "var(--color-surface)",
                  borderRadius: 10,
                  fontSize: 12, color: "var(--color-secondary)", fontWeight: 500,
                }}>
                  <span>{subjectAnalysis.charCount} characters</span>
                  <span style={{ color: "var(--color-border)" }}>|</span>
                  <span>{subjectAnalysis.wordCount} words</span>
                  {subjectAnalysis.hasEmoji && (
                    <>
                      <span style={{ color: "var(--color-border)" }}>|</span>
                      <span>Has emoji</span>
                    </>
                  )}
                  {subjectAnalysis.hasQuestion && (
                    <>
                      <span style={{ color: "var(--color-border)" }}>|</span>
                      <span>Question format</span>
                    </>
                  )}
                  {subjectAnalysis.hasNumber && (
                    <>
                      <span style={{ color: "var(--color-border)" }}>|</span>
                      <span>Contains numbers</span>
                    </>
                  )}
                </div>
              </div>

              {/* Email body */}
              <div style={{ backgroundColor: "var(--color-surface)", padding: "20px 0" }}>
                <iframe
                  ref={iframeRef}
                  srcDoc={getIframeContent(email.html)}
                  style={{
                    width: "100%", height: iframeHeight,
                    border: "none", display: "block",
                    backgroundColor: "var(--color-surface)",
                  }}
                  title="Email content"
                  sandbox="allow-same-origin allow-popups allow-popups-to-escape-sandbox"
                />
              </div>
            </div>
          </div>

          {/* Right: Brand Sidebar */}
          <aside className="email-detail-sidebar">
            {email.brand && (
              <div style={{
                backgroundColor: "white",
                borderRadius: 16,
                border: "1px solid var(--color-border)",
                padding: 24,
                position: "sticky",
                top: 80,
              }}>
                {/* Brand header */}
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 12,
                    background: "var(--color-accent-light)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontWeight: 700, fontSize: 18, color: "var(--color-accent)",
                  }}>
                    {email.brand[0]?.toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 600, color: "var(--color-primary)" }}>
                      {email.brand}
                    </div>
                    {brandAnalytics?.primary_industry && (
                      <div style={{ fontSize: 12, color: "var(--color-tertiary)" }}>
                        {brandAnalytics.primary_industry}
                      </div>
                    )}
                  </div>
                </div>

                {/* Stats */}
                {brandAnalytics && brandAnalytics.total_emails !== "xx" ? (
                  <>
                    <div style={{
                      display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12,
                      marginBottom: 20, padding: "16px 0",
                      borderTop: "1px solid var(--color-border)",
                      borderBottom: "1px solid var(--color-border)",
                    }}>
                      <div>
                        <div style={{ fontSize: 22, fontWeight: 700, color: "var(--color-primary)" }}>
                          {brandAnalytics.total_emails}
                        </div>
                        <div style={{ fontSize: 11, color: "var(--color-tertiary)", fontWeight: 500 }}>
                          Total Emails
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: 22, fontWeight: 700, color: "var(--color-primary)" }}>
                          {typeof brandAnalytics.emails_per_week === "number"
                            ? brandAnalytics.emails_per_week.toFixed(1)
                            : brandAnalytics.emails_per_week}
                        </div>
                        <div style={{ fontSize: 11, color: "var(--color-tertiary)", fontWeight: 500 }}>
                          Per Week
                        </div>
                      </div>
                    </div>

                    {/* Campaign type breakdown */}
                    {Object.keys(brandAnalytics.campaign_breakdown).length > 0 && (
                      <div style={{ marginBottom: 20 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: "var(--color-primary)", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                          Campaign Types
                        </div>
                        {Object.entries(brandAnalytics.campaign_breakdown)
                          .sort(([, a], [, b]) => Number(b) - Number(a))
                          .slice(0, 5)
                          .map(([type, count]) => {
                            const numCount = Number(count);
                            const total = Object.values(brandAnalytics.campaign_breakdown).reduce((a, b) => Number(a) + Number(b), 0) as number;
                            const pct = total > 0 ? Math.round((numCount / total) * 100) : 0;
                            return (
                              <div key={type} style={{ marginBottom: 8 }}>
                                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                                  <span style={{ color: "var(--color-secondary)" }}>{type}</span>
                                  <span style={{ color: "var(--color-tertiary)", fontWeight: 500 }}>{pct}%</span>
                                </div>
                                <div style={{ height: 4, borderRadius: 2, background: "var(--color-surface)" }}>
                                  <div style={{
                                    height: "100%", borderRadius: 2,
                                    background: "var(--color-accent)",
                                    width: `${pct}%`,
                                    transition: "width 0.6s ease",
                                  }} />
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    )}
                  </>
                ) : brandAnalytics && (
                  <div style={{
                    padding: "16px 0",
                    borderTop: "1px solid var(--color-border)",
                    textAlign: "center",
                  }}>
                    <p style={{ fontSize: 13, color: "var(--color-secondary)", margin: "0 0 12px" }}>
                      Sign up free to see brand analytics
                    </p>
                    <Link
                      href="/signup"
                      style={{
                        display: "inline-block",
                        fontSize: 13,
                        fontWeight: 500,
                        color: "white",
                        background: "var(--color-accent)",
                        textDecoration: "none",
                        padding: "8px 20px",
                        borderRadius: 8,
                      }}
                    >
                      Sign up free
                    </Link>
                  </div>
                )}

                {/* View all from brand */}
                <Button
                  href={`/browse?brand=${encodeURIComponent(email.brand)}`}
                  variant="secondary"
                  size="sm"
                  fullWidth
                >
                  View all from {email.brand}
                </Button>
              </div>
            )}
          </aside>
        </div>

        {/* More from Brand */}
        {brandEmails.length > 0 && (
          <section style={{ marginTop: 48 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ fontSize: 20, fontWeight: 600, color: "var(--color-primary)", margin: 0 }}>
                More from {email.brand}
              </h2>
              <Link
                href={`/browse?brand=${encodeURIComponent(email.brand || "")}`}
                style={{ fontSize: 13, fontWeight: 500, color: "var(--color-accent)", textDecoration: "none" }}
              >
                View all →
              </Link>
            </div>
            <div className="horizontal-scroll" style={{ padding: "4px 0" }}>
              {brandEmails.map((e) => (
                <MiniEmailCard key={e.id} email={e} />
              ))}
            </div>
          </section>
        )}

        {/* Similar Campaigns */}
        {similarEmails.length > 0 && (
          <section style={{ marginTop: 48 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ fontSize: 20, fontWeight: 600, color: "var(--color-primary)", margin: 0 }}>
                Similar {email.type} campaigns
              </h2>
              <Link
                href={`/browse?type=${encodeURIComponent(email.type || "")}`}
                style={{ fontSize: 13, fontWeight: 500, color: "var(--color-accent)", textDecoration: "none" }}
              >
                View all →
              </Link>
            </div>
            <div className="horizontal-scroll" style={{ padding: "4px 0" }}>
              {similarEmails.map((e) => (
                <MiniEmailCard key={e.id} email={e} />
              ))}
            </div>
          </section>
        )}

        {/* Bottom spacing */}
        <div style={{ height: 48 }} />
      </main>
    </div>
  );
}

// Mini email card for related sections
function MiniEmailCard({ email }: { email: RelatedEmail }) {
  const formatDate = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;
    return d.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
  };

  return (
    <Link
      href={`/email/${email.id}`}
      className="scroll-card"
      style={{
        width: 280, minWidth: 280,
        background: "white",
        borderRadius: 14,
        border: "1px solid var(--color-border)",
        padding: 20,
        textDecoration: "none",
        color: "inherit",
        transition: "transform 200ms ease, box-shadow 200ms ease",
        display: "block",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* Brand + Date */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: "var(--color-accent-light)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontWeight: 600, fontSize: 12, color: "var(--color-accent)", flexShrink: 0,
        }}>
          {email.brand?.[0]?.toUpperCase() || "?"}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--color-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {email.brand || "Unknown"}
          </div>
          <div style={{ fontSize: 11, color: "var(--color-tertiary)" }}>
            {formatDate(email.received_at)}
          </div>
        </div>
        {email.type && (
          <span style={{
            background: "var(--color-surface)", color: "var(--color-secondary)",
            fontSize: 10, fontWeight: 500, padding: "3px 8px", borderRadius: 4,
          }}>
            {email.type}
          </span>
        )}
      </div>

      {/* Subject */}
      <div style={{
        fontSize: 14, fontWeight: 500,
        color: "var(--color-primary)", lineHeight: 1.4,
        overflow: "hidden", textOverflow: "ellipsis",
        display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
      }}>
        {email.subject}
      </div>
    </Link>
  );
}

// Header
// Header is now imported from shared component
