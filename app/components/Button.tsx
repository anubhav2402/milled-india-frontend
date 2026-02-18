"use client";

import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  href?: string;
  type?: "button" | "submit" | "reset";
  className?: string;
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  disabled = false,
  loading = false,
  onClick,
  href,
  type = "button",
  className = "",
}: ButtonProps) {
  const baseStyles: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    fontWeight: 500,
    borderRadius: "10px",
    cursor: disabled || loading ? "not-allowed" : "pointer",
    transition: "all 150ms ease",
    border: "none",
    textDecoration: "none",
    opacity: disabled ? 0.5 : 1,
    width: fullWidth ? "100%" : "auto",
  };

  const sizeStyles: Record<string, React.CSSProperties> = {
    sm: { padding: "8px 16px", fontSize: "13px" },
    md: { padding: "12px 24px", fontSize: "14px" },
    lg: { padding: "16px 32px", fontSize: "16px" },
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
      background: "#C2714A",
      color: "white",
    },
    secondary: {
      background: "white",
      color: "#0f172a",
      border: "1px solid #e2e8f0",
    },
    ghost: {
      background: "transparent",
      color: "#475569",
    },
  };

  const hoverStyles: Record<string, React.CSSProperties> = {
    primary: {
      background: "#A85E3A",
      transform: "translateY(-1px)",
      boxShadow: "0 4px 12px rgba(194, 113, 74, 0.3)",
    },
    secondary: {
      borderColor: "#cbd5e1",
      background: "#f8fafc",
    },
    ghost: {
      background: "#f8fafc",
      color: "#0f172a",
    },
  };

  const [isHovered, setIsHovered] = React.useState(false);

  const combinedStyles: React.CSSProperties = {
    ...baseStyles,
    ...sizeStyles[size],
    ...variantStyles[variant],
    ...(isHovered && !disabled && !loading ? hoverStyles[variant] : {}),
  };

  const content = (
    <>
      {loading && (
        <svg
          style={{
            width: "16px",
            height: "16px",
            animation: "spin 1s linear infinite",
          }}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
          <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
        </svg>
      )}
      {children}
    </>
  );

  if (href && !disabled) {
    return (
      <a
        href={href}
        style={combinedStyles}
        className={className}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type={type}
      style={combinedStyles}
      className={className}
      onClick={onClick}
      disabled={disabled || loading}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {content}
    </button>
  );
}
