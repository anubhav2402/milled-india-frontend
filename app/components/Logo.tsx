export default function Logo({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "inline-block", verticalAlign: "middle", marginRight: 10 }}
    >
      {/* Apple/Nike style - minimal, iconic, single shape */}
      {/* Abstract "M" formed by envelope opening - clean geometric design */}
      <path
        d="M4 12L20 24L36 12"
        stroke="#C2714A"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M4 12L4 30L36 30L36 12"
        stroke="#C2714A"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
