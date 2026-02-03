import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useEducatorData } from "../hooks/useEducatorData";
import { useEducatorRole } from "../hooks/useEducatorRole";
import { EducatorKPICards } from "../components/EducatorKPICards";
import { UserManagementTable } from "../components/UserManagementTable";
import { LearningProgressPanel } from "../components/LearningProgressPanel";
import { EngagementAnalytics } from "../components/EngagementAnalytics";
import { CommunicationsPanel } from "../components/CommunicationsPanel";
import { SimulationLeaderboard } from "../components/SimulationLeaderboard";
import { ReportsExport } from "../components/ReportsExport";
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  Activity, 
  Megaphone, 
  Trophy, 
  FileBarChart,
  ChevronLeft,
  GraduationCap,
  Shield
} from "lucide-react";
import { toast } from "sonner";

interface EducatorDashboardProps {
  onBack: () => void;
}

export const EducatorDashboard = ({ onBack }: EducatorDashboardProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  const { hasEducatorAccess, userRole, isLoading: roleLoading } = useEducatorRole();
  const {
    users,
    stats,
    announcements,
    sessions,
    isLoading,
    createAnnouncement,
    updateUserRole,
    createSession,
    isCreating,
  } = useEducatorData();

  const handleSendMessage = (userId: string) => {
    // For now, show a toast. In a full implementation, this would open a message dialog
    toast.info("Message feature coming soon!");
  };

  const handleViewUser = (userId: string) => {
    // Could navigate to a user detail view
    toast.info("User profile view coming soon!");
  };

  if (roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!hasEducatorAccess) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <Shield className="h-16 w-16 text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
        <p className="text-muted-foreground text-center mb-6">
          You don't have permission to access the Educator Dashboard.
          <br />
          Contact an administrator to request educator access.
        </p>
        <Button onClick={onBack}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          Go Back
        </Button>
      </div>
    );
  }

  const tabs = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "users", label: "Users", icon: Users },
    { id: "progress", label: "Learning", icon: BookOpen },
    { id: "engagement", label: "Engagement", icon: Activity },
    { id: "communications", label: "Communications", icon: Megaphone },
    { id: "simulations", label: "Simulations", icon: Trophy },
    { id: "reports", label: "Reports", icon: FileBarChart },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={onBack}>
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <div>
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-6 w-6 text-primary" />
                  <h1 className="text-xl md:text-2xl font-bold">Educator Dashboard</h1>
                </div>
                <p className="text-sm text-muted-foreground hidden md:block">
                  Monitor student progress and manage your educational platform
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="hidden md:flex">
              {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          {/* Tab Navigation */}
          <div className="overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0">
            <TabsList className="inline-flex h-auto p-1 bg-muted/50">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm whitespace-nowrap"
                >
                  <tab.icon className="h-4 w-4" />
                  <span className="hidden md:inline">{tab.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6 mt-6">
            <EducatorKPICards stats={stats} isLoading={isLoading} />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <EngagementAnalytics onViewUser={handleViewUser} />
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="mt-6">
            <UserManagementTable
              users={users}
              isLoading={isLoading}
              onUpdateRole={updateUserRole}
              onSendMessage={handleSendMessage}
            />
          </TabsContent>

          {/* Learning Progress Tab */}
          <TabsContent value="progress" className="mt-6">
            <LearningProgressPanel />
          </TabsContent>

          {/* Engagement Tab */}
          <TabsContent value="engagement" className="mt-6">
            <EngagementAnalytics onViewUser={handleViewUser} />
          </TabsContent>

          {/* Communications Tab */}
          <TabsContent value="communications" className="mt-6">
            <CommunicationsPanel
              announcements={announcements}
              sessions={sessions}
              onCreateAnnouncement={createAnnouncement}
              onCreateSession={createSession}
              isCreating={isCreating}
            />
          </TabsContent>

          {/* Simulations Tab */}
          <TabsContent value="simulations" className="mt-6">
            <SimulationLeaderboard />
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="mt-6">
            <ReportsExport />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
