import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import Svg, { Path, Line, Circle, Text as SvgText, Rect, G, Defs, LinearGradient, Stop } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface ChartPattern {
  id: string;
  name: string;
  type: 'bullish' | 'bearish' | 'neutral';
  description: string;
  points: { x: number; y: number }[];
  keyLevels?: { y: number; label: string; type: 'support' | 'resistance' }[];
}

const patterns: ChartPattern[] = [
  {
    id: 'uptrend',
    name: 'Uptrend',
    type: 'bullish',
    description: 'Higher highs and higher lows indicate bullish momentum',
    points: [
      { x: 0, y: 80 }, { x: 15, y: 60 }, { x: 30, y: 70 }, { x: 45, y: 45 },
      { x: 60, y: 55 }, { x: 75, y: 35 }, { x: 90, y: 45 }, { x: 100, y: 25 },
    ],
    keyLevels: [
      { y: 35, label: 'Support', type: 'support' },
    ],
  },
  {
    id: 'downtrend',
    name: 'Downtrend',
    type: 'bearish',
    description: 'Lower highs and lower lows indicate bearish momentum',
    points: [
      { x: 0, y: 20 }, { x: 15, y: 35 }, { x: 30, y: 25 }, { x: 45, y: 45 },
      { x: 60, y: 40 }, { x: 75, y: 60 }, { x: 90, y: 55 }, { x: 100, y: 75 },
    ],
    keyLevels: [
      { y: 60, label: 'Resistance', type: 'resistance' },
    ],
  },
  {
    id: 'headshoulders',
    name: 'Head & Shoulders',
    type: 'bearish',
    description: 'Reversal pattern with three peaks, middle being highest',
    points: [
      { x: 0, y: 70 }, { x: 15, y: 45 }, { x: 25, y: 60 }, { x: 35, y: 20 },
      { x: 45, y: 55 }, { x: 55, y: 40 }, { x: 65, y: 55 }, { x: 80, y: 65 },
      { x: 100, y: 85 },
    ],
    keyLevels: [
      { y: 55, label: 'Neckline', type: 'support' },
    ],
  },
  {
    id: 'doublebottom',
    name: 'Double Bottom',
    type: 'bullish',
    description: 'Two consecutive lows at similar price, signaling reversal',
    points: [
      { x: 0, y: 30 }, { x: 15, y: 50 }, { x: 30, y: 75 }, { x: 45, y: 50 },
      { x: 60, y: 75 }, { x: 75, y: 45 }, { x: 100, y: 25 },
    ],
    keyLevels: [
      { y: 75, label: 'Support', type: 'support' },
      { y: 50, label: 'Neckline', type: 'resistance' },
    ],
  },
  {
    id: 'triangle',
    name: 'Ascending Triangle',
    type: 'bullish',
    description: 'Higher lows converging toward flat resistance',
    points: [
      { x: 0, y: 70 }, { x: 10, y: 35 }, { x: 25, y: 60 }, { x: 35, y: 35 },
      { x: 50, y: 50 }, { x: 60, y: 35 }, { x: 75, y: 45 }, { x: 85, y: 35 },
      { x: 100, y: 20 },
    ],
    keyLevels: [
      { y: 35, label: 'Resistance', type: 'resistance' },
    ],
  },
  {
    id: 'cup',
    name: 'Cup & Handle',
    type: 'bullish',
    description: 'Rounded bottom followed by small consolidation',
    points: [
      { x: 0, y: 30 }, { x: 10, y: 45 }, { x: 25, y: 65 }, { x: 40, y: 70 },
      { x: 55, y: 65 }, { x: 70, y: 45 }, { x: 80, y: 30 }, { x: 88, y: 40 },
      { x: 95, y: 35 }, { x: 100, y: 20 },
    ],
  },
];

interface TechnicalAnalysisLessonProps {
  onComplete?: (score: number) => void;
}

