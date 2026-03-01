"use client";

import { useState, useEffect, useRef } from "react";
import Badge from "./Badge";
import { useAuth } from "../context/AuthContext";

type EmailCardProps = {
  id: number;
  subject: string;
  brand?: string;
  preview?: string;
  industry?: string;
  received_at: string;
  sendFrequency?: string;
  campaignType?: string;
  showPreview?: boolean;
  compact?: boolean;
  isBookmarked?: boolean;
  onToggleBookmark?: (id: number) => void;
};

export default function EmailCard({
  id,
  subject,
  brand,
  preview,
  industry,
  received_at,
  sendFrequency,
  campaignType,
  showPreview = true,
  compact = false,
  isBookmarked,
  onToggleBookmark,
}: EmailCardProps) {
  const [html, setHtml] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLAnchorElement>(null);
  const { user, token } = useAuth();

  const brandInitial = brand ? brand.charAt(0).toUpperCase() : "?";
  
  // Format date as relative time
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    
    return date.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
  };

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!showPreview) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "100px", threshold: 0.1 }
    );

    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, [showPreview]);

  // Fetch HTML when visible
  useEffect(() => {
    if (!isVisible || !showPreview || html !== null || isLoading) return;

    const fetchHtml = async () => {
      setIsLoading(true);
      const base = process.env.NEXT_PUBLIC_API_BASE_URL || "https://milled-india-api.onrender.com";

      try {
        const headers: HeadersInit = {};
        if (token) headers.Authorization = `Bearer ${token}`;
        const res = await fetch(`${base}/emails/${id}/html`, { headers });
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
  }, [isVisible, id, html, isLoading, showPreview, token]);

  return (
    <a
      ref={cardRef}
      href={`/email/${id}`}
      style={{
        display: "block",
        backgroundColor: "#fff",
        borderRadius: compact ? 10 : 14,
        overflow: "hidden",
        textDecoration: "none",
        color: "inherit",
        cursor: "pointer",
        boxShadow: isHovered 
          ? "0 8px 30px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(0, 0, 0, 0.04)"
          : "0 1px 3px rgba(0, 0, 0, 0.04), 0 4px 20px rgba(0, 0, 0, 0.04)",
        transform: isHovered ? "translateY(-2px)" : "translateY(0)",
        transition: "all 200ms ease",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Full-bleed Preview */}
      <div
        style={{
          height: compact ? 220 : 420,
          backgroundColor: "#f8fafc",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Campaign Type Badge */}
        {campaignType && (
          <div style={{ position: "absolute", top: 8, left: 8, zIndex: 10 }}>
            <Badge variant="accent">{campaignType}</Badge>
          </div>
        )}

        {/* Bookmark Button */}
        {onToggleBookmark && (
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggleBookmark(id); }}
            style={{
              position: "absolute", top: 8, right: 8, zIndex: 10,
              width: 28, height: 28, borderRadius: 7,
              background: isBookmarked ? "rgba(239,68,68,0.1)" : "rgba(255,255,255,0.9)",
              border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              backdropFilter: "blur(4px)", transition: "all 150ms ease",
            }}
            title={isBookmarked ? "Remove bookmark" : "Bookmark"}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill={isBookmarked ? "#ef4444" : "none"} stroke={isBookmarked ? "#ef4444" : "#64748b"} strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
            </svg>
          </button>
        )}

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
              gap: 10,
              background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
            }}
          >
            {isLoading ? (
              <div
                style={{
                  width: 28,
                  height: 28,
                  border: "2px solid #e2e8f0",
                  borderTopColor: "#C2714A",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite",
                }}
              />
            ) : (
              <>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 11,
                    background: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 600,
                    fontSize: 16,
                    color: "#C2714A",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  }}
                >
                  {brandInitial}
                </div>
                <span style={{ fontSize: 12, color: "#94a3b8" }}>Loading preview...</span>
              </>
            )}
          </div>
        )}

        {/* Overlay bottom bar */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 10,
          background: "linear-gradient(transparent, rgba(0,0,0,0.55))",
          padding: "20px 10px 8px",
          display: "flex", alignItems: "center", gap: 6,
        }}>
          <div
            style={{
              width: 22,
              height: 22,
              borderRadius: 6,
              background: "rgba(255,255,255,0.9)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: 10,
              color: "#C2714A",
              flexShrink: 0,
            }}
          >
            {brandInitial}
          </div>
          <span style={{
            fontSize: 12, fontWeight: 600, color: "#fff",
            textTransform: "capitalize",
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
            flex: 1, minWidth: 0,
            textShadow: "0 1px 2px rgba(0,0,0,0.3)",
          }}>
            {brand || "Unknown"}
          </span>
          <span style={{
            fontSize: 10, color: "rgba(255,255,255,0.8)", whiteSpace: "nowrap", flexShrink: 0,
            textShadow: "0 1px 2px rgba(0,0,0,0.3)",
          }}>
            {formatDate(received_at)}
          </span>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </a>
  );
}

// Skeleton version for loading states
export function EmailCardSkeleton({ compact = false }: { compact?: boolean }) {
  return (
    <div
      style={{
        backgroundColor: "#fff",
        borderRadius: compact ? 10 : 14,
        overflow: "hidden",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04), 0 4px 20px rgba(0, 0, 0, 0.04)",
      }}
    >
      {/* Full preview skeleton */}
      <div
        style={{
          height: compact ? 220 : 420,
          background: "linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)",
          backgroundSize: "200% 100%",
          animation: "shimmer 1.5s infinite",
        }}
      />

      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  );
}
