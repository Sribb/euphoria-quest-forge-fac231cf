import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Modal } from 'react-native';
import Svg, { Path, Circle, Text as SvgText, G, Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface Certificate {
  id: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  name: string;
  description: string;
  requirements: string[];
  xpRequired: number;
  lessonsRequired: number;
  gamesPlayed: number;
  icon: string;
  unlocked: boolean;
  unlockedAt?: Date;
}

const certificates: Certificate[] = [
  // Bronze Tier
  {
    id: 'bronze-1',
    tier: 'bronze',
    name: 'Market Newcomer',
    description: 'Begin your journey into the financial markets',
    requirements: ['Complete onboarding quiz', 'Finish 1 lesson', 'Play 1 game'],
    xpRequired: 100,
    lessonsRequired: 1,
    gamesPlayed: 1,
    icon: 'rocket',
    unlocked: true,
    unlockedAt: new Date('2024-01-15'),
  },
  {
    id: 'bronze-2',
    tier: 'bronze',
    name: 'First Trade',
    description: 'Execute your first simulated trade',
    requirements: ['Make a buy order', 'Make a sell order', 'View portfolio'],
    xpRequired: 200,
    lessonsRequired: 2,
    gamesPlayed: 2,
    icon: 'swap-horizontal',
    unlocked: true,
    unlockedAt: new Date('2024-01-18'),
  },
  {
    id: 'bronze-3',
    tier: 'bronze',
    name: 'Knowledge Seeker',
    description: 'Show dedication to learning',
    requirements: ['Complete 5 lessons', 'Score 70%+ on quizzes', 'Earn 500 XP'],
    xpRequired: 500,
    lessonsRequired: 5,
    gamesPlayed: 3,
    icon: 'book',
    unlocked: true,
    unlockedAt: new Date('2024-01-25'),
  },
  {
    id: 'bronze-4',
    tier: 'bronze',
    name: 'Risk Aware',
    description: 'Understand the basics of investment risk',
    requirements: ['Complete Risk lesson', 'Use risk calculator', 'Build diversified portfolio'],
    xpRequired: 750,
    lessonsRequired: 7,
    gamesPlayed: 5,
    icon: 'shield-checkmark',
    unlocked: false,
  },
  // Silver Tier
  {
    id: 'silver-1',
    tier: 'silver',
    name: 'Chart Reader',
    description: 'Master the art of technical analysis',
    requirements: ['Complete Technical Analysis', 'Score 80%+ on pattern quiz', 'Analyze 10 charts'],
    xpRequired: 1500,
    lessonsRequired: 10,
    gamesPlayed: 10,
    icon: 'analytics',
    unlocked: false,
  },
  {
    id: 'silver-2',
    tier: 'silver',
    name: 'Value Hunter',
    description: 'Learn to find undervalued stocks',
    requirements: ['Complete Valuation lesson', 'Use all valuation methods', 'Identify 5 value stocks'],
    xpRequired: 2000,
    lessonsRequired: 12,
    gamesPlayed: 12,
    icon: 'search',
    unlocked: false,
  },
  {
    id: 'silver-3',
    tier: 'silver',
    name: 'Portfolio Architect',
    description: 'Build and balance a complete portfolio',
    requirements: ['Complete Diversification lesson', 'Create 3 portfolio types', 'Optimize asset allocation'],
    xpRequired: 2500,
    lessonsRequired: 15,
    gamesPlayed: 15,
    icon: 'pie-chart',
    unlocked: false,
  },
  {
    id: 'silver-4',
    tier: 'silver',
    name: 'Game Master',
    description: 'Prove your skills in all financial games',
    requirements: ['Play all 5 games', 'Score top 20% in each', 'Earn 1000 game XP'],
    xpRequired: 3000,
    lessonsRequired: 17,
    gamesPlayed: 25,
    icon: 'game-controller',
    unlocked: false,
  },
  // Gold Tier
  {
    id: 'gold-1',
    tier: 'gold',
    name: 'Market Analyst',
    description: 'Demonstrate advanced market analysis skills',
    requirements: ['Complete all analysis lessons', 'Make 50 trades', 'Achieve 60% win rate'],
    xpRequired: 5000,
    lessonsRequired: 20,
    gamesPlayed: 30,
    icon: 'stats-chart',
    unlocked: false,
  },
  {
    id: 'gold-2',
    tier: 'gold',
    name: 'Wealth Builder',
    description: 'Show consistent portfolio growth',
    requirements: ['Grow portfolio by 25%', 'Maintain for 30 days', 'Survive 3 market crashes'],
    xpRequired: 7500,
    lessonsRequired: 22,
    gamesPlayed: 40,
    icon: 'trending-up',
    unlocked: false,
  },
  {
    id: 'gold-3',
    tier: 'gold',
    name: 'Educator',
    description: 'Master all educational content',
    requirements: ['Complete all 25 lessons', 'Score 90%+ average', 'Earn all lesson badges'],
    xpRequired: 10000,
    lessonsRequired: 25,
    gamesPlayed: 50,
    icon: 'school',
    unlocked: false,
  },
  {
    id: 'gold-4',
    tier: 'gold',
    name: 'Strategic Thinker',
    description: 'Prove advanced strategic capabilities',
    requirements: ['Create custom strategy', 'Backtest successfully', 'Achieve positive alpha'],
    xpRequired: 12500,
    lessonsRequired: 25,
    gamesPlayed: 60,
    icon: 'bulb',
    unlocked: false,
  },
  // Platinum Tier
  {
    id: 'platinum-1',
    tier: 'platinum',
    name: 'Market Master',
    description: 'Achieve mastery of all market concepts',
    requirements: ['100% course completion', 'Top 10% in all games', '95%+ quiz average'],
    xpRequired: 20000,
    lessonsRequired: 25,
    gamesPlayed: 100,
    icon: 'trophy',
    unlocked: false,
  },
  {
    id: 'platinum-2',
    tier: 'platinum',
    name: 'Trading Legend',
    description: 'Demonstrate exceptional trading performance',
    requirements: ['100 winning trades', '70%+ win rate', 'Double initial portfolio'],
    xpRequired: 30000,
    lessonsRequired: 25,
    gamesPlayed: 150,
    icon: 'star',
    unlocked: false,
  },
  {
    id: 'platinum-3',
    tier: 'platinum',
    name: 'Financial Guru',
    description: 'Complete mastery of financial literacy',
    requirements: ['All certificates unlocked', 'Max level achieved', 'Help 10 other users'],
    xpRequired: 50000,
    lessonsRequired: 25,
    gamesPlayed: 200,
    icon: 'diamond',
    unlocked: false,
  },
  {
    id: 'platinum-4',
    tier: 'platinum',
    name: 'Wall Street Elite',
    description: 'The ultimate achievement in Euphoria Quest',
    requirements: ['Complete all challenges', 'Perfect score in all games', '100K+ lifetime XP'],
    xpRequired: 100000,
    lessonsRequired: 25,
    gamesPlayed: 300,
    icon: 'ribbon',
    unlocked: false,
  },
];

const tierColors = {
  bronze: '#CD7F32',
  silver: '#C0C0C0',
  gold: '#FFD700',
  platinum: '#E5E4E2',
};

const tierGradients = {
  bronze: ['#CD7F32', '#8B4513'],
  silver: ['#C0C0C0', '#808080'],
  gold: ['#FFD700', '#DAA520'],
  platinum: ['#E5E4E2', '#B0B0B0'],
};

interface CertificateSystemProps {
  userXP?: number;
  lessonsCompleted?: number;
  gamesPlayed?: number;
}

export function CertificateSystem({
  userXP = 1250,
  lessonsCompleted = 8,
  gamesPlayed = 12,
}: CertificateSystemProps) {
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [selectedTier, setSelectedTier] = useState<string>('all');

  const filteredCertificates = selectedTier === 'all'
    ? certificates
    : certificates.filter(c => c.tier === selectedTier);

  const unlockedCount = certificates.filter(c => c.unlocked).length;
  const progress = (unlockedCount / certificates.length) * 100;

  const renderCertificateBadge = (cert: Certificate, size = 80) => {
    const color = tierColors[cert.tier];
    const gradient = tierGradients[cert.tier];

    return (
      <Svg width={size} height={size} viewBox="0 0 100 100">
        <Defs>
          <LinearGradient id={`grad-${cert.id}`} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor={gradient[0]} />
            <Stop offset="100%" stopColor={gradient[1]} />
          </LinearGradient>
        </Defs>

        {/* Outer ring */}
        <Circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke={cert.unlocked ? `url(#grad-${cert.id})` : Colors.dark.border}
          strokeWidth="4"
        />

        {/* Inner circle */}
        <Circle
          cx="50"
          cy="50"
          r="38"
          fill={cert.unlocked ? color + '20' : Colors.dark.card}
        />

        {/* Star decoration */}
        {cert.unlocked && (
          <G>
            <Path
              d="M50 15 L53 25 L63 25 L55 32 L58 42 L50 36 L42 42 L45 32 L37 25 L47 25 Z"
              fill={color}
              transform="scale(0.5) translate(50, 30)"
            />
          </G>
        )}

        {/* Lock icon for locked certificates */}
        {!cert.unlocked && (
          <SvgText
            x="50"
            y="55"
            fontSize="24"
            textAnchor="middle"
            fill={Colors.dark.textSecondary}
          >
            🔒
          </SvgText>
        )}
      </Svg>
    );
  };

  const renderCertificateModal = () => {
    if (!selectedCertificate) return null;

    const color = tierColors[selectedCertificate.tier];
    const xpProgress = Math.min(100, (userXP / selectedCertificate.xpRequired) * 100);
    const lessonProgress = Math.min(100, (lessonsCompleted / selectedCertificate.lessonsRequired) * 100);
    const gameProgress = Math.min(100, (gamesPlayed / selectedCertificate.gamesPlayed) * 100);

    return (
      <Modal
        visible={!!selectedCertificate}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedCertificate(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setSelectedCertificate(null)}
            >
              <Ionicons name="close" size={24} color={Colors.dark.text} />
            </TouchableOpacity>

            <View style={styles.modalBadge}>
              {renderCertificateBadge(selectedCertificate, 120)}
            </View>

            <View style={[styles.tierBadge, { backgroundColor: color + '20' }]}>
              <Text style={[styles.tierBadgeText, { color }]}>
                {selectedCertificate.tier.toUpperCase()}
              </Text>
            </View>

            <Text style={styles.modalTitle}>{selectedCertificate.name}</Text>
            <Text style={styles.modalDescription}>{selectedCertificate.description}</Text>

            {selectedCertificate.unlocked ? (
              <View style={styles.unlockedBanner}>
                <Ionicons name="checkmark-circle" size={24} color={Colors.dark.success} />
                <Text style={styles.unlockedText}>
                  Unlocked on {selectedCertificate.unlockedAt?.toLocaleDateString()}
                </Text>
              </View>
            ) : (
              <View style={styles.progressSection}>
                <Text style={styles.progressTitle}>Progress</Text>

                <View style={styles.progressItem}>
                  <View style={styles.progressHeader}>
                    <Text style={styles.progressLabel}>XP Required</Text>
                    <Text style={styles.progressValue}>
                      {userXP.toLocaleString()}/{selectedCertificate.xpRequired.toLocaleString()}
                    </Text>
                  </View>
                  <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${xpProgress}%`, backgroundColor: color }]} />
                  </View>
                </View>

                <View style={styles.progressItem}>
                  <View style={styles.progressHeader}>
                    <Text style={styles.progressLabel}>Lessons</Text>
                    <Text style={styles.progressValue}>
                      {lessonsCompleted}/{selectedCertificate.lessonsRequired}
                    </Text>
                  </View>
                  <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${lessonProgress}%`, backgroundColor: color }]} />
                  </View>
                </View>

                <View style={styles.progressItem}>
                  <View style={styles.progressHeader}>
                    <Text style={styles.progressLabel}>Games Played</Text>
                    <Text style={styles.progressValue}>
                      {gamesPlayed}/{selectedCertificate.gamesPlayed}
                    </Text>
                  </View>
                  <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${gameProgress}%`, backgroundColor: color }]} />
                  </View>
                </View>
              </View>
            )}

            <View style={styles.requirementsSection}>
              <Text style={styles.requirementsTitle}>Requirements</Text>
              {selectedCertificate.requirements.map((req, index) => (
                <View key={index} style={styles.requirementItem}>
                  <Ionicons
                    name={selectedCertificate.unlocked ? 'checkmark-circle' : 'ellipse-outline'}
                    size={18}
                    color={selectedCertificate.unlocked ? Colors.dark.success : Colors.dark.textSecondary}
                  />
                  <Text style={styles.requirementText}>{req}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Certificates</Text>
        <Text style={styles.subtitle}>
          Earn certificates by completing challenges
        </Text>
      </View>

      {/* Overall Progress */}
      <View style={styles.overallProgress}>
        <View style={styles.progressStats}>
          <Text style={styles.progressCount}>{unlockedCount}/{certificates.length}</Text>
          <Text style={styles.progressLabel}>Certificates Earned</Text>
        </View>
        <View style={styles.progressRing}>
          <Svg width={80} height={80}>
            <Circle
              cx="40"
              cy="40"
              r="35"
              fill="none"
              stroke={Colors.dark.border}
              strokeWidth="6"
            />
            <Circle
              cx="40"
              cy="40"
              r="35"
              fill="none"
              stroke={Colors.dark.primary}
              strokeWidth="6"
              strokeDasharray={`${progress * 2.2} 220`}
              strokeLinecap="round"
              transform="rotate(-90 40 40)"
            />
            <SvgText
              x="40"
              y="45"
              fontSize="16"
              fontWeight="bold"
              textAnchor="middle"
              fill={Colors.dark.text}
            >
              {Math.round(progress)}%
            </SvgText>
          </Svg>
        </View>
      </View>

      {/* Tier Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tierFilter}
        contentContainerStyle={styles.tierFilterContent}
      >
        {['all', 'bronze', 'silver', 'gold', 'platinum'].map((tier) => (
          <TouchableOpacity
            key={tier}
            style={[
              styles.tierButton,
              selectedTier === tier && styles.tierButtonActive,
              tier !== 'all' && { borderColor: tierColors[tier as keyof typeof tierColors] },
            ]}
            onPress={() => setSelectedTier(tier)}
          >
            <Text style={[
              styles.tierButtonText,
              selectedTier === tier && styles.tierButtonTextActive,
              tier !== 'all' && selectedTier === tier && { color: tierColors[tier as keyof typeof tierColors] },
            ]}>
              {tier.charAt(0).toUpperCase() + tier.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Certificates Grid */}
      <View style={styles.certificatesGrid}>
        {filteredCertificates.map((cert) => (
          <TouchableOpacity
            key={cert.id}
            style={[
              styles.certificateCard,
              cert.unlocked && styles.certificateCardUnlocked,
              cert.unlocked && { borderColor: tierColors[cert.tier] },
            ]}
            onPress={() => setSelectedCertificate(cert)}
          >
            <View style={styles.certificateBadgeContainer}>
              {renderCertificateBadge(cert, 60)}
            </View>
            <Text style={styles.certificateName} numberOfLines={1}>
              {cert.name}
            </Text>
            <View style={[styles.certificateTier, { backgroundColor: tierColors[cert.tier] + '20' }]}>
              <Text style={[styles.certificateTierText, { color: tierColors[cert.tier] }]}>
                {cert.tier}
              </Text>
            </View>
            {cert.unlocked && (
              <View style={styles.unlockedIndicator}>
                <Ionicons name="checkmark-circle" size={20} color={Colors.dark.success} />
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {renderCertificateModal()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  header: {
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.dark.text,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
    marginTop: 8,
  },
  overallProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.dark.card,
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  progressStats: {
    flex: 1,
  },
  progressCount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.dark.text,
  },
  progressLabel: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
    marginTop: 4,
  },
  progressRing: {
    marginLeft: 16,
  },
  tierFilter: {
    marginBottom: 16,
  },
  tierFilterContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  tierButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: Colors.dark.card,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  tierButtonActive: {
    backgroundColor: Colors.dark.primary + '20',
    borderColor: Colors.dark.primary,
  },
  tierButtonText: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
    fontWeight: '500',
  },
  tierButtonTextActive: {
    color: Colors.dark.primary,
  },
  certificatesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    gap: 12,
    paddingBottom: 24,
  },
  certificateCard: {
    width: (SCREEN_WIDTH - 48) / 2,
    backgroundColor: Colors.dark.card,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  certificateCardUnlocked: {
    borderWidth: 2,
  },
  certificateBadgeContainer: {
    marginBottom: 12,
  },
  certificateName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.dark.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  certificateTier: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  certificateTierText: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  unlockedIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: Colors.dark.card,
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
  },
  modalBadge: {
    marginBottom: 16,
  },
  tierBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 12,
  },
  tierBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.dark.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  modalDescription: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  unlockedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.success + '20',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
    marginBottom: 16,
  },
  unlockedText: {
    color: Colors.dark.success,
    fontSize: 14,
    fontWeight: '500',
  },
  progressSection: {
    width: '100%',
    marginBottom: 16,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.dark.text,
    marginBottom: 12,
  },
  progressItem: {
    marginBottom: 12,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressValue: {
    fontSize: 12,
    color: Colors.dark.text,
    fontWeight: '600',
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.dark.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  requirementsSection: {
    width: '100%',
  },
  requirementsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.dark.text,
    marginBottom: 12,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  requirementText: {
    flex: 1,
    fontSize: 14,
    color: Colors.dark.textSecondary,
  },
});
