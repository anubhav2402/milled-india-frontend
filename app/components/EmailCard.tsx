"use client";

import { useState, useEffect, useRef } from "react";

type EmailCardProps = {
  id: number;
  subject: string;
  brand?: string;
  preview?: string;
  industry?: string;
  received_at: string;
  sendFrequency?: string; // e.g., "3x/week"
  campaignType?: string; // e.g., "Sale", "Welcome", etc.
};

export default function EmailCard({ id, subject, brand, preview, industry, received_at, sendFrequency, campaignType }: EmailCardProps) {
  const [html, setHtml] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const cardRef = useRef<HTMLAnchorElement>(null);

  const copySubject = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(subject);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const brandInitial = brand ? brand.charAt(0).toUpperCase() : "?";
  const receivedDate = new Date(received_at);
  const formattedDate = receivedDate.toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
  });

  // Intersection Observer to detect when card is visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Only need to detect once
        }
      },
      {
        rootMargin: "100px", // Start loading 100px before visible
        threshold: 0.1,
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Fetch HTML when card becomes visible
  useEffect(() => {
    if (!isVisible || html !== null || isLoading) return;

    const fetchHtml = async () => {
      setIsLoading(true);
      const base = process.env.NEXT_PUBLIC_API_BASE_URL;
      if (!base) return;

      try {
        const res = await fetch(`${base}/emails/${id}/html`);
        if (res.ok) {
          const data = await res.json();
          setHtml(data.html);
        }
      } catch (error) {
        console.error("Failed to fetch email HTML:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHtml();
  }, [isVisible, id, html, isLoading]);

  return (
    <a
      ref={cardRef}
      href={`/email/${id}`}
      style={{
        backgroundColor: "#fff",
        borderRadius: 14,
        border: "1px solid #e2e8f0",
        display: "flex",
        flexDirection: "column",
        transition: "all 0.2s",
        overflow: "hidden",
        position: "relative",
        textDecoration: "none",
        color: "inherit",
        cursor: "pointer",
      }}
      className="hover-button"
    >
      {/* Campaign Type Badge */}
      {campaignType && (
        <div
          style={{
            position: "absolute",
            top: 12,
            left: 12,
            padding: "4px 10px",
            backgroundColor: "rgba(20, 184, 166, 0.9)",
            color: "#fff",
            fontSize: 10,
            fontWeight: 600,
            borderRadius: 12,
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            zIndex: 10,
          }}
        >
          {campaignType}
        </div>
      )}

      {/* Copy Button - positioned absolutely */}
      <button
        onClick={copySubject}
        title="Copy subject line"
        style={{
          position: "absolute",
          top: 12,
          right: 12,
          background: copied ? "#14b8a6" : "rgba(255, 255, 255, 0.95)",
          border: "none",
          borderRadius: 8,
          padding: "8px 10px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.2s",
          zIndex: 10,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        {copied ? (
          <svg width="14" height="14" fill="none" stroke="#fff" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg width="14" height="14" fill="none" stroke="#64748b" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        )}
      </button>

      {/* Email Preview - Scaled iframe */}
      <div
        style={{
          height: 200,
          backgroundColor: "#f8fafc",
          borderBottom: "1px solid #e2e8f0",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {html ? (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "300%",
              height: "300%",
              transform: "scale(0.333)",
              transformOrigin: "top left",
              pointerEvents: "none",
            }}
          >
            <iframe
              srcDoc={`<!DOCTYPE html><html><head><meta charset="utf-8"><base target="_blank"><style>body{margin:0;padding:0;overflow:hidden;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;}img{max-width:100%;height:auto;}</style></head><body>${html}</body></html>`}
              style={{
                width: "100%",
                height: "100%",
                border: "none",
                display: "block",
              }}
              sandbox="allow-same-origin"
              title={`Preview of ${subject}`}
            />
          </div>
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              gap: 8,
              background: "linear-gradient(135deg, #f0fdfa 0%, #e0f2fe 100%)",
            }}
          >
            {isLoading ? (
              <>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    border: "3px solid #e2e8f0",
                    borderTopColor: "#14b8a6",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite",
                  }}
                />
                <span style={{ fontSize: 12, color: "#64748b" }}>Loading preview...</span>
              </>
            ) : (
              <>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    background: "#fff",
                    borderRadius: 12,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    color: "#14b8a6",
                    fontSize: 20,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                  }}
                >
                  {brandInitial}
                </div>
                <span style={{ fontSize: 12, color: "#64748b" }}>Email Preview</span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Card Content */}
      <div style={{ padding: 16 }}>
        {/* Brand header */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              background: "#f0fdfa",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              color: "#14b8a6",
              fontSize: 14,
              flexShrink: 0,
            }}
          >
            {brandInitial}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "#1a1a1a",
                textTransform: "capitalize",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {brand || "Unknown"}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              {industry && (
                <span style={{ fontSize: 11, color: "#14b8a6", fontWeight: 500 }}>{industry}</span>
              )}
              {sendFrequency && (
                <>
                  {industry && <span style={{ color: "#cbd5e1" }}>•</span>}
                  <span style={{ fontSize: 10, color: "#94a3b8", fontWeight: 500 }}>
                    📬 {sendFrequency}
                  </span>
                </>
              )}
            </div>
          </div>
          <time style={{ fontSize: 11, color: "#94a3b8", flexShrink: 0 }}>{formattedDate}</time>
        </div>

        {/* Subject */}
        <h3
          style={{
            margin: "0 0 6px 0",
            fontSize: 14,
            fontWeight: 600,
            color: "#1a1a1a",
            lineHeight: 1.4,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {subject}
        </h3>

        {/* Preview text */}
        {preview && (
          <p
            style={{
              margin: 0,
              fontSize: 12,
              color: "#64748b",
              lineHeight: 1.5,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {preview}
          </p>
        )}
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </a>
  );
}
