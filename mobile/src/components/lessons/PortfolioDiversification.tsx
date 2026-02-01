import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import Svg, { Circle, Path, Text as SvgText, G } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface AssetClass {
  id: string;
  name: string;
  color: string;
  expectedReturn: number;
  volatility: number;
  icon: string;
}

const assetClasses: AssetClass[] = [
  { id: 'stocks', name: 'US Stocks', color: '#8b5cf6', expectedReturn: 10, volatility: 18, icon: 'trending-up' },
  { id: 'intl', name: 'International Stocks', color: '#06b6d4', expectedReturn: 8, volatility: 20, icon: 'globe' },
  { id: 'bonds', name: 'Bonds', color: '#10b981', expectedReturn: 5, volatility: 6, icon: 'document-text' },
  { id: 'reits', name: 'Real Estate (REITs)', color: '#f59e0b', expectedReturn: 7, volatility: 14, icon: 'home' },
  { id: 'commodities', name: 'Commodities', color: '#ef4444', expectedReturn: 4, volatility: 22, icon: 'cube' },
  { id: 'cash', name: 'Cash & Money Market', color: '#64748b', expectedReturn: 3, volatility: 1, icon: 'wallet' },
];

const presetPortfolios = [
  { name: 'Conservative', allocations: { stocks: 20, intl: 10, bonds: 50, reits: 10, commodities: 5, cash: 5 } },
  { name: 'Moderate', allocations: { stocks: 35, intl: 15, bonds: 30, reits: 10, commodities: 5, cash: 5 } },
  { name: 'Aggressive', allocations: { stocks: 50, intl: 25, bonds: 10, reits: 10, commodities: 5, cash: 0 } },
];

interface PortfolioDiversificationProps {
  onComplete?: (score: number) => void;
}

