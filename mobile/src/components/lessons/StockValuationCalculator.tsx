import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import Svg, { Rect, Text as SvgText, Line, G } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';

interface StockValuationCalculatorProps {
  onComplete?: (score: number) => void;
}

export function StockValuationCalculator({ onComplete }: StockValuationCalculatorProps) {
  const [currentPrice, setCurrentPrice] = useState('150');
  const [eps, setEps] = useState('6.50');
  const [epsGrowth, setEpsGrowth] = useState('15');
  const [dividendYield, setDividendYield] = useState('0.5');
  const [bookValue, setBookValue] = useState('25');
  const [revenue, setRevenue] = useState('400');
  const [industryPE, setIndustryPE] = useState('25');

  const calculations = useMemo(() => {
    const price = parseFloat(currentPrice) || 0;
    const earnPerShare = parseFloat(eps) || 0;
    const growth = parseFloat(epsGrowth) || 0;
    const divYield = parseFloat(dividendYield) || 0;
    const book = parseFloat(bookValue) || 0;
    const rev = parseFloat(revenue) || 0;
    const indPE = parseFloat(industryPE) || 0;

    // P/E Ratio
    const peRatio = earnPerShare > 0 ? price / earnPerShare : 0;

    // PEG Ratio (P/E divided by growth rate)
    const pegRatio = growth > 0 ? peRatio / growth : 0;

    // Price to Book
    const priceToBook = book > 0 ? price / book : 0;

    // Price to Sales (assuming 1B shares outstanding for simplicity)
    const priceToSales = rev > 0 ? price / (rev / 10) : 0;

    // Graham Number: sqrt(22.5 × EPS × Book Value)
    const grahamNumber = Math.sqrt(22.5 * earnPerShare * book);

    // DCF simplified: EPS × (8.5 + 2g) where g is growth rate
    const dcfValue = earnPerShare * (8.5 + 2 * growth);

    // Fair value based on industry P/E
    const fairValueByPE = earnPerShare * indPE;

    // Dividend Discount Model (simplified)
    const ddmValue = divYield > 0 ? (earnPerShare * (divYield / 100)) / 0.08 : 0;

    // Overall valuation assessment
    const avgFairValue = (grahamNumber + dcfValue + fairValueByPE) / 3;
    const upside = ((avgFairValue - price) / price) * 100;

    let rating: 'undervalued' | 'fair' | 'overvalued';
    if (upside > 15) rating = 'undervalued';
    else if (upside < -15) rating = 'overvalued';
    else rating = 'fair';

    return {
      peRatio: peRatio.toFixed(1),
      pegRatio: pegRatio.toFixed(2),
      priceToBook: priceToBook.toFixed(2),
      priceToSales: priceToSales.toFixed(2),
      grahamNumber: grahamNumber.toFixed(2),
      dcfValue: dcfValue.toFixed(2),
      fairValueByPE: fairValueByPE.toFixed(2),
      ddmValue: ddmValue.toFixed(2),
      avgFairValue: avgFairValue.toFixed(2),
      upside: upside.toFixed(1),
      rating,
    };
  }, [currentPrice, eps, epsGrowth, dividendYield, bookValue, revenue, industryPE]);

  const renderValuationChart = () => {
    const width = 320;
    const height = 200;
    const padding = { top: 30, right: 20, bottom: 20, left: 20 };
    const chartWidth = width - padding.left - padding.right;

    const price = parseFloat(currentPrice) || 0;
    const values = [
      { label: 'Current', value: price, color: Colors.dark.primary },
      { label: 'Graham', value: parseFloat(calculations.grahamNumber), color: Colors.dark.success },
      { label: 'DCF', value: parseFloat(calculations.dcfValue), color: Colors.dark.accent },
      { label: 'PE Fair', value: parseFloat(calculations.fairValueByPE), color: Colors.dark.warning },
    ];

    const maxValue = Math.max(...values.map(v => v.value)) * 1.1;
    const barWidth = (chartWidth / values.length) * 0.6;
    const barGap = (chartWidth / values.length) * 0.4;
    const chartHeight = height - padding.top - padding.bottom;

    return (
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Valuation Comparison</Text>
        <Svg width={width} height={height}>
          {values.map((item, index) => {
            const x = padding.left + index * (barWidth + barGap) + barGap / 2;
            const barHeight = (item.value / maxValue) * chartHeight;
            const y = padding.top + chartHeight - barHeight;

            return (
              <G key={item.label}>
                <Rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  fill={item.color}
                  rx={6}
                />
                <SvgText
                  x={x + barWidth / 2}
                  y={y - 8}
                  fontSize={12}
                  fontWeight="bold"
                  fill={item.color}
                  textAnchor="middle"
                >
                  ${item.value.toFixed(0)}
                </SvgText>
                <SvgText
                  x={x + barWidth / 2}
                  y={height - 5}
                  fontSize={11}
                  fill={Colors.dark.textSecondary}
                  textAnchor="middle"
                >
                  {item.label}
                </SvgText>
              </G>
            );
          })}

          {/* Average line */}
          <Line
            x1={padding.left}
            y1={padding.top + chartHeight - (parseFloat(calculations.avgFairValue) / maxValue) * chartHeight}
            x2={width - padding.right}
            y2={padding.top + chartHeight - (parseFloat(calculations.avgFairValue) / maxValue) * chartHeight}
            stroke={Colors.dark.error}
            strokeWidth={2}
            strokeDasharray="6,4"
          />
        </Svg>
        <View style={styles.chartLegend}>
          <View style={[styles.legendDot, { backgroundColor: Colors.dark.error }]} />
          <Text style={styles.legendText}>Avg Fair Value: ${calculations.avgFairValue}</Text>
        </View>
      </View>
    );
  };

  const getRatingColor = () => {
    switch (calculations.rating) {
      case 'undervalued': return Colors.dark.success;
      case 'overvalued': return Colors.dark.error;
      default: return Colors.dark.warning;
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Ionicons name="calculator" size={32} color={Colors.dark.accent} />
        <Text style={styles.title}>Stock Valuation Calculator</Text>
        <Text style={styles.subtitle}>
          Learn multiple methods to value stocks
        </Text>
      </View>

      {/* Input Section */}
      <View style={styles.inputCard}>
        <Text style={styles.sectionTitle}>Stock Data</Text>

        <View style={styles.inputRow}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Current Price</Text>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputPrefix}>$</Text>
              <TextInput
                style={styles.input}
                value={currentPrice}
                onChangeText={setCurrentPrice}
                keyboardType="numeric"
                placeholderTextColor={Colors.dark.textSecondary}
              />
            </View>
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>EPS (TTM)</Text>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputPrefix}>$</Text>
              <TextInput
                style={styles.input}
                value={eps}
                onChangeText={setEps}
                keyboardType="numeric"
                placeholderTextColor={Colors.dark.textSecondary}
              />
            </View>
          </View>
        </View>

        <View style={styles.inputRow}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>EPS Growth Rate</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                value={epsGrowth}
                onChangeText={setEpsGrowth}
                keyboardType="numeric"
                placeholderTextColor={Colors.dark.textSecondary}
              />
              <Text style={styles.inputSuffix}>%</Text>
            </View>
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Dividend Yield</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                value={dividendYield}
                onChangeText={setDividendYield}
                keyboardType="numeric"
                placeholderTextColor={Colors.dark.textSecondary}
              />
              <Text style={styles.inputSuffix}>%</Text>
            </View>
          </View>
        </View>

        <View style={styles.inputRow}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Book Value/Share</Text>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputPrefix}>$</Text>
              <TextInput
                style={styles.input}
                value={bookValue}
                onChangeText={setBookValue}
                keyboardType="numeric"
                placeholderTextColor={Colors.dark.textSecondary}
              />
            </View>
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Industry P/E</Text>
            <TextInput
              style={[styles.input, styles.inputFull]}
              value={industryPE}
              onChangeText={setIndustryPE}
              keyboardType="numeric"
              placeholderTextColor={Colors.dark.textSecondary}
            />
          </View>
        </View>
      </View>

      {/* Valuation Verdict */}
      <View style={[styles.verdictCard, { borderColor: getRatingColor() }]}>
        <View style={styles.verdictHeader}>
          <Ionicons
            name={calculations.rating === 'undervalued' ? 'arrow-up-circle' :
                  calculations.rating === 'overvalued' ? 'arrow-down-circle' : 'remove-circle'}
            size={32}
            color={getRatingColor()}
          />
          <Text style={[styles.verdictText, { color: getRatingColor() }]}>
            {calculations.rating.toUpperCase()}
          </Text>
        </View>
        <Text style={styles.verdictDetails}>
          {parseFloat(calculations.upside) > 0 ? '+' : ''}{calculations.upside}% vs Fair Value
        </Text>
        <Text style={styles.fairValueText}>
          Estimated Fair Value: ${calculations.avgFairValue}
        </Text>
      </View>

      {/* Valuation Chart */}
      {renderValuationChart()}

      {/* Key Ratios */}
      <View style={styles.ratiosCard}>
        <Text style={styles.sectionTitle}>Key Valuation Ratios</Text>

        <View style={styles.ratioGrid}>
          <View style={styles.ratioItem}>
            <Text style={styles.ratioValue}>{calculations.peRatio}</Text>
            <Text style={styles.ratioLabel}>P/E Ratio</Text>
            <Text style={styles.ratioHint}>
              {parseFloat(calculations.peRatio) < parseFloat(industryPE) ? 'Below' : 'Above'} industry
            </Text>
          </View>

          <View style={styles.ratioItem}>
            <Text style={styles.ratioValue}>{calculations.pegRatio}</Text>
            <Text style={styles.ratioLabel}>PEG Ratio</Text>
            <Text style={styles.ratioHint}>
              {parseFloat(calculations.pegRatio) < 1 ? 'Attractive' : parseFloat(calculations.pegRatio) < 2 ? 'Fair' : 'Expensive'}
            </Text>
          </View>

          <View style={styles.ratioItem}>
            <Text style={styles.ratioValue}>{calculations.priceToBook}</Text>
            <Text style={styles.ratioLabel}>P/B Ratio</Text>
            <Text style={styles.ratioHint}>
              {parseFloat(calculations.priceToBook) < 3 ? 'Reasonable' : 'Premium'}
            </Text>
          </View>

          <View style={styles.ratioItem}>
            <Text style={styles.ratioValue}>{calculations.priceToSales}</Text>
            <Text style={styles.ratioLabel}>P/S Ratio</Text>
            <Text style={styles.ratioHint}>
              {parseFloat(calculations.priceToSales) < 5 ? 'Good value' : 'High multiple'}
            </Text>
          </View>
        </View>
      </View>

      {/* Valuation Methods Explained */}
      <View style={styles.methodsCard}>
        <Text style={styles.sectionTitle}>Valuation Methods</Text>

        <View style={styles.methodItem}>
          <View style={styles.methodHeader}>
            <View style={[styles.methodIcon, { backgroundColor: Colors.dark.success + '20' }]}>
              <Text style={styles.methodEmoji}>📊</Text>
            </View>
            <View style={styles.methodInfo}>
              <Text style={styles.methodName}>Graham Number</Text>
              <Text style={styles.methodValue}>${calculations.grahamNumber}</Text>
            </View>
          </View>
          <Text style={styles.methodDesc}>
            Benjamin Graham's formula: √(22.5 × EPS × Book Value). A conservative
            measure of intrinsic value.
          </Text>
        </View>

        <View style={styles.methodItem}>
          <View style={styles.methodHeader}>
            <View style={[styles.methodIcon, { backgroundColor: Colors.dark.accent + '20' }]}>
              <Text style={styles.methodEmoji}>💰</Text>
            </View>
            <View style={styles.methodInfo}>
              <Text style={styles.methodName}>DCF (Simplified)</Text>
              <Text style={styles.methodValue}>${calculations.dcfValue}</Text>
            </View>
          </View>
          <Text style={styles.methodDesc}>
            Discounted Cash Flow using Graham's growth formula: EPS × (8.5 + 2g).
            Projects future earnings growth.
          </Text>
        </View>

        <View style={styles.methodItem}>
          <View style={styles.methodHeader}>
            <View style={[styles.methodIcon, { backgroundColor: Colors.dark.warning + '20' }]}>
              <Text style={styles.methodEmoji}>📈</Text>
            </View>
            <View style={styles.methodInfo}>
              <Text style={styles.methodName}>Industry P/E Method</Text>
              <Text style={styles.methodValue}>${calculations.fairValueByPE}</Text>
            </View>
          </View>
          <Text style={styles.methodDesc}>
            EPS multiplied by industry average P/E ratio. Compares valuation to peers.
          </Text>
        </View>
      </View>

      {/* Complete Button */}
      {onComplete && (
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
  inputCard: {
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
  inputRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  inputGroup: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 12,
    color: Colors.dark.textSecondary,
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.background,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  inputPrefix: {
    color: Colors.dark.textSecondary,
    fontSize: 16,
  },
  inputSuffix: {
    color: Colors.dark.textSecondary,
    fontSize: 16,
  },
  input: {
    flex: 1,
    color: Colors.dark.text,
    fontSize: 16,
    paddingVertical: 10,
  },
  inputFull: {
    backgroundColor: Colors.dark.background,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  verdictCard: {
    backgroundColor: Colors.dark.card,
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 16,
    borderWidth: 2,
    alignItems: 'center',
  },
  verdictHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  verdictText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  verdictDetails: {
    fontSize: 16,
    color: Colors.dark.text,
    marginTop: 8,
  },
  fairValueText: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
    marginTop: 4,
  },
  chartContainer: {
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
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
  },
  legendDot: {
    width: 12,
    height: 4,
    borderRadius: 2,
  },
  legendText: {
    fontSize: 12,
    color: Colors.dark.textSecondary,
  },
  ratiosCard: {
    backgroundColor: Colors.dark.card,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  ratioGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  ratioItem: {
    width: '47%',
    backgroundColor: Colors.dark.background,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  ratioValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.dark.text,
  },
  ratioLabel: {
    fontSize: 12,
    color: Colors.dark.textSecondary,
    marginTop: 4,
  },
  ratioHint: {
    fontSize: 10,
    color: Colors.dark.accent,
    marginTop: 4,
  },
  methodsCard: {
    backgroundColor: Colors.dark.card,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  methodItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.border,
  },
  methodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  methodIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  methodEmoji: {
    fontSize: 20,
  },
  methodInfo: {
    marginLeft: 12,
  },
  methodName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.dark.text,
  },
  methodValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.dark.success,
  },
  methodDesc: {
    fontSize: 13,
    color: Colors.dark.textSecondary,
    lineHeight: 18,
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
