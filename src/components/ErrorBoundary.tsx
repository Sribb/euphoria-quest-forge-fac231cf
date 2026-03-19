import { Component, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/euphoria-logo-button.png";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4">
          <div className="rounded-2xl border border-border/50 bg-card p-10 max-w-md w-full text-center shadow-sm space-y-6">
            <img
              src={logo}
              alt="Euphoria"
              className="w-14 h-14 mx-auto rounded-xl"
            />
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold text-foreground">
                Something went wrong
              </h1>
              <p className="text-sm text-muted-foreground leading-relaxed">
                This is a temporary issue. Try refreshing the page.
              </p>
            </div>
            <Button
              variant="gradient"
              onClick={() => window.location.reload()}
              className="px-8"
            >
              Refresh Page
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
