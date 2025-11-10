import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { usePortfolioValue } from "@/hooks/usePortfolioValue";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";

type TimeFrame = "1D" | "1W" | "1M" | "3M" | "1Y" | "All";

export const PortfolioGraph = () => {
  const { user } = useAuth();
  const { totalValue } = usePortfolioValue();
  const [timeFrame, setTimeFrame] = useState<TimeFrame>("1M");

  const { data: historicalData = [] } = useQuery({
    queryKey: ["portfolio-history", user?.id, timeFrame],
    queryFn: async () => {
      // Get transactions to build historical data
      const { data: transactions, error } = await supabase
        .from("transaction_logs")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: true });

      if (error) throw error;

      // Generate data points based on transactions
      const dataPoints: { date: string; value: number }[] = [];
      let currentValue = 10000; // Starting value

      if (transactions && transactions.length > 0) {
        transactions.forEach((tx, index) => {
          if (tx.balance_after) {
            currentValue = Number(tx.balance_after);
          }
          
          dataPoints.push({
            date: new Date(tx.created_at).toLocaleDateString("en-US", { 
              month: "short", 
              day: "numeric" 
            }),
            value: currentValue,
          });
        });
      }

      // Add current value as the last point
      dataPoints.push({
        date: "Now",
        value: totalValue,
      });

      // Filter based on timeframe (simplified for demo)
      const maxPoints = timeFrame === "1D" ? 24 : 
                       timeFrame === "1W" ? 7 : 
                       timeFrame === "1M" ? 30 : 
                       timeFrame === "3M" ? 90 : 
                       timeFrame === "1Y" ? 365 : 
                       dataPoints.length;

      return dataPoints.slice(-maxPoints);
    },
    enabled: !!user?.id,
  });

  const initialValue = historicalData[0]?.value || 10000;
  const currentValue = historicalData[historicalData.length - 1]?.value || totalValue;
  const changeAmount = currentValue - initialValue;
  const changePercent = initialValue > 0 ? (changeAmount / initialValue) * 100 : 0;
  const isPositive = changeAmount >= 0;

  const timeFrames: TimeFrame[] = ["1D", "1W", "1M", "3M", "1Y", "All"];

  return (
    <Card className="p-6 animate-fade-in" style={{ animationDelay: "100ms" }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold">Portfolio Value</h3>
        <div className="flex items-center gap-2">
          {isPositive ? (
            <TrendingUp className="w-4 h-4 text-success" />
          ) : (
            <TrendingDown className="w-4 h-4 text-destructive" />
          )}
          <span className={`font-bold ${isPositive ? "text-success" : "text-destructive"}`}>
            {isPositive ? "+" : ""}{changePercent.toFixed(2)}%
          </span>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-3xl font-bold">${currentValue.toFixed(2)}</p>
        <p className={`text-sm ${isPositive ? "text-success" : "text-destructive"}`}>
          {isPositive ? "+" : ""}${changeAmount.toFixed(2)} ({timeFrame})
        </p>
      </div>

      <div className="h-64 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={historicalData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis 
              dataKey="date" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              tickFormatter={(value) => `$${value.toFixed(0)}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
              formatter={(value: number) => [`$${value.toFixed(2)}`, "Value"]}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke={isPositive ? "hsl(var(--success))" : "hsl(var(--destructive))"}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between gap-1">
        {timeFrames.map((tf) => (
          <Button
            key={tf}
            variant={timeFrame === tf ? "default" : "ghost"}
            size="sm"
            onClick={() => setTimeFrame(tf)}
            className={`flex-1 text-xs ${
              timeFrame === tf 
                ? "bg-gradient-primary text-primary-foreground" 
                : "hover:bg-muted"
            }`}
          >
            {tf}
          </Button>
        ))}
      </div>
    </Card>
  );
};
