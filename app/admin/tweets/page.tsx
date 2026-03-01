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
  thread_id: string | null;
  thread_order: number | null;
  created_at: string | null;
  char_count: number;
};

const TYPE_LABELS: Record<string, string> = {
  daily_digest: "Daily Digest",
  weekly_digest: "Weekly Roundup",
  brand_spotlight: "Brand Spotlight",
  subject_line_insight: "Subject Lines",
  viral_thread: "Viral Thread",
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
  const [postingThread, setPostingThread] = useState<string | null>(null);

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

  const postThread = async (threadId: string) => {
    setPostingThread(threadId);
    setError(null);
    try {
      const res = await fetch(
        `${API_BASE}/admin/tweets/thread/${threadId}/post`,
        { method: "POST", headers }
      );
      if (res.ok) {
        fetchTweets();
      } else {
        try {
          const data = await res.json();
          setError(data.detail || `Thread post failed (${res.status})`);
        } catch {
          setError(`Thread post failed — server returned ${res.status}`);
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setError(`Network error: ${msg}`);
    } finally {
      setPostingThread(null);
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

  // Approve all tweets in a thread at once
  const approveThread = async (threadId: string) => {
    const threadTweets = tweets.filter((t) => t.thread_id === threadId && t.status === "draft");
    for (const t of threadTweets) {
      await updateStatus(t.id, "approve");
    }
  };

  // Group tweets: threads grouped together, standalone tweets as-is
  const groupedTweets = (() => {
    const threadMap = new Map<string, Tweet[]>();
    const standalone: Tweet[] = [];

    for (const t of tweets) {
      if (t.thread_id) {
        const existing = threadMap.get(t.thread_id) || [];
        existing.push(t);
        threadMap.set(t.thread_id, existing);
      } else {
        standalone.push(t);
      }
    }

    // Sort thread tweets by thread_order
    for (const [, threadTweets] of threadMap) {
      threadTweets.sort((a, b) => (a.thread_order ?? 0) - (b.thread_order ?? 0));
    }

    // Build display list: threads first, then standalone
    const items: Array<{ type: "thread"; threadId: string; tweets: Tweet[] } | { type: "single"; tweet: Tweet }> = [];

    for (const [threadId, threadTweets] of threadMap) {
      items.push({ type: "thread", threadId, tweets: threadTweets });
    }
    for (const t of standalone) {
      items.push({ type: "single", tweet: t });
    }

    return items;
  })();

  const renderTweetCard = (tweet: Tweet, threadIndex?: number) => (
    <div
      key={tweet.id}
      style={{
        background: "var(--color-surface, white)",
        border: "1px solid var(--color-border, #e5e5e5)",
        borderRadius: threadIndex !== undefined ? 8 : 12,
        padding: threadIndex !== undefined ? 14 : 18,
        borderLeft: `4px solid ${STATUS_COLORS[tweet.status] || "#ccc"}`,
      }}
    >
      {/* Header row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, flexWrap: "wrap", gap: 8 }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {threadIndex !== undefined && (
            <span style={{ fontSize: 11, fontWeight: 700, color: "var(--color-muted, #999)", minWidth: 22 }}>
              {threadIndex + 1}/
            </span>
          )}
          <span style={{
            fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 4,
            background: STATUS_COLORS[tweet.status] + "20",
            color: STATUS_COLORS[tweet.status],
            textTransform: "uppercase",
          }}>
            {tweet.status}
          </span>
          {threadIndex === undefined && (
            <span style={{ fontSize: 11, fontWeight: 500, padding: "3px 8px", borderRadius: 4, background: "var(--color-accent-light, #f5e6dc)", color: "var(--color-accent)" }}>
              {TYPE_LABELS[tweet.tweet_type] || tweet.tweet_type}
            </span>
          )}
        </div>
        <div style={{ fontSize: 11, color: "var(--color-muted, #999)" }}>
          {tweet.char_count}/280
          {tweet.created_at && threadIndex === undefined
            ? ` · ${new Date(tweet.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}`
            : ""}
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
        <p style={{ fontSize: 14, color: "var(--color-primary)", lineHeight: 1.6, margin: "0 0 8px", whiteSpace: "pre-wrap" }}>
          {tweet.content}
        </p>
      )}

      {/* Posted link */}
      {tweet.twitter_id && (
        <a
          href={`https://x.com/i/status/${tweet.twitter_id}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontSize: 11, color: "var(--color-accent)", textDecoration: "none", display: "inline-block", marginBottom: 8 }}
        >
          View on X
        </a>
      )}

      {/* Individual tweet actions */}
      {tweet.status !== "posted" && editingId !== tweet.id && (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 4 }}>
          <button onClick={() => { setEditingId(tweet.id); setEditContent(tweet.content); }} style={{ padding: "4px 10px", borderRadius: 6, border: "1px solid var(--color-border)", background: "transparent", fontSize: 11, cursor: "pointer" }}>
            Edit
          </button>
          <button onClick={() => deleteTweet(tweet.id)} style={{ padding: "4px 10px", borderRadius: 6, border: "1px solid #fecaca", background: "transparent", color: "#ef4444", fontSize: 11, cursor: "pointer" }}>
            Delete
          </button>
        </div>
      )}
    </div>
  );

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
            <option value="viral_thread">Viral Thread</option>
          </select>
          <button
            onClick={generateDraft}
            disabled={generating}
            style={{ padding: "8px 18px", borderRadius: 8, border: "none", background: genType === "viral_thread" ? "#7c3aed" : "var(--color-accent)", color: "white", fontSize: 14, fontWeight: 600, cursor: generating ? "not-allowed" : "pointer", opacity: generating ? 0.6 : 1 }}
          >
            {generating
              ? genType === "viral_thread"
                ? "Generating Thread..."
                : "Generating..."
              : genType === "viral_thread"
                ? "Generate Viral Thread"
                : "Generate Draft"}
          </button>
        </div>
        {genType === "viral_thread" && (
          <p style={{ fontSize: 12, color: "var(--color-secondary)", marginTop: 10, marginBottom: 0, lineHeight: 1.5 }}>
            Generates a 7-9 tweet thread using viral frameworks (Myth Buster, Contrarian Take, Bold Claim + Proof).
            Queries the entire email database for surprising, counterintuitive insights. Uses Claude Sonnet for higher quality.
          </p>
        )}
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
      ) : groupedTweets.length === 0 ? (
        <div style={{ textAlign: "center", padding: 40, color: "var(--color-secondary)", fontSize: 14 }}>
          No tweets found. Generate a draft to get started.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {groupedTweets.map((item) => {
            if (item.type === "single") {
              return renderTweetCard(item.tweet);
            }

            // Thread group
            const threadTweets = item.tweets;
            const allDraft = threadTweets.every((t) => t.status === "draft");
            const allApproved = threadTweets.every((t) => t.status === "approved");
            const allPosted = threadTweets.every((t) => t.status === "posted");
            const threadStatus = allPosted ? "posted" : allApproved ? "approved" : allDraft ? "draft" : "mixed";

            return (
              <div
                key={`thread-${item.threadId}`}
                style={{
                  background: "var(--color-surface, white)",
                  border: "2px solid #7c3aed40",
                  borderRadius: 14,
                  padding: 20,
                }}
              >
                {/* Thread header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span style={{
                      fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 6,
                      background: "#7c3aed15", color: "#7c3aed",
                      textTransform: "uppercase", letterSpacing: "0.5px",
                    }}>
                      Thread · {threadTweets.length} tweets
                    </span>
                    <span style={{
                      fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 4,
                      background: STATUS_COLORS[threadStatus === "mixed" ? "draft" : threadStatus] + "20",
                      color: STATUS_COLORS[threadStatus === "mixed" ? "draft" : threadStatus],
                      textTransform: "uppercase",
                    }}>
                      {threadStatus}
                    </span>
                  </div>
                  <div style={{ fontSize: 11, color: "var(--color-muted, #999)" }}>
                    {threadTweets[0]?.created_at
                      ? new Date(threadTweets[0].created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })
                      : ""}
                  </div>
                </div>

                {/* Thread tweets */}
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {threadTweets.map((t, i) => renderTweetCard(t, i))}
                </div>

                {/* Thread-level actions */}
                <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
                  {allDraft && (
                    <button
                      onClick={() => approveThread(item.threadId)}
                      style={{ padding: "8px 18px", borderRadius: 8, border: "none", background: "#3b82f6", color: "white", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
                    >
                      Approve All
                    </button>
                  )}
                  {allApproved && (
                    <button
                      onClick={() => postThread(item.threadId)}
                      disabled={postingThread === item.threadId}
                      style={{
                        padding: "8px 18px", borderRadius: 8, border: "none",
                        background: "#22c55e", color: "white", fontSize: 13, fontWeight: 600,
                        cursor: postingThread === item.threadId ? "not-allowed" : "pointer",
                        opacity: postingThread === item.threadId ? 0.6 : 1,
                      }}
                    >
                      {postingThread === item.threadId ? "Posting Thread..." : "Post Thread to X"}
                    </button>
                  )}
                  {allPosted && threadTweets[0]?.twitter_id && (
                    <a
                      href={`https://x.com/i/status/${threadTweets[0].twitter_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        padding: "8px 18px", borderRadius: 8, border: "1px solid var(--color-border)",
                        background: "transparent", color: "var(--color-accent)", fontSize: 13, fontWeight: 500,
                        textDecoration: "none", display: "inline-block",
                      }}
                    >
                      View Thread on X
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
