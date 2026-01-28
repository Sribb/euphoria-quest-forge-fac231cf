import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import Toast from 'react-native-toast-message';

import { useGames } from '@/hooks/useGames';
import { useXPSystem } from '@/hooks/useXPSystem';
import { Button, Card, Badge, LoadingScreen, Progress } from '@/components/ui';
import { Colors, FontSizes, Spacing, BorderRadius } from '@/constants/theme';

const { width } = Dimensions.get('window');

interface GameConfig {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  difficulty: string;
  reward: number;
  questionCount: number;
}

// Full game configurations matching web app
const gameConfigs: GameConfig[] = [
  {
    id: 'trend-master',
    title: 'Trend Master',
    description: 'Identify 20+ chart patterns and predict market movements',
    icon: 'trending-up',
    color: '#22c55e',
    difficulty: 'Medium',
    reward: 100,
    questionCount: 10,
  },
  {
    id: 'life-sim',
    title: 'Life Sim: Investor Journey',
    description: 'Make financial decisions through a 40-year life simulation',
    icon: 'person',
    color: '#3b82f6',
    difficulty: 'Easy',
    reward: 150,
    questionCount: 10,
  },
  {
    id: 'ai-challenge',
    title: 'AI Trading Challenge',
    description: 'Compete against 4 AI traders with unique strategies',
    icon: 'hardware-chip',
    color: '#8b5cf6',
    difficulty: 'Hard',
    reward: 200,
    questionCount: 10,
  },
  {
    id: 'market-reaction',
    title: 'Market Reaction',
    description: 'Predict how markets will react to 15 real-world news scenarios',
    icon: 'newspaper',
    color: '#f59e0b',
    difficulty: 'Medium',
    reward: 120,
    questionCount: 10,
  },
  {
    id: 'budget-balancer',
    title: 'Budget Balancer',
    description: 'Master the 50/30/20 budgeting rule through life challenges',
    icon: 'calculator',
    color: '#ec4899',
    difficulty: 'Easy',
    reward: 80,
    questionCount: 5,
  },
];

// ===== TREND MASTER - 21 Chart Patterns =====
const trendMasterScenarios = [
  { pattern: 'uptrend', question: 'What pattern shows higher highs and higher lows?', correctAnswer: 'Uptrend', options: ['Uptrend', 'Downtrend', 'Sideways', 'Triangle'], explanation: 'An uptrend shows a series of higher highs and higher lows, indicating bullish momentum.' },
  { pattern: 'downtrend', question: 'Identify this pattern: lower highs and lower lows', correctAnswer: 'Downtrend', options: ['Uptrend', 'Downtrend', 'Breakout', 'Range-Bound'], explanation: 'A downtrend shows lower highs and lower lows, indicating bearish pressure.' },
  { pattern: 'sideways', question: 'What type of movement shows horizontal price action?', correctAnswer: 'Sideways', options: ['Sideways', 'Uptrend', 'Reversal', 'Parabolic'], explanation: 'Sideways consolidation shows price moving horizontally in a tight range.' },
  { pattern: 'breakout', question: 'Price bursting through resistance is called?', correctAnswer: 'Breakout', options: ['Pullback', 'Breakout', 'Reversal', 'Fakeout'], explanation: 'A breakout occurs when price bursts through a key resistance level with momentum.' },
  { pattern: 'pullback', question: 'A temporary dip in an uptrend is called?', correctAnswer: 'Pullback', options: ['Uptrend', 'Pullback', 'Reversal', 'Correction'], explanation: 'A pullback is a temporary dip to "recharge" before continuing higher.' },
  { pattern: 'reversal', question: 'When momentum flips direction completely?', correctAnswer: 'Reversal', options: ['Continuation', 'Reversal', 'Consolidation', 'Channel'], explanation: 'A reversal is when the trend completely changes direction.' },
  { pattern: 'double-top', question: 'Two peaks at the same level forming M shape?', correctAnswer: 'Double Top', options: ['Double Top', 'Double Bottom', 'Head and Shoulders', 'Cup and Handle'], explanation: 'A double top is a bearish reversal pattern that looks like the letter M.' },
  { pattern: 'double-bottom', question: 'Two troughs at the same level forming W shape?', correctAnswer: 'Double Bottom', options: ['Double Bottom', 'Double Top', 'Triangle', 'Wedge'], explanation: 'A double bottom is a bullish reversal pattern that looks like the letter W.' },
  { pattern: 'head-shoulders', question: 'Three peaks with the middle highest?', correctAnswer: 'Head and Shoulders', options: ['Head and Shoulders', 'Triple Top', 'Flag', 'Pennant'], explanation: 'Head and shoulders is a classic bearish reversal with three peaks.' },
  { pattern: 'cup-handle', question: 'Rounded bottom followed by small pullback?', correctAnswer: 'Cup and Handle', options: ['Cup and Handle', 'Rounding Bottom', 'Saucer', 'Bowl'], explanation: 'Cup and handle is a bullish continuation with a rounded cup and small handle.' },
  { pattern: 'triangle', question: 'Price squeezing between converging lines?', correctAnswer: 'Triangle', options: ['Triangle', 'Wedge', 'Pennant', 'Channel'], explanation: 'A triangle pattern shows price compression before a breakout.' },
  { pattern: 'flag', question: 'Small rectangle after a sharp move?', correctAnswer: 'Flag', options: ['Flag', 'Rectangle', 'Wedge', 'Triangle'], explanation: 'A flag is a continuation pattern showing a brief pause after a sharp move.' },
  { pattern: 'wedge', question: 'Converging lines sloping in the same direction?', correctAnswer: 'Wedge', options: ['Wedge', 'Triangle', 'Channel', 'Flag'], explanation: 'A wedge has converging lines sloping in the same direction, often signaling reversal.' },
  { pattern: 'support-bounce', question: 'Price hitting a floor and rebounding?', correctAnswer: 'Support Bounce', options: ['Support Bounce', 'Resistance Bounce', 'Breakdown', 'Fakeout'], explanation: 'A support bounce occurs when price hits support and rebounds upward.' },
  { pattern: 'resistance-bounce', question: 'Price hitting a ceiling and falling back?', correctAnswer: 'Resistance Bounce', options: ['Resistance Bounce', 'Support Bounce', 'Breakout', 'Retest'], explanation: 'A resistance bounce occurs when price hits resistance and falls back.' },
  { pattern: 'channel', question: 'Price moving between parallel trendlines?', correctAnswer: 'Channel', options: ['Channel', 'Range-Bound', 'Triangle', 'Wedge'], explanation: 'A channel shows price trending while bouncing between parallel lines.' },
  { pattern: 'fakeout', question: 'Brief breakout that quickly reverses?', correctAnswer: 'Fakeout', options: ['Fakeout', 'Breakout', 'Breakdown', 'Reversal'], explanation: 'A fakeout is a false breakout that quickly reverses, trapping traders.' },
  { pattern: 'retest', question: 'Price returning to test old resistance as support?', correctAnswer: 'Retest', options: ['Retest', 'Reversal', 'Pullback', 'Fakeout'], explanation: 'A retest confirms a breakout when old resistance becomes new support.' },
  { pattern: 'parabolic', question: 'Accelerating upward curve?', correctAnswer: 'Parabolic', options: ['Parabolic', 'Steady Uptrend', 'Breakout', 'Spike'], explanation: 'A parabolic move shows accelerating price action that is often unsustainable.' },
  { pattern: 'correction', question: 'A 10-20% drop after a strong uptrend?', correctAnswer: 'Correction', options: ['Correction', 'Reversal', 'Crash', 'Pullback'], explanation: 'A correction is a healthy 10-20% drop to correct excessive valuations.' },
];

