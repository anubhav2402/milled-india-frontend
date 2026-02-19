export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://milled-india-api.onrender.com";

export const INDUSTRIES = [
  "Beauty & Personal Care",
  "Women's Fashion",
  "Men's Fashion",
  "Food & Beverages",
  "Travel & Hospitality",
  "Electronics & Gadgets",
  "Home & Living",
  "Health & Wellness",
  "Finance & Fintech",
  "Kids & Baby",
  "Sports & Fitness",
  "Entertainment",
  "General Retail",
];

export const CAMPAIGN_TYPES = [
  "Sale",
  "Welcome",
  "Abandoned Cart",
  "Newsletter",
  "New Arrival",
  "Re-engagement",
  "Order Update",
  "Festive",
  "Loyalty",
  "Feedback",
];

export const CAMPAIGN_TYPE_COLORS: Record<string, string> = {
  Sale: "#ef4444",
  Welcome: "#10b981",
  "Abandoned Cart": "#f59e0b",
  Newsletter: "#8b5cf6",
  "New Arrival": "#3b82f6",
  "Re-engagement": "#ec4899",
  "Order Update": "#6366f1",
  Festive: "#f97316",
  Loyalty: "#14b8a6",
  Feedback: "#84cc16",
};
