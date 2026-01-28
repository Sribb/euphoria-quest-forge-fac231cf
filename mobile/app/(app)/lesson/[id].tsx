import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Toast from 'react-native-toast-message';

import { useLessons } from '@/hooks/useLessons';
import { useXPSystem } from '@/hooks/useXPSystem';
import { Button, Card, Progress, Badge, LoadingScreen } from '@/components/ui';
import { Colors, FontSizes, Spacing, BorderRadius } from '@/constants/theme';

type Phase = 'learn' | 'practice' | 'test';

interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

const generateQuizQuestions = (content: string): QuizQuestion[] => {
  // Generate sample quiz questions based on lesson content
  return [
    {
      question: 'Based on this lesson, what is the most important concept?',
      options: [
        'Understanding market basics',
        'Timing the market perfectly',
        'Only investing in stocks',
        'Avoiding all risk',
      ],
      correctIndex: 0,
    },
    {
      question: 'What strategy is recommended for long-term success?',
      options: [
        'Day trading only',
        'Diversification',
        'Single stock investing',
        'Market timing',
      ],
      correctIndex: 1,
    },
    {
      question: 'How should you approach risk in investing?',
      options: [
        'Avoid it completely',
        'Take maximum risk always',
        'Understand and manage it appropriately',
        'Ignore it',
      ],
      correctIndex: 2,
    },
  ];
};

