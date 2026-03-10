"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import EmailCard, { EmailCardSkeleton } from "./EmailCard";
import { CAMPAIGN_TYPE_COLORS } from "../lib/constants";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://milled-india-api.onrender.com";

interface Email {
  id: number;
  subject: string;
  brand: string;
  preview: string;
  industry: string;
  received_at: string;
  type: string;
  sender?: string;
}

function logoUrlFromSender(sender: string | null | undefined): string | undefined {
  if (!sender) return undefined;
  const match = sender.match(/@([^\s>]+)/);
  if (!match) return undefined;
  const parts = match[1].split(".");
  const domain =
    parts.length > 2 && ["co", "com", "org", "net"].includes(parts[parts.length - 2])
      ? parts.slice(-3).join(".")
      : parts.slice(-2).join(".");
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
}

function TypeRow({
  typeName,
  typeSlug,
}: {
  typeName: string;
  typeSlug: string;
}) {
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Only fetch when section scrolls into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px", threshold: 0 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    const fetchEmails = async () => {
      try {
        const res = await fetch(
          `${API_BASE}/emails?type=${encodeURIComponent(typeName)}&limit=10&offset=0`
        );
        if (res.ok) {
          const data = await res.json();
          setEmails(data.emails || data || []);
        }
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    };
    fetchEmails();
  }, [isVisible, typeName]);

  const updateScrollButtons = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScrollButtons();
    el.addEventListener("scroll", updateScrollButtons, { passive: true });
    const ro = new ResizeObserver(updateScrollButtons);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", updateScrollButtons);
      ro.disconnect();
    };
  }, [emails, updateScrollButtons]);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = 240;
    el.scrollBy({
      left: direction === "left" ? -cardWidth * 2 : cardWidth * 2,
      behavior: "smooth",
    });
  };

  const color = CAMPAIGN_TYPE_COLORS[typeName] || "#C2714A";

  return (
    <div ref={sectionRef} style={{ marginBottom: 32 }}>
      {/* Header row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 14,
          gap: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 6,
              height: 22,
              borderRadius: 3,
              background: color,
              flexShrink: 0,
            }}
          />
          <h2
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: "var(--color-primary)",
              margin: 0,
              fontFamily: "var(--font-bricolage)",
            }}
          >
            {typeName} Emails
          </h2>
        </div>
        <Link
          href={`/types/${typeSlug}`}
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: "var(--color-accent)",
            textDecoration: "none",
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          View all →
        </Link>
      </div>

      {/* Carousel */}
      <div style={{ position: "relative" }}>
        {/* Left arrow */}
        {canScrollLeft && (
          <button
            onClick={() => scroll("left")}
            style={{
              position: "absolute",
              left: -6,
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 10,
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "white",
              border: "1px solid var(--color-border)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
              color: "var(--color-primary)",
            }}
            aria-label="Scroll left"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        )}

        {/* Right arrow */}
        {canScrollRight && (
          <button
            onClick={() => scroll("right")}
            style={{
              position: "absolute",
              right: -6,
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 10,
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "white",
              border: "1px solid var(--color-border)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
              color: "var(--color-primary)",
            }}
            aria-label="Scroll right"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        )}

        {/* Scrollable track */}
        <div
          ref={scrollRef}
          style={{
            display: "flex",
            gap: 14,
            overflowX: "auto",
            scrollbarWidth: "none",
            padding: "4px 2px",
          }}
        >
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  style={{ flex: "0 0 220px", minWidth: 220 }}
                >
                  <EmailCardSkeleton compact previewHeight={260} />
                </div>
              ))
            : emails.map((email) => (
                <div
                  key={email.id}
                  style={{ flex: "0 0 220px", minWidth: 220 }}
                >
                  <EmailCard
                    id={email.id}
                    subject={email.subject}
                    brand={email.brand}
                    preview={email.preview}
                    industry={email.industry}
                    received_at={email.received_at}
                    campaignType={email.type}
                    compact
                    previewHeight={260}
                    logoUrl={logoUrlFromSender(email.sender)}
                  />
                </div>
              ))}
          {!loading && emails.length === 0 && (
            <div
              style={{
                padding: "32px 20px",
                color: "var(--color-tertiary)",
                fontSize: 14,
              }}
            >
              No emails found for this type.
            </div>
          )}
        </div>
      </div>

      {/* Hide scrollbar CSS */}
      <style>{`
        div::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}

export default function TypeCarousels({
  types,
}: {
  types: { name: string; slug: string }[];
}) {
  return (
    <div>
      {types.map(({ name, slug }) => (
        <TypeRow key={slug} typeName={name} typeSlug={slug} />
      ))}
    </div>
  );
}
