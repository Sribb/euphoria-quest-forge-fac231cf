import { Calendar, AlertCircle, TrendingUp, DollarSign, Globe } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const upcomingEvents = [
  {
    id: 1,
    date: "Jan 31",
    time: "2:00 PM EST",
    event: "Federal Reserve Interest Rate Decision",
    impact: "high",
    previous: "5.50%",
    forecast: "5.50%",
    icon: DollarSign,
  },
  {
    id: 2,
    date: "Feb 2",
    time: "8:30 AM EST",
    event: "Non-Farm Payrolls Report",
    impact: "high",
    previous: "216K",
    forecast: "180K",
    icon: TrendingUp,
  },
  {
    id: 3,
    date: "Feb 5",
    time: "10:00 AM EST",
    event: "ISM Services PMI",
    impact: "medium",
    previous: "50.6",
    forecast: "51.2",
    icon: Globe,
  },
  {
    id: 4,
    date: "Feb 13",
    time: "8:30 AM EST",
    event: "Consumer Price Index (CPI)",
    impact: "high",
    previous: "3.4%",
    forecast: "3.2%",
    icon: AlertCircle,
  },
  {
    id: 5,
    date: "Feb 15",
    time: "8:30 AM EST",
    event: "Retail Sales",
    impact: "medium",
    previous: "0.6%",
    forecast: "0.4%",
    icon: TrendingUp,
  },
];

export const EconomicCalendar = () => {
  return (
    <Card className="p-6 animate-fade-in" style={{ animationDelay: "200ms" }}>
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-5 h-5 text-primary" />
        <h3 className="text-xl font-bold">Upcoming Economic Catalysts</h3>
      </div>

      <div className="space-y-3">
        {upcomingEvents.map((event) => {
          const Icon = event.icon;
          return (
            <div
              key={event.id}
              className="p-4 bg-gradient-hero rounded-lg border border-border hover:border-primary transition-all"
            >
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-lg ${event.impact === "high" ? "bg-destructive/20" : "bg-warning/20"} flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-5 h-5 ${event.impact === "high" ? "text-destructive" : "text-warning"}`} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-sm font-semibold text-muted-foreground">
                      {event.date}
                    </span>
                    <span className="text-xs text-muted-foreground">{event.time}</span>
                    <Badge
                      variant={event.impact === "high" ? "destructive" : "secondary"}
                      className="text-xs"
                    >
                      {event.impact} impact
                    </Badge>
                  </div>

                  <h4 className="font-semibold mb-2">{event.event}</h4>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-card p-2 rounded">
                      <p className="text-muted-foreground mb-1">Previous</p>
                      <p className="font-semibold">{event.previous}</p>
                    </div>
                    <div className="bg-card p-2 rounded">
                      <p className="text-muted-foreground mb-1">Forecast</p>
                      <p className="font-semibold">{event.forecast}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 p-3 bg-primary/10 rounded-lg border border-primary/20">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold">Pro Tip:</span> High-impact events can create significant market volatility.
          Plan your trading strategy accordingly and consider reducing position sizes before major announcements.
        </p>
      </div>
    </Card>
  );
};
