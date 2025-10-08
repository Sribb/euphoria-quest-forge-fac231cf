import { useState } from "react";
import { LessonCard } from "@/components/learn/LessonCard";
import { BookOpen } from "lucide-react";

interface LearnProps {
  onNavigate: (tab: string) => void;
}

const lessons = [
  {
    id: 1,
    title: "Introduction to Investing",
    description: "Learn the basics of stocks, bonds, and portfolio management",
    duration: "15 min",
    progress: 100,
    completed: true,
    locked: false,
  },
  {
    id: 2,
    title: "Understanding Risk & Return",
    description: "Discover how risk and return are related in investing",
    duration: "20 min",
    progress: 65,
    completed: false,
    locked: false,
  },
  {
    id: 3,
    title: "Market Volatility Explained",
    description: "Learn how to navigate market ups and downs",
    duration: "18 min",
    progress: 0,
    completed: false,
    locked: false,
  },
  {
    id: 4,
    title: "Advanced Portfolio Strategies",
    description: "Master diversification and asset allocation",
    duration: "25 min",
    progress: 0,
    completed: false,
    locked: true,
  },
];

const Learn = ({ onNavigate }: LearnProps) => {
  const handleLessonClick = () => {
    // In a real app, this would navigate to the lesson content
    console.log("Opening lesson...");
  };

  return (
    <div className="space-y-6 pb-24">
      <div className="flex items-center gap-3 animate-fade-in">
        <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
          <BookOpen className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Learn</h1>
          <p className="text-muted-foreground">Master investing through interactive lessons</p>
        </div>
      </div>

      <div className="space-y-4">
        {lessons.map((lesson, index) => (
          <div
            key={lesson.id}
            className="animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <LessonCard
              title={lesson.title}
              description={lesson.description}
              duration={lesson.duration}
              progress={lesson.progress}
              locked={lesson.locked}
              completed={lesson.completed}
              onClick={handleLessonClick}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Learn;
