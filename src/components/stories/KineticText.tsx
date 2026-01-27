import { motion } from "framer-motion";
import { ReactNode } from "react";

interface KineticTextProps {
  children: ReactNode;
  className?: string;
  variant?: "headline" | "subtitle" | "body" | "accent";
  delay?: number;
  stagger?: number;
}

const KineticText = ({
  children,
  className = "",
  variant = "body",
  delay = 0,
  stagger = 0.03,
}: KineticTextProps) => {
  const text = typeof children === "string" ? children : "";
  const words = text.split(" ");

  const variantStyles = {
    headline: "text-4xl md:text-6xl font-black tracking-tight",
    subtitle: "text-xl md:text-2xl font-semibold",
    body: "text-base md:text-lg",
    accent: "text-2xl md:text-3xl font-bold",
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  };

  const wordVariants = {
    hidden: { 
      opacity: 0, 
      y: 40,
      rotateX: -90,
      filter: "blur(10px)",
    },
    visible: { 
      opacity: 1, 
      y: 0,
      rotateX: 0,
      filter: "blur(0px)",
      transition: {
        type: "spring" as const,
        damping: 12,
        stiffness: 200,
      },
    },
  };

  if (typeof children !== "string") {
    return (
      <motion.div
        className={className}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.5 }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={`${variantStyles[variant]} ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{ perspective: 1000 }}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          variants={wordVariants}
          className="inline-block mr-[0.25em]"
          style={{ transformStyle: "preserve-3d" }}
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
};

export default KineticText;
