import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface MarketInsight {
  id: string;
  type: 'bullish' | 'bearish' | 'neutral';
  title: string;
  description: string;
  confidence: number;
  symbol?: string;
}

const mockInsights: MarketInsight[] = [
  {
    id: '1',
    type: 'bullish',
    title: 'Tech Sector Momentum',
    description: 'Strong earnings reports from major tech companies suggest continued growth in the sector.',
    confidence: 75,
    symbol: 'XLK',
  },
  {
    id: '2',
    type: 'bearish',
    title: 'Rising Interest Rates',
    description: 'Fed signals potential rate hikes which may impact growth stocks and bond prices.',
    confidence: 68,
  },
  {
    id: '3',
    type: 'neutral',
    title: 'Market Consolidation',
    description: 'Major indices trading sideways as investors await economic data releases.',
    confidence: 82,
  },
];

const coachResponses: Record<string, string> = {
  default: "I'm here to help with your investing questions! You can ask me about:\n\n• Stock analysis and valuation\n• Portfolio diversification\n• Market trends and insights\n• Investment strategies\n• Risk management\n\nWhat would you like to learn about?",
  diversification: "Diversification is one of the most important concepts in investing! Here are the key points:\n\n1. **Don't put all eggs in one basket** - Spread investments across different asset classes\n\n2. **Asset classes to consider:**\n   • Stocks (domestic & international)\n   • Bonds\n   • Real estate (REITs)\n   • Commodities\n\n3. **The 60/40 rule** - A classic portfolio uses 60% stocks and 40% bonds, though this varies by age and risk tolerance\n\nWould you like me to analyze your current portfolio's diversification?",
  stocks: "When analyzing stocks, I look at several key metrics:\n\n**Valuation Metrics:**\n• P/E Ratio - Price relative to earnings\n• PEG Ratio - P/E adjusted for growth\n• Price/Book - Price relative to assets\n\n**Growth Indicators:**\n• Revenue growth rate\n• Earnings growth rate\n• Market share expansion\n\n**Quality Factors:**\n• Profit margins\n• Return on equity (ROE)\n• Debt levels\n\nWould you like me to analyze a specific stock?",
  risk: "Understanding risk is crucial for successful investing!\n\n**Types of Risk:**\n• Market Risk - Overall market declines\n• Company Risk - Individual stock problems\n• Inflation Risk - Purchasing power erosion\n• Interest Rate Risk - Bond price changes\n\n**Managing Risk:**\n1. Diversify your portfolio\n2. Match investments to your timeline\n3. Use stop-loss orders\n4. Regularly rebalance\n5. Don't invest money you'll need soon\n\nWhat's your current risk tolerance - conservative, moderate, or aggressive?",
  market: "Here's my current market analysis:\n\n📈 **Bullish Signals:**\n• Strong corporate earnings\n• Consumer spending holding up\n• Tech sector leadership\n\n📉 **Bearish Signals:**\n• Rising interest rates\n• Inflation concerns\n• Geopolitical tensions\n\n⚖️ **My Take:**\nThe market is showing mixed signals. I'd recommend maintaining a balanced portfolio and avoiding overexposure to any single sector.\n\nWant me to dive deeper into any specific area?",
};