// ===== MARKET REACTION - 15 News Scenarios =====
const marketReactionScenarios = [
  { news: 'Fed announces surprise 0.50% rate cut', correctAnswer: 'Bullish', options: ['Bullish', 'Bearish', 'Neutral'], explanation: 'Rate cuts make borrowing cheaper, stimulating economic activity and boosting stocks.' },
  { news: 'Apple beats earnings estimates by 25%', correctAnswer: 'Bullish', options: ['Bullish', 'Bearish', 'Neutral'], explanation: 'Strong earnings beat expectations, showing company health and driving stock price up.' },
  { news: 'Unemployment rate rises to 6.5%', correctAnswer: 'Bearish', options: ['Bullish', 'Bearish', 'Neutral'], explanation: 'Rising unemployment signals economic weakness, reducing consumer spending.' },
  { news: 'China announces new tariffs on US goods', correctAnswer: 'Bearish', options: ['Bullish', 'Bearish', 'Neutral'], explanation: 'Trade tensions hurt global commerce and create uncertainty for businesses.' },
  { news: 'Inflation data comes in at expected levels', correctAnswer: 'Neutral', options: ['Bullish', 'Bearish', 'Neutral'], explanation: 'Expected data is already priced in, so markets typically dont react significantly.' },
  { news: 'Major bank announces stock buyback program', correctAnswer: 'Bullish', options: ['Bullish', 'Bearish', 'Neutral'], explanation: 'Buybacks reduce shares outstanding, increasing earnings per share and stock value.' },
  { news: 'Oil prices surge 20% on supply concerns', correctAnswer: 'Bearish', options: ['Bullish', 'Bearish', 'Neutral'], explanation: 'Higher oil prices increase costs for businesses and reduce consumer spending power.' },
  { news: 'Tech giant announces 10,000 layoffs', correctAnswer: 'Bullish', options: ['Bullish', 'Bearish', 'Neutral'], explanation: 'Markets often view layoffs as cost-cutting that improves profit margins.' },
  { news: 'New COVID variant causes travel restrictions', correctAnswer: 'Bearish', options: ['Bullish', 'Bearish', 'Neutral'], explanation: 'Travel restrictions hurt airlines, hotels, and create economic uncertainty.' },
  { news: 'Congress passes major infrastructure bill', correctAnswer: 'Bullish', options: ['Bullish', 'Bearish', 'Neutral'], explanation: 'Government spending on infrastructure creates jobs and boosts industrial sectors.' },
  { news: 'Tesla misses delivery targets by 15%', correctAnswer: 'Bearish', options: ['Bullish', 'Bearish', 'Neutral'], explanation: 'Missing targets signals production or demand problems, disappointing investors.' },
  { news: 'FDA approves blockbuster drug for Pfizer', correctAnswer: 'Bullish', options: ['Bullish', 'Bearish', 'Neutral'], explanation: 'Drug approvals open new revenue streams and boost pharmaceutical stocks.' },
  { news: 'Retail sales decline for third straight month', correctAnswer: 'Bearish', options: ['Bullish', 'Bearish', 'Neutral'], explanation: 'Declining retail sales indicate weakening consumer confidence and spending.' },
  { news: 'Bitcoin ETF receives SEC approval', correctAnswer: 'Bullish', options: ['Bullish', 'Bearish', 'Neutral'], explanation: 'ETF approval increases institutional access and legitimizes cryptocurrency investments.' },
  { news: 'Housing starts fall below expectations', correctAnswer: 'Bearish', options: ['Bullish', 'Bearish', 'Neutral'], explanation: 'Weak housing data signals economic slowdown and reduced construction activity.' },
];

