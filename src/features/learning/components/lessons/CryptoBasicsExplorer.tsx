import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bitcoin, Wallet, Shield, TrendingUp, AlertTriangle, CheckCircle2 } from "lucide-react";

const cryptoAssets = [
  {
    name: "Bitcoin (BTC)",
    description: "The first and largest cryptocurrency by market cap. Digital gold and store of value.",
    marketCap: "$1.2T",
    volatility: "High",
    useCase: "Store of value, payments",
    riskLevel: "High",
    icon: "₿"
  },
  {
    name: "Ethereum (ETH)",
    description: "Platform for smart contracts and decentralized applications (dApps).",
    marketCap: "$400B",
    volatility: "High",
    useCase: "Smart contracts, DeFi, NFTs",
    riskLevel: "High",
    icon: "Ξ"
  },
  {
    name: "Stablecoins (USDC/USDT)",
    description: "Cryptocurrencies pegged to the US dollar. Maintain stable value.",
    marketCap: "$150B+",
    volatility: "Very Low",
    useCase: "Trading, transfers, yield",
    riskLevel: "Low-Medium",
    icon: "$"
  }
];

const securityChecklist = [
  { item: "Use hardware wallet for large holdings", critical: true },
  { item: "Enable 2FA on all exchange accounts", critical: true },
  { item: "Never share private keys or seed phrases", critical: true },
  { item: "Verify addresses before sending", critical: true },
  { item: "Start with small amounts while learning", critical: false },
  { item: "Diversify across multiple assets", critical: false },
  { item: "Only invest what you can afford to lose", critical: false },
];

export const CryptoBasicsExplorer = () => {
  const [selectedAsset, setSelectedAsset] = useState(0);
  const [checkedItems, setCheckedItems] = useState<number[]>([]);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);

  const toggleCheck = (idx: number) => {
    setCheckedItems(prev => 
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  const allCriticalChecked = securityChecklist
    .filter(s => s.critical)
    .every((_, idx) => checkedItems.includes(idx));

  return (
    <Card className="p-6 bg-card/50 border-primary/20">
      <div className="flex items-center gap-2 mb-4">
        <Bitcoin className="w-5 h-5 text-primary" />
        <h3 className="font-bold text-lg">Cryptocurrency Explorer</h3>
      </div>

      <Tabs defaultValue="assets" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="assets">Major Cryptos</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="risks">Risks</TabsTrigger>
        </TabsList>

        <TabsContent value="assets" className="mt-4">
          <div className="grid gap-4">
            {cryptoAssets.map((asset, idx) => (
              <Card 
                key={idx}
                className={`p-4 cursor-pointer transition-all ${selectedAsset === idx ? 'ring-2 ring-primary bg-primary/5' : 'hover:bg-muted/30'}`}
                onClick={() => setSelectedAsset(idx)}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-2xl font-bold text-white">
                    {asset.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold">{asset.name}</h4>
                      <Badge variant={asset.riskLevel === "High" ? "destructive" : "secondary"}>
                        {asset.riskLevel} Risk
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{asset.description}</p>
                    <div className="flex gap-4 text-xs">
                      <span><strong>Market Cap:</strong> {asset.marketCap}</span>
                      <span><strong>Use:</strong> {asset.useCase}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-4 p-4 bg-muted/30 rounded-lg text-sm">
            <strong>Pro Tip:</strong> Most experts recommend limiting crypto to 5-10% of your total portfolio due to high volatility.
          </div>
        </TabsContent>

        <TabsContent value="security" className="mt-4">
          <Card className="p-4 bg-muted/30 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-5 h-5 text-primary" />
              <h4 className="font-semibold">Security Checklist</h4>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Check off each item as you implement it. Critical items are marked with a red border.
            </p>
          </Card>

          <div className="space-y-2">
            {securityChecklist.map((item, idx) => (
              <div
                key={idx}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                  checkedItems.includes(idx) 
                    ? 'bg-success/10 border border-success/30' 
                    : item.critical 
                      ? 'bg-destructive/5 border border-destructive/20 hover:bg-destructive/10'
                      : 'bg-muted/30 hover:bg-muted/50'
                }`}
                onClick={() => toggleCheck(idx)}
              >
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  checkedItems.includes(idx) ? 'bg-success border-success' : 'border-muted-foreground'
                }`}>
                  {checkedItems.includes(idx) && <CheckCircle2 className="w-4 h-4 text-white" />}
                </div>
                <span className={`flex-1 ${checkedItems.includes(idx) ? 'line-through text-muted-foreground' : ''}`}>
                  {item.item}
                </span>
                {item.critical && !checkedItems.includes(idx) && (
                  <Badge variant="destructive" className="text-xs">Critical</Badge>
                )}
              </div>
            ))}
          </div>

          {allCriticalChecked && (
            <div className="mt-4 p-4 bg-success/10 border border-success/30 rounded-lg animate-fade-in">
              <p className="font-semibold text-success flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                All critical security measures acknowledged!
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="risks" className="mt-4">
          <div className="space-y-4">
            <Card className="p-4 border-destructive/30 bg-destructive/5">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-destructive" />
                <h4 className="font-semibold">Key Crypto Risks</h4>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-destructive font-bold">•</span>
                  <span><strong>Extreme Volatility:</strong> 50-80% drops are common historically</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-destructive font-bold">•</span>
                  <span><strong>Regulatory Risk:</strong> Government bans can impact prices significantly</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-destructive font-bold">•</span>
                  <span><strong>Security Risks:</strong> Lost keys = lost funds forever, no recovery</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-destructive font-bold">•</span>
                  <span><strong>Scams:</strong> Rug pulls, fake tokens, phishing attacks are widespread</span>
                </li>
              </ul>
            </Card>

            <Button 
              onClick={() => setShowQuiz(true)} 
              className="w-full"
              disabled={showQuiz}
            >
              Take Risk Awareness Quiz
            </Button>

            {showQuiz && (
              <Card className="p-4 animate-fade-in">
                <h4 className="font-semibold mb-3">Quick Quiz: What should you do if someone DMs you about a "guaranteed" crypto investment?</h4>
                <div className="space-y-2">
                  {[
                    "Send them money immediately - guaranteed profits!",
                    "Ask for their credentials and invest if legit",
                    "Ignore and block - it's almost certainly a scam",
                    "Share your wallet seed phrase for verification"
                  ].map((option, idx) => (
                    <Button
                      key={idx}
                      variant={quizAnswer === idx ? (idx === 2 ? 'default' : 'destructive') : 'outline'}
                      className="w-full justify-start text-left h-auto py-3"
                      onClick={() => setQuizAnswer(idx)}
                    >
                      {option}
                    </Button>
                  ))}
                </div>
                {quizAnswer !== null && (
                  <div className={`mt-4 p-3 rounded-lg ${quizAnswer === 2 ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}`}>
                    {quizAnswer === 2 
                      ? "✓ Correct! Never trust unsolicited investment advice. Scammers use urgency and guaranteed returns as bait."
                      : "✗ Wrong! This is a classic scam. Never share private info or send money to strangers online."
                    }
                  </div>
                )}
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};