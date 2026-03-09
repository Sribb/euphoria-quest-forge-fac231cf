import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  TrendingUp, Building2, Wallet, BarChart3, Globe,
  Lock, CheckCircle2, Star, ChevronRight, MapPin
} from "lucide-react";

interface Lesson {
  id: string;
  title: string;
  completed: boolean;
  is_locked: boolean;
  pathway?: string | null;
  order_index: number;
  difficulty: string;
}

interface SkillTreeMapProps {
  lessons: Lesson[];
  onSelectPathway: (pathwayId: string) => void;
  onLessonSelect: (lessonId: string) => void;
}

interface SkillNode {
  id: string;
  label: string;
  lessons: Lesson[];
  completed: number;
  total: number;
  unlocked: boolean;
  pathwayId: string;
  tier: "beginner" | "intermediate" | "advanced" | "challenge" | "capstone";
}

const PATHWAY_CONFIG = [
  {
    id: "investing",
    title: "Investing",
    icon: TrendingUp,
    color: "hsl(160 60% 45%)",
    colorClass: "text-emerald-500",
    bgClass: "bg-emerald-500",
    borderClass: "border-emerald-500",
    glowClass: "shadow-emerald-500/30",
    angle: -90, // top
  },
  {
    id: "personal-finance",
    title: "Personal Finance",
    icon: Wallet,
    color: "hsl(270 60% 55%)",
    colorClass: "text-violet-500",
    bgClass: "bg-violet-500",
    borderClass: "border-violet-500",
    glowClass: "shadow-violet-500/30",
    angle: -18, // top-right
  },
  {
    id: "trading",
    title: "Trading",
    icon: BarChart3,
    color: "hsl(25 90% 55%)",
    colorClass: "text-orange-500",
    bgClass: "bg-orange-500",
    borderClass: "border-orange-500",
    glowClass: "shadow-orange-500/30",
    angle: 54, // bottom-right
  },
  {
    id: "alternative-assets",
    title: "Alt Assets",
    icon: Globe,
    color: "hsl(350 70% 55%)",
    colorClass: "text-rose-500",
    bgClass: "bg-rose-500",
    borderClass: "border-rose-500",
    glowClass: "shadow-rose-500/30",
    angle: 126, // bottom-left
  },
  {
    id: "corporate-finance",
    title: "Corp Finance",
    icon: Building2,
    color: "hsl(220 70% 55%)",
    colorClass: "text-blue-500",
    bgClass: "bg-blue-500",
    borderClass: "border-blue-500",
    glowClass: "shadow-blue-500/30",
    angle: 198, // top-left
  },
];

const TIER_LABELS = ["Basics", "Core", "Applied", "Advanced", "Mastery"];

function groupLessonsIntoSkills(lessons: Lesson[], pathwayId: string): SkillNode[] {
  const pathwayLessons = lessons
    .filter(l => l.pathway === pathwayId)
    .sort((a, b) => a.order_index - b.order_index);

  const skills: SkillNode[] = [];
  for (let i = 0; i < pathwayLessons.length; i += 5) {
    const chunk = pathwayLessons.slice(i, i + 5);
    const tierIndex = Math.floor(i / 5);
    const completed = chunk.filter(l => l.completed).length;
    const allPrevCompleted = tierIndex === 0 || (skills[tierIndex - 1]?.completed === skills[tierIndex - 1]?.total);

    skills.push({
      id: `${pathwayId}-tier-${tierIndex}`,
      label: TIER_LABELS[tierIndex] || `Tier ${tierIndex + 1}`,
      lessons: chunk,
      completed,
      total: chunk.length,
      unlocked: tierIndex === 0 || allPrevCompleted,
      pathwayId,
      tier: tierIndex === 0 ? "beginner" : tierIndex === 1 ? "intermediate" : tierIndex === 2 ? "advanced" : tierIndex === 3 ? "challenge" : "capstone",
    });
  }
  return skills;
}

