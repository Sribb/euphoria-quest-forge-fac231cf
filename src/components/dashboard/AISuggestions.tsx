import { Sparkles, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const suggestions = [
  {
    id: 1,
    title: "Diversify Your Portfolio",
    description: "You're over-invested in tech stocks. Consider adding bonds to reduce risk.",
    action: "Learn More",
  },
  {
    id: 2,
    title: "Complete This Lesson",
    description: "Finish 'Understanding Market Volatility' to unlock advanced trading.",
    action: "Continue",
  },
];

export const AISuggestions = () => {
  return (
    <Card className="p-8 bg-gradient-hero border-0 shadow-lg rounded-2xl animate-fade-in" style={{ animationDelay: "300ms" }}>
      <div className="flex items-center gap-3 mb-6">
        <Sparkles className="w-6 h-6 text-primary animate-pulse" />
        <h3 className="text-2xl font-bold">AI Insights</h3>
      </div>

      <div className="space-y-4">
        {suggestions.map((suggestion) => (
          <div
            key={suggestion.id}
            className="p-5 bg-card rounded-xl border border-border hover:border-primary transition-all duration-300 hover:shadow-md"
          >
            <h4 className="font-semibold mb-2 text-lg">{suggestion.title}</h4>
            <p className="text-sm text-muted-foreground mb-4">{suggestion.description}</p>
            <Button size="sm" variant="ghost" className="text-primary hover:text-primary-foreground hover:bg-primary">
              {suggestion.action}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        ))}
      </div>
    </Card>
  );
};
