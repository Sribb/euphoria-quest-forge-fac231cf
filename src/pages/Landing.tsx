import { useEffect, useState, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  TrendingUp, Brain, Sparkles, Users, 
  BookOpen, Gamepad2, Award, ChevronDown,
  GraduationCap, Shield, Star, Check, ArrowRight,
  Trophy, Target
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { motion, useScroll, useTransform } from "framer-motion";
import { FeatureShowcase } from "@/features/landing/components/FeatureShowcase";
import logo from "@/assets/euphoria-logo-button.png";
const TYPEWRITER_LINES = [
  { text: "Master the Markets.", gradient: false },
  { text: "Learn with Euphoria.", gradient: true },
];

const TypewriterHeadline = () => {
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (done) return;
    const line = TYPEWRITER_LINES[lineIndex];
    if (charIndex < line.text.length) {
      const t = setTimeout(() => setCharIndex((c) => c + 1), 45);
      return () => clearTimeout(t);
    }
    // line finished
    if (lineIndex < TYPEWRITER_LINES.length - 1) {
      const t = setTimeout(() => {
        setLineIndex((l) => l + 1);
        setCharIndex(0);
      }, 350);
      return () => clearTimeout(t);
    }
    setDone(true);
  }, [charIndex, lineIndex, done]);

  return (
    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.1] tracking-tight mb-6">
      {TYPEWRITER_LINES.map((line, i) => {
        const visible =
          i < lineIndex
            ? line.text
            : i === lineIndex
            ? line.text.slice(0, charIndex)
            : "";
        const showCursor = !done && i === lineIndex;
        return (
          <span key={i} className="block">
            {line.gradient ? (
              <span className="bg-gradient-to-r from-primary via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                {visible}
              </span>
            ) : (
              visible
            )}
            {showCursor && (
              <span className="inline-block w-[3px] h-[1em] bg-primary ml-1 animate-pulse align-middle" />
            )}
          </span>
        );
      })}
    </h1>
  );
};

const HeroImage = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [25, 0, -5]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.9, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0.4, 1]);
  const y = useTransform(scrollYProgress, [0, 0.5], [60, 0]);

  return (
    <div ref={ref} className="max-w-5xl mx-auto" style={{ perspective: "1200px" }}>
      <motion.div
        style={{ rotateX, scale, opacity, y }}
        className="relative"
      >
        {/* Glow behind */}
        <div className="absolute -inset-4 bg-[radial-gradient(ellipse_at_center,hsl(262_83%_58%/0.15),transparent_70%)] rounded-3xl blur-2xl" />
        
        <div className="relative rounded-xl border border-border/50 bg-card/80 shadow-2xl overflow-hidden">
          {/* Browser chrome */}
          <div className="flex items-center gap-2 px-4 py-3 bg-muted/50 border-b border-border/30">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[hsl(0_60%_50%)]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[hsl(45_70%_55%)]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[hsl(142_60%_45%)]" />
            </div>
            <div className="flex-1 flex justify-center">
              <div className="bg-background/60 rounded-md px-4 py-1 text-[11px] text-muted-foreground font-mono">
                app.euphoria.finance
              </div>
            </div>
          </div>
          
          {/* Dashboard demo video */}
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

        {/* Caption below screenshot */}
        <p className="text-center text-sm md:text-base text-muted-foreground mt-6 font-bold tracking-wide">
          The easiest way to learn how to invest.
        </p>
      </motion.div>
    </div>
  );
};

