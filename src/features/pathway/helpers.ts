
import type {
  ConceptStep, TapRevealStep, FillBlankStep, DragSortStep,
  QuizStep, TrueFalseStep, MatchStep, SliderStep,
  ScenarioStep, BuildItStep, ProgressiveCalcStep, VisualInteractiveStep,
  HookOpenerStep, StakesCardStep, TeachingSlideStep, MicroCheckStep,
  InteractiveGraphStep, CaseStudyStep, MisconceptionsStep, KeyTermsCardsStep,
  SimulationFinaleStep, SummaryCardsStep, WhatsNextStep,
  ChallengeQuestion, PathwayLesson, LessonStep,
} from './types';

export const c = (emoji: string, title: string, body: string): ConceptStep => ({ type: 'concept', emoji, title, body });
export const tr = (title: string, cards: [string, string][]): TapRevealStep => ({ type: 'tapReveal', title, cards });
export const fb = (sentence: string, options: string[], correct: number): FillBlankStep => ({ type: 'fillBlank', sentence, options, correct });
export const ds = (prompt: string, items: string[]): DragSortStep => ({ type: 'dragSort', prompt, items });
export const q = (question: string, options: string[], correct: number, explanation: string): QuizStep => ({ type: 'quiz', question, options, correct, explanation });
export const tf = (statements: { s: string; a: boolean }[]): TrueFalseStep => ({ type: 'trueFalse', statements });
export const m = (title: string, pairs: [string, string][]): MatchStep => ({ type: 'match', title, pairs });
export const sl = (question: string, min: number, max: number, correct: number, unit: string): SliderStep => ({ type: 'slider', question, min, max, correct, unit });
export const sc = (situation: string, choices: { label: string; outcome: string; correct: boolean }[]): ScenarioStep => ({ type: 'scenario', situation, choices });
export const bi = (title: string, instruction: string, slots: { label: string; options: string[]; correct: number }[]): BuildItStep => ({ type: 'buildIt', title, instruction, slots });
export const pc = (title: string, calcSteps: { prompt: string; options: string[]; correct: number }[]): ProgressiveCalcStep => ({ type: 'progressiveCalc', title, calcSteps });
export const vi = (description: string, question: string, options: string[], correct: number): VisualInteractiveStep => ({ type: 'visualInteractive', description, question, options, correct });
export const cq = (question: string, options: string[], correct: number, explanation: string): ChallengeQuestion => ({ question, options, correct, explanation });
export const L = (num: number, title: string, xp: number, steps: LessonStep[], challenge: ChallengeQuestion[]): PathwayLesson => ({ num, title, xp, steps, challenge });

// ─── New Template Helpers ───
export const hookOpener = (title: string, fact: string, outcome: string, visualDescription: string): HookOpenerStep => ({
  type: 'hookOpener', title, fact, outcome, visualDescription
});

export const stakesCard = (
  without: { label: string; detail: string },
  with_: { label: string; detail: string }
): StakesCardStep => ({
  type: 'stakesCard', without, with: with_
});

export const teachingSlide = (
  sectionLabel: string, title: string,
  paragraphs: string[],
  highlightedTerms: { term: string; definition: string; example: string }[],
  diagramDescription: string,
  realExample?: { company: string; metric: string; outcome: string; explanation: string }
): TeachingSlideStep => ({
  type: 'teachingSlide', sectionLabel, title, paragraphs, highlightedTerms, diagramDescription, realExample
});

export const microCheck = (
  question: string, options: string[], correct: number,
  explanationCorrect: string, explanationWrong: string
): MicroCheckStep => ({
  type: 'microCheck', question, options, correct, explanationCorrect, explanationWrong
});

export const interactiveGraph = (
  sectionLabel: string, title: string,
  graphType: 'exponential' | 'comparison' | 'timeline' | 'pie',
  description: string, paragraphs: string[],
  highlightedTerms: { term: string; definition: string; example: string }[],
  insights: string[],
  sliders?: { label: string; min: number; max: number; default: number; unit: string }[],
  realExample?: { company: string; metric: string; outcome: string; explanation: string }
): InteractiveGraphStep => ({
  type: 'interactiveGraph', sectionLabel, title, graphType, description, paragraphs, highlightedTerms, insights, sliders, realExample
});

export const caseStudy = (
  title: string,
  events: { date: string; event: string; context: string }[],
  lesson: string
): CaseStudyStep => ({
  type: 'caseStudy', title, events, lesson
});

export const misconceptions = (
  title: string, subtitle: string,
  items: { myth: string; truth: string; explanation: string }[]
): MisconceptionsStep => ({
  type: 'misconceptions', title, subtitle, items
});

export const keyTermsCards = (
  terms: { term: string; definition: string; example: string; sentence: string }[]
): KeyTermsCardsStep => ({
  type: 'keyTermsCards', terms
});

export const simulationFinale = (
  title: string, setup: string,
  decisions: { prompt: string; options: { label: string; consequence: string; score: number }[] }[],
  optimalOutcome: string, principle: string
): SimulationFinaleStep => ({
  type: 'simulationFinale', title, setup, decisions, optimalOutcome, principle
});

export const summaryCards = (
  lessonTitle: string,
  cards: { takeaway: string; detail: string }[]
): SummaryCardsStep => ({
  type: 'summaryCards', lessonTitle, cards
});

export const whatsNext = (
  currentLessonTitle: string, nextTitle: string,
  preview: string, estimatedTime: number
): WhatsNextStep => ({
  type: 'whatsNext', currentLessonTitle, nextTitle, preview, estimatedTime
});
