const TYPE_SLUG_MAP: Record<string, string> = {
  "sale-emails": "Sale",
  "welcome-emails": "Welcome",
  "abandoned-cart-emails": "Abandoned Cart",
  "newsletter-emails": "Newsletter",
  "new-arrival-emails": "New Arrival",
  "re-engagement-emails": "Re-engagement",
  "order-update-emails": "Order Update",
  "festive-emails": "Festive",
  "loyalty-emails": "Loyalty",
  "feedback-emails": "Feedback",
  "back-in-stock-emails": "Back in Stock",
  "educational-emails": "Educational",
  "product-showcase-emails": "Product Showcase",
  "promotional-emails": "Promotional",
  "confirmation-emails": "Confirmation",
};

const REVERSE_MAP: Record<string, string> = Object.fromEntries(
  Object.entries(TYPE_SLUG_MAP).map(([slug, name]) => [name, slug])
);

export function typeToSlug(typeName: string): string {
  return REVERSE_MAP[typeName] || typeName.toLowerCase().replace(/\s+/g, "-") + "-emails";
}

export function slugToType(slug: string): string {
  return TYPE_SLUG_MAP[slug] || slug;
}

export function getAllTypeSlugs(): string[] {
  return Object.keys(TYPE_SLUG_MAP);
}

export function getAllTypes(): { name: string; slug: string }[] {
  return Object.entries(TYPE_SLUG_MAP).map(([slug, name]) => ({ name, slug }));
}
