import Header from "../../components/Header";

const skel = (w: string | number, h: number, mb = 0): React.CSSProperties => ({
  width: w,
  height: h,
  borderRadius: 6,
  marginBottom: mb,
  animation: "pulse 1.5s ease-in-out infinite",
  background: "var(--color-border)",
});

export default function CompareLoading() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--color-surface)" }}>
      <Header />
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px" }}>
        <div
          style={{
            background: "white",
            borderRadius: 14,
            padding: "32px 36px",
            border: "1px solid var(--color-border)",
            marginBottom: 24,
          }}
        >
          <div style={skel(360, 28, 12)} />
          <div style={skel("80%", 16, 8)} />
          <div style={skel("60%", 16)} />
        </div>
        <div
          style={{
            background: "white",
            borderRadius: 14,
            padding: "28px 32px",
            border: "1px solid var(--color-border)",
          }}
        >
          <div style={skel(220, 20, 16)} />
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "10px 12px",
                borderBottom: "1px solid var(--color-border)",
              }}
            >
              <div style={skel(100, 14)} />
              <div style={skel(60, 14)} />
              <div style={skel(60, 14)} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
