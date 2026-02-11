import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Wallet } from "lucide-react";

const COLORS = ["hsl(var(--primary))", "hsl(var(--destructive))", "hsl(var(--accent))", "#f59e0b", "#8b5cf6", "#06b6d4"];

export const BudgetMethodsLab = () => {
  const [income, setIncome] = useState(5000);
  const [rent, setRent] = useState(1500);
  const [food, setFood] = useState(500);
  const [transport, setTransport] = useState(300);
  const [entertainment, setEntertainment] = useState(200);

  const needs = rent + food + transport;
  const wants = entertainment;
  const totalSpending = needs + wants;
  const leftover = income - totalSpending;

  const fiftyThirtyTwenty = [
    { name: "Needs (50%)", value: income * 0.5, budget: income * 0.5, actual: needs },
    { name: "Wants (30%)", value: income * 0.3, budget: income * 0.3, actual: wants },
    { name: "Savings (20%)", value: income * 0.2, budget: income * 0.2, actual: leftover },
  ];

  const zeroBased = [
    { name: "Rent", value: rent },
    { name: "Food", value: food },
    { name: "Transport", value: transport },
    { name: "Entertainment", value: entertainment },
    { name: "Savings", value: Math.max(0, leftover) },
  ];

  return (
    <div className="space-y-6">
      <Card className="border-amber-500/30 bg-gradient-to-br from-amber-500/5 to-yellow-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-6 w-6 text-amber-500" />
            Budgeting Methods Showdown
          </CardTitle>
          <p className="text-sm text-muted-foreground">Adjust your income and spending to compare how different budgeting methods allocate your money.</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium">Income: ${income.toLocaleString()}</label>
              <Slider value={[income]} onValueChange={v => setIncome(v[0])} min={2000} max={15000} step={250} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">Rent: ${rent}</label>
              <Slider value={[rent]} onValueChange={v => setRent(v[0])} min={500} max={5000} step={100} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">Food: ${food}</label>
              <Slider value={[food]} onValueChange={v => setFood(v[0])} min={100} max={1500} step={50} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">Transport: ${transport}</label>
              <Slider value={[transport]} onValueChange={v => setTransport(v[0])} min={0} max={1000} step={50} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">Fun: ${entertainment}</label>
              <Slider value={[entertainment]} onValueChange={v => setEntertainment(v[0])} min={0} max={1000} step={50} />
            </div>
          </div>

          <Tabs defaultValue="5030" className="w-full">
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="5030">50/30/20 Rule</TabsTrigger>
              <TabsTrigger value="zero">Zero-Based</TabsTrigger>
            </TabsList>
            <TabsContent value="5030">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={fiftyThirtyTwenty} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name }) => name}>
                        {fiftyThirtyTwenty.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                      </Pie>
                      <Tooltip formatter={(v: number) => `$${v.toLocaleString()}`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-3">
                  {fiftyThirtyTwenty.map((cat, i) => (
                    <div key={cat.name} className="p-3 rounded-lg bg-muted/30 border">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-sm">{cat.name}</span>
                        <Badge variant={cat.actual <= cat.budget ? "default" : "destructive"}>
                          {cat.actual <= cat.budget ? "✓ On track" : "Over budget"}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Budget: ${cat.budget.toLocaleString()} | Actual: ${cat.actual.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="zero">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={zeroBased} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name }) => name}>
                        {zeroBased.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                      </Pie>
                      <Tooltip formatter={(v: number) => `$${v.toLocaleString()}`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Every dollar gets a job. Unassigned: <span className={leftover >= 0 ? "text-emerald-500" : "text-red-500"}>${leftover.toLocaleString()}</span></p>
                  {zeroBased.map((cat, i) => (
                    <div key={cat.name} className="flex justify-between text-sm p-2 rounded bg-muted/30">
                      <span>{cat.name}</span>
                      <span className="font-medium">${cat.value.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
