import React from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { useAuth } from '@/hooks/useAuth';
import { useXPSystem } from '@/hooks/useXPSystem';
import { usePortfolio } from '@/hooks/usePortfolio';
import { useLessons } from '@/hooks/useLessons';
import { useProfile } from '@/hooks/useProfile';
import { Card, Progress, Badge, Avatar, LoadingScreen } from '@/components/ui';
import { Colors, FontSizes, Spacing, BorderRadius } from '@/constants/theme';

export default function DashboardScreen() {
  const colors = Colors.dark;
  const { user } = useAuth();
  const { userStats, getXPProgress, statsLoading } = useXPSystem();
  const { calculatePortfolioValue, portfolioLoading } = usePortfolio();
  const { getNextLesson, getCompletedCount, lessonsLoading, lessons } = useLessons();
  const { profile, streak, profileLoading } = useProfile();

  const [refreshing, setRefreshing] = React.useState(false);

  const xpProgress = getXPProgress();
  const portfolioValue = calculatePortfolioValue();
  const nextLesson = getNextLesson();
  const completedLessons = getCompletedCount();
  const totalLessons = lessons?.length ?? 0;

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    // Queries will auto-refresh
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  if (statsLoading && profileLoading) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
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
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={[styles.greeting, { color: colors.mutedForeground }]}>Welcome back,</Text>
            <Text style={[styles.userName, { color: colors.foreground }]}>
              {profile?.display_name || user?.email?.split('@')[0] || 'Investor'}
            </Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/(app)/profile')}>
            <Avatar
              source={profile?.avatar_url}
              name={profile?.display_name || 'User'}
              size="md"
              backgroundColor={colors.primary}
            />
          </TouchableOpacity>
        </View>

        {/* XP Card */}
        <LinearGradient
          colors={[colors.primary, '#6366f1']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.xpCard}
        >
          <View style={styles.xpHeader}>
            <View>
              <Text style={styles.xpLevel}>Level {userStats?.level || 1}</Text>
              <Text style={styles.xpTitle}>
                {userStats?.experience_points?.toLocaleString() || 0} XP
              </Text>
            </View>
            <View style={styles.streakContainer}>
              <Ionicons name="flame" size={24} color="#fbbf24" />
              <Text style={styles.streakText}>{streak?.current_streak || 0} day streak</Text>
            </View>
          </View>
          <View style={styles.xpProgressContainer}>
            <Progress
              value={xpProgress.percentage}
              height={8}
              color="#fff"
              backgroundColor="rgba(255,255,255,0.3)"
            />
            <Text style={styles.xpProgressText}>
              {xpProgress.current} / {xpProgress.required} XP to next level
            </Text>
          </View>
        </LinearGradient>

        {/* Quick Stats */}
        <View style={styles.statsGrid}>
          <Card style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: colors.success + '20' }]}>
              <Ionicons name="wallet" size={20} color={colors.success} />
            </View>
            <Text style={[styles.statValue, { color: colors.foreground }]}>
              ${portfolioValue.total.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </Text>
            <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Portfolio</Text>
          </Card>

          <Card style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: colors.warning + '20' }]}>
              <Ionicons name="logo-bitcoin" size={20} color={colors.warning} />
            </View>
            <Text style={[styles.statValue, { color: colors.foreground }]}>
              {profile?.coins?.toLocaleString() || 0}
            </Text>
            <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Coins</Text>
          </Card>

          <Card style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: colors.info + '20' }]}>
              <Ionicons name="book" size={20} color={colors.info} />
            </View>
            <Text style={[styles.statValue, { color: colors.foreground }]}>
              {completedLessons}/{totalLessons}
            </Text>
            <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Lessons</Text>
          </Card>
        </View>

        {/* Continue Learning */}
        {nextLesson && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Continue Learning</Text>
            <TouchableOpacity
              onPress={() => router.push(`/(app)/lesson/${nextLesson.id}`)}
              activeOpacity={0.7}
            >
              <Card variant="elevated" style={styles.lessonCard}>
                <View style={styles.lessonContent}>
                  <View style={[styles.lessonIcon, { backgroundColor: colors.primary + '20' }]}>
                    <Ionicons name="play" size={24} color={colors.primary} />
                  </View>
                  <View style={styles.lessonInfo}>
                    <Text style={[styles.lessonTitle, { color: colors.foreground }]}>
                      {nextLesson.title}
                    </Text>
                    <View style={styles.lessonMeta}>
                      <Badge variant="secondary">{nextLesson.difficulty}</Badge>
                      <Text style={[styles.lessonDuration, { color: colors.mutedForeground }]}>
                        {nextLesson.duration_minutes} min
                      </Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={24} color={colors.mutedForeground} />
                </View>
              </Card>
            </TouchableOpacity>
          </View>
        )}

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity
              style={[styles.actionCard, { backgroundColor: colors.card }]}
              onPress={() => router.push('/(app)/trade')}
              activeOpacity={0.7}
            >
              <View style={[styles.actionIcon, { backgroundColor: colors.success + '20' }]}>
                <Ionicons name="trending-up" size={28} color={colors.success} />
              </View>
              <Text style={[styles.actionTitle, { color: colors.foreground }]}>Trade</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionCard, { backgroundColor: colors.card }]}
              onPress={() => router.push('/(app)/learn')}
              activeOpacity={0.7}
            >
              <View style={[styles.actionIcon, { backgroundColor: colors.info + '20' }]}>
                <Ionicons name="school" size={28} color={colors.info} />
              </View>
              <Text style={[styles.actionTitle, { color: colors.foreground }]}>Learn</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionCard, { backgroundColor: colors.card }]}
              onPress={() => router.push('/(app)/games')}
              activeOpacity={0.7}
            >
              <View style={[styles.actionIcon, { backgroundColor: colors.warning + '20' }]}>
                <Ionicons name="game-controller" size={28} color={colors.warning} />
              </View>
              <Text style={[styles.actionTitle, { color: colors.foreground }]}>Play</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionCard, { backgroundColor: colors.card }]}
              onPress={() => router.push('/(app)/profile')}
              activeOpacity={0.7}
            >
              <View style={[styles.actionIcon, { backgroundColor: colors.primary + '20' }]}>
                <Ionicons name="trophy" size={28} color={colors.primary} />
              </View>
              <Text style={[styles.actionTitle, { color: colors.foreground }]}>Awards</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  headerLeft: {},
  greeting: {
    fontSize: FontSizes.sm,
  },
  userName: {
    fontSize: FontSizes['2xl'],
    fontWeight: '700',
  },
  xpCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  xpHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  xpLevel: {
    fontSize: FontSizes.sm,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 2,
  },
  xpTitle: {
    fontSize: FontSizes['2xl'],
    fontWeight: '700',
    color: '#fff',
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  streakText: {
    color: '#fff',
    fontSize: FontSizes.sm,
    fontWeight: '600',
    marginLeft: Spacing.xs,
  },
  xpProgressContainer: {
    marginTop: Spacing.sm,
  },
  xpProgressText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: FontSizes.xs,
    marginTop: Spacing.xs,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  statValue: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: FontSizes.xs,
    marginTop: 2,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    marginBottom: Spacing.md,
  },
  lessonCard: {
    padding: Spacing.md,
  },
  lessonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lessonIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lessonInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  lessonTitle: {
    fontSize: FontSizes.base,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  lessonMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  lessonDuration: {
    fontSize: FontSizes.xs,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  actionCard: {
    width: '48%',
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.lg,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  actionTitle: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
  },
});
