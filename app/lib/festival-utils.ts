export const FESTIVALS = [
  { name: "Diwali", slug: "diwali" },
  { name: "Holi", slug: "holi" },
  { name: "Navratri", slug: "navratri" },
  { name: "Republic Day Sale", slug: "republic-day-sale" },
  { name: "Independence Day Sale", slug: "independence-day-sale" },
  { name: "End of Season Sale (EOSS)", slug: "eoss" },
  { name: "New Year", slug: "new-year" },
  { name: "Valentine's Day", slug: "valentines-day" },
  { name: "Raksha Bandhan", slug: "rakhi" },
  { name: "Christmas", slug: "christmas" },
  { name: "Women's Day", slug: "womens-day" },
  { name: "Mother's Day", slug: "mothers-day" },
  { name: "Father's Day", slug: "fathers-day" },
] as const;

export function festivalSlugToName(slug: string): string {
  const found = FESTIVALS.find((f) => f.slug === slug);
  return found?.name || slug;
}

export function festivalNameToSlug(name: string): string {
  const found = FESTIVALS.find((f) => f.name === name);
  return found?.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}
