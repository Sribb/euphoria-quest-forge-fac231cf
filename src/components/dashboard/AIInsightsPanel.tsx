import { Brain, Sparkles, TrendingUp, Award } from "lucide-react";
import { Card } from "@/components/ui/card";

interface AIInsight {
  id: number;
  icon: React.ReactNode;
  title: string;
  description: string;
  type: "achievement" | "performance" | "suggestion" | "milestone";
}

const INSIGHTS: AIInsight[] = [
  {
    id: 1,
    icon: <Award className="w-6 h-6" />,
    title: "Learning Mastery",
    description: "You've mastered 80% of your financial literacy path — keep it up! Only 3 lessons remaining.",
    type: "achievement"
  },
  {
    id: 2,
    icon: <TrendingUp className="w-6 h-6" />,
    title: "Portfolio Performance",
    description: "Your portfolio outperformed the S&P 500 by 3.2% this week. Excellent diversification strategy!",
    type: "performance"
  },
  {
    id: 3,
    icon: <Sparkles className="w-6 h-6" />,
    title: "Game Progress",
    description: "Try revisiting Trend Master — your accuracy is improving fast. You're now in the top 15% of players.",
    type: "suggestion"
  }
];

export const AIInsightsPanel = () => {
  return (
    <Card className="p-6 bg-gradient-surface border-border shadow-glow-soft">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Brain className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-foreground">AI Insights</h3>
          <p className="text-sm text-muted-foreground">Personalized to your activity</p>
        </div>
      </div>

      <div className="space-y-4">
        {INSIGHTS.map((insight, index) => (
          <div
            key={insight.id}
            className="group p-5 bg-gradient-to-br from-card/80 to-card/40 rounded-xl border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-glow animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-lg text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 group-hover:scale-110">
                {insight.icon}
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
                  {insight.title}
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {insight.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-primary/5 rounded-xl border border-primary/20 backdrop-blur-sm">
        <p className="text-xs text-center text-muted-foreground">
          <span className="text-primary font-semibold">✨ AI-Powered:</span> These insights are generated based on your learning progress, trading patterns, and game performance
        </p>
      </div>
    </Card>
  );
};
