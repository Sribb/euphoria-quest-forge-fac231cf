import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  TrendingUp, Target, Brain, Zap, Sparkles, Users, 
  BookOpen, Gamepad2, Award, ChevronDown, ChevronRight,
  GraduationCap, BarChart3, Shield, Star, Check, ArrowRight,
  Play, Rocket, Trophy
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { motion, useScroll, useTransform } from "framer-motion";
import logo from "@/assets/euphoria-logo-button.png";

const Landing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.95]);

  useEffect(() => {
    if (user) navigate("/app");
  }, [user, navigate]);

  const features = [
    {
      icon: BookOpen,
      title: "25+ Interactive Lessons",
      description: "Story-driven simulations where you learn by making real decisions — not reading textbooks.",
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      icon: TrendingUp,
      title: "AI-Powered Market Sim",
      description: "Trade in a realistic environment with AI-driven market events, news, and dynamic pricing.",
      color: "text-success",
      bg: "bg-success/10",
    },
    {
      icon: Gamepad2,
      title: "5 Investment Games",
      description: "From Trend Master to Life Sim — master investing through play, competition, and strategy.",
      color: "text-warning",
      bg: "bg-warning/10",
    },
    {
      icon: Brain,
      title: "AI Investment Coach",
      description: "Get personalized feedback on every trade, lesson, and decision from your AI mentor.",
      color: "text-accent",
      bg: "bg-accent/10",
    },
    {
      icon: GraduationCap,
      title: "Educator Dashboard",
      description: "Teachers can create classes, track student progress, and manage learning at scale.",
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      icon: Award,
      title: "XP, Levels & Streaks",
      description: "Earn XP for every lesson, game, and trade. Level up, unlock badges, and compete on leaderboards.",
      color: "text-success",
      bg: "bg-success/10",
    },
  ];

  const howItWorks = [
    { step: "01", title: "Take the Placement Quiz", description: "Answer 20 scenario-based questions to find your starting level — no boring beginner content if you already know the basics.", icon: Target },
    { step: "02", title: "Learn by Doing", description: "Each lesson is a hands-on simulation. Adjust sliders, make choices, and see real-time results — not multiple choice questions.", icon: Sparkles },
    { step: "03", title: "Trade & Compete", description: "Paper-trade with AI-generated market events. Test strategies, compete with AI traders, and build your portfolio.", icon: TrendingUp },
    { step: "04", title: "Level Up", description: "Earn XP, unlock achievements, maintain streaks, and watch your investing skills grow lesson by lesson.", icon: Trophy },
  ];

  const pricing = [
    {
      name: "Student",
      price: "Free",
      period: "",
      description: "Everything you need to learn investing",
      features: ["25+ interactive lessons", "5 investment games", "AI market simulation", "Portfolio tracking", "XP & achievement system", "Community access"],
      cta: "Get Started Free",
      highlighted: false,
    },
    {
      name: "Educator",
      price: "$12",
      period: "/month",
      description: "Manage classes and track student progress",
      features: ["Everything in Student", "Create unlimited classes", "Student analytics dashboard", "Progress tracking per student", "Struggling student alerts", "Class leaderboards", "Export reports"],
      cta: "Start Free Trial",
      highlighted: true,
    },
    {
      name: "School",
      price: "Custom",
      period: "",
      description: "For schools and districts",
      features: ["Everything in Educator", "Unlimited educators", "Admin dashboard", "SSO integration", "Priority support", "Custom curriculum", "Dedicated account manager"],
      cta: "Contact Sales",
      highlighted: false,
    },
  ];

  const faqs = [
    { q: "Is Euphoria actually free for students?", a: "Yes! Students get full access to all 25+ lessons, 5 games, the AI market simulator, and portfolio tracking — completely free. No credit card required." },
    { q: "How is this different from other financial literacy apps?", a: "Euphoria teaches through hands-on simulation, not textbooks. Every lesson is a scenario where you make real decisions and see consequences. It's like Duolingo meets Robinhood — gamified, addictive, and deeply educational." },
    { q: "Can I use this in my classroom?", a: "Absolutely. Our Educator plan lets you create classes with unique join codes, track individual student progress, identify struggling learners, and export analytics — all from a dedicated dashboard." },
    { q: "Is the trading simulation realistic?", a: "Our AI market engine generates realistic price movements, news events, and market scenarios. You'll experience bull runs, crashes, sector rotations, and breaking news — all without risking real money." },
    { q: "What age group is this for?", a: "Euphoria is designed for high school students (14+) through adult learners. The placement quiz adapts the starting level to each user's existing knowledge." },
  ];

  const testimonials = [
    { quote: "My students went from 'finance is boring' to fighting over who gets the highest trading score. Euphoria changed how I teach economics.", author: "Ms. Rodriguez", role: "AP Economics Teacher", rating: 5 },
    { quote: "I learned more about investing in two weeks on Euphoria than I did in a semester of finance class. The simulations make everything click.", author: "Jake T.", role: "College Sophomore", rating: 5 },
    { quote: "Finally, a platform where my kids can learn about money without me worrying they'll lose any. The games are brilliant.", author: "Sarah M.", role: "Parent of 2", rating: 5 },
  ];

  const fadeUp = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.6 } } };
  const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-navigation backdrop-blur-xl bg-background/80 border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Euphoria" className="w-9 h-9 object-contain" />
            <span className="text-xl font-bold tracking-tight">Euphoria</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">How It Works</a>
            <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
            <a href="#faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">FAQ</a>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate("/auth")}>Sign In</Button>
            <Button size="sm" onClick={() => navigate("/auth")} className="bg-gradient-primary shadow-glow-soft">
              Get Started <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <motion.section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden" style={{ opacity: heroOpacity, scale: heroScale }}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(262_83%_58%/0.12),transparent_70%)]" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-success/5 rounded-full blur-3xl" />

        <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-8">
              <Rocket className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">The #1 investing simulator for students</span>
            </div>
          </motion.div>

          <motion.h1 
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[1.05] tracking-tight mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            Learn investing
            <br />
            <span className="bg-gradient-primary bg-clip-text text-transparent">by actually investing.</span>
          </motion.h1>

          <motion.p 
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Interactive lessons, AI-powered market simulations, and gamified challenges that teach you to invest — without risking a single dollar.
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Button 
              size="lg" 
              onClick={() => navigate("/auth")} 
              className="text-base px-8 py-6 bg-gradient-primary shadow-glow hover:shadow-[0_0_40px_hsl(262_83%_58%/0.5)] transition-all"
            >
              Start Learning Free <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}
              className="text-base px-8 py-6"
            >
              <Play className="w-5 h-5 mr-2" /> See How It Works
            </Button>
          </motion.div>

          {/* Social proof strip */}
          <motion.div 
            className="mt-16 flex flex-wrap items-center justify-center gap-8 text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              <span className="text-sm font-medium">10,000+ students</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-warning" />
              <span className="text-sm font-medium">4.9/5 rating</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              <span className="text-sm font-medium">100% risk-free</span>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Features */}
      <section id="features" className="py-24 md:py-32 relative">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            className="text-center mb-16"
            variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
          >
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">Features</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-3 mb-4">Everything you need to master investing</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">From interactive lessons to AI-powered trading, Euphoria gives you the full investing experience — gamified.</p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}
          >
            {features.map((feature, i) => (
              <motion.div key={i} variants={fadeUp}>
                <Card className="p-6 h-full border-border/50 bg-card/60 backdrop-blur-sm hover:border-primary/30 hover:shadow-md transition-all duration-300 group">
                  <div className={`w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <feature.icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 md:py-32 bg-muted/30 relative">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div 
            className="text-center mb-16"
            variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
          >
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">How It Works</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-3 mb-4">Start investing in 4 steps</h2>
          </motion.div>

          <motion.div 
            className="space-y-8"
            variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}
          >
            {howItWorks.map((item, i) => (
              <motion.div key={i} variants={fadeUp} className="flex gap-6 items-start group">
                <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow-soft group-hover:scale-110 transition-transform">
                  <item.icon className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1 pt-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">Step {item.step}</span>
                    <h3 className="text-xl font-bold">{item.title}</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 md:py-32 relative">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            className="text-center mb-16"
            variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
          >
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">Testimonials</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-3 mb-4">Loved by students & educators</h2>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-3 gap-6"
            variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}
          >
            {testimonials.map((t, i) => (
              <motion.div key={i} variants={fadeUp}>
                <Card className="p-6 h-full border-border/50 bg-card/60 backdrop-blur-sm">
                  <div className="flex gap-1 mb-4">
                    {[...Array(t.rating)].map((_, j) => (
                      <Star key={j} className="w-4 h-4 text-warning fill-warning" />
                    ))}
                  </div>
                  <p className="text-foreground leading-relaxed mb-6">"{t.quote}"</p>
                  <div className="border-t border-border/50 pt-4">
                    <p className="font-semibold text-sm">{t.author}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 md:py-32 bg-muted/30 relative">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div 
            className="text-center mb-16"
            variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
          >
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">Pricing</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-3 mb-4">Simple, transparent pricing</h2>
            <p className="text-lg text-muted-foreground">Free for students. Affordable for educators.</p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-3 gap-6 items-start"
            variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}
          >
            {pricing.map((plan, i) => (
              <motion.div key={i} variants={fadeUp}>
                <Card className={`p-8 h-full border-2 transition-all duration-300 ${
                  plan.highlighted 
                    ? "border-primary shadow-glow bg-card relative" 
                    : "border-border/50 bg-card/60 hover:border-primary/30"
                }`}>
                  {plan.highlighted && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-primary text-white text-xs font-bold px-4 py-1 rounded-full shadow-glow-soft">
                      Most Popular
                    </div>
                  )}
                  <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.period && <span className="text-muted-foreground">{plan.period}</span>}
                  </div>
                  <Button 
                    className={`w-full mb-6 ${plan.highlighted ? "bg-gradient-primary shadow-glow-soft" : ""}`}
                    variant={plan.highlighted ? "default" : "outline"}
                    onClick={() => navigate("/auth")}
                  >
                    {plan.cta}
                  </Button>
                  <ul className="space-y-3">
                    {plan.features.map((feature, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{feature}</span>
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
      <section id="faq" className="py-24 md:py-32 relative">
        <div className="max-w-3xl mx-auto px-6">
          <motion.div 
            className="text-center mb-16"
            variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
          >
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">FAQ</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-3 mb-4">Got questions?</h2>
          </motion.div>

          <motion.div 
            className="space-y-3"
            variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}
          >
            {faqs.map((faq, i) => (
              <motion.div key={i} variants={fadeUp}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left p-5 rounded-xl border border-border/50 bg-card/60 hover:border-primary/30 transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-foreground pr-4">{faq.q}</h3>
                    <ChevronDown className={`w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform duration-300 ${openFaq === i ? "rotate-180" : ""}`} />
                  </div>
                  {openFaq === i && (
                    <motion.p 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="text-sm text-muted-foreground leading-relaxed mt-3 pt-3 border-t border-border/30"
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

      {/* Final CTA */}
      <section className="py-24 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(262_83%_58%/0.1),transparent_70%)]" />
        <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to start your investing journey?</h2>
            <p className="text-lg text-muted-foreground mb-8">Join thousands of students learning to invest through simulation, not speculation.</p>
            <Button 
              size="lg" 
              onClick={() => navigate("/auth")} 
              className="text-base px-10 py-6 bg-gradient-primary shadow-glow hover:shadow-[0_0_40px_hsl(262_83%_58%/0.5)] transition-all"
            >
              Create Your Free Account <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12 bg-muted/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img src={logo} alt="Euphoria" className="w-8 h-8 object-contain" />
                <span className="text-lg font-bold">Euphoria</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The gamified investing simulator for students and educators.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-sm">Product</h4>
              <ul className="space-y-2">
                <li><a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</a></li>
                <li><a href="#faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-sm">For Educators</h4>
              <ul className="space-y-2">
                <li><a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Classroom Plans</a></li>
                <li><a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">How It Works</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-sm">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border/50 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">© 2026 Euphoria. All rights reserved.</p>
            <p className="text-xs text-muted-foreground">Not financial advice. For educational purposes only.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
