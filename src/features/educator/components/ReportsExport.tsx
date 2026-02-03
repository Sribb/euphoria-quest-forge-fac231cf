import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { FileDown, FileSpreadsheet, FileText, Loader2, TrendingUp, Users, BookOpen, Gamepad2 } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

export const ReportsExport = () => {
  const [reportType, setReportType] = useState<string>("users");
  const [exportFormat, setExportFormat] = useState<"csv" | "pdf">("csv");
  const [includeCharts, setIncludeCharts] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  const { data: reportData } = useQuery({
    queryKey: ["educator-report-data"],
    queryFn: async () => {
      const { data: profiles } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      const { data: lessonProgress } = await supabase
        .from("user_lesson_progress")
        .select("*");

      const { data: gameSessions } = await supabase.from("game_sessions").select("*");

      const { data: portfolios } = await supabase.from("portfolios").select("*");

      return {
        profiles: profiles || [],
        lessonProgress: lessonProgress || [],
        gameSessions: gameSessions || [],
        portfolios: portfolios || [],
      };
    },
  });

  const generateCSV = (data: any[], headers: string[], filename: string) => {
    const csvContent = [
      headers.join(","),
      ...data.map((row) => headers.map((h) => JSON.stringify(row[h] || "")).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleExport = async () => {
    if (!reportData) return;

    setIsExporting(true);

    try {
      switch (reportType) {
        case "users":
          generateCSV(
            reportData.profiles.map((p) => ({
              id: p.id,
              display_name: p.display_name,
              username: p.username,
              level: p.level,
              experience_points: p.experience_points,
              coins: p.coins,
              created_at: format(new Date(p.created_at), "yyyy-MM-dd"),
              updated_at: format(new Date(p.updated_at), "yyyy-MM-dd"),
            })),
            ["id", "display_name", "username", "level", "experience_points", "coins", "created_at", "updated_at"],
            "users-report"
          );
          break;

        case "progress":
          generateCSV(
            reportData.lessonProgress.map((p) => ({
              user_id: p.user_id,
              lesson_id: p.lesson_id,
              progress: p.progress,
              completed: p.completed,
              quiz_score: p.quiz_score,
              quiz_attempts: p.quiz_attempts,
              mastery_level: p.mastery_level,
              created_at: format(new Date(p.created_at), "yyyy-MM-dd"),
            })),
            ["user_id", "lesson_id", "progress", "completed", "quiz_score", "quiz_attempts", "mastery_level", "created_at"],
            "learning-progress-report"
          );
          break;

        case "games":
          generateCSV(
            reportData.gameSessions.map((g) => ({
              user_id: g.user_id,
              game_id: g.game_id,
              score: g.score,
              coins_earned: g.coins_earned,
              completed: g.completed,
              created_at: format(new Date(g.created_at), "yyyy-MM-dd"),
            })),
            ["user_id", "game_id", "score", "coins_earned", "completed", "created_at"],
            "game-sessions-report"
          );
          break;

        case "portfolios":
          generateCSV(
            reportData.portfolios.map((p) => ({
              user_id: p.user_id,
              total_value: p.total_value,
              cash_balance: p.cash_balance,
              buying_power: p.buying_power,
              unsettled_cash: p.unsettled_cash,
              created_at: format(new Date(p.created_at), "yyyy-MM-dd"),
              updated_at: format(new Date(p.updated_at), "yyyy-MM-dd"),
            })),
            ["user_id", "total_value", "cash_balance", "buying_power", "unsettled_cash", "created_at", "updated_at"],
            "portfolios-report"
          );
          break;

        case "comprehensive":
          // Export all data
          const comprehensiveData = reportData.profiles.map((profile) => {
            const userProgress = reportData.lessonProgress.filter((p) => p.user_id === profile.id);
            const userGames = reportData.gameSessions.filter((g) => g.user_id === profile.id);
            const userPortfolio = reportData.portfolios.find((p) => p.user_id === profile.id);

            return {
              user_id: profile.id,
              display_name: profile.display_name,
              username: profile.username,
              level: profile.level,
              xp: profile.experience_points,
              coins: profile.coins,
              lessons_started: userProgress.length,
              lessons_completed: userProgress.filter((p) => p.completed).length,
              avg_quiz_score: userProgress.filter((p) => p.quiz_score).length
                ? Math.round(
                    userProgress.filter((p) => p.quiz_score).reduce((acc, p) => acc + (p.quiz_score || 0), 0) /
                      userProgress.filter((p) => p.quiz_score).length
                  )
                : 0,
              games_played: userGames.length,
              total_game_score: userGames.reduce((acc, g) => acc + g.score, 0),
              portfolio_value: userPortfolio?.total_value || 0,
              portfolio_return: userPortfolio
                ? Math.round(((userPortfolio.total_value - 10000) / 10000) * 10000) / 100
                : 0,
              joined: format(new Date(profile.created_at), "yyyy-MM-dd"),
              last_active: format(new Date(profile.updated_at), "yyyy-MM-dd"),
            };
          });

          generateCSV(
            comprehensiveData,
            [
              "user_id",
              "display_name",
              "username",
              "level",
              "xp",
              "coins",
              "lessons_started",
              "lessons_completed",
              "avg_quiz_score",
              "games_played",
              "total_game_score",
              "portfolio_value",
              "portfolio_return",
              "joined",
              "last_active",
            ],
            "comprehensive-report"
          );
          break;
      }

      toast.success("Report exported successfully!");
    } catch (error) {
      toast.error("Failed to export report");
      console.error(error);
    } finally {
      setIsExporting(false);
    }
  };

  const reportOptions = [
    {
      value: "users",
      label: "User Profiles",
      description: "All registered users with their levels and XP",
      icon: Users,
    },
    {
      value: "progress",
      label: "Learning Progress",
      description: "Lesson completion and quiz scores",
      icon: BookOpen,
    },
    {
      value: "games",
      label: "Game Sessions",
      description: "Game play history and scores",
      icon: Gamepad2,
    },
    {
      value: "portfolios",
      label: "Portfolio Data",
      description: "User portfolio values and holdings",
      icon: TrendingUp,
    },
    {
      value: "comprehensive",
      label: "Comprehensive Report",
      description: "All data combined in one export",
      icon: FileSpreadsheet,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileDown className="h-5 w-5" />
          Export Reports
        </CardTitle>
        <CardDescription>
          Generate and download performance reports for analysis
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Report Type Selection */}
          <div className="space-y-4">
            <Label>Select Report Type</Label>
            <div className="space-y-2">
              {reportOptions.map((option) => (
                <div
                  key={option.value}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    reportType === option.value
                      ? "border-primary bg-primary/5"
                      : "border-border hover:bg-muted/50"
                  }`}
                  onClick={() => setReportType(option.value)}
                >
                  <option.icon
                    className={`h-5 w-5 ${
                      reportType === option.value ? "text-primary" : "text-muted-foreground"
                    }`}
                  />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{option.label}</p>
                    <p className="text-xs text-muted-foreground">{option.description}</p>
                  </div>
                  <div
                    className={`w-4 h-4 rounded-full border-2 ${
                      reportType === option.value
                        ? "border-primary bg-primary"
                        : "border-muted-foreground"
                    }`}
                  >
                    {reportType === option.value && (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary-foreground" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Export Options */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Export Format</Label>
              <Select value={exportFormat} onValueChange={(v) => setExportFormat(v as "csv" | "pdf")}>
                <SelectTrigger>
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">
                    <div className="flex items-center gap-2">
                      <FileSpreadsheet className="h-4 w-4" />
                      CSV (Spreadsheet)
                    </div>
                  </SelectItem>
                  <SelectItem value="pdf" disabled>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      PDF (Coming Soon)
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <Label>Report Options</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="include-charts"
                    checked={includeCharts}
                    onCheckedChange={(checked) => setIncludeCharts(checked as boolean)}
                    disabled={exportFormat === "csv"}
                  />
                  <label
                    htmlFor="include-charts"
                    className={`text-sm ${exportFormat === "csv" ? "text-muted-foreground" : ""}`}
                  >
                    Include charts and visualizations (PDF only)
                  </label>
                </div>
              </div>
            </div>

            {/* Data Preview */}
            <div className="p-4 rounded-lg bg-muted/50">
              <p className="text-sm font-medium mb-2">Report Preview</p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Total Records</p>
                  <p className="font-medium">
                    {reportType === "users"
                      ? reportData?.profiles.length || 0
                      : reportType === "progress"
                      ? reportData?.lessonProgress.length || 0
                      : reportType === "games"
                      ? reportData?.gameSessions.length || 0
                      : reportType === "portfolios"
                      ? reportData?.portfolios.length || 0
                      : reportData?.profiles.length || 0}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Format</p>
                  <p className="font-medium uppercase">{exportFormat}</p>
                </div>
              </div>
            </div>

            <Button className="w-full" onClick={handleExport} disabled={isExporting}>
              {isExporting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating Report...
                </>
              ) : (
                <>
                  <FileDown className="h-4 w-4 mr-2" />
                  Export Report
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-6 pt-6 border-t">
          <p className="text-sm font-medium mb-4">Quick Data Summary</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3 rounded-lg bg-muted/30">
              <p className="text-xs text-muted-foreground">Total Users</p>
              <p className="text-lg font-bold">{reportData?.profiles.length || 0}</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/30">
              <p className="text-xs text-muted-foreground">Lesson Records</p>
              <p className="text-lg font-bold">{reportData?.lessonProgress.length || 0}</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/30">
              <p className="text-xs text-muted-foreground">Game Sessions</p>
              <p className="text-lg font-bold">{reportData?.gameSessions.length || 0}</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/30">
              <p className="text-xs text-muted-foreground">Portfolios</p>
              <p className="text-lg font-bold">{reportData?.portfolios.length || 0}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
