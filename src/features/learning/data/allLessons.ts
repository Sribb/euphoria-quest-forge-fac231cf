import { LessonDefinition, PathwayLessons } from './lessonTypes';
import { INVESTING_LESSONS } from './investingLessons';
import { PERSONAL_FINANCE_LESSONS } from './personalFinanceLessons';
import { CORPORATE_FINANCE_LESSONS } from './corporateFinanceLessons';
import { TRADING_LESSONS } from './tradingLessons';
import { ALTERNATIVE_ASSETS_LESSONS } from './alternativeAssetsLessons';

export const ALL_PATHWAY_LESSONS: Record<string, LessonDefinition[]> = {
  'investing': INVESTING_LESSONS,
  'personal-finance': PERSONAL_FINANCE_LESSONS,
  'corporate-finance': CORPORATE_FINANCE_LESSONS,
  'trading': TRADING_LESSONS,
  'trading-technical-analysis': TRADING_LESSONS,
  'alternative-assets': ALTERNATIVE_ASSETS_LESSONS,
};

export function getLessonDefinition(pathway: string, orderIndex: number): LessonDefinition | undefined {
  const lessons = ALL_PATHWAY_LESSONS[pathway];
  if (!lessons) return undefined;
  return lessons.find(l => l.orderIndex === orderIndex);
}
