import { useSeasonalThemes } from "@/hooks/useSeasonalThemes";
import { Gift, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export const SeasonalBanner = () => {
  const { activeTheme, hasActiveBonus } = useSeasonalThemes();

  if (!activeTheme) return null;

  return (
    <div 
      className={cn(
        "relative overflow-hidden rounded-2xl p-4 mb-6",
        "bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20",
        "border border-primary/30"
      )}
      style={{
        background: activeTheme.color_scheme?.background 
          ? `linear-gradient(135deg, ${activeTheme.color_scheme.primary}20, ${activeTheme.color_scheme.secondary}20)`
          : undefined
      }}
    >
      {/* Animated particles effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 6 }).map((_, i) => (
          <Sparkles
            key={i}
            className="absolute text-primary/30 animate-pulse"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 2) * 40}%`,
              animationDelay: `${i * 0.3}s`,
              width: 16,
              height: 16,
            }}
          />
        ))}
      </div>

      <div className="relative flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
          <Gift className="w-6 h-6 text-primary" />
        </div>
        
        <div className="flex-1">
          <h3 className="font-bold text-foreground flex items-center gap-2">
            {activeTheme.name}
            {hasActiveBonus && (
              <span className="text-xs px-2 py-0.5 bg-primary/20 text-primary rounded-full">
                Bonus Active!
              </span>
            )}
          </h3>
          {activeTheme.description && (
            <p className="text-sm text-muted-foreground">{activeTheme.description}</p>
          )}
        </div>

        {hasActiveBonus && activeTheme.bonus_rewards && (
          <div className="text-right">
            {activeTheme.bonus_rewards.xp_multiplier && activeTheme.bonus_rewards.xp_multiplier > 1 && (
              <p className="text-sm font-semibold text-primary">
                {activeTheme.bonus_rewards.xp_multiplier}x XP
              </p>
            )}
            {activeTheme.bonus_rewards.coins_multiplier && activeTheme.bonus_rewards.coins_multiplier > 1 && (
              <p className="text-sm font-semibold text-yellow-500">
                {activeTheme.bonus_rewards.coins_multiplier}x Coins
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
