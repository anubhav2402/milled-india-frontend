import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/login", "/signup", "/dashboard", "/saved"],
      },
      {
        userAgent: "GPTBot",
        allow: "/",
        disallow: ["/api/", "/login", "/signup", "/dashboard", "/saved"],
      },
      {
        userAgent: "ClaudeBot",
        allow: "/",
        disallow: ["/api/", "/login", "/signup", "/dashboard", "/saved"],
      },
      {
        userAgent: "PerplexityBot",
        allow: "/",
        disallow: ["/api/", "/login", "/signup", "/dashboard", "/saved"],
      },
      {
        userAgent: "Google-Extended",
        allow: "/",
      },
      {
        userAgent: "Bytespider",
        allow: "/",
        disallow: ["/api/", "/login", "/signup", "/dashboard", "/saved"],
      },
    ],
    sitemap: "https://www.mailmuse.in/sitemap.xml",
  };
}
