import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useXPSystem } from '@/hooks/useXPSystem';
import { usePortfolio } from '@/hooks/usePortfolio';
import { Card, Avatar, Badge, Progress, Button, LoadingScreen, Input } from '@/components/ui';
import { Colors, ThemeColors, FontSizes, Spacing, BorderRadius } from '@/constants/theme';

export default function ProfileScreen() {
  const colors = Colors.dark;
  const { user, signOut } = useAuth();
  const { profile, streak, achievements, getEarnedAchievements, updateProfile, isUpdating, profileLoading } = useProfile();
  const { userStats, getXPProgress, toggleMentorMode } = useXPSystem();
  const { calculatePortfolioValue } = usePortfolio();

  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(profile?.display_name || '');

  const xpProgress = getXPProgress();
  const portfolioValue = calculatePortfolioValue();
  const earnedAchievements = getEarnedAchievements();

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await signOut();
          router.replace('/(auth)/login');
        },
      },
    ]);
  };

  const handleSaveProfile = () => {
    updateProfile({ display_name: displayName });
    setIsEditing(false);
  };

  if (profileLoading) {
    return <LoadingScreen message="Loading profile..." />;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.header}>
          <Avatar
            source={profile?.avatar_url}
            name={profile?.display_name || user?.email || 'User'}
            size="xl"
            backgroundColor={colors.primary}
          />
          {isEditing ? (
            <View style={styles.editContainer}>
              <Input
                value={displayName}
                onChangeText={setDisplayName}
                placeholder="Display name"
                containerStyle={{ marginBottom: 0 }}
              />
              <View style={styles.editActions}>
                <Button variant="outline" size="sm" onPress={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" onPress={handleSaveProfile} loading={isUpdating}>
                  Save
                </Button>
              </View>
            </View>
          ) : (
            <>
              <Text style={[styles.userName, { color: colors.foreground }]}>
                {profile?.display_name || user?.email?.split('@')[0] || 'Investor'}
              </Text>
              <Text style={[styles.userEmail, { color: colors.mutedForeground }]}>
                {user?.email}
              </Text>
              <TouchableOpacity onPress={() => setIsEditing(true)}>
                <Text style={[styles.editLink, { color: colors.primary }]}>Edit Profile</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Level Card */}
        <LinearGradient
          colors={[colors.primary, '#6366f1']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.levelCard}
        >
          <View style={styles.levelHeader}>
            <View>
              <Text style={styles.levelLabel}>Level {userStats?.level || 1}</Text>
              <Text style={styles.levelXP}>
                {userStats?.experience_points?.toLocaleString() || 0} XP
              </Text>
            </View>
            <View style={styles.streakBadge}>
              <Ionicons name="flame" size={20} color="#fbbf24" />
              <Text style={styles.streakText}>{streak?.current_streak || 0}</Text>
            </View>
          </View>
          <Progress
            value={xpProgress.percentage}
            height={8}
            color="#fff"
            backgroundColor="rgba(255,255,255,0.3)"
          />
          <Text style={styles.levelProgress}>
            {xpProgress.current} / {xpProgress.required} XP to next level
          </Text>
        </LinearGradient>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <Card style={styles.statCard}>
            <Ionicons name="wallet" size={24} color={colors.success} />
            <Text style={[styles.statValue, { color: colors.foreground }]}>
              ${portfolioValue.total.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </Text>
            <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Portfolio</Text>
          </Card>
          <Card style={styles.statCard}>
            <Ionicons name="logo-bitcoin" size={24} color={colors.gold} />
            <Text style={[styles.statValue, { color: colors.foreground }]}>
              {profile?.coins?.toLocaleString() || 0}
            </Text>
            <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Coins</Text>
          </Card>
          <Card style={styles.statCard}>
            <Ionicons name="trophy" size={24} color={colors.warning} />
            <Text style={[styles.statValue, { color: colors.foreground }]}>
              {earnedAchievements.length}
            </Text>
            <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Awards</Text>
          </Card>
        </View>

        {/* Achievements */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Achievements</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.achievementsRow}>
              {earnedAchievements.length > 0 ? (
                earnedAchievements.slice(0, 5).map((achievement) => (
                  <View
                    key={achievement.id}
                    style={[styles.achievementBadge, { backgroundColor: colors.card }]}
                  >
                    <Text style={styles.achievementIcon}>{achievement.icon}</Text>
                    <Text
                      style={[styles.achievementTitle, { color: colors.foreground }]}
                      numberOfLines={1}
                    >
                      {achievement.title}
                    </Text>
                  </View>
                ))
              ) : (
                <Text style={[styles.noAchievements, { color: colors.mutedForeground }]}>
                  Complete lessons and games to earn achievements!
                </Text>
              )}
            </View>
          </ScrollView>
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Settings</Text>

          <Card style={styles.settingsCard}>
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Ionicons name="school" size={24} color={colors.primary} />
                <View style={styles.settingText}>
                  <Text style={[styles.settingTitle, { color: colors.foreground }]}>
                    Mentor Mode
                  </Text>
                  <Text style={[styles.settingDescription, { color: colors.mutedForeground }]}>
                    Get extra hints and guidance
                  </Text>
                </View>
              </View>
              <Switch
                value={userStats?.mentor_mode_enabled || false}
                onValueChange={(value) => toggleMentorMode(value)}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor="#fff"
              />
            </View>

            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Ionicons name="notifications" size={24} color={colors.info} />
                <View style={styles.settingText}>
                  <Text style={[styles.settingTitle, { color: colors.foreground }]}>
                    Notifications
                  </Text>
                  <Text style={[styles.settingDescription, { color: colors.mutedForeground }]}>
                    Manage push notifications
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.mutedForeground} />
            </TouchableOpacity>

            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Ionicons name="color-palette" size={24} color={colors.warning} />
                <View style={styles.settingText}>
                  <Text style={[styles.settingTitle, { color: colors.foreground }]}>Theme</Text>
                  <Text style={[styles.settingDescription, { color: colors.mutedForeground }]}>
                    Customize app appearance
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.mutedForeground} />
            </TouchableOpacity>
          </Card>
        </View>

        {/* Theme Colors */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Accent Color</Text>
          <View style={styles.colorGrid}>
            {ThemeColors.map((color) => (
              <TouchableOpacity
                key={color.value}
                style={[
                  styles.colorOption,
                  { backgroundColor: color.value },
                  colors.primary === color.value && styles.colorOptionSelected,
                ]}
              />
            ))}
          </View>
        </View>

        {/* Sign Out */}
        <View style={styles.section}>
          <Button variant="destructive" fullWidth onPress={handleSignOut}>
            Sign Out
          </Button>
        </View>

        <Text style={[styles.version, { color: colors.mutedForeground }]}>
          Euphoria Quest Forge v1.0.0
        </Text>
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
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  userName: {
    fontSize: FontSizes['2xl'],
    fontWeight: '700',
    marginTop: Spacing.md,
  },
  userEmail: {
    fontSize: FontSizes.sm,
    marginTop: Spacing.xs,
  },
  editLink: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    marginTop: Spacing.sm,
  },
  editContainer: {
    width: '100%',
    marginTop: Spacing.md,
  },
  editActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  levelCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  levelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  levelLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: FontSizes.sm,
  },
  levelXP: {
    color: '#fff',
    fontSize: FontSizes['2xl'],
    fontWeight: '700',
  },
  streakBadge: {
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
    marginLeft: 4,
  },
  levelProgress: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: FontSizes.xs,
    textAlign: 'center',
    marginTop: Spacing.sm,
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
  statValue: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    marginTop: Spacing.xs,
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
  achievementsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  achievementBadge: {
    width: 80,
    alignItems: 'center',
    padding: Spacing.sm,
    borderRadius: BorderRadius.lg,
  },
  achievementIcon: {
    fontSize: 32,
    marginBottom: Spacing.xs,
  },
  achievementTitle: {
    fontSize: FontSizes.xs,
    textAlign: 'center',
  },
  noAchievements: {
    fontSize: FontSizes.sm,
    fontStyle: 'italic',
  },
  settingsCard: {
    padding: 0,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: Spacing.md,
    flex: 1,
  },
  settingTitle: {
    fontSize: FontSizes.base,
    fontWeight: '500',
  },
  settingDescription: {
    fontSize: FontSizes.xs,
    marginTop: 2,
  },
  divider: {
    height: 1,
    marginHorizontal: Spacing.md,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  colorOptionSelected: {
    borderWidth: 3,
    borderColor: '#fff',
  },
  version: {
    fontSize: FontSizes.xs,
    textAlign: 'center',
    marginTop: Spacing.lg,
  },
});
