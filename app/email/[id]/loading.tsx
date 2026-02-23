import Header from "../../components/Header";

const skel = (w: string | number, h: number, mb = 0): React.CSSProperties => ({
  width: w,
  height: h,
  borderRadius: 6,
  marginBottom: mb,
  animation: "pulse 1.5s ease-in-out infinite",
  background: "var(--color-border)",
});

export default function EmailLoading() {
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
          <div style={skel(120, 14, 12)} />
          <div style={skel("80%", 24, 8)} />
          <div style={skel(200, 14, 20)} />
          <div style={skel("100%", 400)} />
        </div>
      </div>
    </div>
  );
}
