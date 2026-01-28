"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Logo from "./components/Logo";

export default function Home() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/browse?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/browse");
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#ffffff" }}>
      {/* Sticky Navbar */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1000,
          backgroundColor: "#fff",
          borderBottom: "1px solid #e5e5e5",
          padding: "16px 0",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <a href="/" style={{ textDecoration: "none", color: "inherit", display: "flex", alignItems: "center" }}>
            <Logo size={32} />
            <span style={{ fontSize: 24, fontWeight: 700, color: "#1a1a1a" }}>MailMuse</span>
          </a>
          <a
            href="/browse"
            style={{
              padding: "10px 24px",
              backgroundColor: "#14b8a6",
              color: "#fff",
              textDecoration: "none",
              borderRadius: 8,
              fontWeight: 500,
              fontSize: 14,
            }}
          >
            Explore Database
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        style={{
          padding: "80px 24px",
          textAlign: "center",
          background: "linear-gradient(135deg, #f0fdfa 0%, #ffffff 100%)",
        }}
      >
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <h1
            style={{
              fontSize: "clamp(36px, 5vw, 56px)",
              fontWeight: 700,
              color: "#1a1a1a",
              marginBottom: 24,
              lineHeight: 1.2,
            }}
          >
            The Complete Database of Brand Emails Sent to Indian Consumers
          </h1>
          <p
            style={{
              fontSize: 20,
              color: "#666",
              marginBottom: 40,
              lineHeight: 1.6,
            }}
          >
            Access thousands of real brand emails sent to customers. Analyze competitor campaigns, study email strategies, and discover what actually works—all in one searchable archive.
          </p>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} style={{ maxWidth: 600, margin: "0 auto 32px" }}>
            <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by brand, campaign type, or keyword..."
                style={{
                  flex: 1,
                  padding: "16px 20px",
                  border: "2px solid #e5e5e5",
                  borderRadius: 12,
                  fontSize: 16,
                  outline: "none",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#14b8a6")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#e5e5e5")}
              />
              <button
                type="submit"
                style={{
                  padding: "16px 32px",
                  backgroundColor: "#14b8a6",
                  color: "#fff",
                  border: "none",
                  borderRadius: 12,
                  fontSize: 16,
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "background-color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#0d9488")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#14b8a6")}
              >
                Search
              </button>
            </div>
            <p style={{ fontSize: 14, color: "#999", margin: 0 }}>Free access • No sign-up required • Updated daily</p>
          </form>

          {/* CTA Buttons */}
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <a
              href="/browse"
              style={{
                padding: "16px 32px",
                backgroundColor: "#14b8a6",
                color: "#fff",
                textDecoration: "none",
                borderRadius: 12,
                fontWeight: 600,
                fontSize: 16,
                transition: "background-color 0.2s",
                display: "inline-block",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#0d9488")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#14b8a6")}
            >
              Get Started Free
            </a>
            <a
              href="/browse"
              style={{
                padding: "16px 32px",
                backgroundColor: "transparent",
                color: "#14b8a6",
                textDecoration: "none",
                borderRadius: 12,
                fontWeight: 600,
                fontSize: 16,
                border: "2px solid #14b8a6",
                transition: "all 0.2s",
                display: "inline-block",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#f0fdfa";
                e.currentTarget.style.borderColor = "#0d9488";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.borderColor = "#14b8a6";
              }}
            >
              Explore Database
            </a>
          </div>
        </div>
      </section>

      {/* Value Proposition / Features */}
      <section style={{ padding: "80px 24px", backgroundColor: "#fafafa" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", fontSize: 40, fontWeight: 700, marginBottom: 16, color: "#1a1a1a" }}>
            Why Marketing Teams Choose MailMuse
          </h2>
          <p style={{ textAlign: "center", fontSize: 18, color: "#666", marginBottom: 60 }}>
            The only database that gives you direct access to what brands actually send their customers
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 40,
            }}
          >
            {[
              {
                icon: "🔍",
                title: "Instant Competitive Intelligence",
                description: "See exactly what your competitors are sending. Search thousands of real emails in seconds—no guessing, no assumptions.",
              },
              {
                icon: "📊",
                title: "Complete Campaign Archive",
                description: "Every email sent by top Indian brands is here. Welcome sequences, promotional campaigns, newsletters—all indexed and searchable.",
              },
              {
                icon: "🎯",
                title: "Precise Filtering",
                description: "Filter by brand, campaign type, date, or content. Find specific email types—welcome emails, product launches, re-engagement campaigns.",
              },
              {
                icon: "💡",
                title: "Strategy Insights",
                description: "Understand what messaging works. Study subject lines, CTAs, and campaign timing from brands that actually convert.",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                style={{
                  textAlign: "center",
                  padding: "32px",
                  backgroundColor: "#fff",
                  borderRadius: 16,
                  border: "1px solid #e5e5e5",
                  transition: "transform 0.2s, box-shadow 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div style={{ fontSize: 48, marginBottom: 16 }}>{feature.icon}</div>
                <h3 style={{ fontSize: 24, fontWeight: 600, marginBottom: 12, color: "#1a1a1a" }}>
                  {feature.title}
                </h3>
                <p style={{ fontSize: 16, color: "#666", lineHeight: 1.6, margin: 0 }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={{ padding: "80px 24px", backgroundColor: "#fff" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", fontSize: 40, fontWeight: 700, marginBottom: 16, color: "#1a1a1a" }}>
            How Marketing Teams Use MailMuse
          </h2>
          <p style={{ textAlign: "center", fontSize: 18, color: "#666", marginBottom: 60 }}>
            Get competitive intelligence in 3 simple steps
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 40 }}>
            {[
              {
                step: "1",
                title: "Search Brand Emails",
                description: "Enter any brand name or keyword. Instantly access their complete email archive—every campaign they've sent to customers.",
              },
              {
                step: "2",
                title: "Analyze Campaigns",
                description: "Filter by campaign type, date, or content. Study subject lines, messaging, CTAs, and timing to understand what works.",
              },
              {
                step: "3",
                title: "Apply Insights",
                description: "Copy winning strategies. See full email HTML, track campaign patterns, and discover messaging that actually converts.",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                style={{
                  textAlign: "center",
                  padding: "40px 32px",
                  transition: "transform 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: "50%",
                    backgroundColor: "#14b8a6",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 28,
                    fontWeight: 700,
                    margin: "0 auto 24px",
                  }}
                >
                  {item.step}
                </div>
                <h3 style={{ fontSize: 24, fontWeight: 600, marginBottom: 12, color: "#1a1a1a" }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: 16, color: "#666", lineHeight: 1.6, margin: 0 }}>
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section style={{ padding: "80px 24px", backgroundColor: "#fafafa" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: 32, fontWeight: 700, marginBottom: 16, color: "#1a1a1a" }}>
            Trusted by Marketing Teams Across India
          </h2>
          <p style={{ fontSize: 18, color: "#666", marginBottom: 40 }}>
            Join marketers, researchers, and strategists who use MailMuse to stay ahead of the competition.
          </p>
          
          {/* Placeholder logos */}
          <div style={{ display: "flex", justifyContent: "center", gap: 40, flexWrap: "wrap", marginBottom: 60, opacity: 0.6 }}>
            {["Brand A", "Brand B", "Brand C", "Brand D"].map((brand, idx) => (
              <div
                key={idx}
                style={{
                  padding: "20px 40px",
                  backgroundColor: "#fff",
                  borderRadius: 8,
                  border: "1px solid #e5e5e5",
                  fontSize: 18,
                  fontWeight: 600,
                  color: "#999",
                }}
              >
                {brand}
              </div>
            ))}
          </div>

          {/* Testimonials */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 32 }}>
            {[
              {
                quote: "MailMuse has become essential for our competitive research. Instead of guessing what competitors are doing, we see exactly what they send customers. Game changer.",
                author: "Priya Sharma",
                role: "Marketing Director, E-commerce Brand",
              },
              {
                quote: "The best part? Seeing real emails brands actually send. Not templates or examples—actual campaigns. This is the competitive intelligence tool we've been missing.",
                author: "Rahul Mehta",
                role: "Email Marketing Strategist",
              },
            ].map((testimonial, idx) => (
              <div
                key={idx}
                style={{
                  padding: "32px",
                  backgroundColor: "#fff",
                  borderRadius: 16,
                  border: "1px solid #e5e5e5",
                  textAlign: "left",
                }}
              >
                <p style={{ fontSize: 16, color: "#666", lineHeight: 1.6, marginBottom: 20, fontStyle: "italic" }}>
                  "{testimonial.quote}"
                </p>
                <div>
                  <div style={{ fontWeight: 600, color: "#1a1a1a", marginBottom: 4 }}>
                    {testimonial.author}
                  </div>
                  <div style={{ fontSize: 14, color: "#999" }}>{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Details */}
      <section style={{ padding: "80px 24px", backgroundColor: "#fff" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(500px, 1fr))", gap: 60, alignItems: "center", marginBottom: 60 }}>
            <div>
              <h2 style={{ fontSize: 36, fontWeight: 700, marginBottom: 24, color: "#1a1a1a" }}>
                Search Every Email Brands Send
              </h2>
              <p style={{ fontSize: 18, color: "#666", lineHeight: 1.7, marginBottom: 24 }}>
                Our database contains every email sent by top Indian brands to their customers. Welcome sequences, promotional campaigns, newsletters—all searchable, all accessible.
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {["Search by brand name or keyword", "Filter by campaign type and date", "View complete email HTML", "Track campaign patterns over time"].map((item, idx) => (
                  <li key={idx} style={{ padding: "12px 0", fontSize: 16, color: "#666", display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ color: "#14b8a6", fontSize: 20 }}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div
              style={{
                height: 300,
                backgroundColor: "#f0fdfa",
                borderRadius: 16,
                border: "2px dashed #14b8a6",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#14b8a6",
                fontSize: 18,
                fontWeight: 600,
              }}
            >
              Email Database Preview
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(500px, 1fr))", gap: 60, alignItems: "center" }}>
            <div
              style={{
                height: 300,
                backgroundColor: "#f0fdfa",
                borderRadius: 16,
                border: "2px dashed #14b8a6",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#14b8a6",
                fontSize: 18,
                fontWeight: 600,
                order: 2,
              }}
            >
              Campaign Analysis Preview
            </div>
            <div style={{ order: 1 }}>
              <h2 style={{ fontSize: 36, fontWeight: 700, marginBottom: 24, color: "#1a1a1a" }}>
                Analyze Campaigns Like a Pro
              </h2>
              <p style={{ fontSize: 18, color: "#666", lineHeight: 1.7, marginBottom: 24 }}>
                Filter by brand, campaign type, or date range. Study subject lines, messaging patterns, and CTAs. See what works—then apply it to your campaigns.
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {["Filter by brand and campaign type", "Study subject line patterns", "Analyze email design and layout", "Track campaign frequency and timing"].map((item, idx) => (
                  <li key={idx} style={{ padding: "12px 0", fontSize: 16, color: "#666", display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ color: "#14b8a6", fontSize: 20 }}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section
        style={{
          padding: "80px 24px",
          background: "linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)",
          textAlign: "center",
          color: "#fff",
        }}
      >
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <h2 style={{ fontSize: 40, fontWeight: 700, marginBottom: 24, color: "#fff" }}>
            Start Analyzing Competitor Emails Today
          </h2>
          <p style={{ fontSize: 20, marginBottom: 40, opacity: 0.95 }}>
            Free access to thousands of real brand emails. See what your competitors send, understand what works, and improve your campaigns—no credit card required.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <a
              href="/browse"
              style={{
                padding: "16px 32px",
                backgroundColor: "#fff",
                color: "#14b8a6",
                textDecoration: "none",
                borderRadius: 12,
                fontWeight: 600,
                fontSize: 16,
                transition: "transform 0.2s",
                display: "inline-block",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              Get Started Free
            </a>
            <a
              href="/browse"
              style={{
                padding: "16px 32px",
                backgroundColor: "transparent",
                color: "#fff",
                textDecoration: "none",
                borderRadius: 12,
                fontWeight: 600,
                fontSize: 16,
                border: "2px solid #fff",
                transition: "background-color 0.2s",
                display: "inline-block",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
            >
              Explore Database
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: "60px 24px 40px", backgroundColor: "#1a1a1a", color: "#fff" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 40, marginBottom: 40 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <Logo size={40} />
              <span style={{ fontSize: 24, fontWeight: 700 }}>MailMuse</span>
            </div>
              <p style={{ fontSize: 14, color: "#999", lineHeight: 1.6 }}>
                The complete database of brand emails sent to Indian consumers. Competitive intelligence for marketing teams.
              </p>
            </div>
            <div>
              <h4 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Company</h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {["About", "Pricing", "Contact"].map((link) => (
                  <li key={link} style={{ marginBottom: 8 }}>
                    <a href="/browse" style={{ color: "#999", textDecoration: "none", fontSize: 14 }}>
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Legal</h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {["Privacy", "Terms", "Cookies"].map((link) => (
                  <li key={link} style={{ marginBottom: 8 }}>
                    <a href="/browse" style={{ color: "#999", textDecoration: "none", fontSize: 14 }}>
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div style={{ borderTop: "1px solid #333", paddingTop: 40, textAlign: "center", color: "#999", fontSize: 14 }}>
            © 2026 MailMuse. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
