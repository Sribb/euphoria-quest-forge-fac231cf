import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Check,
  X,
  ArrowRight,
  Zap,
  Crown,
  Building2,
  Sparkles,
  Clock,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };

interface PricingTier {
  name: string;
  icon: React.ElementType;
  price: string;
  annualPrice?: string;
  period: string;
  originalPrice?: string;
  tagline: string;
  description: string;
  features: { text: string; highlight?: boolean }[];
  cta: string;
  ctaVariant: "default" | "outline" | "ghost";
  highlighted: boolean;
  badge?: string;
  trialNote?: string;
}

const tiers: PricingTier[] = [
  {
    name: "Basic",
    icon: Sparkles,
    price: "Free",
    period: "",
    tagline: "Start building your investing instincts",
    description: "Perfect for curious learners ready to explore the world of investing.",
    features: [
      { text: "10 interactive lessons", highlight: true },
      { text: "3 investment games", highlight: true },
      { text: "Basic portfolio tracker", highlight: true },
      { text: "Community access", highlight: true },
      { text: "XP & streaks", highlight: true },
      { text: "AI market simulation" },
      { text: "AI Coach" },
    ],
    cta: "Get Started Free",
    ctaVariant: "outline",
    highlighted: false,
  },
  {
    name: "Pro Student",
    icon: Zap,
    price: "$9.99",
    annualPrice: "$99.99",
    period: "/mo",
    originalPrice: "$12.99",
    tagline: "The fastest path to financial confidence",
    description: "Everything you need to go from beginner to confident investor.",
    badge: "Most Popular",
    trialNote: "7-day free trial · No credit card required",
    features: [
      { text: "25+ interactive lessons", highlight: true },
      { text: "All 5 investment games", highlight: true },
      { text: "Full AI market simulation", highlight: true },
      { text: "AI Coach — personalized feedback", highlight: true },
      { text: "Advanced portfolio analytics", highlight: true },
      { text: "Priority community access", highlight: true },
      { text: "Unlimited XP & achievements", highlight: true },
    ],
    cta: "Start Free Trial",
    ctaVariant: "default",
    highlighted: true,
  },
  {
    name: "Schools & Districts",
    icon: Building2,
    price: "Custom",
    period: "",
    tagline: "Financial literacy at scale",
    description: "Empower every student in your school or district.",
    features: [
      { text: "Everything in Pro", highlight: true },
      { text: "Unlimited educator seats", highlight: true },
      { text: "Admin dashboard & analytics", highlight: true },
      { text: "SSO integration", highlight: true },
      { text: "Struggling student alerts", highlight: true },
      { text: "Custom curriculum builder", highlight: true },
      { text: "Dedicated success manager", highlight: true },
    ],
    cta: "Contact Sales",
    ctaVariant: "outline",
    highlighted: false,
  },
];

const stats = [
  { value: "10,000+", label: "Students learning" },
  { value: "87%", label: "Report higher confidence" },
  { value: "4.9/5", label: "Average rating" },
  { value: "200+", label: "Schools onboarded" },
];

