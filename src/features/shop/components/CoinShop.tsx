import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Coins, ShoppingBag, Zap, Lock, CheckCircle2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCoinShop } from "../hooks/useCoinShop";
import { SHOP_ITEMS, SHOP_CATEGORIES, ShopCategory } from "../data/shopItems";
import { motion, AnimatePresence } from "framer-motion";
import { EuphoriaIcon } from "@/components/icons/EuphoriaIcon";

const RARITY_STYLES = {
  common: { border: "border-slate-400/30", bg: "from-slate-500/10 to-slate-600/10", text: "text-slate-400", label: "Common" },
  uncommon: { border: "border-emerald-400/30", bg: "from-emerald-500/10 to-green-600/10", text: "text-emerald-400", label: "Uncommon" },
  rare: { border: "border-blue-400/30", bg: "from-blue-500/10 to-cyan-600/10", text: "text-blue-400", label: "Rare" },
  epic: { border: "border-purple-400/30", bg: "from-purple-500/10 to-pink-600/10", text: "text-purple-400", label: "Epic" },
  legendary: { border: "border-amber-400/30", bg: "from-amber-500/10 to-orange-600/10", text: "text-amber-400", label: "Legendary" },
};

interface CoinShopProps {
  onNavigate?: (tab: string) => void;
}

export const CoinShop = ({ onNavigate }: CoinShopProps) => {
  const { coins, purchase, isPurchasing, ownedItemIds, hasDoubleXP, hintCount, activePowerups } = useCoinShop();
  const [activeCategory, setActiveCategory] = useState<ShopCategory>("power-up");
  const [purchasingId, setPurchasingId] = useState<string | null>(null);

  const filteredItems = SHOP_ITEMS.filter(item => item.category === activeCategory);

  const handlePurchase = async (item: typeof SHOP_ITEMS[0]) => {
    setPurchasingId(item.id);
    try {
      await purchase(item);
    } finally {
      setPurchasingId(null);
    }
  };

  const isOwned = (item: typeof SHOP_ITEMS[0]) => {
    // Power-ups can be purchased multiple times
    if (item.category === "power-up") return false;
    return ownedItemIds.has(item.id);
  };

  return (
    <div className="space-y-6 pb-24 pt-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fade-in">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center shadow-glow animate-pulse">
            <ShoppingBag className="w-5 h-5 md:w-6 md:h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Euphorium Shop</h1>
            <p className="text-sm text-muted-foreground">Spend your hard-earned coins on upgrades</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded-full">
          <Coins className="w-5 h-5 text-amber-400" />
          <span className="text-lg font-bold text-amber-400">{coins.toLocaleString()}</span>
        </div>
      </div>

      {/* Active Power-ups Banner */}
      {(hasDoubleXP || hintCount > 0) && (
        <Card className="p-4 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20 animate-fade-in">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-primary" />
            <h3 className="font-bold text-sm">Active Power-Ups</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {hasDoubleXP && (
              <Badge className="bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                <EuphoriaIcon name="lightning" size={14} /> Double XP Active
              </Badge>
            )}
            {hintCount > 0 && (
              <Badge className="bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center gap-1">
                <EuphoriaIcon name="sparkle" size={14} /> {hintCount} Hints Available
              </Badge>
            )}
            {activePowerups.filter(p => p.powerup_type === "double_xp").map(p => {
              const timeLeft = Math.max(0, Math.floor((new Date(p.expires_at).getTime() - Date.now()) / 60000));
              return (
                <Badge key={p.id} variant="outline" className="text-muted-foreground">
                  {timeLeft}m remaining
                </Badge>
              );
            })}
          </div>
        </Card>
      )}

      {/* How to Earn */}
      <Card className="p-4 bg-gradient-to-r from-emerald-500/5 to-emerald-500/10 border-emerald-500/20 animate-fade-in">
        <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          How to Earn Euphorium
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: "open-book", label: "Complete Lessons", amount: "+50-100" },
            { icon: "flame", label: "Daily Streaks", amount: "+25" },
            { icon: "controller", label: "Win Games", amount: "+10-50" },
            { icon: "shop-calendar", label: "Daily Challenges", amount: "+30" },
          ].map(item => (
            <div key={item.label} className="text-center p-3 bg-background/50 rounded-lg">
              <EuphoriaIcon name={item.icon} size={28} className="mx-auto" />
              <p className="text-xs text-muted-foreground mt-1">{item.label}</p>
              <p className="text-sm font-bold text-emerald-400">{item.amount}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Category Tabs */}
      <ScrollArea className="w-full">
        <div className="flex gap-2 pb-2">
          {SHOP_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all border flex items-center gap-2",
                activeCategory === cat.id
                  ? "bg-primary text-primary-foreground border-primary shadow-md"
                  : "bg-muted/50 text-muted-foreground border-border hover:bg-muted"
              )}
            >
              <EuphoriaIcon name={cat.icon} size={16} />
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </ScrollArea>

      {/* Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item, i) => {
            const rarity = RARITY_STYLES[item.rarity];
            const owned = isOwned(item);
            const canAfford = coins >= item.price;
            const buying = purchasingId === item.id;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card
                  className={cn(
                    "relative p-5 transition-all duration-300 overflow-hidden group",
                    "hover:-translate-y-1 hover:shadow-lg",
                    `bg-gradient-to-br ${rarity.bg} ${rarity.border} border`,
                    owned && "opacity-60"
                  )}
                >
                  {/* Rarity glow */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute w-24 h-24 bg-white/5 rounded-full blur-2xl -top-6 -right-6 group-hover:bg-white/10 transition-all" />
                  </div>

                  <div className="relative z-10">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <span className="group-hover:scale-110 transition-transform inline-block">
                        <EuphoriaIcon name={item.icon} size={40} />
                      </span>
                      <Badge variant="outline" className={cn("text-[10px]", rarity.border, rarity.text)}>
                        {rarity.label}
                      </Badge>
                    </div>

                    {/* Name & Description */}
                    <h3 className="font-bold text-base mb-1">{item.name}</h3>
                    <p className="text-xs text-muted-foreground mb-4 line-clamp-2">{item.description}</p>

                    {/* Price & Buy */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Coins className="w-4 h-4 text-amber-400" />
                        <span className="font-bold text-amber-400">{item.price.toLocaleString()}</span>
                      </div>

                      {owned ? (
                        <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          <CheckCircle2 className="w-3 h-3 mr-1" /> Owned
                        </Badge>
                      ) : (
                        <Button
                          size="sm"
                          disabled={!canAfford || buying}
                          onClick={() => handlePurchase(item)}
                          className={cn(
                            "text-xs",
                            canAfford
                              ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
                              : ""
                          )}
                          variant={canAfford ? "default" : "outline"}
                        >
                          {buying ? (
                            "Buying..."
                          ) : !canAfford ? (
                            <><Lock className="w-3 h-3 mr-1" /> Need {(item.price - coins).toLocaleString()} more</>
                          ) : (
                            "Buy"
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};
