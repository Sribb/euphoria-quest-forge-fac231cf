import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronDown, ArrowRight, Star, Menu, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { FeatureShowcase } from "@/features/landing/components/FeatureShowcase";
import { PricingSection } from "@/features/landing/components/PricingSection";
import BentoCard from "@/components/ui/bento-card";
import logo from "@/assets/euphoria-logo-button.png";

/* ─── Hero product screenshot with parallax tilt ─── */
const HeroImage = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [18, 0, -4]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.92, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.25], [0.5, 1]);
  const y = useTransform(scrollYProgress, [0, 0.5], [50, 0]);

  return (
    <div ref={ref} className="max-w-5xl mx-auto mt-16 md:mt-20" style={{ perspective: "1200px" }}>
      <motion.div style={{ rotateX, scale, opacity, y }} className="relative">
        {/* Subtle glow underneath */}
        <div className="absolute -inset-10 bg-[radial-gradient(ellipse_70%_50%_at_50%_100%,hsl(var(--primary)/0.10),transparent_70%)] pointer-events-none" />

        <div className="relative rounded-2xl border border-border/60 bg-card shadow-lg ring-1 ring-border/30 overflow-hidden">
          {/* macOS-style browser chrome */}
          <div className="flex items-center gap-2 px-4 py-3 bg-muted/40 border-b border-border/50">
            <div className="flex gap-1.5">
              <div className="w-[10px] h-[10px] rounded-full bg-destructive/60" />
              <div className="w-[10px] h-[10px] rounded-full bg-warning/60" />
              <div className="w-[10px] h-[10px] rounded-full bg-success/60" />
            </div>
            <div className="flex-1 flex justify-center">
              <div className="bg-background/60 rounded-md px-4 py-1 text-[11px] text-muted-foreground font-mono">
                app.euphoria.finance
              </div>
            </div>
          </div>
          <div className="relative">
            <video
              ref={(el) => { if (el) el.playbackRate = 2; }}
              src="/videos/dashboard-demo.mov"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-auto block"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

/* ─── Infinite-scroll testimonial row ─── */
const TestimonialRow = ({
  testimonials,
  direction = "left",
  speed = 38,
}: {
  testimonials: { quote: string; author: string; role: string }[];
  direction?: "left" | "right";
  speed?: number;
}) => {
  const doubled = [...testimonials, ...testimonials];
  const animClass = direction === "left"
    ? `animate-[scroll-left_${speed}s_linear_infinite]`
    : `animate-[scroll-right_${speed}s_linear_infinite]`;

  return (
    <div className="overflow-hidden">
      <div
        className={`flex gap-5 w-max hover:[animation-play-state:paused]`}
        style={{
          animation: `scroll-${direction} ${speed}s linear infinite`,
        }}
      >
        {doubled.map((t, i) => (
          <div
            key={i}
            className="min-w-[300px] max-w-[380px] bg-card rounded-2xl p-6 shrink-0 ring-1 ring-border/50 shadow-sm hover:shadow-md transition-shadow duration-300"
          >
            <div className="flex gap-0.5 mb-4">
              {[...Array(5)].map((_, j) => (
                <Star key={j} className="w-3.5 h-3.5 text-warning fill-warning" />
              ))}
            </div>
            <p className="text-[15px] text-foreground/80 leading-[1.7] mb-5 font-normal">"{t.quote}"</p>
            <div>
              <p className="text-sm font-medium text-foreground">{t.author}</p>
              <p className="text-[13px] text-muted-foreground">{t.role}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─── Main Landing ─── */
const Landing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (user) navigate("/app");
  }, [user, navigate]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  const steps = [
    { num: "01", title: "Take the Placement Quiz", desc: "20 scenario-based questions find your level instantly." },
    { num: "02", title: "Learn by Doing", desc: "Every lesson is a simulation. Make choices, see real results." },
    { num: "03", title: "Trade & Compete", desc: "Paper-trade with AI events. Test strategies risk-free." },
    { num: "04", title: "Level Up", desc: "Earn XP, maintain streaks, grow your skills." },
  ];

  const faqs = [
    { q: "Is Euphoria actually free for students?", a: "Yes! Full access to all lessons, games, the AI market simulator, and portfolio tracking — completely free. No credit card required." },
    { q: "How is this different from other apps?", a: "Euphoria teaches through simulation, not textbooks. Every lesson is a scenario where you make decisions and see consequences. It's Duolingo meets Robinhood." },
    { q: "Can I use this in my classroom?", a: "Absolutely. The Educator plan lets you create classes with join codes, track individual progress, identify struggling learners, and export analytics." },
    { q: "Is the trading simulation realistic?", a: "Our AI engine generates realistic price movements, news events, and market scenarios. You'll experience bull runs, crashes, and breaking news — without real money." },
    { q: "What age group is this for?", a: "Designed for high school students (14+) through adult learners. The placement quiz adapts to your level." },
  ];

  const topRowTestimonials = [
    { quote: "My students went from 'finance is boring' to fighting over trading scores. Euphoria changed how I teach.", author: "Ms. Rodriguez", role: "AP Economics Teacher" },
    { quote: "I learned more in two weeks than a semester of finance class. The simulations make everything click.", author: "Jake T.", role: "College Sophomore" },
    { quote: "Finally, a platform where my kids learn about money without risking any. The games are brilliant.", author: "Sarah M.", role: "Parent of 2" },
    { quote: "The AI coach caught gaps in my knowledge I didn't even know I had. Worth every penny.", author: "David L.", role: "Graduate Student" },
    { quote: "We rolled Euphoria out to 3 schools. Student engagement is through the roof.", author: "Dr. Patel", role: "District Curriculum Director" },
  ];

  const bottomRowTestimonials = [
    { quote: "This is hands-down the best tool I've seen for teaching young investors.", author: "Connor Shepard", role: "Lead Advisor, Wealth Management" },
    { quote: "As a CFP, I've tried dozens of financial literacy platforms. Euphoria is the only one that actually gets students engaged.", author: "Sam Rodriguez", role: "CFP & Firm Owner" },
    { quote: "I went from not knowing what a stock was to confidently managing a simulated portfolio. Euphoria made it fun.", author: "Priya K.", role: "High School Senior" },
    { quote: "The streak system keeps me coming back every day. I've learned more here than any textbook.", author: "Marcus W.", role: "College Freshman" },
    { quote: "Our teachers love the dashboard. Real-time student progress without extra grading work.", author: "Lisa Chen", role: "School Administrator" },
  ];

  const navLinks = ["Features", "How It Works", "Pricing", "FAQ"];

  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const } },
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">

      {/* ═══════════════════════════════════════════════════════
          NAVBAR — transparent → sticky blur on scroll
          Mirrors Cluely: relative initially, fixed on scroll,
          transparent bg, minimal links, right-side CTA
      ═══════════════════════════════════════════════════════ */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? "bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 md:px-6 h-14 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <img src={logo} alt="Euphoria" className="w-7 h-7 object-contain" />
            <span className="font-heading text-base font-bold tracking-tight text-foreground">
              Euphoria
            </span>
          </div>

          {/* Desktop nav links — centered-ish */}
          <div className="hidden md:flex items-center gap-7">
            {navLinks.map((item) => (
              <button
                key={item}
                onClick={() => scrollTo(item.toLowerCase().replace(/\s+/g, "-"))}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium"
              >
                {item}
              </button>
            ))}
            <button
              onClick={() => navigate("/legal")}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium"
            >
              Legal
            </button>
          </div>

          {/* Right CTA */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/auth")}
              className="hidden sm:inline-flex text-muted-foreground hover:text-foreground font-medium"
            >
              Log in
            </Button>
            <Button
              size="sm"
              onClick={() => navigate("/auth?signup=true")}
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-5 font-medium text-sm"
            >
              Sign up free
            </Button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden ml-1 p-1.5 text-foreground"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-background/95 backdrop-blur-xl border-b border-border/50 overflow-hidden"
            >
              <div className="px-6 py-4 space-y-3">
                {navLinks.map((item) => (
                  <button
                    key={item}
                    onClick={() => scrollTo(item.toLowerCase().replace(/\s+/g, "-"))}
                    className="block w-full text-left text-base text-foreground font-medium py-2"
                  >
                    {item}
                  </button>
                ))}
                <button
                  onClick={() => { navigate("/legal"); setMobileMenuOpen(false); }}
                  className="block w-full text-left text-base text-foreground font-medium py-2"
                >
                  Legal
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ═══════════════════════════════════════════════════════
          HERO — Cluely-style: large serif H1 centered,
          scenic gradient bg, single CTA, product screenshot
      ═══════════════════════════════════════════════════════ */}
      <section className="relative pt-28 pb-4 md:pt-36 md:pb-8 overflow-hidden">
        {/* Atmospheric gradient background — like Cluely's landscape */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-[hsl(var(--primary)/0.06)] via-background to-background" />
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[radial-gradient(circle,hsl(var(--primary)/0.08),transparent_60%)] blur-3xl" />
          <div className="absolute top-20 right-1/4 w-[500px] h-[500px] bg-[radial-gradient(circle,hsl(var(--accent)/0.06),transparent_60%)] blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            {/* Uppercase label */}
            <motion.p
              className="text-[11px] font-medium text-primary uppercase tracking-[0.18em] mb-8"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Investing Simulator for Students
            </motion.p>

            {/* Large serif headline — mirrors Cluely's EB Garamond 80px hero */}
            <motion.h1
              className="font-display text-5xl sm:text-6xl md:text-[80px] font-medium leading-[1.05] tracking-[-0.01em] mb-7 text-foreground"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Master the Markets.{" "}
              <span className="text-primary">Learn&nbsp;with&nbsp;Euphoria.</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              className="text-base md:text-lg text-muted-foreground max-w-[540px] mx-auto mb-10 font-normal leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.25 }}
            >
              Interactive lessons, AI-powered simulations, and gamified challenges — without risking a single dollar.
            </motion.p>

            {/* Primary CTA — single button like Cluely */}
            <motion.div
              className="flex flex-col sm:flex-row gap-3 justify-center mb-8"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Button
                size="lg"
                onClick={() => navigate("/auth?signup=true")}
                className="px-8 py-3.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-medium text-base shadow-md hover:shadow-lg hover:shadow-primary/20 transition-all duration-200"
              >
                Start Learning Free <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => scrollTo("how-it-works")}
                className="px-8 py-3.5 bg-transparent border border-border hover:border-foreground/20 text-foreground rounded-xl font-medium text-base transition-all duration-200"
              >
                See How It Works
              </Button>
            </motion.div>

            {/* Social proof */}
            <motion.p
              className="text-[13px] text-muted-foreground font-normal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              10,000+ students · 4.9/5 rating · 100% risk-free
            </motion.p>
          </div>

          {/* Product screenshot with parallax */}
          <HeroImage />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          FEATURES — Cluely-style card grid
      ═══════════════════════════════════════════════════════ */}
      <FeatureShowcase />

      {/* ═══════════════════════════════════════════════════════
          PLATFORM PREVIEW — Bento Card
      ═══════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <p className="text-[11px] font-medium text-primary uppercase tracking-[0.18em] mb-4">
              Platform Preview
            </p>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-medium text-foreground">
              See it in action
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <BentoCard />
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          HOW IT WORKS — Horizontal timeline (Cluely-style steps)
      ═══════════════════════════════════════════════════════ */}
      <section id="how-it-works" className="py-24 md:py-32">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            className="text-center mb-20"
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <p className="text-[11px] font-medium text-primary uppercase tracking-[0.18em] mb-4">
              How It Works
            </p>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-medium text-foreground">
              Start in 4 steps
            </h2>
          </motion.div>

          {/* Desktop: horizontal cards with connecting line */}
          <motion.div
            className="hidden md:grid grid-cols-4 gap-6 relative"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Connector line behind the cards */}
            <div className="absolute top-14 left-[12%] right-[12%] h-px bg-border/60" />

            {steps.map((s, i) => (
              <motion.div
                key={i}
                className="relative text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                {/* Large ghosted number */}
                <p className="font-display text-7xl font-medium text-primary/10 leading-none mb-5 select-none">
                  {s.num}
                </p>
                {/* Dot on the connector line */}
                <div className="absolute top-[56px] left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-primary/40 ring-4 ring-background" />
                <h3 className="text-base font-medium text-foreground mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground font-normal leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Mobile: vertical with left border */}
          <motion.div
            className="md:hidden border-l-2 border-primary/20 ml-4 space-y-10"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {steps.map((s, i) => (
              <div key={i} className="relative pl-8">
                <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-primary/40 ring-4 ring-background" />
                <p className="font-display text-5xl font-medium text-primary/10 leading-none mb-2 select-none">
                  {s.num}
                </p>
                <h3 className="text-base font-medium text-foreground mb-1">{s.title}</h3>
                <p className="text-sm text-muted-foreground font-normal">{s.desc}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          TESTIMONIALS — Dual-row infinite scroll
      ═══════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <p className="text-[11px] font-medium text-primary uppercase tracking-[0.18em] mb-4">
              Testimonials
            </p>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-medium text-foreground">
              Loved by students &amp; professionals
            </h2>
          </motion.div>
        </div>

        <div className="space-y-5">
          <TestimonialRow testimonials={topRowTestimonials} direction="left" speed={38} />
          <TestimonialRow testimonials={bottomRowTestimonials} direction="right" speed={42} />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          PRICING
      ═══════════════════════════════════════════════════════ */}
      <PricingSection />

      {/* ═══════════════════════════════════════════════════════
          FAQ — Cluely-style minimal accordions
      ═══════════════════════════════════════════════════════ */}
      <section id="faq" className="py-24 md:py-32">
        <div className="max-w-[720px] mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <p className="text-[11px] font-medium text-primary uppercase tracking-[0.18em] mb-4">FAQ</p>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-medium text-foreground">
              Common questions
            </h2>
          </motion.div>

          <div className="space-y-0">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                className="border-b border-border/50"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left py-6 hover:bg-muted/30 transition-colors flex items-center justify-between gap-4 px-1"
                >
                  <h3 className="text-base font-medium text-foreground">{faq.q}</h3>
                  <ChevronDown
                    className={`w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform duration-300 ${
                      openFaq === i ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <p className="text-[15px] text-muted-foreground leading-relaxed pb-6 px-1 font-normal">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          FINAL CTA — centered with radial glow
      ═══════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_50%_50%,hsl(var(--primary)/0.06),transparent_70%)] pointer-events-none" />
        <div className="max-w-2xl mx-auto px-6 text-center relative z-10">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
            <h2 className="font-display text-3xl sm:text-4xl md:text-[3.2rem] font-medium text-foreground mb-5 leading-[1.1]">
              Ready to start investing?
            </h2>
            <p className="text-lg text-muted-foreground mb-10 font-normal">
              Join thousands of students learning through simulation.
            </p>
            <Button
              size="lg"
              onClick={() => navigate("/auth?signup=true")}
              className="px-10 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-medium text-base shadow-md hover:shadow-lg hover:shadow-primary/20 transition-all duration-200"
            >
              Create Free Account <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          FOOTER — Cluely-style multi-column with tinted bg
      ═══════════════════════════════════════════════════════ */}
      <footer className="bg-muted/50 border-t border-border/50 pt-12 pb-6">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid sm:grid-cols-4 gap-10 mb-10">
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <img src={logo} alt="Euphoria" className="w-6 h-6 object-contain" />
                <span className="text-sm font-medium text-foreground">Euphoria</span>
              </div>
              <p className="text-[13px] text-muted-foreground leading-relaxed font-normal">
                The gamified investing simulator for students and educators.
              </p>
            </div>
            <div>
              <h4 className="text-[13px] font-medium text-foreground mb-3">Product</h4>
              <ul className="space-y-2">
                {["Features", "Pricing", "FAQ"].map((l) => (
                  <li key={l}>
                    <button
                      onClick={() => scrollTo(l.toLowerCase())}
                      className="text-[13px] text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {l}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-[13px] font-medium text-foreground mb-3">For Educators</h4>
              <ul className="space-y-2">
                <li><button onClick={() => scrollTo("pricing")} className="text-[13px] text-muted-foreground hover:text-foreground transition-colors">Classroom Plans</button></li>
                <li><button onClick={() => scrollTo("how-it-works")} className="text-[13px] text-muted-foreground hover:text-foreground transition-colors">How It Works</button></li>
                <li><a href="/ferpa" className="text-[13px] text-muted-foreground hover:text-foreground transition-colors">FERPA Compliance</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[13px] font-medium text-foreground mb-3">Legal</h4>
              <ul className="space-y-2">
                <li><a href="/privacy" className="text-[13px] text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</a></li>
                <li><a href="/terms" className="text-[13px] text-muted-foreground hover:text-foreground transition-colors">Terms of Service</a></li>
                <li><a href="/ferpa" className="text-[13px] text-muted-foreground hover:text-foreground transition-colors">FERPA Compliance</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-border/50 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
            <p className="text-[13px] text-muted-foreground">© 2026 Euphoria. All rights reserved.</p>
            <p className="text-[13px] text-muted-foreground">Not financial advice. For educational purposes only.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
