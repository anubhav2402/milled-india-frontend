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
  reply_to_id: string | null;
  created_at: string | null;
  char_count: number;
};

const TYPE_LABELS: Record<string, string> = {
  daily_digest: "Daily Digest",
  weekly_digest: "Weekly Roundup",
  brand_spotlight: "Brand Spotlight",
  subject_line_insight: "Subject Lines",
  viral_thread: "Viral Thread",
  email_teardown: "Email Teardown",
  strategy_thread: "Strategy Thread",
  blog_promo: "Blog Promo",
  smart_reply: "Smart Reply",
  engagement_bait: "Engagement Bait",
  brand_comparison: "Brand Comparison",
  weekly_roundup: "Weekly Roundup (New)",
  newsjacking: "Newsjacking",
  subject_spotlight: "Subject Spotlight",
  follow_up_reply: "Follow-Up Reply",
  reply_data_drop: "Data Drop Reply",
  reply_contrarian: "Contrarian Reply",
  reply_example: "Example Reply",
  reply_quick_tip: "Quick Tip Reply",
  reply_agree_amplify: "Agree+Amplify Reply",
  reply_resource_drop: "Resource Drop Reply",
};

// Types grouped by category for the dropdown
const TYPE_GROUPS: { label: string; types: { value: string; label: string }[] }[] = [
  {
    label: "Content",
    types: [
      { value: "email_teardown", label: "Email Teardown" },
      { value: "subject_spotlight", label: "Subject Spotlight" },
      { value: "brand_comparison", label: "Brand Comparison" },
      { value: "blog_promo", label: "Blog Promo" },
    ],
  },
  {
    label: "Threads",
    types: [
      { value: "strategy_thread", label: "Strategy Thread" },
      { value: "viral_thread", label: "Viral Thread" },
    ],
  },
  {
    label: "Engagement",
    types: [
      { value: "engagement_bait", label: "Engagement Bait" },
      { value: "newsjacking", label: "Newsjacking" },
    ],
  },
  {
    label: "Replies",
    types: [
      { value: "smart_reply", label: "Smart Reply" },
      { value: "follow_up_reply", label: "Follow-Up Reply" },
    ],
  },
  {
    label: "Digests",
    types: [
      { value: "weekly_roundup", label: "Weekly Roundup" },
      { value: "daily_digest", label: "Daily Digest (Legacy)" },
      { value: "weekly_digest", label: "Weekly Digest (Legacy)" },
      { value: "brand_spotlight", label: "Brand Spotlight (Legacy)" },
      { value: "subject_line_insight", label: "Subject Lines (Legacy)" },
    ],
  },
];

// Which types need parameter inputs
const TYPE_PARAMS: Record<string, { key: string; label: string; required: boolean; multiline?: boolean }[]> = {
  strategy_thread: [
    { key: "brand_name", label: "Brand Name (optional — auto-picks if empty)", required: false },
  ],
  blog_promo: [
    { key: "url", label: "Page URL", required: true },
    { key: "title", label: "Page Title", required: true },
    { key: "topic", label: "Core Topic", required: false },
    { key: "key_stat", label: "Key Stat / Finding", required: false },
    { key: "audience", label: "Target Audience", required: false },
  ],
  smart_reply: [
    { key: "tweet_text", label: "Tweet to reply to", required: true, multiline: true },
    { key: "author_handle", label: "@handle of author", required: false },
    { key: "category", label: "Topic (e.g. deliverability, subject lines)", required: false },
    { key: "reply_to_id", label: "Tweet ID to reply to (for posting as reply)", required: false },
  ],
  engagement_bait: [
    { key: "topic", label: "Topic (optional — auto-picks if empty)", required: false },
    { key: "trending", label: "Trending Angle (optional)", required: false },
  ],
  brand_comparison: [
    { key: "brand_a", label: "Brand A (optional — auto-picks if empty)", required: false },
    { key: "brand_b", label: "Brand B (optional — auto-picks if empty)", required: false },
  ],
  weekly_roundup: [
    { key: "explanation", label: "Possible Explanation (optional)", required: false },
  ],
  newsjacking: [
    { key: "headline", label: "News Headline", required: true },
    { key: "summary", label: "News Summary", required: false, multiline: true },
    { key: "source", label: "Source (optional)", required: false },
    { key: "mailmuse_angle", label: "MailMuse Angle (optional — auto-generates if empty)", required: false },
  ],
  follow_up_reply: [
    { key: "original_reply", label: "Your Original Reply", required: true, multiline: true },
    { key: "their_response", label: "Their Response", required: true, multiline: true },
    { key: "topic", label: "Conversation Topic", required: false },
    { key: "relevant_link", label: "Relevant MailMuse Link", required: false },
    { key: "reply_to_id", label: "Tweet ID to reply to (for posting as reply)", required: false },
  ],
};

