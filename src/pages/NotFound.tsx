import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import logo from "@/assets/euphoria-logo-button.png";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center max-w-md space-y-6">
        <img
          src={logo}
          alt="Euphoria"
          className="w-12 h-12 mx-auto rounded-xl"
        />
        <h1 className="font-display text-8xl font-medium text-primary/20 leading-none select-none">
          404
        </h1>
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-foreground">
            Page not found
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        <Button
          variant="gradient"
          onClick={() => navigate("/")}
          className="px-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Go Home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
