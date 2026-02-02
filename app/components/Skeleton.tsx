"use client";

import React from "react";

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  className?: string;
  style?: React.CSSProperties;
}

export function Skeleton({
  width = "100%",
  height = "20px",
  borderRadius = "8px",
  className = "",
  style = {},
}: SkeletonProps) {
  return (
    <div
      style={{
        width,
        height,
        borderRadius,
        background: "linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.5s infinite",
        ...style,
      }}
      className={className}
    />
  );
}

interface SkeletonCardProps {
  className?: string;
}

export function SkeletonCard({ className = "" }: SkeletonCardProps) {
  return (
    <div
      style={{
        background: "white",
        borderRadius: "14px",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04), 0 4px 20px rgba(0, 0, 0, 0.04)",
        overflow: "hidden",
      }}
      className={className}
    >
      {/* Preview area */}
      <Skeleton width="100%" height="180px" borderRadius="0" />
      
      {/* Content */}
      <div style={{ padding: "20px" }}>
        {/* Brand row */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
          <Skeleton width="36px" height="36px" borderRadius="50%" />
          <div style={{ flex: 1 }}>
            <Skeleton width="120px" height="14px" style={{ marginBottom: "6px" }} />
            <Skeleton width="80px" height="12px" />
          </div>
        </div>
        
        {/* Subject */}
        <Skeleton width="90%" height="18px" style={{ marginBottom: "10px" }} />
        
        {/* Preview text */}
        <Skeleton width="100%" height="14px" style={{ marginBottom: "6px" }} />
        <Skeleton width="70%" height="14px" style={{ marginBottom: "16px" }} />
        
        {/* Badges */}
        <div style={{ display: "flex", gap: "8px" }}>
          <Skeleton width="60px" height="24px" borderRadius="9999px" />
          <Skeleton width="100px" height="24px" borderRadius="9999px" />
        </div>
      </div>
    </div>
  );
}

interface SkeletonTextProps {
  lines?: number;
  className?: string;
}

export function SkeletonText({ lines = 3, className = "" }: SkeletonTextProps) {
  return (
    <div className={className}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          width={i === lines - 1 ? "70%" : "100%"}
          height="14px"
          style={{ marginBottom: i < lines - 1 ? "8px" : 0 }}
        />
      ))}
    </div>
  );
}

export default Skeleton;