export function TechnicalAnalysisLesson({ onComplete }: TechnicalAnalysisLessonProps) {
  const [selectedPattern, setSelectedPattern] = useState<ChartPattern>(patterns[0]);
  const [quizMode, setQuizMode] = useState(false);
  const [quizIndex, setQuizIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);

  const renderPatternChart = (pattern: ChartPattern, width = SCREEN_WIDTH - 64, height = 180) => {
    const padding = { top: 20, right: 20, bottom: 20, left: 20 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    const scaleX = (x: number) => padding.left + (x / 100) * chartWidth;
    const scaleY = (y: number) => padding.top + (y / 100) * chartHeight;

    const pathData = pattern.points
      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${scaleX(p.x)} ${scaleY(p.y)}`)
      .join(' ');

    const areaPath = `${pathData} L ${scaleX(100)} ${height - padding.bottom} L ${scaleX(0)} ${height - padding.bottom} Z`;

    const patternColor = pattern.type === 'bullish' ? Colors.dark.success :
                         pattern.type === 'bearish' ? Colors.dark.error : Colors.dark.warning;

    return (
      <Svg width={width} height={height}>
        <Defs>
          <LinearGradient id={`gradient-${pattern.id}`} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor={patternColor} stopOpacity={0.3} />
            <Stop offset="100%" stopColor={patternColor} stopOpacity={0.05} />
          </LinearGradient>
        </Defs>

        {/* Grid */}
        {[0.25, 0.5, 0.75].map((pct) => (
          <Line
            key={pct}
            x1={padding.left}
            y1={padding.top + pct * chartHeight}
            x2={width - padding.right}
            y2={padding.top + pct * chartHeight}
            stroke={Colors.dark.border}
            strokeDasharray="4,4"
          />
        ))}

        {/* Key levels */}
        {pattern.keyLevels?.map((level, i) => (
          <G key={i}>
            <Line
              x1={padding.left}
              y1={scaleY(level.y)}
              x2={width - padding.right}
              y2={scaleY(level.y)}
              stroke={level.type === 'support' ? Colors.dark.success : Colors.dark.error}
              strokeWidth={2}
              strokeDasharray="8,4"
            />
            <Rect
              x={width - padding.right - 60}
              y={scaleY(level.y) - 10}
              width={55}
              height={20}
              fill={level.type === 'support' ? Colors.dark.success : Colors.dark.error}
              rx={4}
            />
            <SvgText
              x={width - padding.right - 32}
              y={scaleY(level.y) + 4}
              fontSize={10}
              fill={Colors.dark.text}
              textAnchor="middle"
            >
              {level.label}
            </SvgText>
          </G>
        ))}

        {/* Area fill */}
        <Path d={areaPath} fill={`url(#gradient-${pattern.id})`} />

        {/* Line */}
        <Path
          d={pathData}
          stroke={patternColor}
          strokeWidth={3}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Points */}
        {pattern.points.map((p, i) => (
          <Circle
            key={i}
            cx={scaleX(p.x)}
            cy={scaleY(p.y)}
            r={4}
            fill={patternColor}
          />
        ))}
      </Svg>
    );
  };

  const handleQuizAnswer = (answer: ChartPattern) => {
    if (answered) return;
    setAnswered(true);

    if (answer.id === patterns[quizIndex].id) {
      setScore(prev => prev + 1);
    }

    setTimeout(() => {
      if (quizIndex < patterns.length - 1) {
        setQuizIndex(prev => prev + 1);
        setAnswered(false);
      }
    }, 1500);
  };

  if (quizMode) {
    const currentPattern = patterns[quizIndex];
    const options = [...patterns].sort(() => Math.random() - 0.5).slice(0, 4);
    if (!options.find(o => o.id === currentPattern.id)) {
      options[0] = currentPattern;
    }

    return (
      <ScrollView style={styles.container}>
        <View style={styles.quizHeader}>
          <TouchableOpacity onPress={() => setQuizMode(false)} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={Colors.dark.text} />
          </TouchableOpacity>
          <Text style={styles.quizTitle}>Pattern Quiz</Text>
          <Text style={styles.quizScore}>Score: {score}/{patterns.length}</Text>
        </View>

        <View style={styles.quizProgress}>
          {patterns.map((_, i) => (
            <View
              key={i}
              style={[
                styles.progressDot,
                i < quizIndex && styles.progressDotComplete,
                i === quizIndex && styles.progressDotCurrent,
              ]}
            />
          ))}
        </View>

        <View style={styles.chartCard}>
          <Text style={styles.quizQuestion}>What pattern is this?</Text>
          {renderPatternChart(currentPattern)}
        </View>

        <View style={styles.optionsGrid}>
          {options.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.optionButton,
                answered && option.id === currentPattern.id && styles.optionCorrect,
                answered && option.id !== currentPattern.id && styles.optionWrong,
              ]}
              onPress={() => handleQuizAnswer(option)}
              disabled={answered}
            >
              <Text style={styles.optionText}>{option.name}</Text>
              <View style={[
                styles.optionBadge,
                { backgroundColor: option.type === 'bullish' ? Colors.dark.success + '30' :
                                  option.type === 'bearish' ? Colors.dark.error + '30' : Colors.dark.warning + '30' }
              ]}>
                <Text style={[
                  styles.optionBadgeText,
                  { color: option.type === 'bullish' ? Colors.dark.success :
                          option.type === 'bearish' ? Colors.dark.error : Colors.dark.warning }
                ]}>
                  {option.type}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {quizIndex === patterns.length - 1 && answered && (
          <TouchableOpacity
            style={styles.completeButton}
            onPress={() => onComplete?.(Math.round((score / patterns.length) * 100))}
          >
            <Text style={styles.completeButtonText}>
              Finish Quiz ({Math.round((score / patterns.length) * 100)}%)
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Ionicons name="analytics" size={32} color={Colors.dark.primary} />
        <Text style={styles.title}>Technical Analysis</Text>
        <Text style={styles.subtitle}>
          Learn to read charts and identify patterns
        </Text>
      </View>

      {/* Pattern Selector */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.patternSelector}
        contentContainerStyle={styles.patternSelectorContent}
      >
        {patterns.map((pattern) => (
          <TouchableOpacity
            key={pattern.id}
            style={[
              styles.patternTab,
              selectedPattern.id === pattern.id && styles.patternTabActive,
            ]}
            onPress={() => setSelectedPattern(pattern)}
          >
            <View style={[
              styles.patternIndicator,
              { backgroundColor: pattern.type === 'bullish' ? Colors.dark.success :
                                pattern.type === 'bearish' ? Colors.dark.error : Colors.dark.warning }
            ]} />
            <Text style={[
              styles.patternTabText,
              selectedPattern.id === pattern.id && styles.patternTabTextActive,
            ]}>
              {pattern.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Selected Pattern Display */}
      <View style={styles.patternCard}>
        <View style={styles.patternHeader}>
          <Text style={styles.patternName}>{selectedPattern.name}</Text>
          <View style={[
            styles.typeBadge,
            { backgroundColor: selectedPattern.type === 'bullish' ? Colors.dark.success + '20' :
                              selectedPattern.type === 'bearish' ? Colors.dark.error + '20' : Colors.dark.warning + '20' }
          ]}>
            <Ionicons
              name={selectedPattern.type === 'bullish' ? 'arrow-up' :
                    selectedPattern.type === 'bearish' ? 'arrow-down' : 'remove'}
              size={16}
              color={selectedPattern.type === 'bullish' ? Colors.dark.success :
                     selectedPattern.type === 'bearish' ? Colors.dark.error : Colors.dark.warning}
            />
            <Text style={[
              styles.typeBadgeText,
              { color: selectedPattern.type === 'bullish' ? Colors.dark.success :
                       selectedPattern.type === 'bearish' ? Colors.dark.error : Colors.dark.warning }
            ]}>
              {selectedPattern.type}
            </Text>
          </View>
        </View>

        {renderPatternChart(selectedPattern)}

        <Text style={styles.patternDescription}>{selectedPattern.description}</Text>
      </View>

      {/* Key Concepts */}
      <View style={styles.conceptsCard}>
        <Text style={styles.sectionTitle}>Key Concepts</Text>

        <View style={styles.conceptItem}>
          <View style={[styles.conceptIcon, { backgroundColor: Colors.dark.success + '20' }]}>
            <Ionicons name="trending-up" size={20} color={Colors.dark.success} />
          </View>
          <View style={styles.conceptContent}>
            <Text style={styles.conceptName}>Support Levels</Text>
            <Text style={styles.conceptDesc}>
              Price levels where buying pressure tends to overcome selling pressure,
              preventing further decline.
            </Text>
          </View>
        </View>

        <View style={styles.conceptItem}>
          <View style={[styles.conceptIcon, { backgroundColor: Colors.dark.error + '20' }]}>
            <Ionicons name="trending-down" size={20} color={Colors.dark.error} />
          </View>
          <View style={styles.conceptContent}>
            <Text style={styles.conceptName}>Resistance Levels</Text>
            <Text style={styles.conceptDesc}>
              Price levels where selling pressure tends to overcome buying pressure,
              preventing further rise.
            </Text>
          </View>
        </View>

        <View style={styles.conceptItem}>
          <View style={[styles.conceptIcon, { backgroundColor: Colors.dark.primary + '20' }]}>
            <Ionicons name="git-compare" size={20} color={Colors.dark.primary} />
          </View>
          <View style={styles.conceptContent}>
            <Text style={styles.conceptName}>Trend Lines</Text>
            <Text style={styles.conceptDesc}>
              Lines connecting consecutive highs or lows to visualize the overall
              direction of price movement.
            </Text>
          </View>
        </View>
      </View>

      {/* Start Quiz Button */}
      <TouchableOpacity
        style={styles.quizButton}
        onPress={() => {
          setQuizMode(true);
          setQuizIndex(0);
          setScore(0);
          setAnswered(false);
        }}
      >
        <Ionicons name="school" size={24} color={Colors.dark.text} />
        <Text style={styles.quizButtonText}>Test Your Knowledge</Text>
      </TouchableOpacity>

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
  patternSelector: {
    marginBottom: 16,
  },
  patternSelectorContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  patternTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: Colors.dark.card,
    borderRadius: 20,
    marginRight: 8,
    gap: 6,
  },
  patternTabActive: {
    backgroundColor: Colors.dark.primary + '30',
    borderWidth: 1,
    borderColor: Colors.dark.primary,
  },
  patternIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  patternTabText: {
    fontSize: 13,
    color: Colors.dark.textSecondary,
  },
  patternTabTextActive: {
    color: Colors.dark.text,
    fontWeight: '600',
  },
  patternCard: {
    backgroundColor: Colors.dark.card,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  patternHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  patternName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.dark.text,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  typeBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  patternDescription: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
    lineHeight: 20,
    marginTop: 12,
  },
  conceptsCard: {
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
  conceptItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  conceptIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  conceptContent: {
    flex: 1,
    marginLeft: 12,
  },
  conceptName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.dark.text,
    marginBottom: 4,
  },
  conceptDesc: {
    fontSize: 13,
    color: Colors.dark.textSecondary,
    lineHeight: 18,
  },
  quizButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.dark.accent,
    marginHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    marginBottom: 12,
  },
  quizButtonText: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: '600',
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.dark.primary,
    marginHorizontal: 16,
    marginVertical: 16,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  completeButtonText: {
    color: Colors.dark.text,
    fontSize: 18,
    fontWeight: '600',
  },
  // Quiz styles
  quizHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  backButton: {
    padding: 8,
  },
  quizTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.dark.text,
  },
  quizScore: {
    fontSize: 14,
    color: Colors.dark.primary,
    fontWeight: '600',
  },
  quizProgress: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.dark.border,
  },
  progressDotComplete: {
    backgroundColor: Colors.dark.success,
  },
  progressDotCurrent: {
    backgroundColor: Colors.dark.primary,
    transform: [{ scale: 1.2 }],
  },
  chartCard: {
    backgroundColor: Colors.dark.card,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  quizQuestion: {
    fontSize: 16,
    color: Colors.dark.text,
    textAlign: 'center',
    marginBottom: 16,
  },
  optionsGrid: {
    paddingHorizontal: 16,
    gap: 12,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.dark.card,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionCorrect: {
    borderColor: Colors.dark.success,
    backgroundColor: Colors.dark.success + '20',
  },
  optionWrong: {
    borderColor: Colors.dark.error,
    backgroundColor: Colors.dark.error + '20',
  },
  optionText: {
    fontSize: 16,
    color: Colors.dark.text,
    fontWeight: '500',
  },
  optionBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  optionBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
});
