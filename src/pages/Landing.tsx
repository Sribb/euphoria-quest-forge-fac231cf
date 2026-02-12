import { useEffect, useState } from "react";
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
import { motion } from "framer-motion";
import logo from "@/assets/euphoria-logo-button.png";
import dashboardPreview from "@/assets/dashboard-preview.png";

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
            <Button size="sm" onClick={() => navigate("/auth")} className="bg-gradient-primary">
              Sign up free
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(262_83%_58%/0.08),transparent_60%)]" />
        
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="inline-flex items-center gap-2 bg-primary/8 border border-primary/15 rounded-full px-4 py-1.5 mb-6">
                <span className="text-xs font-medium text-primary">The #1 investing simulator for students</span>
              </div>
            </motion.div>

            <motion.h1 
              className="text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.1] tracking-tight mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Learn investing by
              <br />
              <span className="bg-gradient-primary bg-clip-text text-transparent">actually investing.</span>
            </motion.h1>

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
              <Button size="lg" onClick={() => navigate("/auth")} className="px-8 bg-gradient-primary shadow-glow-soft hover:shadow-glow transition-shadow">
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

          {/* Dashboard Preview in Browser Frame */}
          <motion.div 
            className="max-w-5xl mx-auto"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <div className="rounded-xl border border-border/60 bg-card/80 shadow-2xl overflow-hidden">
              {/* Browser chrome */}
              <div className="flex items-center gap-2 px-4 py-3 bg-muted/60 border-b border-border/40">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-destructive/60" />
                  <div className="w-3 h-3 rounded-full bg-warning/60" />
                  <div className="w-3 h-3 rounded-full bg-success/60" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="bg-background/80 rounded-md px-4 py-1 text-xs text-muted-foreground font-mono w-64 text-center truncate">
                    app.euphoria.finance/dashboard
                  </div>
                </div>
              </div>
              {/* Screenshot */}
              <img 
                src={dashboardPreview} 
                alt="Euphoria Dashboard — portfolio charts, lesson progress, and trading simulation" 
                className="w-full h-auto block"
                loading="lazy"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div className="text-center mb-14" variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
            <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">Features</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Everything you need to master investing</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">From interactive lessons to AI-powered trading — gamified for maximum retention.</p>
          </motion.div>

          <motion.div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5" variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}>
            {features.map((f, i) => (
              <motion.div key={i} variants={fadeUp}>
                <Card className="p-5 h-full border-border/40 bg-card/50 hover:border-primary/25 transition-colors group">
                  <div className={`w-10 h-10 rounded-lg ${f.bg} flex items-center justify-center mb-3 group-hover:scale-105 transition-transform`}>
                    <f.icon className={`w-5 h-5 ${f.color}`} />
                  </div>
                  <h3 className="text-sm font-semibold mb-1">{f.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{f.description}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

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

      {/* Testimonials */}
      <section className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div className="text-center mb-14" variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
            <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">Testimonials</p>
            <h2 className="text-3xl md:text-4xl font-bold">Loved by students & educators</h2>
          </motion.div>

          <motion.div className="grid md:grid-cols-3 gap-5" variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}>
            {testimonials.map((t, i) => (
              <motion.div key={i} variants={fadeUp}>
                <Card className="p-5 h-full border-border/40 bg-card/50">
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
              </motion.div>
            ))}
          </motion.div>
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
            <Button size="lg" onClick={() => navigate("/auth")} className="px-10 bg-gradient-primary shadow-glow-soft hover:shadow-glow transition-shadow">
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
