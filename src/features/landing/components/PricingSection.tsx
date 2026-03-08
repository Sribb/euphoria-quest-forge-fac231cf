import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  X,
  ArrowRight,
  Zap,
  Crown,
  Building2,
  Sparkles,
  Users,
  TrendingUp,
  Shield,
  Star,
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
    name: "Premium Student",
    icon: Crown,
    price: "$12.99",
    period: "/mo",
    originalPrice: "$19.99",
    tagline: "For ambitious students who want every edge",
    description: "Unlock exclusive tools used by top-performing learners.",
    features: [
      { text: "Everything in Pro Student", highlight: true },
      { text: "Exclusive advanced simulations", highlight: true },
      { text: "1-on-1 AI mentorship sessions", highlight: true },
      { text: "Certification of completion", highlight: true },
      { text: "Early access to new features", highlight: true },
      { text: "Export portfolio reports", highlight: true },
      { text: "Custom learning pathways", highlight: true },
    ],
    cta: "Upgrade to Premium",
    ctaVariant: "outline",
    highlighted: false,
  },
  {
    name: "Schools & Districts",
    icon: Building2,
    price: "Custom",
    period: "",
    tagline: "Financial literacy at scale",
    description: "Empower every student in your school or district.",
    features: [
      { text: "Everything in Premium", highlight: true },
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

const socialProof = [
  { icon: Users, value: "10,000+", label: "Students learning" },
  { icon: TrendingUp, value: "87%", label: "Report higher confidence" },
  { icon: Star, value: "4.9/5", label: "Average rating" },
  { icon: Shield, value: "200+", label: "Schools onboarded" },
];

export const PricingSection = () => {
  const navigate = useNavigate();
  const [hoveredTier, setHoveredTier] = useState<number | null>(null);

  return (
    <section id="pricing" className="py-24 md:py-32 relative overflow-x-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(262_83%_58%/0.06),transparent_70%)]" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-6"
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <p className="text-xs font-semibold text-primary uppercase tracking-[0.2em] mb-4">
            Pricing
          </p>
          <h2 className="text-3xl md:text-[2.75rem] lg:text-[3.25rem] font-bold tracking-[-0.02em] mb-4">
            Invest in yourself.{" "}
            <span className="bg-gradient-to-r from-primary via-[hsl(280_80%_65%)] to-primary bg-clip-text text-transparent">
              Start free.
            </span>
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
          <div className="inline-flex items-center gap-2 bg-primary/8 border border-primary/20 rounded-full px-5 py-2">
            <Clock className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-medium text-primary">
              Early Access — Limited beta seats remaining for Spring 2026
            </span>
          </div>
        </motion.div>

        {/* Pricing Grid */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch mb-20"
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
              {/* Gradient border wrapper */}
              <div
                className={`relative h-full rounded-2xl p-[1px] transition-all duration-500 ${
                  tier.highlighted
                    ? "bg-gradient-to-b from-primary via-primary/50 to-primary/20 shadow-[0_0_40px_-8px_hsl(262_83%_58%/0.4)]"
                    : hoveredTier === i
                    ? "bg-gradient-to-b from-[hsl(var(--border))] to-primary/20"
                    : "bg-gradient-to-b from-[hsl(var(--border))] to-transparent"
                }`}
              >
                {/* Badge */}
                {tier.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
                    <div className="bg-gradient-to-r from-primary to-[hsl(280_80%_60%)] text-primary-foreground text-[10px] font-bold uppercase tracking-wider px-4 py-1 rounded-full shadow-[0_4px_20px_-4px_hsl(262_83%_58%/0.5)]">
                      {tier.badge}
                    </div>
                  </div>
                )}

                {/* Card body */}
                <div
                  className={`relative h-full rounded-2xl p-6 lg:p-7 flex flex-col transition-all duration-500 ${
                    tier.highlighted
                      ? "bg-[hsl(240_10%_5%)]"
                      : "bg-[hsl(240_10%_6%)]"
                  } ${hoveredTier === i ? "-translate-y-1" : ""}`}
                >
                  {/* Hover glow overlay */}
                  <div
                    className={`absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/[0.04] via-transparent to-transparent transition-opacity duration-500 ${
                      hoveredTier === i ? "opacity-100" : "opacity-0"
                    }`}
                  />

                  <div className="relative z-10 flex flex-col h-full">
                    {/* Icon + Name */}
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300 ${
                          tier.highlighted
                            ? "bg-primary/20 shadow-[0_0_16px_hsl(262_83%_58%/0.3)]"
                            : "bg-muted/50"
                        } ${hoveredTier === i ? "scale-110" : ""}`}
                      >
                        <tier.icon
                          className={`w-4.5 h-4.5 ${
                            tier.highlighted ? "text-primary" : "text-muted-foreground"
                          }`}
                        />
                      </div>
                      <h3 className="text-base font-bold">{tier.name}</h3>
                    </div>

                    {/* Tagline */}
                    <p className="text-xs text-primary/80 font-medium mb-2">{tier.tagline}</p>

                    {/* Price */}
                    <div className="flex items-baseline gap-1 mb-1">
                      {tier.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through mr-1">
                          {tier.originalPrice}
                        </span>
                      )}
                      <span className="text-3xl font-bold tracking-tight">{tier.price}</span>
                      {tier.period && (
                        <span className="text-sm text-muted-foreground">{tier.period}</span>
                      )}
                    </div>

                    {/* Trial note */}
                    {tier.trialNote && (
                      <p className="text-[11px] text-success font-medium mb-4">{tier.trialNote}</p>
                    )}
                    {!tier.trialNote && <div className="mb-4" />}

                    {/* Description */}
                    <p className="text-xs text-muted-foreground leading-relaxed mb-5">
                      {tier.description}
                    </p>

                    {/* CTA */}
                    <Button
                      className={`w-full mb-6 font-semibold transition-all duration-300 ${
                        tier.highlighted
                          ? "bg-gradient-to-r from-primary to-[hsl(280_80%_60%)] hover:shadow-[0_8px_30px_-6px_hsl(262_83%_58%/0.5)] hover:-translate-y-0.5 text-primary-foreground"
                          : ""
                      }`}
                      variant={tier.ctaVariant}
                      size="sm"
                      onClick={() => navigate("/auth?signup=true")}
                    >
                      {tier.cta}
                      {tier.highlighted && <ArrowRight className="w-3.5 h-3.5 ml-1" />}
                    </Button>

                    {/* Features */}
                    <ul className="space-y-2.5 flex-1">
                      {tier.features.map((f, j) => (
                        <li key={j} className="flex items-start gap-2.5">
                          {f.highlight ? (
                            <Check className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-primary" />
                          ) : (
                            <X className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-muted-foreground/40" />
                          )}
                          <span
                            className={`text-xs leading-relaxed ${
                              f.highlight
                                ? "text-foreground font-medium"
                                : "text-muted-foreground"
                            }`}
                          >
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

        {/* Social Proof Bar */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16"
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {socialProof.map((s, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="text-center p-5 rounded-xl border border-border/30 bg-card/30"
            >
              <s.icon className="w-5 h-5 text-primary mx-auto mb-2" />
              <p className="text-xl font-bold">{s.value}</p>
              <p className="text-[11px] text-muted-foreground">{s.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Trust / ROI strip */}
        <motion.div
          className="text-center"
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <div className="inline-flex flex-col items-center gap-3 p-6 rounded-2xl border border-border/20 bg-card/20 max-w-2xl">
            <p className="text-sm font-semibold">
              "Students using Euphoria scored{" "}
              <span className="text-primary">34% higher</span> on financial literacy assessments."
            </p>
            <p className="text-[11px] text-muted-foreground">
              Based on pilot data from 200+ classrooms · Spring 2026
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
