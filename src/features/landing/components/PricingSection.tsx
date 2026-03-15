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
  const [hoveredTier, setHoveredTier] = useState<number | null>(null);

  return (
    <section id="pricing" className="py-24 md:py-32 relative overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-6"
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <p className="text-[11px] font-medium text-primary uppercase tracking-[0.15em] mb-4">
            Pricing
          </p>
          <h2 className="font-heading text-4xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">
            Invest in yourself. Start free.
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto">
            Join thousands of students building real financial skills — no textbooks, no risk, just results.
          </p>
        </motion.div>

        {/* Urgency banner */}
        <motion.div
          className="flex justify-center mb-14"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <div className="inline-flex items-center gap-2 border border-white/[0.07] rounded-lg px-5 py-2">
            <Clock className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-medium text-muted-foreground">
              Early Access — Limited beta seats remaining for Spring 2026
            </span>
          </div>
        </motion.div>

        {/* Pricing Grid */}
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
              onMouseEnter={() => setHoveredTier(i)}
              onMouseLeave={() => setHoveredTier(null)}
              className="relative"
            >
              <div
                className={`relative h-full rounded-xl p-[1px] transition-all duration-500 ${
                  tier.highlighted
                    ? "bg-gradient-to-b from-primary via-primary/50 to-primary/20 shadow-[0_0_40px_-8px_hsl(263_70%_50%/0.4)]"
                    : hoveredTier === i
                    ? "bg-gradient-to-b from-white/[0.12] to-primary/20"
                    : "bg-white/[0.07]"
                }`}
              >
                {tier.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
                    <div className="bg-primary text-primary-foreground text-[10px] font-medium uppercase tracking-wider px-4 py-1 rounded-lg">
                      {tier.badge}
                    </div>
                  </div>
                )}

                <div
                  className={`relative h-full rounded-xl p-6 lg:p-7 flex flex-col transition-all duration-500 bg-card ${
                    hoveredTier === i ? "-translate-y-1" : ""
                  }`}
                >
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${tier.highlighted ? "bg-primary/15" : "bg-muted/50"}`}>
                        <tier.icon className={`w-4 h-4 ${tier.highlighted ? "text-primary" : "text-muted-foreground"}`} />
                      </div>
                      <h3 className="text-base font-medium text-foreground">{tier.name}</h3>
                    </div>

                    <p className="text-xs text-primary/80 font-medium mb-2">{tier.tagline}</p>

                    <div className="flex items-baseline gap-1 mb-1">
                      {tier.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through mr-1">{tier.originalPrice}</span>
                      )}
                      <span className="font-heading text-3xl font-bold tracking-tight">{tier.price}</span>
                      {tier.period && <span className="text-sm text-muted-foreground">{tier.period}</span>}
                    </div>

                    {tier.trialNote && <p className="text-[11px] text-success font-medium mb-4">{tier.trialNote}</p>}
                    {!tier.trialNote && <div className="mb-4" />}

                    <p className="text-xs text-muted-foreground leading-relaxed mb-5">{tier.description}</p>

                    <Button
                      className={`w-full mb-6 font-medium rounded-lg transition-all duration-300 ${
                        tier.highlighted
                          ? "bg-primary hover:bg-primary/90 text-primary-foreground hover:shadow-[0_8px_30px_-6px_hsl(263_70%_50%/0.5)] hover:-translate-y-0.5"
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
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Bar — single card with vertical dividers */}
        <motion.div
          className="bg-card border border-white/[0.07] rounded-xl mb-16"
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
                  i < stats.length - 1 ? "border-r border-white/[0.07]" : ""
                } ${i >= 2 ? "border-t md:border-t-0 border-white/[0.07]" : ""}`}
              >
                <p className="font-heading text-3xl md:text-4xl font-bold text-foreground">{s.value}</p>
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
          <p className="font-heading text-xl font-bold text-foreground mb-3">
            "Students using Euphoria scored{" "}
            <span className="text-primary">34% higher</span>{" "}
            on financial literacy assessments."
          </p>
          <p className="text-xs text-[hsl(240_4%_32%)]">
            Based on pilot data from 200+ classrooms · Spring 2026
          </p>
        </motion.div>
      </div>
    </section>
  );
};
