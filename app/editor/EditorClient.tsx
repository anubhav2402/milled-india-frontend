"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import type { Editor } from "grapesjs";
import { preprocessEmailHtml } from "./utils";
import { API_BASE } from "../lib/constants";
import Logo from "../components/Logo";

// ---------------------------------------------------------------------------
// GrapesJS Theme — MailMuse branded override
// ---------------------------------------------------------------------------
const GRAPESJS_THEME_CSS = `
  :root {
    --gjs-primary-color: #2A2522;
    --gjs-secondary-color: #E8E0D8;
    --gjs-tertiary-color: #C2714A;
    --gjs-quaternary-color: #E8956E;
    --gjs-font-color: #E8E0D8;
    --gjs-font-color-active: #FAF9F7;
    --gjs-main-color: #2A2522;
    --gjs-main-dark-color: rgba(0,0,0,0.25);
    --gjs-secondary-dark-color: rgba(0,0,0,0.15);
    --gjs-main-light-color: rgba(255,255,255,0.08);
    --gjs-secondary-light-color: rgba(255,255,255,0.65);
    --gjs-color-blue: #C2714A;
    --gjs-color-highlight: #E8956E;
  }

  .gjs-editor {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif !important;
  }

  .gjs-editor-cont {
    background-color: #231F1D !important;
  }

  .gjs-pn-views-container {
    background-color: #2A2522 !important;
    border-left: 1px solid #3D3630 !important;
    box-shadow: none !important;
    scrollbar-width: thin;
    scrollbar-color: rgba(194,113,74,0.3) transparent;
  }

  .gjs-pn-views {
    background-color: #2A2522 !important;
    border-bottom-color: #3D3630 !important;
  }

  .gjs-pn-btn {
    color: #9D9490 !important;
    border-radius: 6px !important;
    transition: all 0.15s ease !important;
  }

  .gjs-pn-btn:hover {
    color: #E8E0D8 !important;
  }

  .gjs-pn-btn.gjs-pn-active {
    background-color: rgba(194,113,74,0.15) !important;
    box-shadow: none !important;
    color: #C2714A !important;
  }

  .gjs-block {
    background-color: #332E2A !important;
    border-color: #3D3630 !important;
    color: #DDD6CC !important;
    border-radius: 8px !important;
    transition: all 0.15s ease !important;
    min-height: 80px !important;
  }

  .gjs-block:hover {
    border-color: #C2714A !important;
    box-shadow: 0 2px 8px rgba(194,113,74,0.15) !important;
    color: #FAF9F7 !important;
  }

  .gjs-block-label {
    font-family: 'Inter', sans-serif !important;
    font-size: 11px !important;
  }

  .gjs-title {
    background-color: #2A2522 !important;
    border-bottom: 1px solid #3D3630 !important;
    color: #DDD6CC !important;
    font-family: 'Inter', sans-serif !important;
    font-weight: 500 !important;
    font-size: 12px !important;
  }

  .gjs-toolbar {
    background-color: #C2714A !important;
    border-radius: 6px !important;
    box-shadow: 0 2px 8px rgba(0,0,0,0.3) !important;
    padding: 2px !important;
  }

  .gjs-toolbar-item {
    color: white !important;
    border-radius: 4px !important;
    transition: background 0.15s ease !important;
  }

  .gjs-toolbar-item:hover {
    background: rgba(255,255,255,0.2) !important;
  }

  .gjs-highlighter-sel {
    outline-color: #C2714A !important;
  }

  .gjs-highlighter {
    outline-color: rgba(194,113,74,0.5) !important;
  }

  .gjs-badge {
    background-color: #C2714A !important;
    color: white !important;
    font-family: 'Inter', sans-serif !important;
    font-size: 10px !important;
    border-radius: 4px !important;
    padding: 2px 6px !important;
  }

  .gjs-sm-sector .gjs-title {
    background-color: #332E2A !important;
    border-color: #3D3630 !important;
  }

  .gjs-sm-sector .gjs-sm-properties {
    background-color: #2A2522 !important;
  }

  .gjs-field {
    background-color: #332E2A !important;
    border-color: #3D3630 !important;
    border-radius: 6px !important;
    color: #E8E0D8 !important;
    transition: border-color 0.15s ease !important;
  }

  .gjs-field:focus-within {
    border-color: #C2714A !important;
  }

  .gjs-layer-name {
    font-family: 'Inter', sans-serif !important;
    font-size: 12px !important;
  }

  .gjs-editor-cont ::-webkit-scrollbar { width: 6px !important; }
  .gjs-editor-cont ::-webkit-scrollbar-track { background: transparent !important; }
  .gjs-editor-cont ::-webkit-scrollbar-thumb {
    background-color: rgba(194,113,74,0.25) !important;
    border-radius: 3px !important;
  }
  .gjs-editor-cont ::-webkit-scrollbar-thumb:hover {
    background-color: rgba(194,113,74,0.4) !important;
  }

  .gjs-mdl-dialog {
    background-color: #2A2522 !important;
    border-radius: 12px !important;
    border: 1px solid #3D3630 !important;
  }

  .gjs-mdl-header {
    border-bottom-color: #3D3630 !important;
    font-family: 'Inter', sans-serif !important;
  }

  .gjs-placeholder {
    border-color: #C2714A !important;
  }

  .gjs-resizer-h {
    border-color: #C2714A !important;
  }
`;

