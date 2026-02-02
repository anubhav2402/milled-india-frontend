"use client";

import React from "react";

interface CardProps {
  children: React.ReactNode;
  padding?: "none" | "sm" | "md" | "lg";
  hover?: boolean;
  onClick?: () => void;
  href?: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function Card({
  children,
  padding = "md",
  hover = false,
  onClick,
  href,
  className = "",
  style = {},
}: CardProps) {
  const [isHovered, setIsHovered] = React.useState(false);

  const paddingStyles: Record<string, React.CSSProperties> = {
    none: { padding: 0 },
    sm: { padding: "16px" },
    md: { padding: "24px" },
    lg: { padding: "32px" },
  };

  const baseStyles: React.CSSProperties = {
    background: "white",
    borderRadius: "14px",
    boxShadow: isHovered && hover
      ? "0 8px 30px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(0, 0, 0, 0.04)"
      : "0 1px 3px rgba(0, 0, 0, 0.04), 0 4px 20px rgba(0, 0, 0, 0.04)",
    transition: "all 200ms ease",
    transform: isHovered && hover ? "translateY(-2px)" : "translateY(0)",
    cursor: hover || onClick || href ? "pointer" : "default",
    overflow: "hidden",
    ...paddingStyles[padding],
    ...style,
  };

  const handleClick = () => {
    if (href) {
      window.location.href = href;
    } else if (onClick) {
      onClick();
    }
  };

  return (
    <div
      style={baseStyles}
      className={className}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </div>
  );
}
