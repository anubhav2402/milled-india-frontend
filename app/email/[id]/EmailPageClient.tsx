"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Badge from "../../components/Badge";
import Button from "../../components/Button";
import Header from "../../components/Header";
import { useAuth } from "../../context/AuthContext";
import { useBookmarks } from "../../hooks/useBookmarks";
import AnalysisPanel from "../../components/AnalysisPanel";
import GenerateButton from "../../components/GenerateButton";

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

function analyzeSubject(subject: string) {
  const charCount = subject.length;
  const wordCount = subject.split(/\s+/).filter(Boolean).length;
  const emojiRegex = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE00}-\u{FE0F}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{200D}\u{20E3}]/gu;
  const hasEmoji = emojiRegex.test(subject);
  const hasQuestion = subject.includes("?");
  const hasNumber = /\d/.test(subject);
  return { charCount, wordCount, hasEmoji, hasQuestion, hasNumber };
}

const CopyIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
  const [brandEmails, setBrandEmails] = useState<RelatedEmail[]>([]);
  const [similarEmails, setSimilarEmails] = useState<RelatedEmail[]>([]);
  const { user } = useAuth();
  const { isBookmarked, toggleBookmark } = useBookmarks();

  const base = process.env.NEXT_PUBLIC_API_BASE_URL || "https://milled-india-api.onrender.com";

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

  useEffect(() => {
    if (!email || !base) return;

    if (email.brand) {
      fetch(`${base}/emails?brand=${encodeURIComponent(email.brand)}&limit=5`)
        .then((r) => (r.ok ? r.json() : []))
        .then((data: RelatedEmail[]) => setBrandEmails(data.filter((e) => e.id !== email.id).slice(0, 4)))
        .catch(() => {});
    }

    if (email.type) {
      fetch(`${base}/emails?type=${encodeURIComponent(email.type)}&limit=5`)
        .then((r) => (r.ok ? r.json() : []))
        .then((data: RelatedEmail[]) => setSimilarEmails(data.filter((e) => e.id !== email.id).slice(0, 4)))
        .catch(() => {});
    }
  }, [email, base]);

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
  const formattedDate = new Date(email.received_at).toLocaleDateString("en-IN", {
    weekday: "short", month: "short", day: "numeric", year: "numeric",
  });

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--color-surface)" }}>
      <Header />

      <main style={{ maxWidth: 900, margin: "0 auto", padding: "24px 24px 64px" }}>
        {/* Back nav */}
        <Link
          href="/browse"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontSize: 13,
            fontWeight: 500,
            color: "var(--color-secondary)",
            textDecoration: "none",
            marginBottom: 20,
            transition: "color 150ms ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-accent)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-secondary)")}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back to Browse
        </Link>

        {/* Email card */}
        <div style={{
          backgroundColor: "white",
          borderRadius: 16,
          border: "1px solid var(--color-border)",
          overflow: "hidden",
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        }}>
          {/* Header section */}
          <div style={{ padding: "28px 32px 0" }}>
            {/* Top row: badges + date */}
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 8,
              marginBottom: 20,
            }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
                {email.brand && (
                  <Link href={`/browse?brand=${encodeURIComponent(email.brand)}`} style={{ textDecoration: "none" }}>
                    <Badge variant="accent" size="md">{email.brand}</Badge>
                  </Link>
                )}
                {email.industry && <Badge variant="default" size="sm">{email.industry}</Badge>}
                {email.type && <Badge variant="default" size="sm">{email.type}</Badge>}
                {email.category && <Badge variant="default" size="sm">{email.category}</Badge>}
              </div>
              <time style={{ fontSize: 13, color: "var(--color-tertiary)", fontWeight: 500 }}>
                {formattedDate}
              </time>
            </div>

            {/* Sender */}
            {email.sender && (
              <div style={{ fontSize: 13, color: "var(--color-secondary)", marginBottom: 12 }}>
                From: <span style={{ fontWeight: 500, color: "var(--color-primary)" }}>{email.sender}</span>
              </div>
            )}

            {/* Subject line */}
            <h1 style={{
              margin: "0 0 20px",
              fontFamily: "var(--font-dm-serif)",
              fontSize: "clamp(24px, 3.5vw, 32px)",
              fontWeight: 400,
              color: "var(--color-primary)",
              lineHeight: 1.3,
            }}>
              {email.subject}
            </h1>

            {/* Action toolbar */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              flexWrap: "wrap",
              paddingBottom: 20,
              borderBottom: "1px solid var(--color-border)",
            }}>
              <button
                onClick={copySubject}
                title="Copy subject line"
                className="email-action-btn"
                style={{
                  background: copied ? "#dcfce7" : "var(--color-surface)",
                  border: `1px solid ${copied ? "#86efac" : "var(--color-border)"}`,
                  borderRadius: 8, padding: "8px 14px",
                  cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6,
                  fontSize: 13, fontWeight: 500,
                  color: copied ? "#16a34a" : "var(--color-secondary)",
                  transition: "all 150ms ease",
                }}
              >
                {copied ? <CheckIcon /> : <CopyIcon />}
                {copied ? "Copied!" : "Copy Subject"}
              </button>

              {user && (
                <button
                  onClick={() => toggleBookmark(Number(id))}
                  title={isBookmarked(Number(id)) ? "Remove bookmark" : "Bookmark email"}
                  className="email-action-btn"
                  style={{
                    background: isBookmarked(Number(id)) ? "#fef2f2" : "var(--color-surface)",
                    border: `1px solid ${isBookmarked(Number(id)) ? "#fecaca" : "var(--color-border)"}`,
                    borderRadius: 8, padding: "8px 14px",
                    cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6,
                    fontSize: 13, fontWeight: 500,
                    color: isBookmarked(Number(id)) ? "#ef4444" : "var(--color-secondary)",
                    transition: "all 150ms ease",
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill={isBookmarked(Number(id)) ? "#ef4444" : "none"} stroke="currentColor" strokeWidth="2">
                    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                  </svg>
                  {isBookmarked(Number(id)) ? "Saved" : "Save"}
                </button>
              )}

              <Link
                href={`/editor?id=${id}`}
                className="email-action-btn"
                style={{
                  background: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                  borderRadius: 8, padding: "8px 14px",
                  cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6,
                  fontSize: 13, fontWeight: 500,
                  color: "var(--color-secondary)",
                  textDecoration: "none",
                  transition: "all 150ms ease",
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                Use as Template
              </Link>

              <GenerateButton
                emailId={email.id}
                emailSubject={email.subject}
                emailBrand={email.brand}
              />

              {/* Spacer pushes brand link to right */}
              <div style={{ flex: 1 }} />

              {email.brand && (
                <Link
                  href={`/browse?brand=${encodeURIComponent(email.brand)}`}
                  style={{
                    fontSize: 13,
                    fontWeight: 500,
                    color: "var(--color-accent)",
                    textDecoration: "none",
                    whiteSpace: "nowrap",
                  }}
                >
                  All from {email.brand} →
                </Link>
              )}
            </div>
          </div>

          {/* Subject analysis + analysis panel */}
          <div style={{ padding: "16px 32px 20px" }}>
            <div style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: 12,
              padding: "10px 16px",
              background: "var(--color-surface)",
              borderRadius: 10,
              fontSize: 12,
              color: "var(--color-secondary)",
              fontWeight: 500,
            }}>
              <span>{subjectAnalysis.charCount} characters</span>
              <span style={{ color: "var(--color-border)" }}>|</span>
              <span>{subjectAnalysis.wordCount} words</span>
              {subjectAnalysis.hasEmoji && (
                <>
                  <span style={{ color: "var(--color-border)" }}>|</span>
                  <span style={{ color: "#92400e" }}>Has emoji</span>
                </>
              )}
              {subjectAnalysis.hasQuestion && (
                <>
                  <span style={{ color: "var(--color-border)" }}>|</span>
                  <span style={{ color: "#1e40af" }}>Question format</span>
                </>
              )}
              {subjectAnalysis.hasNumber && (
                <>
                  <span style={{ color: "var(--color-border)" }}>|</span>
                  <span style={{ color: "#065f46" }}>Contains numbers</span>
                </>
              )}
            </div>

            <AnalysisPanel emailId={email.id} />
          </div>

          {/* Email body */}
          <div style={{
            backgroundColor: "var(--color-surface)",
            borderTop: "1px solid var(--color-border)",
            padding: "20px 0",
          }}>
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

        {/* Related emails section */}
        {(brandEmails.length > 0 || similarEmails.length > 0) && (
          <div className="related-sections" style={{
            display: "grid",
            gridTemplateColumns: brandEmails.length > 0 && similarEmails.length > 0 ? "1fr 1fr" : "1fr",
            gap: 32,
            marginTop: 48,
          }}>
            {/* More from Brand */}
            {brandEmails.length > 0 && (
              <section>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <h2 style={{ fontSize: 18, fontWeight: 600, color: "var(--color-primary)", margin: 0 }}>
                    More from {email.brand}
                  </h2>
                  <Link
                    href={`/browse?brand=${encodeURIComponent(email.brand || "")}`}
                    style={{ fontSize: 13, fontWeight: 500, color: "var(--color-accent)", textDecoration: "none" }}
                  >
                    View all →
                  </Link>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {brandEmails.map((e) => (
                    <CompactEmailCard key={e.id} email={e} />
                  ))}
                </div>
              </section>
            )}

            {/* Similar Campaigns */}
            {similarEmails.length > 0 && (
              <section>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <h2 style={{ fontSize: 18, fontWeight: 600, color: "var(--color-primary)", margin: 0 }}>
                    Similar {email.type} campaigns
                  </h2>
                  <Link
                    href={`/browse?type=${encodeURIComponent(email.type || "")}`}
                    style={{ fontSize: 13, fontWeight: 500, color: "var(--color-accent)", textDecoration: "none" }}
                  >
                    View all →
                  </Link>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {similarEmails.map((e) => (
                    <CompactEmailCard key={e.id} email={e} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </main>

      <style>{`
        .email-action-btn:hover {
          border-color: var(--color-accent) !important;
          color: var(--color-accent) !important;
        }
        @media (max-width: 640px) {
          .related-sections {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

function CompactEmailCard({ email }: { email: RelatedEmail }) {
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
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "14px 16px",
        background: "white",
        borderRadius: 12,
        border: "1px solid var(--color-border)",
        textDecoration: "none",
        color: "inherit",
        transition: "all 150ms ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--color-accent)";
        e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--color-border)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div style={{
        width: 36, height: 36, borderRadius: 10,
        background: "var(--color-accent-light)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontWeight: 600, fontSize: 13, color: "var(--color-accent)", flexShrink: 0,
      }}>
        {email.brand?.[0]?.toUpperCase() || "?"}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 14, fontWeight: 500,
          color: "var(--color-primary)", lineHeight: 1.4,
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        }}>
          {email.subject}
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 3 }}>
          <span style={{ fontSize: 12, color: "var(--color-secondary)" }}>
            {email.brand || "Unknown"}
          </span>
          <span style={{ fontSize: 10, color: "var(--color-border)" }}>&bull;</span>
          <span style={{ fontSize: 12, color: "var(--color-tertiary)" }}>
            {formatDate(email.received_at)}
          </span>
          {email.type && (
            <>
              <span style={{ fontSize: 10, color: "var(--color-border)" }}>&bull;</span>
              <span style={{ fontSize: 11, color: "var(--color-tertiary)" }}>
                {email.type}
              </span>
            </>
          )}
        </div>
      </div>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-tertiary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </Link>
  );
}
