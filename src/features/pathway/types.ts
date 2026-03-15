
export interface ConceptStep { type: 'concept'; emoji: string; title: string; body: string; }
export interface TapRevealStep { type: 'tapReveal'; title: string; cards: [string, string][]; }
export interface FillBlankStep { type: 'fillBlank'; sentence: string; options: string[]; correct: number; }
export interface DragSortStep { type: 'dragSort'; prompt: string; items: string[]; }
export interface QuizStep { type: 'quiz'; question: string; options: string[]; correct: number; explanation: string; }
export interface TrueFalseStep { type: 'trueFalse'; statements: { s: string; a: boolean }[]; }
export interface MatchStep { type: 'match'; title: string; pairs: [string, string][]; }
export interface SliderStep { type: 'slider'; question: string; min: number; max: number; correct: number; unit: string; }
export interface ScenarioStep { type: 'scenario'; situation: string; choices: { label: string; outcome: string; correct: boolean }[]; }
export interface BuildItStep { type: 'buildIt'; title: string; instruction: string; slots: { label: string; options: string[]; correct: number }[]; }
export interface ProgressiveCalcStep { type: 'progressiveCalc'; title: string; calcSteps: { prompt: string; options: string[]; correct: number }[]; }
export interface VisualInteractiveStep { type: 'visualInteractive'; description: string; question: string; options: string[]; correct: number; }

export type LessonStep =
  | ConceptStep | TapRevealStep | FillBlankStep | DragSortStep
  | QuizStep | TrueFalseStep | MatchStep | SliderStep
  | ScenarioStep | BuildItStep | ProgressiveCalcStep | VisualInteractiveStep;

export interface ChallengeQuestion {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

export interface PathwayLesson {
  num: number;
  title: string;
  xp: number;
  steps: LessonStep[];
  challenge: ChallengeQuestion[];
}

export type TierLevel = 'easy' | 'intermediate' | 'advanced';

export interface CourseMeta {
  id: string;
  title: string;
  description: string;
  tier: TierLevel;
  color: string;
  icon: string;
  totalLessons: number;
}
