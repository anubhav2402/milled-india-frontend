"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import Link from "next/link";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://milled-india-api.onrender.com";

type Tweet = {
  id: number;
  content: string;
  tweet_type: string;
  status: string;
  scheduled_for: string | null;
  posted_at: string | null;
  twitter_id: string | null;
  created_at: string | null;
  char_count: number;
};

const TYPE_LABELS: Record<string, string> = {
  daily_digest: "Daily Digest",
  weekly_digest: "Weekly Roundup",
  brand_spotlight: "Brand Spotlight",
  subject_line_insight: "Subject Lines",
};

const STATUS_COLORS: Record<string, string> = {
  draft: "#f59e0b",
  approved: "#3b82f6",
  posted: "#22c55e",
  rejected: "#ef4444",
};

export default function AdminTweetsPage() {
  const { token, user } = useAuth();
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [genType, setGenType] = useState("daily_digest");
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");
  const [posting, setPosting] = useState<number | null>(null);

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const fetchTweets = async () => {
    try {
      const url =
        filter === "all"
          ? `${API_BASE}/admin/tweets`
          : `${API_BASE}/admin/tweets?status=${filter}`;
      const res = await fetch(url, { headers });
      if (res.ok) {
        setTweets(await res.json());
      } else {
        const data = await res.json();
        setError(data.detail || "Failed to load tweets");
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchTweets();
  }, [token, filter]);

  const generateDraft = async () => {
    setGenerating(true);
    setError(null);
    try {
      const res = await fetch(
        `${API_BASE}/admin/tweets/generate?tweet_type=${genType}`,
        { method: "POST", headers }
      );
      if (res.ok) {
        fetchTweets();
      } else {
        try {
          const data = await res.json();
          setError(data.detail || `Generation failed (${res.status})`);
        } catch {
          setError(`Generation failed — server returned ${res.status}`);
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setError(`Network error: ${msg}. Is the backend running?`);
    } finally {
      setGenerating(false);
    }
  };

  const updateStatus = async (id: number, action: string) => {
    try {
      const res = await fetch(`${API_BASE}/admin/tweets/${id}/${action}`, {
        method: "PATCH",
        headers,
      });
      if (res.ok) fetchTweets();
      else {
        const data = await res.json();
        setError(data.detail || `Failed to ${action}`);
      }
    } catch {
      setError("Network error");
    }
  };

  const saveEdit = async (id: number) => {
    try {
      const res = await fetch(`${API_BASE}/admin/tweets/${id}/edit`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({ content: editContent }),
      });
      if (res.ok) {
        setEditingId(null);
        fetchTweets();
      } else {
        const data = await res.json();
        setError(data.detail || "Edit failed");
      }
    } catch {
      setError("Network error");
    }
  };

  const postTweet = async (id: number) => {
    setPosting(id);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/admin/tweets/${id}/post`, {
        method: "POST",
        headers,
      });
      if (res.ok) {
        fetchTweets();
      } else {
        try {
          const data = await res.json();
          setError(data.detail || `Post failed (${res.status})`);
        } catch {
          setError(`Post failed — server returned ${res.status}`);
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setError(`Network error: ${msg}`);
    } finally {
      setPosting(null);
    }
  };

  const deleteTweet = async (id: number) => {
    try {
      const res = await fetch(`${API_BASE}/admin/tweets/${id}`, {
        method: "DELETE",
        headers,
      });
      if (res.ok) fetchTweets();
    } catch {
      setError("Network error");
    }
  };

  if (!user) {
    return (
      <div style={{ padding: 40, textAlign: "center", color: "var(--color-secondary)" }}>
        <p>Please <Link href="/login" style={{ color: "var(--color-accent)" }}>log in</Link> to access the admin panel.</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "var(--color-primary)", margin: 0, fontFamily: "var(--font-dm-serif)" }}>
          Tweet Queue
        </h1>
        <Link href="/browse" style={{ fontSize: 13, color: "var(--color-secondary)", textDecoration: "none" }}>
          Back to app
        </Link>
      </div>

      {/* Error */}
      {error && (
        <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "#991b1b" }}>
          {error}
          <button onClick={() => setError(null)} style={{ float: "right", background: "none", border: "none", cursor: "pointer", color: "#991b1b", fontWeight: 600 }}>x</button>
        </div>
      )}

      {/* Generate section */}
      <div style={{ background: "var(--color-surface, white)", border: "1px solid var(--color-border, #e5e5e5)", borderRadius: 12, padding: 20, marginBottom: 24 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: "var(--color-primary)", marginBottom: 12 }}>
          Generate New Draft
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <select
            value={genType}
            onChange={(e) => setGenType(e.target.value)}
            style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid var(--color-border, #e5e5e5)", fontSize: 14, fontFamily: "var(--font-inter)" }}
          >
            <option value="daily_digest">Daily Digest</option>
            <option value="weekly_digest">Weekly Roundup</option>
            <option value="brand_spotlight">Brand Spotlight</option>
            <option value="subject_line_insight">Subject Line Insight</option>
          </select>
          <button
            onClick={generateDraft}
            disabled={generating}
            style={{ padding: "8px 18px", borderRadius: 8, border: "none", background: "var(--color-accent)", color: "white", fontSize: 14, fontWeight: 600, cursor: generating ? "not-allowed" : "pointer", opacity: generating ? 0.6 : 1 }}
          >
            {generating ? "Generating..." : "Generate Draft"}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {["all", "draft", "approved", "posted", "rejected"].map((s) => (
          <button
            key={s}
            onClick={() => { setFilter(s); setLoading(true); }}
            style={{
              padding: "6px 14px",
              borderRadius: 20,
              border: filter === s ? "none" : "1px solid var(--color-border, #e5e5e5)",
              background: filter === s ? "var(--color-primary)" : "transparent",
              color: filter === s ? "white" : "var(--color-secondary)",
              fontSize: 13,
              fontWeight: 500,
              cursor: "pointer",
              textTransform: "capitalize",
            }}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Tweet list */}
      {loading ? (
        <div style={{ textAlign: "center", padding: 40, color: "var(--color-secondary)" }}>Loading...</div>
      ) : tweets.length === 0 ? (
        <div style={{ textAlign: "center", padding: 40, color: "var(--color-secondary)", fontSize: 14 }}>
          No tweets found. Generate a draft to get started.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {tweets.map((tweet) => (
            <div
              key={tweet.id}
              style={{
                background: "var(--color-surface, white)",
                border: "1px solid var(--color-border, #e5e5e5)",
                borderRadius: 12,
                padding: 18,
                borderLeft: `4px solid ${STATUS_COLORS[tweet.status] || "#ccc"}`,
              }}
            >
              {/* Header row */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, flexWrap: "wrap", gap: 8 }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span style={{
                    fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 4,
                    background: STATUS_COLORS[tweet.status] + "20",
                    color: STATUS_COLORS[tweet.status],
                    textTransform: "uppercase",
                  }}>
                    {tweet.status}
                  </span>
                  <span style={{ fontSize: 11, fontWeight: 500, padding: "3px 8px", borderRadius: 4, background: "var(--color-accent-light, #f5e6dc)", color: "var(--color-accent)" }}>
                    {TYPE_LABELS[tweet.tweet_type] || tweet.tweet_type}
                  </span>
                </div>
                <div style={{ fontSize: 11, color: "var(--color-muted, #999)" }}>
                  {tweet.created_at ? new Date(tweet.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : ""}
                </div>
              </div>

              {/* Content */}
              {editingId === tweet.id ? (
                <div style={{ marginBottom: 12 }}>
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    maxLength={280}
                    style={{
                      width: "100%", padding: 12, borderRadius: 8,
                      border: "1px solid var(--color-border, #e5e5e5)",
                      fontSize: 14, fontFamily: "var(--font-inter)",
                      resize: "vertical", minHeight: 80, boxSizing: "border-box",
                    }}
                  />
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6 }}>
                    <span style={{ fontSize: 12, color: editContent.length > 280 ? "#ef4444" : "var(--color-secondary)" }}>
                      {editContent.length}/280
                    </span>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={() => setEditingId(null)} style={{ padding: "6px 12px", borderRadius: 6, border: "1px solid var(--color-border)", background: "transparent", fontSize: 12, cursor: "pointer" }}>
                        Cancel
                      </button>
                      <button
                        onClick={() => saveEdit(tweet.id)}
                        disabled={editContent.length > 280 || editContent.trim() === ""}
                        style={{ padding: "6px 12px", borderRadius: 6, border: "none", background: "var(--color-accent)", color: "white", fontSize: 12, fontWeight: 600, cursor: "pointer" }}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <p style={{ fontSize: 14, color: "var(--color-primary)", lineHeight: 1.6, margin: "0 0 12px", whiteSpace: "pre-wrap" }}>
                  {tweet.content}
                </p>
              )}

              {/* Char count + posted info */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <span style={{ fontSize: 11, color: tweet.char_count > 280 ? "#ef4444" : "var(--color-muted, #999)" }}>
                  {tweet.char_count}/280 chars
                </span>
                {tweet.twitter_id && (
                  <a
                    href={`https://x.com/i/status/${tweet.twitter_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: 11, color: "var(--color-accent)", textDecoration: "none" }}
                  >
                    View on X
                  </a>
                )}
              </div>

              {/* Actions */}
              {tweet.status !== "posted" && editingId !== tweet.id && (
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {tweet.status === "draft" && (
                    <>
                      <button onClick={() => updateStatus(tweet.id, "approve")} style={{ padding: "6px 14px", borderRadius: 6, border: "none", background: "#3b82f6", color: "white", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                        Approve
                      </button>
                      <button onClick={() => { setEditingId(tweet.id); setEditContent(tweet.content); }} style={{ padding: "6px 14px", borderRadius: 6, border: "1px solid var(--color-border)", background: "transparent", fontSize: 12, cursor: "pointer" }}>
                        Edit
                      </button>
                      <button onClick={() => updateStatus(tweet.id, "reject")} style={{ padding: "6px 14px", borderRadius: 6, border: "1px solid #fecaca", background: "transparent", color: "#ef4444", fontSize: 12, cursor: "pointer" }}>
                        Reject
                      </button>
                    </>
                  )}
                  {tweet.status === "approved" && (
                    <button
                      onClick={() => postTweet(tweet.id)}
                      disabled={posting === tweet.id}
                      style={{ padding: "6px 14px", borderRadius: 6, border: "none", background: "#22c55e", color: "white", fontSize: 12, fontWeight: 600, cursor: posting === tweet.id ? "not-allowed" : "pointer", opacity: posting === tweet.id ? 0.6 : 1 }}
                    >
                      {posting === tweet.id ? "Posting..." : "Post to X"}
                    </button>
                  )}
                  {tweet.status === "rejected" && (
                    <button onClick={() => updateStatus(tweet.id, "approve")} style={{ padding: "6px 14px", borderRadius: 6, border: "1px solid var(--color-border)", background: "transparent", fontSize: 12, cursor: "pointer" }}>
                      Re-approve
                    </button>
                  )}
                  <button onClick={() => deleteTweet(tweet.id)} style={{ padding: "6px 14px", borderRadius: 6, border: "1px solid #fecaca", background: "transparent", color: "#ef4444", fontSize: 12, cursor: "pointer" }}>
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
