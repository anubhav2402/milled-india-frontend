import type { Metadata } from "next";
import { Suspense } from "react";
import EditorClient from "./EditorClient";

export const metadata: Metadata = {
  title: "Template Editor | MailMuse",
  description:
    "Customize email templates with our drag-and-drop editor. Edit text, colors, images, and layout, then export your design.",
  robots: { index: false, follow: false },
};

function EditorLoadingSkeleton() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#2d2d2d",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            width: 40,
            height: 40,
            border: "3px solid #555",
            borderTopColor: "#C2714A",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            margin: "0 auto 16px",
          }}
        />
        <p style={{ color: "#aaa", fontSize: 14 }}>Loading editor...</p>
      </div>
    </div>
  );
}

export default function EditorPage() {
  return (
    <Suspense fallback={<EditorLoadingSkeleton />}>
      <EditorClient />
    </Suspense>
  );
}
