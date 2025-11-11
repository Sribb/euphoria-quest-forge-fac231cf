import { useState } from "react";
import { ScenarioGenerator } from "./ScenarioGenerator";
import { ActionControlPanel } from "./ActionControlPanel";
import { LiveMarketSimulation } from "./LiveMarketSimulation";
import { useAuth } from "@/hooks/useAuth";
import { useAIMarket } from "@/hooks/useAIMarket";
import { Card } from "@/components/ui/card";
import { Sparkles, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const InteractiveAIMarket = () => {
  const { user } = useAuth();
  const { session, aiPrices, initializeSession } = useAIMarket(user?.id);
  const { toast } = useToast();

  const [selectedScenario, setSelectedScenario] = useState<any>(null);
  const [executedAction, setExecutedAction] = useState<any>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [isSimulationActive, setIsSimulationActive] = useState(false);

  // Initialize session if not exists
  const handleInitSession = async () => {
    if (!user) return;
    try {
      await initializeSession.mutateAsync();
      toast({
        title: "AI Market Initialized",
        description: "Stock prices and market data have been loaded successfully",
      });
    } catch (error) {
      console.error('Failed to initialize session:', error);
      toast({
        title: "Initialization Failed",
        description: error instanceof Error ? error.message : "Failed to initialize AI Market",
        variant: "destructive",
      });
    }
  };

  // Check if session exists but has no stock prices (broken session)
  const isBrokenSession = session && (!aiPrices || aiPrices.length === 0);

  if (!session || isBrokenSession) {
    return (
      <div className="flex items-center justify-center h-full">
        <Card className="p-8 text-center max-w-md">
          <Sparkles className="w-12 h-12 mx-auto mb-4 text-primary" />
          <h3 className="text-xl font-bold mb-2">
            {isBrokenSession ? "Session Needs Repair" : "AI Market Not Initialized"}
          </h3>
          <p className="text-muted-foreground mb-6">
            {isBrokenSession 
              ? "Your session is missing market data. Click below to repair and load stock prices."
              : "Start the AI market engine to begin interactive scenario trading"
            }
          </p>
          <button
            onClick={handleInitSession}
            disabled={initializeSession.isPending}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 font-semibold disabled:opacity-50"
          >
            {initializeSession.isPending 
              ? "Initializing..." 
              : isBrokenSession 
                ? "Repair & Initialize Market" 
                : "Initialize AI Market"
            }
          </button>
        </Card>
      </div>
    );
  }

  const handleScenarioSelect = (scenario: any) => {
    setSelectedScenario(scenario);
    setExecutedAction(null);
    setIsSimulationActive(false);
  };

  const handleExecuteAction = async (action: any) => {
    if (!selectedScenario) {
      toast({
        title: "No Scenario Selected",
        description: "Please select a market scenario first",
        variant: "destructive",
      });
      return;
    }

    setIsExecuting(true);
    try {
      // Execute the action through the AI market engine
      const { data, error } = await supabase.functions.invoke('execute-scenario-action', {
        body: {
          sessionId: session.id,
          userId: user?.id,
          scenarioId: selectedScenario.id,
          action: {
            type: action.type,
            symbol: action.symbol,
            quantity: action.quantity,
            stop_loss: action.stopLoss,
            leverage: action.leverage,
          }
        }
      });

      if (error) throw error;

      setExecutedAction({ ...action, result: data });
      setIsSimulationActive(true);

      toast({
        title: "Action Executed",
        description: `${action.type} order for ${action.quantity} ${action.symbol} is now active`,
      });
    } catch (error) {
      console.error('Error executing action:', error);
      toast({
        title: "Execution Failed",
        description: error instanceof Error ? error.message : "Failed to execute action",
        variant: "destructive",
      });
    } finally {
      setIsExecuting(false);
    }
  };

  const handleReset = () => {
    setExecutedAction(null);
    setIsSimulationActive(false);
    setSelectedScenario(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6 bg-gradient-to-br from-primary/10 via-accent/5 to-background border-primary/30">
        <div className="flex items-center gap-3">
          <Sparkles className="w-8 h-8 text-primary animate-pulse" />
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Interactive AI Market</h1>
            <p className="text-muted-foreground">
              Experience real-time market simulation with AI-driven scenarios and live feedback
            </p>
          </div>
          {session && (
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span className="text-muted-foreground">AI Engine Active</span>
            </div>
          )}
        </div>
      </Card>

      {/* Info Banner */}
      {!selectedScenario && (
        <Card className="p-4 bg-accent/5 border-accent/20">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-accent mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold mb-1">How It Works</p>
              <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                <li>Generate AI-powered market scenarios or select from existing ones</li>
                <li>Choose your trading strategy: Buy, Sell, Hold, Hedge, Leverage, or Auto-AI</li>
                <li>Watch the market respond in real-time to your decisions</li>
                <li>Learn from AI feedback on your performance and strategy effectiveness</li>
              </ol>
            </div>
          </div>
        </Card>
      )}

      {/* Main Content */}
      {!isSimulationActive ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Scenario Generator - Takes 2/3 width */}
          <div className="lg:col-span-2">
            <ScenarioGenerator
              sessionId={session.id}
              onScenarioSelect={handleScenarioSelect}
              selectedScenario={selectedScenario}
            />
          </div>

          {/* Action Panel - Takes 1/3 width */}
          <div>
            <ActionControlPanel
              scenario={selectedScenario}
              onExecute={handleExecuteAction}
              isExecuting={isExecuting}
              disabled={!selectedScenario}
            />
          </div>
        </div>
      ) : (
        /* Live Simulation - Full Width */
        <LiveMarketSimulation
          scenario={selectedScenario}
          action={executedAction}
          isActive={isSimulationActive}
          onReset={handleReset}
        />
      )}
    </div>
  );
};