export function AICoach() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'assistant',
      content: coachResponses.default,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'insights'>('chat');
  const scrollViewRef = useRef<ScrollView>(null);

  const handleSend = () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputText.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const lowerInput = inputText.toLowerCase();
      let response = coachResponses.default;

      if (lowerInput.includes('diversif')) {
        response = coachResponses.diversification;
      } else if (lowerInput.includes('stock') || lowerInput.includes('valuat')) {
        response = coachResponses.stocks;
      } else if (lowerInput.includes('risk')) {
        response = coachResponses.risk;
      } else if (lowerInput.includes('market') || lowerInput.includes('trend')) {
        response = coachResponses.market;
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages, isTyping]);

  const renderChat = () => (
    <View style={styles.chatContainer}>
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.messageBubble,
              message.role === 'user' ? styles.userBubble : styles.assistantBubble,
            ]}
          >
            {message.role === 'assistant' && (
              <View style={styles.assistantAvatar}>
                <Ionicons name="sparkles" size={16} color={Colors.dark.primary} />
              </View>
            )}
            <View style={[
              styles.messageContent,
              message.role === 'user' ? styles.userContent : styles.assistantContent,
            ]}>
              <Text style={styles.messageText}>{message.content}</Text>
              <Text style={styles.messageTime}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
          </View>
        ))}

        {isTyping && (
          <View style={[styles.messageBubble, styles.assistantBubble]}>
            <View style={styles.assistantAvatar}>
              <Ionicons name="sparkles" size={16} color={Colors.dark.primary} />
            </View>
            <View style={[styles.messageContent, styles.assistantContent]}>
              <View style={styles.typingIndicator}>
                <View style={[styles.typingDot, styles.typingDot1]} />
                <View style={[styles.typingDot, styles.typingDot2]} />
                <View style={[styles.typingDot, styles.typingDot3]} />
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Quick Actions */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.quickActions}
        contentContainerStyle={styles.quickActionsContent}
      >
        {['Analyze my portfolio', 'Market trends', 'Stock picks', 'Risk assessment'].map((action) => (
          <TouchableOpacity
            key={action}
            style={styles.quickActionButton}
            onPress={() => setInputText(action)}
          >
            <Text style={styles.quickActionText}>{action}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Ask your AI coach..."
          placeholderTextColor={Colors.dark.textSecondary}
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
          onPress={handleSend}
          disabled={!inputText.trim()}
        >
          <Ionicons name="send" size={20} color={Colors.dark.text} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderInsights = () => (
    <ScrollView style={styles.insightsContainer} showsVerticalScrollIndicator={false}>
      <View style={styles.insightsHeader}>
        <Text style={styles.insightsTitle}>Market Insights</Text>
        <Text style={styles.insightsSubtitle}>AI-powered analysis updated in real-time</Text>
      </View>

      {mockInsights.map((insight) => (
        <View key={insight.id} style={styles.insightCard}>
          <View style={styles.insightHeader}>
            <View style={[
              styles.insightTypeBadge,
              {
                backgroundColor: insight.type === 'bullish' ? Colors.dark.success + '20' :
                                insight.type === 'bearish' ? Colors.dark.error + '20' : Colors.dark.warning + '20'
              }
            ]}>
              <Ionicons
                name={insight.type === 'bullish' ? 'trending-up' :
                      insight.type === 'bearish' ? 'trending-down' : 'remove'}
                size={16}
                color={insight.type === 'bullish' ? Colors.dark.success :
                       insight.type === 'bearish' ? Colors.dark.error : Colors.dark.warning}
              />
              <Text style={[
                styles.insightTypeText,
                {
                  color: insight.type === 'bullish' ? Colors.dark.success :
                         insight.type === 'bearish' ? Colors.dark.error : Colors.dark.warning
                }
              ]}>
                {insight.type}
              </Text>
            </View>
            {insight.symbol && (
              <View style={styles.symbolBadge}>
                <Text style={styles.symbolText}>{insight.symbol}</Text>
              </View>
            )}
          </View>

          <Text style={styles.insightTitle}>{insight.title}</Text>
          <Text style={styles.insightDescription}>{insight.description}</Text>

          <View style={styles.confidenceBar}>
            <Text style={styles.confidenceLabel}>Confidence</Text>
            <View style={styles.confidenceTrack}>
              <View style={[styles.confidenceFill, { width: `${insight.confidence}%` }]} />
            </View>
            <Text style={styles.confidenceValue}>{insight.confidence}%</Text>
          </View>
        </View>
      ))}

      {/* Market Sentiment */}
      <View style={styles.sentimentCard}>
        <Text style={styles.sentimentTitle}>Overall Market Sentiment</Text>
        <View style={styles.sentimentMeter}>
          <View style={styles.sentimentScale}>
            <Text style={[styles.sentimentLabel, { color: Colors.dark.error }]}>Fear</Text>
            <Text style={[styles.sentimentLabel, { color: Colors.dark.textSecondary }]}>Neutral</Text>
            <Text style={[styles.sentimentLabel, { color: Colors.dark.success }]}>Greed</Text>
          </View>
          <View style={styles.sentimentTrack}>
            <View style={[styles.sentimentIndicator, { left: '62%' }]} />
          </View>
        </View>
        <Text style={styles.sentimentValue}>Slightly Greedy (62)</Text>
        <Text style={styles.sentimentHint}>
          Markets are showing optimism. Consider being cautious with new positions.
        </Text>
      </View>
    </ScrollView>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100}
    >
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'chat' && styles.tabActive]}
          onPress={() => setActiveTab('chat')}
        >
          <Ionicons
            name="chatbubbles"
            size={20}
            color={activeTab === 'chat' ? Colors.dark.primary : Colors.dark.textSecondary}
          />
          <Text style={[styles.tabText, activeTab === 'chat' && styles.tabTextActive]}>
            AI Coach
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'insights' && styles.tabActive]}
          onPress={() => setActiveTab('insights')}
        >
          <Ionicons
            name="bulb"
            size={20}
            color={activeTab === 'insights' ? Colors.dark.primary : Colors.dark.textSecondary}
          />
          <Text style={[styles.tabText, activeTab === 'insights' && styles.tabTextActive]}>
            Insights
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'chat' ? renderChat() : renderInsights()}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.border,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 8,
    borderRadius: 8,
  },
  tabActive: {
    backgroundColor: Colors.dark.primary + '20',
  },
  tabText: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
    fontWeight: '500',
  },
  tabTextActive: {
    color: Colors.dark.primary,
  },
  // Chat styles
  chatContainer: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    gap: 12,
  },
  messageBubble: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  userBubble: {
    justifyContent: 'flex-end',
  },
  assistantBubble: {
    justifyContent: 'flex-start',
  },
  assistantAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.dark.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageContent: {
    maxWidth: SCREEN_WIDTH * 0.75,
    borderRadius: 16,
    padding: 12,
  },
  userContent: {
    backgroundColor: Colors.dark.primary,
    borderBottomRightRadius: 4,
  },
  assistantContent: {
    backgroundColor: Colors.dark.card,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 14,
    color: Colors.dark.text,
    lineHeight: 20,
  },
  messageTime: {
    fontSize: 10,
    color: Colors.dark.textSecondary,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  typingIndicator: {
    flexDirection: 'row',
    gap: 4,
    padding: 4,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.dark.textSecondary,
  },
  typingDot1: {
    opacity: 0.4,
  },
  typingDot2: {
    opacity: 0.6,
  },
  typingDot3: {
    opacity: 0.8,
  },
  quickActions: {
    maxHeight: 50,
    borderTopWidth: 1,
    borderTopColor: Colors.dark.border,
  },
  quickActionsContent: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  quickActionButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: Colors.dark.card,
    borderRadius: 16,
    marginRight: 8,
  },
  quickActionText: {
    fontSize: 13,
    color: Colors.dark.text,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.dark.border,
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.dark.card,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    color: Colors.dark.text,
    maxHeight: 100,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.dark.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: Colors.dark.border,
  },
  // Insights styles
  insightsContainer: {
    flex: 1,
    padding: 16,
  },
  insightsHeader: {
    marginBottom: 16,
  },
  insightsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.dark.text,
  },
  insightsSubtitle: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
    marginTop: 4,
  },
  insightCard: {
    backgroundColor: Colors.dark.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  insightTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  insightTypeText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  symbolBadge: {
    backgroundColor: Colors.dark.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  symbolText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.dark.text,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.dark.text,
    marginBottom: 8,
  },
  insightDescription: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  confidenceBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  confidenceLabel: {
    fontSize: 12,
    color: Colors.dark.textSecondary,
  },
  confidenceTrack: {
    flex: 1,
    height: 6,
    backgroundColor: Colors.dark.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  confidenceFill: {
    height: '100%',
    backgroundColor: Colors.dark.primary,
    borderRadius: 3,
  },
  confidenceValue: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.dark.text,
    width: 35,
    textAlign: 'right',
  },
  sentimentCard: {
    backgroundColor: Colors.dark.card,
    borderRadius: 16,
    padding: 20,
    marginTop: 8,
  },
  sentimentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.dark.text,
    marginBottom: 16,
  },
  sentimentMeter: {
    marginBottom: 12,
  },
  sentimentScale: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  sentimentLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
  sentimentTrack: {
    height: 8,
    backgroundColor: Colors.dark.border,
    borderRadius: 4,
    position: 'relative',
    overflow: 'visible',
  },
  sentimentIndicator: {
    position: 'absolute',
    top: -4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.dark.primary,
    borderWidth: 3,
    borderColor: Colors.dark.background,
    marginLeft: -8,
  },
  sentimentValue: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.dark.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  sentimentHint: {
    fontSize: 13,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
});
