import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Check, X } from "lucide-react";
import { toast } from "sonner";
import { AIContextualHelp } from "../AIContextualHelp";

interface Company {
  name: string;
  description: string;
  facts: string[];
  moatTypes: string[];
  hasMoat: boolean;
}

const companies: Company[] = [
  {
    name: "Coca-Cola",
    description: "Global beverage giant selling soft drinks worldwide",
    facts: [
      "Brand recognized in 200+ countries",
      "Formula kept secret for over 100 years",
      "Customers pay premium for the brand",
      "Competitors struggle to replicate taste and loyalty"
    ],
    moatTypes: ["Brand Power", "Intangible Assets"],
    hasMoat: true
  },
  {
    name: "Local Coffee Shop",
    description: "Small neighborhood café with good coffee",
    facts: [
      "Great coffee and service",
      "Loyal regular customers",
      "Can be replicated easily by competitors",
      "No barriers preventing new cafés nearby"
    ],
    moatTypes: [],
    hasMoat: false
  },
  {
    name: "Visa",
    description: "Global payment network processing billions of transactions",
    facts: [
      "More merchants use Visa, so more consumers want it",
      "More consumers have Visa, so more merchants accept it",
      "High cost for merchants to switch networks",
      "Network becomes more valuable with each new user"
    ],
    moatTypes: ["Network Effects", "Switching Costs"],
    hasMoat: true
  },
  {
    name: "Walmart",
    description: "World's largest retailer with massive scale",
    facts: [
      "Buys inventory in massive quantities",
      "Negotiates lowest prices from suppliers",
      "Passes savings to customers",
      "Competitors can't match prices at same margins"
    ],
    moatTypes: ["Cost Advantages"],
    hasMoat: true
  },
  {
    name: "Generic T-Shirt Manufacturer",
    description: "Makes basic clothing sold at commodity prices",
    facts: [
      "Products easily replicated",
      "Competes purely on price",
      "No brand loyalty",
      "Many competitors offering identical products"
    ],
    moatTypes: [],
    hasMoat: false
  }
];

const moatOptions = [
  "Brand Power",
  "Network Effects",
  "Cost Advantages",
  "Switching Costs",
  "Intangible Assets",
  "No Moat"
];

export const MoatIdentifier = () => {
  const [currentCompany, setCurrentCompany] = useState(0);
  const [selectedMoats, setSelectedMoats] = useState<string[]>([]);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);

  const company = companies[currentCompany];

  const toggleMoat = (moat: string) => {
    if (moat === "No Moat") {
      setSelectedMoats(["No Moat"]);
    } else {
      setSelectedMoats((prev) =>
        prev.includes(moat)
          ? prev.filter((m) => m !== moat)
          : [...prev.filter((m) => m !== "No Moat"), moat]
      );
    }
  };

  const checkAnswer = () => {
    setShowAnswer(true);
    
    const correctMoats = company.hasMoat ? company.moatTypes : ["No Moat"];
    const isCorrect = 
      correctMoats.length === selectedMoats.length &&
      correctMoats.every((moat) => selectedMoats.includes(moat));

    if (isCorrect) {
      setScore((prev) => prev + 20);
      toast.success("Perfect! You identified the moat correctly!");
    } else {
      toast.error("Not quite right. Review the characteristics of each moat type.");
    }
  };

  const nextCompany = () => {
    if (currentCompany < companies.length - 1) {
      setCurrentCompany((prev) => prev + 1);
      setSelectedMoats([]);
      setShowAnswer(false);
    } else {
      toast.success(`Game complete! Final score: ${score}/100`);
    }
  };

  return (
    <Card className="p-6 space-y-6 bg-gradient-to-br from-background to-muted/20">
      <div>
        <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" />
          Economic Moat Identifier
        </h3>
        <p className="text-sm text-muted-foreground">
          Identify sustainable <AIContextualHelp term="competitive advantages" lessonId="9" lessonTitle="Economic Moats">competitive advantages</AIContextualHelp> that protect company profits
        </p>
      </div>

      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">
          Company {currentCompany + 1}/{companies.length}
        </span>
        <span className="text-lg font-bold text-primary">Score: {score}/100</span>
      </div>

      <Card className="p-4 bg-muted/30">
        <h4 className="font-bold text-lg mb-2">{company.name}</h4>
        <p className="text-sm text-muted-foreground mb-4">{company.description}</p>
        
        <div className="space-y-2">
          <p className="text-sm font-semibold">Key Facts:</p>
          {company.facts.map((fact, idx) => (
            <div key={idx} className="text-sm flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>{fact}</span>
            </div>
          ))}
        </div>
      </Card>

      {!showAnswer && (
        <div className="space-y-3">
          <p className="text-sm font-medium">
            Select the type(s) of economic moat this company has:
          </p>
          <div className="grid grid-cols-2 gap-2">
            {moatOptions.map((moat) => (
              <Button
                key={moat}
                onClick={() => toggleMoat(moat)}
                variant={selectedMoats.includes(moat) ? "default" : "outline"}
                className="justify-start"
              >
                {selectedMoats.includes(moat) && (
                  <Check className="w-4 h-4 mr-2" />
                )}
                {moat}
              </Button>
            ))}
          </div>
          <Button
            onClick={checkAnswer}
            disabled={selectedMoats.length === 0}
            className="w-full"
            size="lg"
          >
            Submit Answer
          </Button>
        </div>
      )}

      {showAnswer && (
        <Card className="p-4 bg-muted/50 space-y-3">
          <h4 className="font-semibold">Analysis</h4>
          
          <div className="space-y-2">
            <div>
              <p className="text-sm font-medium mb-1">Your Answer:</p>
              <div className="flex flex-wrap gap-2">
                {selectedMoats.map((moat) => (
                  <span key={moat} className="text-xs px-2 py-1 bg-muted rounded">
                    {moat}
                  </span>
                ))}
              </div>
            </div>
            
            <div>
              <p className="text-sm font-medium mb-1">Correct Answer:</p>
              <div className="flex flex-wrap gap-2">
                {(company.hasMoat ? company.moatTypes : ["No Moat"]).map((moat) => (
                  <span key={moat} className="text-xs px-2 py-1 bg-primary/20 text-primary rounded font-semibold">
                    {moat}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-3 border-t">
            <p className="text-sm font-semibold mb-1">Explanation:</p>
            <p className="text-sm text-muted-foreground">
              {company.hasMoat ? (
                <>
                  <strong>{company.name}</strong> has a {company.moatTypes.join(" and ")} moat. 
                  {company.moatTypes.includes("Brand Power") && " Strong brands command premium pricing and customer loyalty."}
                  {company.moatTypes.includes("Network Effects") && " Each new user increases value for all users, creating a virtuous cycle."}
                  {company.moatTypes.includes("Cost Advantages") && " Scale advantages allow lower costs that competitors can't match."}
                  {company.moatTypes.includes("Switching Costs") && " High switching costs lock in customers and create predictable revenue."}
                  {company.moatTypes.includes("Intangible Assets") && " Patents, licenses, or trade secrets provide legal protection."}
                </>
              ) : (
                <>
                  <strong>{company.name}</strong> has no sustainable moat. The business can be easily replicated by competitors, 
                  leading to price competition and thin margins. Without a moat, profits will likely decline over time as competition increases.
                </>
              )}
            </p>
          </div>

          <Button onClick={nextCompany} className="w-full mt-2">
            {currentCompany < companies.length - 1 ? "Next Company" : "Complete"}
          </Button>
        </Card>
      )}
    </Card>
  );
};
