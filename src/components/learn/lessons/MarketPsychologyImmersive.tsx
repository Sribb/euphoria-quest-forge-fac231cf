import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  MessageSquare, Zap, Trophy, TrendingUp, 
  TrendingDown, AlertTriangle, Users, Brain,
  ThumbsUp, ThumbsDown, Eye
} from "lucide-react";

type Phase = "hook" | "feed" | "results";
type Sentiment = "extreme_fear" | "fear" | "neutral" | "greed" | "extreme_greed";
type Decision = "follow" | "ignore" | "contrarian";

interface SocialPost {
  id: string;
  username: string;
  content: string;
  sentiment: Sentiment;
  likes: number;
  isInfluencer: boolean;
  fundamentallySound: boolean;
}

interface MarketEvent {
  title: string;
  description: string;
  sentiment: Sentiment;
  posts: SocialPost[];
  correctAction: Decision;
  fundamentalReason: string;
}

const marketEvents: MarketEvent[] = [
  {
    title: "Tech Stock Crash",
    description: "Major tech stocks down 15% in one week",
    sentiment: "extreme_fear",
    correctAction: "contrarian",
    fundamentalReason: "Earnings still strong, temporary sentiment-driven selloff",
    posts: [
      { id: "1", username: "@WallStreetPanic", content: "SELL EVERYTHING NOW!!! 📉 This is 2008 all over again! Get out while you can!", sentiment: "extreme_fear", likes: 45000, isInfluencer: true, fundamentallySound: false },
      { id: "2", username: "@CalmInvestor", content: "Fundamentals unchanged. P/E ratios now at 5-year lows. Buying opportunity.", sentiment: "neutral", likes: 1200, isInfluencer: false, fundamentallySound: true },
      { id: "3", username: "@CryptoKing", content: "I warned you! Tech is DEAD! Move everything to Bitcoin NOW! 🚀", sentiment: "extreme_fear", likes: 32000, isInfluencer: true, fundamentallySound: false }
    ]
  },
  {
    title: "Meme Stock Mania",
    description: "Unknown stock up 400% in 2 days on social media hype",
    sentiment: "extreme_greed",
    correctAction: "ignore",
    fundamentalReason: "No fundamental change, pure speculation, risk of collapse is high",
    posts: [
      { id: "4", username: "@DiamondHands", content: "🚀🚀🚀 $MEME TO THE MOON! Join the movement! Buy now or cry later! 💎🙌", sentiment: "extreme_greed", likes: 89000, isInfluencer: true, fundamentallySound: false },
      { id: "5", username: "@ValueAnalyst", content: "Current price implies $500B market cap for a company with $2M revenue. Classic mania.", sentiment: "neutral", likes: 800, isInfluencer: false, fundamentallySound: true },
      { id: "6", username: "@FOMO_Trader", content: "Just mortgaged my house to buy more! This is generational wealth! Never selling!", sentiment: "extreme_greed", likes: 67000, isInfluencer: false, fundamentallySound: false }
    ]
  },
  {
    title: "Recession Fears",
    description: "Fed signals potential rate hikes, market drops 5%",
    sentiment: "fear",
    correctAction: "contrarian",
    fundamentalReason: "Rate hikes are priced in, quality companies still growing earnings",
    posts: [
      { id: "7", username: "@EconomicDoom", content: "The recession is HERE. Unemployment will hit 15%. Cash is king!", sentiment: "fear", likes: 28000, isInfluencer: true, fundamentallySound: false },
      { id: "8", username: "@HistoryRepeats", content: "Every rate hike cycle in history has been a buying opportunity 12 months later.", sentiment: "neutral", likes: 2100, isInfluencer: false, fundamentallySound: true },
      { id: "9", username: "@GoldBug2024", content: "Paper money is worthless! Convert to gold immediately! Banks will collapse!", sentiment: "extreme_fear", likes: 19000, isInfluencer: false, fundamentallySound: false }
    ]
  }
];

const sentimentColors: Record<Sentiment, string> = {
  extreme_fear: "bg-red-500",
  fear: "bg-orange-500",
  neutral: "bg-gray-500",
  greed: "bg-green-500",
  extreme_greed: "bg-emerald-500"
};

