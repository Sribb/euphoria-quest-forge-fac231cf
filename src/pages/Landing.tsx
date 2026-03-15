import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronDown, ArrowRight, Star } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { motion, useScroll, useTransform } from "framer-motion";
import { FeatureShowcase } from "@/features/landing/components/FeatureShowcase";
import { PricingSection } from "@/features/landing/components/PricingSection";
import logo from "@/assets/euphoria-logo-button.png";

const HeroImage = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [25, 0, -5]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.9, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0.4, 1]);
  const y = useTransform(scrollYProgress, [0, 0.5], [60, 0]);

  return (
    <div ref={ref} className="max-w-5xl mx-auto" style={{ perspective: "1200px" }}>
      <motion.div style={{ rotateX, scale, opacity, y }} className="relative">
        {/* Radial glow BEHIND the mockup */}
        <div className="absolute -inset-8 bg-[radial-gradient(ellipse_60%_40%_at_50%_100%,hsl(263_70%_50%/0.12),transparent_70%)] pointer-events-none" />

        <div className="relative rounded-xl border border-white/[0.07] bg-card shadow-[0_32px_64px_rgba(0,0,0,0.5)] overflow-hidden">
          {/* Browser chrome */}
          <div className="flex items-center gap-2 px-4 py-3 bg-muted/50 border-b border-white/[0.07]">
            <div className="flex gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[hsl(0_40%_45%)]" />
              <div className="w-2 h-2 rounded-full bg-[hsl(45_50%_45%)]" />
              <div className="w-2 h-2 rounded-full bg-[hsl(142_40%_40%)]" />
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

const Landing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (user) navigate("/app");
  }, [user, navigate]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

  const testimonials = [
    { quote: "My students went from 'finance is boring' to fighting over trading scores. Euphoria changed how I teach.", author: "Ms. Rodriguez", role: "AP Economics Teacher" },
    { quote: "I learned more in two weeks than a semester of finance class. The simulations make everything click.", author: "Jake T.", role: "College Sophomore" },
    { quote: "Finally, a platform where my kids learn about money without risking any. The games are brilliant.", author: "Sarah M.", role: "Parent of 2" },
    { quote: "This is hands-down the best tool I've seen for teaching young investors. I recommend Euphoria to every client with kids heading to college.", author: "Connor Shepard", role: "Lead Advisor, Wealth Management Firm" },
    { quote: "As a CFP, I've tried dozens of financial literacy platforms. Euphoria is the only one that actually gets students engaged and retaining what they learn.", author: "Sam Rodriguez", role: "CFP & Wealth Management Firm Owner" },
  ];

  const fadeUp = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const } } };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* ── Navbar ── */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? "bg-[hsl(240_12%_4%/0.8)] backdrop-blur-xl border-b border-white/[0.07]" : "bg-transparent"}`}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={logo} alt="Euphoria" className="w-7 h-7 object-contain" />
            <span className="font-heading text-base font-bold tracking-tight text-foreground">Euphoria</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {["Features", "How It Works", "Pricing", "FAQ"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(item.toLowerCase().replace(/\s+/g, "-"))?.scrollIntoView({ behavior: "smooth" });
                }}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium"
              >
                {item}
              </a>
            ))}
            <a
              href="/legal"
              onClick={(e) => { e.preventDefault(); navigate("/legal"); }}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium"
            >
              Legal
            </a>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate("/auth")} className="text-muted-foreground hover:text-foreground font-medium">
              Log in
            </Button>
            <Button
              size="sm"
              onClick={() => navigate("/auth?signup=true")}
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg px-5 font-medium"
            >
              Sign up free
            </Button>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative pt-32 pb-8 md:pt-40 md:pb-16 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20">
            {/* Uppercase label — no pill */}
            <motion.p
              className="text-[11px] font-medium text-primary uppercase tracking-[0.15em] mb-8"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Investing Simulator for Students
            </motion.p>

            {/* Static two-line headline */}
            <motion.h1
              className="font-heading text-5xl sm:text-6xl md:text-7xl font-bold leading-[1.1] tracking-tight mb-6"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <span className="block text-foreground">Master the Markets.</span>
              <span className="block text-primary">Learn with Euphoria.</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              className="text-lg text-muted-foreground max-w-[560px] mx-auto mb-10 font-normal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.25 }}
            >
              Interactive lessons, AI-powered simulations, and gamified challenges — without risking a single dollar.
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-3 justify-center mb-10"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Button
                size="lg"
                onClick={() => navigate("/auth?signup=true")}
                className="px-7 py-3.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium text-base hover:scale-[1.02] hover:shadow-[0_0_24px_hsl(263_70%_50%/0.4)] transition-all duration-200"
              >
                Start Learning Free <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}
                className="px-7 py-3.5 bg-transparent border border-white/[0.15] hover:border-white/[0.35] text-foreground rounded-lg font-medium text-base transition-all duration-200"
              >
                See How It Works
              </Button>
            </motion.div>

            {/* Social proof — text only with · separators */}
            <motion.p
              className="text-[13px] text-[hsl(240_4%_32%)] font-normal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              10,000+ students · 4.9/5 rating · 100% risk-free
            </motion.p>
          </div>

          <HeroImage />
        </div>
      </section>

      {/* ── Features ── */}
      <FeatureShowcase />

      {/* ── How It Works — Horizontal Timeline ── */}
      <section id="how-it-works" className="py-20 md:py-28">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div className="mb-16" variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
            <p className="text-[11px] font-medium text-primary uppercase tracking-[0.15em] mb-4">How It Works</p>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground">Start in 4 steps</h2>
          </motion.div>

          {/* Desktop: horizontal timeline */}
          <motion.div
            className="hidden md:grid grid-cols-4 gap-0 relative"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Connector line */}
            <div className="absolute top-10 left-[12.5%] right-[12.5%] h-px bg-white/[0.08]" />

            {steps.map((s, i) => (
              <div key={i} className="relative px-4 text-center">
                {/* Ghosted number */}
                <p className="font-heading text-7xl font-bold text-[hsl(263_70%_50%/0.15)] leading-none mb-4 select-none">
                  {s.num}
                </p>
                <h3 className="text-base font-medium text-foreground mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground font-normal">{s.desc}</p>
              </div>
            ))}
          </motion.div>

          {/* Mobile: vertical with left border */}
          <motion.div
            className="md:hidden border-l border-[hsl(263_70%_50%/0.2)] ml-4 space-y-10"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {steps.map((s, i) => (
              <div key={i} className="relative pl-8">
                <p className="font-heading text-5xl font-bold text-[hsl(263_70%_50%/0.15)] leading-none mb-2 select-none">
                  {s.num}
                </p>
                <h3 className="text-base font-medium text-foreground mb-1">{s.title}</h3>
                <p className="text-sm text-muted-foreground font-normal">{s.desc}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Testimonials — Static masonry grid ── */}
      <section className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div className="mb-16" variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
            <p className="text-[11px] font-medium text-primary uppercase tracking-[0.15em] mb-4">Testimonials</p>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground">Loved by students & professionals</h2>
          </motion.div>

          {/* Masonry-ish columns */}
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                className="break-inside-avoid bg-card border border-white/[0.07] rounded-xl p-6"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
              >
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-3.5 h-3.5 text-[hsl(45_93%_47%)] fill-[hsl(45_93%_47%)]" />
                  ))}
                </div>
                <p className="text-[15px] text-[hsl(240_5%_83%)] leading-[1.7] mb-5 font-normal">"{t.quote}"</p>
                <div>
                  <p className="text-sm font-medium text-foreground">{t.author}</p>
                  <p className="text-[13px] text-muted-foreground">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <PricingSection />

      {/* ── FAQ ── */}
      <section id="faq" className="py-20 md:py-28">
        <div className="max-w-[680px] mx-auto px-6">
          <motion.div className="mb-14" variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
            <p className="text-[11px] font-medium text-primary uppercase tracking-[0.15em] mb-4">FAQ</p>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground">Common questions</h2>
          </motion.div>

          <div className="space-y-0">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                className="border-b border-white/[0.08]"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left py-5 hover:bg-white/[0.02] transition-colors flex items-center justify-between gap-4"
                >
                  <h3 className="text-base font-medium text-foreground">{faq.q}</h3>
                  <ChevronDown className={`w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform duration-200 ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                {openFaq === i && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="text-[15px] text-muted-foreground leading-relaxed pb-5 font-normal"
                  >
                    {faq.a}
                  </motion.p>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-20 md:py-28 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_50%_50%,hsl(263_70%_50%/0.08),transparent_70%)] pointer-events-none" />
        <div className="max-w-2xl mx-auto px-6 text-center relative z-10">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
            <h2 className="font-heading text-4xl md:text-[3.5rem] font-bold text-foreground mb-5 leading-[1.1]">Ready to start investing?</h2>
            <p className="text-lg text-muted-foreground mb-10 font-normal">Join thousands of students learning through simulation.</p>
            <Button
              size="lg"
              onClick={() => navigate("/auth?signup=true")}
              className="px-10 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium text-base hover:scale-[1.02] hover:shadow-[0_0_24px_hsl(263_70%_50%/0.4)] transition-all duration-200"
            >
              Create Free Account <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/[0.07] py-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid sm:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <img src={logo} alt="Euphoria" className="w-6 h-6 object-contain" />
                <span className="text-sm font-medium text-foreground">Euphoria</span>
              </div>
              <p className="text-[13px] text-[hsl(240_4%_32%)] leading-relaxed font-normal">The gamified investing simulator for students and educators.</p>
            </div>
            <div>
              <h4 className="text-[13px] font-medium text-[hsl(240_4%_32%)] mb-2">Product</h4>
              <ul className="space-y-1.5">
                {["Features", "Pricing", "FAQ"].map((l) => (
                  <li key={l}><a href={`#${l.toLowerCase()}`} className="text-[13px] text-[hsl(240_4%_32%)] hover:text-foreground transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-[13px] font-medium text-[hsl(240_4%_32%)] mb-2">For Educators</h4>
              <ul className="space-y-1.5">
                <li><a href="#pricing" className="text-[13px] text-[hsl(240_4%_32%)] hover:text-foreground transition-colors">Classroom Plans</a></li>
                <li><a href="#how-it-works" className="text-[13px] text-[hsl(240_4%_32%)] hover:text-foreground transition-colors">How It Works</a></li>
                <li><a href="/ferpa" className="text-[13px] text-[hsl(240_4%_32%)] hover:text-foreground transition-colors">FERPA Compliance</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[13px] font-medium text-[hsl(240_4%_32%)] mb-2">Legal</h4>
              <ul className="space-y-1.5">
                <li><a href="/privacy" className="text-[13px] text-[hsl(240_4%_32%)] hover:text-foreground transition-colors">Privacy Policy</a></li>
                <li><a href="/terms" className="text-[13px] text-[hsl(240_4%_32%)] hover:text-foreground transition-colors">Terms of Service</a></li>
                <li><a href="/ferpa" className="text-[13px] text-[hsl(240_4%_32%)] hover:text-foreground transition-colors">FERPA Compliance</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/[0.07] pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
            <p className="text-[13px] text-[hsl(240_4%_32%)]">© 2026 Euphoria. All rights reserved.</p>
            <p className="text-[13px] text-[hsl(240_4%_32%)]">Not financial advice. For educational purposes only.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
