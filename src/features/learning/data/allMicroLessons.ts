import { MicroLessonDefinition } from './microLessonTypes';
import { INVESTING_MICRO_LESSONS } from './microInvestingLessons';
import { PF_MICRO_LESSONS } from './microPersonalFinanceLessons';
import { CF_MICRO_LESSONS } from './microCorporateFinanceLessons';
import { TRADING_MICRO_LESSONS } from './microTradingLessons';
import { ALT_MICRO_LESSONS } from './microAlternativeAssetsLessons';

export const ALL_MICRO_LESSONS: Record<string, MicroLessonDefinition[]> = {
  'investing': INVESTING_MICRO_LESSONS,
  'personal-finance': PF_MICRO_LESSONS,
  'corporate-finance': CF_MICRO_LESSONS,
  'trading': TRADING_MICRO_LESSONS,
  'trading-technical-analysis': TRADING_MICRO_LESSONS,
  'alternative-assets': ALT_MICRO_LESSONS,
};

export function getMicroLesson(pathway: string, orderIndex: number): MicroLessonDefinition | undefined {
  const lessons = ALL_MICRO_LESSONS[pathway];
  if (!lessons) return undefined;
  return lessons.find(l => l.orderIndex === orderIndex);
}
