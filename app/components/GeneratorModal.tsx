"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { API_BASE, INDUSTRIES } from "../lib/constants";
import Button from "./Button";

interface GeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  emailId: number;
  emailSubject: string;
  emailBrand?: string;
}

type Step = "extracting" | "form" | "generating" | "result";

type TemplateData = {
  email_id: number;
  brand: string;
  type: string;
  subject: string;
  template: {
    blocks: Array<{ type: string; slot: string; [key: string]: string }>;
    structure: { has_hero_image: boolean; heading_count: number; cta_count: number; body_sections: number };
    slots: string[];
  };
};

type GeneratedEmail = {
  subject: string;
  preview_text: string;
  html: string;
  slots: Record<string, string>;
};

const TONES = ["Professional", "Casual", "Playful", "Bold", "Luxury", "Friendly"];

export default function GeneratorModal({ isOpen, onClose, emailId, emailSubject, emailBrand }: GeneratorModalProps) {
  const { token } = useAuth();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState<Step>("extracting");
  const [error, setError] = useState<string | null>(null);

  // Template data
  const [template, setTemplate] = useState<TemplateData | null>(null);

  // Form state
  const [brandName, setBrandName] = useState("");
  const [brandUrl, setBrandUrl] = useState("");
  const [industry, setIndustry] = useState("");
  const [tone, setTone] = useState("Professional");
  const [instructions, setInstructions] = useState("");

  // Result
  const [result, setResult] = useState<GeneratedEmail | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      document.body.style.overflow = "hidden";
      extractTemplate();
    } else {
      document.body.style.overflow = "";
      const t = setTimeout(() => {
        setVisible(false);
        setStep("extracting");
        setTemplate(null);
        setResult(null);
        setError(null);
      }, 200);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  const headers = (): Record<string, string> => {
    const h: Record<string, string> = { "Content-Type": "application/json" };
    if (token) h["Authorization"] = `Bearer ${token}`;
    return h;
  };

  const extractTemplate = async () => {
    setStep("extracting");
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/emails/${emailId}/extract-template`, {
        method: "POST",
        headers: headers(),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({ detail: `Error ${res.status}` }));
        throw new Error(data.detail || `Error ${res.status}`);
      }
      const data: TemplateData = await res.json();
      setTemplate(data);
      setStep("form");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to extract template");
      setStep("form");
    }
  };

  const generateEmail = async () => {
    if (!template) return;
    setStep("generating");
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/ai/generate-email`, {
        method: "POST",
        headers: headers(),
        body: JSON.stringify({
          template_schema: template.template,
          brand_name: brandName,
          brand_url: brandUrl,
          industry,
          tone: tone.toLowerCase(),
          instructions,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({ detail: `Error ${res.status}` }));
        throw new Error(data.detail || `Error ${res.status}`);
      }
      const data: GeneratedEmail = await res.json();
      setResult(data);
      setStep("result");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Generation failed");
      setStep("form");
    }
  };

  const copyHtml = async () => {
    if (!result?.html) return;
    try {
      await navigator.clipboard.writeText(result.html);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textarea = document.createElement("textarea");
      textarea.value = result.html;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const downloadHtml = () => {
    if (!result?.html) return;
    const blob = new Blob([result.html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${brandName || "email"}-generated.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!visible) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.5)",
        backdropFilter: "blur(4px)",
        opacity: isOpen ? 1 : 0,
        transition: "opacity 0.2s ease",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "white",
          borderRadius: 16,
          maxWidth: step === "result" ? 800 : 520,
          width: "94%",
          maxHeight: "90vh",
          overflow: "auto",
          boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
          transform: isOpen ? "scale(1)" : "scale(0.95)",
          transition: "transform 0.2s ease, max-width 0.3s ease",
        }}
      >
        {/* Header */}
        <div style={{
          padding: "20px 24px",
          borderBottom: "1px solid #e2e8f0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: "#0f172a", margin: 0 }}>
              {step === "result" ? "Generated Email" : "Create One Like This"}
            </h2>
            <p style={{ fontSize: 13, color: "#64748b", margin: "4px 0 0" }}>
              {step === "extracting" && "Analyzing email structure..."}
              {step === "form" && `Based on: ${emailSubject.slice(0, 50)}${emailSubject.length > 50 ? "..." : ""}`}
              {step === "generating" && "Claude is generating your email..."}
              {step === "result" && result?.subject}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", fontSize: 20, padding: 4 }}
          >
            &times;
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: 24 }}>
          {/* Error */}
          {error && (
            <div style={{
              padding: 12,
              background: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: 8,
              fontSize: 13,
              color: "#dc2626",
              marginBottom: 16,
            }}>
              {error}
            </div>
          )}

          {/* Extracting step */}
          {step === "extracting" && (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <div style={{
                width: 36, height: 36,
                border: "3px solid #e2e8f0",
                borderTopColor: "#C2714A",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
                margin: "0 auto 16px",
              }} />
              <p style={{ fontSize: 14, color: "#64748b" }}>Extracting template structure...</p>
            </div>
          )}

          {/* Form step */}
          {step === "form" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Template info */}
              {template && (
                <div style={{
                  padding: 14,
                  background: "#f0fdf4",
                  border: "1px solid #bbf7d0",
                  borderRadius: 8,
                  fontSize: 12,
                  color: "#15803d",
                }}>
                  Template extracted: {template.template.structure.heading_count} heading(s),{" "}
                  {template.template.structure.body_sections} section(s),{" "}
                  {template.template.structure.cta_count} CTA(s)
                  {template.template.structure.has_hero_image && ", hero image"}
                </div>
              )}

              {/* Brand Name */}
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#334155", marginBottom: 6 }}>
                  Your Brand Name *
                </label>
                <input
                  type="text"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  placeholder="e.g. Acme Store"
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    fontSize: 14,
                    border: "1px solid #e2e8f0",
                    borderRadius: 8,
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              {/* Brand URL */}
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#334155", marginBottom: 6 }}>
                  Brand Website
                </label>
                <input
                  type="url"
                  value={brandUrl}
                  onChange={(e) => setBrandUrl(e.target.value)}
                  placeholder="https://yourstore.com"
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    fontSize: 14,
                    border: "1px solid #e2e8f0",
                    borderRadius: 8,
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              {/* Industry */}
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#334155", marginBottom: 6 }}>
                  Industry
                </label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    fontSize: 14,
                    border: "1px solid #e2e8f0",
                    borderRadius: 8,
                    outline: "none",
                    background: "white",
                    boxSizing: "border-box",
                  }}
                >
                  <option value="">Select industry...</option>
                  {INDUSTRIES.map((ind) => (
                    <option key={ind} value={ind}>{ind}</option>
                  ))}
                </select>
              </div>

              {/* Tone */}
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#334155", marginBottom: 6 }}>
                  Tone
                </label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {TONES.map((t) => (
                    <button
                      key={t}
                      onClick={() => setTone(t)}
                      style={{
                        padding: "6px 14px",
                        fontSize: 13,
                        fontWeight: 500,
                        borderRadius: 20,
                        border: tone === t ? "1px solid #C2714A" : "1px solid #e2e8f0",
                        background: tone === t ? "#FEF7F3" : "white",
                        color: tone === t ? "#C2714A" : "#64748b",
                        cursor: "pointer",
                        transition: "all 150ms ease",
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Instructions */}
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#334155", marginBottom: 6 }}>
                  Custom Instructions (optional)
                </label>
                <textarea
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="e.g. Focus on our summer sale, mention 30% discount, use urgency..."
                  rows={3}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    fontSize: 14,
                    border: "1px solid #e2e8f0",
                    borderRadius: 8,
                    outline: "none",
                    resize: "vertical",
                    fontFamily: "inherit",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              {/* Generate button */}
              <Button
                onClick={generateEmail}
                disabled={!brandName.trim() || !template}
                fullWidth
              >
                Generate Email
              </Button>
            </div>
          )}

          {/* Generating step */}
          {step === "generating" && (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <div style={{
                width: 36, height: 36,
                border: "3px solid #e2e8f0",
                borderTopColor: "#C2714A",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
                margin: "0 auto 16px",
              }} />
              <p style={{ fontSize: 14, color: "#64748b" }}>Generating your email with Claude...</p>
              <p style={{ fontSize: 12, color: "#94a3b8" }}>This may take 15-30 seconds</p>
            </div>
          )}

          {/* Result step */}
          {step === "result" && result && (
            <div>
              {/* Subject + Preview */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 500, color: "#64748b", marginBottom: 4 }}>Subject Line</div>
                <div style={{ fontSize: 15, fontWeight: 600, color: "#0f172a" }}>{result.subject}</div>
                {result.preview_text && (
                  <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 4 }}>{result.preview_text}</div>
                )}
              </div>

              {/* Email preview */}
              <div style={{
                border: "1px solid #e2e8f0",
                borderRadius: 8,
                overflow: "hidden",
                marginBottom: 16,
              }}>
                <iframe
                  ref={iframeRef}
                  srcDoc={result.html}
                  style={{
                    width: "100%",
                    height: 500,
                    border: "none",
                    display: "block",
                  }}
                  title="Generated email preview"
                  sandbox="allow-same-origin"
                />
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <Button onClick={copyHtml} variant="secondary" size="sm">
                  {copied ? "Copied!" : "Copy HTML"}
                </Button>
                <Button onClick={downloadHtml} variant="secondary" size="sm">
                  Download HTML
                </Button>
                <Button
                  onClick={() => { setResult(null); setStep("form"); }}
                  variant="ghost"
                  size="sm"
                >
                  Edit & Regenerate
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
