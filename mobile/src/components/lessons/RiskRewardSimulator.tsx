import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import Svg, { Rect, Text as SvgText, Line, Circle, Path } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface Scenario {
  id: string;
  title: string;
  description: string;
  riskLevel: 'low' | 'medium' | 'high';
  potentialReturn: number;
  potentialLoss: number;
  probability: number;
  icon: string;
}

const scenarios: Scenario[] = [
  {
    id: 'savings',
    title: 'High-Yield Savings',
    description: 'Park your money in a savings account with FDIC insurance',
    riskLevel: 'low',
    potentialReturn: 5,
    potentialLoss: 0,
    probability: 99,
    icon: 'shield-checkmark',
  },
  {
    id: 'bonds',
    title: 'Government Bonds',
    description: 'Invest in Treasury bonds backed by the US government',
    riskLevel: 'low',
    potentialReturn: 6,
    potentialLoss: 2,
    probability: 95,
    icon: 'document-text',
  },
  {
    id: 'index',
    title: 'S&P 500 Index Fund',
    description: 'Diversified investment tracking the top 500 US companies',
    riskLevel: 'medium',
    potentialReturn: 12,
    potentialLoss: 20,
    probability: 75,
    icon: 'analytics',
  },
  {
    id: 'growth',
    title: 'Growth Stocks',
    description: 'Individual high-growth tech company stocks',
    riskLevel: 'medium',
    potentialReturn: 25,
    potentialLoss: 40,
    probability: 60,
    icon: 'trending-up',
  },
  {
    id: 'crypto',
    title: 'Cryptocurrency',
    description: 'Volatile digital assets like Bitcoin or Ethereum',
    riskLevel: 'high',
    potentialReturn: 100,
    potentialLoss: 80,
    probability: 40,
    icon: 'logo-bitcoin',
  },
  {
    id: 'options',
    title: 'Options Trading',
    description: 'Leveraged derivative contracts on stocks',
    riskLevel: 'high',
    potentialReturn: 200,
    potentialLoss: 100,
    probability: 25,
    icon: 'layers',
  },
];

interface RiskRewardSimulatorProps {
  onComplete?: (score: number) => void;
}

