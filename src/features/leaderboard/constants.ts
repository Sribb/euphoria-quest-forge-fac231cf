export const DIVISIONS = [
  { id: "bronze", label: "Bronze", emoji: "🥉", color: "text-amber-700", bg: "bg-amber-700/10", border: "border-amber-700/30", minXP: 0 },
  { id: "silver", label: "Silver", emoji: "🥈", color: "text-slate-400", bg: "bg-slate-400/10", border: "border-slate-400/30", minXP: 0 },
  { id: "gold", label: "Gold", emoji: "🥇", color: "text-yellow-500", bg: "bg-yellow-500/10", border: "border-yellow-500/30", minXP: 0 },
  { id: "diamond", label: "Diamond", emoji: "💎", color: "text-cyan-400", bg: "bg-cyan-400/10", border: "border-cyan-400/30", minXP: 0 },
] as const;

export type DivisionId = (typeof DIVISIONS)[number]["id"];

export const LEAGUE_SIZE = 30;
export const PROMOTION_ZONE = 10; // Top 10 get promoted
export const DEMOTION_ZONE = 5; // Bottom 5 get demoted

export function getDivisionMeta(divisionId: string) {
  return DIVISIONS.find((d) => d.id === divisionId) || DIVISIONS[0];
}

export function getWeekStart(date: Date = new Date()): string {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d.toISOString().split("T")[0];
}

export function getWeekEnd(): Date {
  const now = new Date();
  const day = now.getDay();
  const daysUntilSunday = day === 0 ? 0 : 7 - day;
  const end = new Date(now);
  end.setDate(end.getDate() + daysUntilSunday);
  end.setHours(23, 59, 59, 999);
  return end;
}

export function anonymizeName(name: string | null, isCurrentUser: boolean): string {
  if (isCurrentUser) return "You";
  if (!name) return "Anonymous Trader";
  // Show first 2 chars + asterisks
  if (name.length <= 2) return name + "***";
  return name.substring(0, 2) + "***";
}
