import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useAIMarket = (userId: string | undefined) => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch active AI market session
  const { data: session, isLoading: sessionLoading } = useQuery({
    queryKey: ['ai-market-session', userId],
    queryFn: async () => {
      if (!userId) return null;
      
      const { data, error } = await supabase
        .from('ai_market_sessions')
        .select('*')
        .eq('user_id', userId)
        .eq('session_status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      if (data) setSessionId(data.id);
      return data;
    },
    enabled: !!userId,
  });

  // Fetch AI stock prices for current session
  const { data: aiPrices, isLoading: pricesLoading } = useQuery({
    queryKey: ['ai-stock-prices', sessionId],
    queryFn: async () => {
      if (!sessionId) return [];
      
      const { data, error } = await supabase
        .from('ai_stock_prices')
        .select('*')
        .eq('session_id', sessionId);

      if (error) throw error;
      return data;
    },
    enabled: !!sessionId,
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  // Fetch AI competitors
  const { data: competitors } = useQuery({
    queryKey: ['ai-competitors', sessionId],
    queryFn: async () => {
      if (!sessionId) return [];
      
      const { data, error } = await supabase
        .from('ai_competitors')
        .select('*')
        .eq('session_id', sessionId)
        .order('capital', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!sessionId,
    refetchInterval: 5000, // Refresh every 5 seconds for real-time updates
  });

  // Fetch active market events
  const { data: activeEvents } = useQuery({
    queryKey: ['ai-market-events', sessionId],
    queryFn: async () => {
      if (!sessionId) return [];
      
      const { data, error } = await supabase
        .from('ai_market_events')
        .select('*')
        .eq('session_id', sessionId)
        .eq('is_active', true)
        .order('triggered_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!sessionId,
    refetchInterval: 10000,
  });

  // Initialize new AI market session
  const initializeSession = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke('ai-market-engine', {
        body: { action: 'initialize' },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      setSessionId(data.session.id);
      queryClient.invalidateQueries({ queryKey: ['ai-market-session'] });
      toast({
        title: 'AI Market Initialized',
        description: 'Your personal AI-driven market is ready!',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Initialization Failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Update market prices (AI simulation tick)
  const updatePrices = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke('ai-market-engine', {
        body: { action: 'update_prices', sessionId },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-stock-prices'] });
      queryClient.invalidateQueries({ queryKey: ['ai-competitors'] });
    },
  });

  // Simulate trade impact
  const simulateTradeImpact = useMutation({
    mutationFn: async ({
      symbol,
      quantity,
      side,
    }: {
      symbol: string;
      quantity: number;
      side: string;
    }) => {
      const { data, error } = await supabase.functions.invoke('ai-market-engine', {
        body: { action: 'simulate_trade_impact', sessionId, symbol, quantity, side },
      });

      if (error) throw error;
      return data;
    },
  });

  // Trigger market event
  const triggerEvent = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke('ai-market-engine', {
        body: { action: 'trigger_event', sessionId },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-market-events'] });
      toast({
        title: 'Market Event!',
        description: 'A new event has occurred in the market.',
      });
    },
  });

  // Set up realtime subscriptions
  useEffect(() => {
    if (!sessionId) return;

    const pricesChannel = supabase
      .channel('ai-prices-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'ai_stock_prices',
          filter: `session_id=eq.${sessionId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['ai-stock-prices'] });
        }
      )
      .subscribe();

    const eventsChannel = supabase
      .channel('ai-events-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'ai_market_events',
          filter: `session_id=eq.${sessionId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['ai-market-events'] });
        }
      )
      .subscribe();

    const competitorsChannel = supabase
      .channel('ai-competitors-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'ai_competitors',
          filter: `session_id=eq.${sessionId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['ai-competitors'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(pricesChannel);
      supabase.removeChannel(eventsChannel);
      supabase.removeChannel(competitorsChannel);
    };
  }, [sessionId, queryClient]);

  return {
    session,
    sessionId,
    aiPrices,
    competitors,
    activeEvents,
    isLoading: sessionLoading || pricesLoading,
    initializeSession,
    updatePrices,
    simulateTradeImpact,
    triggerEvent,
  };
};