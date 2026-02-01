import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import Toast from 'react-native-toast-message';

export interface Portfolio {
  id: string;
  user_id: string;
  cash_balance: number;
  total_value: number;
  buying_power: number | null;
  unsettled_cash: number | null;
  created_at: string;
  updated_at: string;
}

export interface PortfolioAsset {
  id: string;
  portfolio_id: string;
  asset_name: string;
  asset_type: string;
  quantity: number;
  purchase_price: number;
  current_price: number;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  portfolio_id: string;
  symbol: string;
  side: string;
  order_type: string;
  quantity: number;
  price: number | null;
  stop_price: number | null;
  status: string;
  filled_quantity: number | null;
  average_fill_price: number | null;
  commission: number | null;
  placed_at: string;
  filled_at: string | null;
  canceled_at: string | null;
  rejection_reason: string | null;
  created_at: string;
  updated_at: string;
}

export const usePortfolio = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: portfolio, isLoading: portfolioLoading } = useQuery({
    queryKey: ['portfolio', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      const { data, error } = await supabase
        .from('portfolios')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        // Create portfolio if doesn't exist
        const { data: newPortfolio, error: createError } = await supabase
          .from('portfolios')
          .insert({
            user_id: user.id,
            cash_balance: 100000,
            total_value: 100000,
            buying_power: 100000,
          })
          .select()
          .single();

        if (createError) throw createError;
        return newPortfolio as Portfolio;
      }

      return data as Portfolio;
    },
    enabled: !!user?.id,
  });

  const { data: assets, isLoading: assetsLoading } = useQuery({
    queryKey: ['portfolio-assets', portfolio?.id],
    queryFn: async () => {
      if (!portfolio?.id) return [];

      const { data, error } = await supabase
        .from('portfolio_assets')
        .select('*')
        .eq('portfolio_id', portfolio.id)
        .order('asset_name');

      if (error) throw error;
      return data as PortfolioAsset[];
    },
    enabled: !!portfolio?.id,
  });

  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ['orders', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      return data as Order[];
    },
    enabled: !!user?.id,
  });

  const placeOrderMutation = useMutation({
    mutationFn: async (orderData: {
      symbol: string;
      side: 'buy' | 'sell';
      orderType: 'market' | 'limit' | 'stop';
      quantity: number;
      price?: number;
      stopPrice?: number;
    }) => {
      if (!user?.id || !portfolio?.id) throw new Error('Not authenticated');

      const { data, error } = await supabase.functions.invoke('execute-trade', {
        body: {
          userId: user.id,
          portfolioId: portfolio.id,
          ...orderData,
        },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
      queryClient.invalidateQueries({ queryKey: ['portfolio-assets'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      Toast.show({
        type: 'success',
        text1: 'Order Placed',
        text2: 'Your order has been submitted',
      });
    },
    onError: (error) => {
      Toast.show({
        type: 'error',
        text1: 'Order Failed',
        text2: error.message,
      });
    },
  });

  const calculatePortfolioValue = () => {
    if (!portfolio || !assets) return { total: 0, cash: 0, invested: 0, pnl: 0, pnlPercent: 0 };

    const investedValue = assets.reduce((sum, asset) => sum + asset.current_price * asset.quantity, 0);
    const costBasis = assets.reduce((sum, asset) => sum + asset.purchase_price * asset.quantity, 0);
    const total = portfolio.cash_balance + investedValue;
    const pnl = investedValue - costBasis;
    const pnlPercent = costBasis > 0 ? (pnl / costBasis) * 100 : 0;

    return {
      total,
      cash: portfolio.cash_balance,
      invested: investedValue,
      pnl,
      pnlPercent,
    };
  };

  return {
    portfolio,
    assets,
    orders,
    portfolioLoading,
    assetsLoading,
    ordersLoading,
    placeOrder: placeOrderMutation.mutate,
    isPlacingOrder: placeOrderMutation.isPending,
    calculatePortfolioValue,
    refetch: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
      queryClient.invalidateQueries({ queryKey: ['portfolio-assets'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  };
};
