
import type {
  ConceptStep, TapRevealStep, FillBlankStep, DragSortStep,
  QuizStep, TrueFalseStep, MatchStep, SliderStep,
  ScenarioStep, BuildItStep, ProgressiveCalcStep, VisualInteractiveStep,
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