const STATUS_COLORS: Record<string, string> = {
  draft: "#f59e0b",
  approved: "#3b82f6",
  posted: "#22c55e",
  rejected: "#ef4444",
};

const THREAD_TYPES = new Set(["viral_thread", "strategy_thread"]);
const VARIANT_TYPES = new Set([
  "blog_promo", "engagement_bait", "newsjacking",
  "reply_data_drop", "reply_contrarian", "reply_example",
  "reply_quick_tip", "reply_agree_amplify", "reply_resource_drop",
]);

const REPLY_STYLES = [
  { value: "reply_data_drop", label: "Data Drop", emoji: "\u{1f4ca}", desc: "Reply with a surprising MailMuse stat that makes people think 'where did they get that data?'" },
  { value: "reply_contrarian", label: "Contrarian", emoji: "\u{1f914}", desc: "Respectfully challenge with data. 'Our data across 600+ brands shows the opposite...'" },
  { value: "reply_example", label: "Example", emoji: "\u{1f4e7}", desc: "Share a real brand email example that relates to their point." },
  { value: "reply_quick_tip", label: "Quick Tip", emoji: "\u{1f4a1}", desc: "Add a specific tactical insight they can screenshot." },
  { value: "reply_agree_amplify", label: "Agree + Amplify", emoji: "\u{1f525}", desc: "Agree and go deeper with data they didn't have." },
  { value: "reply_resource_drop", label: "Resource Drop", emoji: "\u{1f517}", desc: "Only when someone asks for tools. Mentions MailMuse naturally." },
];

const REPLY_TYPE_SET = new Set([
  "reply_data_drop", "reply_contrarian", "reply_example",
  "reply_quick_tip", "reply_agree_amplify", "reply_resource_drop",
  "smart_reply", "follow_up_reply",
]);

const TARGET_CATEGORIES = [
  "Email Marketing Expert",
  "D2C Founder",
  "Ecommerce Influencer",
  "Tool Founder",
  "Marketing Agency",
];

type ReplyTarget = {
  id: number;
  handle: string;
  display_name: string;
  follower_count: number | null;
  category: string;
  notes: string | null;
  is_active: boolean;
  reply_count: number;
  last_replied_at: string | null;
  created_at: string | null;
};

// Type descriptions shown below the dropdown
const TYPE_DESCRIPTIONS: Record<string, string> = {
  email_teardown: "Picks a random brand email and breaks down one clever tactic as an insightful tweet.",
  strategy_thread: "Deep-dive 5-7 tweet thread analyzing a brand's full email marketing approach. Uses Claude Sonnet.",
  blog_promo: "Generates 3 tweet variants (Stat Hook, Contrarian, Listicle Tease) to drive traffic to a blog post.",
  smart_reply: "Generates a value-first reply to a tweet about email marketing. Rarely mentions MailMuse.",
  engagement_bait: "Generates 2 conversation-starter variants (Hot Take Question + Show Your Work) to drive replies.",
  brand_comparison: "Compares two brands' email strategies in a single tweet that drives curiosity.",
  weekly_roundup: "Weekly trend insight from MailMuse data — one notable pattern with supporting brands.",
  newsjacking: "Generates 2 variants (Data Reaction + Prediction) reacting to breaking email marketing news.",
  subject_spotlight: "Highlights a standout subject line with tactical analysis of why it works.",
  follow_up_reply: "Generates a follow-up reply to continue a conversation and deepen engagement.",
  viral_thread: "7-9 tweet viral thread using frameworks (Myth Buster, Contrarian, Bold Claim). Uses Claude Sonnet.",
  daily_digest: "Legacy: Top email campaigns tracked today with subject line samples.",
  weekly_digest: "Legacy: Weekly email campaign summary with trending types.",
  brand_spotlight: "Legacy: Random brand spotlight with send day and subject length analysis.",
  subject_line_insight: "Legacy: Subject line pattern analysis (questions, emojis, urgency).",
};

