"use client";

import { useEffect, useState, useRef, useCallback } from "react";
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

const FREE_EMAIL_VIEW_LIMIT = 10;
const VIEW_STORAGE_KEY = "mailmuse_email_views";

function getViewedEmailIds(): number[] {
  try {
    const raw = localStorage.getItem(VIEW_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function recordEmailView(emailId: number): number {
  const viewed = getViewedEmailIds();
  if (!viewed.includes(emailId)) {
    viewed.push(emailId);
    try { localStorage.setItem(VIEW_STORAGE_KEY, JSON.stringify(viewed)); } catch {}
  }
  return viewed.length;
}

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
  const [viewLimitReached, setViewLimitReached] = useState(false);
  const [analysisScore, setAnalysisScore] = useState<number | null>(null);
  const [analysisGrade, setAnalysisGrade] = useState<string | null>(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const analysisTriggerRef = useRef<(() => void) | null>(null);
  const { user } = useAuth();
  const { isBookmarked, toggleBookmark } = useBookmarks();

  const handleAnalysisResult = useCallback((score: number, grade: string) => {
    setAnalysisScore(score);
    setAnalysisGrade(grade);
  }, []);

  const base = process.env.NEXT_PUBLIC_API_BASE_URL || "https://milled-india-api.onrender.com";

  // Check free view limit on mount
  useEffect(() => {
    if (!id) return;
    const isFreeUser = !user || user.effective_plan === "free";
    if (isFreeUser) {
      const viewCount = recordEmailView(Number(id));
      if (viewCount > FREE_EMAIL_VIEW_LIMIT) {
        // Already viewed IDs include this one but we exceeded the limit
        // Check if this specific email was viewed before the limit
        const viewed = getViewedEmailIds();
        const idx = viewed.indexOf(Number(id));
        if (idx >= FREE_EMAIL_VIEW_LIMIT) {
          setViewLimitReached(true);
          setLoading(false);
          return;
        }
      }
    }
  }, [id, user]);

  useEffect(() => {
    if (!id || viewLimitReached) return;
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
  }, [id, base, viewLimitReached]);

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

  // Free view limit gate
  if (viewLimitReached) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "var(--color-surface)" }}>
        <Header />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh", padding: 40 }}>
          <div style={{ textAlign: "center", maxWidth: 440 }}>
            <div style={{
              width: 56, height: 56, borderRadius: 14,
              background: "var(--color-accent-light)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 20px",
            }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
            </div>
            <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 12, color: "var(--color-primary)" }}>
              {!user ? "Free preview limit reached" : "Upgrade to view more emails"}
            </h1>
            <p style={{ fontSize: 15, color: "var(--color-secondary)", marginBottom: 8, lineHeight: 1.6 }}>
              {!user
                ? `You've previewed ${FREE_EMAIL_VIEW_LIMIT} emails. Sign up for a free account to continue browsing.`
                : `You've reached the ${FREE_EMAIL_VIEW_LIMIT} email view limit on the Free plan. Upgrade to unlock more.`}
            </p>
            <p style={{ fontSize: 13, color: "var(--color-tertiary)", marginBottom: 24 }}>
              Free accounts get 20 email views per day
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              {!user ? (
                <>
                  <Link href="/signup" style={{
                    fontSize: 15, fontWeight: 600, color: "white",
                    background: "var(--color-accent)", textDecoration: "none",
                    padding: "12px 28px", borderRadius: 10,
                  }}>
                    Sign up free
                  </Link>
                  <Link href="/login" style={{
                    fontSize: 15, fontWeight: 600, color: "var(--color-secondary)",
                    textDecoration: "none", padding: "12px 28px", borderRadius: 10,
                    border: "1px solid var(--color-border)",
                  }}>
                    Log in
                  </Link>
                </>
              ) : (
                <Link href="/pricing" style={{
                  fontSize: 15, fontWeight: 600, color: "white",
                  background: "var(--color-accent)", textDecoration: "none",
                  padding: "12px 28px", borderRadius: 10,
                }}>
                  View Plans
                </Link>
              )}
            </div>
            <div style={{ marginTop: 20 }}>
              <Link href="/browse" style={{ fontSize: 13, color: "var(--color-accent)", textDecoration: "none" }}>
                Back to Browse
              </Link>
            </div>
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

  const formattedDate = new Date(email.received_at).toLocaleDateString("en-IN", {
    weekday: "short", month: "short", day: "numeric", year: "numeric",
  });

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--color-surface)" }}>
      <Header />

      <main style={{ maxWidth: 1280, margin: "0 auto", padding: "24px 24px 64px" }}>
        {/* Back nav */}
        <Link
          href="/browse"
          className="back-link"
          style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            fontSize: 13, fontWeight: 500, color: "var(--color-secondary)",
            textDecoration: "none", marginBottom: 20, transition: "color 150ms ease",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back to Browse
        </Link>

        {/* Full-width header area */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "16px 16px 0 0",
          border: "1px solid var(--color-border)",
          borderBottom: "none",
          padding: "28px 32px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        }}>
          {/* Subject line */}
          <h1 style={{
            margin: "0 0 16px",
            fontFamily: "var(--font-bricolage)",
            fontSize: "clamp(24px, 3.5vw, 32px)",
            fontWeight: 400,
            color: "var(--color-primary)",
            lineHeight: 1.3,
          }}>
            {email.subject}
          </h1>

          {/* Badges + date row */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            flexWrap: "wrap", gap: 8, marginBottom: 12,
          }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
              {email.brand && (
                <Link href={`/browse?brand=${encodeURIComponent(email.brand)}`} style={{ textDecoration: "none" }}>
                  <Badge variant="accent" size="md">{email.brand}</Badge>
                </Link>
              )}
              {email.category && <Badge variant="default" size="sm">{email.category}</Badge>}
              {email.type && <Badge variant="default" size="sm">{email.type}</Badge>}
            </div>
            <time style={{ fontSize: 13, color: "var(--color-tertiary)", fontWeight: 500 }}>
              {formattedDate}
            </time>
          </div>

          {/* Sender + small actions */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
            {email.sender && (
              <span style={{ fontSize: 13, color: "var(--color-secondary)" }}>
                From: <span style={{ fontWeight: 500, color: "var(--color-primary)" }}>{email.sender}</span>
              </span>
            )}
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={copySubject}
                title="Copy subject line"
                className="email-action-btn"
                style={{
                  background: copied ? "#dcfce7" : "var(--color-surface)",
                  border: `1px solid ${copied ? "#86efac" : "var(--color-border)"}`,
                  borderRadius: 8, padding: "6px 12px",
                  cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 5,
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
                  className="email-action-btn"
                  style={{
                    background: isBookmarked(Number(id)) ? "#fef2f2" : "var(--color-surface)",
                    border: `1px solid ${isBookmarked(Number(id)) ? "#fecaca" : "var(--color-border)"}`,
                    borderRadius: 8, padding: "6px 12px",
                    cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 5,
                    fontSize: 12, fontWeight: 500,
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
            </div>
          </div>
        </div>

        {/* Feature action bar */}
        <div className="feature-action-bar" style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
          margin: "16px 0",
        }}>
          {/* AI Teardown Card */}
          <div style={{
            background: "#FEF7F3",
            borderRadius: 12,
            padding: 20,
            borderLeft: "3px solid #C2714A",
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: "#F5E1D5",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C2714A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#44403C" }}>
                  AI Email Teardown
                </div>
                <div style={{ fontSize: 12, color: "#78716C", lineHeight: 1.4 }}>
                  Get AI scores across 5 dimensions — Subject, Copy, CTA, Design & Strategy
                </div>
              </div>
            </div>
            {analysisScore !== null && analysisGrade !== null ? (
              <button
                onClick={() => {
                  const el = document.querySelector(".email-sidebar");
                  el?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "8px 16px",
                  fontSize: 13, fontWeight: 600,
                  color: analysisScore >= 70 ? "#065f46" : "#92400e",
                  background: analysisScore >= 70 ? "#dcfce7" : "#fef3c7",
                  border: `1px solid ${analysisScore >= 70 ? "#86efac" : "#fde68a"}`,
                  borderRadius: 8,
                  cursor: "pointer",
                  transition: "all 150ms ease",
                  alignSelf: "flex-start",
                }}
              >
                <span style={{ fontWeight: 800 }}>{analysisGrade}</span>
                Score: {analysisScore}/100 — View Full Teardown
              </button>
            ) : !user ? (
              <a
                href="/signup"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  padding: "8px 16px",
                  fontSize: 13, fontWeight: 600,
                  color: "white",
                  background: "#C2714A",
                  borderRadius: 8,
                  textDecoration: "none",
                  alignSelf: "flex-start",
                  transition: "all 150ms ease",
                }}
              >
                Sign up to unlock
              </a>
            ) : (
              <button
                onClick={() => analysisTriggerRef.current?.()}
                disabled={analysisLoading}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  padding: "8px 16px",
                  fontSize: 13, fontWeight: 600,
                  color: "white",
                  background: "#C2714A",
                  border: "none",
                  borderRadius: 8,
                  cursor: analysisLoading ? "wait" : "pointer",
                  alignSelf: "flex-start",
                  transition: "all 150ms ease",
                  opacity: analysisLoading ? 0.7 : 1,
                }}
              >
                {analysisLoading ? (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: "spin 1s linear infinite" }}>
                      <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                      <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
                    </svg>
                    Analyzing...
                  </>
                ) : (
                  "Analyze This Email"
                )}
              </button>
            )}
          </div>

          {/* Template Editor Card */}
          <div style={{
            background: "#EFF6FF",
            borderRadius: 12,
            padding: 20,
            borderLeft: "3px solid #3B82F6",
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: "#DBEAFE",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#1E3A5F" }}>
                  Use as Template
                </div>
                <div style={{ fontSize: 12, color: "#64748B", lineHeight: 1.4 }}>
                  Open in drag-and-drop editor — change text, images, colors and export production-ready HTML
                </div>
              </div>
            </div>
            <a
              href={`/editor?id=${id}`}
              style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                padding: "8px 16px",
                fontSize: 13, fontWeight: 600,
                color: "white",
                background: "#3B82F6",
                borderRadius: 8,
                textDecoration: "none",
                alignSelf: "flex-start",
                transition: "all 150ms ease",
              }}
            >
              Open Editor
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" />
                <path d="M12 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>

        {/* 2-column grid: email preview + sidebar */}
        <div className="email-grid" style={{
          display: "grid",
          gridTemplateColumns: "1fr 340px",
          gap: 0,
          alignItems: "start",
        }}>
          {/* Left: Email preview */}
          <div style={{
            backgroundColor: "white",
            borderRadius: "0 0 0 16px",
            border: "1px solid var(--color-border)",
            borderTop: "1px solid var(--color-border)",
            overflow: "hidden",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          }}>
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
                sandbox="allow-same-origin allow-popups"
              />
            </div>
          </div>

          {/* Right: Sidebar */}
          <aside className="email-sidebar" style={{ position: "sticky", top: 80 }}>
            <div style={{
              backgroundColor: "white",
              borderRadius: "0 0 16px 0",
              border: "1px solid var(--color-border)",
              borderLeft: "none",
              borderTop: "1px solid var(--color-border)",
              overflow: "hidden",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            }}>
              {/* Brand card */}
              {email.brand && (
                <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid var(--color-border)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
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
                      {email.industry && (
                        <div style={{ fontSize: 12, color: "var(--color-tertiary)" }}>
                          {email.industry}
                        </div>
                      )}
                    </div>
                  </div>
                  <Link
                    href={`/browse?brand=${encodeURIComponent(email.brand)}`}
                    style={{
                      display: "block", textAlign: "center",
                      fontSize: 13, fontWeight: 500, color: "var(--color-accent)",
                      textDecoration: "none", padding: "8px 0",
                      borderRadius: 8, background: "var(--color-surface)",
                      transition: "all 150ms ease",
                    }}
                  >
                    View all from {email.brand} →
                  </Link>
                </div>
              )}

              {/* Actions */}
              <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--color-border)" }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: "var(--color-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 12 }}>
                  Actions
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <Link
                    href={`/editor?id=${id}`}
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                      padding: "10px 16px",
                      fontSize: 13, fontWeight: 600,
                      color: "white",
                      background: "var(--color-accent)",
                      borderRadius: 10,
                      textDecoration: "none",
                      transition: "all 150ms ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-accent-hover)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "var(--color-accent)")}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                    Use as Template
                  </Link>
                  <div className="sidebar-generate-btn">
                    <GenerateButton
                      emailId={email.id}
                      emailSubject={email.subject}
                      emailBrand={email.brand}
                    />
                  </div>
                </div>
              </div>

              {/* Analysis */}
              <div style={{ padding: "16px 20px", borderBottom: (brandEmails.length > 0 || similarEmails.length > 0) ? "1px solid var(--color-border)" : "none" }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: "var(--color-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>
                  Email Teardown by AI
                </div>
                <AnalysisPanel
                  emailId={email.id}
                  triggerRef={analysisTriggerRef}
                  onResult={handleAnalysisResult}
                  onLoading={setAnalysisLoading}
                />
              </div>

              {/* More from Brand */}
              {brandEmails.length > 0 && (
                <div style={{ padding: "16px 20px", borderBottom: similarEmails.length > 0 ? "1px solid var(--color-border)" : "none" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: "var(--color-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      More from {email.brand}
                    </div>
                    <Link
                      href={`/browse?brand=${encodeURIComponent(email.brand || "")}`}
                      style={{ fontSize: 11, fontWeight: 500, color: "var(--color-accent)", textDecoration: "none" }}
                    >
                      View all →
                    </Link>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {brandEmails.map((e) => (
                      <SidebarEmailCard key={e.id} email={e} />
                    ))}
                  </div>
                </div>
              )}

              {/* Similar Campaigns */}
              {similarEmails.length > 0 && (
                <div style={{ padding: "16px 20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: "var(--color-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      Similar {email.type}
                    </div>
                    <Link
                      href={`/browse?type=${encodeURIComponent(email.type || "")}`}
                      style={{ fontSize: 11, fontWeight: 500, color: "var(--color-accent)", textDecoration: "none" }}
                    >
                      View all →
                    </Link>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {similarEmails.map((e) => (
                      <SidebarEmailCard key={e.id} email={e} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </main>

      <style>{`
        .back-link:hover { color: var(--color-accent) !important; }
        .email-action-btn:hover {
          border-color: var(--color-accent) !important;
          color: var(--color-accent) !important;
        }
        .sidebar-generate-btn > button {
          width: 100% !important;
          justify-content: center !important;
          padding: 10px 16px !important;
          font-size: 13px !important;
          border-radius: 10px !important;
        }
        @media (max-width: 868px) {
          .feature-action-bar {
            grid-template-columns: 1fr !important;
          }
          .email-grid {
            grid-template-columns: 1fr !important;
          }
          .email-sidebar {
            position: static !important;
          }
        }
      `}</style>
    </div>
  );
}

function SidebarEmailCard({ email }: { email: RelatedEmail }) {
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
      className="sidebar-email-card"
      style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "10px 12px",
        borderRadius: 8,
        textDecoration: "none", color: "inherit",
        transition: "background 150ms ease",
      }}
    >
      <div style={{
        width: 30, height: 30, borderRadius: 8, flexShrink: 0,
        background: "var(--color-accent-light)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontWeight: 600, fontSize: 11, color: "var(--color-accent)",
      }}>
        {email.brand?.[0]?.toUpperCase() || "?"}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 13, fontWeight: 500, color: "var(--color-primary)", lineHeight: 1.3,
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        }}>
          {email.subject}
        </div>
        <div style={{ fontSize: 11, color: "var(--color-tertiary)", marginTop: 2 }}>
          {email.brand || "Unknown"} &middot; {formatDate(email.received_at)}
        </div>
      </div>
    </Link>
  );
}
