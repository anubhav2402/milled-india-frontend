"use client";

export default function AnnouncementBar() {
  const message = "1000+ emails are added everyday";
  // Repeat the message enough times to create a seamless loop
  const repeated = Array(6).fill(message);

  return (
    <div
      style={{
        background: "linear-gradient(90deg, #C2714A, #A85E3A, #C2714A)",
        overflow: "hidden",
        whiteSpace: "nowrap",
        position: "relative",
        zIndex: 101,
      }}
    >
      <div
        style={{
          display: "inline-flex",
          animation: "marquee 20s linear infinite",
        }}
      >
        {repeated.map((text, i) => (
          <span
            key={i}
            style={{
              fontSize: 12,
              fontWeight: 500,
              color: "white",
              padding: "6px 40px",
              letterSpacing: "0.02em",
            }}
          >
            {text} &nbsp;•&nbsp;
          </span>
        ))}
        {/* Duplicate for seamless loop */}
        {repeated.map((text, i) => (
          <span
            key={`dup-${i}`}
            style={{
              fontSize: 12,
              fontWeight: 500,
              color: "white",
              padding: "6px 40px",
              letterSpacing: "0.02em",
            }}
          >
            {text} &nbsp;•&nbsp;
          </span>
        ))}
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
