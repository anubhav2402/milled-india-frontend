const SLUG_MAP: Record<string, string> = {
  "apparel-and-accessories": "Apparel & Accessories",
  "baby-and-kids": "Baby & Kids",
  "beauty-and-personal-care": "Beauty & Personal Care",
  "business-and-b2b-retail": "Business & B2B Retail",
  "electronics-and-tech": "Electronics & Tech",
  entertainment: "Entertainment",
  "finance-and-fintech": "Finance & Fintech",
  "food-and-beverage": "Food & Beverage",
  "general-department-store": "General / Department Store",
  "health-fitness-and-wellness": "Health, Fitness & Wellness",
  "home-and-living": "Home & Living",
  "luxury-and-high-end-goods": "Luxury & High-End Goods",
  pets: "Pets",
  "travel-and-outdoors": "Travel & Outdoors",
};

export function industryToSlug(industry: string): string {
  return industry
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[/']/g, "")
    .replace(/,/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export function slugToIndustry(slug: string): string {
  return SLUG_MAP[slug] || slug;
}

export function getAllIndustrySlugs(): string[] {
  return Object.keys(SLUG_MAP);
}
