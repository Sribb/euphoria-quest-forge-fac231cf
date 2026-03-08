import { EuphoriaSpinner } from "@/shared/components/EuphoriaSpinner";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "@/shared/components/ProtectedRoute";
import Landing from "./pages/Landing";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Onboarding from "./pages/Onboarding";
import RoleSelection from "./pages/RoleSelection";
import NotFound from "./pages/NotFound";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { useOnboarding } from "@/hooks/useOnboarding";
import { useEducatorRole } from "@/features/educator/hooks/useEducatorRole";

const RootRedirect = () => {
  const { user, loading } = useAuth();
  
  if (loading) return null;
  return user ? <Navigate to="/app" replace /> : <Landing />;
};

const OnboardingCheck = ({ children }: { children: React.ReactNode }) => {
  const { hasCompletedOnboarding, isLoading } = useOnboarding();
  const { hasEducatorAccess, isLoading: roleLoading } = useEducatorRole();
  
  if (isLoading || roleLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <EuphoriaSpinner size="lg" />
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
        <EuphoriaSpinner size="lg" />
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
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route
              path="/role-selection"
              element={
                <ProtectedRoute>
                  <RoleSelection />
                </ProtectedRoute>
              }
            />
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
