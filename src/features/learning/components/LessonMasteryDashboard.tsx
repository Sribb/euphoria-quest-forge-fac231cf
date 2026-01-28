import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Target, TrendingUp, Brain, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LessonMasteryDashboardProps {
  score: number;
  passed: boolean;
  weakAreas: string[];
  masteryLevel: string;
  attempts: number;
  onRetry: () => void;
  onContinue: () => void;
}

export const LessonMasteryDashboard = ({
  score,
  passed,
  weakAreas,
  masteryLevel,
  attempts,
  onRetry,
  onContinue,
}: LessonMasteryDashboardProps) => {
  const getMasteryColor = (level: string) => {
    switch (level) {
      case 'expert': return 'text-purple-500';
      case 'advanced': return 'text-blue-500';
      case 'intermediate': return 'text-green-500';
      default: return 'text-yellow-500';
    }
  };

  const getMasteryIcon = (level: string) => {
    switch (level) {
      case 'expert': return '🏆';
      case 'advanced': return '💎';
      case 'intermediate': return '⭐';
      default: return '🌱';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Results Header */}
      <Card className={`p-8 text-center ${
        passed ? 'bg-success/10 border-success/20' : 'bg-warning/10 border-warning/20'
      }`}>
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 bg-background">
          {passed ? (
            <Trophy className="w-10 h-10 text-success" />
          ) : (
            <Target className="w-10 h-10 text-warning" />
          )}
        </div>
        <h2 className="text-3xl font-bold mb-2">
          {passed ? 'Challenge Passed!' : 'Keep Practicing'}
        </h2>
        <p className="text-lg text-muted-foreground mb-4">
          {passed 
            ? 'You\'ve demonstrated mastery of this lesson' 
            : 'Score 80% or higher to unlock the next lesson'}
        </p>
        <div className="flex items-center justify-center gap-4">
          <div className="text-5xl font-bold text-primary">{score}%</div>
          <div className="text-left">
            <p className="text-sm text-muted-foreground">Your Score</p>
            <p className="text-sm font-semibold">
              {passed ? 'Requirement: 80%+' : 'Needed: 80%'}
            </p>
          </div>
        </div>
        {passed && (
          <Badge variant="default" className="mt-4 text-lg py-2 px-4">
            +100 Coins Earned!
          </Badge>
        )}
      </Card>

      {/* Mastery Level */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-2xl">
              {getMasteryIcon(masteryLevel)}
            </div>
            <div>
              <h3 className="font-semibold">Mastery Level</h3>
              <p className={`text-lg font-bold ${getMasteryColor(masteryLevel)} capitalize`}>
                {masteryLevel}
              </p>
            </div>
          </div>
          <Badge variant="outline">
            Attempt {attempts}
          </Badge>
        </div>
        
        <Progress value={score} className="h-3 mb-2" />
        <p className="text-xs text-muted-foreground text-right">
          {score}% mastery achieved
        </p>
      </Card>

      {/* Performance Breakdown */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">Performance Analysis</h3>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 rounded-lg bg-muted">
            <div className="text-2xl font-bold text-primary">{score}%</div>
            <p className="text-xs text-muted-foreground mt-1">Overall Score</p>
          </div>
          <div className="text-center p-4 rounded-lg bg-muted">
            <div className="text-2xl font-bold text-primary">{attempts}</div>
            <p className="text-xs text-muted-foreground mt-1">Attempts</p>
          </div>
          <div className="text-center p-4 rounded-lg bg-muted">
            <div className="text-2xl font-bold text-primary capitalize">{masteryLevel}</div>
            <p className="text-xs text-muted-foreground mt-1">Level</p>
          </div>
        </div>
      </Card>

      {/* Weak Areas */}
      {weakAreas && weakAreas.length > 0 && (
        <Card className="p-6 bg-warning/5 border-warning/20">
          <div className="flex items-start gap-3 mb-4">
            <AlertCircle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold mb-2">Areas for Improvement</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Focus on these topics when you retry the challenge:
              </p>
              <div className="flex flex-wrap gap-2">
                {weakAreas.map((area, idx) => (
                  <Badge key={idx} variant="outline" className="bg-background">
                    {area}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Personalized Recommendations */}
      <Card className="p-6 bg-primary/5 border-primary/20">
        <div className="flex items-start gap-3">
          <Brain className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold mb-2">AI Recommendation</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {passed ? (
                `Excellent work! You've demonstrated ${masteryLevel} level understanding. ${
                  score >= 95 ? 'Perfect score - you\'ve mastered this material!' :
                  score >= 90 ? 'Outstanding performance! Ready for the next challenge.' :
                  'Solid grasp of the concepts. Continue to the next lesson to build on this foundation.'
                }`
              ) : (
                `Score: ${score}%. ${
                  score >= 70 ? 'You\'re close! Review the weak areas and try again.' :
                  score >= 50 ? 'You understand some concepts. Revisit the lesson content and focus on the areas marked for improvement.' :
                  'Consider reviewing the lesson material thoroughly before attempting the challenge again.'
                } ${weakAreas.length > 0 ? `Pay special attention to: ${weakAreas.slice(0, 2).join(', ')}.` : ''}`
              )}
            </p>
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3">
        {!passed && (
          <Button
            onClick={onRetry}
            variant="outline"
            className="flex-1"
          >
            Retry Challenge
          </Button>
        )}
        <Button
          onClick={onContinue}
          className="flex-1 bg-gradient-primary"
        >
          {passed ? 'Continue to Next Lesson' : 'Review Lesson'}
        </Button>
      </div>
    </div>
  );
};