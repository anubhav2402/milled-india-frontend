const SLUG_MAP: Record<string, string> = {
  "beauty-and-personal-care": "Beauty & Personal Care",
  "womens-fashion": "Women's Fashion",
  "mens-fashion": "Men's Fashion",
  "food-and-beverages": "Food & Beverages",
  "travel-and-hospitality": "Travel & Hospitality",
  "electronics-and-gadgets": "Electronics & Gadgets",
  "home-and-living": "Home & Living",
  "health-and-wellness": "Health & Wellness",
  "finance-and-fintech": "Finance & Fintech",
  "kids-and-baby": "Kids & Baby",
  "sports-and-fitness": "Sports & Fitness",
  entertainment: "Entertainment",
  "general-retail": "General Retail",
};

export function industryToSlug(industry: string): string {
  return industry
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/'/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export function slugToIndustry(slug: string): string {
  return SLUG_MAP[slug] || slug;
}

export function getAllIndustrySlugs(): string[] {
  return Object.keys(SLUG_MAP);
}
