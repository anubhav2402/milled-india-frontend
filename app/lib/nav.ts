import { User } from "../context/AuthContext";

export type NavLink = { label: string; href: string };

export function getNavLinks(user: User | null): NavLink[] {
  const links: NavLink[] = [
    { label: "Browse", href: "/browse" },
    { label: "Brands", href: "/brands" },
    { label: "Industries", href: "/industry" },
    { label: "Analytics", href: "/analytics" },
    { label: "Blog", href: "/blog" },
  ];
  if (user) {
    links.push({ label: "Saved", href: "/saved" });
  }
  if (!user?.is_pro) {
    links.push({ label: "Pricing", href: "/pricing" });
  }
  return links;
}
