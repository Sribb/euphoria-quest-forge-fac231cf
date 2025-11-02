import { BarChart3, Activity, Brain } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface AnalyticsPreviewProps {
  onNavigate: (tab: string) => void;
}

export const AnalyticsPreview = ({ onNavigate }: AnalyticsPreviewProps) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" />
          Analytics Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-success" />
                <span className="text-sm text-muted-foreground">Trading Activity</span>
              </div>
              <span className="text-sm font-bold">Active</span>
            </div>
            <Progress value={75} className="h-2" />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-primary" />
                <span className="text-sm text-muted-foreground">Learning Progress</span>
              </div>
              <span className="text-sm font-bold">65%</span>
            </div>
            <Progress value={65} className="h-2" />
          </div>
        </div>

        <div className="p-3 bg-gradient-hero rounded-lg">
          <p className="text-sm font-medium mb-1">AI-Powered Insights</p>
          <p className="text-xs text-muted-foreground">
            Get personalized analytics and recommendations based on your trading patterns
          </p>
        </div>

        <Button 
          className="w-full" 
          onClick={() => onNavigate("analytics")}
        >
          View Full Analytics
        </Button>
      </CardContent>
    </Card>
  );
};
