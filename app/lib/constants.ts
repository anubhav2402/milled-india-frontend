export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://milled-india-api.onrender.com";

export const INDUSTRIES = [
  "Apparel & Accessories",
  "Baby & Kids",
  "Beauty & Personal Care",
  "Books, Art & Stationery",
  "Business & B2B Retail",
  "Electronics & Tech",
  "Entertainment",
  "Finance & Fintech",
  "Food & Beverage",
  "General / Department Store",
  "Gifts & Lifestyle",
  "Health, Fitness & Wellness",
  "Home & Living",
  "Luxury & High-End Goods",
  "Pets",
  "Tools, Auto & DIY",
  "Travel & Outdoors",
];

export const SUBCATEGORIES: Record<string, string[]> = {
  "Apparel & Accessories": [
    "Activewear / Athleisure", "Bags & Handbags", "Footwear",
    "Hats & Accessories", "Intimates / Lingerie", "Jewelry",
    "Men's Clothing", "Outerwear", "Sunglasses & Eyewear",
    "Swimwear", "Unisex / Gender-Neutral Clothing", "Watches",
    "Women's Clothing", "Others",
  ],
  "Baby & Kids": [
    "Baby Gear", "Clothing", "Diapers & Hygiene", "Educational Products",
    "Feeding & Nursing", "Kids' Furniture", "Toys & Games", "Others",
  ],
  "Beauty & Personal Care": [
    "Bath & Body", "Beauty Tools & Devices", "Clean / Organic Beauty",
    "Fragrance / Perfume", "Grooming / Shaving", "Haircare",
    "Makeup / Cosmetics", "Oral Care", "Skincare", "Others",
  ],
  "Books, Art & Stationery": [
    "Art Supplies", "Crafting & DIY Kits", "Educational / Academic",
    "Fiction / Non-Fiction", "Journals & Planners",
    "Notebooks / Writing Tools", "Others",
  ],
  "Business & B2B Retail": [
    "Corporate Gifts", "Office Supplies", "Packaging & Fulfillment",
    "Promotional Products", "Others",
  ],
  "Electronics & Tech": [
    "Cameras & Photography", "Computers & Laptops", "Drones & Gadgets",
    "Gaming Consoles & Accessories", "Headphones & Audio Gear",
    "Smart Home Devices", "Smartphones", "Smartwatches & Wearables",
    "Tablets & Accessories", "Others",
  ],
  "Entertainment": [
    "Streaming", "Events & Ticketing", "Music", "Gaming", "Others",
  ],
  "Finance & Fintech": [
    "Payments", "Banking", "Insurance", "Investment", "Credit Cards", "Others",
  ],
  "Food & Beverage": [
    "Alcohol", "Beverages (Coffee, Tea, Juices)", "Cooking Ingredients & Spices",
    "Meal Kits", "Pantry Staples", "Snacks & Treats", "Specialty Foods",
    "Subscription Boxes", "Others",
  ],
  "General / Department Store": [
    "Multi-Category Retail", "Online Marketplaces", "Flash Sale Retailers", "Others",
  ],
  "Gifts & Lifestyle": [
    "Eco-Friendly / Sustainable Products", "Gift Cards",
    "Hobby & Craft Supplies", "Novelty & Fun Items", "Personalized Gifts",
    "Seasonal / Holiday Gifts", "Subscription Boxes", "Others",
  ],
  "Health, Fitness & Wellness": [
    "Fitness Equipment", "Mental Health / Meditation",
    "Personal Health Devices", "Supplements", "Vitamins & Nutrition",
    "Wearable Fitness Trackers", "Yoga & Recovery Gear", "Others",
  ],
  "Home & Living": [
    "Bedding & Bath", "Cleaning Supplies", "Furniture", "Home Décor",
    "Home Improvement", "Kitchen & Dining", "Lawn & Garden", "Lighting",
    "Rugs & Curtains", "Smart Home Devices", "Storage & Organization", "Others",
  ],
  "Luxury & High-End Goods": [
    "Collectibles & Limited Editions", "Designer Fashion", "Fine Jewelry",
    "Premium Skincare", "Others",
  ],
  "Pets": [
    "Pet Food", "Pet Apparel", "Pet Grooming", "Pet Health / Supplements",
    "Pet Toys", "Accessories", "Beds & Crates", "Others",
  ],
  "Tools, Auto & DIY": [
    "Automotive Accessories", "Car Cleaning & Care", "Hand Tools",
    "Hardware Supplies", "Home DIY Kits", "Lawn & Garden", "Power Tools", "Others",
  ],
  "Travel & Outdoors": [
    "Camping & Hiking Gear", "Coolers / Hydration",
    "Luggage & Travel Accessories", "Outdoor Furniture",
    "Travel Skincare & Essentials", "Beachwear & Travel Apparel", "Others",
  ],
};

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
  "Back in Stock",
  "Educational",
  "Product Showcase",
  "Promotional",
  "Confirmation",
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
  "Back in Stock": "#0891b2",
  Educational: "#7c3aed",
  "Product Showcase": "#059669",
  Promotional: "#dc2626",
  Confirmation: "#4f46e5",
};
