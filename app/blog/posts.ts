export type BlogPost = {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
};

export const posts: BlogPost[] = [
  {
    slug: "d2c-email-marketing-trends-2026",
    title: "D2C Email Marketing Trends to Watch in 2026",
    date: "2026-02-20",
    description:
      "Key email marketing trends shaping Indian D2C brands — from hyper-personalization to AI-generated subject lines.",
    tags: ["trends", "d2c", "email-marketing"],
  },
  {
    slug: "subject-line-strategies",
    title:
      "Subject Line Strategies That Get Opens: Lessons from 7,000+ D2C Emails",
    date: "2026-02-22",
    description:
      "Data-driven analysis of subject line patterns from 150+ Indian D2C brands. What length, emoji usage, and word choices drive opens.",
    tags: ["subject-lines", "data-analysis"],
  },
  {
    slug: "how-top-brands-structure-sale-emails",
    title: "How Top Indian D2C Brands Structure Sale Emails",
    date: "2026-02-25",
    description:
      "Breaking down the anatomy of high-performing sale emails from brands like Nykaa, Mamaearth, and boAt.",
    tags: ["sales", "campaign-types", "d2c"],
  },
];
