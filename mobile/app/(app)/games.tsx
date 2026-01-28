import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import Toast from 'react-native-toast-message';

import { useGames } from '@/hooks/useGames';
import { useXPSystem } from '@/hooks/useXPSystem';
import { Button, Card, Badge, LoadingScreen, Progress } from '@/components/ui';
import { Colors, FontSizes, Spacing, BorderRadius } from '@/constants/theme';

interface GameConfig {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  difficulty: string;
  reward: number;
}

const gameConfigs: GameConfig[] = [
  {
    id: 'trend-master',
    title: 'Trend Master',
    description: 'Identify chart patterns and predict market movements',
    icon: 'trending-up',
    color: '#22c55e',
    difficulty: 'Medium',
    reward: 50,
  },
  {
    id: 'life-sim',
    title: 'Life Sim: Investor Journey',
    description: 'Make financial decisions through a 40-year life simulation',
    icon: 'person',
    color: '#3b82f6',
    difficulty: 'Easy',
    reward: 75,
  },
  {
    id: 'ai-challenge',
    title: 'AI Trading Challenge',
    description: 'Compete against 4 AI traders with unique strategies',
    icon: 'hardware-chip',
    color: '#8b5cf6',
    difficulty: 'Hard',
    reward: 100,
  },
  {
    id: 'market-reaction',
    title: 'Market Reaction',
    description: 'Predict how markets will react to breaking news',
    icon: 'newspaper',
    color: '#f59e0b',
    difficulty: 'Medium',
    reward: 60,
  },
  {
    id: 'budget-balancer',
    title: 'Budget Balancer',
    description: 'Master the 50/30/20 budgeting rule through challenges',
    icon: 'calculator',
    color: '#ec4899',
    difficulty: 'Easy',
    reward: 40,
  },
];

