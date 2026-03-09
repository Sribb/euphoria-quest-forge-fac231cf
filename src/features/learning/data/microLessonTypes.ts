// Micro-lesson types: Duolingo-style 5-8 screen lessons, max 2 sentences per screen

export interface MicroScreenBase {
  id: string;
  emoji?: string;
}

/** Pure concept screen: 1-2 sentences + optional visual */
export interface ConceptScreen extends MicroScreenBase {
  type: 'concept';
  title: string;
  body: string; // Max 2 sentences
  visual?: { type: 'comparison'; left: { label: string; value: string }; right: { label: string; value: string } }
    | { type: 'highlight'; items: Array<{ emoji: string; text: string }> }
    | { type: 'stat'; value: string; label: string };
}

/** Tap-to-reveal: show question, tap cards to reveal answers */
export interface TapRevealScreen extends MicroScreenBase {
  type: 'tap-reveal';
  title: string;
  body?: string;
  cards: Array<{ front: string; back: string; emoji?: string }>;
}

/** True/False quick fire */
export interface TrueFalseScreen extends MicroScreenBase {
  type: 'true-false';
  title?: string;
  statement: string;
  isTrue: boolean;
  explanation: string;
}

/** Fill-in-the-blank */
export interface FillBlankScreen extends MicroScreenBase {
  type: 'fill-blank';
  title?: string;
  sentence: string; // Use "___" for blanks
  options: string[];
  correctIndex: number;
  explanation: string;
}

/** Multiple choice quiz (single question) */
export interface QuizScreen extends MicroScreenBase {
  type: 'quiz';
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

/** Drag-sort mini (3-4 items max for speed) */
export interface SortScreen extends MicroScreenBase {
  type: 'sort';
  title: string;
  description?: string;
  items: Array<{ id: string; label: string }>;
  correctOrder: string[];
}

/** Mini slider simulator */
export interface SliderScreen extends MicroScreenBase {
  type: 'slider';
  title: string;
  body?: string;
  sliders: Array<{
    id: string; label: string; min: number; max: number;
    step: number; defaultValue: number; unit?: string;
  }>;
  calculateResult: (values: Record<string, number>) => {
    primary: string;
    secondary?: string;
    insight?: string;
  };
}

/** Match pairs (connect left to right) */
export interface MatchScreen extends MicroScreenBase {
  type: 'match';
  title: string;
  pairs: Array<{ left: string; right: string }>;
}

/** Prediction screen: pose a question, let students commit to an answer before revealing */
export interface PredictionScreen extends MicroScreenBase {
  type: 'prediction';
  question: string;
  context?: string; // Optional setup/framing
  options: string[];
  correctIndex: number;
  revealTitle: string; // Shown after they pick
  revealBody: string; // The "aha" explanation
  revealVisual?: { type: 'stat'; value: string; label: string }
    | { type: 'comparison'; left: { label: string; value: string }; right: { label: string; value: string } };
}

/** Reveal / "aha moment" screen: show a surprising insight with animation */
export interface RevealScreen extends MicroScreenBase {
  type: 'reveal';
  setup: string; // What the student might expect
  reveal: string; // The surprising truth
  emoji?: string;
  principle: string; // The underlying principle
  visual?: { type: 'stat'; value: string; label: string }
    | { type: 'comparison'; left: { label: string; value: string }; right: { label: string; value: string } };
}

/** Summary / takeaway screen */
export interface SummaryScreen extends MicroScreenBase {
  type: 'summary';
  title?: string;
  takeaways: string[]; // 3-4 bullet points
  quote?: { text: string; author: string };
}

export type MicroScreen =
  | ConceptScreen
  | TapRevealScreen
  | TrueFalseScreen
  | FillBlankScreen
  | QuizScreen
  | SortScreen
  | SliderScreen
  | MatchScreen
  | PredictionScreen
  | RevealScreen
  | SummaryScreen;

export interface MicroLessonDefinition {
  orderIndex: number;
  title: string;
  screens: MicroScreen[]; // 5-8 screens
}