// ---------------------------------------------------------------------------
// Platform detection
// ---------------------------------------------------------------------------
const isMac =
  typeof navigator !== "undefined" &&
  navigator.platform.toUpperCase().includes("MAC");
const MOD = isMac ? "Cmd" : "Ctrl";

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------
export default function EditorClient() {
  const searchParams = useSearchParams();
  const emailId = searchParams.get("id");

  // Existing state
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

  // New state
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [activeDevice, setActiveDevice] = useState<
    "Desktop" | "Tablet" | "Mobile"
  >("Desktop");
  const [tooltip, setTooltip] = useState<{
    text: string;
    x: number;
    y: number;
  } | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);

  // Refs for one-time tooltips
  const firstSelectRef = useRef(false);
  const firstRteRef = useRef(false);

  // ── Inject GrapesJS theme CSS ──
  useEffect(() => {
    const styleId = "mailmuse-gjs-theme";
    if (document.getElementById(styleId)) return;
    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = GRAPESJS_THEME_CSS;
    document.head.appendChild(style);
    return () => {
      document.getElementById(styleId)?.remove();
    };
  }, []);

  // ── Mobile detection ──
  useEffect(() => {
    setIsMobile(window.innerWidth < 900);
  }, []);

  // ── Unsaved changes beforeunload ──
  useEffect(() => {
    if (!hasUnsavedChanges) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [hasUnsavedChanges]);

  // ── Onboarding trigger ──
  useEffect(() => {
    if (editorReady && !loading && !loadError) {
      const seen = localStorage.getItem("mailmuse-editor-onboarding-seen");
      if (!seen) {
        setShowOnboarding(true);
        const timer = setTimeout(() => {
          setShowOnboarding(false);
          localStorage.setItem("mailmuse-editor-onboarding-seen", "1");
        }, 8000);
        const handleKey = () => {
          setShowOnboarding(false);
          localStorage.setItem("mailmuse-editor-onboarding-seen", "1");
        };
        window.addEventListener("keydown", handleKey);
        return () => {
          clearTimeout(timer);
          window.removeEventListener("keydown", handleKey);
        };
      }
    }
  }, [editorReady, loading, loadError]);

  // ── Fetch & load email ──
  const fetchAndLoadEmail = useCallback(
    async (editor: Editor, id: string) => {
      setLoading(true);
      setLoadError(null);
      try {
        const res = await fetch(`${API_BASE}/emails/${id}`);
        if (!res.ok) throw new Error(`Failed to load email (${res.status})`);
        const data = await res.json();
        setEmailMeta({
          subject: data.subject,
          brand: data.brand || "Unknown",
        });
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

  // ── Retry handler ──
  const retryLoadEmail = useCallback(() => {
    if (editorInstance && emailId) {
      fetchAndLoadEmail(editorInstance, emailId);
    }
  }, [editorInstance, emailId, fetchAndLoadEmail]);

  // ── Editor ready callback ──
  const onEditorReady = useCallback(
    (editor: Editor) => {
      setEditorInstance(editor);
      setEditorReady(true);

      // Track undo/redo
      const updateUndoState = () => {
        setCanUndo(editor.UndoManager.hasUndo());
        setCanRedo(editor.UndoManager.hasRedo());
      };
      editor.on("change:changesCount", updateUndoState);

      // Track device changes
      editor.on("device:select", () => {
        const device = editor.Devices.getSelected();
        setActiveDevice(
          (device?.getName() as "Desktop" | "Tablet" | "Mobile") || "Desktop"
        );
      });

      // Track unsaved changes
      const markUnsaved = () => setHasUnsavedChanges(true);
      editor.on("component:update", markUnsaved);
      editor.on("component:add", markUnsaved);
      editor.on("component:remove", markUnsaved);

      // Contextual tooltip: first component selection
      editor.on("component:selected", () => {
        if (!firstSelectRef.current) {
          firstSelectRef.current = true;
          setTooltip({
            text: "Edit styles in the right panel \u2192",
            x: window.innerWidth - 280,
            y: 120,
          });
          setTimeout(() => setTooltip(null), 4000);
        }
        // Dismiss onboarding on any selection
        setShowOnboarding(false);
        localStorage.setItem("mailmuse-editor-onboarding-seen", "1");
      });

      // Contextual tooltip: first RTE activation
      editor.on("rte:enable", () => {
        if (!firstRteRef.current) {
          firstRteRef.current = true;
          setTooltip({
            text: "Type to edit this text",
            x: window.innerWidth / 2 - 80,
            y: 100,
          });
          setTimeout(() => setTooltip(null), 3000);
        }
      });

      // Register quick action commands
      editor.Commands.add("tlb-clone", {
        run(ed) {
          const selected = ed.getSelected();
          if (selected) {
            const parent = selected.parent();
            const index = parent?.components().indexOf(selected);
            if (parent && index !== undefined) {
              const clone = selected.clone();
              parent.components().add(clone, { at: index + 1 });
              ed.select(clone);
            }
          }
        },
      });

      editor.Commands.add("tlb-move-up", {
        run(ed) {
          const selected = ed.getSelected();
          if (selected) {
            const parent = selected.parent();
            if (parent) {
              const comps = parent.components();
              const index = comps.indexOf(selected);
              if (index > 0) {
                comps.remove(selected);
                comps.add(selected, { at: index - 1 });
                ed.select(selected);
              }
            }
          }
        },
      });

      editor.Commands.add("tlb-move-down", {
        run(ed) {
          const selected = ed.getSelected();
          if (selected) {
            const parent = selected.parent();
            if (parent) {
              const comps = parent.components();
              const index = comps.indexOf(selected);
              if (index < comps.length - 1) {
                comps.remove(selected);
                comps.add(selected, { at: index + 1 });
                ed.select(selected);
              }
            }
          }
        },
      });

      // Add quick action buttons to component toolbar on selection
      editor.on("component:selected", (component) => {
        if (!component) return;
        const toolbar = component.get("toolbar") || [];
        const hasClone = toolbar.some(
          (btn: any) => btn.command === "tlb-clone"
        );
        if (!hasClone) {
          component.set("toolbar", [
            ...toolbar,
            {
              attributes: { title: "Duplicate" },
              label: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>`,
              command: "tlb-clone",
            },
            {
              attributes: { title: "Move Up" },
              label: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 19V5M5 12l7-7 7 7"/></svg>`,
              command: "tlb-move-up",
            },
            {
              attributes: { title: "Move Down" },
              label: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M19 12l-7 7-7-7"/></svg>`,
              command: "tlb-move-down",
            },
          ]);
        }
      });

      // Load email
      if (emailId) {
        fetchAndLoadEmail(editor, emailId);
      }
    },
    [emailId, fetchAndLoadEmail]
  );

  // ── Export helpers ──
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
    setHasUnsavedChanges(false);
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
    setHasUnsavedChanges(false);
    setTimeout(() => setExportState("idle"), 2500);
  }, [getExportHtml, emailMeta]);

  // ── Toolbar handlers ──
  const handleUndo = useCallback(() => {
    editorInstance?.UndoManager.undo();
  }, [editorInstance]);

  const handleRedo = useCallback(() => {
    editorInstance?.UndoManager.redo();
  }, [editorInstance]);

  const handleDeviceChange = useCallback(
    (device: "Desktop" | "Tablet" | "Mobile") => {
      editorInstance?.Devices.select(device);
      setActiveDevice(device);
    },
    [editorInstance]
  );

  const dismissOnboarding = useCallback(() => {
    setShowOnboarding(false);
    localStorage.setItem("mailmuse-editor-onboarding-seen", "1");
  }, []);

  // ── Mobile gate ──
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

  // ── Main render ──
  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* ── Top bar ── */}
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
              Mail{" "}
              <em style={{ fontStyle: "italic", color: "#C2714A" }}>Muse</em>
            </span>
          </Link>
          <span style={{ color: "#555", fontSize: 14 }}>/</span>
          <span style={{ color: "#aaa", fontSize: 13 }}>
            Template Editor
            {hasUnsavedChanges && (
              <span
                style={{
                  display: "inline-block",
                  width: 6,
                  height: 6,
                  background: "#C2714A",
                  borderRadius: "50%",
                  marginLeft: 6,
                  verticalAlign: "middle",
                }}
              />
            )}
          </span>
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

        {/* Center: undo/redo + device preview */}
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <button
            onClick={handleUndo}
            disabled={!canUndo}
            title={`Undo (${MOD}+Z)`}
            style={{
              background: "none",
              border: "none",
              color: canUndo ? "#ddd" : "#555",
              cursor: canUndo ? "pointer" : "not-allowed",
              padding: "6px 8px",
              borderRadius: 6,
              display: "flex",
              alignItems: "center",
              transition: "color 150ms ease",
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 7v6h6" />
              <path d="M21 17a9 9 0 00-9-9 9 9 0 00-6.69 3L3 13" />
            </svg>
          </button>
          <button
            onClick={handleRedo}
            disabled={!canRedo}
            title={`Redo (${MOD}+Shift+Z)`}
            style={{
              background: "none",
              border: "none",
              color: canRedo ? "#ddd" : "#555",
              cursor: canRedo ? "pointer" : "not-allowed",
              padding: "6px 8px",
              borderRadius: 6,
              display: "flex",
              alignItems: "center",
              transition: "color 150ms ease",
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 7v6h-6" />
              <path d="M3 17a9 9 0 019-9 9 9 0 016.69 3L21 13" />
            </svg>
          </button>

          <div
            style={{
              width: 1,
              height: 20,
              background: "#444",
              margin: "0 8px",
            }}
          />

          {(["Desktop", "Tablet", "Mobile"] as const).map((device) => (
            <button
              key={device}
              onClick={() => handleDeviceChange(device)}
              title={`${device} view`}
              style={{
                background:
                  activeDevice === device
                    ? "rgba(194,113,74,0.2)"
                    : "none",
                border:
                  activeDevice === device
                    ? "1px solid rgba(194,113,74,0.4)"
                    : "1px solid transparent",
                color: activeDevice === device ? "#C2714A" : "#999",
                cursor: "pointer",
                padding: "5px 8px",
                borderRadius: 6,
                display: "flex",
                alignItems: "center",
                transition: "all 150ms ease",
              }}
            >
              {device === "Desktop" && (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="2" y="3" width="20" height="14" rx="2" />
                  <line x1="8" y1="21" x2="16" y2="21" />
                  <line x1="12" y1="17" x2="12" y2="21" />
                </svg>
              )}
              {device === "Tablet" && (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="4" y="2" width="16" height="20" rx="2" />
                  <line x1="12" y1="18" x2="12.01" y2="18" />
                </svg>
              )}
              {device === "Mobile" && (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="5" y="2" width="14" height="20" rx="2" />
                  <line x1="12" y1="18" x2="12.01" y2="18" />
                </svg>
              )}
            </button>
          ))}
        </div>

        {/* Right: shortcuts + export buttons */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            position: "relative",
          }}
        >
          {/* Keyboard shortcuts "?" */}
          <button
            onClick={() => setShowShortcuts(!showShortcuts)}
            title="Keyboard shortcuts"
            style={{
              background: showShortcuts
                ? "rgba(194,113,74,0.2)"
                : "none",
              border: showShortcuts
                ? "1px solid rgba(194,113,74,0.4)"
                : "1px solid #444",
              color: showShortcuts ? "#C2714A" : "#999",
              cursor: "pointer",
              padding: "5px 8px",
              borderRadius: 6,
              fontSize: 13,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 30,
              height: 30,
              transition: "all 150ms ease",
            }}
          >
            ?
          </button>

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

      {/* ── Shimmer progress bar ── */}
      {(loading || !editorReady) && (
        <div
          style={{
            position: "absolute",
            top: 52,
            left: 0,
            right: 0,
            height: 3,
            background: "#333",
            zIndex: 55,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              background:
                "linear-gradient(90deg, #C2714A, #E8956E, #C2714A)",
              backgroundSize: "200% 100%",
              animation: "shimmer 1.5s infinite",
              width: "100%",
            }}
          />
        </div>
      )}

      {/* ── Loading overlay ── */}
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
            <p style={{ color: "#ccc", fontSize: 14 }}>Almost ready...</p>
            <p style={{ color: "#777", fontSize: 11, marginTop: 4 }}>
              Loading your template
            </p>
          </div>
        </div>
      )}

      {/* ── Error state ── */}
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
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
          }}
        >
          <span>{loadError}</span>
          <button
            onClick={retryLoadEmail}
            style={{
              background: "rgba(255,255,255,0.15)",
              border: "1px solid rgba(255,255,255,0.25)",
              color: "#fca5a5",
              borderRadius: 6,
              padding: "4px 12px",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 500,
            }}
          >
            Retry
          </button>
          <button
            onClick={() => setLoadError(null)}
            style={{
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

      {/* ── Onboarding overlay ── */}
      {showOnboarding && (
        <div
          onClick={dismissOnboarding}
          style={{
            position: "absolute",
            top: 52,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.6)",
            zIndex: 45,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: "fadeIn 0.3s ease",
            cursor: "pointer",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#FAF9F7",
              borderRadius: 16,
              padding: "32px 40px",
              maxWidth: 480,
              width: "90%",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
              textAlign: "center",
              animation: "scaleIn 0.3s ease",
            }}
          >
            <svg
              width="48"
              height="48"
              viewBox="0 0 40 40"
              fill="none"
              style={{ margin: "0 auto 16px", display: "block" }}
            >
              <path
                d="M4 12L20 24L36 12"
                stroke="#C2714A"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M4 12L4 30L36 30L36 12"
                stroke="#C2714A"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <h2
              style={{
                fontFamily: "var(--font-dm-serif)",
                fontSize: 22,
                color: "#1C1917",
                marginBottom: 8,
                fontWeight: 400,
              }}
            >
              Start editing your template
            </h2>
            <p
              style={{
                color: "#6B6560",
                fontSize: 14,
                lineHeight: 1.6,
                marginBottom: 24,
              }}
            >
              Click any text to edit it directly. Drag blocks from the sidebar
              to add new content sections.
            </p>

            <div
              style={{
                display: "flex",
                gap: 12,
                marginBottom: 24,
              }}
            >
              {[
                {
                  label: "Click text to edit",
                  icon: (
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#C2714A"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M17 3a2.85 2.83 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                    </svg>
                  ),
                },
                {
                  label: "Drag blocks to add",
                  icon: (
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#C2714A"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="3" y="3" width="7" height="7" />
                      <rect x="14" y="3" width="7" height="7" />
                      <rect x="3" y="14" width="7" height="7" />
                      <rect x="14" y="14" width="7" height="7" />
                    </svg>
                  ),
                },
                {
                  label: "Style in right panel",
                  icon: (
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#C2714A"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="13.5" cy="6.5" r="2.5" />
                      <path d="M17 2A5 5 0 0 0 7.5 7.5L2 22l14.5-5.5A5 5 0 0 0 22 7a5 5 0 0 0-5-5z" />
                    </svg>
                  ),
                },
              ].map((hint, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    padding: "14px 8px",
                    background: "#F5E6DC",
                    borderRadius: 10,
                  }}
                >
                  <div style={{ marginBottom: 8 }}>{hint.icon}</div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "#1C1917",
                      fontWeight: 500,
                    }}
                  >
                    {hint.label}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={dismissOnboarding}
              style={{
                background: "#C2714A",
                color: "white",
                border: "none",
                borderRadius: 10,
                padding: "12px 32px",
                fontSize: 14,
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              Got it, let me edit
            </button>
            <p style={{ fontSize: 11, color: "#9D9490", marginTop: 12 }}>
              Click anywhere or press any key to dismiss
            </p>
          </div>
        </div>
      )}

      {/* ── Keyboard shortcuts dropdown ── */}
      {showShortcuts && (
        <>
          <div
            onClick={() => setShowShortcuts(false)}
            style={{ position: "fixed", inset: 0, zIndex: 55 }}
          />
          <div
            style={{
              position: "absolute",
              top: 48,
              right: 16,
              background: "#2A2522",
              border: "1px solid #3D3630",
              borderRadius: 12,
              padding: "16px 20px",
              zIndex: 56,
              width: 260,
              boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
              animation: "fadeInDown 0.15s ease",
            }}
          >
            <h3
              style={{
                fontFamily: "var(--font-dm-serif)",
                fontSize: 14,
                color: "#FAF9F7",
                marginBottom: 12,
                fontWeight: 400,
              }}
            >
              Keyboard Shortcuts
            </h3>
            {[
              { keys: `${MOD} + Z`, action: "Undo" },
              { keys: `${MOD} + Shift + Z`, action: "Redo" },
              { keys: "Delete", action: "Remove selected" },
              { keys: "Double-click", action: "Edit text" },
              { keys: "Escape", action: "Deselect" },
              { keys: `${MOD} + C`, action: "Copy component" },
              { keys: `${MOD} + V`, action: "Paste component" },
            ].map(({ keys, action }, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "6px 0",
                  borderBottom: "1px solid #3D3630",
                }}
              >
                <span style={{ color: "#9D9490", fontSize: 12 }}>
                  {action}
                </span>
                <kbd
                  style={{
                    background: "#332E2A",
                    border: "1px solid #3D3630",
                    borderRadius: 4,
                    padding: "2px 6px",
                    fontSize: 11,
                    color: "#DDD6CC",
                    fontFamily: "monospace",
                  }}
                >
                  {keys}
                </kbd>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── Contextual tooltip ── */}
      {tooltip && (
        <div
          style={{
            position: "fixed",
            left: tooltip.x,
            top: tooltip.y,
            background: "#1C1917",
            color: "#FAF9F7",
            padding: "8px 14px",
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 500,
            zIndex: 60,
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            animation: "fadeInDown 0.2s ease",
            pointerEvents: "none",
            whiteSpace: "nowrap",
          }}
        >
          {tooltip.text}
        </div>
      )}

      {/* ── GrapesJS Editor ── */}
      <GrapesJSEditor onReady={onEditorReady} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Inner component: handles dynamic grapesjs imports
// ---------------------------------------------------------------------------
function GrapesJSEditor({ onReady }: { onReady: (editor: Editor) => void }) {
  const [GjsEditor, setGjsEditor] = useState<React.ComponentType<any> | null>(
    null
  );
  const [grapesjs, setGrapesjs] = useState<any>(null);
  const [newsletterPlugin, setNewsletterPlugin] = useState<any>(null);

  useEffect(() => {
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
          background: "#231F1D",
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
          <p style={{ color: "#ccc", fontSize: 14 }}>Preparing editor...</p>
          <p style={{ color: "#777", fontSize: 11, marginTop: 4 }}>
            Loading design tools
          </p>
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
