"use client";

import React from "react";

interface ScoreBadgeProps {
  score: number;
  grade: string;
  size?: "sm" | "md";
}

function getScoreColor(score: number): string {
  if (score >= 85) return "#10b981"; // green
  if (score >= 70) return "#3b82f6"; // blue
  if (score >= 60) return "#f59e0b"; // yellow
  return "#ef4444"; // red
}

export default function ScoreBadge({ score, grade, size = "sm" }: ScoreBadgeProps) {
  const color = getScoreColor(score);
  const dimension = size === "sm" ? 36 : 48;
  const fontSize = size === "sm" ? 11 : 14;
  const gradeSize = size === "sm" ? 9 : 11;

  return (
    <div
      style={{
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: dimension,
        height: dimension,
        borderRadius: "50%",
        border: `2px solid ${color}`,
        background: `${color}10`,
        cursor: "default",
      }}
      title={`Email Score: ${score}/100 (${grade})`}
    >
      <span style={{ fontSize, fontWeight: 700, color, lineHeight: 1 }}>
        {score}
      </span>
      <span style={{ fontSize: gradeSize, fontWeight: 500, color, lineHeight: 1, marginTop: 1 }}>
        {grade}
      </span>
    </div>
  );
}
