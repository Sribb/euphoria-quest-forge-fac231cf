import { useRealtimePortfolio } from "@/hooks/useRealtimePortfolio";
import { Wifi, WifiOff } from "lucide-react";
import { cn } from "@/lib/utils";

export const RealtimeIndicator = () => {
  const { isConnected } = useRealtimePortfolio();

  return (
    <div 
      className={cn(
        "flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium transition-colors",
        isConnected 
          ? "bg-green-500/10 text-green-500" 
          : "bg-muted text-muted-foreground"
      )}
      title={isConnected ? "Real-time updates active" : "Connecting..."}
    >
      {isConnected ? (
        <>
          <Wifi className="w-3 h-3" />
          <span className="hidden sm:inline">Live</span>
        </>
      ) : (
        <>
          <WifiOff className="w-3 h-3" />
          <span className="hidden sm:inline">Connecting</span>
        </>
      )}
    </div>
  );
};