export const SkillTreeMap = ({ lessons, onSelectPathway, onLessonSelect }: SkillTreeMapProps) => {
  const [expandedPathway, setExpandedPathway] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const pathwaySkills = useMemo(() => {
    const map: Record<string, SkillNode[]> = {};
    PATHWAY_CONFIG.forEach(p => {
      map[p.id] = groupLessonsIntoSkills(lessons, p.id);
    });
    return map;
  }, [lessons]);

  const totalCompleted = lessons.filter(l => l.completed).length;
  const totalLessons = lessons.length;
  const overallProgress = totalLessons > 0 ? Math.round((totalCompleted / totalLessons) * 100) : 0;

  // SVG dimensions
  const cx = 400, cy = 380;
  const branchRadius = [120, 190, 250, 300, 345];

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Header */}
      <div className="px-6 pt-8 pb-4 max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <MapPin className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Skill Tree</h1>
            <p className="text-xs text-muted-foreground">
              {totalCompleted}/{totalLessons} skills mastered · {overallProgress}% complete
            </p>
          </div>
        </div>
      </div>

      {/* Tree Map */}
      <div className="relative max-w-4xl mx-auto px-2">
        <div className="overflow-x-auto overflow-y-visible pb-12">
          <svg
            viewBox="0 0 800 760"
            className="w-full max-w-[800px] mx-auto"
            style={{ minWidth: 500 }}
          >
            {/* Background grid pattern */}
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="hsl(240 6% 90%)" strokeWidth="0.5" opacity="0.4" />
              </pattern>
              <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="hsl(262 83% 58%)" stopOpacity="0.15" />
                <stop offset="100%" stopColor="hsl(262 83% 58%)" stopOpacity="0" />
              </radialGradient>
            </defs>
            <rect width="800" height="760" fill="url(#grid)" />
            <circle cx={cx} cy={cy} r="140" fill="url(#centerGlow)" />

            {/* Branch lines */}
            {PATHWAY_CONFIG.map((pathway) => {
              const skills = pathwaySkills[pathway.id] || [];
              const rad = (pathway.angle * Math.PI) / 180;

              return skills.map((skill, tierIdx) => {
                if (tierIdx === 0) return null;
                const r0 = branchRadius[tierIdx - 1];
                const r1 = branchRadius[tierIdx];
                const x0 = cx + Math.cos(rad) * r0;
                const y0 = cy + Math.sin(rad) * r0;
                const x1 = cx + Math.cos(rad) * r1;
                const y1 = cy + Math.sin(rad) * r1;
                const prevCompleted = skills[tierIdx - 1].completed === skills[tierIdx - 1].total;

                return (
                  <line
                    key={`line-${skill.id}`}
                    x1={x0} y1={y0} x2={x1} y2={y1}
                    stroke={prevCompleted ? pathway.color : "hsl(240 6% 85%)"}
                    strokeWidth={prevCompleted ? 3 : 2}
                    strokeDasharray={prevCompleted ? "none" : "6 4"}
                    opacity={prevCompleted ? 0.8 : 0.4}
                  />
                );
              });
            })}

            {/* Lines from center to first tier */}
            {PATHWAY_CONFIG.map((pathway) => {
              const rad = (pathway.angle * Math.PI) / 180;
              const x1 = cx + Math.cos(rad) * branchRadius[0];
              const y1 = cy + Math.sin(rad) * branchRadius[0];
              const stats = pathwaySkills[pathway.id] || [];
              const anyCompleted = stats.length > 0 && stats[0].completed > 0;

              return (
                <line
                  key={`center-line-${pathway.id}`}
                  x1={cx} y1={cy} x2={x1} y2={y1}
                  stroke={anyCompleted ? pathway.color : "hsl(240 6% 85%)"}
                  strokeWidth={anyCompleted ? 3 : 2}
                  strokeDasharray={anyCompleted ? "none" : "6 4"}
                  opacity={anyCompleted ? 0.8 : 0.4}
                />
              );
            })}

            {/* Center node */}
            <g className="cursor-pointer">
              <circle cx={cx} cy={cy} r="42" fill="hsl(262 83% 58%)" opacity="0.15" />
              <circle cx={cx} cy={cy} r="32" fill="hsl(0 0% 100%)" stroke="hsl(262 83% 58%)" strokeWidth="3" />
              <text x={cx} y={cy - 6} textAnchor="middle" className="fill-foreground text-[11px] font-bold">
                Financial
              </text>
              <text x={cx} y={cy + 8} textAnchor="middle" className="fill-foreground text-[11px] font-bold">
                Literacy
              </text>
              <text x={cx} y={cy + 22} textAnchor="middle" className="fill-muted-foreground text-[9px]">
                {overallProgress}%
              </text>
            </g>

            {/* Skill nodes */}
            {PATHWAY_CONFIG.map((pathway) => {
              const skills = pathwaySkills[pathway.id] || [];
              const rad = (pathway.angle * Math.PI) / 180;

              return skills.map((skill, tierIdx) => {
                const r = branchRadius[tierIdx];
                const nodeX = cx + Math.cos(rad) * r;
                const nodeY = cy + Math.sin(rad) * r;
                const isCompleted = skill.completed === skill.total;
                const isLocked = !skill.unlocked;
                const isHovered = hoveredNode === skill.id;
                const progress = skill.total > 0 ? skill.completed / skill.total : 0;
                const nodeRadius = tierIdx === 4 ? 26 : tierIdx === 3 ? 24 : 22;

                return (
                  <g
                    key={skill.id}
                    className={cn("transition-transform", isLocked ? "cursor-not-allowed" : "cursor-pointer")}
                    onMouseEnter={() => !isLocked && setHoveredNode(skill.id)}
                    onMouseLeave={() => setHoveredNode(null)}
                    onClick={() => {
                      if (!isLocked) onSelectPathway(pathway.id);
                    }}
                  >
                    {/* Progress ring */}
                    {!isLocked && !isCompleted && (
                      <circle
                        cx={nodeX} cy={nodeY} r={nodeRadius + 4}
                        fill="none"
                        stroke={pathway.color}
                        strokeWidth="2.5"
                        strokeDasharray={`${progress * 2 * Math.PI * (nodeRadius + 4)} ${2 * Math.PI * (nodeRadius + 4)}`}
                        strokeDashoffset={2 * Math.PI * (nodeRadius + 4) * 0.25}
                        strokeLinecap="round"
                        opacity="0.5"
                      />
                    )}

                    {/* Glow on hover */}
                    {isHovered && (
                      <circle cx={nodeX} cy={nodeY} r={nodeRadius + 8} fill={pathway.color} opacity="0.12" />
                    )}

                    {/* Node circle */}
                    <circle
                      cx={nodeX} cy={nodeY} r={nodeRadius}
                      fill={isCompleted ? pathway.color : isLocked ? "hsl(240 5% 92%)" : "hsl(0 0% 100%)"}
                      stroke={isCompleted ? pathway.color : isLocked ? "hsl(240 6% 85%)" : pathway.color}
                      strokeWidth={isHovered ? 3 : 2}
                      opacity={isLocked ? 0.5 : 1}
                    />

                    {/* Icon/status */}
                    {isCompleted ? (
                      <text x={nodeX} y={nodeY + 5} textAnchor="middle" fontSize="16" fill="white">✓</text>
                    ) : isLocked ? (
                      <text x={nodeX} y={nodeY + 5} textAnchor="middle" fontSize="14" fill="hsl(240 4% 46%)" opacity="0.6">🔒</text>
                    ) : (
                      <text x={nodeX} y={nodeY + 4} textAnchor="middle" fontSize="11" fontWeight="bold" fill="hsl(240 10% 10%)">
                        {skill.completed}/{skill.total}
                      </text>
                    )}

                    {/* Tier label */}
                    <text
                      x={nodeX}
                      y={nodeY + nodeRadius + 14}
                      textAnchor="middle"
                      className={cn("text-[9px] font-semibold", isLocked ? "fill-muted-foreground opacity-50" : "fill-foreground")}
                    >
                      {skill.label}
                    </text>

                    {/* Pathway label on first tier */}
                    {tierIdx === 0 && (
                      <text
                        x={nodeX}
                        y={nodeY + nodeRadius + 26}
                        textAnchor="middle"
                        fontSize="8"
                        className="fill-muted-foreground"
                      >
                        {pathway.title}
                      </text>
                    )}
                  </g>
                );
              });
            })}
          </svg>
        </div>
      </div>

      {/* Pathway detail cards (below the tree) */}
      <div className="px-6 pb-12 max-w-4xl mx-auto">
        <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4">Pathways</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {PATHWAY_CONFIG.map((pathway) => {
            const skills = pathwaySkills[pathway.id] || [];
            const totalDone = skills.reduce((s, sk) => s + sk.completed, 0);
            const totalAll = skills.reduce((s, sk) => s + sk.total, 0);
            const progress = totalAll > 0 ? Math.round((totalDone / totalAll) * 100) : 0;
            const nextSkill = skills.find(s => s.unlocked && s.completed < s.total);

            return (
              <motion.button
                key={pathway.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => onSelectPathway(pathway.id)}
                className="text-left p-4 rounded-2xl border border-border/60 bg-card hover:border-primary/30 hover:shadow-md transition-all group"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center", pathway.bgClass)}>
                    <pathway.icon className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-foreground truncate">{pathway.title}</h3>
                    <p className="text-[10px] text-muted-foreground">
                      {nextSkill ? `Next: ${nextSkill.label}` : progress === 100 ? "Complete! ✨" : "Start learning"}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className={cn("h-full rounded-full transition-all duration-700", pathway.bgClass)} style={{ width: `${progress}%` }} />
                  </div>
                  <span className="text-[10px] font-medium text-muted-foreground">{progress}%</span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
