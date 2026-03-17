
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

// ─── New Template Step Types ───
export interface HookOpenerStep {
  type: 'hookOpener';
  title: string;
  fact: string;
  outcome: string;
  visualDescription: string;
}

export interface StakesCardStep {
  type: 'stakesCard';
  without: { label: string; detail: string };
  with: { label: string; detail: string };
}

export interface TeachingSlideStep {
  type: 'teachingSlide';
  sectionLabel: string;
  title: string;
  paragraphs: string[];
  highlightedTerms: { term: string; definition: string; example: string }[];
  diagramDescription: string;
  realExample?: { company: string; metric: string; outcome: string; explanation: string };
}

export interface MicroCheckStep {
  type: 'microCheck';
  question: string;
  options: string[];
  correct: number;
  explanationCorrect: string;
  explanationWrong: string;
}

export interface InteractiveGraphStep {
  type: 'interactiveGraph';
  sectionLabel: string;
  title: string;
  graphType: 'exponential' | 'comparison' | 'timeline' | 'pie';
  description: string;
  paragraphs: string[];
  highlightedTerms: { term: string; definition: string; example: string }[];
  insights: string[];
  sliders?: { label: string; min: number; max: number; default: number; unit: string }[];
  realExample?: { company: string; metric: string; outcome: string; explanation: string };
}

export interface CaseStudyStep {
  type: 'caseStudy';
  title: string;
  events: { date: string; event: string; context: string }[];
  lesson: string;
}

export interface MisconceptionsStep {
  type: 'misconceptions';
  title: string;
  subtitle: string;
  items: { myth: string; truth: string; explanation: string }[];
}

export interface KeyTermsCardsStep {
  type: 'keyTermsCards';
  terms: { term: string; definition: string; example: string; sentence: string }[];
}

export interface SimulationFinaleStep {
  type: 'simulationFinale';
  title: string;
  setup: string;
  decisions: {
    prompt: string;
    options: { label: string; consequence: string; score: number }[];
  }[];
  optimalOutcome: string;
  principle: string;
}

export interface SummaryCardsStep {
  type: 'summaryCards';
  lessonTitle: string;
  cards: { takeaway: string; detail: string }[];
}

export interface WhatsNextStep {
  type: 'whatsNext';
  currentLessonTitle: string;
  nextTitle: string;
  preview: string;
  estimatedTime: number;
}

export type LessonStep =
  | ConceptStep | TapRevealStep | FillBlankStep | DragSortStep
  | QuizStep | TrueFalseStep | MatchStep | SliderStep
  | ScenarioStep | BuildItStep | ProgressiveCalcStep | VisualInteractiveStep
  | HookOpenerStep | StakesCardStep | TeachingSlideStep | MicroCheckStep
  | InteractiveGraphStep | CaseStudyStep | MisconceptionsStep | KeyTermsCardsStep
  | SimulationFinaleStep | SummaryCardsStep | WhatsNextStep;

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
