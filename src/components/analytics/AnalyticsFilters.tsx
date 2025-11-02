import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, Filter, BarChart3, BookOpen, Target, TrendingUp } from "lucide-react";
import { useState } from "react";

interface FilterOption {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface AnalyticsFiltersProps {
  onFilterChange: (filter: string) => void;
  activeFilter: string;
}

export const AnalyticsFilters = ({ onFilterChange, activeFilter }: AnalyticsFiltersProps) => {
  const filterOptions: FilterOption[] = [
    { id: "all", label: "All Data", icon: <BarChart3 className="w-4 h-4" /> },
    { id: "learning", label: "Learning", icon: <BookOpen className="w-4 h-4" /> },
    { id: "gaming", label: "Gaming", icon: <Target className="w-4 h-4" /> },
    { id: "trading", label: "Trading", icon: <TrendingUp className="w-4 h-4" /> },
  ];

  const [timeRange, setTimeRange] = useState("7d");

  return (
    <Card className="p-4 animate-fade-in">
      <div className="flex items-center gap-2 mb-3">
        <Filter className="w-4 h-4 text-primary" />
        <h3 className="font-semibold">Filters</h3>
      </div>

      <div className="space-y-3">
        <div>
          <p className="text-xs text-muted-foreground mb-2">Category</p>
          <div className="grid grid-cols-2 gap-2">
            {filterOptions.map((option) => (
              <Button
                key={option.id}
                variant={activeFilter === option.id ? "default" : "outline"}
                size="sm"
                onClick={() => onFilterChange(option.id)}
                className="justify-start"
              >
                {option.icon}
                <span className="ml-2">{option.label}</span>
              </Button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs text-muted-foreground mb-2">Time Range</p>
          <div className="grid grid-cols-4 gap-2">
            {["7d", "30d", "90d", "1y"].map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeRange(range)}
              >
                {range}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};
