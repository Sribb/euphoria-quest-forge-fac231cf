import { motion } from "framer-motion";
import { 
  TrendingUp, 
  CreditCard, 
  GraduationCap, 
  Shield, 
  MoreHorizontal 
} from "lucide-react";

const goals = [
  { id: "grow_wealth", label: "Grow Wealth", icon: TrendingUp },
  { id: "manage_debt", label: "Manage Debt", icon: CreditCard },
  { id: "save_college", label: "Save for College", icon: GraduationCap },
  { id: "emergency_fund", label: "Build Emergency Fund", icon: Shield },
  { id: "other", label: "Other", icon: MoreHorizontal },
];

interface Props {
  value: string | null;
  onChange: (value: string) => void;
}

export const FinancialGoalStep = ({ value, onChange }: Props) => (
  <div className="space-y-6">
    <div>
      <h2 className="text-2xl font-bold">What's your primary financial goal?</h2>
      <p className="text-muted-foreground mt-1">This helps us personalize your learning path</p>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {goals.map((goal, i) => {
        const Icon = goal.icon;
        const isSelected = value === goal.id;
        return (
          <motion.button
            key={goal.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => onChange(goal.id)}
            className={`flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all ${
              isSelected
                ? "border-primary bg-primary/10 shadow-[var(--shadow-glow-soft)]"
                : "border-border bg-card hover:border-primary/40 hover:bg-muted/50"
            }`}
          >
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}
            >
              <Icon className="w-6 h-6" />
            </div>
            <span className="font-semibold">{goal.label}</span>
          </motion.button>
        );
      })}
    </div>
  </div>
);
