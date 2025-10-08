import { User, Settings, Award, Trophy, Coins } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ProfileProps {
  onNavigate: (tab: string) => void;
}

const achievements = [
  { title: "First Lesson", description: "Completed your first lesson", icon: Award },
  { title: "Week Warrior", description: "7-day streak achieved", icon: Trophy },
  { title: "Coin Collector", description: "Earned 1,000 coins", icon: Coins },
];

const Profile = ({ onNavigate }: ProfileProps) => {
  return (
    <div className="space-y-6 pb-24">
      <div className="flex items-center gap-3 animate-fade-in">
        <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
          <User className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Profile</h1>
          <p className="text-muted-foreground">Your learning journey</p>
        </div>
      </div>

      <Card className="p-6 bg-gradient-hero border-0 shadow-lg animate-fade-in">
        <div className="flex items-center gap-4 mb-6">
          <Avatar className="w-20 h-20 border-4 border-primary shadow-glow">
            <AvatarImage src="/placeholder.svg" alt="User" />
            <AvatarFallback className="bg-gradient-primary text-primary-foreground text-2xl font-bold">
              EU
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-1">Euphoria User</h2>
            <p className="text-muted-foreground">Level 5 Investor</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-card rounded-lg">
            <div className="text-2xl font-bold">12</div>
            <div className="text-xs text-muted-foreground">Lessons</div>
          </div>
          <div className="text-center p-3 bg-card rounded-lg">
            <div className="text-2xl font-bold">7</div>
            <div className="text-xs text-muted-foreground">Day Streak</div>
          </div>
          <div className="text-center p-3 bg-card rounded-lg">
            <div className="text-2xl font-bold">2.4k</div>
            <div className="text-xs text-muted-foreground">Coins</div>
          </div>
        </div>
      </Card>

      <Card className="p-6 animate-fade-in" style={{ animationDelay: "100ms" }}>
        <h3 className="text-lg font-bold mb-4">Achievements</h3>
        <div className="space-y-3">
          {achievements.map((achievement, index) => {
            const Icon = achievement.icon;
            return (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-gradient-hero rounded-lg"
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-success flex items-center justify-center">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold">{achievement.title}</h4>
                  <p className="text-xs text-muted-foreground">{achievement.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <Button className="w-full" variant="outline">
        <Settings className="w-4 h-4 mr-2" />
        Settings
      </Button>
    </div>
  );
};

export default Profile;
