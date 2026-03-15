import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  BookOpen, BarChart3, Target, Trophy, Bot, Settings, Search, Zap,
  ArrowUpRight, Plus, Minus,
} from "lucide-react";

const NAV_LINKS = ["Today", "How It Works", "Pricing", "Updates", "FAQ"];

const Landing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [navVisible, setNavVisible] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    if (user) navigate("/app");
  }, [user, navigate]);

  // Nav fade-in
  useEffect(() => {
    const t = setTimeout(() => setNavVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  // Wipe animation observer
  useEffect(() => {
    const sections = document.querySelectorAll(".wipe-section");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const faqs = [
    { q: "Is Euphoria free for students?", a: "Yes. Full access to all lessons, games, the AI market simulator, and portfolio tracking — completely free. No credit card required." },
    { q: "How is this different from other finance apps?", a: "Euphoria teaches through simulation, not textbooks. Every lesson is a scenario where you make decisions and see consequences. It's Duolingo meets Robinhood." },
    { q: "Can I use this in my classroom?", a: "Absolutely. The Schools plan lets you create classes with join codes, track individual progress, identify struggling learners, and export analytics." },
    { q: "Is the trading simulation realistic?", a: "Our AI engine generates realistic price movements, news events, and market scenarios. You'll experience bull runs, crashes, and breaking news — without real money." },
    { q: "What age group is this for?", a: "Designed for high school students (14+) through adult learners. The placement quiz adapts to your level." },
  ];

  const lessons = [
    { title: "How the Fed Affects Your Portfolio", date: "Updated Mar 2026", time: "8 min read" },
    { title: "Options 101: Calls, Puts, and Greeks", date: "Updated Feb 2026", time: "12 min read" },
    { title: "Reading an Earnings Report", date: "Updated Jan 2026", time: "6 min read" },
    { title: "Dollar-Cost Averaging Explained", date: "Updated Mar 2026", time: "5 min read" },
    { title: "Crypto Fundamentals: Beyond the Hype", date: "Updated Feb 2026", time: "10 min read" },
  ];

  const filters = ["All", "Stocks", "Options", "Crypto", "Macro"];

  const dockIcons = [BookOpen, BarChart3, Target, Trophy, Bot, Settings, Search, Zap];

  const muted = "rgba(255,255,255,0.45)";
  const borderSub = "rgba(255,255,255,0.08)";
  const accent = "#6166DC";

  return (
    <div style={{ background: "#000", color: "#fff", fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 300 }} className="min-h-screen overflow-x-hidden">
      {/* ─── NAV ─── */}
      <nav
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
          background: "rgba(0,0,0,0.8)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
          opacity: navVisible ? 1 : 0, transition: "opacity 600ms ease",
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 16, fontWeight: 400, letterSpacing: "-0.02em" }}>Euphoria</span>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: accent, display: "inline-block" }} />
          </div>
          <div className="hidden md:flex" style={{ gap: 28, alignItems: "center" }}>
            {NAV_LINKS.map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase().replace(/\s+/g, "-")}`}
                onClick={(e) => { e.preventDefault(); scrollTo(link.toLowerCase().replace(/\s+/g, "-")); }}
                style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", textDecoration: "none", transition: "color 200ms" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.55)")}
              >
                {link}
              </a>
            ))}
          </div>
          <button
            onClick={() => navigate("/auth?signup=true")}
            style={{
              fontSize: 12, padding: "6px 14px", borderRadius: 20,
              background: "#fff", color: "#000", border: "none", cursor: "pointer",
              fontWeight: 500,
            }}
          >
            Try Euphoria
          </button>
        </div>
      </nav>

      {/* ─── SECTION 1: HERO ─── */}
      <section className="wipe-section" style={{ padding: "160px 0 128px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
          <p style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.15em", color: accent, marginBottom: 24 }}>
            Euphoria
          </p>
          <h1 style={{ fontSize: "clamp(48px, 6vw, 72px)", fontWeight: 300, lineHeight: 1.1, marginBottom: 24 }}>
            Make better<br />investors.
          </h1>
          <p style={{ fontSize: 16, color: muted, maxWidth: 580, lineHeight: 1.6, marginBottom: 64 }}>
            We turn complex markets, gated knowledge, and noisy finance into instant learning — clear simulations, a beautiful interface — so anyone can build real wealth, without feeling overwhelmed.
          </p>

          {/* 3-column screenshot grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {[
              { label: "Interactive lessons", mockContent: "Lesson 4: Reading Charts" },
              { label: "Live leaderboards", mockContent: "🏆 Leaderboard — Top 10" },
              { label: "Market simulations", mockContent: "AI Market — Live Trading" },
            ].map((item) => (
              <div key={item.label}>
                <div
                  style={{
                    aspectRatio: "4/3", background: "#0a0a0a",
                    border: `1px solid ${borderSub}`, borderRadius: 8,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    padding: 24,
                  }}
                >
                  <span style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", textAlign: "center" }}>{item.mockContent}</span>
                </div>
                <p style={{ fontSize: 13, color: muted, marginTop: 12, textAlign: "center" }}>{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SECTION 2: FROM OVERWHELMING ─── */}
      <section id="today" className="wipe-section" style={{ padding: "128px 0" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
          <h2 style={{ fontSize: "clamp(40px, 4.5vw, 56px)", fontWeight: 300, lineHeight: 1.15, marginBottom: 64 }}>
            From overwhelming<br />to effortless.
          </h2>

          <div style={{ display: "flex", gap: 64, alignItems: "flex-start", flexWrap: "wrap" }}>
            {/* Icon dock */}
            <div style={{ display: "flex", gap: 12 }}>
              {dockIcons.map((Icon, i) => (
                <div
                  key={i}
                  style={{
                    width: 48, height: 48, borderRadius: "50%",
                    background: "#111", border: "1px solid rgba(255,255,255,0.1)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  <Icon size={18} color="rgba(255,255,255,0.5)" />
                </div>
              ))}
            </div>

            {/* Feature descriptions */}
            <div style={{ flex: 1, minWidth: 260, display: "flex", flexDirection: "column", gap: 24 }}>
              {[
                { name: "Lesson Library", desc: "25+ interactive lessons that teach through real-world scenarios." },
                { name: "AI Simulator", desc: "Trade against AI competitors with dynamic pricing and news." },
                { name: "Leaderboard", desc: "Compete with classmates and climbers worldwide." },
              ].map((f) => (
                <div key={f.name}>
                  <p style={{ fontSize: 14, color: "#fff", marginBottom: 4, fontWeight: 400 }}>{f.name}</p>
                  <p style={{ fontSize: 14, color: muted, lineHeight: 1.5 }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 3: LEARN BY DOING ─── */}
      <section id="how-it-works" className="wipe-section" style={{ padding: "128px 0", textAlign: "center" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
          <p style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.15em", color: accent, marginBottom: 24 }}>
            Learn by doing
          </p>
          <h2 style={{ fontSize: "clamp(48px, 6vw, 72px)", fontWeight: 300, lineHeight: 1.1, marginBottom: 48 }}>
            Markets in<br />real time.
          </h2>

          <img
            src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&q=80"
            alt="Focused trader"
            style={{
              maxWidth: 500, width: "100%", margin: "0 auto 40px", display: "block",
              filter: "grayscale(0.3) brightness(0.8)", borderRadius: 4,
            }}
          />

          <p style={{ fontSize: 16, color: muted, maxWidth: 480, margin: "0 auto", lineHeight: 1.6 }}>
            We sync Euphoria with live market data and let you practice in real conditions — without making costly real-world mistakes.
          </p>
        </div>
      </section>

      {/* ─── SECTION 4: COMPLEX DATA SIMPLIFIED ─── */}
      <section className="wipe-section" style={{ padding: "128px 0" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
          <h2 style={{ fontSize: "clamp(40px, 4.5vw, 56px)", fontWeight: 300, lineHeight: 1.15, marginBottom: 20 }}>
            Complex markets,<br />simplified.
          </h2>
          <p style={{ fontSize: 16, color: muted, maxWidth: 520, lineHeight: 1.6, marginBottom: 48 }}>
            We surface only what matters — lesson progress, simulated P&L, market context — so you can focus on learning, not decoding data.
          </p>

          {/* Monitor frame */}
          <div
            style={{
              background: "#0a0a0a", border: `1px solid ${borderSub}`,
              borderRadius: 12, padding: 32, marginBottom: 32,
              minHeight: 320, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
            }}
          >
            <div style={{ width: "100%", maxWidth: 600 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
                <span style={{ fontSize: 14, color: "rgba(255,255,255,0.6)" }}>Dashboard Overview</span>
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>Last 7 days</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
                {[
                  { label: "Lessons Done", value: "18/25" },
                  { label: "Sim P&L", value: "+$2,340" },
                  { label: "XP Earned", value: "4,200" },
                ].map((s) => (
                  <div key={s.label} style={{ padding: 16, background: "rgba(255,255,255,0.03)", borderRadius: 8 }}>
                    <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 4 }}>{s.label}</p>
                    <p style={{ fontSize: 20, fontWeight: 400 }}>{s.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div style={{ maxWidth: 400 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: muted }}>Course completion</span>
              <span style={{ fontSize: 12, color: muted }}>78%</span>
            </div>
            <div style={{ height: 4, background: "#111", borderRadius: 2 }}>
              <div style={{ width: "78%", height: "100%", background: accent, borderRadius: 2 }} />
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 5: TWO-COLUMN FEATURES ─── */}
      <section className="wipe-section" style={{ padding: "128px 0" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80 }}>
          {/* Left: CMD+K */}
          <div>
            <p style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.15em", color: muted, marginBottom: 16 }}>
              Keyboard shortcut
            </p>
            <h3 style={{ fontSize: 32, fontWeight: 300, marginBottom: 16, lineHeight: 1.2 }}>At your command.</h3>
            <p style={{ fontSize: 14, color: muted, lineHeight: 1.6, marginBottom: 32 }}>
              Hit ⌘K anywhere in Euphoria to search lessons, jump to simulations, or ask the AI tutor — instantly.
            </p>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <div style={{
                padding: "12px 24px", background: "transparent",
                border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8,
                fontSize: 14, fontFamily: "monospace",
              }}>
                ⌘&nbsp;&nbsp;command
              </div>
              <div style={{
                padding: "12px 20px", background: "transparent",
                border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8,
                fontSize: 14, fontFamily: "monospace",
              }}>
                K
              </div>
            </div>
          </div>

          {/* Right: Weekly digest */}
          <div>
            <p style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.15em", color: muted, marginBottom: 16 }}>
              Weekly digest
            </p>
            <h3 style={{ fontSize: 32, fontWeight: 300, marginBottom: 16, lineHeight: 1.2 }}>Weekly insights.</h3>
            <p style={{ fontSize: 14, color: muted, lineHeight: 1.6, marginBottom: 32 }}>
              Every Sunday, Euphoria sends you a digest of what moved markets, what you learned, and what to study next.
            </p>
            <div style={{
              padding: 20, background: "transparent",
              border: `1px solid ${borderSub}`, borderRadius: 8,
            }}>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", marginBottom: 12, fontWeight: 400 }}>📬 Your Weekly Recap</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <p style={{ fontSize: 12, color: muted }}>✦ S&P 500 rose 2.3% — 3 lessons explain why</p>
                <p style={{ fontSize: 12, color: muted }}>✦ You completed 4 lessons (+800 XP)</p>
                <p style={{ fontSize: 12, color: muted }}>✦ Next up: Options Fundamentals</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 6: KNOWLEDGE YOU CAN TRUST ─── */}
      <section id="updates" className="wipe-section" style={{ padding: "128px 0" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
          <h2 style={{ fontSize: "clamp(40px, 4.5vw, 56px)", fontWeight: 300, lineHeight: 1.15, marginBottom: 20, textAlign: "center" }}>
            Knowledge you<br />can trust.
          </h2>
          <p style={{ fontSize: 16, color: muted, textAlign: "center", maxWidth: 480, margin: "0 auto 48px", lineHeight: 1.6 }}>
            Every lesson is reviewed by finance professionals and updated when markets change. No outdated textbooks. No fluff.
          </p>

          {/* Lesson feed */}
          <div style={{ marginBottom: 32 }}>
            {lessons.map((lesson, i) => (
              <div
                key={i}
                style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "20px 0",
                  borderBottom: `1px solid rgba(255,255,255,0.07)`,
                  cursor: "pointer", transition: "opacity 200ms",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.7")}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 16 }}>📘</span>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 400, marginBottom: 2 }}>{lesson.title}</p>
                    <p style={{ fontSize: 12, color: muted }}>{lesson.date} · {lesson.time}</p>
                  </div>
                </div>
                <ArrowUpRight size={16} color="rgba(255,255,255,0.3)" />
              </div>
            ))}
          </div>

          {/* Filter tabs */}
          <div style={{ display: "flex", gap: 8 }}>
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                style={{
                  fontSize: 12, padding: "6px 14px", borderRadius: 20,
                  background: "transparent", color: activeFilter === f ? "#fff" : muted,
                  border: activeFilter === f ? "1px solid rgba(255,255,255,0.3)" : "1px solid rgba(255,255,255,0.1)",
                  cursor: "pointer", transition: "all 200ms",
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SECTION 7: PRICING ─── */}
      <section id="pricing" className="wipe-section" style={{ padding: "128px 0" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
          <p style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.15em", color: accent, marginBottom: 24 }}>
            Pricing
          </p>
          <h2 style={{ fontSize: "clamp(40px, 4.5vw, 56px)", fontWeight: 300, lineHeight: 1.15, marginBottom: 48 }}>
            Invest in yourself.
          </h2>

          {[
            { name: "Basic", price: "Free", cta: "Get started →", desc: "Everything to begin. 10 lessons, quiz mode, 5 levels.", highlight: false },
            { name: "Pro Student", price: "$9.99 / mo", cta: "Start free trial →", desc: "Unlimited lessons, AI simulator, all courses, XP system.", highlight: true },
            { name: "Schools", price: "Custom", cta: "Contact us →", desc: "Unlimited seats, LMS integrations, teacher dashboard.", highlight: false },
          ].map((tier) => (
            <div
              key={tier.name}
              style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "24px 0", paddingLeft: tier.highlight ? 20 : 0,
                borderBottom: `1px solid ${borderSub}`,
                borderLeft: tier.highlight ? `2px solid ${accent}` : "none",
                background: tier.highlight ? "rgba(97,102,220,0.04)" : "transparent",
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 4 }}>
                  <span style={{ fontSize: 16, fontWeight: 400 }}>{tier.name}</span>
                  <span style={{ fontSize: 14, color: muted }}>{tier.price}</span>
                </div>
                <p style={{ fontSize: 13, color: muted }}>{tier.desc}</p>
              </div>
              <button
                onClick={() => navigate(tier.name === "Schools" ? "/legal" : "/auth?signup=true")}
                style={{
                  fontSize: 13, color: "#fff", background: "transparent",
                  border: "none", cursor: "pointer", whiteSpace: "nowrap",
                  transition: "color 200ms",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = accent)}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#fff")}
              >
                {tier.cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ─── SECTION 8: FAQ ─── */}
      <section id="faq" className="wipe-section" style={{ padding: "128px 0" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", padding: "0 24px" }}>
          <h2 style={{ fontSize: "clamp(36px, 4vw, 48px)", fontWeight: 300, lineHeight: 1.15, marginBottom: 48 }}>
            Common questions
          </h2>

          {faqs.map((faq, i) => (
            <div key={i} style={{ borderBottom: `1px solid ${borderSub}` }}>
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{
                  width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "20px 0", background: "transparent", border: "none",
                  color: "#fff", cursor: "pointer", textAlign: "left", fontSize: 15, fontWeight: 400,
                }}
              >
                {faq.q}
                {openFaq === i ? <Minus size={16} color={muted} /> : <Plus size={16} color={muted} />}
              </button>
              <div
                style={{
                  maxHeight: openFaq === i ? 200 : 0,
                  overflow: "hidden",
                  transition: "max-height 300ms ease",
                }}
              >
                <p style={{ fontSize: 14, color: muted, lineHeight: 1.6, paddingBottom: 20 }}>
                  {faq.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── FOOTER CTA ─── */}
      <section className="wipe-section" style={{ padding: "128px 0", textAlign: "center" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
          <h2 style={{ fontSize: "clamp(48px, 5.5vw, 64px)", fontWeight: 300, lineHeight: 1.1, marginBottom: 32 }}>
            Ready to start<br />investing?
          </h2>
          <a
            href="/auth?signup=true"
            onClick={(e) => { e.preventDefault(); navigate("/auth?signup=true"); }}
            style={{
              fontSize: 16, color: "#fff", textDecoration: "none",
              transition: "color 200ms",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = accent)}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#fff")}
          >
            Create free account →
          </a>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer style={{ borderTop: `1px solid ${borderSub}`, padding: "64px 0 48px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1fr 1fr", gap: 40, marginBottom: 48 }}>
            <div>
              <span style={{ fontSize: 16, fontWeight: 400 }}>Euphoria</span>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: accent, display: "inline-block", marginLeft: 6, verticalAlign: "middle" }} />
            </div>
            {[
              { title: "Product", links: ["Features", "Pricing", "Updates", "FAQ"] },
              { title: "For Students", links: ["Get Started", "Simulator", "Games", "Leaderboard"] },
              { title: "Resources", links: ["Blog", "Help Center", "Community", "API"] },
              { title: "Legal", links: ["Privacy", "Terms", "COPPA", "DPA"] },
            ].map((col) => (
              <div key={col.title}>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", marginBottom: 16, fontWeight: 400 }}>{col.title}</p>
                {col.links.map((link) => (
                  <a
                    key={link}
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (["Privacy", "Terms", "COPPA", "DPA"].includes(link)) navigate("/legal");
                    }}
                    style={{ display: "block", fontSize: 13, color: muted, textDecoration: "none", marginBottom: 10, transition: "color 200ms" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = muted)}
                  >
                    {link}
                  </a>
                ))}
              </div>
            ))}
          </div>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>© 2026 Euphoria. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
