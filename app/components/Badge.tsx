"use client";

import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "accent" | "success" | "warning" | "error";
  size?: "sm" | "md";
  className?: string;
  style?: React.CSSProperties;
}

export default function Badge({
  children,
  variant = "default",
  size = "sm",
  className = "",
  style = {},
}: BadgeProps) {
  const baseStyles: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    fontWeight: 500,
    borderRadius: "9999px",
    whiteSpace: "nowrap",
  };

  const sizeStyles: Record<string, React.CSSProperties> = {
    sm: {
      padding: "4px 10px",
      fontSize: "11px",
      letterSpacing: "0.02em",
    },
    md: {
      padding: "6px 12px",
      fontSize: "12px",
    },
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    default: {
      background: "#f8fafc",
      color: "#64748b",
      border: "1px solid #e2e8f0",
    },
    accent: {
      background: "#F5E6DC",
      color: "#A85E3A",
      border: "1px solid transparent",
    },
    success: {
      background: "#dcfce7",
      color: "#16a34a",
      border: "1px solid transparent",
    },
    warning: {
      background: "#fef3c7",
      color: "#d97706",
      border: "1px solid transparent",
    },
    error: {
      background: "#fee2e2",
      color: "#dc2626",
      border: "1px solid transparent",
    },
  };

  return (
    <span
      style={{
        ...baseStyles,
        ...sizeStyles[size],
        ...variantStyles[variant],
        ...style,
      }}
      className={className}
    >
      {children}
    </span>
  );
}
