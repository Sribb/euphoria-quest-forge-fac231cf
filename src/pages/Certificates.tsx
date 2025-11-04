import { Award, Download, Share2, Lock, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface CertificatesProps {
  onNavigate: (tab: string) => void;
}

const Certificates = ({ onNavigate }: CertificatesProps) => {
  const { user } = useAuth();

  const { data: lessonProgress } = useQuery({
    queryKey: ["lessonProgress", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_lesson_progress")
        .select("*")
        .eq("user_id", user?.id);
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const { data: streak } = useQuery({
    queryKey: ["streak", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("streaks")
        .select("*")
        .eq("user_id", user?.id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const { data: achievements } = useQuery({
    queryKey: ["userAchievements", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_achievements")
        .select("*, achievements(*)")
        .eq("user_id", user?.id);
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const completedLessons = lessonProgress?.filter(l => l.completed).length || 0;
  const totalLessons = lessonProgress?.length || 1;

  const certificates = [
    {
      id: "fundamentals",
      title: "Investment Fundamentals",
      description: "Master the basics of investing, portfolio management, and market analysis",
      requirements: [
        { text: "Complete 5 beginner lessons", completed: completedLessons >= 5 },
        { text: "Maintain 7-day streak", completed: (streak?.current_streak || 0) >= 7 },
        { text: "Score 80+ on fundamentals quiz", completed: false },
      ],
      earned: false,
      earnedDate: null,
    },
    {
      id: "value-investing",
      title: "Value Investing Specialist",
      description: "Learn Warren Buffett's principles and value investing strategies",
      requirements: [
        { text: "Complete all value investing lessons", completed: false },
        { text: "Maintain 14-day streak", completed: (streak?.current_streak || 0) >= 14 },
        { text: "Build a simulated value portfolio", completed: false },
      ],
      earned: false,
      earnedDate: null,
    },
    {
      id: "portfolio-manager",
      title: "Portfolio Manager",
      description: "Demonstrate advanced portfolio construction and risk management",
      requirements: [
        { text: "Complete all portfolio lessons", completed: false },
        { text: "Maintain 21-day streak", completed: (streak?.current_streak || 0) >= 21 },
        { text: "Achieve 5% portfolio growth", completed: false },
        { text: "Pass portfolio management exam", completed: false },
      ],
      earned: false,
      earnedDate: null,
    },
    {
      id: "market-analyst",
      title: "Market Analyst",
      description: "Master technical analysis, market indicators, and trend prediction",
      requirements: [
        { text: "Complete all market analysis lessons", completed: false },
        { text: "Score 85+ on all analysis quizzes", completed: false },
        { text: "Correctly predict 10 market movements", completed: false },
      ],
      earned: false,
      earnedDate: null,
    },
  ];

  const calculateProgress = (requirements: any[]) => {
    const completed = requirements.filter(r => r.completed).length;
    return (completed / requirements.length) * 100;
  };

  return (
    <div className="space-y-6 pb-24 pt-4">
      <div className="flex items-center gap-3 animate-fade-in">
        <div className="w-12 h-12 rounded-xl bg-gradient-warning flex items-center justify-center shadow-glow">
          <Award className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Certificates</h1>
          <p className="text-muted-foreground">Earn credentials and showcase your expertise</p>
        </div>
      </div>

      {/* Achievement Summary */}
      <Card className="p-6 bg-gradient-hero border-primary/20 animate-fade-in">
        <h3 className="text-lg font-bold mb-4">Your Progress</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-3xl font-bold text-primary">{completedLessons}</p>
            <p className="text-sm text-muted-foreground">Lessons Completed</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-success">{streak?.current_streak || 0}</p>
            <p className="text-sm text-muted-foreground">Day Streak</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-warning">{achievements?.length || 0}</p>
            <p className="text-sm text-muted-foreground">Achievements</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-info">0</p>
            <p className="text-sm text-muted-foreground">Certificates</p>
          </div>
        </div>
      </Card>

      {/* Available Certificates */}
      <div className="space-y-4">
        {certificates.map((cert, index) => {
          const progress = calculateProgress(cert.requirements);
          const allCompleted = cert.requirements.every(r => r.completed);

          return (
            <Card
              key={cert.id}
              className={`p-6 border-0 animate-fade-in ${
                allCompleted
                  ? "bg-gradient-success/20 border-success/30"
                  : cert.earned
                  ? "bg-gradient-primary/20 border-primary/30"
                  : "bg-gradient-hero"
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <div
                    className={`w-16 h-16 rounded-xl flex items-center justify-center ${
                      cert.earned
                        ? "bg-gradient-success"
                        : allCompleted
                        ? "bg-gradient-primary animate-pulse"
                        : "bg-muted"
                    }`}
                  >
                    {cert.earned || allCompleted ? (
                      <Award className="w-8 h-8 text-white" />
                    ) : (
                      <Lock className="w-8 h-8 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-lg">{cert.title}</h3>
                      {cert.earned && <Badge className="bg-success">Earned</Badge>}
                      {allCompleted && !cert.earned && (
                        <Badge className="bg-primary animate-pulse">Ready to Claim!</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">{cert.description}</p>

                    {/* Requirements */}
                    <div className="space-y-2 mb-4">
                      <p className="text-sm font-semibold">Requirements:</p>
                      {cert.requirements.map((req, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          {req.completed ? (
                            <CheckCircle2 className="w-4 h-4 text-success" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border-2 border-muted" />
                          )}
                          <span className={`text-sm ${req.completed ? "line-through opacity-60" : ""}`}>
                            {req.text}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-semibold">{Math.round(progress)}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                {allCompleted && !cert.earned && (
                  <Button className="bg-gradient-primary">
                    <Award className="w-4 h-4 mr-2" />
                    Claim Certificate
                  </Button>
                )}
                {cert.earned && (
                  <>
                    <Button variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                    <Button variant="outline">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share on LinkedIn
                    </Button>
                  </>
                )}
                {!allCompleted && !cert.earned && (
                  <Button variant="outline" onClick={() => onNavigate("learn")}>
                    Continue Learning
                  </Button>
                )}
              </div>

              {cert.earnedDate && (
                <p className="text-sm text-muted-foreground mt-4">
                  Earned on {new Date(cert.earnedDate).toLocaleDateString()}
                </p>
              )}
            </Card>
          );
        })}
      </div>

      {/* AI Readiness Assessment */}
      <Card className="p-6 bg-gradient-hero border-primary/20 animate-fade-in" style={{ animationDelay: "400ms" }}>
        <h3 className="text-lg font-bold mb-3">AI Readiness Assessment</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Our AI analyzes your progress and determines when you're ready for certification. Keep learning,
          practicing, and maintaining your streak to unlock new certificates!
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-background/50 rounded-lg">
            <p className="font-semibold mb-2">Strengths</p>
            <ul className="text-sm space-y-1">
              <li>✓ Consistent learning habits</li>
              <li>✓ Strong foundation in basics</li>
              <li>✓ Active community participation</li>
            </ul>
          </div>
          <div className="p-4 bg-background/50 rounded-lg">
            <p className="font-semibold mb-2">Areas to Improve</p>
            <ul className="text-sm space-y-1">
              <li>→ Complete more advanced lessons</li>
              <li>→ Improve quiz scores</li>
              <li>→ Practice portfolio management</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Certificates;
