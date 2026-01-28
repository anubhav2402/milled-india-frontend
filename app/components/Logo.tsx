export default function Logo({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "inline-block", verticalAlign: "middle", marginRight: 8 }}
    >
      {/* Mail icon with muse/creative element */}
      <rect x="6" y="10" width="28" height="20" rx="3" fill="#14b8a6" />
      <path
        d="M6 13L20 23L34 13"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Decorative sparkle/muse element */}
      <circle cx="30" cy="8" r="2" fill="#14b8a6" opacity="0.8" />
      <path
        d="M30 4L30 6M30 10L30 12M26 8L28 8M32 8L34 8"
        stroke="#14b8a6"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
