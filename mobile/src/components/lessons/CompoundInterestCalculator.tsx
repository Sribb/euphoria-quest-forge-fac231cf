import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import Svg, { Path, Line, Circle, Text as SvgText, Defs, LinearGradient, Stop } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';

interface CompoundInterestCalculatorProps {
  onComplete?: (score: number) => void;
}

export function CompoundInterestCalculator({ onComplete }: CompoundInterestCalculatorProps) {
  const [principal, setPrincipal] = useState('10000');
  const [rate, setRate] = useState('7');
  const [years, setYears] = useState('20');
  const [monthlyContribution, setMonthlyContribution] = useState('500');
  const [compoundFrequency, setCompoundFrequency] = useState<'monthly' | 'quarterly' | 'annually'>('monthly');

  const frequencies = {
    monthly: 12,
    quarterly: 4,
    annually: 1,
  };

  const calculations = useMemo(() => {
    const p = parseFloat(principal) || 0;
    const r = (parseFloat(rate) || 0) / 100;
    const t = parseInt(years) || 0;
    const pmt = parseFloat(monthlyContribution) || 0;
    const n = frequencies[compoundFrequency];

    // Compound interest formula: A = P(1 + r/n)^(nt)
    // Future value of series: FV = PMT × (((1 + r/n)^(nt) - 1) / (r/n))

    const yearlyData = [];
    let currentBalance = p;
    let totalContributions = p;

    for (let year = 0; year <= t; year++) {
      if (year > 0) {
        // Add monthly contributions for the year
        for (let month = 0; month < 12; month++) {
          currentBalance += pmt;
          totalContributions += pmt;
          // Apply interest based on compound frequency
          if ((month + 1) % (12 / n) === 0) {
            currentBalance *= (1 + r / n);
          }
        }
      }

      yearlyData.push({
        year,
        balance: currentBalance,
        contributions: totalContributions,
        interest: currentBalance - totalContributions,
      });
    }

    const finalBalance = yearlyData[yearlyData.length - 1]?.balance || 0;
    const totalInterest = finalBalance - (p + pmt * 12 * t);

    return {
      yearlyData,
      finalBalance,
      totalContributions: p + pmt * 12 * t,
      totalInterest,
    };
  }, [principal, rate, years, monthlyContribution, compoundFrequency]);

  const renderChart = () => {
    const data = calculations.yearlyData;
    if (data.length < 2) return null;

    const width = 320;
    const height = 200;
    const padding = { top: 20, right: 20, bottom: 30, left: 60 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    const maxValue = Math.max(...data.map(d => d.balance));
    const getX = (index: number) => padding.left + (index / (data.length - 1)) * chartWidth;
    const getY = (value: number) => padding.top + chartHeight - (value / maxValue) * chartHeight;

    const balancePath = data
      .map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.balance)}`)
      .join(' ');

    const contributionsPath = data
      .map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.contributions)}`)
      .join(' ');

    return (
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Growth Over Time</Text>
        <Svg width={width} height={height}>
          <Defs>
            <LinearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor={Colors.dark.success} stopOpacity={0.3} />
              <Stop offset="100%" stopColor={Colors.dark.success} stopOpacity={0.05} />
            </LinearGradient>
          </Defs>

          {/* Grid */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => (
            <React.Fragment key={i}>
              <Line
                x1={padding.left}
                y1={padding.top + pct * chartHeight}
                x2={width - padding.right}
                y2={padding.top + pct * chartHeight}
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
                ${((1 - pct) * maxValue / 1000).toFixed(0)}k
              </SvgText>
            </React.Fragment>
          ))}

          {/* Contributions line */}
          <Path
            d={contributionsPath}
            stroke={Colors.dark.primary}
            strokeWidth={2}
            fill="none"
            strokeDasharray="5,5"
          />

          {/* Balance line */}
          <Path
            d={`${balancePath} L ${getX(data.length - 1)} ${padding.top + chartHeight} L ${padding.left} ${padding.top + chartHeight} Z`}
            fill="url(#balanceGradient)"
          />
          <Path
            d={balancePath}
            stroke={Colors.dark.success}
            strokeWidth={2}
            fill="none"
          />
        </Svg>
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: Colors.dark.success }]} />
            <Text style={styles.legendText}>Total Balance</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: Colors.dark.primary, borderStyle: 'dashed' }]} />
            <Text style={styles.legendText}>Contributions</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Ionicons name="trending-up" size={32} color={Colors.dark.success} />
        <Text style={styles.title}>Compound Interest Calculator</Text>
        <Text style={styles.subtitle}>
          See the power of compound interest over time
        </Text>
      </View>

      {/* Input Section */}
      <View style={styles.inputSection}>
        <View style={styles.inputRow}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Initial Investment</Text>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputPrefix}>$</Text>
              <TextInput
                style={styles.input}
                value={principal}
                onChangeText={setPrincipal}
                keyboardType="numeric"
                placeholder="10000"
                placeholderTextColor={Colors.dark.textSecondary}
              />
            </View>
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Annual Rate</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                value={rate}
                onChangeText={setRate}
                keyboardType="numeric"
                placeholder="7"
                placeholderTextColor={Colors.dark.textSecondary}
              />
              <Text style={styles.inputSuffix}>%</Text>
            </View>
          </View>
        </View>

        <View style={styles.inputRow}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Years</Text>
            <TextInput
              style={[styles.input, styles.inputFull]}
              value={years}
              onChangeText={setYears}
              keyboardType="numeric"
              placeholder="20"
              placeholderTextColor={Colors.dark.textSecondary}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Monthly Addition</Text>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputPrefix}>$</Text>
              <TextInput
                style={styles.input}
                value={monthlyContribution}
                onChangeText={setMonthlyContribution}
                keyboardType="numeric"
                placeholder="500"
                placeholderTextColor={Colors.dark.textSecondary}
              />
            </View>
          </View>
        </View>

        <View style={styles.frequencySection}>
          <Text style={styles.inputLabel}>Compound Frequency</Text>
          <View style={styles.frequencyButtons}>
            {(['monthly', 'quarterly', 'annually'] as const).map((freq) => (
              <TouchableOpacity
                key={freq}
                style={[
                  styles.frequencyButton,
                  compoundFrequency === freq && styles.frequencyButtonActive,
                ]}
                onPress={() => setCompoundFrequency(freq)}
              >
                <Text
                  style={[
                    styles.frequencyText,
                    compoundFrequency === freq && styles.frequencyTextActive,
                  ]}
                >
                  {freq.charAt(0).toUpperCase() + freq.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* Results */}
      <View style={styles.resultsSection}>
        <View style={styles.resultCard}>
          <Text style={styles.resultLabel}>Final Balance</Text>
          <Text style={styles.resultValue}>
            ${calculations.finalBalance.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </Text>
        </View>
        <View style={styles.resultsRow}>
          <View style={styles.resultCardSmall}>
            <Text style={styles.resultLabelSmall}>Total Contributed</Text>
            <Text style={styles.resultValueSmall}>
              ${calculations.totalContributions.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </Text>
          </View>
          <View style={styles.resultCardSmall}>
            <Text style={styles.resultLabelSmall}>Interest Earned</Text>
            <Text style={[styles.resultValueSmall, { color: Colors.dark.success }]}>
              ${calculations.totalInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </Text>
          </View>
        </View>
      </View>

      {/* Chart */}
      {renderChart()}

      {/* Key Insights */}
      <View style={styles.insightsSection}>
        <Text style={styles.insightsTitle}>Key Insights</Text>
        <View style={styles.insightCard}>
          <Ionicons name="bulb" size={20} color={Colors.dark.warning} />
          <Text style={styles.insightText}>
            Your money will grow {(calculations.finalBalance / calculations.totalContributions).toFixed(1)}x
            through compound interest!
          </Text>
        </View>
        <View style={styles.insightCard}>
          <Ionicons name="time" size={20} color={Colors.dark.accent} />
          <Text style={styles.insightText}>
            {((calculations.totalInterest / calculations.finalBalance) * 100).toFixed(0)}% of your
            final balance comes from interest earnings, not contributions.
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
  inputSection: {
    padding: 16,
    backgroundColor: Colors.dark.card,
    borderRadius: 16,
    marginHorizontal: 16,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  inputGroup: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 12,
    color: Colors.dark.textSecondary,
    marginBottom: 8,
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
    paddingVertical: 12,
  },
  inputFull: {
    backgroundColor: Colors.dark.background,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  frequencySection: {
    marginTop: 8,
  },
  frequencyButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  frequencyButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: Colors.dark.background,
    alignItems: 'center',
  },
  frequencyButtonActive: {
    backgroundColor: Colors.dark.primary,
  },
  frequencyText: {
    color: Colors.dark.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  frequencyTextActive: {
    color: Colors.dark.text,
  },
  resultsSection: {
    padding: 16,
  },
  resultCard: {
    backgroundColor: Colors.dark.card,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.dark.success + '50',
  },
  resultLabel: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
  },
  resultValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: Colors.dark.success,
    marginTop: 8,
  },
  resultsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  resultCardSmall: {
    flex: 1,
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  resultLabelSmall: {
    fontSize: 12,
    color: Colors.dark.textSecondary,
  },
  resultValueSmall: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.dark.text,
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
    marginBottom: 16,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    marginTop: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 12,
    color: Colors.dark.textSecondary,
  },
  insightsSection: {
    padding: 16,
  },
  insightsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.dark.text,
    marginBottom: 12,
  },
  insightCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 16,
    gap: 12,
    marginBottom: 12,
  },
  insightText: {
    flex: 1,
    color: Colors.dark.text,
    fontSize: 14,
    lineHeight: 20,
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
