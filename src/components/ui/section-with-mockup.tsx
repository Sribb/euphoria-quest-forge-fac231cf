import React from "react";
import { motion } from "framer-motion";

interface SectionWithMockupProps {
  title: string | React.ReactNode;
  description: string | React.ReactNode;
  primaryImageSrc: string;
  secondaryImageSrc: string;
  reverseLayout?: boolean;
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" as const },
  },
};

const SectionWithMockup: React.FC<SectionWithMockupProps> = ({
  title,
  description,
  primaryImageSrc,
  secondaryImageSrc,
  reverseLayout = false,
}) => {
  const layoutClasses = reverseLayout
    ? "md:grid-cols-2 md:grid-flow-col-dense"
    : "md:grid-cols-2";

  const textOrderClass = reverseLayout ? "md:col-start-2" : "";
  const imageOrderClass = reverseLayout ? "md:col-start-1" : "";

  return (
    <section className="relative w-full py-20 md:py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          className={`grid grid-cols-1 ${layoutClasses} gap-12 lg:gap-20 items-center`}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {/* Text Content */}
          <motion.div
            className={`flex flex-col gap-6 ${textOrderClass}`}
            variants={itemVariants}
          >
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-[1.1] tracking-tight">
              {title}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-lg">
              {description}
            </p>
          </motion.div>

          {/* App mockup / Image Content */}
          <motion.div
            className={`relative ${imageOrderClass}`}
            variants={itemVariants}
          >
            {/* Decorative Background Element */}
            <div className="absolute -inset-4 z-0">
              <div className="absolute inset-0 rounded-3xl bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,hsl(var(--primary)/0.08),transparent_70%)]" />
            </div>

            {/* Secondary Image — offset behind */}
            <div className="absolute -bottom-6 -right-6 w-[70%] z-0 opacity-40">
              <img
                src={secondaryImageSrc}
                alt=""
                className="w-full h-auto rounded-xl border border-white/[0.05] shadow-2xl"
                loading="lazy"
              />
            </div>

            {/* Main Mockup Card */}
            <div className="relative z-10">
              <div className="rounded-xl border border-white/[0.07] bg-card shadow-[0_32px_64px_rgba(0,0,0,0.5)] overflow-hidden">
                {/* Browser chrome */}
                <div className="flex items-center gap-2 px-4 py-3 bg-muted/50 border-b border-white/[0.07]">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-[hsl(0_40%_45%)]" />
                    <div className="w-2 h-2 rounded-full bg-[hsl(45_50%_45%)]" />
                    <div className="w-2 h-2 rounded-full bg-[hsl(142_40%_40%)]" />
                  </div>
                </div>
                <img
                  src={primaryImageSrc}
                  alt=""
                  className="w-full h-auto block"
                  loading="lazy"
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Decorative bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
};

export default SectionWithMockup;
