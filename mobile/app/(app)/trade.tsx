import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  TextInput,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

import { usePortfolio } from '@/hooks/usePortfolio';
import { marketService, StockQuote } from '@/lib/marketService';
import { Button, Card, Badge, LoadingScreen, Input } from '@/components/ui';
import { Colors, FontSizes, Spacing, BorderRadius } from '@/constants/theme';

export default function TradeScreen() {
  const colors = Colors.dark;
  const { portfolio, assets, orders, calculatePortfolioValue, placeOrder, isPlacingOrder, portfolioLoading } = usePortfolio();

  const [refreshing, setRefreshing] = useState(false);
  const [quotes, setQuotes] = useState<Map<string, StockQuote>>(new Map());
  const [activeTab, setActiveTab] = useState<'portfolio' | 'watchlist' | 'orders'>('portfolio');
  const [showTradeModal, setShowTradeModal] = useState(false);
  const [selectedSymbol, setSelectedSymbol] = useState('');
  const [quantity, setQuantity] = useState('');
  const [orderSide, setOrderSide] = useState<'buy' | 'sell'>('buy');

  const portfolioValue = calculatePortfolioValue();
  const popularSymbols = marketService.getPopularSymbols();

  useEffect(() => {
    loadQuotes();
  }, []);

  const loadQuotes = async () => {
    const symbols = popularSymbols.slice(0, 8);
    const quotesMap = await marketService.getMultipleQuotes(symbols);
    setQuotes(quotesMap);
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await loadQuotes();
    setRefreshing(false);
  }, []);

  const handleTrade = async () => {
    if (!selectedSymbol || !quantity) return;

    const quote = quotes.get(selectedSymbol);
    if (!quote) return;

    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    placeOrder({
      symbol: selectedSymbol,
      side: orderSide,
      orderType: 'market',
      quantity: parseInt(quantity),
      price: quote.price,
    });

    setShowTradeModal(false);
    setSelectedSymbol('');
    setQuantity('');
  };

  const openTradeModal = (symbol: string, side: 'buy' | 'sell') => {
    setSelectedSymbol(symbol);
    setOrderSide(side);
    setShowTradeModal(true);
  };

  if (portfolioLoading) {
    return <LoadingScreen message="Loading portfolio..." />;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      {/* Portfolio Summary */}
      <LinearGradient
        colors={[colors.primary, '#6366f1']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.portfolioCard}
      >
        <Text style={styles.portfolioLabel}>Total Portfolio Value</Text>
        <Text style={styles.portfolioValue}>
          ${portfolioValue.total.toLocaleString(undefined, { maximumFractionDigits: 2 })}
        </Text>
        <View style={styles.portfolioStats}>
          <View style={styles.portfolioStat}>
            <Text style={styles.portfolioStatLabel}>Cash</Text>
            <Text style={styles.portfolioStatValue}>
              ${portfolioValue.cash.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </Text>
          </View>
          <View style={styles.portfolioStat}>
            <Text style={styles.portfolioStatLabel}>Invested</Text>
            <Text style={styles.portfolioStatValue}>
              ${portfolioValue.invested.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </Text>
          </View>
          <View style={styles.portfolioStat}>
            <Text style={styles.portfolioStatLabel}>P&L</Text>
            <Text
              style={[
                styles.portfolioStatValue,
                { color: portfolioValue.pnl >= 0 ? '#22c55e' : '#ef4444' },
              ]}
            >
              {portfolioValue.pnl >= 0 ? '+' : ''}${portfolioValue.pnl.toFixed(2)}
            </Text>
          </View>
        </View>
      </LinearGradient>

      {/* Tabs */}
      <View style={[styles.tabs, { borderBottomColor: colors.border }]}>
        {(['portfolio', 'watchlist', 'orders'] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tab,
              activeTab === tab && { borderBottomColor: colors.primary, borderBottomWidth: 2 },
            ]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                { color: activeTab === tab ? colors.primary : colors.mutedForeground },
              ]}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
      >
        {activeTab === 'portfolio' && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Your Holdings</Text>
            {assets && assets.length > 0 ? (
              assets.map((asset) => {
                const quote = quotes.get(asset.asset_name);
                const currentValue = asset.quantity * (quote?.price || asset.current_price);
                const costBasis = asset.quantity * asset.purchase_price;
                const pnl = currentValue - costBasis;
                const pnlPercent = (pnl / costBasis) * 100;

                return (
                  <TouchableOpacity
                    key={asset.id}
                    onPress={() => router.push(`/(app)/stock/${asset.asset_name}`)}
                    activeOpacity={0.7}
                  >
                    <Card style={styles.holdingCard}>
                      <View style={styles.holdingHeader}>
                        <View>
                          <Text style={[styles.holdingSymbol, { color: colors.foreground }]}>
                            {asset.asset_name}
                          </Text>
                          <Text style={[styles.holdingQty, { color: colors.mutedForeground }]}>
                            {asset.quantity} shares
                          </Text>
                        </View>
                        <View style={styles.holdingValues}>
                          <Text style={[styles.holdingValue, { color: colors.foreground }]}>
                            ${currentValue.toFixed(2)}
                          </Text>
                          <Text
                            style={[
                              styles.holdingPnl,
                              { color: pnl >= 0 ? colors.success : colors.destructive },
                            ]}
                          >
                            {pnl >= 0 ? '+' : ''}${pnl.toFixed(2)} ({pnlPercent.toFixed(1)}%)
                          </Text>
                        </View>
                      </View>
                      <View style={styles.holdingActions}>
                        <Button
                          variant="outline"
                          size="sm"
                          onPress={() => openTradeModal(asset.asset_name, 'buy')}
                        >
                          Buy More
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onPress={() => openTradeModal(asset.asset_name, 'sell')}
                        >
                          Sell
                        </Button>
                      </View>
                    </Card>
                  </TouchableOpacity>
                );
              })
            ) : (
              <Card style={styles.emptyCard}>
                <Ionicons name="wallet-outline" size={48} color={colors.mutedForeground} />
                <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
                  No holdings yet. Start by buying some stocks!
                </Text>
              </Card>
            )}
          </View>
        )}

        {activeTab === 'watchlist' && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Market Watch</Text>
            {Array.from(quotes.entries()).map(([symbol, quote]) => (
              <TouchableOpacity
                key={symbol}
                onPress={() => router.push(`/(app)/stock/${symbol}`)}
                activeOpacity={0.7}
              >
                <Card style={styles.quoteCard}>
                  <View style={styles.quoteInfo}>
                    <Text style={[styles.quoteSymbol, { color: colors.foreground }]}>{symbol}</Text>
                    <Text style={[styles.quotePrice, { color: colors.foreground }]}>
                      ${quote.price.toFixed(2)}
                    </Text>
                  </View>
                  <View style={styles.quoteChange}>
                    <Badge variant={quote.change >= 0 ? 'success' : 'destructive'}>
                      {quote.change >= 0 ? '+' : ''}
                      {quote.changePercent.toFixed(2)}%
                    </Badge>
                    <Button
                      variant="primary"
                      size="sm"
                      onPress={() => openTradeModal(symbol, 'buy')}
                    >
                      Trade
                    </Button>
                  </View>
                </Card>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {activeTab === 'orders' && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Order History</Text>
            {orders && orders.length > 0 ? (
              orders.slice(0, 20).map((order) => (
                <Card key={order.id} style={styles.orderCard}>
                  <View style={styles.orderHeader}>
                    <View>
                      <Text style={[styles.orderSymbol, { color: colors.foreground }]}>
                        {order.symbol}
                      </Text>
                      <Text style={[styles.orderDetails, { color: colors.mutedForeground }]}>
                        {order.side.toUpperCase()} {order.quantity} @ ${order.price?.toFixed(2) || 'Market'}
                      </Text>
                    </View>
                    <Badge
                      variant={
                        order.status === 'filled'
                          ? 'success'
                          : order.status === 'cancelled'
                          ? 'destructive'
                          : 'secondary'
                      }
                    >
                      {order.status}
                    </Badge>
                  </View>
                  <Text style={[styles.orderDate, { color: colors.mutedForeground }]}>
                    {new Date(order.created_at).toLocaleDateString()}
                  </Text>
                </Card>
              ))
            ) : (
              <Card style={styles.emptyCard}>
                <Ionicons name="receipt-outline" size={48} color={colors.mutedForeground} />
                <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
                  No orders yet
                </Text>
              </Card>
            )}
          </View>
        )}
      </ScrollView>

      {/* Trade Modal */}
      <Modal visible={showTradeModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.foreground }]}>
                {orderSide === 'buy' ? 'Buy' : 'Sell'} {selectedSymbol}
              </Text>
              <TouchableOpacity onPress={() => setShowTradeModal(false)}>
                <Ionicons name="close" size={24} color={colors.foreground} />
              </TouchableOpacity>
            </View>

            {quotes.get(selectedSymbol) && (
              <Text style={[styles.modalPrice, { color: colors.primary }]}>
                Current Price: ${quotes.get(selectedSymbol)!.price.toFixed(2)}
              </Text>
            )}

            <Input
              label="Quantity"
              placeholder="Enter number of shares"
              value={quantity}
              onChangeText={setQuantity}
              keyboardType="numeric"
            />

            {quantity && quotes.get(selectedSymbol) && (
              <Text style={[styles.modalTotal, { color: colors.foreground }]}>
                Total: ${(parseInt(quantity) * quotes.get(selectedSymbol)!.price).toFixed(2)}
              </Text>
            )}

            <View style={styles.modalActions}>
              <Button variant="outline" onPress={() => setShowTradeModal(false)} style={{ flex: 1 }}>
                Cancel
              </Button>
              <Button
                variant={orderSide === 'buy' ? 'primary' : 'destructive'}
                onPress={handleTrade}
                loading={isPlacingOrder}
                style={{ flex: 1, marginLeft: Spacing.sm }}
              >
                {orderSide === 'buy' ? 'Buy' : 'Sell'}
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  portfolioCard: {
    margin: Spacing.lg,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
  },
  portfolioLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: FontSizes.sm,
  },
  portfolioValue: {
    color: '#fff',
    fontSize: FontSizes['4xl'],
    fontWeight: '700',
    marginVertical: Spacing.sm,
  },
  portfolioStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.sm,
  },
  portfolioStat: {},
  portfolioStatLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: FontSizes.xs,
  },
  portfolioStatValue: {
    color: '#fff',
    fontSize: FontSizes.base,
    fontWeight: '600',
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    marginHorizontal: Spacing.lg,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  tabText: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  section: {},
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    marginBottom: Spacing.md,
  },
  holdingCard: {
    marginBottom: Spacing.sm,
  },
  holdingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  holdingSymbol: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
  },
  holdingQty: {
    fontSize: FontSizes.sm,
  },
  holdingValues: {
    alignItems: 'flex-end',
  },
  holdingValue: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
  },
  holdingPnl: {
    fontSize: FontSizes.sm,
  },
  holdingActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  quoteCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  quoteInfo: {},
  quoteSymbol: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
  },
  quotePrice: {
    fontSize: FontSizes.sm,
  },
  quoteChange: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  orderCard: {
    marginBottom: Spacing.sm,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  orderSymbol: {
    fontSize: FontSizes.base,
    fontWeight: '600',
  },
  orderDetails: {
    fontSize: FontSizes.sm,
  },
  orderDate: {
    fontSize: FontSizes.xs,
    marginTop: Spacing.xs,
  },
  emptyCard: {
    alignItems: 'center',
    padding: Spacing.xl,
  },
  emptyText: {
    fontSize: FontSizes.sm,
    marginTop: Spacing.md,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  modalTitle: {
    fontSize: FontSizes.xl,
    fontWeight: '600',
  },
  modalPrice: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    marginBottom: Spacing.lg,
  },
  modalTotal: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    textAlign: 'center',
    marginVertical: Spacing.md,
  },
  modalActions: {
    flexDirection: 'row',
    marginTop: Spacing.lg,
  },
});
