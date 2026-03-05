import { motion } from "framer-motion";

const topics = [
  "Investing Basics",
  "Options",
  "Long-Term ETFs",
  "Budgeting",
  "Credit",
  "Taxes",
  "Entrepreneurship",
];

interface Props {
  value: string[];
  onChange: (value: string[]) => void;
}

export const TopicInterestStep = ({ value, onChange }: Props) => {
  const toggle = (topic: string) => {
    if (value.includes(topic)) {
      onChange(value.filter((t) => t !== topic));
    } else {
      onChange([...value, topic]);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">What topics interest you most?</h2>
        <p className="text-muted-foreground mt-1">Select all that apply — pick at least one</p>
      </div>
      <div className="flex flex-wrap gap-3 justify-center">
        {topics.map((topic, i) => {
          const isSelected = value.includes(topic);
          return (
            <motion.button
              key={topic}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04 }}
              onClick={() => toggle(topic)}
              className={`px-5 py-3 rounded-full border-2 font-medium transition-all ${
                isSelected
                  ? "border-primary bg-primary/10 text-primary shadow-[var(--shadow-glow-soft)]"
                  : "border-border bg-card hover:border-primary/40 text-foreground"
              }`}
            >
              {topic}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
