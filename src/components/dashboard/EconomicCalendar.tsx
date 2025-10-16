import { useEffect, useRef } from "react";
import { Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const EconomicCalendar = () => {
  const todayRef = useRef<HTMLDivElement>(null);
  const weekRef = useRef<HTMLDivElement>(null);
  const monthRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadCalendarWidget = (containerId: string, range: string) => {
      const container = document.getElementById(containerId);
      if (!container) return;

      // Clear previous content
      container.innerHTML = '';

      // Create iframe for Economic Calendar
      const iframe = document.createElement('iframe');
      iframe.src = `https://sslecal2.investing.com?columns=exc_flags,exc_currency,exc_importance,exc_actual,exc_forecast,exc_previous&importance=2,3&features=datepicker,timezone&countries=25,32,6,37,72,22,17,39,14,10,35,43,56,36,110,11,26,12,4,5&calType=${range}&timeZone=8&lang=1`;
      iframe.width = '100%';
      iframe.height = '467';
      iframe.frameBorder = '0';
      iframe.style.border = 'none';
      iframe.style.background = 'transparent';
      
      container.appendChild(iframe);
    };

    // Load calendars for each tab
    loadCalendarWidget('economicCalendarWidget-today', 'today');
    loadCalendarWidget('economicCalendarWidget-week', 'week');
    loadCalendarWidget('economicCalendarWidget-month', 'month');
  }, []);

  return (
    <Card className="p-6 animate-fade-in" style={{ animationDelay: "200ms" }}>
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-5 h-5 text-primary" />
        <h3 className="text-xl font-bold">Economic Calendar</h3>
      </div>

      <Tabs defaultValue="today" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="week">This Week</TabsTrigger>
          <TabsTrigger value="month">This Month</TabsTrigger>
        </TabsList>
        
        <TabsContent value="today" className="mt-0">
          <div 
            id="economicCalendarWidget-today"
            ref={todayRef}
            className="w-full min-h-[467px] bg-card rounded-lg overflow-hidden"
          />
        </TabsContent>
        
        <TabsContent value="week" className="mt-0">
          <div 
            id="economicCalendarWidget-week"
            ref={weekRef}
            className="w-full min-h-[467px] bg-card rounded-lg overflow-hidden"
          />
        </TabsContent>
        
        <TabsContent value="month" className="mt-0">
          <div 
            id="economicCalendarWidget-month"
            ref={monthRef}
            className="w-full min-h-[467px] bg-card rounded-lg overflow-hidden"
          />
        </TabsContent>
      </Tabs>

      <div className="mt-4 p-3 bg-primary/10 rounded-lg border border-primary/20">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold">Pro Tip:</span> High-impact events can create significant market volatility.
          Plan your trading strategy accordingly and consider reducing position sizes before major announcements.
        </p>
      </div>
    </Card>
  );
};
