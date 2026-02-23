function slugify(brand: string): string {
  return brand
    .toLowerCase()
    .replace(/[&]/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function brandPairToSlug(brandA: string, brandB: string): string {
  const sorted = [brandA, brandB].sort((a, b) =>
    a.toLowerCase().localeCompare(b.toLowerCase())
  );
  return `${slugify(sorted[0])}-vs-${slugify(sorted[1])}`;
}

export function slugToBrandPair(slug: string): [string, string] | null {
  const idx = slug.indexOf("-vs-");
  if (idx === -1) return null;
  return [slug.slice(0, idx), slug.slice(idx + 4)];
}
