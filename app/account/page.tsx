"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Header from "../components/Header";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://milled-india-api.onrender.com";

export default function AccountPage() {
  const { user, token, logout } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const upgraded = searchParams.get("upgraded");

  const [subscription, setSubscription] = useState<{
    subscription_tier: string;
    is_pro: boolean;
    expires_at: string | null;
    razorpay_subscription_id: string | null;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }
    fetchSubscription();
  }, [token]);

  const fetchSubscription = async () => {
    try {
      const res = await fetch(`${API_BASE}/subscription/status`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setSubscription(await res.json());
      }
    } catch (e) {
      console.error("Failed to fetch subscription:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel your Pro subscription?")) return;
    setCancelling(true);
    try {
      const res = await fetch(`${API_BASE}/subscription/cancel`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        await fetchSubscription();
      }
    } catch (e) {
      console.error("Cancel error:", e);
      alert("Failed to cancel. Please try again.");
    } finally {
      setCancelling(false);
    }
  };

  if (!user) return null;

  return (
    <>
      <Header activeRoute="/account" />
      <div
        style={{
          maxWidth: 600,
          margin: "0 auto",
          padding: "40px 20px",
          fontFamily: "var(--font-inter)",
        }}
      >
        {/* Upgrade success banner */}
        {upgraded && (
          <div
            style={{
              background: "#dcfce7",
              border: "1px solid #86efac",
              borderRadius: 12,
              padding: "16px 20px",
              marginBottom: 24,
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <span style={{ fontSize: 20 }}>&#10003;</span>
            <div>
              <div style={{ fontWeight: 600, color: "#166534", fontSize: 15 }}>
                Welcome to Pro!
              </div>
              <div style={{ fontSize: 13, color: "#166534" }}>
                You now have full access to all MailMuse features.
              </div>
            </div>
          </div>
        )}

        <h1
          style={{
            fontSize: 24,
            fontWeight: 600,
            color: "var(--color-primary)",
            margin: "0 0 32px",
            fontFamily: "var(--font-dm-serif)",
          }}
        >
          Account
        </h1>

        {/* Profile Section */}
        <div
          style={{
            border: "1px solid var(--color-border)",
            borderRadius: 12,
            padding: 24,
            marginBottom: 20,
            background: "white",
          }}
        >
          <h2
            style={{
              fontSize: 16,
              fontWeight: 600,
              color: "var(--color-primary)",
              margin: "0 0 16px",
            }}
          >
            Profile
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div>
              <div style={{ fontSize: 12, color: "var(--color-tertiary)", marginBottom: 2 }}>
                Name
              </div>
              <div style={{ fontSize: 15, color: "var(--color-primary)" }}>
                {user.name || "—"}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: "var(--color-tertiary)", marginBottom: 2 }}>
                Email
              </div>
              <div style={{ fontSize: 15, color: "var(--color-primary)" }}>
                {user.email}
              </div>
            </div>
          </div>
        </div>

        {/* Subscription Section */}
        <div
          style={{
            border: subscription?.is_pro
              ? "2px solid #7c3aed"
              : "1px solid var(--color-border)",
            borderRadius: 12,
            padding: 24,
            marginBottom: 20,
            background: "white",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <h2
              style={{
                fontSize: 16,
                fontWeight: 600,
                color: "var(--color-primary)",
                margin: 0,
              }}
            >
              Subscription
            </h2>
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                padding: "4px 12px",
                borderRadius: 20,
                background: subscription?.is_pro
                  ? "linear-gradient(135deg, #7c3aed, #6d28d9)"
                  : "var(--color-accent-light)",
                color: subscription?.is_pro ? "white" : "var(--color-accent)",
              }}
            >
              {subscription?.is_pro ? "PRO" : "FREE"}
            </span>
          </div>

          {loading ? (
            <div style={{ fontSize: 14, color: "var(--color-secondary)" }}>Loading...</div>
          ) : subscription?.is_pro ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <div style={{ fontSize: 12, color: "var(--color-tertiary)", marginBottom: 2 }}>
                  Plan
                </div>
                <div style={{ fontSize: 15, color: "var(--color-primary)", fontWeight: 500 }}>
                  MailMuse Pro
                </div>
              </div>
              {subscription.expires_at && (
                <div>
                  <div style={{ fontSize: 12, color: "var(--color-tertiary)", marginBottom: 2 }}>
                    {subscription.razorpay_subscription_id
                      ? "Next billing date"
                      : "Access expires"}
                  </div>
                  <div style={{ fontSize: 15, color: "var(--color-primary)" }}>
                    {new Date(subscription.expires_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </div>
                </div>
              )}
              {subscription.razorpay_subscription_id && (
                <button
                  onClick={handleCancel}
                  disabled={cancelling}
                  style={{
                    fontSize: 13,
                    fontWeight: 500,
                    color: "#dc2626",
                    background: "none",
                    border: "1px solid #fca5a5",
                    padding: "8px 16px",
                    borderRadius: 8,
                    cursor: "pointer",
                    alignSelf: "flex-start",
                    marginTop: 4,
                    opacity: cancelling ? 0.6 : 1,
                  }}
                >
                  {cancelling ? "Cancelling..." : "Cancel Subscription"}
                </button>
              )}
              {!subscription.razorpay_subscription_id && (
                <div
                  style={{
                    fontSize: 13,
                    color: "var(--color-tertiary)",
                    fontStyle: "italic",
                  }}
                >
                  Subscription cancelled. Pro access continues until expiry.
                </div>
              )}
            </div>
          ) : (
            <div>
              <p
                style={{
                  fontSize: 14,
                  color: "var(--color-secondary)",
                  margin: "0 0 16px",
                  lineHeight: 1.5,
                }}
              >
                Upgrade to Pro for full access to analytics, the complete email
                archive, unlimited brand tracking, and more.
              </p>
              <Link
                href="/pricing"
                style={{
                  display: "inline-block",
                  fontSize: 14,
                  fontWeight: 500,
                  color: "white",
                  background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
                  textDecoration: "none",
                  padding: "10px 24px",
                  borderRadius: 10,
                }}
              >
                Upgrade to Pro
              </Link>
            </div>
          )}
        </div>

        {/* Logout */}
        <button
          onClick={() => {
            logout();
            router.push("/");
          }}
          style={{
            fontSize: 14,
            fontWeight: 500,
            color: "var(--color-secondary)",
            background: "none",
            border: "1px solid var(--color-border)",
            padding: "10px 20px",
            borderRadius: 8,
            cursor: "pointer",
            width: "100%",
          }}
        >
          Log out
        </button>
      </div>
    </>
  );
}
