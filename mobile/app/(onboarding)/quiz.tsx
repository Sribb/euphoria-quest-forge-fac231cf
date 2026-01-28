import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import * as Haptics from 'expo-haptics';

import { useOnboarding } from '@/hooks/useOnboarding';
import { Button, Card, Progress } from '@/components/ui';
import { Colors, FontSizes, Spacing, BorderRadius } from '@/constants/theme';

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: 'What is a stock?',
    options: [
      'A type of bond',
      'A share of ownership in a company',
      'A savings account',
      'A type of insurance',
    ],
    correctIndex: 1,
    explanation: 'A stock represents a share of ownership in a publicly traded company.',
  },
  {
    id: 2,
    question: 'What does diversification mean in investing?',
    options: [
      'Putting all money in one stock',
      'Only investing in bonds',
      'Spreading investments across different assets',
      'Investing in foreign currencies only',
    ],
    correctIndex: 2,
    explanation: 'Diversification means spreading your investments across various assets to reduce risk.',
  },
  {
    id: 3,
    question: 'What is a bear market?',
    options: [
      'A market where prices are rising',
      'A market where prices are falling',
      'A market for trading bears',
      'A market that is closed',
    ],
    correctIndex: 1,
    explanation: 'A bear market is characterized by falling prices, typically 20% or more from recent highs.',
  },
  {
    id: 4,
    question: 'What is compound interest?',
    options: [
      'Interest only on principal',
      'Interest on both principal and accumulated interest',
      'A type of loan',
      'A bank fee',
    ],
    correctIndex: 1,
    explanation: 'Compound interest is interest calculated on both the initial principal and the accumulated interest.',
  },
  {
    id: 5,
    question: 'What is a mutual fund?',
    options: [
      'A single stock',
      'A pool of money from multiple investors',
      'A bank account',
      'A type of insurance',
    ],
    correctIndex: 1,
    explanation: 'A mutual fund pools money from many investors to invest in a diversified portfolio.',
  },
];

