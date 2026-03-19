import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const FREE_HINTS = 2;
const RESET_HOURS = 2;

export function useHints() {
  const { user } = useAuth();
  const [freeHints, setFreeHints] = useState(FREE_HINTS);
  const [bonusHints, setBonusHints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [lastResetAt, setLastResetAt] = useState<string | null>(null);

  const loadHints = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);

    // Check free hints reset
    const storageKey = `hints_reset_${user.id}`;
    const stored = localStorage.getItem(storageKey);
    const now = Date.now();

    if (stored) {
      const resetTime = parseInt(stored, 10);
      if (now - resetTime >= RESET_HOURS * 60 * 60 * 1000) {
        // Reset free hints
        setFreeHints(FREE_HINTS);
        localStorage.setItem(storageKey, String(now));
        setLastResetAt(new Date(now).toISOString());
      } else {
        // Load saved free hint count
        const countKey = `hints_free_${user.id}`;
        const saved = localStorage.getItem(countKey);
        setFreeHints(saved !== null ? parseInt(saved, 10) : FREE_HINTS);
        setLastResetAt(new Date(resetTime).toISOString());
      }
    } else {
      localStorage.setItem(storageKey, String(now));
      setFreeHints(FREE_HINTS);
      setLastResetAt(new Date(now).toISOString());
    }

    // Load purchased bonus hints from inventory
    const { data } = await supabase
      .from("user_inventory")
      .select("quantity")
      .eq("user_id", user.id)
      .eq("item_type", "hint")
      .is("used_at", null);

    const total = (data || []).reduce((s, r) => s + r.quantity, 0);
    setBonusHints(total);
    setLoading(false);
  }, [user?.id]);

  useEffect(() => { loadHints(); }, [loadHints]);

  const totalHints = freeHints + bonusHints;

  const useHint = useCallback(async (): Promise<boolean> => {
    if (!user?.id || totalHints <= 0) return false;

    if (freeHints > 0) {
      const newFree = freeHints - 1;
      setFreeHints(newFree);
      localStorage.setItem(`hints_free_${user.id}`, String(newFree));
      return true;
    }

    // Use bonus hint from inventory
    const { data } = await supabase
      .from("user_inventory")
      .select("id, quantity")
      .eq("user_id", user.id)
      .eq("item_type", "hint")
      .is("used_at", null)
      .gt("quantity", 0)
      .order("created_at", { ascending: true })
      .limit(1)
      .single();

    if (!data) return false;

    if (data.quantity <= 1) {
      await supabase.from("user_inventory").update({ used_at: new Date().toISOString(), quantity: 0 }).eq("id", data.id);
    } else {
      await supabase.from("user_inventory").update({ quantity: data.quantity - 1 }).eq("id", data.id);
    }

    setBonusHints(b => b - 1);
    return true;
  }, [user?.id, freeHints, totalHints]);

  const getResetTimeRemaining = useCallback(() => {
    if (!user?.id) return null;
    const stored = localStorage.getItem(`hints_reset_${user.id}`);
    if (!stored) return null;
    const resetTime = parseInt(stored, 10) + RESET_HOURS * 60 * 60 * 1000;
    const remaining = resetTime - Date.now();
    if (remaining <= 0) return null;
    const mins = Math.ceil(remaining / 60000);
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  }, [user?.id]);

  return {
    hints: totalHints,
    freeHints,
    bonusHints,
    loading,
    useHint,
    refresh: loadHints,
    getResetTimeRemaining,
  };
}