const Landing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    if (user) navigate("/app");
  }, [user, navigate]);

  const features = [
    { icon: BookOpen, title: "25+ Interactive Lessons", description: "Hands-on simulations where you learn by making real decisions.", color: "text-primary", bg: "bg-primary/10" },
    { icon: TrendingUp, title: "AI Market Simulation", description: "Trade with AI-driven events, news, and dynamic pricing.", color: "text-success", bg: "bg-success/10" },
    { icon: Gamepad2, title: "Investment Games", description: "Master investing through play, competition, and strategy.", color: "text-warning", bg: "bg-warning/10" },
    { icon: Brain, title: "AI Coach", description: "Personalized feedback on every trade and decision.", color: "text-accent", bg: "bg-accent/10" },
    { icon: GraduationCap, title: "Educator Tools", description: "Create classes, track progress, and manage learning at scale.", color: "text-primary", bg: "bg-primary/10" },
    { icon: Award, title: "XP & Levels", description: "Earn XP, unlock badges, and compete on leaderboards.", color: "text-success", bg: "bg-success/10" },
  ];

  const steps = [
    { num: "01", title: "Take the Placement Quiz", desc: "20 scenario-based questions find your level instantly.", icon: Target },
    { num: "02", title: "Learn by Doing", desc: "Every lesson is a simulation. Make choices, see real results.", icon: Sparkles },
    { num: "03", title: "Trade & Compete", desc: "Paper-trade with AI events. Test strategies risk-free.", icon: TrendingUp },
    { num: "04", title: "Level Up", desc: "Earn XP, maintain streaks, grow your skills.", icon: Trophy },
  ];

  const pricing = [
    { name: "Student", price: "Free", period: "", desc: "Everything you need to learn investing", features: ["25+ interactive lessons", "5 investment games", "AI market simulation", "Portfolio tracking", "XP & achievements", "Community access"], cta: "Get Started Free", highlighted: false },
    { name: "Educator", price: "$12", period: "/mo", desc: "Manage classes and track progress", features: ["Everything in Student", "Unlimited classes", "Student analytics", "Progress tracking", "Struggling student alerts", "Class leaderboards", "Export reports"], cta: "Start Free Trial", highlighted: true },
    { name: "School", price: "Custom", period: "", desc: "For schools and districts", features: ["Everything in Educator", "Unlimited educators", "Admin dashboard", "SSO integration", "Priority support", "Custom curriculum"], cta: "Contact Sales", highlighted: false },
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
  const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-xl bg-background/80 border-b border-border/40">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img src={logo} alt="Euphoria" className="w-8 h-8 object-contain" />
            <span className="text-lg font-bold tracking-tight">Euphoria</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {["Features", "How It Works", "Pricing", "FAQ"].map((item) => (
              <a key={item} href={`#${item.toLowerCase().replace(/\s+/g, "-")}`} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                {item}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate("/auth")}>Log in</Button>
            <Button
              size="sm"
              onClick={() => navigate("/auth?signup=true")}
              className="bg-gradient-primary shadow-glow-soft hover:shadow-glow hover:-translate-y-0.5 transition-all duration-200 font-semibold"
            >
              Sign up free
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-8 md:pt-40 md:pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(262_83%_58%/0.08),transparent_60%)]" />
        
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="inline-flex items-center gap-2 bg-primary/8 border border-primary/15 rounded-full px-4 py-1.5 mb-6">
                <span className="text-xs font-medium text-primary">The #1 investing simulator for students</span>
              </div>
            </motion.div>

            <TypewriterHeadline />

            <motion.p 
              className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.25 }}
            >
              Interactive lessons, AI-powered simulations, and gamified challenges — without risking a single dollar.
            </motion.p>

            <motion.div 
              className="flex flex-col sm:flex-row gap-3 justify-center"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Button size="lg" onClick={() => navigate("/auth?signup=true")} className="px-8 bg-gradient-primary shadow-glow-soft hover:shadow-glow hover:-translate-y-0.5 transition-all duration-200 font-semibold text-base">
                Start Learning Free <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}>
                See How It Works
              </Button>
            </motion.div>

            <motion.div 
              className="mt-10 flex flex-wrap items-center justify-center gap-6 text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4" />
                <span className="text-xs font-medium">10,000+ students</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 text-warning fill-warning" />
                <span className="text-xs font-medium">4.9/5 rating</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Shield className="w-4 h-4" />
                <span className="text-xs font-medium">100% risk-free</span>
              </div>
            </motion.div>
          </div>

          {/* Dashboard Preview with 3D Perspective Scroll */}
          <HeroImage />
        </div>
      </section>

      {/* Features */}
      <FeatureShowcase />

      {/* How It Works */}
      <section id="how-it-works" className="py-20 md:py-28 bg-muted/20">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div className="text-center mb-14" variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
            <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">How It Works</p>
            <h2 className="text-3xl md:text-4xl font-bold">Start in 4 steps</h2>
          </motion.div>

          <motion.div className="grid sm:grid-cols-2 gap-5" variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}>
            {steps.map((s, i) => (
              <motion.div key={i} variants={fadeUp}>
                <Card className="p-5 h-full border-border/40 bg-card/50 hover:border-primary/25 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center flex-shrink-0">
                      <s.icon className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Step {s.num}</span>
                      <h3 className="text-sm font-semibold mt-0.5 mb-1">{s.title}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-20 md:py-28 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div className="text-center mb-14" variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
            <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">Testimonials</p>
            <h2 className="text-3xl md:text-4xl font-bold">Loved by students & professionals</h2>
          </motion.div>
        </div>

        {/* Infinite scrolling marquee */}
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
          
          <div className="flex gap-5 animate-[marquee_35s_linear_infinite] hover:[animation-play-state:paused] w-max">
            {[...testimonials, ...testimonials].map((t, i) => (
              <Card key={i} className="p-5 border-border/40 bg-card/50 w-[340px] flex-shrink-0">
                <div className="flex gap-0.5 mb-3">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-3.5 h-3.5 text-warning fill-warning" />
                  ))}
                </div>
                <p className="text-sm text-foreground leading-relaxed mb-4">"{t.quote}"</p>
                <div className="border-t border-border/30 pt-3">
                  <p className="text-xs font-semibold">{t.author}</p>
                  <p className="text-[11px] text-muted-foreground">{t.role}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 md:py-28 bg-muted/20">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div className="text-center mb-14" variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
            <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">Pricing</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">Simple, transparent pricing</h2>
            <p className="text-muted-foreground">Free for students. Affordable for educators.</p>
          </motion.div>

          <motion.div className="grid md:grid-cols-3 gap-5 items-start" variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}>
            {pricing.map((plan, i) => (
              <motion.div key={i} variants={fadeUp}>
                <Card className={`p-6 h-full transition-all ${
                  plan.highlighted 
                    ? "border-2 border-primary shadow-glow-soft bg-card relative" 
                    : "border border-border/40 bg-card/50 hover:border-primary/25"
                }`}>
                  {plan.highlighted && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-primary text-primary-foreground text-[10px] font-bold px-3 py-0.5 rounded-full">
                      Most Popular
                    </div>
                  )}
                  <h3 className="text-lg font-bold">{plan.name}</h3>
                  <p className="text-xs text-muted-foreground mb-3">{plan.desc}</p>
                  <div className="flex items-baseline gap-0.5 mb-5">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    {plan.period && <span className="text-sm text-muted-foreground">{plan.period}</span>}
                  </div>
                  <Button 
                    className={`w-full mb-5 ${plan.highlighted ? "bg-gradient-primary" : ""}`}
                    variant={plan.highlighted ? "default" : "outline"}
                    size="sm"
                    onClick={() => navigate("/auth")}
                  >
                    {plan.cta}
                  </Button>
                  <ul className="space-y-2">
                    {plan.features.map((f, j) => (
                      <li key={j} className="flex items-start gap-2 text-xs">
                        <Check className="w-3.5 h-3.5 text-success flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{f}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 md:py-28">
        <div className="max-w-2xl mx-auto px-6">
          <motion.div className="text-center mb-14" variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
            <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">FAQ</p>
            <h2 className="text-3xl md:text-4xl font-bold">Common questions</h2>
          </motion.div>

          <motion.div className="space-y-2" variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}>
            {faqs.map((faq, i) => (
              <motion.div key={i} variants={fadeUp}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left p-4 rounded-lg border border-border/40 bg-card/50 hover:border-primary/25 transition-colors"
                >
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="text-sm font-medium">{faq.q}</h3>
                    <ChevronDown className={`w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform duration-200 ${openFaq === i ? "rotate-180" : ""}`} />
                  </div>
                  {openFaq === i && (
                    <motion.p 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="text-xs text-muted-foreground leading-relaxed mt-3 pt-3 border-t border-border/20"
                    >
                      {faq.a}
                    </motion.p>
                  )}
                </button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(262_83%_58%/0.06),transparent_60%)]" />
        <div className="max-w-2xl mx-auto px-6 text-center relative z-10">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to start investing?</h2>
            <p className="text-muted-foreground mb-8">Join thousands of students learning through simulation.</p>
            <Button size="lg" onClick={() => navigate("/auth?signup=true")} className="px-10 bg-gradient-primary shadow-glow-soft hover:shadow-glow hover:-translate-y-0.5 transition-all duration-200 font-semibold">
              Create Free Account <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/30 py-10 bg-muted/10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid sm:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <img src={logo} alt="Euphoria" className="w-7 h-7 object-contain" />
                <span className="text-sm font-bold">Euphoria</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">The gamified investing simulator for students and educators.</p>
            </div>
            <div>
              <h4 className="text-xs font-semibold mb-2">Product</h4>
              <ul className="space-y-1.5">
                {["Features", "Pricing", "FAQ"].map((l) => (
                  <li key={l}><a href={`#${l.toLowerCase()}`} className="text-xs text-muted-foreground hover:text-foreground transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold mb-2">For Educators</h4>
              <ul className="space-y-1.5">
                <li><a href="#pricing" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Classroom Plans</a></li>
                <li><a href="#how-it-works" className="text-xs text-muted-foreground hover:text-foreground transition-colors">How It Works</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold mb-2">Legal</h4>
              <ul className="space-y-1.5">
                <li><a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border/30 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
            <p className="text-[11px] text-muted-foreground">© 2026 Euphoria. All rights reserved.</p>
            <p className="text-[11px] text-muted-foreground">Not financial advice. For educational purposes only.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
