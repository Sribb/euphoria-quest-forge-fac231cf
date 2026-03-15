import { Button } from "@/components/ui/button";
import { motion, type Variants } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

interface HeroSectionProps {
  badge?: string;
  titleLine1?: string;
  titleLine2?: string;
  description?: string;
  primaryCta?: { label: string; onClick?: () => void };
  secondaryCta?: { label: string; onClick?: () => void };
  stats?: { value: string; label: string }[];
}

export function HeroSection({
  badge = "The #1 investing simulator for students",
  titleLine1 = "Master the Markets.",
  titleLine2 = "Learn with Euphoria.",
  description = "Interactive lessons, AI-powered simulations, and gamified challenges — without risking a single dollar.",
  primaryCta = { label: "Start Learning Free" },
  secondaryCta = { label: "See How It Works" },
  stats = [
    { value: "10k+", label: "Students" },
    { value: "50+", label: "Lessons" },
    { value: "100%", label: "Risk-Free" },
  ],
}: HeroSectionProps) {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <section className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.1),transparent_60%)]" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[radial-gradient(circle,hsl(var(--primary)/0.06),transparent_70%)] blur-3xl" />

      <motion.div
        className="relative z-10 max-w-4xl mx-auto px-6 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Badge */}
        <motion.div variants={itemVariants} className="mb-8 flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5" />
            {badge}
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          variants={itemVariants}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.08] tracking-tight mb-6"
        >
          <span className="block text-foreground">{titleLine1}</span>
          <span className="block bg-gradient-to-r from-primary via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
            {titleLine2}
          </span>
        </motion.h1>

        {/* Description */}
        <motion.p
          variants={itemVariants}
          className="mx-auto max-w-xl text-base md:text-lg text-muted-foreground mb-10"
        >
          {description}
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button
            size="lg"
            onClick={primaryCta.onClick}
            className="px-8 text-base font-semibold bg-gradient-primary shadow-glow-soft hover:shadow-glow hover:-translate-y-0.5 transition-all duration-200"
          >
            {primaryCta.label}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={secondaryCta.onClick}
            className="px-8 text-base font-semibold border-border/60 hover:border-primary/40 hover:bg-primary/5 transition-all duration-200"
          >
            {secondaryCta.label}
          </Button>
        </motion.div>

        {/* Stats */}
        {stats.length > 0 && (
          <motion.div
            variants={itemVariants}
            className="mt-14 flex flex-wrap items-center justify-center gap-x-10 gap-y-4"
          >
            {stats.map((stat, i) => (
              <div key={i} className="flex flex-col items-center gap-0.5">
                <span className="text-2xl font-bold text-foreground">
                  {stat.value}
                </span>
                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                  {stat.label}
                </span>
              </div>
            ))}
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
