import { useState } from "react";
import { TrendingUp, ArrowLeft, Brain } from "lucide-react";
import { PortfolioSummary } from "@/components/trade/PortfolioSummary";
import { AssetAllocation } from "@/components/trade/AssetAllocation";
import { StockTrading } from "@/components/trade/StockTrading";
import { TransactionHistory } from "@/components/trade/TransactionHistory";
import { AIMarketPanel } from "@/components/trade/AIMarketPanel";
import { AIScenarioViewer } from "@/components/trade/AIScenarioViewer";
import { AIIntegratedChart } from "@/components/trade/AIIntegratedChart";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { useAIMarket } from "@/hooks/useAIMarket";

interface TradeProps {
  onNavigate: (tab: string) => void;
  onStockSearch?: () => void;
}

const Trade = ({ onNavigate, onStockSearch }: TradeProps) => {
  const { user } = useAuth();
  const [chartSymbol, setChartSymbol] = useState("AAPL");
  const {
    session,
    sessionId,
    aiPrices,
    competitors,
    activeEvents,
    isLoading,
    initializeSession,
    updatePrices,
    triggerEvent,
  } = useAIMarket(user?.id);

  return (
    <div className="space-y-6 pb-24 animate-fade-in">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onNavigate("dashboard")}
          className="hover-scale smooth-transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="w-12 h-12 rounded-xl bg-gradient-success flex items-center justify-center shadow-glow animate-scale-in">
          <TrendingUp className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Trade</h1>
          <p className="text-muted-foreground">Professional trading simulator with realistic execution</p>
        </div>
      </div>

      {/* AI Market Session Initializer */}
      {!session && (
        <Card className="p-6 bg-gradient-hero border-0 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
            <Brain className="w-8 h-8 text-primary animate-pulse" />
          </div>
          <h3 className="text-xl font-bold mb-2">Start AI-Powered Trading</h3>
          <p className="text-muted-foreground mb-4">
            Experience a unique market simulation with AI competitors and dynamic events
          </p>
          <Button
            size="lg"
            onClick={() => initializeSession.mutate()}
            disabled={initializeSession.isPending}
            className="bg-primary hover:bg-primary/90"
          >
            {initializeSession.isPending ? 'Initializing...' : 'Initialize AI Market'}
          </Button>
        </Card>
      )}

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5 smooth-transition">
          <TabsTrigger value="overview" className="smooth-transition">Overview</TabsTrigger>
          <TabsTrigger value="ai-market" className="smooth-transition">AI Market</TabsTrigger>
          <TabsTrigger value="trade" className="smooth-transition">Trade</TabsTrigger>
          <TabsTrigger value="history" className="smooth-transition">History</TabsTrigger>
          <TabsTrigger value="chart" className="smooth-transition">Chart</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6 animate-fade-in">
          <PortfolioSummary />
          <AssetAllocation />

          <Card className="p-6 bg-gradient-accent border-0">
            <h3 className="text-lg font-bold mb-3 text-white">Explore Individual Stocks</h3>
            <p className="text-sm text-white/80 mb-4">
              Search and analyze individual stocks with real-time data and advanced charts.
            </p>
            <Button 
              className="w-full bg-white text-primary hover:bg-white/90 font-semibold"
              onClick={onStockSearch}
            >
              Search Stocks
            </Button>
          </Card>
        </TabsContent>

        <TabsContent value="ai-market" className="space-y-6 mt-6 animate-fade-in">
          {session ? (
            <>
              <AIMarketPanel
                session={session}
                aiPrices={aiPrices || []}
                competitors={competitors || []}
                activeEvents={activeEvents || []}
                onUpdatePrices={() => updatePrices.mutate()}
                onTriggerEvent={() => triggerEvent.mutate()}
                isUpdating={updatePrices.isPending}
              />
              <AIScenarioViewer sessionId={sessionId!} />
            </>
          ) : (
            <Card className="p-12 text-center">
              <Brain className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">Initialize AI Market to access this feature</p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="trade" className="mt-6 animate-fade-in">
          <StockTrading />
        </TabsContent>

        <TabsContent value="history" className="mt-6 animate-fade-in">
          <TransactionHistory />
        </TabsContent>

        <TabsContent value="chart" className="mt-6 animate-fade-in">
          <AIIntegratedChart symbol={chartSymbol} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Trade;
