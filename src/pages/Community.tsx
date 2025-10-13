import { Users, MessageSquare, Trophy, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface CommunityProps {
  onNavigate: (tab: string) => void;
}

const Community = ({ onNavigate }: CommunityProps) => {
  const suggestedGroups = [
    { name: "Beginner Investors", members: 1234, level: "Beginner", icon: "📚" },
    { name: "Value Investing Club", members: 892, level: "Intermediate", icon: "💎" },
    { name: "Dividend Strategy", members: 567, level: "Advanced", icon: "💰" },
    { name: "Crypto Explorers", members: 2103, level: "Intermediate", icon: "🚀" },
  ];

  const trendingPosts = [
    {
      author: "Sarah M.",
      avatar: "SM",
      title: "My journey from $1,000 to $10,000 in simulated trading",
      excerpt: "After 3 months of consistent learning and applying Warren Buffett's principles...",
      likes: 234,
      comments: 45,
      time: "2 hours ago",
    },
    {
      author: "John D.",
      avatar: "JD",
      title: "Understanding P/E ratios: A complete guide",
      excerpt: "Price-to-Earnings ratio is one of the most important metrics for value investors...",
      likes: 189,
      comments: 32,
      time: "5 hours ago",
    },
    {
      author: "Emily R.",
      avatar: "ER",
      title: "How I achieved a 30-day streak",
      excerpt: "Consistency is key! Here are my top tips for maintaining daily learning habits...",
      likes: 156,
      comments: 28,
      time: "1 day ago",
    },
  ];

  const challenges = [
    {
      title: "7-Day Learning Sprint",
      description: "Complete 7 lessons in 7 days",
      reward: "500 coins + Sprint Badge",
      participants: 456,
      daysLeft: 3,
    },
    {
      title: "Portfolio Challenge",
      description: "Grow your portfolio by 5% this month",
      reward: "1000 coins + Growth Badge",
      participants: 789,
      daysLeft: 12,
    },
    {
      title: "Game Master",
      description: "Score 90+ on all 5 financial games",
      reward: "750 coins + Master Badge",
      participants: 234,
      daysLeft: 20,
    },
  ];

  return (
    <div className="space-y-6 pb-24">
      <div className="flex items-center gap-3 animate-fade-in">
        <div className="w-12 h-12 rounded-xl bg-gradient-success flex items-center justify-center shadow-glow">
          <Users className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Community</h1>
          <p className="text-muted-foreground">Connect with fellow investors</p>
        </div>
      </div>

      {/* Suggested Groups */}
      <div>
        <h2 className="text-xl font-bold mb-4">Suggested Groups</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {suggestedGroups.map((group, index) => (
            <Card
              key={group.name}
              className="p-4 bg-gradient-hero border-0 hover:scale-105 transition-transform cursor-pointer animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start gap-3">
                <div className="text-4xl">{group.icon}</div>
                <div className="flex-1">
                  <h3 className="font-bold mb-1">{group.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{group.members.toLocaleString()} members</p>
                  <Badge variant="outline">{group.level}</Badge>
                </div>
                <Button size="sm" className="bg-gradient-primary">Join</Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Active Challenges */}
      <div>
        <h2 className="text-xl font-bold mb-4">Active Challenges</h2>
        <div className="space-y-4">
          {challenges.map((challenge, index) => (
            <Card
              key={challenge.title}
              className="p-6 bg-gradient-hero border-primary/20 animate-fade-in"
              style={{ animationDelay: `${(index + 4) * 100}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <Trophy className="w-6 h-6 text-warning mt-1" />
                  <div>
                    <h3 className="font-bold mb-1">{challenge.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{challenge.description}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {challenge.participants} joined
                      </span>
                      <span className="text-warning">{challenge.daysLeft} days left</span>
                    </div>
                  </div>
                </div>
                <Button className="bg-gradient-primary">Join Challenge</Button>
              </div>
              <div className="p-3 bg-background/50 rounded-lg">
                <p className="text-sm">
                  <span className="font-semibold">Reward:</span> {challenge.reward}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Trending Posts */}
      <div>
        <h2 className="text-xl font-bold mb-4">Trending Discussions</h2>
        <div className="space-y-4">
          {trendingPosts.map((post, index) => (
            <Card
              key={post.title}
              className="p-6 bg-gradient-hero border-0 hover:border-primary/30 transition-all cursor-pointer animate-fade-in"
              style={{ animationDelay: `${(index + 7) * 100}ms` }}
            >
              <div className="flex items-start gap-4">
                <Avatar className="w-12 h-12">
                  <AvatarFallback className="bg-gradient-primary text-white font-bold">
                    {post.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold">{post.author}</span>
                    <span className="text-sm text-muted-foreground">{post.time}</span>
                  </div>
                  <h3 className="font-bold mb-2">{post.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{post.excerpt}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <button className="flex items-center gap-1 hover:text-primary transition-colors">
                      <TrendingUp className="w-4 h-4" />
                      {post.likes} likes
                    </button>
                    <button className="flex items-center gap-1 hover:text-primary transition-colors">
                      <MessageSquare className="w-4 h-4" />
                      {post.comments} comments
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Discussion Topics */}
      <Card className="p-6 bg-gradient-hero border-0 animate-fade-in" style={{ animationDelay: "1000ms" }}>
        <h3 className="text-lg font-bold mb-4">Popular Topics</h3>
        <div className="flex flex-wrap gap-2">
          {["Value Investing", "Dividend Stocks", "Portfolio Diversification", "Risk Management", 
            "Market Analysis", "Warren Buffett Strategy", "Long-term Growth", "Index Funds"].map((topic) => (
            <Badge
              key={topic}
              variant="outline"
              className="px-3 py-1 cursor-pointer hover:bg-primary/20 transition-colors"
            >
              {topic}
            </Badge>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Community;