export default function PlacementQuizScreen() {
  const colors = Colors.dark;
  const { completeOnboarding } = useOnboarding();

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const question = quizQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;

  const handleSelectAnswer = async (index: number) => {
    if (selectedAnswer !== null) return;

    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedAnswer(index);

    if (index === question.correctIndex) {
      setCorrectAnswers((prev) => prev + 1);
    }

    setShowExplanation(true);
  };

  const handleNext = async () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setIsComplete(true);
    }
  };

  const handleComplete = async () => {
    const score = Math.round((correctAnswers / quizQuestions.length) * 100);
    // Calculate placement lesson based on score
    let placementLesson = 1;
    if (score >= 80) placementLesson = 20;
    else if (score >= 60) placementLesson = 12;
    else if (score >= 40) placementLesson = 6;

    try {
      await completeOnboarding.mutateAsync({ score, placementLesson });
      Toast.show({
        type: 'success',
        text1: 'Welcome!',
        text2: `You scored ${score}%. Starting from lesson ${placementLesson}`,
      });
      router.replace('/(app)/dashboard');
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to save your results. Please try again.',
      });
    }
  };

  if (isComplete) {
    const score = Math.round((correctAnswers / quizQuestions.length) * 100);
    let level = 'Beginner';
    if (score >= 80) level = 'Advanced';
    else if (score >= 60) level = 'Intermediate';

    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <ScrollView contentContainerStyle={styles.resultsContainer}>
          <View style={[styles.resultIcon, { backgroundColor: colors.success + '20' }]}>
            <Ionicons name="checkmark-circle" size={64} color={colors.success} />
          </View>

          <Text style={[styles.resultTitle, { color: colors.foreground }]}>Quiz Complete!</Text>
          <Text style={[styles.resultScore, { color: colors.primary }]}>{score}%</Text>
          <Text style={[styles.resultLevel, { color: colors.mutedForeground }]}>
            Your level: {level}
          </Text>

          <Card style={styles.resultCard}>
            <Text style={[styles.resultCardTitle, { color: colors.foreground }]}>
              Your Personalized Path
            </Text>
            <Text style={[styles.resultCardText, { color: colors.mutedForeground }]}>
              Based on your results, we've customized your learning path to help you grow from {level.toLowerCase()} to expert investor.
            </Text>
          </Card>

          <Button
            variant="primary"
            fullWidth
            loading={completeOnboarding.isPending}
            onPress={handleComplete}
          >
            Start Learning
          </Button>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Placement Quiz</Text>
        <Text style={[styles.headerSubtitle, { color: colors.mutedForeground }]}>
          Question {currentQuestion + 1} of {quizQuestions.length}
        </Text>
        <Progress value={progress} style={styles.progress} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.question, { color: colors.foreground }]}>{question.question}</Text>

        <View style={styles.options}>
          {question.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrect = index === question.correctIndex;
            const showResult = selectedAnswer !== null;

            let borderColor = colors.border;
            let backgroundColor = colors.card;

            if (showResult) {
              if (isCorrect) {
                borderColor = colors.success;
                backgroundColor = colors.success + '10';
              } else if (isSelected && !isCorrect) {
                borderColor = colors.destructive;
                backgroundColor = colors.destructive + '10';
              }
            } else if (isSelected) {
              borderColor = colors.primary;
              backgroundColor = colors.primary + '10';
            }

            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.option,
                  {
                    borderColor,
                    backgroundColor,
                  },
                ]}
                onPress={() => handleSelectAnswer(index)}
                disabled={selectedAnswer !== null}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.optionBullet,
                    {
                      backgroundColor: showResult
                        ? isCorrect
                          ? colors.success
                          : isSelected
                          ? colors.destructive
                          : colors.muted
                        : isSelected
                        ? colors.primary
                        : colors.muted,
                    },
                  ]}
                >
                  <Text style={styles.optionBulletText}>
                    {String.fromCharCode(65 + index)}
                  </Text>
                </View>
                <Text style={[styles.optionText, { color: colors.foreground }]}>{option}</Text>
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

        {showExplanation && (
          <Card style={styles.explanation}>
            <View style={styles.explanationHeader}>
              <Ionicons name="bulb" size={20} color={colors.warning} />
              <Text style={[styles.explanationTitle, { color: colors.foreground }]}>
                Explanation
              </Text>
            </View>
            <Text style={[styles.explanationText, { color: colors.mutedForeground }]}>
              {question.explanation}
            </Text>
          </Card>
        )}
      </ScrollView>

      {showExplanation && (
        <View style={styles.footer}>
          <Button variant="primary" fullWidth onPress={handleNext}>
            {currentQuestion < quizQuestions.length - 1 ? 'Next Question' : 'See Results'}
          </Button>
        </View>
      )}
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
    marginBottom: Spacing.md,
  },
  progress: {
    height: 6,
  },
  content: {
    padding: Spacing.lg,
    paddingTop: Spacing.sm,
  },
  question: {
    fontSize: FontSizes.xl,
    fontWeight: '600',
    marginBottom: Spacing.lg,
    lineHeight: 28,
  },
  options: {
    gap: Spacing.sm,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
  },
  optionBullet: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  optionBulletText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: FontSizes.sm,
  },
  optionText: {
    flex: 1,
    fontSize: FontSizes.base,
  },
  explanation: {
    marginTop: Spacing.lg,
  },
  explanationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  explanationTitle: {
    fontSize: FontSizes.base,
    fontWeight: '600',
    marginLeft: Spacing.xs,
  },
  explanationText: {
    fontSize: FontSizes.sm,
    lineHeight: 20,
  },
  footer: {
    padding: Spacing.lg,
    paddingTop: Spacing.sm,
  },
  resultsContainer: {
    flexGrow: 1,
    padding: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  resultTitle: {
    fontSize: FontSizes['2xl'],
    fontWeight: '700',
    marginBottom: Spacing.sm,
  },
  resultScore: {
    fontSize: FontSizes['4xl'],
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  resultLevel: {
    fontSize: FontSizes.lg,
    marginBottom: Spacing.xl,
  },
  resultCard: {
    width: '100%',
    marginBottom: Spacing.xl,
  },
  resultCardTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  resultCardText: {
    fontSize: FontSizes.sm,
    lineHeight: 20,
  },
});
