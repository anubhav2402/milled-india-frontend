import Header from "../../components/Header";

const skel = (w: string | number, h: number, mb = 0): React.CSSProperties => ({
  width: w,
  height: h,
  borderRadius: 6,
  marginBottom: mb,
  animation: "pulse 1.5s ease-in-out infinite",
  background: "var(--color-border)",
});

export default function IndustryLoading() {
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
          <div style={skel(280, 28, 12)} />
          <div style={skel("65%", 16, 8)} />
          <div style={skel("45%", 16, 20)} />
          <div style={{ display: "flex", gap: 32 }}>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i}>
                <div style={skel(48, 24, 4)} />
                <div style={skel(64, 12)} />
              </div>
            ))}
          </div>
        </div>
        <div style={skel(160, 20, 16)} />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 16,
          }}
        >
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              style={{
                background: "white",
                borderRadius: 12,
                padding: "16px 20px",
                border: "1px solid var(--color-border)",
                display: "flex",
                alignItems: "center",
                gap: 14,
              }}
            >
              <div style={skel(40, 40)} />
              <div style={{ flex: 1 }}>
                <div style={skel(120, 14, 4)} />
                <div style={skel(60, 12)} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
