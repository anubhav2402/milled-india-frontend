"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import Logo from "../../components/Logo";

type Email = {
  id: number;
  subject: string;
  brand?: string;
  received_at: string;
  html: string;
};

export default function EmailPage() {
  const params = useParams();
  const id = params?.id as string;
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [email, setEmail] = useState<Email | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [iframeHeight, setIframeHeight] = useState(600);

  useEffect(() => {
    if (!id) return;

    const fetchEmail = async () => {
      try {
        const base = process.env.NEXT_PUBLIC_API_BASE_URL;
        if (!base) {
          throw new Error("API URL not configured");
        }
        const res = await fetch(`${base}/emails/${id}`);
        if (!res.ok) {
          throw new Error(`Failed to fetch email: ${res.status}`);
        }
        const data = await res.json();
        setEmail(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load email");
      } finally {
        setLoading(false);
      }
    };

    fetchEmail();
  }, [id]);

  // Auto-resize iframe to fit content
  useEffect(() => {
    if (!email?.html || !iframeRef.current) return;

    const iframe = iframeRef.current;
    
    const resizeIframe = () => {
      try {
        const doc = iframe.contentDocument || iframe.contentWindow?.document;
        if (doc && doc.body) {
          const height = Math.max(
            doc.body.scrollHeight,
            doc.body.offsetHeight,
            doc.documentElement.scrollHeight,
            doc.documentElement.offsetHeight
          );
          setIframeHeight(Math.max(height + 60, 600));
        }
      } catch (e) {
        console.error("Could not access iframe content:", e);
      }
    };
    
    const handleLoad = () => {
      // Initial resize
      resizeIframe();
      // Resize again after images load
      setTimeout(resizeIframe, 1000);
      setTimeout(resizeIframe, 2500);
    };

    iframe.addEventListener("load", handleLoad);
    return () => iframe.removeEventListener("load", handleLoad);
  }, [email?.html]);

  // Wrap email HTML with proper document structure for iframe
  // Preserve original email styles as much as possible
  const getIframeContent = (html: string) => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <style>
          /* Minimal reset - don't override email styles */
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
          }
          
          /* Center the email content */
          body {
            background-color: #f5f5f5 !important;
            display: flex;
            justify-content: center;
          }
          
          /* Email container styling */
          body > table,
          body > div,
          body > center {
            margin: 0 auto !important;
          }
          
          /* Ensure images display properly */
          img {
            border: 0;
            outline: none;
            text-decoration: none;
            -ms-interpolation-mode: bicubic;
          }
          
          /* Fix table rendering */
          table {
            border-collapse: collapse !important;
          }
          
          /* Ensure links are clickable */
          a {
            text-decoration: none;
          }
          
          /* Hide any broken image icons */
          img[src=""] {
            display: none !important;
          }
        </style>
      </head>
      <body>
        ${html}
      </body>
      </html>
    `;
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#fafafa" }}>
        <Header />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 18, color: "#666" }}>Loading email...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !email) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#fafafa" }}>
        <Header />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh", padding: "40px" }}>
          <div style={{ textAlign: "center" }}>
            <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 16, color: "#1a1a1a" }}>
              Unable to Load Email
            </h1>
            <p style={{ fontSize: 16, color: "#666", marginBottom: 24 }}>
              {error || "There was an error loading this email."}
            </p>
            <a
              href="/browse"
              style={{
                padding: "12px 24px",
                backgroundColor: "#14b8a6",
                color: "#fff",
                textDecoration: "none",
                borderRadius: 8,
                fontWeight: 500,
                display: "inline-block",
              }}
            >
              Back to Browse
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#fafafa" }}>
      <Header />

      {/* Main content */}
      <main style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 24px" }}>
        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: 16,
            border: "1px solid #e5e5e5",
            overflow: "hidden",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          }}
        >
          {/* Email header */}
          <div style={{ padding: "32px 40px", borderBottom: "1px solid #e5e5e5" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 16, flexWrap: "wrap", gap: 12 }}>
              {email.brand && (
                <span
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#f0fdfa",
                    borderRadius: 20,
                    fontSize: 13,
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    color: "#14b8a6",
                    border: "1px solid #ccfbf1",
                  }}
                >
                  {email.brand}
                </span>
              )}
              <time
                style={{
                  fontSize: 14,
                  color: "#999",
                  fontWeight: 500,
                }}
              >
                {new Date(email.received_at).toLocaleString("en-IN", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </time>
            </div>
            <h1
              style={{
                margin: 0,
                fontSize: 28,
                fontWeight: 700,
                color: "#1a1a1a",
                lineHeight: 1.3,
              }}
            >
              {email.subject}
            </h1>
          </div>

          {/* Email body in iframe for proper isolation */}
          <div style={{ backgroundColor: "#f5f5f5", padding: "20px 0" }}>
            <iframe
              ref={iframeRef}
              srcDoc={getIframeContent(email.html)}
              style={{
                width: "100%",
                height: iframeHeight,
                border: "none",
                display: "block",
                backgroundColor: "#f5f5f5",
              }}
              title="Email content"
              sandbox="allow-same-origin allow-popups allow-popups-to-escape-sandbox"
            />
          </div>
        </div>

        {/* Bottom CTA */}
        <div style={{ marginTop: 40, textAlign: "center" }}>
          <a
            href="/browse"
            style={{
              padding: "14px 28px",
              backgroundColor: "#14b8a6",
              color: "#fff",
              textDecoration: "none",
              borderRadius: 12,
              fontWeight: 600,
              fontSize: 16,
              display: "inline-block",
            }}
          >
            Browse More Emails
          </a>
        </div>
      </main>
    </div>
  );
}

// Reusable Header component
function Header() {
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        backgroundColor: "#fff",
        borderBottom: "1px solid #e5e5e5",
        padding: "16px 0",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <a href="/" style={{ textDecoration: "none", color: "inherit", display: "flex", alignItems: "center", gap: 8 }}>
          <Logo size={32} />
          <span style={{ fontSize: 24, fontWeight: 700, color: "#1a1a1a" }}>MailMuse</span>
        </a>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <a
            href="/browse"
            style={{
              color: "#666",
              textDecoration: "none",
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            ← Back to Browse
          </a>
          <a
            href="/browse"
            style={{
              padding: "10px 24px",
              backgroundColor: "#14b8a6",
              color: "#fff",
              textDecoration: "none",
              borderRadius: 8,
              fontWeight: 500,
              fontSize: 14,
            }}
          >
            Browse More
          </a>
        </div>
      </div>
    </header>
  );
}