import { User } from "../context/AuthContext";

export type NavLink = { label: string; href: string };

export function getNavLinks(user: User | null): NavLink[] {
  const links: NavLink[] = [
    { label: "Browse", href: "/browse" },
    { label: "Brands", href: "/brands" },
    { label: "Industries", href: "/industry" },
    { label: "Email Types", href: "/types" },
    { label: "Blog", href: "/blog" },
  ];
  if (user?.is_admin) {
    links.push({ label: "Analytics", href: "/analytics" });
    links.push({ label: "Admin", href: "/admin/dashboard" });
  }
  if (user) {
    links.push({ label: "Saved", href: "/saved" });
  }
  if (!user || (user.effective_plan !== "pro" && user.effective_plan !== "agency") || user.is_on_trial) {
    links.push({ label: "Pricing", href: "/pricing" });
  }
  return links;
}
