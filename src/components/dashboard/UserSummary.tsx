import { Crown, Flame } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export const UserSummary = () => {
  return (
    <Card className="p-6 bg-gradient-hero border-0 shadow-md animate-fade-in">
      <div className="flex items-center gap-4">
        <Avatar className="w-16 h-16 border-4 border-primary shadow-glow">
          <AvatarImage src="/placeholder.svg" alt="User" />
          <AvatarFallback className="bg-gradient-primary text-primary-foreground text-xl font-bold">
            EU
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-2xl font-bold">Welcome back!</h2>
            <Crown className="w-5 h-5 text-warning animate-bounce-subtle" />
          </div>
          <p className="text-muted-foreground">Ready to learn and grow today?</p>
          
          <div className="flex items-center gap-4 mt-3">
            <Badge variant="secondary" className="gap-1.5">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="font-bold">7 Day Streak</span>
            </Badge>
            <Badge className="bg-gradient-gold text-warning-foreground">
              Level 5
            </Badge>
            <Badge className="bg-gradient-success text-success-foreground">
              2,450 Coins
            </Badge>
          </div>
        </div>
      </div>
    </Card>
  );
};
