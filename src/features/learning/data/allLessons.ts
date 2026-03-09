import { LessonDefinition, PathwayLessons } from './lessonTypes';
import { INVESTING_LESSONS } from './investingLessons';
import { PERSONAL_FINANCE_LESSONS } from './personalFinanceLessons';
import { CORPORATE_FINANCE_LESSONS } from './corporateFinanceLessons';
import { TRADING_LESSONS } from './tradingLessons';
import { ALTERNATIVE_ASSETS_LESSONS } from './alternativeAssetsLessons';
import { ECONOMICS_LESSONS } from './economicsLessons';
import { BUSINESS_LESSONS } from './businessLessons';
import { MARKETING_LESSONS } from './marketingLessons';

export const ALL_PATHWAY_LESSONS: Record<string, LessonDefinition[]> = {
  'investing': INVESTING_LESSONS,
  'personal-finance': PERSONAL_FINANCE_LESSONS,
  'corporate-finance': CORPORATE_FINANCE_LESSONS,
  'trading': TRADING_LESSONS,
  'trading-technical-analysis': TRADING_LESSONS,
  'alternative-assets': ALTERNATIVE_ASSETS_LESSONS,
  'economics': ECONOMICS_LESSONS,
  'business': BUSINESS_LESSONS,
  'marketing': MARKETING_LESSONS,
};

export function getLessonDefinition(pathway: string, orderIndex: number): LessonDefinition | undefined {
  const lessons = ALL_PATHWAY_LESSONS[pathway];
  if (!lessons) return undefined;
  return lessons.find(l => l.orderIndex === orderIndex);
}
