"use client";

import { useState, useEffect, useRef } from "react";

type EmailCardProps = {
  id: number;
  subject: string;
  brand?: string;
  preview?: string;
  industry?: string;
  received_at: string;
};

export default function EmailCard({ id, subject, brand, preview, industry, received_at }: EmailCardProps) {
  const [html, setHtml] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const cardRef = useRef<HTMLAnchorElement>(null);

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
        textDecoration: "none",
        color: "inherit",
        display: "flex",
        flexDirection: "column",
        transition: "all 0.2s",
        cursor: "pointer",
        overflow: "hidden",
      }}
      className="hover-button"
    >
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
            {industry && (
              <div style={{ fontSize: 11, color: "#14b8a6", fontWeight: 500 }}>{industry}</div>
            )}
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