export function PortfolioDiversification({ onComplete }: PortfolioDiversificationProps) {
  const [allocations, setAllocations] = useState<Record<string, number>>({
    stocks: 40,
    intl: 20,
    bonds: 20,
    reits: 10,
    commodities: 5,
    cash: 5,
  });

  const totalAllocation = Object.values(allocations).reduce((sum, val) => sum + val, 0);

  const adjustAllocation = (id: string, delta: number) => {
    setAllocations(prev => {
      const newValue = Math.max(0, Math.min(100, (prev[id] || 0) + delta));
      return { ...prev, [id]: newValue };
    });
  };

  const applyPreset = (preset: typeof presetPortfolios[0]) => {
    setAllocations(preset.allocations);
  };

  const calculatePortfolioMetrics = useCallback(() => {
    let expectedReturn = 0;
    let weightedVolatility = 0;

    assetClasses.forEach(asset => {
      const weight = (allocations[asset.id] || 0) / 100;
      expectedReturn += weight * asset.expectedReturn;
      weightedVolatility += weight * asset.volatility;
    });

    // Simplified portfolio volatility (actual would use correlation matrix)
    const diversificationBenefit = totalAllocation === 100 ? 0.85 : 1;
    const portfolioVolatility = weightedVolatility * diversificationBenefit;

    const sharpeRatio = portfolioVolatility > 0
      ? (expectedReturn - 3) / portfolioVolatility
      : 0;

    return {
      expectedReturn: expectedReturn.toFixed(1),
      volatility: portfolioVolatility.toFixed(1),
      sharpeRatio: sharpeRatio.toFixed(2),
    };
  }, [allocations, totalAllocation]);

  const metrics = calculatePortfolioMetrics();

  const renderPieChart = () => {
    const size = 200;
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = 80;
    const innerRadius = 50;

    let currentAngle = -90;
    const slices: JSX.Element[] = [];

    assetClasses.forEach((asset, index) => {
      const percentage = allocations[asset.id] || 0;
      if (percentage === 0) return;

      const angle = (percentage / totalAllocation) * 360;
      const startAngle = currentAngle;
      const endAngle = currentAngle + angle;
      currentAngle = endAngle;

      const startRad = (startAngle * Math.PI) / 180;
      const endRad = (endAngle * Math.PI) / 180;

      const x1 = centerX + radius * Math.cos(startRad);
      const y1 = centerY + radius * Math.sin(startRad);
      const x2 = centerX + radius * Math.cos(endRad);
      const y2 = centerY + radius * Math.sin(endRad);

      const ix1 = centerX + innerRadius * Math.cos(startRad);
      const iy1 = centerY + innerRadius * Math.sin(startRad);
      const ix2 = centerX + innerRadius * Math.cos(endRad);
      const iy2 = centerY + innerRadius * Math.sin(endRad);

      const largeArcFlag = angle > 180 ? 1 : 0;

      const pathData = [
        `M ${ix1} ${iy1}`,
        `L ${x1} ${y1}`,
        `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
        `L ${ix2} ${iy2}`,
        `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${ix1} ${iy1}`,
        'Z',
      ].join(' ');

      slices.push(
        <Path
          key={asset.id}
          d={pathData}
          fill={asset.color}
          stroke={Colors.dark.background}
          strokeWidth={2}
        />
      );
    });

    return (
      <View style={styles.pieContainer}>
        <Svg width={size} height={size}>
          <G>
            {slices}
          </G>
          <Circle
            cx={centerX}
            cy={centerY}
            r={innerRadius - 5}
            fill={Colors.dark.card}
          />
          <SvgText
            x={centerX}
            y={centerY - 8}
            fontSize={24}
            fontWeight="bold"
            fill={Colors.dark.text}
            textAnchor="middle"
          >
            {totalAllocation}%
          </SvgText>
          <SvgText
            x={centerX}
            y={centerY + 12}
            fontSize={12}
            fill={Colors.dark.textSecondary}
            textAnchor="middle"
          >
            Allocated
          </SvgText>
        </Svg>
      </View>
    );
  };

  const renderRiskReturnChart = () => {
    const width = SCREEN_WIDTH - 64;
    const height = 180;
    const padding = { top: 20, right: 20, bottom: 40, left: 50 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    const maxReturn = 12;
    const maxVolatility = 25;

    return (
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Risk vs Return</Text>
        <Svg width={width} height={height}>
          {/* Grid */}
          {[0, 0.5, 1].map((pct, i) => (
            <React.Fragment key={`y${i}`}>
              <Path
                d={`M ${padding.left} ${padding.top + pct * chartHeight} H ${width - padding.right}`}
                stroke={Colors.dark.border}
                strokeDasharray="4,4"
              />
              <SvgText
                x={padding.left - 5}
                y={padding.top + pct * chartHeight + 4}
                fontSize={10}
                fill={Colors.dark.textSecondary}
                textAnchor="end"
              >
                {((1 - pct) * maxReturn).toFixed(0)}%
              </SvgText>
            </React.Fragment>
          ))}

          {/* X axis labels */}
          <SvgText
            x={padding.left}
            y={height - 10}
            fontSize={10}
            fill={Colors.dark.textSecondary}
          >
            0%
          </SvgText>
          <SvgText
            x={width - padding.right}
            y={height - 10}
            fontSize={10}
            fill={Colors.dark.textSecondary}
            textAnchor="end"
          >
            {maxVolatility}%
          </SvgText>
          <SvgText
            x={width / 2}
            y={height - 10}
            fontSize={10}
            fill={Colors.dark.textSecondary}
            textAnchor="middle"
          >
            Volatility
          </SvgText>

          {/* Asset class points */}
          {assetClasses.map(asset => {
            const x = padding.left + (asset.volatility / maxVolatility) * chartWidth;
            const y = padding.top + chartHeight - (asset.expectedReturn / maxReturn) * chartHeight;
            return (
              <G key={asset.id}>
                <Circle cx={x} cy={y} r={8} fill={asset.color} opacity={0.5} />
                <Circle cx={x} cy={y} r={5} fill={asset.color} />
              </G>
            );
          })}

          {/* Portfolio point */}
          {totalAllocation === 100 && (
            <G>
              <Circle
                cx={padding.left + (parseFloat(metrics.volatility) / maxVolatility) * chartWidth}
                cy={padding.top + chartHeight - (parseFloat(metrics.expectedReturn) / maxReturn) * chartHeight}
                r={12}
                fill={Colors.dark.primary}
                opacity={0.3}
              />
              <Circle
                cx={padding.left + (parseFloat(metrics.volatility) / maxVolatility) * chartWidth}
                cy={padding.top + chartHeight - (parseFloat(metrics.expectedReturn) / maxReturn) * chartHeight}
                r={8}
                fill={Colors.dark.primary}
                stroke={Colors.dark.text}
                strokeWidth={2}
              />
            </G>
          )}
        </Svg>

        <View style={styles.chartLegend}>
          {assetClasses.slice(0, 3).map(asset => (
            <View key={asset.id} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: asset.color }]} />
              <Text style={styles.legendText}>{asset.name.split(' ')[0]}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Ionicons name="pie-chart" size={32} color={Colors.dark.primary} />
        <Text style={styles.title}>Portfolio Diversification</Text>
        <Text style={styles.subtitle}>
          Build a balanced portfolio by allocating assets
        </Text>
      </View>

      {/* Preset Portfolios */}
      <View style={styles.presetsContainer}>
        {presetPortfolios.map((preset) => (
          <TouchableOpacity
            key={preset.name}
            style={styles.presetButton}
            onPress={() => applyPreset(preset)}
          >
            <Text style={styles.presetText}>{preset.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Pie Chart */}
      {renderPieChart()}

      {/* Metrics Display */}
      <View style={styles.metricsRow}>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Expected Return</Text>
          <Text style={[styles.metricValue, { color: Colors.dark.success }]}>
            {metrics.expectedReturn}%
          </Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Volatility</Text>
          <Text style={[styles.metricValue, { color: Colors.dark.warning }]}>
            {metrics.volatility}%
          </Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Sharpe Ratio</Text>
          <Text style={styles.metricValue}>{metrics.sharpeRatio}</Text>
        </View>
      </View>

      {/* Allocation Warning */}
      {totalAllocation !== 100 && (
        <View style={styles.warningCard}>
          <Ionicons name="warning" size={20} color={Colors.dark.warning} />
          <Text style={styles.warningText}>
            Total allocation is {totalAllocation}%. Adjust to reach 100%.
          </Text>
        </View>
      )}

      {/* Asset Allocation Sliders */}
      <View style={styles.allocationCard}>
        <Text style={styles.sectionTitle}>Asset Allocation</Text>
        {assetClasses.map((asset) => (
          <View key={asset.id} style={styles.assetRow}>
            <View style={[styles.assetIcon, { backgroundColor: asset.color + '20' }]}>
              <Ionicons name={asset.icon as any} size={20} color={asset.color} />
            </View>
            <View style={styles.assetInfo}>
              <Text style={styles.assetName}>{asset.name}</Text>
              <Text style={styles.assetDetails}>
                Return: {asset.expectedReturn}% | Vol: {asset.volatility}%
              </Text>
            </View>
            <View style={styles.allocationControls}>
              <TouchableOpacity
                style={styles.controlButton}
                onPress={() => adjustAllocation(asset.id, -5)}
              >
                <Ionicons name="remove" size={20} color={Colors.dark.text} />
              </TouchableOpacity>
              <Text style={styles.allocationValue}>{allocations[asset.id] || 0}%</Text>
              <TouchableOpacity
                style={styles.controlButton}
                onPress={() => adjustAllocation(asset.id, 5)}
              >
                <Ionicons name="add" size={20} color={Colors.dark.text} />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      {/* Risk/Return Chart */}
      {renderRiskReturnChart()}

      {/* Key Concepts */}
      <View style={styles.conceptsCard}>
        <Text style={styles.conceptsTitle}>Key Concepts</Text>

        <View style={styles.conceptItem}>
          <View style={styles.conceptHeader}>
            <Ionicons name="shuffle" size={20} color={Colors.dark.accent} />
            <Text style={styles.conceptName}>Diversification</Text>
          </View>
          <Text style={styles.conceptDesc}>
            Spreading investments across different asset classes reduces overall risk
            without proportionally reducing expected returns.
          </Text>
        </View>

        <View style={styles.conceptItem}>
          <View style={styles.conceptHeader}>
            <Ionicons name="stats-chart" size={20} color={Colors.dark.warning} />
            <Text style={styles.conceptName}>Volatility</Text>
          </View>
          <Text style={styles.conceptDesc}>
            Measures how much an investment's returns vary over time. Higher
            volatility means more risk but potentially higher returns.
          </Text>
        </View>

        <View style={styles.conceptItem}>
          <View style={styles.conceptHeader}>
            <Ionicons name="calculator" size={20} color={Colors.dark.success} />
            <Text style={styles.conceptName}>Sharpe Ratio</Text>
          </View>
          <Text style={styles.conceptDesc}>
            Measures risk-adjusted returns. A higher Sharpe ratio indicates better
            return per unit of risk taken.
          </Text>
        </View>
      </View>

      {/* Complete Button */}
      {onComplete && totalAllocation === 100 && (
        <TouchableOpacity
          style={styles.completeButton}
          onPress={() => onComplete(100)}
        >
          <Text style={styles.completeButtonText}>Complete Lesson</Text>
          <Ionicons name="checkmark-circle" size={24} color={Colors.dark.text} />
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  header: {
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.dark.text,
    marginTop: 12,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
  presetsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 16,
  },
  presetButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Colors.dark.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  presetText: {
    color: Colors.dark.text,
    fontSize: 14,
    fontWeight: '500',
  },
  pieContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  metricsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 16,
  },
  metricCard: {
    flex: 1,
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 11,
    color: Colors.dark.textSecondary,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.dark.text,
    marginTop: 4,
  },
  warningCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.warning + '20',
    marginHorizontal: 16,
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    gap: 12,
  },
  warningText: {
    flex: 1,
    color: Colors.dark.warning,
    fontSize: 14,
  },
  allocationCard: {
    backgroundColor: Colors.dark.card,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.dark.text,
    marginBottom: 16,
  },
  assetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  assetIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  assetInfo: {
    flex: 1,
    marginLeft: 12,
  },
  assetName: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.dark.text,
  },
  assetDetails: {
    fontSize: 11,
    color: Colors.dark.textSecondary,
    marginTop: 2,
  },
  allocationControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  controlButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: Colors.dark.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  allocationValue: {
    width: 40,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: Colors.dark.text,
  },
  chartCard: {
    backgroundColor: Colors.dark.card,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.dark.text,
    marginBottom: 12,
  },
  chartLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginTop: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 12,
    color: Colors.dark.textSecondary,
  },
  conceptsCard: {
    backgroundColor: Colors.dark.card,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  conceptsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.dark.text,
    marginBottom: 16,
  },
  conceptItem: {
    marginBottom: 16,
  },
  conceptHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  conceptName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.dark.text,
  },
  conceptDesc: {
    fontSize: 13,
    color: Colors.dark.textSecondary,
    lineHeight: 20,
    paddingLeft: 28,
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.dark.primary,
    marginHorizontal: 16,
    marginVertical: 24,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  completeButtonText: {
    color: Colors.dark.text,
    fontSize: 18,
    fontWeight: '600',
  },
});
