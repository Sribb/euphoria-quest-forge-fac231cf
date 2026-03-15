
import type { CourseMeta, PathwayLesson, TierLevel } from './types';

export const COURSES: CourseMeta[] = [
  { id: 'investing-fundamentals', title: 'Investing Fundamentals', description: 'Start your investing journey with stocks, bonds, ETFs, and portfolio building.', tier: 'easy', color: 'emerald', icon: '📈', totalLessons: 50 },
  { id: 'personal-finance', title: 'Personal Finance', description: 'Master budgeting, credit, debt, taxes, and building long-term wealth.', tier: 'easy', color: 'emerald', icon: '💰', totalLessons: 50 },
  { id: 'global-economics', title: 'Global Economics', description: 'Understand supply and demand, inflation, central banks, and global trade.', tier: 'easy', color: 'emerald', icon: '🌍', totalLessons: 50 },
  { id: 'corporate-finance', title: 'Corporate Finance', description: 'Company valuations, capital structure, M&A, and IPOs.', tier: 'intermediate', color: 'amber', icon: '🏢', totalLessons: 50 },
  { id: 'business-strategy', title: 'Business Strategy', description: 'Business models, competitive analysis, fundraising, and scaling.', tier: 'intermediate', color: 'amber', icon: '♟️', totalLessons: 50 },
  { id: 'financial-analytics', title: 'Financial Analytics', description: 'Statistics, financial modeling, DCF, and data-driven decisions.', tier: 'intermediate', color: 'amber', icon: '📊', totalLessons: 50 },
  { id: 'behavioral-finance', title: 'Behavioral Finance', description: 'Cognitive biases, emotional investing, and rational frameworks.', tier: 'intermediate', color: 'amber', icon: '🧠', totalLessons: 50 },
  { id: 'applied-accounting', title: 'Applied Accounting', description: 'Financial statements, journal entries, ratios, and auditing.', tier: 'advanced', color: 'red', icon: '📋', totalLessons: 50 },
  { id: 'quantitative-analysis', title: 'Quantitative Analysis', description: 'Monte Carlo, derivatives pricing, portfolio optimization.', tier: 'advanced', color: 'red', icon: '🔬', totalLessons: 50 },
  { id: 'risk-management', title: 'Risk Management', description: 'VaR, hedging, options strategies, and stress testing.', tier: 'advanced', color: 'red', icon: '🛡️', totalLessons: 50 },
  { id: 'alternative-investments', title: 'Alternative Investments', description: 'Real estate, crypto, commodities, private equity, and hedge funds.', tier: 'advanced', color: 'red', icon: '💎', totalLessons: 50 },
  { id: 'wealth-management', title: 'Wealth Management', description: 'Tax optimization, estate planning, trusts, and retirement.', tier: 'advanced', color: 'red', icon: '👑', totalLessons: 50 },
];

export function getCoursesByTier(tier: TierLevel): CourseMeta[] {
  return COURSES.filter(c => c.tier === tier);
}

export function getCourseById(id: string): CourseMeta | undefined {
  return COURSES.find(c => c.id === id);
}

export async function loadCourseLessons(courseId: string): Promise<PathwayLesson[]> {
  switch (courseId) {
    case 'investing-fundamentals':
      return (await import('./courses/investingFundamentals')).default;
    case 'personal-finance':
      return (await import('./courses/personalFinance')).default;
    case 'global-economics':
      return (await import('./courses/globalEconomics')).default;
    default:
      return [];
  }
}