export function RiskRewardSimulator({ onComplete }: RiskRewardSimulatorProps) {
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [simulationResult, setSimulationResult] = useState<'win' | 'loss' | null>(null);
  const [totalRuns, setTotalRuns] = useState(0);
  const [wins, setWins] = useState(0);
  const [balance, setBalance] = useState(10000);
  const [investmentAmount, setInvestmentAmount] = useState(1000);

  const runSimulation = () => {
    if (!selectedScenario) return;

    const random = Math.random() * 100;
    const won = random < selectedScenario.probability;

    setSimulationResult(won ? 'win' : 'loss');
    setTotalRuns(prev => prev + 1);

    if (won) {
      setWins(prev => prev + 1);
      const profit = investmentAmount * (selectedScenario.potentialReturn / 100);
      setBalance(prev => prev + profit);
    } else {
      const loss = investmentAmount * (selectedScenario.potentialLoss / 100);
      setBalance(prev => Math.max(0, prev - loss));
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return Colors.dark.success;
      case 'medium': return Colors.dark.warning;
      case 'high': return Colors.dark.error;
      default: return Colors.dark.textSecondary;
    }
  };

  const renderRiskMeter = (scenario: Scenario) => {
    const width = 120;
    const height = 60;
    const centerX = width / 2;
    const centerY = height - 5;
    const radius = 50;

    const riskAngle = scenario.riskLevel === 'low' ? -60 :
                      scenario.riskLevel === 'medium' ? 0 : 60;
    const riskRad = (riskAngle - 90) * Math.PI / 180;
    const needleX = centerX + (radius - 10) * Math.cos(riskRad);
    const needleY = centerY + (radius - 10) * Math.sin(riskRad);

    return (
      <Svg width={width} height={height}>
        {/* Arc segments */}
        <Path
          d={`M ${centerX - radius} ${centerY} A ${radius} ${radius} 0 0 1 ${centerX} ${centerY - radius}`}
          stroke={Colors.dark.success}
          strokeWidth={8}
          fill="none"
        />
        <Path
          d={`M ${centerX} ${centerY - radius} A ${radius} ${radius} 0 0 1 ${centerX + radius * 0.7} ${centerY - radius * 0.7}`}
          stroke={Colors.dark.warning}
          strokeWidth={8}
          fill="none"
        />
        <Path
          d={`M ${centerX + radius * 0.7} ${centerY - radius * 0.7} A ${radius} ${radius} 0 0 1 ${centerX + radius} ${centerY}`}
          stroke={Colors.dark.error}
          strokeWidth={8}
          fill="none"
        />
        {/* Needle */}
        <Line
          x1={centerX}
          y1={centerY}
          x2={needleX}
          y2={needleY}
          stroke={Colors.dark.text}
          strokeWidth={3}
        />
        <Circle cx={centerX} cy={centerY} r={5} fill={Colors.dark.text} />
      </Svg>
    );
  };

  const renderReturnChart = (scenario: Scenario) => {
    const width = SCREEN_WIDTH - 80;
    const height = 100;
    const centerY = height / 2;
    const barHeight = 24;

    const maxValue = Math.max(scenario.potentialReturn, scenario.potentialLoss);
    const scale = (width - 100) / 2 / maxValue;

    const returnWidth = scenario.potentialReturn * scale;
    const lossWidth = scenario.potentialLoss * scale;

    return (
      <View style={styles.returnChart}>
        <Svg width={width} height={height}>
          {/* Center line */}
          <Line
            x1={width / 2}
            y1={10}
            x2={width / 2}
            y2={height - 10}
            stroke={Colors.dark.border}
            strokeWidth={2}
          />

          {/* Loss bar (left) */}
          <Rect
            x={width / 2 - lossWidth}
            y={centerY - barHeight / 2}
            width={lossWidth}
            height={barHeight}
            fill={Colors.dark.error}
            rx={4}
          />
          <SvgText
            x={width / 2 - lossWidth - 8}
            y={centerY + 5}
            fontSize={12}
            fill={Colors.dark.error}
            textAnchor="end"
          >
            -{scenario.potentialLoss}%
          </SvgText>

          {/* Return bar (right) */}
          <Rect
            x={width / 2}
            y={centerY - barHeight / 2}
            width={returnWidth}
            height={barHeight}
            fill={Colors.dark.success}
            rx={4}
          />
          <SvgText
            x={width / 2 + returnWidth + 8}
            y={centerY + 5}
            fontSize={12}
            fill={Colors.dark.success}
            textAnchor="start"
          >
            +{scenario.potentialReturn}%
          </SvgText>

          {/* Probability label */}
          <SvgText
            x={width / 2}
            y={height - 5}
            fontSize={11}
            fill={Colors.dark.textSecondary}
            textAnchor="middle"
          >
            {scenario.probability}% chance of profit
          </SvgText>
        </Svg>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Ionicons name="scale" size={32} color={Colors.dark.primary} />
        <Text style={styles.title}>Risk vs Reward Simulator</Text>
        <Text style={styles.subtitle}>
          Understand the relationship between risk and potential returns
        </Text>
      </View>

      {/* Balance Display */}
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Your Balance</Text>
        <Text style={styles.balanceValue}>${balance.toLocaleString()}</Text>
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{totalRuns}</Text>
            <Text style={styles.statLabel}>Trades</Text>
          </View>
          <View style={styles.stat}>
            <Text style={[styles.statValue, { color: Colors.dark.success }]}>{wins}</Text>
            <Text style={styles.statLabel}>Wins</Text>
          </View>
          <View style={styles.stat}>
            <Text style={[styles.statValue, { color: Colors.dark.error }]}>{totalRuns - wins}</Text>
            <Text style={styles.statLabel}>Losses</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>
              {totalRuns > 0 ? ((wins / totalRuns) * 100).toFixed(0) : 0}%
            </Text>
            <Text style={styles.statLabel}>Win Rate</Text>
          </View>
        </View>
      </View>

      {/* Investment Scenarios */}
      <Text style={styles.sectionTitle}>Select an Investment</Text>
      <View style={styles.scenariosGrid}>
        {scenarios.map((scenario) => (
          <TouchableOpacity
            key={scenario.id}
            style={[
              styles.scenarioCard,
              selectedScenario?.id === scenario.id && styles.scenarioCardSelected,
            ]}
            onPress={() => {
              setSelectedScenario(scenario);
              setSimulationResult(null);
            }}
          >
            <View style={styles.scenarioHeader}>
              <View style={[styles.scenarioIcon, { backgroundColor: getRiskColor(scenario.riskLevel) + '20' }]}>
                <Ionicons name={scenario.icon as any} size={24} color={getRiskColor(scenario.riskLevel)} />
              </View>
              <View style={[styles.riskBadge, { backgroundColor: getRiskColor(scenario.riskLevel) + '20' }]}>
                <Text style={[styles.riskBadgeText, { color: getRiskColor(scenario.riskLevel) }]}>
                  {scenario.riskLevel.toUpperCase()}
                </Text>
              </View>
            </View>
            <Text style={styles.scenarioTitle}>{scenario.title}</Text>
            <Text style={styles.scenarioDesc}>{scenario.description}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Selected Scenario Details */}
      {selectedScenario && (
        <View style={styles.detailsCard}>
          <Text style={styles.detailsTitle}>{selectedScenario.title} Analysis</Text>

          <View style={styles.meterContainer}>
            {renderRiskMeter(selectedScenario)}
            <View style={styles.meterLabels}>
              <Text style={[styles.meterLabel, { color: Colors.dark.success }]}>Low</Text>
              <Text style={[styles.meterLabel, { color: Colors.dark.warning }]}>Med</Text>
              <Text style={[styles.meterLabel, { color: Colors.dark.error }]}>High</Text>
            </View>
          </View>

          {renderReturnChart(selectedScenario)}

          {/* Simulate Button */}
          <TouchableOpacity
            style={styles.simulateButton}
            onPress={runSimulation}
            disabled={balance < investmentAmount}
          >
            <Ionicons name="play" size={24} color={Colors.dark.text} />
            <Text style={styles.simulateButtonText}>
              Invest ${investmentAmount.toLocaleString()}
            </Text>
          </TouchableOpacity>

          {/* Result Display */}
          {simulationResult && (
            <View style={[
              styles.resultCard,
              { backgroundColor: simulationResult === 'win' ? Colors.dark.success + '20' : Colors.dark.error + '20' }
            ]}>
              <Ionicons
                name={simulationResult === 'win' ? 'checkmark-circle' : 'close-circle'}
                size={32}
                color={simulationResult === 'win' ? Colors.dark.success : Colors.dark.error}
              />
              <Text style={[
                styles.resultText,
                { color: simulationResult === 'win' ? Colors.dark.success : Colors.dark.error }
              ]}>
                {simulationResult === 'win'
                  ? `+$${(investmentAmount * selectedScenario.potentialReturn / 100).toFixed(0)} Profit!`
                  : `-$${(investmentAmount * selectedScenario.potentialLoss / 100).toFixed(0)} Loss`
                }
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Key Lessons */}
      <View style={styles.lessonsCard}>
        <Text style={styles.lessonsTitle}>Key Lessons</Text>
        <View style={styles.lessonItem}>
          <Ionicons name="information-circle" size={20} color={Colors.dark.accent} />
          <Text style={styles.lessonText}>
            Higher potential returns always come with higher risk of losses.
          </Text>
        </View>
        <View style={styles.lessonItem}>
          <Ionicons name="information-circle" size={20} color={Colors.dark.accent} />
          <Text style={styles.lessonText}>
            Diversification across risk levels helps balance your portfolio.
          </Text>
        </View>
        <View style={styles.lessonItem}>
          <Ionicons name="information-circle" size={20} color={Colors.dark.accent} />
          <Text style={styles.lessonText}>
            Your risk tolerance should match your investment timeline.
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
  balanceCard: {
    backgroundColor: Colors.dark.card,
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 24,
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
  },
  balanceValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: Colors.dark.text,
    marginVertical: 8,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.dark.border,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.dark.text,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.dark.textSecondary,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.dark.text,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  scenariosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    gap: 8,
  },
  scenarioCard: {
    width: (SCREEN_WIDTH - 40) / 2,
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  scenarioCardSelected: {
    borderColor: Colors.dark.primary,
  },
  scenarioHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  scenarioIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  riskBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  riskBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  scenarioTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.dark.text,
    marginBottom: 4,
  },
  scenarioDesc: {
    fontSize: 11,
    color: Colors.dark.textSecondary,
    lineHeight: 16,
  },
  detailsCard: {
    backgroundColor: Colors.dark.card,
    borderRadius: 16,
    padding: 20,
    margin: 16,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.dark.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  meterContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  meterLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 120,
    marginTop: 4,
  },
  meterLabel: {
    fontSize: 10,
    fontWeight: '600',
  },
  returnChart: {
    alignItems: 'center',
    marginBottom: 16,
  },
  simulateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.dark.primary,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  simulateButtonText: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: '600',
  },
  resultCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    gap: 12,
  },
  resultText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  lessonsCard: {
    backgroundColor: Colors.dark.card,
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  lessonsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.dark.text,
    marginBottom: 12,
  },
  lessonItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 12,
  },
  lessonText: {
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
