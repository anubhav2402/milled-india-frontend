/**
 * Centralized plan configuration — frontend mirror of backend/plans.py.
 * Single source of truth for plan limits, pricing, and feature gating.
 */

export type PlanTier = "free" | "starter" | "pro" | "agency";

export const PLAN_HIERARCHY: PlanTier[] = ["free", "starter", "pro", "agency"];

export const PLAN_NAMES: Record<PlanTier, string> = {
  free: "Free",
  starter: "Starter",
  pro: "Pro",
  agency: "Agency",
};

export type FeatureKey =
  | "archive_days"
  | "email_views_per_day"
  | "brand_pages_per_day"
  | "collections"
  | "emails_per_collection"
  | "html_exports_per_month"
  | "search_level"
  | "analytics"
  | "campaign_calendar"
  | "alerts"
  | "seats"
  | "template_editor"
  | "bulk_export"
  | "downloadable_reports"
  | "follows"
  | "bookmarks";

type LimitValue = number | string | boolean | null; // null = unlimited

export const PLAN_LIMITS: Record<PlanTier, Record<FeatureKey, LimitValue>> = {
  free: {
    archive_days: 30,
    email_views_per_day: 20,
    brand_pages_per_day: 5,
    collections: 5,
    emails_per_collection: 10,
    html_exports_per_month: 0,
    search_level: "basic",
    analytics: "none",
    campaign_calendar: false,
    alerts: 0,
    seats: 1,
    template_editor: "view_only",
    bulk_export: false,
    downloadable_reports: false,
    follows: 3,
    bookmarks: 10,
  },
  starter: {
    archive_days: 180,
    email_views_per_day: 75,
    brand_pages_per_day: 25,
    collections: 15,
    emails_per_collection: 50,
    html_exports_per_month: 3,
    search_level: "advanced",
    analytics: "basic",
    campaign_calendar: false,
    alerts: 0,
    seats: 1,
    template_editor: "limited",
    bulk_export: false,
    downloadable_reports: false,
    follows: 10,
    bookmarks: 50,
  },
  pro: {
    archive_days: null,
    email_views_per_day: null,
    brand_pages_per_day: null,
    collections: null,
    emails_per_collection: null,
    html_exports_per_month: null,
    search_level: "full",
    analytics: "full",
    campaign_calendar: true,
    alerts: 5,
    seats: 3,
    template_editor: "unlimited",
    bulk_export: false,
    downloadable_reports: false,
    follows: null,
    bookmarks: null,
  },
  agency: {
    archive_days: null,
    email_views_per_day: null,
    brand_pages_per_day: null,
    collections: null,
    emails_per_collection: null,
    html_exports_per_month: null,
    search_level: "full",
    analytics: "full",
    campaign_calendar: true,
    alerts: null,
    seats: 10,
    template_editor: "unlimited",
    bulk_export: true,
    downloadable_reports: true,
    follows: null,
    bookmarks: null,
  },
};

// Pricing constants (INR)
export const PLAN_PRICES: Record<
  PlanTier,
  { monthly: number; annual: number }
> = {
  free: { monthly: 0, annual: 0 },
  starter: { monthly: 599, annual: 5999 },
  pro: { monthly: 1599, annual: 15999 },
  agency: { monthly: 3999, annual: 39999 },
};

// ── Helpers ──

export function planRank(plan: PlanTier): number {
  return PLAN_HIERARCHY.indexOf(plan);
}

/** True if `userPlan` meets or exceeds the minimum tier for `feature`. */
export function canAccess(userPlan: PlanTier, feature: FeatureKey): boolean {
  const limit = PLAN_LIMITS[userPlan][feature];
  // boolean features
  if (typeof limit === "boolean") return limit;
  // null = unlimited
  if (limit === null) return true;
  // numeric: 0 means no access
  if (typeof limit === "number") return limit > 0;
  // string levels: anything other than "none" or "view_only" is accessible
  if (typeof limit === "string") return limit !== "none" && limit !== "view_only";
  return false;
}

/** True if the limit is null (unlimited). */
export function isUnlimited(plan: PlanTier, feature: FeatureKey): boolean {
  return PLAN_LIMITS[plan][feature] === null;
}

/** Get numeric limit or null for unlimited. */
export function getLimit(plan: PlanTier, feature: FeatureKey): number | null {
  const v = PLAN_LIMITS[plan][feature];
  return typeof v === "number" ? v : null;
}

/** Returns the minimum plan tier required for a feature. */
export function getMinPlanFor(feature: FeatureKey): PlanTier {
  for (const plan of PLAN_HIERARCHY) {
    if (canAccess(plan, feature)) return plan;
  }
  return "agency";
}

/** Returns the next tier that gives more of a feature, or null. */
export function getUpgradeTier(
  currentPlan: PlanTier,
  feature: FeatureKey
): PlanTier | null {
  const currentLimit = PLAN_LIMITS[currentPlan][feature];
  const idx = planRank(currentPlan);
  for (const higher of PLAN_HIERARCHY.slice(idx + 1)) {
    const higherLimit = PLAN_LIMITS[higher][feature];
    if (higherLimit === null) return higher;
    if (
      typeof higherLimit === "number" &&
      typeof currentLimit === "number" &&
      higherLimit > currentLimit
    )
      return higher;
    if (typeof higherLimit === "boolean" && higherLimit && !currentLimit)
      return higher;
  }
  return null;
}

/** Format price for display (e.g. 1599 → "₹1,599") */
export function formatPrice(amount: number): string {
  if (amount === 0) return "Free";
  return `₹${amount.toLocaleString("en-IN")}`;
}

/** Feature display names for upgrade prompts. */
export const FEATURE_LABELS: Record<FeatureKey, string> = {
  archive_days: "Email Archive Depth",
  email_views_per_day: "Daily Email Views",
  brand_pages_per_day: "Daily Brand Pages",
  collections: "Collections",
  emails_per_collection: "Emails per Collection",
  html_exports_per_month: "Monthly HTML Exports",
  search_level: "Search",
  analytics: "Analytics",
  campaign_calendar: "Campaign Calendar",
  alerts: "Brand Alerts",
  seats: "Team Seats",
  template_editor: "Template Editor",
  bulk_export: "Bulk Export",
  downloadable_reports: "Downloadable Reports",
  follows: "Brand Follows",
  bookmarks: "Bookmarks",
};
