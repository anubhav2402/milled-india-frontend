"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import type { Editor } from "grapesjs";
import { preprocessEmailHtml } from "./utils";
import { API_BASE } from "../lib/constants";
import Logo from "../components/Logo";

// ---------------------------------------------------------------------------
// GrapesJS Theme — Light / BEEfree-inspired
// ---------------------------------------------------------------------------
const GRAPESJS_THEME_CSS = `
  :root {
    --gjs-primary-color: #FFFFFF;
    --gjs-secondary-color: #1C1917;
    --gjs-tertiary-color: #C2714A;
    --gjs-quaternary-color: #E8956E;
    --gjs-font-color: #44403C;
    --gjs-font-color-active: #1C1917;
    --gjs-main-color: #FFFFFF;
    --gjs-main-dark-color: rgba(0,0,0,0.06);
    --gjs-secondary-dark-color: rgba(0,0,0,0.04);
    --gjs-main-light-color: rgba(0,0,0,0.03);
    --gjs-secondary-light-color: rgba(0,0,0,0.5);
    --gjs-color-blue: #C2714A;
    --gjs-color-highlight: #E8956E;
  }

  .gjs-editor {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif !important;
  }

  .gjs-editor-cont {
    background-color: #F5F0EB !important;
  }

  .gjs-cv-canvas {
    background-color: #F5F0EB !important;
  }

  /* Right panel (styles/traits) */
  .gjs-pn-views-container {
    background-color: #FFFFFF !important;
    border-left: 1px solid #E8E0D8 !important;
    box-shadow: none !important;
    scrollbar-width: thin;
    scrollbar-color: rgba(194,113,74,0.2) transparent;
  }

  .gjs-pn-views {
    background-color: #FFFFFF !important;
    border-bottom: 1px solid #E8E0D8 !important;
  }

  .gjs-pn-btn {
    color: #78716C !important;
    border-radius: 6px !important;
    transition: all 0.15s ease !important;
  }

  .gjs-pn-btn:hover {
    color: #1C1917 !important;
    background: rgba(194,113,74,0.08) !important;
  }

  .gjs-pn-btn.gjs-pn-active {
    background-color: rgba(194,113,74,0.12) !important;
    box-shadow: none !important;
    color: #C2714A !important;
  }

  /* Content blocks */
  .gjs-block {
    background-color: #FAFAF9 !important;
    border: 1px solid #E8E0D8 !important;
    color: #44403C !important;
    border-radius: 8px !important;
    transition: all 0.15s ease !important;
    min-height: 72px !important;
    box-shadow: 0 1px 2px rgba(0,0,0,0.04) !important;
  }

  .gjs-block:hover {
    border-color: #C2714A !important;
    box-shadow: 0 2px 8px rgba(194,113,74,0.12) !important;
    color: #1C1917 !important;
    background-color: #FFF7F3 !important;
  }

  .gjs-block svg {
    fill: #78716C !important;
  }

  .gjs-block:hover svg {
    fill: #C2714A !important;
  }

  .gjs-block-label {
    font-family: 'Inter', sans-serif !important;
    font-size: 11px !important;
    font-weight: 500 !important;
    color: #57534E !important;
  }

  .gjs-block:hover .gjs-block-label {
    color: #C2714A !important;
  }

  /* Section titles */
  .gjs-title {
    background-color: #FAFAF9 !important;
    border-bottom: 1px solid #E8E0D8 !important;
    color: #1C1917 !important;
    font-family: 'Inter', sans-serif !important;
    font-weight: 600 !important;
    font-size: 12px !important;
    letter-spacing: 0.02em !important;
  }

  /* Component toolbar */
  .gjs-toolbar {
    background-color: #C2714A !important;
    border-radius: 6px !important;
    box-shadow: 0 2px 8px rgba(0,0,0,0.15) !important;
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

  /* Selection highlights */
  .gjs-highlighter-sel {
    outline-color: #C2714A !important;
  }

  .gjs-highlighter {
    outline-color: rgba(194,113,74,0.4) !important;
  }

  /* Component badge */
  .gjs-badge {
    background-color: #C2714A !important;
    color: white !important;
    font-family: 'Inter', sans-serif !important;
    font-size: 10px !important;
    border-radius: 4px !important;
    padding: 2px 6px !important;
  }

  /* Style manager sectors */
  .gjs-sm-sector .gjs-title {
    background-color: #FAFAF9 !important;
    border-color: #E8E0D8 !important;
  }

  .gjs-sm-sector .gjs-sm-properties {
    background-color: #FFFFFF !important;
  }

  /* Input fields */
  .gjs-field {
    background-color: #FAFAF9 !important;
    border: 1px solid #E8E0D8 !important;
    border-radius: 6px !important;
    color: #1C1917 !important;
    transition: border-color 0.15s ease !important;
  }

  .gjs-field:focus-within {
    border-color: #C2714A !important;
    box-shadow: 0 0 0 2px rgba(194,113,74,0.1) !important;
  }

  /* Layer names */
  .gjs-layer-name {
    font-family: 'Inter', sans-serif !important;
    font-size: 12px !important;
  }

  /* Scrollbars */
  .gjs-editor-cont ::-webkit-scrollbar { width: 6px !important; }
  .gjs-editor-cont ::-webkit-scrollbar-track { background: transparent !important; }
  .gjs-editor-cont ::-webkit-scrollbar-thumb {
    background-color: rgba(194,113,74,0.2) !important;
    border-radius: 3px !important;
  }
  .gjs-editor-cont ::-webkit-scrollbar-thumb:hover {
    background-color: rgba(194,113,74,0.35) !important;
  }

  /* Modals */
  .gjs-mdl-dialog {
    background-color: #FFFFFF !important;
    border-radius: 12px !important;
    border: 1px solid #E8E0D8 !important;
    box-shadow: 0 20px 60px rgba(0,0,0,0.15) !important;
  }

  .gjs-mdl-header {
    border-bottom-color: #E8E0D8 !important;
    font-family: 'Inter', sans-serif !important;
    color: #1C1917 !important;
  }

  /* Drop placeholder */
  .gjs-placeholder {
    border-color: #C2714A !important;
  }

  .gjs-resizer-h {
    border-color: #C2714A !important;
  }

  /* Blocks container - 2 column grid */
  .gjs-blocks-cs {
    display: grid !important;
    grid-template-columns: 1fr 1fr !important;
    gap: 8px !important;
    padding: 12px !important;
  }

  /* Category headers in blocks */
  .gjs-block-category .gjs-title {
    font-size: 11px !important;
    text-transform: uppercase !important;
    letter-spacing: 0.06em !important;
    color: #9D9490 !important;
    font-weight: 600 !important;
    padding: 10px 12px !important;
  }

  /* Layers panel */
  .gjs-layers {
    background-color: #FFFFFF !important;
  }

  .gjs-layer {
    background-color: #FFFFFF !important;
    border-bottom: 1px solid #F5F0EB !important;
  }

  .gjs-layer:hover {
    background-color: #FFF7F3 !important;
  }

  /* Trait manager */
  .gjs-trt-traits {
    padding: 8px 12px !important;
  }

  .gjs-trt-trait {
    padding: 6px 0 !important;
  }

  .gjs-label-wrp {
    color: #57534E !important;
    font-size: 12px !important;
  }

  /* RTE toolbar */
  .gjs-rte-toolbar {
    background: #FFFFFF !important;
    border: 1px solid #E8E0D8 !important;
    border-radius: 8px !important;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1) !important;
    padding: 4px !important;
  }

  .gjs-rte-action {
    color: #44403C !important;
    border-radius: 4px !important;
  }

  .gjs-rte-action:hover {
    background: rgba(194,113,74,0.1) !important;
    color: #C2714A !important;
  }

  .gjs-rte-active {
    background: rgba(194,113,74,0.15) !important;
    color: #C2714A !important;
  }

  /* Canvas frame */
  .gjs-frame-wrapper {
    background: #F5F0EB !important;
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
  const [showTemplatePicker, setShowTemplatePicker] = useState(!emailId);
  const [templates, setTemplates] = useState<
    { id: number; subject: string; brand: string; type: string | null }[]
  >([]);
  const [templatesLoading, setTemplatesLoading] = useState(false);

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

  // ── Fetch templates for picker ──
  useEffect(() => {
    if (!showTemplatePicker || templates.length > 0) return;
    setTemplatesLoading(true);
    fetch(`${API_BASE}/emails?limit=12&offset=0`)
      .then((res) => res.ok ? res.json() : Promise.reject())
      .then((data) => {
        const items = (data.emails || data || []).slice(0, 12);
        setTemplates(
          items.map((e: any) => ({
            id: e.id,
            subject: e.subject || "Untitled",
            brand: e.brand || "Unknown",
            type: e.type || null,
          }))
        );
      })
      .catch(() => {})
      .finally(() => setTemplatesLoading(false));
  }, [showTemplatePicker, templates.length]);

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

  // ── Load a template from picker ──
  const loadTemplate = useCallback(
    (templateId: number) => {
      if (!editorInstance) return;
      setShowTemplatePicker(false);
      fetchAndLoadEmail(editorInstance, String(templateId));
    },
    [editorInstance, fetchAndLoadEmail]
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
            x: window.innerWidth - 300,
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
          background: "#FAF9F7",
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
            color: "#1C1917",
          }}
        >
          Desktop Required
        </h1>
        <p
          style={{
            color: "#6B6560",
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
            background: "#C2714A",
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
          background: "#FFFFFF",
          borderBottom: "1px solid #E8E0D8",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 16px",
          zIndex: 10,
          flexShrink: 0,
          boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
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
                color: "#1C1917",
              }}
            >
              Mail{" "}
              <em style={{ fontStyle: "italic", color: "#C2714A" }}>Muse</em>
            </span>
          </Link>
          <span style={{ color: "#D6CFC7", fontSize: 14 }}>/</span>
          <span style={{ color: "#78716C", fontSize: 13, fontWeight: 500 }}>
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
              <span style={{ color: "#D6CFC7", fontSize: 14 }}>/</span>
              <span
                style={{
                  color: "#9D9490",
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
              color: canUndo ? "#44403C" : "#D6CFC7",
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
              color: canRedo ? "#44403C" : "#D6CFC7",
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
              background: "#E8E0D8",
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
                    ? "rgba(194,113,74,0.1)"
                    : "none",
                border:
                  activeDevice === device
                    ? "1px solid rgba(194,113,74,0.3)"
                    : "1px solid transparent",
                color: activeDevice === device ? "#C2714A" : "#9D9490",
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
                ? "rgba(194,113,74,0.1)"
                : "none",
              border: showShortcuts
                ? "1px solid rgba(194,113,74,0.3)"
                : "1px solid #E8E0D8",
              color: showShortcuts ? "#C2714A" : "#9D9490",
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

          <button
            onClick={() => setShowTemplatePicker(true)}
            title="Browse templates"
            style={{
              fontSize: 12,
              color: "#57534E",
              background: "none",
              padding: "6px 12px",
              border: "1px solid #E8E0D8",
              borderRadius: 6,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 5,
              fontWeight: 500,
              transition: "all 150ms ease",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
            </svg>
            Templates
          </button>
          {emailId && (
            <Link
              href={`/email/${emailId}`}
              style={{
                fontSize: 12,
                color: "#57534E",
                textDecoration: "none",
                padding: "6px 12px",
                border: "1px solid #E8E0D8",
                borderRadius: 6,
                fontWeight: 500,
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
              border: "1px solid #E8E0D8",
              background:
                exportState === "copied" ? "#DCFCE7" : "#FFFFFF",
              color:
                exportState === "copied" ? "#166534" : "#44403C",
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
              fontWeight: 600,
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
            background: "#F5F0EB",
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
            background: "rgba(245,240,235,0.9)",
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
                border: "3px solid #E8E0D8",
                borderTopColor: "#C2714A",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
                margin: "0 auto 12px",
              }}
            />
            <p style={{ color: "#44403C", fontSize: 14, fontWeight: 500 }}>Almost ready...</p>
            <p style={{ color: "#9D9490", fontSize: 11, marginTop: 4 }}>
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
            background: "#FEF2F2",
            color: "#991B1B",
            padding: "10px 16px",
            fontSize: 13,
            textAlign: "center",
            zIndex: 40,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            borderBottom: "1px solid #FECACA",
          }}
        >
          <span>{loadError}</span>
          <button
            onClick={retryLoadEmail}
            style={{
              background: "#FFFFFF",
              border: "1px solid #FECACA",
              color: "#991B1B",
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
              color: "#991B1B",
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
            background: "rgba(28,25,23,0.5)",
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
              background: "#FFFFFF",
              borderRadius: 16,
              padding: "32px 40px",
              maxWidth: 480,
              width: "90%",
              boxShadow: "0 20px 60px rgba(0,0,0,0.12)",
              textAlign: "center",
              animation: "scaleIn 0.3s ease",
              border: "1px solid #E8E0D8",
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
              Drag blocks from the left sidebar to add content. Click any element
              to edit it and style it in the right panel.
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
                    background: "#FFF7F3",
                    borderRadius: 10,
                    border: "1px solid rgba(194,113,74,0.15)",
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

      {/* ── Template Picker ── */}
      {showTemplatePicker && editorReady && !loading && (
        <div
          style={{
            position: "absolute",
            top: 52,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(28,25,23,0.5)",
            zIndex: 45,
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            paddingTop: 60,
            overflow: "auto",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#FFFFFF",
              borderRadius: 16,
              padding: "32px 36px",
              maxWidth: 640,
              width: "92%",
              boxShadow: "0 20px 60px rgba(0,0,0,0.12)",
              animation: "scaleIn 0.25s ease",
              border: "1px solid #E8E0D8",
            }}
          >
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" style={{ margin: "0 auto 12px", display: "block" }}>
                <rect x="4" y="6" width="32" height="28" rx="3" stroke="#C2714A" strokeWidth="2.5" fill="none" />
                <path d="M4 14h32" stroke="#C2714A" strokeWidth="2.5" />
                <rect x="8" y="18" width="10" height="6" rx="1" fill="#C2714A" opacity="0.2" />
                <rect x="8" y="27" width="16" height="2" rx="1" fill="#C2714A" opacity="0.15" />
                <rect x="22" y="18" width="10" height="6" rx="1" fill="#C2714A" opacity="0.2" />
              </svg>
              <h2 style={{
                fontFamily: "var(--font-dm-serif)",
                fontSize: 20,
                color: "#1C1917",
                fontWeight: 400,
                marginBottom: 6,
              }}>
                Choose a template to start
              </h2>
              <p style={{ fontSize: 13, color: "#6B6560", lineHeight: 1.5 }}>
                Pick a real email to customize, or start with a blank canvas.
              </p>
            </div>

            {/* Start blank option */}
            <button
              onClick={() => setShowTemplatePicker(false)}
              style={{
                width: "100%",
                padding: "14px 16px",
                background: "#FFF7F3",
                border: "2px dashed rgba(194,113,74,0.35)",
                borderRadius: 10,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 16,
                transition: "all 150ms ease",
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C2714A" strokeWidth="2" strokeLinecap="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#1C1917" }}>Start from scratch</div>
                <div style={{ fontSize: 12, color: "#6B6560" }}>Blank canvas with drag-and-drop blocks</div>
              </div>
            </button>

            {/* Template grid */}
            {templatesLoading ? (
              <div style={{ textAlign: "center", padding: "24px 0" }}>
                <div style={{
                  width: 24, height: 24,
                  border: "2px solid #E8E0D8", borderTopColor: "#C2714A",
                  borderRadius: "50%", animation: "spin 1s linear infinite",
                  margin: "0 auto 8px",
                }} />
                <span style={{ fontSize: 12, color: "#9D9490" }}>Loading templates...</span>
              </div>
            ) : templates.length > 0 ? (
              <>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#9D9490", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>
                  Or start from a real email
                </div>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: 8,
                  maxHeight: 320,
                  overflowY: "auto",
                }}>
                  {templates.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => loadTemplate(t.id)}
                      style={{
                        padding: "12px 14px",
                        background: "#FAFAF9",
                        border: "1px solid #E8E0D8",
                        borderRadius: 10,
                        cursor: "pointer",
                        textAlign: "left",
                        transition: "all 150ms ease",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.borderColor = "#C2714A";
                        (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 2px 8px rgba(194,113,74,0.1)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.borderColor = "#E8E0D8";
                        (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
                      }}
                    >
                      <div style={{
                        display: "flex", alignItems: "center", gap: 8, marginBottom: 4,
                      }}>
                        <div style={{
                          width: 24, height: 24, borderRadius: 6,
                          background: "#C2714A", color: "white",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 11, fontWeight: 700, flexShrink: 0,
                        }}>
                          {t.brand[0]?.toUpperCase() || "?"}
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 600, color: "#1C1917", textTransform: "capitalize" }}>
                          {t.brand}
                        </span>
                      </div>
                      <div style={{
                        fontSize: 12, color: "#6B6560",
                        whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                      }}>
                        {t.subject}
                      </div>
                      {t.type && (
                        <span style={{
                          display: "inline-block", marginTop: 4,
                          fontSize: 10, fontWeight: 500,
                          padding: "1px 6px", borderRadius: 4,
                          background: "rgba(194,113,74,0.1)", color: "#C2714A",
                        }}>
                          {t.type}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </>
            ) : null}

            <div style={{ textAlign: "center", marginTop: 16 }}>
              <Link
                href="/browse"
                style={{
                  fontSize: 13, fontWeight: 500, color: "#C2714A", textDecoration: "none",
                }}
              >
                Browse all emails &rarr;
              </Link>
            </div>
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
              background: "#FFFFFF",
              border: "1px solid #E8E0D8",
              borderRadius: 12,
              padding: "16px 20px",
              zIndex: 56,
              width: 260,
              boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
              animation: "fadeInDown 0.15s ease",
            }}
          >
            <h3
              style={{
                fontFamily: "var(--font-dm-serif)",
                fontSize: 14,
                color: "#1C1917",
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
                  borderBottom: "1px solid #F5F0EB",
                }}
              >
                <span style={{ color: "#6B6560", fontSize: 12 }}>
                  {action}
                </span>
                <kbd
                  style={{
                    background: "#FAFAF9",
                    border: "1px solid #E8E0D8",
                    borderRadius: 4,
                    padding: "2px 6px",
                    fontSize: 11,
                    color: "#44403C",
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
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
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
          background: "#F5F0EB",
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
              border: "3px solid #E8E0D8",
              borderTopColor: "#C2714A",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 16px",
            }}
          />
          <p style={{ color: "#44403C", fontSize: 14, fontWeight: 500 }}>Preparing editor...</p>
          <p style={{ color: "#9D9490", fontSize: 11, marginTop: 4 }}>
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
