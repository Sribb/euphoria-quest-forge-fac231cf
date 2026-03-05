import { motion } from "framer-motion";
import { Wrench, Eye, BookOpen, Play, ClipboardCheck } from "lucide-react";

const styles = [
  { id: "hands_on", label: "Hands-on", icon: Wrench },
  { id: "visual", label: "Visual", icon: Eye },
  { id: "reading", label: "Reading", icon: BookOpen },
  { id: "short_videos", label: "Short Videos", icon: Play },
  { id: "practice_quizzes", label: "Practice Quizzes", icon: ClipboardCheck },
];

interface Props {
  value: string | null;
  onChange: (value: string) => void;
}

export const LearningStyleStep = ({ value, onChange }: Props) => (
  <div className="space-y-6">
    <div>
      <h2 className="text-2xl font-bold">What's your preferred learning style?</h2>
      <p className="text-muted-foreground mt-1">We'll tailor content to how you learn best</p>
    </div>
    <div className="flex flex-wrap gap-3 justify-center">
      {styles.map((style, i) => {
        const Icon = style.icon;
        const isSelected = value === style.id;
        return (
          <motion.button
            key={style.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => onChange(style.id)}
            className={`flex items-center gap-2 px-5 py-3 rounded-full border-2 font-medium transition-all ${
              isSelected
                ? "border-primary bg-primary/10 text-primary shadow-[var(--shadow-glow-soft)]"
                : "border-border bg-card hover:border-primary/40 text-foreground"
            }`}
          >
            <Icon className="w-4 h-4" />
            {style.label}
          </motion.button>
        );
      })}
    </div>
  </div>
);
