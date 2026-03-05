import { motion } from "framer-motion";
import euphoriaLogo from "@/assets/euphoria-logo-button.png";
import { cn } from "@/lib/utils";

interface EuphoriaSpinnerProps {
  size?: "sm" | "md" | "lg";
  label?: string;
  className?: string;
}

const sizes = {
  sm: "w-8 h-8",
  md: "w-12 h-12",
  lg: "w-16 h-16",
};

export const EuphoriaSpinner = ({ size = "md", label, className }: EuphoriaSpinnerProps) => (
  <div className={cn("flex flex-col items-center gap-3", className)}>
    <motion.img
      src={euphoriaLogo}
      alt="Loading"
      className={cn("rounded-xl", sizes[size])}
      animate={{ rotate: 360 }}
      transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
    />
    {label && (
      <p className="text-sm text-muted-foreground font-medium">{label}</p>
    )}
  </div>
);
