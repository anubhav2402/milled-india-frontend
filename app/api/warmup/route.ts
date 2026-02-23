import { NextResponse } from "next/server";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://milled-india-api.onrender.com";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const start = Date.now();
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 45000);
    const res = await fetch(`${API_BASE}/health`, {
      signal: controller.signal,
      cache: "no-store",
    });
    clearTimeout(timer);
    const elapsed = Date.now() - start;
    const data = await res.json();
    return NextResponse.json({
      backend: "warm",
      status: data.status,
      latency_ms: elapsed,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const elapsed = Date.now() - start;
    return NextResponse.json(
      {
        backend: "cold_or_down",
        error: error instanceof Error ? error.message : "Unknown error",
        latency_ms: elapsed,
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
}
