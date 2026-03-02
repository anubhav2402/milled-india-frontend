"use client";

import { useState } from "react";

type BrandLogoProps = {
  brandName: string;
  logoUrl?: string | null;
  size?: number;
  borderRadius?: number;
  /** Color for fallback initial. If not provided, auto-computed from brand name. */
  color?: string;
  /** Background style for fallback. If not provided, uses light gradient of the color. */
  fallbackBg?: string;
  style?: React.CSSProperties;
};

const BRAND_COLORS = [
  "#C2714A", "#6366f1", "#f59e0b", "#ec4899", "#8b5cf6",
  "#059669", "#3b82f6", "#ef4444", "#84cc16", "#0ea5e9",
];

function getBrandColor(name: string): string {
  const idx = name.charCodeAt(0) % BRAND_COLORS.length;
  return BRAND_COLORS[idx];
}

export default function BrandLogo({
  brandName,
  logoUrl,
  size = 40,
  borderRadius,
  color,
  fallbackBg,
  style,
}: BrandLogoProps) {
  const [imgError, setImgError] = useState(false);
  const brandColor = color || getBrandColor(brandName);
  const initial = brandName ? brandName.charAt(0).toUpperCase() : "?";
  const radius = borderRadius ?? Math.round(size * 0.25);
  const fontSize = Math.max(10, Math.round(size * 0.42));

  const showImage = logoUrl && !imgError;

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        background: showImage
          ? "#fff"
          : fallbackBg || `linear-gradient(135deg, ${brandColor}20 0%, ${brandColor}10 100%)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        overflow: "hidden",
        ...style,
      }}
    >
      {showImage ? (
        <img
          src={logoUrl}
          alt={`${brandName} logo`}
          width={size}
          height={size}
          style={{
            width: size,
            height: size,
            objectFit: "contain",
            display: "block",
          }}
          onError={() => setImgError(true)}
        />
      ) : (
        <span
          style={{
            fontWeight: 700,
            color: brandColor,
            fontSize,
            lineHeight: 1,
            userSelect: "none",
          }}
        >
          {initial}
        </span>
      )}
    </div>
  );
}
