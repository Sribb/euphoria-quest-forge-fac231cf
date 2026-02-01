import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LineChart } from 'react-native-svg-charts';
import * as shape from 'd3-shape';

import { marketService, StockQuote, IntradayData } from '@/lib/marketService';
import { usePortfolio } from '@/hooks/usePortfolio';
import { Button, Card, Badge, LoadingScreen } from '@/components/ui';
import { Colors, FontSizes, Spacing, BorderRadius } from '@/constants/theme';

const { width } = Dimensions.get('window');

export default function StockDetailScreen() {
  const { symbol } = useLocalSearchParams<{ symbol: string }>();
  const colors = Colors.dark;
  const { assets, placeOrder, isPlacingOrder } = usePortfolio();

  const [quote, setQuote] = useState<StockQuote | null>(null);
  const [chartData, setChartData] = useState<IntradayData[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M' | '3M'>('1D');

  const holding = assets?.find((a) => a.asset_name === symbol);

  useEffect(() => {
    loadData();
  }, [symbol]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [quoteData, intradayData] = await Promise.all([
        marketService.getGlobalQuote(symbol || ''),
        marketService.getIntradayData(symbol || ''),
      ]);
      setQuote(quoteData);
      setChartData(intradayData);
    } catch (error) {
      console.error('Failed to load stock data:', error);
    }
    setLoading(false);
  };

  const handleTrade = (side: 'buy' | 'sell') => {
    if (!quote) return;

    // For simplicity, buying/selling 1 share
    placeOrder({
      symbol: symbol || '',
      side,
      orderType: 'market',
      quantity: 1,
      price: quote.price,
    });
  };

  if (loading || !quote) {
    return <LoadingScreen message="Loading stock data..." />;
  }

  const chartValues = chartData.map((d) => d.close);
  const isPositive = quote.change >= 0;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.foreground} />
        </TouchableOpacity>
        <View style={styles.headerTitle}>
          <Text style={[styles.symbol, { color: colors.foreground }]}>{symbol}</Text>
        </View>
        <TouchableOpacity>
          <Ionicons name="star-outline" size={24} color={colors.foreground} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Price Section */}
        <View style={styles.priceSection}>
          <Text style={[styles.price, { color: colors.foreground }]}>
            ${quote.price.toFixed(2)}
          </Text>
          <View style={styles.changeContainer}>
            <Ionicons
              name={isPositive ? 'arrow-up' : 'arrow-down'}
              size={16}
              color={isPositive ? colors.success : colors.destructive}
            />
            <Text
              style={[
                styles.change,
                { color: isPositive ? colors.success : colors.destructive },
              ]}
            >
              ${Math.abs(quote.change).toFixed(2)} ({Math.abs(quote.changePercent).toFixed(2)}%)
            </Text>
          </View>
        </View>

        {/* Chart */}
        <View style={styles.chartContainer}>
          {chartValues.length > 0 && (
            <LineChart
              style={styles.chart}
              data={chartValues}
              svg={{
                stroke: isPositive ? colors.success : colors.destructive,
                strokeWidth: 2,
              }}
              contentInset={{ top: 20, bottom: 20 }}
              curve={shape.curveMonotoneX}
            />
          )}
        </View>

        {/* Timeframe Selector */}
        <View style={styles.timeframes}>
          {(['1D', '1W', '1M', '3M'] as const).map((tf) => (
            <TouchableOpacity
              key={tf}
              style={[
                styles.timeframeButton,
                {
                  backgroundColor: timeframe === tf ? colors.primary : colors.card,
                },
              ]}
              onPress={() => setTimeframe(tf)}
            >
              <Text
                style={[
                  styles.timeframeText,
                  { color: timeframe === tf ? '#fff' : colors.mutedForeground },
                ]}
              >
                {tf}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Holdings */}
        {holding && (
          <Card style={styles.holdingCard}>
            <Text style={[styles.holdingTitle, { color: colors.foreground }]}>Your Position</Text>
            <View style={styles.holdingDetails}>
              <View style={styles.holdingDetail}>
                <Text style={[styles.holdingLabel, { color: colors.mutedForeground }]}>Shares</Text>
                <Text style={[styles.holdingValue, { color: colors.foreground }]}>
                  {holding.quantity}
                </Text>
              </View>
              <View style={styles.holdingDetail}>
                <Text style={[styles.holdingLabel, { color: colors.mutedForeground }]}>
                  Avg Cost
                </Text>
                <Text style={[styles.holdingValue, { color: colors.foreground }]}>
                  ${holding.purchase_price.toFixed(2)}
                </Text>
              </View>
              <View style={styles.holdingDetail}>
                <Text style={[styles.holdingLabel, { color: colors.mutedForeground }]}>
                  Total Value
                </Text>
                <Text style={[styles.holdingValue, { color: colors.foreground }]}>
                  ${(holding.quantity * quote.price).toFixed(2)}
                </Text>
              </View>
            </View>
          </Card>
        )}

        {/* Stats */}
        <Card style={styles.statsCard}>
          <Text style={[styles.statsTitle, { color: colors.foreground }]}>Statistics</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Open</Text>
              <Text style={[styles.statValue, { color: colors.foreground }]}>
                ${quote.open.toFixed(2)}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>High</Text>
              <Text style={[styles.statValue, { color: colors.foreground }]}>
                ${quote.high.toFixed(2)}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Low</Text>
              <Text style={[styles.statValue, { color: colors.foreground }]}>
                ${quote.low.toFixed(2)}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>
                Prev Close
              </Text>
              <Text style={[styles.statValue, { color: colors.foreground }]}>
                ${quote.previousClose.toFixed(2)}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Volume</Text>
              <Text style={[styles.statValue, { color: colors.foreground }]}>
                {(quote.volume / 1000000).toFixed(1)}M
              </Text>
            </View>
          </View>
        </Card>
      </ScrollView>

      {/* Trade Buttons */}
      <View style={[styles.tradeButtons, { backgroundColor: colors.card }]}>
        <Button
          variant="outline"
          onPress={() => handleTrade('sell')}
          loading={isPlacingOrder}
          style={styles.tradeButton}
        >
          Sell
        </Button>
        <Button
          variant="primary"
          onPress={() => handleTrade('buy')}
          loading={isPlacingOrder}
          style={styles.tradeButton}
        >
          Buy
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.lg,
  },
  backButton: {
    marginRight: Spacing.md,
  },
  headerTitle: {
    flex: 1,
  },
  symbol: {
    fontSize: FontSizes.xl,
    fontWeight: '700',
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingTop: 0,
    paddingBottom: 100,
  },
  priceSection: {
    marginBottom: Spacing.lg,
  },
  price: {
    fontSize: FontSizes['4xl'],
    fontWeight: '700',
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  change: {
    fontSize: FontSizes.base,
    fontWeight: '600',
    marginLeft: 4,
  },
  chartContainer: {
    height: 200,
    marginBottom: Spacing.lg,
  },
  chart: {
    height: 200,
  },
  timeframes: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  timeframeButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  timeframeText: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
  },
  holdingCard: {
    marginBottom: Spacing.md,
  },
  holdingTitle: {
    fontSize: FontSizes.base,
    fontWeight: '600',
    marginBottom: Spacing.md,
  },
  holdingDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  holdingDetail: {
    alignItems: 'center',
  },
  holdingLabel: {
    fontSize: FontSizes.xs,
    marginBottom: 2,
  },
  holdingValue: {
    fontSize: FontSizes.base,
    fontWeight: '600',
  },
  statsCard: {
    marginBottom: Spacing.md,
  },
  statsTitle: {
    fontSize: FontSizes.base,
    fontWeight: '600',
    marginBottom: Spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  statItem: {
    width: '33%',
    marginBottom: Spacing.md,
  },
  statLabel: {
    fontSize: FontSizes.xs,
    marginBottom: 2,
  },
  statValue: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
  },
  tradeButtons: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: Spacing.lg,
    paddingBottom: Spacing.xl,
    gap: Spacing.md,
  },
  tradeButton: {
    flex: 1,
  },
});
