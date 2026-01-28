import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Leaf, Users, Building, CheckCircle, XCircle } from "lucide-react";

const companies = [
  { name: "EcoTech Corp", e: 92, s: 85, g: 78, sector: "Technology" },
  { name: "GreenEnergy Ltd", e: 95, s: 72, g: 80, sector: "Energy" },
  { name: "SocialFirst Inc", e: 68, s: 94, g: 88, sector: "Healthcare" },
  { name: "TraditionalCo", e: 45, s: 55, g: 60, sector: "Manufacturing" },
];

export const ESGScorecard = () => {
  const [selectedCompany, setSelectedCompany] = useState(0);
  const company = companies[selectedCompany];
  const avgScore = Math.round((company.e + company.s + company.g) / 3);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return { label: "Leader", variant: "default" as const };
    if (score >= 60) return { label: "Average", variant: "secondary" as const };
    return { label: "Laggard", variant: "destructive" as const };
  };

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Leaf className="h-5 w-5 text-primary" />
          ESG Investment Scorecard
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex gap-2 flex-wrap">
          {companies.map((c, idx) => (
            <button
              key={c.name}
              onClick={() => setSelectedCompany(idx)}
              className={`px-4 py-2 rounded-lg text-sm transition-all ${
                selectedCompany === idx ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        <div className="text-center py-4">
          <div className={`text-5xl font-bold ${getScoreColor(avgScore)}`}>{avgScore}</div>
          <Badge {...getScoreBadge(avgScore)} className="mt-2">ESG {getScoreBadge(avgScore).label}</Badge>
          <p className="text-sm text-muted-foreground mt-1">{company.sector} Sector</p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-24 flex items-center gap-2">
              <Leaf className="h-5 w-5 text-green-500" />
              <span className="text-sm font-medium">Environment</span>
            </div>
            <Progress value={company.e} className="flex-1" />
            <span className={`font-bold ${getScoreColor(company.e)}`}>{company.e}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-24 flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              <span className="text-sm font-medium">Social</span>
            </div>
            <Progress value={company.s} className="flex-1" />
            <span className={`font-bold ${getScoreColor(company.s)}`}>{company.s}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-24 flex items-center gap-2">
              <Building className="h-5 w-5 text-purple-500" />
              <span className="text-sm font-medium">Governance</span>
            </div>
            <Progress value={company.g} className="flex-1" />
            <span className={`font-bold ${getScoreColor(company.g)}`}>{company.g}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-2">
            {company.e >= 70 ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />}
            Carbon neutral commitment
          </div>
          <div className="flex items-center gap-2">
            {company.s >= 70 ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />}
            Diversity & inclusion
          </div>
          <div className="flex items-center gap-2">
            {company.g >= 70 ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />}
            Board independence
          </div>
          <div className="flex items-center gap-2">
            {avgScore >= 70 ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />}
            ESG fund eligible
          </div>
        </div>

        <div className="p-3 bg-primary/10 rounded-lg">
          <p className="text-sm"><strong>💡 Key Insight:</strong> ESG investing considers environmental, social, and governance factors alongside financial returns. Companies with high ESG scores often demonstrate better long-term risk management.</p>
        </div>
      </CardContent>
    </Card>
  );
};