// ===== BUDGET BALANCER - 50/30/20 Scenarios =====
const budgetScenarios = [
  { title: 'Fresh Graduate', income: 4000, question: 'Rent, utilities, groceries should be what % of $4,000?', correctAnswer: '50%', options: ['30%', '50%', '70%', '20%'], explanation: 'The 50/30/20 rule allocates 50% to needs (essential expenses).' },
  { title: 'Fresh Graduate', income: 4000, question: 'Entertainment and dining out should be what % of $4,000?', correctAnswer: '30%', options: ['10%', '20%', '30%', '50%'], explanation: 'The 50/30/20 rule allocates 30% to wants (discretionary spending).' },
  { title: 'Family Provider', income: 8000, question: 'Savings and debt repayment should be what % of $8,000?', correctAnswer: '20%', options: ['10%', '15%', '20%', '30%'], explanation: 'The 50/30/20 rule allocates 20% to savings and debt repayment.' },
  { title: 'Entrepreneur', income: 12000, question: 'With $12,000 income, what dollar amount goes to needs?', correctAnswer: '$6,000', options: ['$3,600', '$4,800', '$6,000', '$7,200'], explanation: '50% of $12,000 = $6,000 for needs.' },
  { title: 'Family Provider', income: 8000, question: 'Following 50/30/20, how much can be spent on wants with $8,000?', correctAnswer: '$2,400', options: ['$1,600', '$2,000', '$2,400', '$4,000'], explanation: '30% of $8,000 = $2,400 for wants.' },
];

// ===== LIFE SIM - 40 Year Journey =====
const lifeSimEvents = [
  { age: 22, event: 'First job offer: $50k salary. Do you...', options: ['Accept and invest 10%', 'Accept and spend freely', 'Negotiate for $55k'], correct: 0, explanation: 'Starting to invest early creates powerful compound growth.' },
  { age: 25, event: 'Car breaks down, $3,000 repair. You have $5,000 saved.', options: ['Use emergency fund', 'Put it on credit card', 'Take out a loan'], correct: 0, explanation: 'Using emergency funds avoids high-interest debt.' },
  { age: 28, event: 'Opportunity to buy a home. Down payment: $40,000', options: ['Save aggressively for 2 years', 'Buy with minimal down', 'Rent and invest'], correct: 2, explanation: 'Renting while investing can build more wealth than a small down payment.' },
  { age: 32, event: 'Job offers $20k raise but requires relocating.', options: ['Take the raise and relocate', 'Stay with smaller raise', 'Negotiate remote work'], correct: 2, explanation: 'Negotiating creative solutions often yields the best outcome.' },
  { age: 35, event: 'Market crashes 30%. Your portfolio drops significantly.', options: ['Panic sell everything', 'Hold and do nothing', 'Buy more at lower prices'], correct: 2, explanation: 'Market downturns are buying opportunities. Markets historically recover.' },
  { age: 40, event: 'Kids college fund decision. They are 10 years from college.', options: ['Start 529 plan now', 'Wait and see', 'Rely on scholarships'], correct: 0, explanation: '10 years of compound growth in a 529 significantly reduces college costs.' },
  { age: 45, event: 'Company offers early retirement package.', options: ['Take it and start business', 'Stay for pension benefits', 'Take it and retire early'], correct: 1, explanation: 'Pension benefits often outweigh early packages; do the math first.' },
  { age: 50, event: 'Health scare prompts life insurance review.', options: ['Increase coverage', 'Keep current coverage', 'Cancel and self-insure'], correct: 0, explanation: 'Adequate life insurance protects family wealth.' },
  { age: 55, event: 'Inheritance of $100,000 received unexpectedly.', options: ['Pay off mortgage', 'Invest for retirement', 'Splurge on vacation'], correct: 1, explanation: 'At 55, investing grows retirement funds; mortgage rates may be lower.' },
  { age: 60, event: 'Social Security claiming decision.', options: ['Claim at 62 (reduced)', 'Wait until 67 (full)', 'Wait until 70 (maximum)'], correct: 2, explanation: 'Waiting until 70 increases Social Security by ~8% per year.' },
];

// ===== AI COMPETITORS =====
const aiCompetitors = [
  { name: 'Momentum Mike', strategy: 'Trend-following', avatar: '📈', performance: 0 },
  { name: 'Value Victor', strategy: 'Fundamental analysis', avatar: '📊', performance: 0 },
  { name: 'Aggressive Amy', strategy: 'High risk/reward', avatar: '🚀', performance: 0 },
  { name: 'Conservative Chris', strategy: 'Risk-averse', avatar: '🛡️', performance: 0 },
];

