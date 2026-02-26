"use client";

type UsageMeterProps = {
  used: number;
  limit: number | null;
  label: string;
  showText?: boolean;
};

export default function UsageMeter({ used, limit, label, showText = true }: UsageMeterProps) {
  if (limit === null) {
    // Unlimited — show simple text
    return showText ? (
      <span style={{ fontSize: 12, color: "var(--color-secondary)" }}>
        {label}: {used} used (unlimited)
      </span>
    ) : null;
  }

  const pct = Math.min(100, (used / limit) * 100);
  const isWarning = pct >= 80;
  const isAtLimit = pct >= 100;

  const barColor = isAtLimit
    ? "#dc2626"
    : isWarning
      ? "#d97706"
      : "var(--color-accent)";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {showText && (
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
          <span style={{ color: "var(--color-secondary)" }}>{label}</span>
          <span style={{ color: isAtLimit ? "#dc2626" : isWarning ? "#d97706" : "var(--color-secondary)", fontWeight: 500 }}>
            {used} / {limit}
          </span>
        </div>
      )}
      <div
        style={{
          height: 6,
          borderRadius: 3,
          background: "var(--color-border)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            borderRadius: 3,
            background: barColor,
            transition: "width 0.3s ease",
          }}
        />
      </div>
    </div>
  );
}
