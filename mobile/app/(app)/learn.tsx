import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { useLessons } from '@/hooks/useLessons';
import { Card, Badge, Progress, LoadingScreen, EmptyState } from '@/components/ui';
import { Colors, FontSizes, Spacing, BorderRadius } from '@/constants/theme';

export default function LearnScreen() {
  const colors = Colors.dark;
  const { lessons, getLessonStatus, lessonsLoading, getCompletedCount } = useLessons();
  const [refreshing, setRefreshing] = React.useState(false);

  const completedCount = getCompletedCount();
  const totalLessons = lessons?.length ?? 0;
  const progressPercent = totalLessons > 0 ? (completedCount / totalLessons) * 100 : 0;

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  if (lessonsLoading) {
    return <LoadingScreen message="Loading lessons..." />;
  }

  if (!lessons || lessons.length === 0) {
    return (
      <EmptyState
        icon="book-outline"
        title="No Lessons Available"
        description="Check back later for new lessons"
      />
    );
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return colors.success;
      case 'intermediate':
        return colors.warning;
      case 'advanced':
        return colors.destructive;
      default:
        return colors.primary;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Learning Path</Text>
        <Text style={[styles.headerSubtitle, { color: colors.mutedForeground }]}>
          {completedCount} of {totalLessons} lessons completed
        </Text>
        <Progress value={progressPercent} style={styles.headerProgress} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      >
        <View style={styles.lessonList}>
          {lessons.map((lesson, index) => {
            const status = getLessonStatus(lesson.id);
            const isLocked = status.isLocked;
            const isCompleted = status.isCompleted;

            return (
              <View key={lesson.id} style={styles.lessonItem}>
                {/* Connection line */}
                {index < lessons.length - 1 && (
                  <View
                    style={[
                      styles.connectionLine,
                      {
                        backgroundColor: isCompleted ? colors.success : colors.border,
                      },
                    ]}
                  />
                )}

                {/* Lesson node */}
                <View
                  style={[
                    styles.lessonNode,
                    {
                      backgroundColor: isLocked
                        ? colors.muted
                        : isCompleted
                        ? colors.success
                        : colors.primary,
                    },
                  ]}
                >
                  {isLocked ? (
                    <Ionicons name="lock-closed" size={16} color={colors.mutedForeground} />
                  ) : isCompleted ? (
                    <Ionicons name="checkmark" size={16} color="#fff" />
                  ) : (
                    <Text style={styles.lessonNodeText}>{index + 1}</Text>
                  )}
                </View>

                {/* Lesson card */}
                <TouchableOpacity
                  style={styles.lessonCardContainer}
                  onPress={() => !isLocked && router.push(`/(app)/lesson/${lesson.id}`)}
                  disabled={isLocked}
                  activeOpacity={0.7}
                >
                  <Card
                    style={[
                      styles.lessonCard,
                      isLocked && styles.lessonCardLocked,
                      { borderColor: isCompleted ? colors.success : 'transparent' },
                    ]}
                  >
                    <View style={styles.lessonCardHeader}>
                      <View style={styles.lessonCardTitleRow}>
                        <Text
                          style={[
                            styles.lessonTitle,
                            { color: isLocked ? colors.mutedForeground : colors.foreground },
                          ]}
                          numberOfLines={1}
                        >
                          {lesson.title}
                        </Text>
                        {isCompleted && status.quizScore !== undefined && (
                          <Badge variant="success">{status.quizScore}%</Badge>
                        )}
                      </View>
                      <Text
                        style={[styles.lessonDescription, { color: colors.mutedForeground }]}
                        numberOfLines={2}
                      >
                        {lesson.description}
                      </Text>
                    </View>

                    <View style={styles.lessonMeta}>
                      <View style={styles.lessonMetaItem}>
                        <Badge
                          variant="outline"
                          textStyle={{ color: getDifficultyColor(lesson.difficulty) }}
                        >
                          {lesson.difficulty}
                        </Badge>
                      </View>
                      <View style={styles.lessonMetaItem}>
                        <Ionicons name="time-outline" size={14} color={colors.mutedForeground} />
                        <Text style={[styles.lessonMetaText, { color: colors.mutedForeground }]}>
                          {lesson.duration_minutes} min
                        </Text>
                      </View>
                      {!isLocked && (
                        <Ionicons
                          name="chevron-forward"
                          size={20}
                          color={colors.mutedForeground}
                        />
                      )}
                    </View>
                  </Card>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      </ScrollView>
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
  headerProgress: {
    height: 6,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingTop: 0,
  },
  lessonList: {
    paddingLeft: 20,
  },
  lessonItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
    position: 'relative',
  },
  connectionLine: {
    position: 'absolute',
    left: 15,
    top: 36,
    width: 2,
    height: 'calc(100% + 16px)',
    bottom: -16,
  },
  lessonNode: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
    zIndex: 1,
  },
  lessonNodeText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: FontSizes.sm,
  },
  lessonCardContainer: {
    flex: 1,
  },
  lessonCard: {
    borderWidth: 2,
    borderColor: 'transparent',
  },
  lessonCardLocked: {
    opacity: 0.6,
  },
  lessonCardHeader: {
    marginBottom: Spacing.sm,
  },
  lessonCardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  lessonTitle: {
    fontSize: FontSizes.base,
    fontWeight: '600',
    flex: 1,
    marginRight: Spacing.sm,
  },
  lessonDescription: {
    fontSize: FontSizes.sm,
    lineHeight: 20,
  },
  lessonMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lessonMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  lessonMetaText: {
    fontSize: FontSizes.xs,
    marginLeft: 4,
  },
});
