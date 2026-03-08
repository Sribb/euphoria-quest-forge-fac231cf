import { LucideIcon } from "lucide-react";

export interface SliderInteractive {
  type: 'slider';
  title: string;
  description: string;
  sliders: Array<{
    id: string;
    label: string;
    min: number;
    max: number;
    step: number;
    defaultValue: number;
    unit: string;
  }>;
  calculateResult: (values: Record<string, number>) => {
    primary: string;
    secondary?: string;
    insight?: string;
  };
}

export interface DragSortInteractive {
  type: 'drag-sort';
  title: string;
  description: string;
  items: Array<{ id: string; label: string }>;
  correctOrder: string[];
}

export interface QuizInteractive {
  type: 'quiz';
  title: string;
  description: string;
  questions: Array<{
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }>;
}

export type InteractiveConfig = SliderInteractive | DragSortInteractive | QuizInteractive;

export interface CheckQuiz {
  type: 'quiz';
  questions: Array<{
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }>;
}

export interface CheckFRQ {
  type: 'frq';
  question: string;
  context: string;
  rubricHints?: string[];
}

export type CheckConfig = CheckQuiz | CheckFRQ;

export interface LessonDefinition {
  orderIndex: number;
  title: string;
  // Slide 1: Intro
  intro: {
    description: string;
    points: string[];
  };
  // Slide 2: Teach
  teach: {
    title: string;
    content: string;
    cards: Array<{ title: string; description: string; icon?: string }>;
  };
  // Slide 3: Interactive
  interactive: InteractiveConfig;
  // Slide 4: Check (quiz or FRQ)
  check: CheckConfig;
  // Slide 5: Summary
  summary: {
    points: string[];
    quote: { text: string; author: string };
  };
}

export interface PathwayLessons {
  pathway: string;
  lessons: LessonDefinition[];
}
