type TypeDescription = {
  intro: string;
  tips: string[];
  faqItems: { q: string; a: string }[];
};

export const TYPE_DESCRIPTIONS: Record<string, TypeDescription> = {
  Sale: {
    intro:
      "Sale emails are the backbone of D2C email marketing in India, driving revenue through limited-time offers, seasonal discounts, and flash sales. Indian brands use sale emails to create urgency around festive seasons like Diwali, end-of-season clearances, and monthly promotions. These emails typically feature bold subject lines with percentage discounts, countdown timers, and prominent CTAs to maximize conversion rates.",
    tips: [
      "Use specific numbers in subject lines (e.g., '50% OFF') rather than vague 'Big Sale' messaging",
      "Create urgency with countdown timers and limited-stock indicators",
      "Segment your audience to send personalized discount tiers",
      "Test subject lines with and without emojis to find what resonates",
      "Include a clear, single CTA button above the fold",
      "Send reminder emails for multi-day sales to capture late converters",
    ],
    faqItems: [
      { q: "What makes a great sale email subject line?", a: "The best sale email subject lines include a specific discount (e.g., '40% OFF'), create urgency ('Ends Tonight'), and are under 50 characters for mobile readability. Indian D2C brands also see strong results when referencing festivals." },
      { q: "How often should D2C brands send sale emails?", a: "Most successful Indian D2C brands send 2-4 sale emails per month, with increased frequency during festive seasons. Over-sending can lead to unsubscribes, so balance promotional content with value-driven emails." },
      { q: "What's the best time to send sale emails in India?", a: "Data shows that mornings (9-11 AM IST) and evenings (7-9 PM IST) see the highest open rates for sale emails. Weekends also perform well for lifestyle and fashion brands." },
    ],
  },
  Welcome: {
    intro:
      "Welcome emails are the first impression a brand makes on a new subscriber. Indian D2C brands use welcome sequences to introduce their story, offer first-purchase discounts, and set expectations for future communications. A well-crafted welcome email can achieve open rates 4x higher than regular marketing emails, making it one of the most valuable automated sequences in any email marketing program.",
    tips: [
      "Send the welcome email within minutes of signup for maximum engagement",
      "Include a first-purchase discount (10-15% is standard in Indian D2C)",
      "Share your brand story and values to build an emotional connection",
      "Set expectations for email frequency and content type",
      "Include social proof like customer reviews or press mentions",
      "Add links to your best-selling or most popular products",
    ],
    faqItems: [
      { q: "What should a D2C welcome email include?", a: "A great welcome email includes a warm greeting, the brand story, a first-purchase incentive (typically 10-15% off), social proof, and clear CTAs. Many Indian D2C brands also include links to popular product categories." },
      { q: "How many emails should be in a welcome series?", a: "Most Indian D2C brands use 3-5 email welcome sequences: (1) immediate welcome + discount, (2) brand story, (3) best sellers showcase, (4) social proof, (5) discount reminder if no purchase yet." },
    ],
  },
  "Abandoned Cart": {
    intro:
      "Abandoned cart emails recover lost revenue by reminding shoppers about items they left behind. In Indian e-commerce, cart abandonment rates average 70-80%, making recovery emails essential for profitability. The most effective abandoned cart sequences use a multi-touch approach: a reminder within an hour, a follow-up with social proof within 24 hours, and a final discount offer within 48-72 hours.",
    tips: [
      "Send the first reminder within 1 hour of cart abandonment",
      "Include product images and prices from the abandoned cart",
      "Add customer reviews for the abandoned products",
      "Offer free shipping or a small discount in the second or third email",
      "Create a sense of scarcity if stock is genuinely limited",
      "Make the checkout process easy with a direct link back to the cart",
    ],
    faqItems: [
      { q: "What is the ideal timing for abandoned cart emails?", a: "The best practice is a 3-email sequence: first email within 1 hour (reminder), second within 24 hours (social proof), and third within 48-72 hours (incentive like a discount or free shipping)." },
      { q: "How effective are abandoned cart emails for Indian D2C brands?", a: "Indian D2C brands typically recover 5-15% of abandoned carts through email sequences. Offering free shipping or cash-on-delivery options in follow-ups can significantly boost recovery rates." },
    ],
  },
  Newsletter: {
    intro:
      "Newsletter emails keep subscribers engaged between purchases with valuable content, brand updates, and curated recommendations. Indian D2C brands use newsletters to share styling tips, ingredient spotlights, behind-the-scenes content, and industry insights. Consistent newsletters build brand loyalty and keep your audience warm for future promotional campaigns.",
    tips: [
      "Maintain a consistent sending schedule (weekly or biweekly works best)",
      "Mix content types: educational, entertaining, and promotional",
      "Use personalization based on past purchase history",
      "Keep the design clean with clear content hierarchy",
      "Include user-generated content and community highlights",
      "Track engagement metrics to refine content strategy over time",
    ],
    faqItems: [
      { q: "How often should D2C brands send newsletters?", a: "Weekly or biweekly newsletters work best for most Indian D2C brands. The key is consistency — subscribers should know when to expect your emails." },
      { q: "What content works best in D2C newsletters?", a: "Top-performing newsletter content includes styling/usage tips, new product teasers, customer stories, behind-the-scenes content, and curated product picks. Educational content typically drives the highest engagement." },
    ],
  },
  "New Arrival": {
    intro:
      "New arrival emails generate excitement about fresh products, collections, and restocks. Indian D2C brands use these emails to drive early adoption, create buzz around seasonal collections, and reward loyal customers with first access. New arrival emails work especially well when paired with exclusivity messaging and limited-edition positioning.",
    tips: [
      "Give loyal customers early access before the general launch",
      "Use high-quality lifestyle imagery to showcase new products",
      "Tell the story behind the new product or collection",
      "Include pricing and a direct 'Shop Now' CTA",
      "Segment by past purchase behavior for personalized recommendations",
      "Create a sense of exclusivity with limited-edition or small-batch messaging",
    ],
    faqItems: [
      { q: "When should new arrival emails be sent?", a: "Send new arrival emails 1-2 days before the public launch to VIP customers, and on launch day to your general list. Follow up with a reminder 3-5 days later." },
      { q: "How do Indian D2C brands make new arrival emails stand out?", a: "Successful brands use high-quality product photography, tell the story behind the product, and create urgency with limited stock messaging or early-access windows." },
    ],
  },
  "Re-engagement": {
    intro:
      "Re-engagement emails win back inactive subscribers and lapsed customers. Indian D2C brands face high churn rates due to competitive markets, making re-engagement campaigns essential for maintaining a healthy email list. These emails typically use emotional appeals, special discounts, or 'We miss you' messaging to rekindle the relationship.",
    tips: [
      "Target subscribers who haven't opened emails in 60-90 days",
      "Use a compelling subject line that stands out from regular promotions",
      "Offer an exclusive 'come back' discount or incentive",
      "Ask for feedback on why they've been inactive",
      "Show what's new since their last engagement",
      "Remove non-responders after 2-3 re-engagement attempts to maintain list health",
    ],
    faqItems: [
      { q: "When should you send re-engagement emails?", a: "Start re-engagement sequences when subscribers haven't engaged in 60-90 days. Send 2-3 emails over 2 weeks before cleaning inactive contacts from your list." },
      { q: "What's a good re-engagement rate for D2C brands?", a: "A 5-12% re-engagement rate is typical for Indian D2C brands. Those offering exclusive discounts or new product previews tend to see the highest win-back rates." },
    ],
  },
  "Order Update": {
    intro:
      "Order update emails include shipping confirmations, delivery notifications, and post-purchase communications. While transactional in nature, these emails have the highest open rates (60-80%) of any email type, making them a valuable touchpoint for cross-selling and brand building. Indian D2C brands that optimize their order update emails see increased repeat purchases.",
    tips: [
      "Include clear tracking information and delivery timeline",
      "Add product care instructions or usage tips",
      "Cross-sell complementary products based on the order",
      "Request a review after delivery confirmation",
      "Use branded templates that reinforce your visual identity",
      "Include customer support contact information prominently",
    ],
    faqItems: [
      { q: "What order update emails should D2C brands send?", a: "Essential order update emails include: order confirmation, shipping notification with tracking, out-for-delivery alert, delivery confirmation, and a follow-up review request 5-7 days after delivery." },
      { q: "Can order update emails include marketing content?", a: "Yes, but keep promotional content below 20% of the email. Focus on the transaction details first, then add subtle cross-sell recommendations or referral program mentions." },
    ],
  },
  Festive: {
    intro:
      "Festive emails capitalize on India's rich calendar of festivals and celebrations. From Diwali and Holi to Republic Day and Navratri, Indian D2C brands create themed campaigns that resonate with cultural moments. Festive email campaigns typically drive 3-5x higher engagement and revenue compared to regular promotional emails, making them the most important campaigns of the year.",
    tips: [
      "Start festive campaigns 2-3 weeks before the festival",
      "Use culturally relevant design elements and messaging",
      "Create festive gift guides and curated collections",
      "Offer festive-exclusive products or packaging",
      "Time your emails around festival shopping patterns",
      "Build anticipation with a series of pre-festival emails",
    ],
    faqItems: [
      { q: "When should brands start festive email campaigns?", a: "Start 2-3 weeks before major festivals. For Diwali, begin campaigns in early October. Use a sequence: teaser → early access → main sale → last chance → extended sale." },
      { q: "Which Indian festivals drive the most email marketing?", a: "Diwali, Navratri, Holi, Independence Day, Republic Day, and End of Season Sales (EOSS) drive the highest email volumes. Diwali alone accounts for 15-20% of annual email campaigns for most Indian D2C brands." },
    ],
  },
  Loyalty: {
    intro:
      "Loyalty emails reward and retain existing customers through points updates, tier upgrades, exclusive access, and member-only offers. Indian D2C brands with active loyalty programs see 2-3x higher customer lifetime value. These emails maintain engagement between purchases and make customers feel valued, reducing churn in competitive markets.",
    tips: [
      "Send regular points balance updates and expiry reminders",
      "Celebrate customer milestones (anniversaries, tier upgrades)",
      "Offer exclusive early access to sales and new products",
      "Create member-only product drops or limited editions",
      "Personalize offers based on purchase history and preferences",
      "Make redemption easy with clear CTAs and simple processes",
    ],
    faqItems: [
      { q: "What loyalty emails should D2C brands send?", a: "Essential loyalty emails include: welcome to program, points earned/balance updates, tier upgrade notifications, points expiry reminders, exclusive member offers, and birthday/anniversary rewards." },
      { q: "How do loyalty emails impact customer retention?", a: "Brands with active loyalty email programs see 20-30% higher repeat purchase rates. Regular points reminders and exclusive offers keep customers engaged and reduce churn to competitors." },
    ],
  },
  Feedback: {
    intro:
      "Feedback emails collect reviews, ratings, and customer insights that drive social proof and product improvement. Indian D2C brands use post-purchase feedback requests to build their review base, gather NPS scores, and identify product issues early. Reviews generated through feedback emails significantly boost conversion rates for future shoppers.",
    tips: [
      "Send the review request 5-7 days after delivery",
      "Make the review process simple with 1-click star ratings",
      "Incentivize reviews with loyalty points or small discounts",
      "Follow up once if no response, but don't over-ask",
      "Ask for specific feedback (product quality, fit, packaging)",
      "Share how customer feedback has led to product improvements",
    ],
    faqItems: [
      { q: "When is the best time to ask for feedback?", a: "Send feedback requests 5-7 days after delivery for physical products, giving customers enough time to try the product. For services, ask within 24-48 hours of the experience." },
      { q: "How can D2C brands increase review submission rates?", a: "Offering loyalty points, simplifying the review form to 1-click ratings, and sending a single follow-up reminder can increase review rates from 5% to 15-20%." },
    ],
  },
  "Back in Stock": {
    intro:
      "Back in stock emails notify customers when previously sold-out products are available again. These emails have exceptionally high conversion rates because they target shoppers who already expressed intent. Indian D2C brands use back-in-stock notifications to recover lost sales and create a sense of scarcity that drives immediate purchases.",
    tips: [
      "Send notifications immediately when the product is restocked",
      "Include the product image, price, and a direct purchase link",
      "Create urgency by mentioning limited stock quantities",
      "Offer early access to waitlist subscribers before the general audience",
      "Include similar products as alternatives in case they sell out again",
    ],
    faqItems: [
      { q: "How effective are back in stock emails?", a: "Back in stock emails typically see 40-60% open rates and 15-25% click-through rates, making them among the highest-performing email types. The pre-existing purchase intent drives strong conversion." },
      { q: "How should brands handle back in stock notifications?", a: "Set up an automated waitlist capture on out-of-stock product pages, then trigger immediate email notifications on restock. Prioritize waitlist subscribers for limited-quantity restocks." },
    ],
  },
  Educational: {
    intro:
      "Educational emails provide value through how-to guides, ingredient spotlights, styling tips, and expert advice. Indian D2C brands use educational content to build trust, position themselves as category experts, and nurture leads who aren't ready to purchase. These emails drive long-term engagement and brand loyalty while supporting SEO through shared content.",
    tips: [
      "Focus on solving real customer problems with actionable advice",
      "Use a mix of formats: text, images, infographics, and video links",
      "Reference your products naturally without being overly promotional",
      "Create content series that keep subscribers coming back",
      "Leverage customer questions and support tickets for content ideas",
    ],
    faqItems: [
      { q: "What educational content works for D2C brands?", a: "Top-performing educational content includes product usage guides, ingredient/material spotlights, styling tips, comparison guides, and expert interviews. Content that solves real problems gets the most engagement." },
      { q: "How should educational emails balance content and promotion?", a: "Follow the 80/20 rule: 80% valuable content, 20% product mentions. Soft CTAs like 'Shop products mentioned' work better than hard sells in educational emails." },
    ],
  },
  "Product Showcase": {
    intro:
      "Product showcase emails highlight specific products through detailed features, benefits, and use cases. Indian D2C brands use these emails to drive consideration for high-margin products, educate about product differentiators, and build desire before purchase. These emails bridge the gap between awareness and conversion with rich product storytelling.",
    tips: [
      "Use high-quality lifestyle images that show the product in context",
      "Highlight key features and benefits with scannable bullet points",
      "Include social proof like ratings and customer photos",
      "Tell the product story: ingredients, craftsmanship, or design process",
      "Add a clear price point and limited-time offer if applicable",
    ],
    faqItems: [
      { q: "What makes a product showcase email effective?", a: "The best product showcase emails combine stunning visuals, clear feature highlights, customer reviews, and a compelling narrative. They focus on benefits over features and include strong CTAs." },
      { q: "How often should brands send product showcase emails?", a: "1-2 product showcase emails per week is ideal. Too many can feel overly promotional. Mix them with educational and engagement content for a balanced email calendar." },
    ],
  },
  Promotional: {
    intro:
      "Promotional emails encompass general marketing offers, bundle deals, referral incentives, and seasonal promotions that don't fit neatly into sale or festive categories. Indian D2C brands use promotional emails to drive revenue through creative offers like buy-one-get-one, gift-with-purchase, and loyalty multiplier events.",
    tips: [
      "Test different promotional mechanics (BOGO, gift with purchase, free shipping)",
      "Personalize promotions based on customer segment and purchase history",
      "Create clear terms and conditions to build trust",
      "Use dynamic content to show different offers to different segments",
      "Track promotion-specific conversion rates to identify top performers",
    ],
    faqItems: [
      { q: "What types of promotional emails work best for D2C?", a: "Free shipping offers, bundle deals, and percentage discounts perform consistently well. Indian customers also respond strongly to cash-back offers and referral incentives." },
      { q: "How can brands avoid promotion fatigue?", a: "Rotate promotional mechanics, segment your audience, maintain a content-to-promotion ratio of 3:1, and ensure each promotion feels genuinely valuable rather than routine." },
    ],
  },
  Confirmation: {
    intro:
      "Confirmation emails verify actions like account creation, email subscription, order placement, and payment processing. While transactional in nature, these emails see open rates above 70% and represent a prime opportunity for brand reinforcement. Indian D2C brands that optimize confirmation emails build trust and set the stage for ongoing engagement.",
    tips: [
      "Confirm the specific action taken clearly and immediately",
      "Include next steps the customer should expect",
      "Add brand personality while keeping information clear",
      "Include customer support contact information",
      "Use the high open rate as an opportunity for soft cross-selling",
    ],
    faqItems: [
      { q: "What should a confirmation email include?", a: "Essential elements include: clear confirmation of the action, relevant details (order number, subscription info), expected next steps, customer support contact, and subtle brand reinforcement." },
      { q: "Can confirmation emails include marketing content?", a: "Yes, but keep it minimal. Focus on confirming the action first. You can include product recommendations or referral links, but they should be secondary to the transactional purpose." },
    ],
  },
};
