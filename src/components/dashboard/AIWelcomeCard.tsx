import { Brain, Sparkles, TrendingUp, Users, GitBranch } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface AIWelcomeCardProps {
  onNavigate: (tab: string) => void;
}

export const AIWelcomeCard = ({ onNavigate }: AIWelcomeCardProps) => {
  return (
    <Card className="p-6 bg-gradient-primary border-0 text-white overflow-hidden relative animate-fade-in">
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      
      <div className="relative">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
            <Brain className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xl font-bold">AI-Powered Trading Engine</h3>
            <p className="text-white/80 text-sm">Experience the future of trading education</p>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-white/10 backdrop-blur-sm">
            <Sparkles className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold mb-1">Real-Time Market Simulation</h4>
              <p className="text-sm text-white/80">
                AI dynamically controls stock prices, sector performance, and trade execution based on your actions
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg bg-white/10 backdrop-blur-sm">
            <Users className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold mb-1">Adaptive AI Competitors</h4>
              <p className="text-sm text-white/80">
                Compete against AI traders with distinct strategies that learn and evolve as you trade
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg bg-white/10 backdrop-blur-sm">
            <TrendingUp className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold mb-1">Predictive Trade Coaching</h4>
              <p className="text-sm text-white/80">
                Get AI-powered insights showing how your trades impact the market and competitors
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg bg-white/10 backdrop-blur-sm">
            <GitBranch className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold mb-1">Parallel Scenario Testing</h4>
              <p className="text-sm text-white/80">
                Test alternative strategies in AI-generated markets with predicted outcomes
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="bg-white/20 text-white border-0">
            <Sparkles className="w-3 h-3 mr-1" />
            Powered by AI
          </Badge>
          <Button
            className="bg-white text-primary hover:bg-white/90 font-semibold"
            onClick={() => onNavigate('trade')}
          >
            Start Trading
          </Button>
        </div>
      </div>
    </Card>
  );
};
