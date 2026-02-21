import { User } from "../context/AuthContext";

export type NavLink = { label: string; href: string };

export function getNavLinks(user: User | null): NavLink[] {
  const links: NavLink[] = [
    { label: "Browse", href: "/browse" },
    { label: "Brands", href: "/brands" },
    { label: "Analytics", href: "/analytics" },
    { label: "Benchmarks", href: "/benchmarks" },
  ];
  if (user) {
    links.push({ label: "Saved", href: "/saved" });
  }
  if (!user?.is_pro) {
    links.push({ label: "Pricing", href: "/pricing" });
  }
  return links;
}