export default function LessonDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = Colors.dark;
  const { lessons, getLessonStatus, completeLesson, isUpdating } = useLessons();
  const { addXP } = useXPSystem();

  const [phase, setPhase] = useState<Phase>('learn');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);

  const lesson = lessons?.find((l) => l.id === id);
  const status = lesson ? getLessonStatus(lesson.id) : null;

  if (!lesson) {
    return <LoadingScreen message="Loading lesson..." />;
  }

  const quizQuestions = generateQuizQuestions(lesson.content);
  const question = quizQuestions[currentQuestion];
  const quizProgress = ((currentQuestion + 1) / quizQuestions.length) * 100;

  const handlePhaseChange = (newPhase: Phase) => {
    setPhase(newPhase);
    if (newPhase === 'test') {
      setCurrentQuestion(0);
      setSelectedAnswer(null);
      setCorrectAnswers(0);
      setShowExplanation(false);
    }
  };

  const handleSelectAnswer = async (index: number) => {
    if (selectedAnswer !== null) return;

    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedAnswer(index);

    if (index === question.correctIndex) {
      setCorrectAnswers((prev) => prev + 1);
    }

    setShowExplanation(true);
  };

  const handleNextQuestion = async () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      // Quiz complete
      const score = Math.round((correctAnswers / quizQuestions.length) * 100);

      try {
        completeLesson({ lessonId: lesson.id, quizScore: score });

        // Award XP based on score
        const xpAmount = Math.round(50 + (score / 2));
        addXP(xpAmount);

        Toast.show({
          type: 'success',
          text1: 'Lesson Complete!',
          text2: `You scored ${score}% and earned ${xpAmount} XP!`,
        });

        router.back();
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Failed to save progress',
        });
      }
    }
  };

  const renderPhaseContent = () => {
    switch (phase) {
      case 'learn':
        return (
          <ScrollView
            contentContainerStyle={styles.phaseContent}
            showsVerticalScrollIndicator={false}
          >
            <Card style={styles.lessonContentCard}>
              <Text style={[styles.lessonContent, { color: colors.foreground }]}>
                {lesson.content || 'Lesson content will be displayed here. This includes detailed explanations, examples, and key concepts you need to understand before moving to the practice and test phases.'}
              </Text>
            </Card>

            <View style={styles.phaseActions}>
              <Button variant="primary" fullWidth onPress={() => handlePhaseChange('practice')}>
                Continue to Practice
              </Button>
            </View>
          </ScrollView>
        );

      case 'practice':
        return (
          <ScrollView
            contentContainerStyle={styles.phaseContent}
            showsVerticalScrollIndicator={false}
          >
            <Card style={styles.practiceCard}>
              <View style={styles.practiceHeader}>
                <Ionicons name="bulb" size={32} color={colors.warning} />
                <Text style={[styles.practiceTitle, { color: colors.foreground }]}>
                  Practice Mode
                </Text>
              </View>
              <Text style={[styles.practiceText, { color: colors.mutedForeground }]}>
                Review the key concepts from this lesson. Take your time to understand each point before moving to the test.
              </Text>

              <View style={styles.keyPoints}>
                <Text style={[styles.keyPointsTitle, { color: colors.foreground }]}>
                  Key Takeaways:
                </Text>
                {['Understand the fundamentals', 'Apply practical examples', 'Review before testing'].map((point, i) => (
                  <View key={i} style={styles.keyPoint}>
                    <Ionicons name="checkmark-circle" size={20} color={colors.success} />
                    <Text style={[styles.keyPointText, { color: colors.foreground }]}>
                      {point}
                    </Text>
                  </View>
                ))}
              </View>
            </Card>

            <View style={styles.phaseActions}>
              <Button variant="outline" fullWidth onPress={() => handlePhaseChange('learn')}>
                Review Lesson
              </Button>
              <Button
                variant="primary"
                fullWidth
                onPress={() => handlePhaseChange('test')}
                style={{ marginTop: Spacing.sm }}
              >
                Take the Test
              </Button>
            </View>
          </ScrollView>
        );

      case 'test':
        return (
          <ScrollView
            contentContainerStyle={styles.phaseContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.quizHeader}>
              <Text style={[styles.quizProgress, { color: colors.mutedForeground }]}>
                Question {currentQuestion + 1} of {quizQuestions.length}
              </Text>
              <Progress value={quizProgress} style={styles.quizProgressBar} />
            </View>

            <Text style={[styles.questionText, { color: colors.foreground }]}>
              {question.question}
            </Text>

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
                    style={[styles.option, { borderColor, backgroundColor }]}
                    onPress={() => handleSelectAnswer(index)}
                    disabled={selectedAnswer !== null}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.optionText, { color: colors.foreground }]}>
                      {option}
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

            {showExplanation && (
              <View style={styles.phaseActions}>
                <Button
                  variant="primary"
                  fullWidth
                  onPress={handleNextQuestion}
                  loading={isUpdating}
                >
                  {currentQuestion < quizQuestions.length - 1 ? 'Next Question' : 'Complete Lesson'}
                </Button>
              </View>
            )}
          </ScrollView>
        );
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.foreground} />
        </TouchableOpacity>
        <View style={styles.headerTitle}>
          <Text style={[styles.lessonTitle, { color: colors.foreground }]} numberOfLines={1}>
            {lesson.title}
          </Text>
          <View style={styles.headerMeta}>
            <Badge variant="secondary">{lesson.difficulty}</Badge>
            <Text style={[styles.headerDuration, { color: colors.mutedForeground }]}>
              {lesson.duration_minutes} min
            </Text>
          </View>
        </View>
      </View>

      {/* Phase tabs */}
      <View style={[styles.phaseTabs, { borderBottomColor: colors.border }]}>
        {(['learn', 'practice', 'test'] as Phase[]).map((p) => (
          <TouchableOpacity
            key={p}
            style={[
              styles.phaseTab,
              phase === p && { borderBottomColor: colors.primary, borderBottomWidth: 2 },
            ]}
            onPress={() => handlePhaseChange(p)}
          >
            <Text
              style={[
                styles.phaseTabText,
                { color: phase === p ? colors.primary : colors.mutedForeground },
              ]}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Phase content */}
      {renderPhaseContent()}
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
    padding: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  backButton: {
    marginRight: Spacing.md,
  },
  headerTitle: {
    flex: 1,
  },
  lessonTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  headerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  headerDuration: {
    fontSize: FontSizes.sm,
  },
  phaseTabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    marginHorizontal: Spacing.lg,
  },
  phaseTab: {
    flex: 1,
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  phaseTabText: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
  },
  phaseContent: {
    padding: Spacing.lg,
    flexGrow: 1,
  },
  lessonContentCard: {
    marginBottom: Spacing.lg,
  },
  lessonContent: {
    fontSize: FontSizes.base,
    lineHeight: 24,
  },
  practiceCard: {
    marginBottom: Spacing.lg,
  },
  practiceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  practiceTitle: {
    fontSize: FontSizes.xl,
    fontWeight: '600',
    marginLeft: Spacing.sm,
  },
  practiceText: {
    fontSize: FontSizes.base,
    lineHeight: 22,
    marginBottom: Spacing.lg,
  },
  keyPoints: {
    marginTop: Spacing.md,
  },
  keyPointsTitle: {
    fontSize: FontSizes.base,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  keyPoint: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  keyPointText: {
    marginLeft: Spacing.sm,
    fontSize: FontSizes.sm,
  },
  quizHeader: {
    marginBottom: Spacing.lg,
  },
  quizProgress: {
    fontSize: FontSizes.sm,
    marginBottom: Spacing.sm,
  },
  quizProgressBar: {
    height: 6,
  },
  questionText: {
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
  optionText: {
    flex: 1,
    fontSize: FontSizes.base,
  },
  phaseActions: {
    marginTop: 'auto',
    paddingTop: Spacing.lg,
  },
});