export default function GamesScreen() {
  const colors = Colors.dark;
  const { sessions, startSession, completeSession, gamesLoading, getGameStats } = useGames();
  const { addXP } = useXPSystem();

  const [activeGame, setActiveGame] = useState<GameConfig | null>(null);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'complete'>('idle');
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const startGame = async (game: GameConfig) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setActiveGame(game);
    setGameState('playing');
    setScore(0);
    setCurrentQuestion(0);

    try {
      const session = await startSession(game.id);
      setSessionId(session.id);
    } catch (error) {
      console.error('Failed to start session:', error);
    }
  };

  const handleAnswer = async (isCorrect: boolean) => {
    await Haptics.impactAsync(
      isCorrect ? Haptics.ImpactFeedbackStyle.Light : Haptics.ImpactFeedbackStyle.Heavy
    );

    if (isCorrect) {
      setScore((prev) => prev + 10);
    }

    if (currentQuestion >= 4) {
      // Game complete
      const finalScore = score + (isCorrect ? 10 : 0);
      const coinsEarned = Math.round((finalScore / 50) * (activeGame?.reward || 50));

      setGameState('complete');

      if (sessionId) {
        completeSession({
          sessionId,
          score: finalScore,
          coinsEarned,
        });
      }

      // Award XP
      const xpAmount = Math.round(coinsEarned * 0.5);
      addXP(xpAmount);
    } else {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  const closeGame = () => {
    setActiveGame(null);
    setGameState('idle');
    setScore(0);
    setCurrentQuestion(0);
    setSessionId(null);
  };

  if (gamesLoading) {
    return <LoadingScreen message="Loading games..." />;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Investment Games</Text>
        <Text style={[styles.headerSubtitle, { color: colors.mutedForeground }]}>
          Learn while having fun and earn coins
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {gameConfigs.map((game) => {
          const stats = getGameStats(game.id);

          return (
            <TouchableOpacity key={game.id} onPress={() => startGame(game)} activeOpacity={0.7}>
              <Card style={styles.gameCard}>
                <View style={styles.gameHeader}>
                  <LinearGradient
                    colors={[game.color, game.color + '80']}
                    style={styles.gameIcon}
                  >
                    <Ionicons name={game.icon} size={28} color="#fff" />
                  </LinearGradient>
                  <View style={styles.gameInfo}>
                    <Text style={[styles.gameTitle, { color: colors.foreground }]}>
                      {game.title}
                    </Text>
                    <Text style={[styles.gameDescription, { color: colors.mutedForeground }]}>
                      {game.description}
                    </Text>
                  </View>
                </View>

                <View style={styles.gameMeta}>
                  <Badge
                    variant={
                      game.difficulty === 'Easy'
                        ? 'success'
                        : game.difficulty === 'Medium'
                        ? 'warning'
                        : 'destructive'
                    }
                  >
                    {game.difficulty}
                  </Badge>
                  <View style={styles.gameReward}>
                    <Ionicons name="logo-bitcoin" size={16} color={colors.gold} />
                    <Text style={[styles.gameRewardText, { color: colors.gold }]}>
                      Up to {game.reward}
                    </Text>
                  </View>
                </View>

                {stats.totalPlays > 0 && (
                  <View style={[styles.gameStats, { borderTopColor: colors.border }]}>
                    <View style={styles.gameStat}>
                      <Text style={[styles.gameStatValue, { color: colors.foreground }]}>
                        {stats.totalPlays}
                      </Text>
                      <Text style={[styles.gameStatLabel, { color: colors.mutedForeground }]}>
                        Plays
                      </Text>
                    </View>
                    <View style={styles.gameStat}>
                      <Text style={[styles.gameStatValue, { color: colors.foreground }]}>
                        {stats.highScore}
                      </Text>
                      <Text style={[styles.gameStatLabel, { color: colors.mutedForeground }]}>
                        High Score
                      </Text>
                    </View>
                    <View style={styles.gameStat}>
                      <Text style={[styles.gameStatValue, { color: colors.gold }]}>
                        {stats.totalCoins}
                      </Text>
                      <Text style={[styles.gameStatLabel, { color: colors.mutedForeground }]}>
                        Earned
                      </Text>
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
            <Text style={[styles.gameModalTitle, { color: colors.foreground }]}>
              {activeGame?.title}
            </Text>
            <View style={styles.scoreContainer}>
              <Text style={[styles.scoreText, { color: colors.primary }]}>{score} pts</Text>
            </View>
          </View>

          {gameState === 'playing' && (
            <View style={styles.gameContent}>
              <Progress
                value={((currentQuestion + 1) / 5) * 100}
                style={styles.gameProgress}
              />
              <Text style={[styles.questionCount, { color: colors.mutedForeground }]}>
                Question {currentQuestion + 1} of 5
              </Text>

              <Card style={styles.questionCard}>
                <Text style={[styles.questionText, { color: colors.foreground }]}>
                  {activeGame?.id === 'trend-master'
                    ? 'What pattern is forming when price makes higher highs and higher lows?'
                    : activeGame?.id === 'market-reaction'
                    ? 'How would the market likely react to a surprise interest rate cut?'
                    : 'What is the recommended savings percentage in the 50/30/20 rule?'}
                </Text>
              </Card>

              <View style={styles.answerOptions}>
                {[
                  { text: 'Option A', correct: true },
                  { text: 'Option B', correct: false },
                  { text: 'Option C', correct: false },
                  { text: 'Option D', correct: false },
                ].map((option, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[styles.answerButton, { backgroundColor: colors.card }]}
                    onPress={() => handleAnswer(option.correct)}
                  >
                    <Text style={[styles.answerText, { color: colors.foreground }]}>
                      {option.text}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {gameState === 'complete' && (
            <View style={styles.completeContent}>
              <View style={[styles.completeIcon, { backgroundColor: colors.success + '20' }]}>
                <Ionicons name="trophy" size={64} color={colors.gold} />
              </View>
              <Text style={[styles.completeTitle, { color: colors.foreground }]}>
                Game Complete!
              </Text>
              <Text style={[styles.completeScore, { color: colors.primary }]}>
                Score: {score} points
              </Text>
              <View style={styles.rewardsContainer}>
                <View style={styles.rewardItem}>
                  <Ionicons name="logo-bitcoin" size={24} color={colors.gold} />
                  <Text style={[styles.rewardValue, { color: colors.gold }]}>
                    +{Math.round((score / 50) * (activeGame?.reward || 50))}
                  </Text>
                  <Text style={[styles.rewardLabel, { color: colors.mutedForeground }]}>
                    Coins
                  </Text>
                </View>
                <View style={styles.rewardItem}>
                  <Ionicons name="star" size={24} color={colors.primary} />
                  <Text style={[styles.rewardValue, { color: colors.primary }]}>
                    +{Math.round((score / 50) * (activeGame?.reward || 50) * 0.5)}
                  </Text>
                  <Text style={[styles.rewardLabel, { color: colors.mutedForeground }]}>XP</Text>
                </View>
              </View>
              <Button variant="primary" fullWidth onPress={closeGame}>
                Continue
              </Button>
            </View>
          )}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  headerTitle: {
    fontSize: FontSizes['2xl'],
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  headerSubtitle: {
    fontSize: FontSizes.sm,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingTop: 0,
    paddingBottom: Spacing.xxl,
  },
  gameCard: {
    marginBottom: Spacing.md,
  },
  gameHeader: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
  },
  gameIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  gameInfo: {
    flex: 1,
  },
  gameTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  gameDescription: {
    fontSize: FontSizes.sm,
    lineHeight: 20,
  },
  gameMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gameReward: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gameRewardText: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    marginLeft: 4,
  },
  gameStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
  },
  gameStat: {
    alignItems: 'center',
  },
  gameStatValue: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
  },
  gameStatLabel: {
    fontSize: FontSizes.xs,
  },
  gameModal: {
    flex: 1,
  },
  gameModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  gameModalTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
  },
  scoreContainer: {},
  scoreText: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
  },
  gameContent: {
    flex: 1,
    padding: Spacing.lg,
  },
  gameProgress: {
    marginBottom: Spacing.sm,
  },
  questionCount: {
    fontSize: FontSizes.sm,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  questionCard: {
    marginBottom: Spacing.lg,
  },
  questionText: {
    fontSize: FontSizes.xl,
    fontWeight: '600',
    lineHeight: 28,
    textAlign: 'center',
  },
  answerOptions: {
    gap: Spacing.sm,
  },
  answerButton: {
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
  },
  answerText: {
    fontSize: FontSizes.base,
    fontWeight: '500',
  },
  completeContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  completeIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  completeTitle: {
    fontSize: FontSizes['2xl'],
    fontWeight: '700',
    marginBottom: Spacing.sm,
  },
  completeScore: {
    fontSize: FontSizes['3xl'],
    fontWeight: '700',
    marginBottom: Spacing.xl,
  },
  rewardsContainer: {
    flexDirection: 'row',
    gap: Spacing.xl,
    marginBottom: Spacing.xl,
  },
  rewardItem: {
    alignItems: 'center',
  },
  rewardValue: {
    fontSize: FontSizes.xl,
    fontWeight: '700',
    marginTop: Spacing.xs,
  },
  rewardLabel: {
    fontSize: FontSizes.sm,
  },
});
