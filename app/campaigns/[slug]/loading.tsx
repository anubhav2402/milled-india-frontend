import Header from "../../components/Header";

const skel = (w: string | number, h: number, mb = 0): React.CSSProperties => ({
  width: w,
  height: h,
  borderRadius: 6,
  marginBottom: mb,
  animation: "pulse 1.5s ease-in-out infinite",
  background: "var(--color-border)",
});

export default function CampaignLoading() {
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
          <div style={skel(300, 28, 8)} />
          <div style={skel(180, 14, 20)} />
          <div style={{ display: "flex", gap: 32, marginBottom: 20 }}>
            {[1, 2, 3, 4].map((i) => (
              <div key={i}>
                <div style={skel(48, 24, 4)} />
                <div style={skel(64, 12)} />
              </div>
            ))}
          </div>
          <div style={skel("85%", 14, 8)} />
          <div style={skel("70%", 14)} />
        </div>
        <div
          style={{
            background: "white",
            borderRadius: 14,
            padding: "28px 32px",
            border: "1px solid var(--color-border)",
          }}
        >
          <div style={skel(200, 20, 16)} />
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              style={{
                padding: "8px 12px",
                borderRadius: 8,
                background: "var(--color-surface)",
                marginBottom: 8,
              }}
            >
              <div style={skel("75%", 14, 4)} />
              <div style={skel(80, 12)} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