export const PricingSection = () => {
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");

  return (
    <section id="pricing" className="py-24 md:py-32 relative">
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Header — centered */}
        <motion.div
          className="text-center mb-6"
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <p className="text-[11px] font-medium text-primary uppercase tracking-[0.18em] mb-4">
            Pricing
          </p>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight mb-4 text-foreground">
            Invest in yourself. Start free.
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto">
            Join thousands of students building real financial skills — no textbooks, no risk, just results.
          </p>
        </motion.div>

        {/* Monthly / Annual toggle — Cluely-style */}
        <motion.div
          className="flex justify-center mb-6"
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
        >
          <div className="inline-flex items-center bg-muted/50 rounded-xl p-1 ring-1 ring-border/50">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                billingCycle === "monthly"
                  ? "bg-card text-foreground shadow-sm ring-1 ring-border/50"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("annual")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                billingCycle === "annual"
                  ? "bg-card text-foreground shadow-sm ring-1 ring-border/50"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Annually
              <span className="ml-1.5 text-[10px] text-primary font-medium">Save 20%</span>
            </button>
          </div>
        </motion.div>

        {/* Urgency banner */}
        <motion.div
          className="flex justify-center mb-14"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <div className="inline-flex items-center gap-2 ring-1 ring-border/50 rounded-xl px-5 py-2.5 bg-card">
            <Clock className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-medium text-muted-foreground">
              Early Access — Limited beta seats remaining for Spring 2026
            </span>
          </div>
        </motion.div>

        {/* Pricing Grid — Cluely-style rounded-2xl cards with ring */}
        <motion.div
          className="grid md:grid-cols-3 gap-5 items-stretch mb-20 max-w-5xl mx-auto"
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              variants={fadeUp}
              className={`relative group rounded-2xl p-6 lg:p-7 flex flex-col bg-card ring-1 transition-all duration-300 ${
                tier.highlighted
                  ? "ring-primary/40 shadow-lg shadow-primary/5 scale-[1.02]"
                  : "ring-border/50 hover:ring-border hover:shadow-md"
              }`}
            >
              {tier.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                  <div className="bg-primary text-primary-foreground text-[10px] font-medium uppercase tracking-wider px-4 py-1 rounded-lg shadow-sm">
                    {tier.badge}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  tier.highlighted ? "bg-primary/10" : "bg-muted/50"
                }`}>
                  <tier.icon className={`w-4.5 h-4.5 ${tier.highlighted ? "text-primary" : "text-muted-foreground"}`} />
                </div>
                <h3 className="text-base font-medium text-foreground">{tier.name}</h3>
              </div>

              <p className="text-xs text-primary/80 font-medium mb-2">{tier.tagline}</p>

              <div className="flex items-baseline gap-1 mb-0.5">
                {tier.originalPrice && billingCycle === "monthly" && (
                  <span className="text-sm text-muted-foreground line-through mr-1">{tier.originalPrice}</span>
                )}
                <span className="font-display text-3xl font-medium tracking-tight">
                  {billingCycle === "annual" && tier.annualPrice ? tier.annualPrice : tier.price}
                </span>
                {tier.period && <span className="text-sm text-muted-foreground">{tier.period}</span>}
              </div>
              {tier.annualPrice && (
                <p className="text-[11px] text-muted-foreground mb-1">
                  {billingCycle === "annual"
                    ? `$${(parseFloat(tier.annualPrice.replace("$", "")) * 12).toFixed(2)}/year`
                    : `$${(parseFloat(tier.price.replace("$", "")) * 12).toFixed(2)}/year`}
                </p>
              )}

              {tier.trialNote && <p className="text-[11px] text-success font-medium mb-4">{tier.trialNote}</p>}
              {!tier.trialNote && <div className="mb-4" />}

              <p className="text-xs text-muted-foreground leading-relaxed mb-5">{tier.description}</p>

              <Button
                className={`w-full mb-6 font-medium rounded-xl transition-all duration-300 ${
                  tier.highlighted
                    ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm hover:shadow-md hover:shadow-primary/20"
                    : ""
                }`}
                variant={tier.ctaVariant}
                size="sm"
                onClick={() => navigate("/auth?signup=true")}
              >
                {tier.cta}
                {tier.highlighted && <ArrowRight className="w-3.5 h-3.5 ml-1" />}
              </Button>

              <ul className="space-y-2.5 flex-1">
                {tier.features.map((f, j) => (
                  <li key={j} className="flex items-start gap-2.5">
                    {f.highlight ? (
                      <Check className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-primary" />
                    ) : (
                      <X className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-muted-foreground/40" />
                    )}
                    <span className={`text-xs leading-relaxed ${f.highlight ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                      {f.text}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Bar — Cluely-style card with dividers */}
        <motion.div
          className="bg-card ring-1 ring-border/50 rounded-2xl shadow-sm mb-16"
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4">
            {stats.map((s, i) => (
              <div
                key={i}
                className={`text-center py-8 px-4 ${
                  i < stats.length - 1 ? "md:border-r border-border/50" : ""
                } ${i >= 2 ? "border-t md:border-t-0 border-border/50" : ""}`}
              >
                <p className="font-display text-3xl md:text-4xl font-medium text-foreground">{s.value}</p>
                <p className="text-[13px] text-muted-foreground mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Pull quote */}
        <motion.div
          className="text-center max-w-[640px] mx-auto"
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <p className="font-display text-xl font-medium text-foreground mb-3 leading-relaxed">
            "Students using Euphoria scored{" "}
            <span className="text-primary">34% higher</span>{" "}
            on financial literacy assessments."
          </p>
          <p className="text-xs text-muted-foreground">
            Based on pilot data from 200+ classrooms · Spring 2026
          </p>
        </motion.div>
      </div>
    </section>
  );
};