export const MarketPsychologyImmersive = () => {
  const [phase, setPhase] = useState<Phase>("hook");
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [emotionalState, setEmotionalState] = useState(50); // 0 = extreme fear, 100 = extreme greed
  const [xpEarned, setXpEarned] = useState(0);
  const [showFilter, setShowFilter] = useState(false);

  const currentEvent = marketEvents[currentEventIndex];

  const makeDecision = (decision: Decision) => {
    setDecisions(prev => [...prev, decision]);
    
    // Adjust emotional state based on decision
    if (decision === "follow") {
      if (currentEvent.sentiment.includes("greed")) {
        setEmotionalState(prev => Math.min(100, prev + 20));
      } else {
        setEmotionalState(prev => Math.max(0, prev - 20));
      }
    } else if (decision === "contrarian") {
      // Contrarian moves emotional state opposite
      if (currentEvent.sentiment.includes("greed")) {
        setEmotionalState(prev => Math.max(0, prev - 15));
      } else {
        setEmotionalState(prev => Math.min(100, prev + 15));
      }
    }
    
    if (currentEventIndex < marketEvents.length - 1) {
      setCurrentEventIndex(prev => prev + 1);
    } else {
      calculateResults();
    }
  };

  const calculateResults = () => {
    let xp = 100; // Base XP
    
    // Score each decision
    decisions.forEach((decision, index) => {
      const event = marketEvents[index];
      if (decision === event.correctAction) {
        xp += 100; // Correct decision
      } else if (decision === "follow" && !event.correctAction.includes("follow")) {
        xp -= 50; // Following the herd when wrong
      }
    });
    
    // Emotional stability bonus
    if (emotionalState >= 40 && emotionalState <= 60) {
      xp += 100; // Stayed emotionally balanced
    }
    
    setXpEarned(Math.max(0, xp));
    setPhase("results");
  };

  const getEmotionalLabel = () => {
    if (emotionalState < 20) return "Extreme Fear";
    if (emotionalState < 40) return "Fear";
    if (emotionalState < 60) return "Neutral";
    if (emotionalState < 80) return "Greed";
    return "Extreme Greed";
  };

  const renderHook = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center p-6 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl border border-purple-500/30">
        <Brain className="h-16 w-16 text-purple-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-foreground mb-2">THE SOCIAL FEED</h2>
        <p className="text-muted-foreground text-lg mb-4">
          Your timeline is flooded with "advice." Can you filter the noise?
        </p>
        <p className="text-sm text-muted-foreground">
          The market's biggest enemy isn't volatility—it's your own emotions.
        </p>
      </div>

      <Card className="border-primary/30">
        <CardContent className="pt-6 space-y-4">
          <h3 className="text-lg font-semibold text-center">How It Works</h3>
          
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-3 bg-muted/50 rounded-lg">
              <ThumbsUp className="h-5 w-5 mx-auto mb-2 text-green-500" />
              <p className="text-xs font-medium">Follow</p>
              <p className="text-[10px] text-muted-foreground">Join the crowd</p>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg">
              <Eye className="h-5 w-5 mx-auto mb-2 text-gray-500" />
              <p className="text-xs font-medium">Ignore</p>
              <p className="text-[10px] text-muted-foreground">Stay the course</p>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg">
              <ThumbsDown className="h-5 w-5 mx-auto mb-2 text-red-500" />
              <p className="text-xs font-medium">Contrarian</p>
              <p className="text-[10px] text-muted-foreground">Bet against</p>
            </div>
          </div>

          <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <p className="text-xs text-yellow-600 dark:text-yellow-400">
              ⚠️ Warning: High likes ≠ good advice. Influencer status ≠ expertise.
            </p>
          </div>

          <Button onClick={() => setPhase("feed")} className="w-full">
            <MessageSquare className="h-4 w-4 mr-2" />
            Enter The Feed
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const renderFeed = () => (
    <div className="space-y-4 animate-fade-in">
      {/* Emotional Filter Overlay */}
      {showFilter && (
        <div className="fixed inset-0 bg-background/80 z-50 flex items-center justify-center p-4">
          <Card className="max-w-sm border-purple-500/50">
            <CardContent className="pt-6 text-center space-y-4">
              <Brain className="h-12 w-12 text-purple-500 mx-auto" />
              <h3 className="text-xl font-bold">Emotional Filter Active</h3>
              <p className="text-sm text-muted-foreground">
                Your current state: <span className={`font-bold ${
                  emotionalState < 40 ? 'text-red-500' : 
                  emotionalState > 60 ? 'text-green-500' : 'text-gray-500'
                }`}>{getEmotionalLabel()}</span>
              </p>
              <p className="text-xs text-muted-foreground">
                {emotionalState < 40 
                  ? "Fear is clouding your judgment. Panic decisions rarely pay off."
                  : emotionalState > 60
                  ? "Greed is influencing you. FOMO leads to buying at peaks."
                  : "You're maintaining emotional balance. Keep thinking rationally."}
              </p>
              <Button onClick={() => setShowFilter(false)} variant="outline" className="w-full">
                Continue
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Header */}
      <Card className="border-primary/30">
        <CardContent className="pt-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-bold text-lg">{currentEvent.title}</h3>
              <p className="text-sm text-muted-foreground">{currentEvent.description}</p>
            </div>
            <Badge className={`${sentimentColors[currentEvent.sentiment]} text-white`}>
              {currentEvent.sentiment.replace("_", " ")}
            </Badge>
          </div>
          
          {/* Emotional State Meter */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-red-500">Fear</span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-auto p-0 text-xs text-purple-500"
                onClick={() => setShowFilter(true)}
              >
                <Brain className="h-3 w-3 mr-1" />
                {getEmotionalLabel()}
              </Button>
              <span className="text-green-500">Greed</span>
            </div>
            <div className="h-2 bg-gradient-to-r from-red-500 via-gray-500 to-green-500 rounded-full relative">
              <div 
                className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-primary rounded-full transition-all"
                style={{ left: `calc(${emotionalState}% - 8px)` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Social Posts */}
      <div className="space-y-3">
        {currentEvent.posts.map((post) => (
          <Card 
            key={post.id} 
            className={`border ${post.fundamentallySound ? 'border-green-500/30' : 'border-muted'}`}
          >
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  post.isInfluencer ? 'bg-blue-500/20' : 'bg-muted'
                }`}>
                  <Users className={`h-5 w-5 ${post.isInfluencer ? 'text-blue-500' : 'text-muted-foreground'}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm">{post.username}</span>
                    {post.isInfluencer && (
                      <Badge variant="outline" className="text-[10px] py-0">
                        ✓ Verified
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm mb-2">{post.content}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <ThumbsUp className="h-3 w-3" />
                    <span>{(post.likes / 1000).toFixed(1)}K</span>
                    <span className={`ml-2 px-2 py-0.5 rounded ${sentimentColors[post.sentiment]}/20`}>
                      {post.sentiment.replace("_", " ")}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Decision Buttons */}
      <Card className="border-primary/30">
        <CardContent className="pt-4">
          <p className="text-center text-sm text-muted-foreground mb-4">
            Event {currentEventIndex + 1} of {marketEvents.length}: What do you do?
          </p>
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant="outline"
              className="flex flex-col h-auto py-4 hover:bg-green-500/10 hover:border-green-500"
              onClick={() => makeDecision("follow")}
            >
              <ThumbsUp className="h-5 w-5 text-green-500 mb-1" />
              <span className="text-xs font-medium">Follow</span>
              <span className="text-[10px] text-muted-foreground">Join crowd</span>
            </Button>
            <Button
              variant="outline"
              className="flex flex-col h-auto py-4 hover:bg-gray-500/10 hover:border-gray-500"
              onClick={() => makeDecision("ignore")}
            >
              <Eye className="h-5 w-5 text-gray-500 mb-1" />
              <span className="text-xs font-medium">Ignore</span>
              <span className="text-[10px] text-muted-foreground">Stay course</span>
            </Button>
            <Button
              variant="outline"
              className="flex flex-col h-auto py-4 hover:bg-red-500/10 hover:border-red-500"
              onClick={() => makeDecision("contrarian")}
            >
              <ThumbsDown className="h-5 w-5 text-red-500 mb-1" />
              <span className="text-xs font-medium">Contrarian</span>
              <span className="text-[10px] text-muted-foreground">Bet against</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderResults = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center p-6 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl">
        <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
        <h2 className="text-3xl font-bold mb-2">FEED COMPLETE</h2>
        <div className="text-5xl font-bold text-primary">+{xpEarned} XP</div>
      </div>

      {/* Decision Review */}
      <div className="space-y-3">
        {marketEvents.map((event, index) => {
          const userDecision = decisions[index];
          const isCorrect = userDecision === event.correctAction;
          
          return (
            <Card key={index} className={`border ${isCorrect ? 'border-green-500/50' : 'border-red-500/50'}`}>
              <CardContent className="pt-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold">{event.title}</p>
                    <p className="text-xs text-muted-foreground">{event.description}</p>
                  </div>
                  {isCorrect ? (
                    <Badge className="bg-green-500">Correct</Badge>
                  ) : (
                    <Badge variant="destructive">Wrong</Badge>
                  )}
                </div>
                <div className="text-xs space-y-1">
                  <p>Your choice: <span className="font-medium capitalize">{userDecision}</span></p>
                  <p>Optimal: <span className="font-medium capitalize text-green-500">{event.correctAction}</span></p>
                  <p className="text-muted-foreground italic">{event.fundamentalReason}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardContent className="pt-4 space-y-3">
          <h4 className="font-semibold">XP Breakdown:</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Completion Bonus</span>
              <span className="text-green-500">+100 XP</span>
            </div>
            {decisions.map((decision, index) => {
              const event = marketEvents[index];
              const isCorrect = decision === event.correctAction;
              return (
                <div key={index} className="flex justify-between">
                  <span>{event.title}</span>
                  <span className={isCorrect ? "text-green-500" : "text-red-500"}>
                    {isCorrect ? "+100" : decision === "follow" ? "-50" : "0"} XP
                  </span>
                </div>
              );
            })}
            {emotionalState >= 40 && emotionalState <= 60 && (
              <div className="flex justify-between">
                <span>Emotional Stability Bonus</span>
                <span className="text-green-500">+100 XP</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="p-4 bg-primary/10 rounded-lg">
        <p className="text-sm">
          <strong>💡 Key Insight:</strong> The posts with the most likes were often the worst advice. 
          Influencer status doesn't equal expertise. The quiet, fundamentally-sound analysis was 
          usually correct. Filter the emotional noise and focus on data.
        </p>
      </div>

      <Button onClick={() => {
        setPhase("hook");
        setCurrentEventIndex(0);
        setDecisions([]);
        setEmotionalState(50);
      }} className="w-full">
        <Zap className="h-4 w-4 mr-2" />
        Try Again
      </Button>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto p-4">
      {phase === "hook" && renderHook()}
      {phase === "feed" && renderFeed()}
      {phase === "results" && renderResults()}
    </div>
  );
};