const aiChallengeQuestions = [
  { question: 'Stock XYZ dropped 10% on no news. Your move?', options: ['Buy the dip', 'Wait and see', 'Short it', 'Do nothing'], correct: 1, explanation: 'Without clear information, waiting to understand the drop is prudent.' },
  { question: 'Tech sector is up 20% this month. Your strategy?', options: ['Go all in on tech', 'Take profits', 'Diversify more', 'Short tech'], correct: 2, explanation: 'Diversification protects against sector-specific reversals.' },
  { question: 'A stock you own announces bankruptcy. Action?', options: ['Hold and hope', 'Sell immediately', 'Buy more (average down)', 'Wait for news'], correct: 1, explanation: 'Bankruptcy usually means total loss; cut losses immediately.' },
  { question: 'Market volatility spikes 50%. Your response?', options: ['Sell everything', 'Buy protection (puts)', 'Stay the course', 'Go to cash'], correct: 2, explanation: 'Long-term investors should stay the course through volatility.' },
  { question: 'Your favorite stock is at all-time high. Action?', options: ['Sell all shares', 'Add to position', 'Hold current position', 'Set trailing stop'], correct: 3, explanation: 'Trailing stops protect gains while allowing continued upside.' },
  { question: 'Interest rates are rising. Portfolio adjustment?', options: ['Buy more bonds', 'Reduce bond duration', 'Ignore it', 'Sell all bonds'], correct: 1, explanation: 'Shorter duration bonds are less sensitive to rate increases.' },
  { question: 'You receive a hot stock tip from a friend. Action?', options: ['Buy immediately', 'Research first', 'Ignore completely', 'Ask for more tips'], correct: 1, explanation: 'Always do your own research before investing.' },
  { question: 'Your portfolio is down 5% this week. Response?', options: ['Panic sell', 'Rebalance', 'Review and hold', 'Double down'], correct: 2, explanation: 'Short-term fluctuations are normal; review fundamentals before acting.' },
  { question: 'A new IPO is getting massive hype. Your move?', options: ['Buy day one', 'Wait for dust to settle', 'Short it', 'FOMO all in'], correct: 1, explanation: 'IPOs often drop after initial hype; patience usually pays.' },
  { question: 'You inherited $50,000. Best approach?', options: ['Invest all at once', 'Dollar-cost average', 'Keep in savings', 'Spend it'], correct: 1, explanation: 'Dollar-cost averaging reduces timing risk on large sums.' },
];

