import { useState } from "react";
import { Calendar, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface EconomicEvent {
  id: number;
  time: string;
  currency: string;
  event: string;
  importance: "high" | "medium" | "low";
  actual: string;
  forecast: string;
  previous: string;
  sentiment: "positive" | "negative" | "neutral";
}

const MOCK_EVENTS: EconomicEvent[] = [
  {
    id: 1,
    time: "10:30 AM",
    currency: "USD",
    event: "U.S. Jobless Claims",
    importance: "high",
    actual: "210K",
    forecast: "220K",
    previous: "225K",
    sentiment: "positive"
  },
  {
    id: 2,
    time: "11:00 AM",
    currency: "EUR",
    event: "ECB Interest Rate Decision",
    importance: "high",
    actual: "4.50%",
    forecast: "4.50%",
    previous: "4.25%",
    sentiment: "neutral"
  },
  {
    id: 3,
    time: "02:00 PM",
    currency: "GBP",
    event: "UK GDP Growth Rate",
    importance: "medium",
    actual: "0.3%",
    forecast: "0.2%",
    previous: "0.1%",
    sentiment: "positive"
  },
  {
    id: 4,
    time: "03:30 PM",
    currency: "USD",
    event: "Fed Chair Powell Speech",
    importance: "high",
    actual: "—",
    forecast: "—",
    previous: "—",
    sentiment: "neutral"
  },
  {
    id: 5,
    time: "04:00 PM",
    currency: "CAD",
    event: "Canadian CPI",
    importance: "medium",
    actual: "3.2%",
    forecast: "3.4%",
    previous: "3.8%",
    sentiment: "positive"
  }
];

const getImportanceColor = (importance: string) => {
  switch (importance) {
    case "high": return "border-destructive bg-destructive/10";
    case "medium": return "border-yellow-500 bg-yellow-500/10";
    case "low": return "border-muted bg-muted/10";
    default: return "border-muted bg-muted/10";
  }
};

const getSentimentIcon = (sentiment: string) => {
  switch (sentiment) {
    case "positive": return <TrendingUp className="w-4 h-4 text-green-500" />;
    case "negative": return <TrendingDown className="w-4 h-4 text-destructive" />;
    default: return <Minus className="w-4 h-4 text-muted-foreground" />;
  }
};

export const EconomicCalendarNative = () => {
  const [activeTab, setActiveTab] = useState("today");

  return (
    <Card className="p-6 bg-gradient-surface border-border shadow-glow-soft">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Calendar className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h3 className="text-2xl font-semibold text-foreground">Economic Calendar</h3>
          <p className="text-sm text-muted-foreground">Track high-impact events in real-time</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6 bg-card/50">
          <TabsTrigger value="today" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Today
          </TabsTrigger>
          <TabsTrigger value="week" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            This Week
          </TabsTrigger>
          <TabsTrigger value="month" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            This Month
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-0">
          <ScrollArea className="h-[500px] pr-4">
            <div className="space-y-3">
              {MOCK_EVENTS.map((event) => (
                <div
                  key={event.id}
                  className={`p-4 rounded-xl border-l-4 ${getImportanceColor(event.importance)} backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-lg`}
                >
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-2 text-center">
                      <div className="text-sm font-bold text-foreground">{event.time}</div>
                      <Badge variant="outline" className="mt-1 text-xs">
                        {event.currency}
                      </Badge>
                    </div>
                    
                    <div className="col-span-4">
                      <div className="font-semibold text-foreground flex items-center gap-2">
                        {event.event}
                        {getSentimentIcon(event.sentiment)}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {event.importance === "high" ? "High Impact" : 
                         event.importance === "medium" ? "Medium Impact" : 
                         "Low Impact"}
                      </div>
                    </div>
                    
                    <div className="col-span-2 text-center">
                      <div className="text-xs text-muted-foreground">Actual</div>
                      <div className="text-sm font-bold text-primary">{event.actual}</div>
                    </div>
                    
                    <div className="col-span-2 text-center">
                      <div className="text-xs text-muted-foreground">Forecast</div>
                      <div className="text-sm font-medium text-foreground">{event.forecast}</div>
                    </div>
                    
                    <div className="col-span-2 text-center">
                      <div className="text-xs text-muted-foreground">Previous</div>
                      <div className="text-sm text-muted-foreground">{event.previous}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>

      <div className="mt-6 p-4 bg-primary/10 rounded-xl border border-primary/20">
        <p className="text-sm text-foreground">
          <span className="font-semibold text-primary">Pro Tip:</span> High-impact events can create significant market volatility.
          Plan your trading strategy accordingly and consider reducing position sizes before major announcements.
        </p>
      </div>
    </Card>
  );
};
