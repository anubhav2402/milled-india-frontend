"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { API_BASE } from "../lib/constants";

export function useBookmarks() {
  const { user, token } = useAuth();
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(false);

  // Fetch bookmark IDs on mount
  useEffect(() => {
    if (!user || !token) {
      setBookmarkedIds(new Set());
      return;
    }

    const fetchIds = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/user/bookmarks/ids`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setBookmarkedIds(new Set(data.ids));
        }
      } catch (err) {
        console.error("Failed to fetch bookmark IDs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchIds();
  }, [user, token]);

  const isBookmarked = useCallback(
    (emailId: number) => bookmarkedIds.has(emailId),
    [bookmarkedIds]
  );

  const toggleBookmark = useCallback(
    async (emailId: number) => {
      if (!token) return;

      const wasBookmarked = bookmarkedIds.has(emailId);

      // Optimistic update
      setBookmarkedIds((prev) => {
        const next = new Set(prev);
        if (wasBookmarked) {
          next.delete(emailId);
        } else {
          next.add(emailId);
        }
        return next;
      });

      try {
        if (wasBookmarked) {
          await fetch(`${API_BASE}/user/bookmarks/${emailId}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          });
        } else {
          await fetch(`${API_BASE}/user/bookmarks`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email_id: emailId }),
          });
        }
      } catch (err) {
        // Revert on failure
        setBookmarkedIds((prev) => {
          const next = new Set(prev);
          if (wasBookmarked) {
            next.add(emailId);
          } else {
            next.delete(emailId);
          }
          return next;
        });
        console.error("Failed to toggle bookmark:", err);
      }
    },
    [token, bookmarkedIds]
  );

  return { bookmarkedIds, isBookmarked, toggleBookmark, loading };
}
