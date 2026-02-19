"use client";

import { useState, useEffect, useMemo } from "react";
import Header from "../components/Header";
import Badge from "../components/Badge";
import AuthGate from "../components/AuthGate";
import { useAuth } from "../context/AuthContext";
import { API_BASE, CAMPAIGN_TYPE_COLORS } from "../lib/constants";

type CalendarEmail = {
  date: string;
  subject: string;
  type: string;
};

type MonthData = {
  month: string;
  total_emails: number;
  campaign_breakdown: Record<string, number>;
  emails: CalendarEmail[];
};

type CalendarResponse = {
  brand: string;
  total_campaigns: number | string;
  date_range: { start: string; end: string };
  calendar?: MonthData[];
  message?: string;
};

export default function CalendarPage() {
  const { user, token } = useAuth();
  const [brands, setBrands] = useState<string[]>([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [calendarData, setCalendarData] = useState<CalendarResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  // Fetch brands
  useEffect(() => {
    fetch(`${API_BASE}/brands`)
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        setBrands(data);
        if (data.length > 0) setSelectedBrand(data[0]);
      })
      .catch(() => {});
  }, []);

  // Fetch calendar data
  useEffect(() => {
    if (!selectedBrand) return;

    const fetchCalendar = async () => {
      setLoading(true);
      try {
        const headers: Record<string, string> = {};
        if (token) headers["Authorization"] = `Bearer ${token}`;

        const res = await fetch(
          `${API_BASE}/analytics/calendar/${encodeURIComponent(selectedBrand)}?months=6`,
          { headers }
        );
        if (res.ok) setCalendarData(await res.json());
      } catch (err) {
        console.error("Failed to fetch calendar:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCalendar();
  }, [selectedBrand, token]);

  // Build email map: date string -> emails
  const emailsByDate = useMemo(() => {
    const map = new Map<string, CalendarEmail[]>();
    if (calendarData?.calendar) {
      for (const month of calendarData.calendar) {
        for (const email of month.emails) {
          const key = email.date;
          if (!map.has(key)) map.set(key, []);
          map.get(key)!.push(email);
        }
      }
    }
    return map;
  }, [calendarData]);

  // Calendar grid
  const { year, month } = currentMonth;
  const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = new Date(year, month).toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const prevMonth = () => {
    setCurrentMonth((prev) => {
      if (prev.month === 0) return { year: prev.year - 1, month: 11 };
      return { ...prev, month: prev.month - 1 };
    });
    setSelectedDay(null);
  };

  const nextMonth = () => {
    setCurrentMonth((prev) => {
      if (prev.month === 11) return { year: prev.year + 1, month: 0 };
      return { ...prev, month: prev.month + 1 };
    });
    setSelectedDay(null);
  };

  const selectedDayEmails = selectedDay ? emailsByDate.get(selectedDay) || [] : [];

  const copySubject = async (text: string, idx: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 2000);
    } catch {}
  };

  const isAuth = calendarData && !calendarData.message;

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-surface)" }}>
      <Header />

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "32px 24px" }}>
        {/* Page Header */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{
            fontFamily: "var(--font-dm-serif)", fontSize: 28,
            color: "var(--color-primary)", margin: "0 0 6px",
          }}>
            Campaign Calendar
          </h1>
          <p style={{ fontSize: 14, color: "var(--color-secondary)", margin: 0 }}>
            See when brands send their campaigns
          </p>
        </div>

        {/* Controls */}
        <div style={{
          display: "flex", gap: 12, alignItems: "center", marginBottom: 24,
          flexWrap: "wrap",
        }}>
          <select
            value={selectedBrand}
            onChange={(e) => { setSelectedBrand(e.target.value); setSelectedDay(null); }}
            style={{
              padding: "10px 14px", fontSize: 14, border: "1px solid var(--color-border)",
              borderRadius: 10, background: "white", color: "var(--color-primary)",
              cursor: "pointer", minWidth: 200,
            }}
          >
            {brands.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>

          <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: "auto" }}>
            <button
              onClick={prevMonth}
              style={{
                width: 36, height: 36, borderRadius: 8, border: "1px solid var(--color-border)",
                background: "white", cursor: "pointer", display: "flex",
                alignItems: "center", justifyContent: "center",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <span style={{ fontSize: 15, fontWeight: 600, color: "var(--color-primary)", minWidth: 140, textAlign: "center" }}>
              {monthName}
            </span>
            <button
              onClick={nextMonth}
              style={{
                width: 36, height: 36, borderRadius: 8, border: "1px solid var(--color-border)",
                background: "white", cursor: "pointer", display: "flex",
                alignItems: "center", justifyContent: "center",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>

        {loading ? (
          <div style={{ background: "white", borderRadius: 14, padding: 60, textAlign: "center" }}>
            <div style={{
              width: 40, height: 40, border: "3px solid var(--color-border)",
              borderTopColor: "var(--color-accent)", borderRadius: "50%",
              animation: "spin 1s linear infinite", margin: "0 auto",
            }} />
          </div>
        ) : !isAuth ? (
          <AuthGate previewRows={6}>
            <div style={{ background: "white", borderRadius: 14, padding: 40, height: 400 }}>
              {/* Placeholder calendar */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 8 }}>
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                  <div key={d} style={{ textAlign: "center", fontSize: 12, color: "var(--color-tertiary)", padding: 8 }}>{d}</div>
                ))}
                {Array.from({ length: 35 }).map((_, i) => (
                  <div key={i} style={{
                    textAlign: "center", padding: 12, fontSize: 14,
                    color: "var(--color-tertiary)", borderRadius: 8,
                    background: i % 7 === 3 || i % 5 === 0 ? "#f1f5f9" : "transparent",
                  }}>
                    {i < 28 ? i + 1 : ""}
                  </div>
                ))}
              </div>
            </div>
          </AuthGate>
        ) : (
          <>
            {/* Calendar Grid */}
            <div style={{
              background: "white", borderRadius: 14, padding: 20,
              border: "1px solid var(--color-border)", marginBottom: 16,
            }}>
              {/* Day headers */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                  <div key={d} style={{
                    textAlign: "center", fontSize: 11, fontWeight: 600,
                    color: "var(--color-tertiary)", padding: "8px 0",
                    textTransform: "uppercase", letterSpacing: "0.05em",
                  }}>
                    {d}
                  </div>
                ))}

                {/* Empty cells for first week offset */}
                {Array.from({ length: firstDay }).map((_, i) => (
                  <div key={`empty-${i}`} style={{ padding: 8 }} />
                ))}

                {/* Day cells */}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                  const dayEmails = emailsByDate.get(dateStr) || [];
                  const isSelected = selectedDay === dateStr;
                  const isToday = new Date().toISOString().slice(0, 10) === dateStr;

                  return (
                    <button
                      key={day}
                      onClick={() => setSelectedDay(isSelected ? null : dateStr)}
                      style={{
                        padding: "8px 4px", borderRadius: 8, border: "none",
                        cursor: dayEmails.length > 0 ? "pointer" : "default",
                        background: isSelected ? "var(--color-accent-light)" : isToday ? "#f0f9ff" : "transparent",
                        display: "flex", flexDirection: "column", alignItems: "center",
                        gap: 4, minHeight: 52, transition: "background 150ms ease",
                      }}
                    >
                      <span style={{
                        fontSize: 13,
                        fontWeight: isToday ? 700 : 400,
                        color: isSelected ? "var(--color-accent)" : "var(--color-primary)",
                      }}>
                        {day}
                      </span>
                      {dayEmails.length > 0 && (
                        <div style={{ display: "flex", gap: 2, flexWrap: "wrap", justifyContent: "center" }}>
                          {dayEmails.slice(0, 3).map((e, idx) => (
                            <div
                              key={idx}
                              style={{
                                width: 6, height: 6, borderRadius: "50%",
                                background: CAMPAIGN_TYPE_COLORS[e.type] || "var(--color-accent)",
                              }}
                            />
                          ))}
                          {dayEmails.length > 3 && (
                            <span style={{ fontSize: 8, color: "var(--color-tertiary)" }}>+{dayEmails.length - 3}</span>
                          )}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected Day Detail */}
            {selectedDay && selectedDayEmails.length > 0 && (
              <div style={{
                background: "white", borderRadius: 14, padding: 20,
                border: "1px solid var(--color-border)",
              }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: "var(--color-primary)", margin: "0 0 12px" }}>
                  {new Date(selectedDay + "T00:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                  {" "}— {selectedDayEmails.length} campaign{selectedDayEmails.length !== 1 ? "s" : ""}
                </h3>
                {selectedDayEmails.map((email, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "flex", alignItems: "center", gap: 12,
                      padding: "10px 0",
                      borderBottom: idx < selectedDayEmails.length - 1 ? "1px solid var(--color-border)" : "none",
                    }}
                  >
                    <div style={{
                      width: 8, height: 8, borderRadius: "50%", flexShrink: 0,
                      background: CAMPAIGN_TYPE_COLORS[email.type] || "var(--color-accent)",
                    }} />
                    <span style={{ flex: 1, fontSize: 14, color: "var(--color-primary)" }}>
                      {email.subject}
                    </span>
                    {email.type && (
                      <Badge size="sm" variant="accent" style={{
                        background: `${CAMPAIGN_TYPE_COLORS[email.type] || "#8b5cf6"}15`,
                        color: CAMPAIGN_TYPE_COLORS[email.type] || "#8b5cf6",
                        fontSize: 10,
                      }}>
                        {email.type}
                      </Badge>
                    )}
                    <button
                      onClick={() => copySubject(email.subject, idx)}
                      style={{
                        width: 28, height: 28, borderRadius: 6,
                        border: "1px solid var(--color-border)",
                        background: copiedIdx === idx ? "#dcfce7" : "white",
                        cursor: "pointer", display: "flex",
                        alignItems: "center", justifyContent: "center",
                        flexShrink: 0,
                      }}
                      title="Copy subject"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={copiedIdx === idx ? "#10b981" : "currentColor"} strokeWidth="2">
                        {copiedIdx === idx ? (
                          <path d="M20 6L9 17l-5-5" />
                        ) : (
                          <>
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                            <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                          </>
                        )}
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
