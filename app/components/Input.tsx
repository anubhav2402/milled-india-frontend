"use client";

import React from "react";

interface InputProps {
  type?: "text" | "email" | "password" | "search";
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  fullWidth?: boolean;
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export default function Input({
  type = "text",
  placeholder,
  value,
  onChange,
  onKeyDown,
  disabled = false,
  fullWidth = true,
  size = "md",
  icon,
  className = "",
  style = {},
}: InputProps) {
  const [isFocused, setIsFocused] = React.useState(false);

  const sizeStyles: Record<string, React.CSSProperties> = {
    sm: { padding: "10px 14px", fontSize: "13px" },
    md: { padding: "14px 18px", fontSize: "15px" },
    lg: { padding: "18px 22px", fontSize: "16px" },
  };

  const containerStyles: React.CSSProperties = {
    position: "relative",
    width: fullWidth ? "100%" : "auto",
    display: "flex",
    alignItems: "center",
  };

  const inputStyles: React.CSSProperties = {
    width: "100%",
    color: "#0f172a",
    background: "white",
    border: isFocused ? "1px solid #C2714A" : "1px solid #e2e8f0",
    borderRadius: "10px",
    outline: "none",
    transition: "all 150ms ease",
    boxShadow: isFocused ? "0 0 0 3px rgba(194, 113, 74, 0.1)" : "none",
    opacity: disabled ? 0.5 : 1,
    cursor: disabled ? "not-allowed" : "text",
    ...sizeStyles[size],
    paddingLeft: icon ? "48px" : undefined,
    ...style,
  };

  const iconStyles: React.CSSProperties = {
    position: "absolute",
    left: "16px",
    color: isFocused ? "#C2714A" : "#94a3b8",
    transition: "color 150ms ease",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
  };

  return (
    <div style={containerStyles} className={className}>
      {icon && <span style={iconStyles}>{icon}</span>}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        disabled={disabled}
        style={inputStyles}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
    </div>
  );
}
