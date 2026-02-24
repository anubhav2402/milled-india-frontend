"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import type { Editor } from "grapesjs";
import { preprocessEmailHtml } from "./utils";
import { API_BASE } from "../lib/constants";
import Logo from "../components/Logo";

export default function EditorClient() {
  const searchParams = useSearchParams();
  const emailId = searchParams.get("id");
  const [editorInstance, setEditorInstance] = useState<Editor | null>(null);
  const [emailMeta, setEmailMeta] = useState<{
    subject: string;
    brand: string;
  } | null>(null);
  const [loading, setLoading] = useState(!!emailId);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [exportState, setExportState] = useState<
    "idle" | "copied" | "downloaded"
  >("idle");
  const [isMobile, setIsMobile] = useState(false);
  const [editorReady, setEditorReady] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 900);
  }, []);

  const fetchAndLoadEmail = useCallback(
    async (editor: Editor, id: string) => {
      setLoading(true);
      setLoadError(null);
      try {
        const res = await fetch(`${API_BASE}/emails/${id}`);
        if (!res.ok) throw new Error(`Failed to load email (${res.status})`);
        const data = await res.json();
        setEmailMeta({ subject: data.subject, brand: data.brand || "Unknown" });
        const cleanHtml = preprocessEmailHtml(data.html);
        editor.setComponents(cleanHtml);
      } catch (err) {
        setLoadError(
          err instanceof Error ? err.message : "Failed to load email"
        );
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const onEditorReady = useCallback(
    (editor: Editor) => {
      setEditorInstance(editor);
      setEditorReady(true);
      if (emailId) {
        fetchAndLoadEmail(editor, emailId);
      }
    },
    [emailId, fetchAndLoadEmail]
  );

  const wrapInDocument = (content: string): string => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
</head>
<body style="margin:0;padding:0;">
${content}
</body>
</html>`;
  };

  const getExportHtml = useCallback((): string => {
    if (!editorInstance) return "";
    try {
      const inlinedHtml = editorInstance.runCommand("gjs-get-inlined-html");
      if (inlinedHtml) return wrapInDocument(inlinedHtml);
    } catch {
      // fallback below
    }
    const html = editorInstance.getHtml();
    const css = editorInstance.getCss();
    return wrapInDocument(`<style>${css}</style>${html}`);
  }, [editorInstance]);

  const copyToClipboard = useCallback(async () => {
    const html = getExportHtml();
    if (!html) return;
    try {
      await navigator.clipboard.writeText(html);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = html;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setExportState("copied");
    setTimeout(() => setExportState("idle"), 2500);
  }, [getExportHtml]);

  const downloadHtml = useCallback(() => {
    const html = getExportHtml();
    if (!html) return;
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = emailMeta
      ? `${emailMeta.brand}-${emailMeta.subject
          .slice(0, 40)
          .replace(/[^a-zA-Z0-9]/g, "-")}.html`
      : "mailmuse-template.html";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setExportState("downloaded");
    setTimeout(() => setExportState("idle"), 2500);
  }, [getExportHtml, emailMeta]);

  // Mobile gate
  if (isMobile) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "var(--color-surface)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 32,
          textAlign: "center",
        }}
      >
        <Logo size={48} />
        <h1
          style={{
            fontFamily: "var(--font-dm-serif)",
            fontSize: 24,
            marginTop: 24,
            color: "var(--color-primary)",
          }}
        >
          Desktop Required
        </h1>
        <p
          style={{
            color: "var(--color-secondary)",
            maxWidth: 360,
            marginTop: 12,
            lineHeight: 1.6,
          }}
        >
          The template editor works best on desktop. Please open this page on a
          laptop or desktop computer.
        </p>
        <Link
          href={emailId ? `/email/${emailId}` : "/browse"}
          style={{
            marginTop: 24,
            display: "inline-flex",
            padding: "12px 24px",
            background: "var(--color-accent)",
            color: "white",
            borderRadius: 10,
            textDecoration: "none",
            fontWeight: 500,
            fontSize: 14,
          }}
        >
          Go Back
        </Link>
      </div>
    );
  }

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Custom top bar */}
      <div
        style={{
          height: 52,
          background: "#1C1917",
          borderBottom: "1px solid #333",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 16px",
          zIndex: 10,
          flexShrink: 0,
        }}
      >
        {/* Left: logo + breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              textDecoration: "none",
            }}
          >
            <Logo size={24} />
            <span
              style={{
                fontFamily: "var(--font-dm-serif)",
                fontSize: 16,
                color: "#fff",
              }}
            >
              Mail <em style={{ fontStyle: "italic", color: "#C2714A" }}>Muse</em>
            </span>
          </Link>
          <span style={{ color: "#555", fontSize: 14 }}>/</span>
          <span style={{ color: "#aaa", fontSize: 13 }}>Template Editor</span>
          {emailMeta && (
            <>
              <span style={{ color: "#555", fontSize: 14 }}>/</span>
              <span
                style={{
                  color: "#999",
                  fontSize: 12,
                  maxWidth: 200,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {emailMeta.brand}: {emailMeta.subject}
              </span>
            </>
          )}
        </div>

        {/* Right: export buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {emailId && (
            <Link
              href={`/email/${emailId}`}
              style={{
                fontSize: 12,
                color: "#999",
                textDecoration: "none",
                padding: "6px 12px",
                border: "1px solid #444",
                borderRadius: 6,
              }}
            >
              Back to Email
            </Link>
          )}
          <button
            onClick={copyToClipboard}
            disabled={!editorReady}
            style={{
              fontSize: 12,
              fontWeight: 500,
              padding: "8px 16px",
              borderRadius: 6,
              cursor: editorReady ? "pointer" : "not-allowed",
              border: "1px solid #444",
              background:
                exportState === "copied" ? "#166534" : "#333",
              color:
                exportState === "copied" ? "#86efac" : "#eee",
              transition: "all 150ms ease",
              opacity: editorReady ? 1 : 0.5,
            }}
          >
            {exportState === "copied" ? "Copied!" : "Copy HTML"}
          </button>
          <button
            onClick={downloadHtml}
            disabled={!editorReady}
            style={{
              fontSize: 12,
              fontWeight: 500,
              padding: "8px 16px",
              borderRadius: 6,
              cursor: editorReady ? "pointer" : "not-allowed",
              border: "none",
              background: "#C2714A",
              color: "white",
              transition: "all 150ms ease",
              opacity: editorReady ? 1 : 0.5,
            }}
          >
            {exportState === "downloaded" ? "Downloaded!" : "Download .html"}
          </button>
        </div>
      </div>

      {/* Loading overlay */}
      {loading && (
        <div
          style={{
            position: "absolute",
            top: 52,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 50,
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                width: 32,
                height: 32,
                border: "3px solid #555",
                borderTopColor: "#C2714A",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
                margin: "0 auto 12px",
              }}
            />
            <p style={{ color: "#ccc", fontSize: 14 }}>Loading template...</p>
          </div>
        </div>
      )}

      {/* Error state */}
      {loadError && (
        <div
          style={{
            position: "absolute",
            top: 52,
            left: 0,
            right: 0,
            background: "#7f1d1d",
            color: "#fca5a5",
            padding: "10px 16px",
            fontSize: 13,
            textAlign: "center",
            zIndex: 40,
          }}
        >
          {loadError}
          <button
            onClick={() => setLoadError(null)}
            style={{
              marginLeft: 12,
              background: "none",
              border: "none",
              color: "#fca5a5",
              textDecoration: "underline",
              cursor: "pointer",
              fontSize: 13,
            }}
          >
            Dismiss
          </button>
        </div>
      )}

      {/* GrapesJS Editor */}
      <GrapesJSEditor onReady={onEditorReady} />
    </div>
  );
}

/**
 * Separate component that handles the dynamic grapesjs imports.
 * This keeps the heavy imports isolated and ensures they only run client-side.
 */
function GrapesJSEditor({ onReady }: { onReady: (editor: Editor) => void }) {
  const [GjsEditor, setGjsEditor] = useState<React.ComponentType<any> | null>(
    null
  );
  const [grapesjs, setGrapesjs] = useState<any>(null);
  const [newsletterPlugin, setNewsletterPlugin] = useState<any>(null);

  useEffect(() => {
    // Dynamically import grapesjs modules client-side
    Promise.all([
      import("grapesjs"),
      import("@grapesjs/react"),
      import("grapesjs-preset-newsletter"),
    ]).then(([gjsModule, reactModule, presetModule]) => {
      setGrapesjs(gjsModule.default);
      setGjsEditor(() => reactModule.default);
      setNewsletterPlugin(() => presetModule.default);
    });
  }, []);

  if (!GjsEditor || !grapesjs || !newsletterPlugin) {
    return (
      <div
        style={{
          flex: 1,
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

  return (
    <div style={{ flex: 1 }}>
      <GjsEditor
        grapesjs={grapesjs}
        grapesjsCss="https://unpkg.com/grapesjs/dist/css/grapes.min.css"
        options={{
          height: "100%",
          storageManager: false,
          undoManager: { trackSelection: false },
          canvas: { styles: [] },
          deviceManager: {
            devices: [
              { name: "Desktop", width: "" },
              { name: "Tablet", width: "768px" },
              { name: "Mobile", width: "375px", widthMedia: "480px" },
            ],
          },
        }}
        plugins={[newsletterPlugin]}
        pluginsOpts={{
          [newsletterPlugin]: {
            inlineCss: true,
            updateStyleManager: true,
            showStylesOnChange: true,
            showBlocksOnLoad: true,
            cellStyle: {
              "font-size": "14px",
              "font-family": "Arial, Helvetica, sans-serif",
              color: "#333333",
            },
          },
        }}
        onEditor={onReady}
      />
    </div>
  );
}
