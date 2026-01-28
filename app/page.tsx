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
          padding: "120px 24px",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #00f2fe 100%)",
          position: "relative",
          overflow: "hidden",
          minHeight: "90vh",
          display: "flex",
          alignItems: "center",
        }}
      >
        {/* Decorative background elements */}
        <div
          style={{
            position: "absolute",
            top: "-50%",
            right: "-20%",
            width: "800px",
            height: "800px",
            background: "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)",
            borderRadius: "50%",
            filter: "blur(60px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-30%",
            left: "-10%",
            width: "600px",
            height: "600px",
            background: "radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)",
            borderRadius: "50%",
            filter: "blur(50px)",
          }}
        />

        <div style={{ maxWidth: 1400, margin: "0 auto", width: "100%", position: "relative", zIndex: 1 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(500px, 1fr))",
              gap: 80,
              alignItems: "center",
            }}
          >
            {/* Left Side: Content */}
            <div>
              <h1
                style={{
                  fontSize: "clamp(48px, 6vw, 72px)",
                  fontWeight: 800,
                  color: "#ffffff",
                  marginBottom: 32,
                  lineHeight: 1.1,
                  letterSpacing: "-0.03em",
                  textShadow: "0 2px 20px rgba(0,0,0,0.1)",
                }}
              >
                India's Largest Search Engine for Marketing Emails
              </h1>
              <p
                style={{
                  fontSize: "clamp(18px, 2vw, 24px)",
                  color: "rgba(255,255,255,0.95)",
                  marginBottom: 48,
                  lineHeight: 1.6,
                  fontWeight: 400,
                  textShadow: "0 1px 10px rgba(0,0,0,0.1)",
                }}
              >
                From Nykaa to Myntra, Zomato to Swiggy—access thousands of real emails sent by India's top D2C brands. Copy winning campaigns, steal subject lines, and see what actually converts.
              </p>

              {/* Search Bar */}
              <form onSubmit={handleSearch} style={{ marginBottom: 32 }}>
                <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by brand, campaign type, or keyword..."
                    style={{
                      flex: 1,
                      padding: "18px 24px",
                      border: "none",
                      borderRadius: 14,
                      fontSize: 16,
                      outline: "none",
                      transition: "all 0.2s",
                      color: "#1a1a1a",
                      backgroundColor: "#ffffff",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.2)";
                      e.currentTarget.style.transform = "translateY(-2px)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.15)";
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  />
                  <button
                    type="submit"
                    style={{
                      padding: "18px 36px",
                      backgroundColor: "#ffffff",
                      color: "#667eea",
                      border: "none",
                      borderRadius: 14,
                      fontSize: 16,
                      fontWeight: 700,
                      cursor: "pointer",
                      transition: "all 0.2s",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#f8f9fa";
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.2)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#ffffff";
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.15)";
                    }}
                  >
                    Search
                  </button>
                </div>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.9)", margin: 0 }}>
                  Free access • No sign-up required • Updated daily
                </p>
              </form>

              {/* CTA Buttons */}
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                <a
                  href="/browse"
                  style={{
                    padding: "18px 36px",
                    backgroundColor: "#ffffff",
                    color: "#667eea",
                    textDecoration: "none",
                    borderRadius: 14,
                    fontWeight: 700,
                    fontSize: 17,
                    transition: "all 0.2s",
                    display: "inline-block",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#f8f9fa";
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.25)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#ffffff";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.2)";
                  }}
                >
                  Start Exploring Now →
                </a>
                <a
                  href="/browse"
                  style={{
                    padding: "18px 36px",
                    backgroundColor: "transparent",
                    color: "#ffffff",
                    textDecoration: "none",
                    borderRadius: 14,
                    fontWeight: 700,
                    fontSize: 17,
                    border: "2px solid rgba(255,255,255,0.3)",
                    transition: "all 0.2s",
                    display: "inline-block",
                    backdropFilter: "blur(10px)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.5)";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  Browse All Emails
                </a>
              </div>
            </div>

            {/* Right Side: Image */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
              }}
            >
              <div
                style={{
                  width: "100%",
                  maxWidth: "600px",
                  height: "500px",
                  borderRadius: 24,
                  overflow: "hidden",
                  boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
                  background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&q=80"
                  alt="Email marketing and design"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: 24,
                  }}
                  onError={(e) => {
                    // Fallback if image fails
                    e.currentTarget.style.display = "none";
                    const parent = e.currentTarget.parentElement;
                    if (parent) {
                      parent.innerHTML = `
                        <div style="padding: 60px; text-align: center; color: rgba(255,255,255,0.9);">
                          <div style="font-size: 80px; margin-bottom: 24px;">📧</div>
                          <div style="font-size: 24px; font-weight: 700; margin-bottom: 12px;">Email Marketing</div>
                          <div style="font-size: 18px; opacity: 0.8;">Design & Campaign Analysis</div>
                        </div>
                      `;
                    }
                  }}
                />
                {/* Decorative overlay */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: "linear-gradient(135deg, rgba(102,126,234,0.1) 0%, rgba(118,75,162,0.1) 100%)",
                    pointerEvents: "none",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Brand Logos - Moved below */}
          <div style={{ marginTop: 80, textAlign: "center" }}>
            <p
              style={{
                fontSize: 14,
                color: "rgba(255,255,255,0.9)",
                marginBottom: 32,
                fontWeight: 500,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              Trusted by India's Top Brands
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 32,
                flexWrap: "wrap",
              }}
            >
              {[
                { name: "Nykaa", logo: "https://upload.wikimedia.org/wikipedia/commons/7/7a/Nykaa_New_Logo.svg" },
                { name: "Myntra", logo: "https://upload.wikimedia.org/wikipedia/commons/b/bc/Myntra_Logo.png" },
                { name: "Zomato", logo: "https://upload.wikimedia.org/wikipedia/commons/b/bd/Zomato_Logo.svg" },
                { name: "Swiggy", logo: "https://upload.wikimedia.org/wikipedia/commons/1/13/Swiggy_logo.png" },
                { name: "Meesho", logo: "https://upload.wikimedia.org/wikipedia/commons/3/33/Meesho_logo.png" },
                { name: "Mamaearth", logo: "https://mamaearth.com/cdn/shop/files/mama.svg" },
              ].map((brand, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: "16px 28px",
                    backgroundColor: "rgba(255,255,255,0.15)",
                    borderRadius: 12,
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    transition: "all 0.2s",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: 56,
                    minWidth: 110,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.25)";
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.15)";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    style={{
                      maxHeight: "36px",
                      maxWidth: "110px",
                      objectFit: "contain",
                      filter: "brightness(0) invert(1)",
                    }}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                      const parent = e.currentTarget.parentElement;
                      if (parent) {
                        parent.innerHTML = `<span style="font-size: 14px; font-weight: 700; color: #ffffff;">${brand.name}</span>`;
                      }
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition / Features */}
      <section style={{ padding: "80px 24px", backgroundColor: "#fff" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", fontSize: 44, fontWeight: 800, marginBottom: 16, color: "#1a1a1a", letterSpacing: "-0.02em" }}>
            Why Ecommerce Brands Love MailMuse
          </h2>
          <p style={{ textAlign: "center", fontSize: 20, color: "#4a5568", marginBottom: 60, fontWeight: 400 }}>
            Stop guessing. See exactly what Nykaa, Myntra, and other top brands send their customers—then copy what works.
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
                icon: "🎯",
                title: "Steal Winning Campaigns",
                description: "See every email Nykaa, Myntra, and Zomato send. Copy their subject lines, CTAs, and messaging—then watch your conversions soar.",
              },
              {
                icon: "📧",
                title: "Complete Email Archive",
                description: "Welcome emails, flash sales, cart abandonment, re-engagement—every campaign from India's top D2C brands, all in one place.",
              },
              {
                icon: "⚡",
                title: "Find What Works Fast",
                description: "Search by brand, campaign type, or keyword. See what messaging converts, what subject lines get opens, and what CTAs drive clicks.",
              },
              {
                icon: "🚀",
                title: "Copy & Convert",
                description: "Don't reinvent the wheel. Study proven campaigns from brands doing millions in revenue, then adapt their strategies to your brand.",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                style={{
                  textAlign: "center",
                  padding: "40px 32px",
                  backgroundColor: "#fff",
                  borderRadius: 20,
                  border: "2px solid #e2e8f0",
                  transition: "all 0.3s",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-8px)";
                  e.currentTarget.style.boxShadow = "0 12px 32px rgba(20, 184, 166, 0.15)";
                  e.currentTarget.style.borderColor = "#14b8a6";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)";
                  e.currentTarget.style.borderColor = "#e2e8f0";
                }}
              >
                <div style={{ fontSize: 56, marginBottom: 20 }}>{feature.icon}</div>
                <h3 style={{ fontSize: 26, fontWeight: 700, marginBottom: 16, color: "#1a1a1a" }}>
                  {feature.title}
                </h3>
                <p style={{ fontSize: 17, color: "#4a5568", lineHeight: 1.7, margin: 0 }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={{ padding: "80px 24px", backgroundColor: "#f8fafc" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", fontSize: 44, fontWeight: 800, marginBottom: 16, color: "#1a1a1a", letterSpacing: "-0.02em" }}>
            How Top Brands Use MailMuse
          </h2>
          <p style={{ textAlign: "center", fontSize: 20, color: "#4a5568", marginBottom: 60, fontWeight: 400 }}>
            Three steps to steal winning email campaigns
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 40 }}>
            {[
              {
                step: "1",
                title: "Search Any Brand",
                description: "Type 'Nykaa', 'Myntra', or any brand name. Instantly see every email they've sent—welcome sequences, flash sales, cart abandonment, everything.",
              },
              {
                step: "2",
                title: "Copy What Works",
                description: "Study subject lines that get opens. See CTAs that drive clicks. Analyze messaging that converts. Then steal the best parts.",
              },
              {
                step: "3",
                title: "Launch & Win",
                description: "Copy proven campaigns, adapt them to your brand, and watch your email revenue grow. No A/B testing needed—these campaigns already work.",
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
      <section style={{ padding: "80px 24px", backgroundColor: "#fff" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: 40, fontWeight: 800, marginBottom: 16, color: "#1a1a1a", letterSpacing: "-0.02em" }}>
            Used by India's Fastest-Growing Ecommerce Brands
          </h2>
          <p style={{ fontSize: 20, color: "#4a5568", marginBottom: 50, fontWeight: 400 }}>
            Join D2C brands and marketing teams who use MailMuse to outsmart competitors and boost email revenue.
          </p>
          
          {/* Indian D2C Brand Logos */}
          <div style={{ display: "flex", justifyContent: "center", gap: 32, flexWrap: "wrap", marginBottom: 60 }}>
            {[
              { name: "Nykaa", logo: "https://upload.wikimedia.org/wikipedia/commons/7/7a/Nykaa_New_Logo.svg" },
              { name: "Myntra", logo: "https://upload.wikimedia.org/wikipedia/commons/b/bc/Myntra_Logo.png" },
              { name: "Zomato", logo: "https://upload.wikimedia.org/wikipedia/commons/b/bd/Zomato_Logo.svg" },
              { name: "Swiggy", logo: "https://upload.wikimedia.org/wikipedia/commons/1/13/Swiggy_logo.png" },
              { name: "Meesho", logo: "https://upload.wikimedia.org/wikipedia/commons/3/33/Meesho_logo.png" },
              { name: "Mamaearth", logo: "https://mamaearth.com/cdn/shop/files/mama.svg" },
            ].map((brand, idx) => (
              <div
                key={idx}
                style={{
                  padding: "24px 36px",
                  backgroundColor: "#fff",
                  borderRadius: 16,
                  border: "2px solid #e2e8f0",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  transition: "all 0.2s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: 70,
                  minWidth: 140,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-6px)";
                  e.currentTarget.style.boxShadow = "0 12px 28px rgba(0,0,0,0.12)";
                  e.currentTarget.style.borderColor = "#14b8a6";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)";
                  e.currentTarget.style.borderColor = "#e2e8f0";
                }}
              >
                <img
                  src={brand.logo}
                  alt={brand.name}
                  style={{
                    maxHeight: "50px",
                    maxWidth: "140px",
                    objectFit: "contain",
                  }}
                  onError={(e) => {
                    // Fallback to text if image fails to load
                    e.currentTarget.style.display = "none";
                    const parent = e.currentTarget.parentElement;
                    if (parent) {
                      parent.innerHTML = `<span style="font-size: 18px; font-weight: 700; color: #1a1a1a;">${brand.name}</span>`;
                    }
                  }}
                />
              </div>
            ))}
          </div>

          {/* Testimonials */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 32 }}>
            {[
              {
                quote: "We copied Nykaa's welcome email sequence and saw a 40% increase in first-purchase conversions. MailMuse pays for itself in one campaign.",
                author: "Priya Sharma",
                role: "Head of Marketing, D2C Beauty Brand",
              },
              {
                quote: "Every week I check what Myntra and Zomato are sending. Their subject lines are gold—we've doubled our open rates by copying their best campaigns.",
                author: "Rahul Mehta",
                role: "Email Marketing Lead, Ecommerce Startup",
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
      <section style={{ padding: "80px 24px", backgroundColor: "#f8fafc" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(500px, 1fr))", gap: 60, alignItems: "center", marginBottom: 60 }}>
            <div>
              <h2 style={{ fontSize: 40, fontWeight: 800, marginBottom: 24, color: "#1a1a1a", letterSpacing: "-0.02em" }}>
                See Every Email Nykaa, Myntra & Zomato Send
              </h2>
              <p style={{ fontSize: 19, color: "#4a5568", lineHeight: 1.7, marginBottom: 24, fontWeight: 400 }}>
                Our database has every email sent by India's top D2C brands. Welcome sequences, flash sales, cart abandonment, re-engagement—everything is searchable and accessible.
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {["Search by brand (Nykaa, Myntra, Zomato, etc.)", "Filter by campaign type (sales, welcome, cart abandonment)", "View full email HTML with images and design", "Track what campaigns brands send and when"].map((item, idx) => (
                  <li key={idx} style={{ padding: "14px 0", fontSize: 17, color: "#4a5568", display: "flex", alignItems: "center", gap: 12, fontWeight: 400 }}>
                    <span style={{ color: "#14b8a6", fontSize: 22, fontWeight: 700 }}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div
              style={{
                height: 350,
                background: "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)",
                borderRadius: 20,
                border: "3px solid #14b8a6",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#14b8a6",
                fontSize: 20,
                fontWeight: 700,
                boxShadow: "0 8px 24px rgba(20, 184, 166, 0.2)",
              }}
            >
              📧 Email Database Preview
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(500px, 1fr))", gap: 60, alignItems: "center" }}>
            <div
              style={{
                height: 350,
                background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
                borderRadius: 20,
                border: "3px solid #f59e0b",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#92400e",
                fontSize: 20,
                fontWeight: 700,
                boxShadow: "0 8px 24px rgba(245, 158, 11, 0.2)",
                order: 2,
              }}
            >
              📊 Campaign Analysis Preview
            </div>
            <div style={{ order: 1 }}>
              <h2 style={{ fontSize: 40, fontWeight: 800, marginBottom: 24, color: "#1a1a1a", letterSpacing: "-0.02em" }}>
                Copy Winning Campaigns in Minutes
              </h2>
              <p style={{ fontSize: 19, color: "#4a5568", lineHeight: 1.7, marginBottom: 24, fontWeight: 400 }}>
                Filter by brand, campaign type, or date. Study subject lines that get opens, CTAs that drive clicks, and messaging that converts. Then steal the best parts.
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {["Filter by brand and campaign type", "Study subject lines that get 30%+ opens", "Copy CTAs that drive conversions", "See campaign timing and frequency"].map((item, idx) => (
                  <li key={idx} style={{ padding: "14px 0", fontSize: 17, color: "#4a5568", display: "flex", alignItems: "center", gap: 12, fontWeight: 400 }}>
                    <span style={{ color: "#14b8a6", fontSize: 22, fontWeight: 700 }}>✓</span>
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
          padding: "100px 24px",
          background: "linear-gradient(135deg, #14b8a6 0%, #0d9488 50%, #059669 100%)",
          textAlign: "center",
          color: "#fff",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ maxWidth: 800, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <h2 style={{ fontSize: 48, fontWeight: 800, marginBottom: 24, color: "#fff", letterSpacing: "-0.02em" }}>
            Start Stealing Winning Campaigns Today
          </h2>
          <p style={{ fontSize: 22, marginBottom: 50, opacity: 0.95, fontWeight: 400, lineHeight: 1.6 }}>
            Free access to thousands of real emails from Nykaa, Myntra, Zomato, and more. Copy what works, boost your conversions, and grow your email revenue—no credit card required.
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
              Start Exploring Now →
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
                The complete database of emails sent by India's top D2C brands. Copy winning campaigns and boost your email revenue.
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
