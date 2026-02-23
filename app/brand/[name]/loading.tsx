import Header from "../../components/Header";

const skel = (w: string | number, h: number, mb = 0): React.CSSProperties => ({
  width: w,
  height: h,
  borderRadius: 6,
  marginBottom: mb,
  animation: "pulse 1.5s ease-in-out infinite",
  background: "var(--color-border)",
});

export default function BrandLoading() {
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
          <div style={skel(240, 28, 16)} />
          <div style={skel("70%", 16, 8)} />
          <div style={skel("50%", 16, 20)} />
          <div style={{ display: "flex", gap: 32 }}>
            {[1, 2, 3, 4].map((i) => (
              <div key={i}>
                <div style={skel(48, 24, 4)} />
                <div style={skel(64, 12)} />
              </div>
            ))}
          </div>
        </div>
        <div
          style={{
            background: "white",
            borderRadius: 14,
            padding: "28px 32px",
            border: "1px solid var(--color-border)",
          }}
        >
          <div style={skel(180, 20, 16)} />
          <div style={skel("90%", 14, 8)} />
          <div style={skel("80%", 14, 8)} />
          <div style={skel("60%", 14)} />
        </div>
      </div>
    </div>
  );
}
