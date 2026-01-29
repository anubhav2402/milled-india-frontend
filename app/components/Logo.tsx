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
      {/* Elegant "M" lettermark with envelope fold */}
      {/* Background circle */}
      <circle cx="20" cy="20" r="18" fill="#14b8a6" />
      
      {/* Stylized M that resembles an open envelope */}
      <path
        d="M10 14L20 22L30 14"
        stroke="#fff"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M10 14V26C10 27.1 10.9 28 12 28H28C29.1 28 30 27.1 30 26V14"
        stroke="#fff"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      
      {/* Inner fold lines for depth */}
      <path
        d="M10 26L16 21"
        stroke="#fff"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.6"
      />
      <path
        d="M30 26L24 21"
        stroke="#fff"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.6"
      />
    </svg>
  );
}