export default function AdminTweetsPage() {
  const { token, user } = useAuth();
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [genType, setGenType] = useState("email_teardown");
  const [genParams, setGenParams] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");
  const [posting, setPosting] = useState<number | null>(null);
  const [postingThread, setPostingThread] = useState<string | null>(null);

  // Tab state
  const [activeTab, setActiveTab] = useState<"tweets" | "replies">("tweets");

  // Reply Hub state
  const [replyTargets, setReplyTargets] = useState<ReplyTarget[]>([]);
  const [selectedTarget, setSelectedTarget] = useState("");
  const [replyTweetText, setReplyTweetText] = useState("");
  const [replyTweetUrl, setReplyTweetUrl] = useState("");
  const [replyStyle, setReplyStyle] = useState("reply_data_drop");
  const [replyGenerating, setReplyGenerating] = useState(false);
  const [replyTweets, setReplyTweets] = useState<Tweet[]>([]);
  const [replyLoading, setReplyLoading] = useState(false);
  const [showTargetForm, setShowTargetForm] = useState(false);
  const [targetCategory, setTargetCategory] = useState("all");
  const [newTarget, setNewTarget] = useState({ handle: "", display_name: "", follower_count: "", category: "Email Marketing Expert", notes: "" });
  const [showTargets, setShowTargets] = useState(true);
  const [seeding, setSeeding] = useState(false);

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

  // Reset params when type changes
  useEffect(() => {
    setGenParams({});
  }, [genType]);

  const generateDraft = async () => {
    // Validate required params
    const paramDefs = TYPE_PARAMS[genType];
    if (paramDefs) {
      const missing = paramDefs.filter((p) => p.required && !genParams[p.key]?.trim());
      if (missing.length > 0) {
        setError(`Missing required fields: ${missing.map((p) => p.label).join(", ")}`);
        return;
      }
    }

    setGenerating(true);
    setError(null);
    try {
      // Build body with non-empty params
      const body: Record<string, string> = {};
      for (const [k, v] of Object.entries(genParams)) {
        if (v.trim()) body[k] = v.trim();
      }

      const res = await fetch(
        `${API_BASE}/admin/tweets/generate?tweet_type=${genType}`,
        {
          method: "POST",
          headers,
          body: JSON.stringify(body),
        }
      );
      if (res.ok) {
        fetchTweets();
        setGenParams({});
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

  // ── Reply Hub functions ──

  const extractTweetId = (urlOrId: string): string => {
    const trimmed = urlOrId.trim();
    if (/^\d+$/.test(trimmed)) return trimmed;
    const match = trimmed.match(/status\/(\d+)/);
    return match ? match[1] : trimmed;
  };

  const fetchReplyTargets = async () => {
    try {
      const url = targetCategory === "all"
        ? `${API_BASE}/admin/reply-targets?active_only=false`
        : `${API_BASE}/admin/reply-targets?category=${encodeURIComponent(targetCategory)}&active_only=false`;
      const res = await fetch(url, { headers });
      if (res.ok) setReplyTargets(await res.json());
    } catch { /* ignore */ }
  };

  const fetchReplyTweets = async () => {
    setReplyLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin/tweets?limit=200`, { headers });
      if (res.ok) {
        const all: Tweet[] = await res.json();
        setReplyTweets(all.filter((t) => REPLY_TYPE_SET.has(t.tweet_type)));
      }
    } catch { /* ignore */ }
    finally { setReplyLoading(false); }
  };

  const generateReply = async () => {
    if (!replyTweetText.trim()) { setError("Paste the tweet text to reply to"); return; }
    setReplyGenerating(true);
    setError(null);
    const tweetId = replyTweetUrl ? extractTweetId(replyTweetUrl) : undefined;
    const target = replyTargets.find((t) => t.handle === selectedTarget);
    const body: Record<string, string> = { tweet_text: replyTweetText.trim() };
    if (selectedTarget) body.author_handle = selectedTarget;
    if (target?.category) body.target_category = target.category;
    if (tweetId) body.reply_to_id = tweetId;

    try {
      const res = await fetch(
        `${API_BASE}/admin/tweets/generate?tweet_type=${replyStyle}`,
        { method: "POST", headers, body: JSON.stringify(body) }
      );
      if (res.ok) {
        fetchReplyTweets();
        setReplyTweetText("");
        setReplyTweetUrl("");
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.detail || "Failed to generate reply");
      }
    } catch { setError("Network error"); }
    finally { setReplyGenerating(false); }
  };

  const addTarget = async () => {
    if (!newTarget.handle.trim() || !newTarget.display_name.trim()) {
      setError("Handle and display name are required");
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/admin/reply-targets`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          ...newTarget,
          follower_count: newTarget.follower_count ? parseInt(newTarget.follower_count) : null,
        }),
      });
      if (res.ok) {
        setNewTarget({ handle: "", display_name: "", follower_count: "", category: "Email Marketing Expert", notes: "" });
        setShowTargetForm(false);
        fetchReplyTargets();
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.detail || "Failed to add target");
      }
    } catch { setError("Network error"); }
  };

  const deleteTarget = async (id: number) => {
    try {
      const res = await fetch(`${API_BASE}/admin/reply-targets/${id}`, { method: "DELETE", headers });
      if (res.ok) fetchReplyTargets();
    } catch { setError("Network error"); }
  };

  const seedTargets = async () => {
    setSeeding(true);
    try {
      const res = await fetch(`${API_BASE}/admin/reply-targets/seed`, { method: "POST", headers });
      if (res.ok) fetchReplyTargets();
    } catch { setError("Network error"); }
    finally { setSeeding(false); }
  };

  // Fetch reply hub data when tab switches
  useEffect(() => {
    if (activeTab === "replies" && token) {
      fetchReplyTargets();
      fetchReplyTweets();
    }
  }, [activeTab, token, targetCategory]);

  // ── Grouping helpers ──

  // Determine if a grouped item is a thread (reply chain) or variants (alternatives)
  const getGroupType = (threadTweets: Tweet[]): "thread" | "variants" => {
    const tweetType = threadTweets[0]?.tweet_type || "";
    if (THREAD_TYPES.has(tweetType)) return "thread";
    if (VARIANT_TYPES.has(tweetType)) return "variants";
    // Fallback: if thread_order exists and type looks like a thread
    return "thread";
  };

  // Group tweets: threads/variants grouped together, standalone tweets as-is
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

    // Build display list: groups first, then standalone
    const items: Array<
      | { type: "thread"; threadId: string; tweets: Tweet[] }
      | { type: "variants"; threadId: string; tweets: Tweet[] }
      | { type: "single"; tweet: Tweet }
    > = [];

    for (const [threadId, threadTweets] of threadMap) {
      const groupType = getGroupType(threadTweets);
      items.push({ type: groupType, threadId, tweets: threadTweets });
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
          {tweet.reply_to_id && (
            <span style={{ fontSize: 10, fontWeight: 500, padding: "2px 6px", borderRadius: 4, background: "#dbeafe", color: "#2563eb" }}>
              Reply
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
          {tweet.status === "draft" && (
            <button onClick={() => updateStatus(tweet.id, "approve")} style={{ padding: "4px 10px", borderRadius: 6, border: "1px solid #bfdbfe", background: "transparent", color: "#3b82f6", fontSize: 11, cursor: "pointer" }}>
              Approve
            </button>
          )}
          {(tweet.status === "approved" || tweet.status === "draft") && (
            <button
              onClick={() => postTweet(tweet.id)}
              disabled={posting === tweet.id}
              style={{ padding: "4px 10px", borderRadius: 6, border: "none", background: "#22c55e", color: "white", fontSize: 11, fontWeight: 600, cursor: posting === tweet.id ? "not-allowed" : "pointer", opacity: posting === tweet.id ? 0.6 : 1 }}
            >
              {posting === tweet.id ? "Posting..." : "Post to X"}
            </button>
          )}
          <button onClick={() => { setEditingId(tweet.id); setEditContent(tweet.content); }} style={{ padding: "4px 10px", borderRadius: 6, border: "1px solid var(--color-border)", background: "transparent", fontSize: 11, cursor: "pointer" }}>
            Edit
          </button>
          {tweet.status === "draft" && (
            <button onClick={() => updateStatus(tweet.id, "reject")} style={{ padding: "4px 10px", borderRadius: 6, border: "1px solid #fecaca", background: "transparent", color: "#ef4444", fontSize: 11, cursor: "pointer" }}>
              Reject
            </button>
          )}
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

  const currentParamDefs = TYPE_PARAMS[genType] || [];
  const isThreadType = THREAD_TYPES.has(genType);
  const isVariantType = VARIANT_TYPES.has(genType);

  // Group reply tweets for the Reply Hub queue
  const replyGrouped = (() => {
    const threadMap = new Map<string, Tweet[]>();
    const standalone: Tweet[] = [];
    for (const t of replyTweets) {
      if (t.thread_id) {
        const existing = threadMap.get(t.thread_id) || [];
        existing.push(t);
        threadMap.set(t.thread_id, existing);
      } else {
        standalone.push(t);
      }
    }
    for (const [, tts] of threadMap) {
      tts.sort((a, b) => (a.thread_order ?? 0) - (b.thread_order ?? 0));
    }
    const items: Array<
      | { type: "variants"; threadId: string; tweets: Tweet[] }
      | { type: "single"; tweet: Tweet }
    > = [];
    for (const [threadId, tts] of threadMap) {
      items.push({ type: "variants", threadId, tweets: tts });
    }
    for (const t of standalone) {
      items.push({ type: "single", tweet: t });
    }
    return items;
  })();

  const formatFollowers = (n: number | null) => {
    if (!n) return "";
    if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
    if (n >= 1000) return `${Math.round(n / 1000)}K`;
    return String(n);
  };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 0 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "var(--color-primary)", margin: 0, fontFamily: "var(--font-dm-serif)" }}>
          Tweet Manager
        </h1>
        <Link href="/admin/dashboard" style={{ fontSize: 13, color: "var(--color-secondary)", textDecoration: "none" }}>
          Back to dashboard
        </Link>
      </div>

      {/* Tab navigation */}
      <div style={{ display: "flex", gap: 0, marginBottom: 24, marginTop: 16, borderBottom: "2px solid var(--color-border, #e5e5e5)" }}>
        {[
          { key: "tweets" as const, label: "Content", color: "var(--color-accent)" },
          { key: "replies" as const, label: "Reply Hub", color: "#7c3aed" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: "10px 24px",
              fontSize: 14,
              fontWeight: activeTab === tab.key ? 700 : 500,
              color: activeTab === tab.key ? tab.color : "var(--color-secondary)",
              background: "none",
              border: "none",
              borderBottom: activeTab === tab.key ? `2px solid ${tab.color}` : "2px solid transparent",
              cursor: "pointer",
              marginBottom: -2,
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "#991b1b" }}>
          {error}
          <button onClick={() => setError(null)} style={{ float: "right", background: "none", border: "none", cursor: "pointer", color: "#991b1b", fontWeight: 600 }}>x</button>
        </div>
      )}

      {/* ═══ REPLY HUB TAB ═══ */}
      {activeTab === "replies" && (
        <>
          {/* Reply Composer */}
          <div style={{ background: "var(--color-surface, white)", border: "2px solid #7c3aed30", borderRadius: 12, padding: 20, marginBottom: 24 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#7c3aed", marginBottom: 16 }}>
              Reply Composer
            </div>

            {/* Target account selector */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, fontWeight: 500, color: "var(--color-secondary)", display: "block", marginBottom: 4 }}>
                Target Account (optional)
              </label>
              <select
                value={selectedTarget}
                onChange={(e) => setSelectedTarget(e.target.value)}
                style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid var(--color-border, #e5e5e5)", fontSize: 13, fontFamily: "var(--font-inter)", boxSizing: "border-box" }}
              >
                <option value="">-- Select or type handle below --</option>
                {replyTargets.map((t) => (
                  <option key={t.id} value={t.handle}>
                    @{t.handle} — {t.display_name} {t.follower_count ? `(${formatFollowers(t.follower_count)})` : ""} · {t.category}
                  </option>
                ))}
              </select>
            </div>

            {/* Tweet text to reply to */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, fontWeight: 500, color: "var(--color-secondary)", display: "block", marginBottom: 4 }}>
                Tweet to reply to <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <textarea
                value={replyTweetText}
                onChange={(e) => setReplyTweetText(e.target.value)}
                placeholder="Paste the tweet text here..."
                rows={4}
                style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid var(--color-border, #e5e5e5)", fontSize: 13, fontFamily: "var(--font-inter)", resize: "vertical", boxSizing: "border-box" }}
              />
            </div>

            {/* Tweet URL/ID */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, fontWeight: 500, color: "var(--color-secondary)", display: "block", marginBottom: 4 }}>
                Tweet URL or ID (for posting as a reply)
              </label>
              <input
                type="text"
                value={replyTweetUrl}
                onChange={(e) => setReplyTweetUrl(e.target.value)}
                placeholder="https://x.com/user/status/123... or just 123..."
                style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid var(--color-border, #e5e5e5)", fontSize: 13, fontFamily: "var(--font-inter)", boxSizing: "border-box" }}
              />
            </div>

            {/* Reply style pills */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, fontWeight: 500, color: "var(--color-secondary)", display: "block", marginBottom: 8 }}>
                Reply Style
              </label>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {REPLY_STYLES.map((s) => (
                  <button
                    key={s.value}
                    onClick={() => setReplyStyle(s.value)}
                    style={{
                      padding: "6px 14px",
                      borderRadius: 20,
                      border: replyStyle === s.value ? "2px solid #7c3aed" : "1px solid var(--color-border, #e5e5e5)",
                      background: replyStyle === s.value ? "#7c3aed10" : "transparent",
                      color: replyStyle === s.value ? "#7c3aed" : "var(--color-secondary)",
                      fontSize: 12,
                      fontWeight: replyStyle === s.value ? 700 : 500,
                      cursor: "pointer",
                    }}
                  >
                    {s.emoji} {s.label}
                  </button>
                ))}
              </div>
              <p style={{ fontSize: 12, color: "var(--color-secondary)", marginTop: 8, lineHeight: 1.5, fontStyle: "italic" }}>
                {REPLY_STYLES.find((s) => s.value === replyStyle)?.desc}
              </p>
            </div>

            {/* Generate button */}
            <button
              onClick={generateReply}
              disabled={replyGenerating}
              style={{
                padding: "10px 24px", borderRadius: 8, border: "none",
                background: "#7c3aed", color: "white", fontSize: 14, fontWeight: 600,
                cursor: replyGenerating ? "not-allowed" : "pointer",
                opacity: replyGenerating ? 0.6 : 1,
              }}
            >
              {replyGenerating ? "Generating 3 Variants..." : "Generate 3 Reply Variants"}
            </button>
          </div>

          {/* Reply Queue */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "var(--color-primary)", marginBottom: 14 }}>
              Reply Queue ({replyTweets.length})
            </div>
            {replyLoading ? (
              <div style={{ textAlign: "center", padding: 30, color: "var(--color-secondary)" }}>Loading...</div>
            ) : replyGrouped.length === 0 ? (
              <div style={{ textAlign: "center", padding: 30, color: "var(--color-secondary)", fontSize: 13 }}>
                No replies generated yet. Use the composer above to get started.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {replyGrouped.map((item) => {
                  if (item.type === "single") {
                    return renderTweetCard(item.tweet);
                  }
                  const variantTweets = item.tweets;
                  return (
                    <div
                      key={`rg-${item.threadId}`}
                      style={{
                        background: "var(--color-surface, white)",
                        border: "2px solid #7c3aed30",
                        borderRadius: 14,
                        padding: 20,
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
                        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                          <span style={{ fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 6, background: "#7c3aed15", color: "#7c3aed", textTransform: "uppercase" }}>
                            {variantTweets.length} variants
                          </span>
                          <span style={{ fontSize: 11, fontWeight: 500, padding: "3px 8px", borderRadius: 4, background: "#f5e6dc", color: "var(--color-accent)" }}>
                            {TYPE_LABELS[variantTweets[0]?.tweet_type] || variantTweets[0]?.tweet_type}
                          </span>
                        </div>
                        <div style={{ fontSize: 11, color: "var(--color-muted, #999)" }}>
                          {variantTweets[0]?.created_at ? new Date(variantTweets[0].created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : ""}
                        </div>
                      </div>
                      <p style={{ fontSize: 12, color: "var(--color-secondary)", margin: "0 0 12px", fontStyle: "italic" }}>
                        Pick your favorite variant. Approve and post individually.
                      </p>
                      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {variantTweets.map((t) => renderTweetCard(t))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Target Accounts Panel */}
          <div style={{ background: "var(--color-surface, white)", border: "1px solid var(--color-border, #e5e5e5)", borderRadius: 12, padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: showTargets ? 16 : 0 }}>
              <button
                onClick={() => setShowTargets(!showTargets)}
                style={{ fontSize: 15, fontWeight: 700, color: "var(--color-primary)", background: "none", border: "none", cursor: "pointer", padding: 0 }}
              >
                {showTargets ? "\u25BC" : "\u25B6"} Target Accounts ({replyTargets.length})
              </button>
              <div style={{ display: "flex", gap: 8 }}>
                {replyTargets.length === 0 && (
                  <button
                    onClick={seedTargets}
                    disabled={seeding}
                    style={{ padding: "6px 14px", borderRadius: 8, border: "1px solid #7c3aed", background: "transparent", color: "#7c3aed", fontSize: 12, fontWeight: 600, cursor: "pointer" }}
                  >
                    {seeding ? "Seeding..." : "Seed 20 Accounts"}
                  </button>
                )}
                <button
                  onClick={() => setShowTargetForm(!showTargetForm)}
                  style={{ padding: "6px 14px", borderRadius: 8, border: "none", background: "#7c3aed", color: "white", fontSize: 12, fontWeight: 600, cursor: "pointer" }}
                >
                  + Add
                </button>
              </div>
            </div>

            {showTargets && (
              <>
                {/* Add target form */}
                {showTargetForm && (
                  <div style={{ background: "#f9fafb", borderRadius: 8, padding: 14, marginBottom: 14, display: "flex", flexDirection: "column", gap: 8 }}>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <input type="text" placeholder="@handle" value={newTarget.handle} onChange={(e) => setNewTarget({ ...newTarget, handle: e.target.value })}
                        style={{ flex: 1, minWidth: 120, padding: "6px 10px", borderRadius: 6, border: "1px solid var(--color-border)", fontSize: 12 }} />
                      <input type="text" placeholder="Display Name" value={newTarget.display_name} onChange={(e) => setNewTarget({ ...newTarget, display_name: e.target.value })}
                        style={{ flex: 1, minWidth: 120, padding: "6px 10px", borderRadius: 6, border: "1px solid var(--color-border)", fontSize: 12 }} />
                      <input type="text" placeholder="Followers (e.g. 50000)" value={newTarget.follower_count} onChange={(e) => setNewTarget({ ...newTarget, follower_count: e.target.value })}
                        style={{ width: 120, padding: "6px 10px", borderRadius: 6, border: "1px solid var(--color-border)", fontSize: 12 }} />
                    </div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <select value={newTarget.category} onChange={(e) => setNewTarget({ ...newTarget, category: e.target.value })}
                        style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid var(--color-border)", fontSize: 12 }}>
                        {TARGET_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                      <input type="text" placeholder="Notes (optional)" value={newTarget.notes} onChange={(e) => setNewTarget({ ...newTarget, notes: e.target.value })}
                        style={{ flex: 1, padding: "6px 10px", borderRadius: 6, border: "1px solid var(--color-border)", fontSize: 12 }} />
                      <button onClick={addTarget} style={{ padding: "6px 14px", borderRadius: 6, border: "none", background: "#7c3aed", color: "white", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                        Save
                      </button>
                    </div>
                  </div>
                )}

                {/* Category filter */}
                <div style={{ display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
                  {["all", ...TARGET_CATEGORIES].map((c) => (
                    <button
                      key={c}
                      onClick={() => setTargetCategory(c)}
                      style={{
                        padding: "4px 10px", borderRadius: 14, fontSize: 11,
                        border: targetCategory === c ? "none" : "1px solid var(--color-border)",
                        background: targetCategory === c ? "#7c3aed" : "transparent",
                        color: targetCategory === c ? "white" : "var(--color-secondary)",
                        cursor: "pointer",
                      }}
                    >
                      {c === "all" ? "All" : c}
                    </button>
                  ))}
                </div>

                {/* Target list */}
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {replyTargets.map((t) => (
                    <div
                      key={t.id}
                      style={{
                        display: "flex", justifyContent: "space-between", alignItems: "center",
                        padding: "10px 14px", borderRadius: 8, border: "1px solid var(--color-border, #e5e5e5)",
                        background: t.is_active ? "transparent" : "#f9fafb",
                      }}
                    >
                      <div>
                        <span style={{ fontSize: 13, fontWeight: 600, color: "var(--color-primary)" }}>
                          @{t.handle}
                        </span>
                        <span style={{ fontSize: 12, color: "var(--color-secondary)", marginLeft: 8 }}>
                          {t.display_name}
                        </span>
                        {t.follower_count && (
                          <span style={{ fontSize: 11, color: "#7c3aed", marginLeft: 8, fontWeight: 600 }}>
                            {formatFollowers(t.follower_count)}
                          </span>
                        )}
                        <span style={{ fontSize: 10, color: "var(--color-muted)", marginLeft: 8, padding: "2px 6px", borderRadius: 4, background: "#f3f4f6" }}>
                          {t.category}
                        </span>
                        {t.notes && (
                          <span style={{ fontSize: 11, color: "var(--color-muted)", marginLeft: 8 }}>
                            — {t.notes}
                          </span>
                        )}
                        {t.reply_count > 0 && (
                          <span style={{ fontSize: 10, color: "var(--color-muted)", marginLeft: 8 }}>
                            Replied {t.reply_count}x
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => deleteTarget(t.id)}
                        style={{ padding: "4px 8px", borderRadius: 4, border: "1px solid #fecaca", background: "transparent", color: "#ef4444", fontSize: 11, cursor: "pointer" }}
                      >
                        Del
                      </button>
                    </div>
                  ))}
                  {replyTargets.length === 0 && (
                    <div style={{ textAlign: "center", padding: 20, color: "var(--color-secondary)", fontSize: 13 }}>
                      No target accounts yet. Click &quot;Seed 20 Accounts&quot; to get started.
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </>
      )}

      {/* ═══ TWEET MANAGER TAB ═══ */}
      {activeTab === "tweets" && (<>

      {/* Generate section */}
      <div style={{ background: "var(--color-surface, white)", border: "1px solid var(--color-border, #e5e5e5)", borderRadius: 12, padding: 20, marginBottom: 24 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: "var(--color-primary)", marginBottom: 12 }}>
          Generate New Content
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", marginBottom: currentParamDefs.length > 0 ? 16 : 0 }}>
          <select
            value={genType}
            onChange={(e) => setGenType(e.target.value)}
            style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid var(--color-border, #e5e5e5)", fontSize: 14, fontFamily: "var(--font-inter)", minWidth: 200 }}
          >
            {TYPE_GROUPS.map((group) => (
              <optgroup key={group.label} label={group.label}>
                {group.types.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </optgroup>
            ))}
          </select>

          <button
            onClick={generateDraft}
            disabled={generating}
            style={{
              padding: "8px 18px", borderRadius: 8, border: "none",
              background: isThreadType ? "#7c3aed" : isVariantType ? "#0891b2" : "var(--color-accent)",
              color: "white", fontSize: 14, fontWeight: 600,
              cursor: generating ? "not-allowed" : "pointer",
              opacity: generating ? 0.6 : 1,
            }}
          >
            {generating
              ? isThreadType ? "Generating Thread..." : isVariantType ? "Generating Variants..." : "Generating..."
              : isThreadType ? "Generate Thread" : isVariantType ? "Generate Variants" : "Generate Draft"}
          </button>

          {isVariantType && (
            <span style={{ fontSize: 11, color: "#0891b2", fontWeight: 500 }}>
              Will create multiple alternatives to choose from
            </span>
          )}
        </div>

        {/* Type description */}
        {TYPE_DESCRIPTIONS[genType] && (
          <p style={{ fontSize: 12, color: "var(--color-secondary)", marginTop: 8, marginBottom: currentParamDefs.length > 0 ? 12 : 0, lineHeight: 1.5 }}>
            {TYPE_DESCRIPTIONS[genType]}
          </p>
        )}

        {/* Parameter inputs */}
        {currentParamDefs.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10, padding: "14px 0 0" }}>
            {currentParamDefs.map((param) => (
              <div key={param.key}>
                <label style={{ fontSize: 12, fontWeight: 500, color: "var(--color-secondary)", display: "block", marginBottom: 4 }}>
                  {param.label}
                  {param.required && <span style={{ color: "#ef4444", marginLeft: 2 }}>*</span>}
                </label>
                {param.multiline ? (
                  <textarea
                    value={genParams[param.key] || ""}
                    onChange={(e) => setGenParams({ ...genParams, [param.key]: e.target.value })}
                    placeholder={param.label}
                    rows={3}
                    style={{
                      width: "100%", padding: "8px 12px", borderRadius: 8,
                      border: "1px solid var(--color-border, #e5e5e5)",
                      fontSize: 13, fontFamily: "var(--font-inter)",
                      resize: "vertical", boxSizing: "border-box",
                    }}
                  />
                ) : (
                  <input
                    type="text"
                    value={genParams[param.key] || ""}
                    onChange={(e) => setGenParams({ ...genParams, [param.key]: e.target.value })}
                    placeholder={param.label}
                    style={{
                      width: "100%", padding: "8px 12px", borderRadius: 8,
                      border: "1px solid var(--color-border, #e5e5e5)",
                      fontSize: 13, fontFamily: "var(--font-inter)",
                      boxSizing: "border-box",
                    }}
                  />
                )}
              </div>
            ))}
          </div>
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

            const threadTweets = item.tweets;
            const isVariants = item.type === "variants";
            const allDraft = threadTweets.every((t) => t.status === "draft");
            const allApproved = threadTweets.every((t) => t.status === "approved");
            const allPosted = threadTweets.every((t) => t.status === "posted");
            const threadStatus = allPosted ? "posted" : allApproved ? "approved" : allDraft ? "draft" : "mixed";
            const accentColor = isVariants ? "#0891b2" : "#7c3aed";

            return (
              <div
                key={`group-${item.threadId}`}
                style={{
                  background: "var(--color-surface, white)",
                  border: `2px solid ${accentColor}40`,
                  borderRadius: 14,
                  padding: 20,
                }}
              >
                {/* Group header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span style={{
                      fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 6,
                      background: `${accentColor}15`, color: accentColor,
                      textTransform: "uppercase", letterSpacing: "0.5px",
                    }}>
                      {isVariants
                        ? `Variants · ${threadTweets.length} options`
                        : `Thread · ${threadTweets.length} tweets`}
                    </span>
                    <span style={{ fontSize: 11, fontWeight: 500, padding: "3px 8px", borderRadius: 4, background: "var(--color-accent-light, #f5e6dc)", color: "var(--color-accent)" }}>
                      {TYPE_LABELS[threadTweets[0]?.tweet_type] || threadTweets[0]?.tweet_type}
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

                {/* Variant hint */}
                {isVariants && (
                  <p style={{ fontSize: 12, color: "var(--color-secondary)", margin: "0 0 12px", fontStyle: "italic" }}>
                    Pick your favorite variant below. Approve and post individually.
                  </p>
                )}

                {/* Group tweets */}
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {threadTweets.map((t, i) => renderTweetCard(t, isVariants ? undefined : i))}
                </div>

                {/* Thread-level actions (only for actual threads, not variants) */}
                {!isVariants && (
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
                )}
              </div>
            );
          })}
        </div>
      )}

      </>)}
    </div>
  );
}
