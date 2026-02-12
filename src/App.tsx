import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "@/shared/components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Onboarding from "./pages/Onboarding";
import NotFound from "./pages/NotFound";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { useOnboarding } from "@/hooks/useOnboarding";
import { useEducatorRole } from "@/features/educator/hooks/useEducatorRole";

const RootRedirect = () => {
  const { user, loading } = useAuth();
  
  if (loading) return null;
  return <Navigate to={user ? "/app" : "/auth"} replace />;
};

const OnboardingCheck = ({ children }: { children: React.ReactNode }) => {
  const { hasCompletedOnboarding, isLoading } = useOnboarding();
  const { hasEducatorAccess, isLoading: roleLoading } = useEducatorRole();
  
  if (isLoading || roleLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  
  // Educators skip the placement quiz entirely
  if (hasEducatorAccess) {
    return <>{children}</>;
  }
  
  if (!hasCompletedOnboarding) {
    return <Navigate to="/onboarding" replace />;
  }
  
  return <>{children}</>;
};

// Redirect away from onboarding if already completed
const OnboardingRedirect = ({ children }: { children: React.ReactNode }) => {
  const { hasCompletedOnboarding, isLoading } = useOnboarding();
  const { hasEducatorAccess, isLoading: roleLoading } = useEducatorRole();
  
  if (isLoading || roleLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  
  // Educators should never see the quiz
  if (hasEducatorAccess) {
    return <Navigate to="/app" replace />;
  }
  
  if (hasCompletedOnboarding) {
    return <Navigate to="/app" replace />;
  }
  
  return <>{children}</>;
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<RootRedirect />} />
            <Route path="/auth" element={<Auth />} />
            <Route
              path="/onboarding"
              element={
                <ProtectedRoute>
                  <OnboardingRedirect>
                    <Onboarding />
                  </OnboardingRedirect>
                </ProtectedRoute>
              }
            />
            <Route
              path="/app/*"
              element={
                <ProtectedRoute>
                  <OnboardingCheck>
                    <Index />
                  </OnboardingCheck>
                </ProtectedRoute>
              }
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
