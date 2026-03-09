import { ArrowLeft, BarChart3, School, Activity, TrendingUp, Scale, Users, Trophy, Key, Shield, Database, FileCheck, Megaphone, Code, Palette, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

interface AdminHubProps {
  onNavigate: (tab: string) => void;
  onBack: () => void;
}

const sections = [
  {
    category: "Analytics & Reporting",
    items: [
      { id: "admin-school-dashboard", icon: School, label: "School Dashboard", desc: "Aggregate metrics across teachers, classes, and students", color: "from-blue-500 to-blue-700" },
      { id: "admin-district-dashboard", icon: BarChart3, label: "District Executive", desc: "Cross-school intelligence for superintendents", color: "from-indigo-500 to-indigo-700" },
      { id: "admin-usage-analytics", icon: Activity, label: "Usage Analytics", desc: "Heatmaps and engagement patterns", color: "from-teal-500 to-teal-700" },
      { id: "admin-learning-outcomes", icon: TrendingUp, label: "Learning Outcomes", desc: "Pre/post gains and effect sizes", color: "from-green-500 to-green-700" },
      { id: "admin-equity", icon: Scale, label: "Equity Analysis", desc: "Access and achievement gap analysis", color: "from-purple-500 to-purple-700" },
      { id: "admin-teacher-activity", icon: Users, label: "Teacher Activity", desc: "Faculty engagement monitoring", color: "from-cyan-500 to-cyan-700" },
      { id: "admin-benchmarks", icon: Trophy, label: "School Benchmarks", desc: "Percentile rankings against peers", color: "from-amber-500 to-amber-700" },
    ],
  },
  {
    category: "Administration & Ops",
    items: [
      { id: "admin-licenses", icon: Key, label: "License Management", desc: "Allocate and track seat licenses", color: "from-rose-500 to-rose-700" },
      { id: "admin-sso", icon: Shield, label: "SSO Configuration", desc: "Identity provider setup and testing", color: "from-orange-500 to-orange-700" },
      { id: "admin-rostering", icon: Database, label: "Rostering Console", desc: "Sync management and conflict resolution", color: "from-emerald-500 to-emerald-700" },
      { id: "admin-content-approval", icon: FileCheck, label: "Content Approval", desc: "Review and publish content workflow", color: "from-sky-500 to-sky-700" },
      { id: "admin-announcements", icon: Megaphone, label: "Announcements", desc: "District-wide communications", color: "from-fuchsia-500 to-fuchsia-700" },
    ],
  },
  {
    category: "IT & Integration",
    items: [
      { id: "admin-api", icon: Code, label: "API Management", desc: "API keys, rate limits, and usage logs", color: "from-slate-500 to-slate-700" },
      { id: "admin-branding", icon: Palette, label: "Custom Branding", desc: "White-label with district identity", color: "from-pink-500 to-pink-700" },
      { id: "admin-compliance", icon: FileText, label: "Compliance Reports", desc: "FERPA audit docs and DPA status", color: "from-red-500 to-red-700" },
    ],
  },
];

export const AdminHub = ({ onNavigate, onBack }: AdminHubProps) => {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Administration Suite</h1>
          <p className="text-sm text-muted-foreground">School & district management tools</p>
        </div>
      </div>

      {sections.map((section, si) => (
        <div key={section.category} className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{section.category}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {section.items.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: si * 0.05 + i * 0.03 }}
              >
                <Card
                  className="p-4 cursor-pointer hover:shadow-lg transition-all border-border/50 hover:border-primary/30 group"
                  onClick={() => onNavigate(item.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2.5 rounded-xl bg-gradient-to-br ${item.color} text-white shrink-0`}>
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors text-sm">{item.label}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
