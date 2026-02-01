import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Dimensions } from 'react-native';
import Svg, { Path, Line, Rect, Text as SvgText, G, Defs, LinearGradient, Stop, Circle } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface RetirementCalculatorProps {
  onComplete?: (score: number) => void;
}

export function RetirementCalculator({ onComplete }: RetirementCalculatorProps) {
  const [currentAge, setCurrentAge] = useState('30');
  const [retirementAge, setRetirementAge] = useState('65');
  const [currentSavings, setCurrentSavings] = useState('50000');
  const [monthlyContribution, setMonthlyContribution] = useState('1000');
  const [expectedReturn, setExpectedReturn] = useState('7');
  const [desiredIncome, setDesiredIncome] = useState('60000');
  const [socialSecurity, setSocialSecurity] = useState('20000');

  const calculations = useMemo(() => {
    const age = parseInt(currentAge) || 30;
    const retire = parseInt(retirementAge) || 65;
    const savings = parseFloat(currentSavings) || 0;
    const monthly = parseFloat(monthlyContribution) || 0;
    const returnRate = (parseFloat(expectedReturn) || 7) / 100;
    const income = parseFloat(desiredIncome) || 0;
    const ss = parseFloat(socialSecurity) || 0;

    const yearsToRetirement = Math.max(0, retire - age);
    const yearsInRetirement = 30; // Assume 30 years in retirement

    // Calculate future value of current savings
    const futureValueSavings = savings * Math.pow(1 + returnRate, yearsToRetirement);

    // Calculate future value of monthly contributions
    const monthlyRate = returnRate / 12;
    const totalMonths = yearsToRetirement * 12;
    const futureValueContributions = monthly *
      ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) *
      (1 + monthlyRate);

    const totalAtRetirement = futureValueSavings + futureValueContributions;

    // Calculate how much we need
    const annualNeed = income - ss;
    const withdrawalRate = 0.04; // 4% rule
    const neededForRetirement = annualNeed / withdrawalRate;

    // Calculate sustainable annual withdrawal
    const sustainableWithdrawal = totalAtRetirement * withdrawalRate + ss;

    // Gap analysis
    const shortfall = neededForRetirement - totalAtRetirement;
    const onTrack = shortfall <= 0;

    // Calculate additional monthly savings needed
    const additionalMonthlyNeeded = shortfall > 0
      ? (shortfall * monthlyRate) / (Math.pow(1 + monthlyRate, totalMonths) - 1)
      : 0;

    // Generate projection data
    const projectionData = [];
    let balance = savings;
    for (let year = 0; year <= yearsToRetirement + yearsInRetirement; year++) {
      if (year <= yearsToRetirement) {
        // Accumulation phase
        balance = balance * (1 + returnRate) + monthly * 12;
      } else {
        // Withdrawal phase
        balance = balance * (1 + returnRate * 0.6) - annualNeed; // Lower returns in retirement
      }
      projectionData.push({
        age: age + year,
        balance: Math.max(0, balance),
        phase: year <= yearsToRetirement ? 'accumulation' : 'withdrawal',
      });
    }

    return {
      totalAtRetirement,
      neededForRetirement,
      sustainableWithdrawal,
      shortfall,
      onTrack,
      additionalMonthlyNeeded,
      projectionData,
      yearsToRetirement,
    };
  }, [currentAge, retirementAge, currentSavings, monthlyContribution, expectedReturn, desiredIncome, socialSecurity]);

  const renderProjectionChart = () => {
    const data = calculations.projectionData;
    const width = SCREEN_WIDTH - 48;
    const height = 220;
    const padding = { top: 20, right: 20, bottom: 40, left: 60 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    const maxBalance = Math.max(...data.map(d => d.balance));
    const retireAge = parseInt(retirementAge) || 65;

    const getX = (i: number) => padding.left + (i / (data.length - 1)) * chartWidth;
    const getY = (v: number) => padding.top + chartHeight - (v / maxBalance) * chartHeight;

    const accumulationPath = data
      .filter(d => d.phase === 'accumulation')
      .map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.balance)}`)
      .join(' ');

    const withdrawalStartIndex = data.findIndex(d => d.phase === 'withdrawal');
    const withdrawalPath = data
      .filter(d => d.phase === 'withdrawal')
      .map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(withdrawalStartIndex + i)} ${getY(d.balance)}`)
      .join(' ');

    return (
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Retirement Projection</Text>
        <Svg width={width} height={height}>
          <Defs>
            <LinearGradient id="accGradient" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor={Colors.dark.success} stopOpacity={0.3} />
              <Stop offset="100%" stopColor={Colors.dark.success} stopOpacity={0.05} />
            </LinearGradient>
            <LinearGradient id="withGradient" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor={Colors.dark.warning} stopOpacity={0.3} />
              <Stop offset="100%" stopColor={Colors.dark.warning} stopOpacity={0.05} />
            </LinearGradient>
          </Defs>

          {/* Grid */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => (
            <G key={i}>
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
                ${((1 - pct) * maxBalance / 1000000).toFixed(1)}M
              </SvgText>
            </G>
          ))}

          {/* Retirement line */}
          <Line
            x1={getX(calculations.yearsToRetirement)}
            y1={padding.top}
            x2={getX(calculations.yearsToRetirement)}
            y2={padding.top + chartHeight}
            stroke={Colors.dark.primary}
            strokeWidth={2}
            strokeDasharray="6,4"
          />
          <SvgText
            x={getX(calculations.yearsToRetirement)}
            y={padding.top - 5}
            fontSize={10}
            fill={Colors.dark.primary}
            textAnchor="middle"
          >
            Retire
          </SvgText>

          {/* Accumulation area and line */}
          <Path
            d={`${accumulationPath} L ${getX(calculations.yearsToRetirement)} ${padding.top + chartHeight} L ${padding.left} ${padding.top + chartHeight} Z`}
            fill="url(#accGradient)"
          />
          <Path d={accumulationPath} fill="none" stroke={Colors.dark.success} strokeWidth={2} />

          {/* Withdrawal area and line */}
          {withdrawalPath && (
            <>
              <Path
                d={`${withdrawalPath} L ${getX(data.length - 1)} ${padding.top + chartHeight} L ${getX(withdrawalStartIndex)} ${padding.top + chartHeight} Z`}
                fill="url(#withGradient)"
              />
              <Path d={withdrawalPath} fill="none" stroke={Colors.dark.warning} strokeWidth={2} />
            </>
          )}

          {/* Age labels */}
          {[0, Math.floor(data.length / 2), data.length - 1].map((i) => (
            <SvgText
              key={i}
              x={getX(i)}
              y={height - 10}
              fontSize={10}
              fill={Colors.dark.textSecondary}
              textAnchor="middle"
            >
              Age {data[i]?.age}
            </SvgText>
          ))}
        </Svg>

        <View style={styles.chartLegend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendLine, { backgroundColor: Colors.dark.success }]} />
            <Text style={styles.legendText}>Accumulation</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendLine, { backgroundColor: Colors.dark.warning }]} />
            <Text style={styles.legendText}>Withdrawal</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Ionicons name="trending-up" size={32} color={Colors.dark.primary} />
        <Text style={styles.title}>Retirement Calculator</Text>
        <Text style={styles.subtitle}>
          Plan your path to financial freedom
        </Text>
      </View>

      {/* Status Card */}
      <View style={[
        styles.statusCard,
        { borderColor: calculations.onTrack ? Colors.dark.success : Colors.dark.warning }
      ]}>
        <Ionicons
          name={calculations.onTrack ? 'checkmark-circle' : 'warning'}
          size={32}
          color={calculations.onTrack ? Colors.dark.success : Colors.dark.warning}
        />
        <View style={styles.statusContent}>
          <Text style={[
            styles.statusTitle,
            { color: calculations.onTrack ? Colors.dark.success : Colors.dark.warning }
          ]}>
            {calculations.onTrack ? 'On Track!' : 'Needs Attention'}
          </Text>
          <Text style={styles.statusDesc}>
            {calculations.onTrack
              ? 'Your current savings plan meets your retirement goals!'
              : `Consider saving $${Math.round(calculations.additionalMonthlyNeeded).toLocaleString()} more per month`}
          </Text>
        </View>
      </View>

      {/* Input Section */}
      <View style={styles.inputCard}>
        <Text style={styles.sectionTitle}>Your Information</Text>

        <View style={styles.inputRow}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Current Age</Text>
            <TextInput
              style={styles.input}
              value={currentAge}
              onChangeText={setCurrentAge}
              keyboardType="numeric"
              placeholderTextColor={Colors.dark.textSecondary}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Retirement Age</Text>
            <TextInput
              style={styles.input}
              value={retirementAge}
              onChangeText={setRetirementAge}
              keyboardType="numeric"
              placeholderTextColor={Colors.dark.textSecondary}
            />
          </View>
        </View>

        <View style={styles.inputRow}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Current Savings</Text>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputPrefix}>$</Text>
              <TextInput
                style={styles.inputWithPrefix}
                value={currentSavings}
                onChangeText={setCurrentSavings}
                keyboardType="numeric"
                placeholderTextColor={Colors.dark.textSecondary}
              />
            </View>
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Monthly Savings</Text>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputPrefix}>$</Text>
              <TextInput
                style={styles.inputWithPrefix}
                value={monthlyContribution}
                onChangeText={setMonthlyContribution}
                keyboardType="numeric"
                placeholderTextColor={Colors.dark.textSecondary}
              />
            </View>
          </View>
        </View>

        <View style={styles.inputRow}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Expected Return</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.inputWithPrefix}
                value={expectedReturn}
                onChangeText={setExpectedReturn}
                keyboardType="numeric"
                placeholderTextColor={Colors.dark.textSecondary}
              />
              <Text style={styles.inputSuffix}>%</Text>
            </View>
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Desired Income</Text>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputPrefix}>$</Text>
              <TextInput
                style={styles.inputWithPrefix}
                value={desiredIncome}
                onChangeText={setDesiredIncome}
                keyboardType="numeric"
                placeholderTextColor={Colors.dark.textSecondary}
              />
            </View>
          </View>
        </View>
      </View>

      {/* Results */}
      <View style={styles.resultsCard}>
        <Text style={styles.sectionTitle}>Retirement Summary</Text>

        <View style={styles.resultItem}>
          <View style={styles.resultIcon}>
            <Ionicons name="wallet" size={24} color={Colors.dark.success} />
          </View>
          <View style={styles.resultContent}>
            <Text style={styles.resultLabel}>Projected at Retirement</Text>
            <Text style={styles.resultValue}>
              ${Math.round(calculations.totalAtRetirement).toLocaleString()}
            </Text>
          </View>
        </View>

        <View style={styles.resultItem}>
          <View style={styles.resultIcon}>
            <Ionicons name="flag" size={24} color={Colors.dark.primary} />
          </View>
          <View style={styles.resultContent}>
            <Text style={styles.resultLabel}>Amount Needed</Text>
            <Text style={styles.resultValue}>
              ${Math.round(calculations.neededForRetirement).toLocaleString()}
            </Text>
          </View>
        </View>

        <View style={styles.resultItem}>
          <View style={styles.resultIcon}>
            <Ionicons name="cash" size={24} color={Colors.dark.warning} />
          </View>
          <View style={styles.resultContent}>
            <Text style={styles.resultLabel}>Annual Income (4% Rule)</Text>
            <Text style={styles.resultValue}>
              ${Math.round(calculations.sustainableWithdrawal).toLocaleString()}/year
            </Text>
          </View>
        </View>

        <View style={styles.resultItem}>
          <View style={styles.resultIcon}>
            <Ionicons
              name={calculations.onTrack ? 'thumbs-up' : 'alert-circle'}
              size={24}
              color={calculations.onTrack ? Colors.dark.success : Colors.dark.error}
            />
          </View>
          <View style={styles.resultContent}>
            <Text style={styles.resultLabel}>
              {calculations.onTrack ? 'Surplus' : 'Shortfall'}
            </Text>
            <Text style={[
              styles.resultValue,
              { color: calculations.onTrack ? Colors.dark.success : Colors.dark.error }
            ]}>
              ${Math.abs(Math.round(calculations.shortfall)).toLocaleString()}
            </Text>
          </View>
        </View>
      </View>

      {/* Chart */}
      {renderProjectionChart()}

      {/* Tips */}
      <View style={styles.tipsCard}>
        <Text style={styles.sectionTitle}>Tips to Boost Your Retirement</Text>

        <View style={styles.tipItem}>
          <View style={[styles.tipNumber, { backgroundColor: Colors.dark.primary + '20' }]}>
            <Text style={[styles.tipNumberText, { color: Colors.dark.primary }]}>1</Text>
          </View>
          <Text style={styles.tipText}>
            Maximize employer 401(k) match - it's free money!
          </Text>
        </View>

        <View style={styles.tipItem}>
          <View style={[styles.tipNumber, { backgroundColor: Colors.dark.success + '20' }]}>
            <Text style={[styles.tipNumberText, { color: Colors.dark.success }]}>2</Text>
          </View>
          <Text style={styles.tipText}>
            Consider a Roth IRA for tax-free withdrawals in retirement.
          </Text>
        </View>

        <View style={styles.tipItem}>
          <View style={[styles.tipNumber, { backgroundColor: Colors.dark.warning + '20' }]}>
            <Text style={[styles.tipNumberText, { color: Colors.dark.warning }]}>3</Text>
          </View>
          <Text style={styles.tipText}>
            Increase contributions by 1% each year with raises.
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
  },
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.card,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    borderWidth: 2,
    gap: 16,
  },
  statusContent: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statusDesc: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
    marginTop: 4,
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
  input: {
    backgroundColor: Colors.dark.background,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: Colors.dark.text,
    fontSize: 16,
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
  inputWithPrefix: {
    flex: 1,
    paddingVertical: 10,
    color: Colors.dark.text,
    fontSize: 16,
  },
  resultsCard: {
    backgroundColor: Colors.dark.card,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  resultIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.dark.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultContent: {
    flex: 1,
  },
  resultLabel: {
    fontSize: 12,
    color: Colors.dark.textSecondary,
  },
  resultValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.dark.text,
    marginTop: 2,
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
    gap: 24,
    marginTop: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendLine: {
    width: 20,
    height: 3,
    borderRadius: 2,
  },
  legendText: {
    fontSize: 12,
    color: Colors.dark.textSecondary,
  },
  tipsCard: {
    backgroundColor: Colors.dark.card,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 12,
  },
  tipNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tipNumberText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: Colors.dark.text,
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