// Shuffle utility
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export default function GamesScreen() {
  const colors = Colors.dark;
  const { sessions, startSession, completeSession, gamesLoading, getGameStats } = useGames();
  const { addXP } = useXPSystem();

  const [activeGame, setActiveGame] = useState<GameConfig | null>(null);
  const [gameState, setGameState] = useState<'idle' | 'tutorial' | 'playing' | 'feedback' | 'complete'>('idle');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [totalXP, setTotalXP] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [currentScenarios, setCurrentScenarios] = useState<any[]>([]);
  const [aiScores, setAiScores] = useState(aiCompetitors.map(c => ({ ...c, performance: 0 })));

  const scenario = currentScenarios[currentQuestion];
  const maxQuestions = activeGame?.questionCount || 10;

  const startGame = async (game: GameConfig) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setActiveGame(game);
    setGameState('tutorial');
    setScore(0);
    setStreak(0);
    setTotalXP(0);
    setCurrentQuestion(0);
    setSelectedAnswer(null);

    // Load game-specific scenarios
    let scenarios: any[] = [];
    switch (game.id) {
      case 'trend-master':
        scenarios = shuffleArray(trendMasterScenarios).slice(0, game.questionCount);
        break;
      case 'market-reaction':
        scenarios = shuffleArray(marketReactionScenarios).slice(0, game.questionCount);
        break;
      case 'budget-balancer':
        scenarios = budgetScenarios;
        break;
      case 'life-sim':
        scenarios = lifeSimEvents;
        break;
      case 'ai-challenge':
        scenarios = aiChallengeQuestions;
        setAiScores(aiCompetitors.map(c => ({ ...c, performance: Math.floor(Math.random() * 30) + 20 })));
        break;
    }
    setCurrentScenarios(scenarios);

    try {
      const session = await startSession(game.id);
      setSessionId(session?.id || null);
    } catch (error) {
      console.error('Failed to start session:', error);
    }
  };

  const handleStartPlaying = () => {
    setGameState('playing');
  };

  const handleAnswer = async (answer: string | number) => {
    if (gameState === 'feedback') return;

    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedAnswer(String(answer));

    let isCorrect = false;
    const scenario = currentScenarios[currentQuestion];

    switch (activeGame?.id) {
      case 'trend-master':
        isCorrect = answer === scenario.correctAnswer;
        break;
      case 'market-reaction':
        isCorrect = answer === scenario.correctAnswer;
        break;
      case 'budget-balancer':
        isCorrect = answer === scenario.correctAnswer;
        break;
      case 'life-sim':
        isCorrect = answer === scenario.correct;
        break;
      case 'ai-challenge':
        isCorrect = answer === scenario.correct;
        // Update AI scores
        setAiScores(prev => prev.map(ai => ({
          ...ai,
          performance: ai.performance + Math.floor(Math.random() * 15) - 5
        })));
        break;
    }

    if (isCorrect) {
      const xpGain = 100 + (streak * 25);
      setScore(prev => prev + 1);
      setTotalXP(prev => prev + xpGain);
      setStreak(prev => prev + 1);
      Toast.show({
        type: 'success',
        text1: `Correct! +${xpGain} XP`,
        visibilityTime: 1500,
      });
    } else {
      setStreak(0);
      Toast.show({
        type: 'error',
        text1: 'Not quite right',
        visibilityTime: 1500,
      });
    }

    setGameState('feedback');
  };

  const handleNext = async () => {
    if (currentQuestion < currentScenarios.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setGameState('playing');
    } else {
      // Game complete
      const coinsEarned = Math.round((score / currentScenarios.length) * (activeGame?.reward || 100));
      const xpAmount = Math.round(totalXP);

      setGameState('complete');

      if (sessionId) {
        completeSession({
          sessionId,
          score: score,
          coinsEarned,
        });
      }

      addXP(xpAmount);
    }
  };

  const closeGame = () => {
    setActiveGame(null);
    setGameState('idle');
    setScore(0);
    setStreak(0);
    setTotalXP(0);
    setCurrentQuestion(0);
    setSessionId(null);
    setSelectedAnswer(null);
    setCurrentScenarios([]);
  };

  const renderTutorial = () => {
    const tutorials: Record<string, { title: string; steps: string[]; tips: string[] }> = {
      'trend-master': {
        title: 'Identify Chart Patterns',
        steps: ['Study the chart pattern', 'Choose from 4 options', 'Learn from explanations'],
        tips: ['Build streaks for bonus XP', 'Look for trend direction', 'Notice support/resistance levels'],
      },
      'market-reaction': {
        title: 'Predict Market Reactions',
        steps: ['Read the news headline', 'Predict market reaction', 'Learn why markets move'],
        tips: ['Consider economic impact', 'Think about investor sentiment', 'Remember: expected news = neutral'],
      },
      'budget-balancer': {
        title: 'Master 50/30/20 Rule',
        steps: ['50% for needs (essentials)', '30% for wants (fun)', '20% for savings/debt'],
        tips: ['Needs = rent, food, utilities', 'Wants = entertainment, dining', 'Savings = investments, debt payoff'],
      },
      'life-sim': {
        title: '40-Year Financial Journey',
        steps: ['Make decisions at each life stage', 'See long-term consequences', 'Build wealth over time'],
        tips: ['Start investing early', 'Avoid high-interest debt', 'Take calculated risks'],
      },
      'ai-challenge': {
        title: 'Beat the AI Traders',
        steps: ['Compete against 4 AI strategies', 'Make trading decisions', 'Outsmart the algorithms'],
        tips: ['Momentum Mike follows trends', 'Value Victor buys cheap', 'Aggressive Amy takes risks'],
      },
    };

    const tutorial = tutorials[activeGame?.id || 'trend-master'];

    return (
      <ScrollView contentContainerStyle={styles.tutorialContent}>
        <LinearGradient
          colors={[activeGame?.color || colors.primary, (activeGame?.color || colors.primary) + '80']}
          style={styles.tutorialIcon}
        >
          <Ionicons name={activeGame?.icon || 'game-controller'} size={48} color="#fff" />
        </LinearGradient>

        <Text style={[styles.tutorialTitle, { color: colors.foreground }]}>{tutorial.title}</Text>

        <View style={styles.tutorialSteps}>
          {tutorial.steps.map((step, i) => (
            <View key={i} style={[styles.tutorialStep, { backgroundColor: colors.card }]}>
              <View style={[styles.stepNumber, { backgroundColor: activeGame?.color }]}>
                <Text style={styles.stepNumberText}>{i + 1}</Text>
              </View>
              <Text style={[styles.stepText, { color: colors.foreground }]}>{step}</Text>
            </View>
          ))}
        </View>

        <Card style={styles.tipsCard}>
          <View style={styles.tipsHeader}>
            <Ionicons name="bulb" size={20} color={colors.warning} />
            <Text style={[styles.tipsTitle, { color: colors.foreground }]}>Pro Tips</Text>
          </View>
          {tutorial.tips.map((tip, i) => (
            <View key={i} style={styles.tipItem}>
              <Ionicons name="star" size={14} color={colors.gold} />
              <Text style={[styles.tipText, { color: colors.mutedForeground }]}>{tip}</Text>
            </View>
          ))}
        </Card>

        <Button variant="primary" fullWidth onPress={handleStartPlaying}>
          Start Game
        </Button>
      </ScrollView>
    );
  };

  const renderGameContent = () => {
    if (!scenario) return null;

    const renderQuestion = () => {
      switch (activeGame?.id) {
        case 'trend-master':
          return (
            <>
              <Text style={[styles.questionText, { color: colors.foreground }]}>
                {scenario.question}
              </Text>
              <View style={styles.patternVisual}>
                <Text style={[styles.patternEmoji, { color: colors.primary }]}>
                  {scenario.pattern === 'uptrend' ? '📈' :
                   scenario.pattern === 'downtrend' ? '📉' :
                   scenario.pattern === 'double-top' ? '⛰️⛰️' :
                   scenario.pattern === 'head-shoulders' ? '🗻' : '📊'}
                </Text>
                <Text style={[styles.patternHint, { color: colors.mutedForeground }]}>
                  Pattern: {scenario.pattern.replace('-', ' ')}
                </Text>
              </View>
            </>
          );

        case 'market-reaction':
          return (
            <>
              <Card style={[styles.newsCard, { backgroundColor: colors.card }]}>
                <Ionicons name="newspaper" size={24} color={colors.warning} />
                <Text style={[styles.newsText, { color: colors.foreground }]}>
                  {scenario.news}
                </Text>
              </Card>
              <Text style={[styles.questionLabel, { color: colors.mutedForeground }]}>
                How will markets react?
              </Text>
            </>
          );

        case 'budget-balancer':
          return (
            <>
              <Card style={[styles.budgetCard, { backgroundColor: activeGame.color + '20' }]}>
                <Text style={[styles.budgetTitle, { color: colors.foreground }]}>
                  {scenario.title}
                </Text>
                <Text style={[styles.budgetIncome, { color: activeGame.color }]}>
                  Monthly Income: ${scenario.income.toLocaleString()}
                </Text>
              </Card>
              <Text style={[styles.questionText, { color: colors.foreground }]}>
                {scenario.question}
              </Text>
            </>
          );

        case 'life-sim':
          return (
            <>
              <View style={[styles.ageIndicator, { backgroundColor: activeGame.color }]}>
                <Text style={styles.ageText}>Age {scenario.age}</Text>
              </View>
              <Text style={[styles.questionText, { color: colors.foreground }]}>
                {scenario.event}
              </Text>
            </>
          );

        case 'ai-challenge':
          return (
            <>
              <View style={styles.aiLeaderboard}>
                <Text style={[styles.leaderboardTitle, { color: colors.foreground }]}>
                  Current Standings
                </Text>
                <View style={styles.aiScores}>
                  {[{ name: 'You', avatar: '👤', performance: Math.round((score / Math.max(currentQuestion, 1)) * 100) }, ...aiScores]
                    .sort((a, b) => b.performance - a.performance)
                    .map((ai, i) => (
                      <View key={ai.name} style={[
                        styles.aiScoreItem,
                        ai.name === 'You' && { backgroundColor: colors.primary + '20' }
                      ]}>
                        <Text style={styles.aiRank}>#{i + 1}</Text>
                        <Text style={styles.aiAvatar}>{ai.avatar}</Text>
                        <Text style={[styles.aiName, { color: colors.foreground }]}>{ai.name}</Text>
                        <Text style={[styles.aiPerf, { color: ai.performance > 0 ? colors.success : colors.destructive }]}>
                          {ai.performance > 0 ? '+' : ''}{ai.performance}%
                        </Text>
                      </View>
                    ))}
                </View>
              </View>
              <Text style={[styles.questionText, { color: colors.foreground }]}>
                {scenario.question}
              </Text>
            </>
          );

        default:
          return <Text style={[styles.questionText, { color: colors.foreground }]}>{scenario.question}</Text>;
      }
    };

    const getOptions = () => {
      switch (activeGame?.id) {
        case 'trend-master':
        case 'market-reaction':
        case 'budget-balancer':
          return scenario.options.map((opt: string) => ({ text: opt, value: opt }));
        case 'life-sim':
        case 'ai-challenge':
          return scenario.options.map((opt: string, i: number) => ({ text: opt, value: i }));
        default:
          return [];
      }
    };

    const isCorrectAnswer = (value: string | number) => {
      switch (activeGame?.id) {
        case 'trend-master':
        case 'market-reaction':
        case 'budget-balancer':
          return value === scenario.correctAnswer;
        case 'life-sim':
        case 'ai-challenge':
          return value === scenario.correct;
        default:
          return false;
      }
    };

    return (
      <ScrollView contentContainerStyle={styles.gameContent} showsVerticalScrollIndicator={false}>
        <Progress value={((currentQuestion + 1) / currentScenarios.length) * 100} style={styles.gameProgress} />
        <Text style={[styles.questionCount, { color: colors.mutedForeground }]}>
          Question {currentQuestion + 1} of {currentScenarios.length}
        </Text>

        {renderQuestion()}

        <View style={styles.optionsContainer}>
          {getOptions().map((option: { text: string; value: string | number }, index: number) => {
            const isSelected = selectedAnswer === String(option.value);
            const showResult = gameState === 'feedback';
            const isCorrect = isCorrectAnswer(option.value);

            let bgColor = colors.card;
            let borderColor = colors.border;

            if (showResult) {
              if (isCorrect) {
                bgColor = colors.success + '20';
                borderColor = colors.success;
              } else if (isSelected && !isCorrect) {
                bgColor = colors.destructive + '20';
                borderColor = colors.destructive;
              }
            } else if (isSelected) {
              bgColor = colors.primary + '20';
              borderColor = colors.primary;
            }

            return (
              <TouchableOpacity
                key={index}
                style={[styles.optionButton, { backgroundColor: bgColor, borderColor }]}
                onPress={() => handleAnswer(option.value)}
                disabled={gameState === 'feedback'}
                activeOpacity={0.7}
              >
                <Text style={[styles.optionText, { color: colors.foreground }]}>
                  {option.text}
                </Text>
                {showResult && isCorrect && (
                  <Ionicons name="checkmark-circle" size={24} color={colors.success} />
                )}
                {showResult && isSelected && !isCorrect && (
                  <Ionicons name="close-circle" size={24} color={colors.destructive} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {gameState === 'feedback' && (
          <Card style={[styles.feedbackCard, {
            backgroundColor: isCorrectAnswer(selectedAnswer === null ? '' :
              (activeGame?.id === 'life-sim' || activeGame?.id === 'ai-challenge' ? parseInt(selectedAnswer) : selectedAnswer)
            ) ? colors.success + '10' : colors.destructive + '10'
          }]}>
            <Text style={[styles.feedbackTitle, { color: colors.foreground }]}>
              {isCorrectAnswer(selectedAnswer === null ? '' :
                (activeGame?.id === 'life-sim' || activeGame?.id === 'ai-challenge' ? parseInt(selectedAnswer!) : selectedAnswer)
              ) ? '✓ Correct!' : '✗ Not quite'}
            </Text>
            <Text style={[styles.feedbackText, { color: colors.mutedForeground }]}>
              {scenario.explanation}
            </Text>
            <Button variant="primary" fullWidth onPress={handleNext} style={{ marginTop: Spacing.md }}>
              {currentQuestion < currentScenarios.length - 1 ? 'Next Question' : 'See Results'}
            </Button>
          </Card>
        )}
      </ScrollView>
    );
  };

  const renderComplete = () => {
    const accuracy = Math.round((score / currentScenarios.length) * 100);
    const coinsEarned = Math.round((score / currentScenarios.length) * (activeGame?.reward || 100));

    return (
      <View style={styles.completeContent}>
        <View style={[styles.completeIcon, { backgroundColor: colors.success + '20' }]}>
          <Ionicons name="trophy" size={64} color={colors.gold} />
        </View>
        <Text style={[styles.completeTitle, { color: colors.foreground }]}>Game Complete!</Text>

        <View style={styles.statsGrid}>
          <View style={[styles.statBox, { backgroundColor: colors.card }]}>
            <Text style={[styles.statValue, { color: colors.primary }]}>{score}/{currentScenarios.length}</Text>
            <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Correct</Text>
          </View>
          <View style={[styles.statBox, { backgroundColor: colors.card }]}>
            <Text style={[styles.statValue, { color: colors.primary }]}>{accuracy}%</Text>
            <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Accuracy</Text>
          </View>
          <View style={[styles.statBox, { backgroundColor: colors.card }]}>
            <Text style={[styles.statValue, { color: colors.gold }]}>{totalXP}</Text>
            <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>XP Earned</Text>
          </View>
        </View>

        <View style={styles.rewardsContainer}>
          <View style={styles.rewardItem}>
            <Ionicons name="logo-bitcoin" size={32} color={colors.gold} />
            <Text style={[styles.rewardValue, { color: colors.gold }]}>+{coinsEarned}</Text>
            <Text style={[styles.rewardLabel, { color: colors.mutedForeground }]}>Coins</Text>
          </View>
          <View style={styles.rewardItem}>
            <Ionicons name="star" size={32} color={colors.primary} />
            <Text style={[styles.rewardValue, { color: colors.primary }]}>+{totalXP}</Text>
            <Text style={[styles.rewardLabel, { color: colors.mutedForeground }]}>XP</Text>
          </View>
        </View>

        <Button variant="primary" fullWidth onPress={() => startGame(activeGame!)}>
          Play Again
        </Button>
        <Button variant="outline" fullWidth onPress={closeGame} style={{ marginTop: Spacing.sm }}>
          Back to Games
        </Button>
      </View>
    );
  };

  if (gamesLoading) {
    return <LoadingScreen message="Loading games..." />;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Investment Games</Text>
        <Text style={[styles.headerSubtitle, { color: colors.mutedForeground }]}>
          Learn while having fun and earn rewards
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {gameConfigs.map((game) => {
          const stats = getGameStats(game.id);

          return (
            <TouchableOpacity key={game.id} onPress={() => startGame(game)} activeOpacity={0.7}>
              <Card style={styles.gameCard}>
                <View style={styles.gameHeader}>
                  <LinearGradient colors={[game.color, game.color + '80']} style={styles.gameIcon}>
                    <Ionicons name={game.icon} size={28} color="#fff" />
                  </LinearGradient>
                  <View style={styles.gameInfo}>
                    <Text style={[styles.gameTitle, { color: colors.foreground }]}>{game.title}</Text>
                    <Text style={[styles.gameDescription, { color: colors.mutedForeground }]}>
                      {game.description}
                    </Text>
                  </View>
                </View>

                <View style={styles.gameMeta}>
                  <Badge variant={game.difficulty === 'Easy' ? 'success' : game.difficulty === 'Medium' ? 'warning' : 'destructive'}>
                    {game.difficulty}
                  </Badge>
                  <View style={styles.gameReward}>
                    <Ionicons name="logo-bitcoin" size={16} color={colors.gold} />
                    <Text style={[styles.gameRewardText, { color: colors.gold }]}>Up to {game.reward}</Text>
                  </View>
                </View>

                {stats.totalPlays > 0 && (
                  <View style={[styles.gameStats, { borderTopColor: colors.border }]}>
                    <View style={styles.gameStat}>
                      <Text style={[styles.gameStatValue, { color: colors.foreground }]}>{stats.totalPlays}</Text>
                      <Text style={[styles.gameStatLabel, { color: colors.mutedForeground }]}>Plays</Text>
                    </View>
                    <View style={styles.gameStat}>
                      <Text style={[styles.gameStatValue, { color: colors.foreground }]}>{stats.highScore}</Text>
                      <Text style={[styles.gameStatLabel, { color: colors.mutedForeground }]}>Best</Text>
                    </View>
                    <View style={styles.gameStat}>
                      <Text style={[styles.gameStatValue, { color: colors.gold }]}>{stats.totalCoins}</Text>
                      <Text style={[styles.gameStatLabel, { color: colors.mutedForeground }]}>Earned</Text>
                    </View>
                  </View>
                )}
              </Card>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Game Modal */}
      <Modal visible={!!activeGame} animationType="slide">
        <SafeAreaView style={[styles.gameModal, { backgroundColor: colors.background }]}>
          <View style={styles.gameModalHeader}>
            <TouchableOpacity onPress={closeGame}>
              <Ionicons name="close" size={28} color={colors.foreground} />
            </TouchableOpacity>
            <Text style={[styles.gameModalTitle, { color: colors.foreground }]}>{activeGame?.title}</Text>
            <View style={styles.scoreContainer}>
              {gameState !== 'tutorial' && (
                <>
                  <Ionicons name="star" size={16} color={colors.primary} />
                  <Text style={[styles.scoreText, { color: colors.primary }]}>{totalXP} XP</Text>
                </>
              )}
            </View>
          </View>

          {gameState === 'tutorial' && renderTutorial()}
          {(gameState === 'playing' || gameState === 'feedback') && renderGameContent()}
          {gameState === 'complete' && renderComplete()}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: Spacing.lg, paddingBottom: Spacing.md },
  headerTitle: { fontSize: FontSizes['2xl'], fontWeight: '700', marginBottom: Spacing.xs },
  headerSubtitle: { fontSize: FontSizes.sm },
  scrollContent: { padding: Spacing.lg, paddingTop: 0, paddingBottom: Spacing.xxl },
  gameCard: { marginBottom: Spacing.md },
  gameHeader: { flexDirection: 'row', marginBottom: Spacing.md },
  gameIcon: { width: 56, height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginRight: Spacing.md },
  gameInfo: { flex: 1 },
  gameTitle: { fontSize: FontSizes.lg, fontWeight: '600', marginBottom: Spacing.xs },
  gameDescription: { fontSize: FontSizes.sm, lineHeight: 20 },
  gameMeta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  gameReward: { flexDirection: 'row', alignItems: 'center' },
  gameRewardText: { fontSize: FontSizes.sm, fontWeight: '600', marginLeft: 4 },
  gameStats: { flexDirection: 'row', justifyContent: 'space-around', borderTopWidth: 1, marginTop: Spacing.md, paddingTop: Spacing.md },
  gameStat: { alignItems: 'center' },
  gameStatValue: { fontSize: FontSizes.lg, fontWeight: '700' },
  gameStatLabel: { fontSize: FontSizes.xs },
  gameModal: { flex: 1 },
  gameModalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: Spacing.lg },
  gameModalTitle: { fontSize: FontSizes.lg, fontWeight: '600' },
  scoreContainer: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  scoreText: { fontSize: FontSizes.base, fontWeight: '700' },

  // Tutorial styles
  tutorialContent: { padding: Spacing.lg, alignItems: 'center' },
  tutorialIcon: { width: 96, height: 96, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.lg },
  tutorialTitle: { fontSize: FontSizes['2xl'], fontWeight: '700', marginBottom: Spacing.xl, textAlign: 'center' },
  tutorialSteps: { width: '100%', gap: Spacing.sm, marginBottom: Spacing.lg },
  tutorialStep: { flexDirection: 'row', alignItems: 'center', padding: Spacing.md, borderRadius: BorderRadius.lg },
  stepNumber: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginRight: Spacing.md },
  stepNumberText: { color: '#fff', fontWeight: '700' },
  stepText: { flex: 1, fontSize: FontSizes.base },
  tipsCard: { width: '100%', marginBottom: Spacing.xl },
  tipsHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.sm },
  tipsTitle: { fontSize: FontSizes.base, fontWeight: '600', marginLeft: Spacing.sm },
  tipItem: { flexDirection: 'row', alignItems: 'center', marginTop: Spacing.xs },
  tipText: { fontSize: FontSizes.sm, marginLeft: Spacing.sm },

  // Game content styles
  gameContent: { padding: Spacing.lg },
  gameProgress: { marginBottom: Spacing.sm },
  questionCount: { fontSize: FontSizes.sm, textAlign: 'center', marginBottom: Spacing.lg },
  questionText: { fontSize: FontSizes.xl, fontWeight: '600', lineHeight: 28, textAlign: 'center', marginBottom: Spacing.lg },
  questionLabel: { fontSize: FontSizes.base, textAlign: 'center', marginBottom: Spacing.md },
  optionsContainer: { gap: Spacing.sm },
  optionButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: Spacing.md, borderRadius: BorderRadius.lg, borderWidth: 2 },
  optionText: { fontSize: FontSizes.base, fontWeight: '500', flex: 1 },
  feedbackCard: { marginTop: Spacing.lg, padding: Spacing.md },
  feedbackTitle: { fontSize: FontSizes.lg, fontWeight: '700', marginBottom: Spacing.sm },
  feedbackText: { fontSize: FontSizes.sm, lineHeight: 20 },

  // Game-specific styles
  patternVisual: { alignItems: 'center', marginBottom: Spacing.lg },
  patternEmoji: { fontSize: 64, marginBottom: Spacing.sm },
  patternHint: { fontSize: FontSizes.sm, textTransform: 'capitalize' },
  newsCard: { flexDirection: 'row', alignItems: 'center', padding: Spacing.md, borderRadius: BorderRadius.lg, marginBottom: Spacing.md },
  newsText: { flex: 1, fontSize: FontSizes.base, fontWeight: '500', marginLeft: Spacing.md },
  budgetCard: { padding: Spacing.md, borderRadius: BorderRadius.lg, marginBottom: Spacing.lg, alignItems: 'center' },
  budgetTitle: { fontSize: FontSizes.lg, fontWeight: '600', marginBottom: Spacing.xs },
  budgetIncome: { fontSize: FontSizes.xl, fontWeight: '700' },
  ageIndicator: { alignSelf: 'center', paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm, borderRadius: BorderRadius.full, marginBottom: Spacing.lg },
  ageText: { color: '#fff', fontSize: FontSizes.lg, fontWeight: '700' },
  aiLeaderboard: { marginBottom: Spacing.lg },
  leaderboardTitle: { fontSize: FontSizes.base, fontWeight: '600', marginBottom: Spacing.sm },
  aiScores: { gap: Spacing.xs },
  aiScoreItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.sm, paddingHorizontal: Spacing.md, borderRadius: BorderRadius.md },
  aiRank: { width: 24, fontSize: FontSizes.sm, fontWeight: '600', color: '#888' },
  aiAvatar: { fontSize: 20, marginRight: Spacing.sm },
  aiName: { flex: 1, fontSize: FontSizes.sm, fontWeight: '500' },
  aiPerf: { fontSize: FontSizes.sm, fontWeight: '700' },

  // Complete styles
  completeContent: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.lg },
  completeIcon: { width: 120, height: 120, borderRadius: 60, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.lg },
  completeTitle: { fontSize: FontSizes['2xl'], fontWeight: '700', marginBottom: Spacing.lg },
  statsGrid: { flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing.xl },
  statBox: { flex: 1, padding: Spacing.md, borderRadius: BorderRadius.lg, alignItems: 'center' },
  statValue: { fontSize: FontSizes['2xl'], fontWeight: '700' },
  statLabel: { fontSize: FontSizes.xs, marginTop: 2 },
  rewardsContainer: { flexDirection: 'row', gap: Spacing.xl, marginBottom: Spacing.xl },
  rewardItem: { alignItems: 'center' },
  rewardValue: { fontSize: FontSizes.xl, fontWeight: '700', marginTop: Spacing.xs },
  rewardLabel: { fontSize: FontSizes.sm },
});
