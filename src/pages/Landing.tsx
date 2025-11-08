import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TrendingUp, Target, Brain, Zap, Sparkles, Users } from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in");
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Sticky Navigation */}
      <nav className="fixed top-0 w-full z-navigation backdrop-blur-xl bg-background/80 border-b border-border">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold">
            Euphoria <span className="text-primary">✦</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#home" className="text-foreground/80 hover:text-foreground smooth-transition">
              Home
            </a>
            <a href="#how-it-works" className="text-foreground/80 hover:text-foreground smooth-transition">
              How It Works
            </a>
            <a href="#about" className="text-foreground/80 hover:text-foreground smooth-transition">
              About
            </a>
            <Button variant="ghost" onClick={() => navigate("/auth")}>
              Sign In
            </Button>
            <Button onClick={() => navigate("/auth")} className="bg-primary hover:bg-primary/90 shadow-glow">
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        id="home"
        className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
      >
        {/* Animated Background Gradient */}
        <div
          className="absolute inset-0 bg-gradient-hero opacity-50"
          style={{
            transform: `translateY(${scrollY * 0.5}px)`,
            filter: "blur(100px)",
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(262_83%_58%/0.15),transparent_50%)]" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-5xl mx-auto text-center space-y-8">
            <h1 className="text-6xl md:text-8xl font-bold leading-tight tracking-tight">
              Investing isn't learned by reading—
              <span className="text-primary"> it's learned by doing.</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Euphoria transforms investing into an immersive, hands-on simulation where you make
              decisions, react to markets, and learn like a real investor.
            </p>
            <div className="pt-8">
              <Button
                size="lg"
                onClick={() => navigate("/auth")}
                className="text-lg px-12 py-6 bg-primary hover:bg-primary/90 shadow-glow hover:shadow-[0_0_40px_hsl(262_83%_58%/0.6)] smooth-transition"
              >
                Get Started
              </Button>
            </div>
          </div>

          {/* Abstract Visual Element */}
          <div className="mt-20 relative max-w-4xl mx-auto">
            <div className="absolute inset-0 bg-gradient-primary opacity-20 blur-3xl rounded-full" />
            <div className="relative bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-8 shadow-lg">
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="h-32 bg-gradient-primary/20 rounded-lg animate-pulse" />
                <div className="h-32 bg-success/20 rounded-lg animate-pulse delay-100" />
                <div className="h-32 bg-destructive/20 rounded-lg animate-pulse delay-200" />
              </div>
              <div className="h-48 bg-muted/30 rounded-lg relative overflow-hidden">
                <div className="absolute inset-0 flex items-end justify-around pb-4">
                  {[...Array(12)].map((_, i) => (
                    <div
                      key={i}
                      className="w-8 bg-primary/40 rounded-t animate-pulse"
                      style={{
                        height: `${Math.random() * 100 + 20}%`,
                        animationDelay: `${i * 0.1}s`,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-32 relative">
        <div className="container mx-auto px-6">
          <h2 className="text-5xl font-bold text-center mb-20 reveal">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            {[
              {
                step: "01",
                title: "Simulate live markets",
                description:
                  "Trade in a realistic environment with real-time market data and dynamic scenarios.",
                icon: TrendingUp,
              },
              {
                step: "02",
                title: "Make trades, test strategies",
                description:
                  "Execute trades, build portfolios, and experiment with different investment approaches risk-free.",
                icon: Target,
              },
              {
                step: "03",
                title: "Learn from every decision",
                description:
                  "Get instant feedback, AI-powered insights, and track your progress as you master investing.",
                icon: Brain,
              },
            ].map((item, i) => (
              <Card
                key={i}
                className="reveal p-8 bg-card/50 backdrop-blur-sm border-border hover:border-primary/50 smooth-transition hover:shadow-glow group"
                style={{ animationDelay: `${i * 0.2}s` }}
              >
                <div className="mb-6">
                  <item.icon className="w-16 h-16 text-primary group-hover:scale-110 smooth-transition" />
                </div>
                <div className="text-6xl font-bold text-primary/20 mb-4">{item.step}</div>
                <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-32 bg-card/30 relative">
        <div className="absolute inset-0 bg-gradient-accent opacity-30 blur-3xl" />
        <div className="container mx-auto px-6 relative">
          <h2 className="text-5xl font-bold text-center mb-20 reveal">Built for Real Learning</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {[
              {
                icon: Zap,
                title: "Real-time simulations",
                description: "Experience markets as they happen with live data feeds.",
              },
              {
                icon: Target,
                title: "Portfolio challenges",
                description: "Test your skills with curated investment scenarios.",
              },
              {
                icon: Sparkles,
                title: "Interactive lessons",
                description: "Learn by doing with hands-on educational modules.",
              },
              {
                icon: Brain,
                title: "AI investment coach",
                description: "Get personalized guidance from advanced AI assistants.",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="reveal text-center space-y-4 p-6 rounded-xl hover:bg-card/50 smooth-transition"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="inline-flex p-4 rounded-2xl bg-primary/10">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-32">
        <div className="container mx-auto px-6">
          <h2 className="text-5xl font-bold text-center mb-20 reveal">What People Say</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                quote: "Euphoria made investing click for me. It's brilliant.",
                author: "Sarah M.",
                role: "Student",
              },
              {
                quote: "Finally, a way to learn without risking real money. Game-changer.",
                author: "Michael T.",
                role: "New Investor",
              },
              {
                quote: "The AI coach feels like having a mentor in my pocket. Incredible.",
                author: "James K.",
                role: "Entrepreneur",
              },
            ].map((testimonial, i) => (
              <Card
                key={i}
                className="reveal p-8 bg-card/50 backdrop-blur-sm border-border hover:border-primary/30 smooth-transition"
                style={{ animationDelay: `${i * 0.15}s` }}
              >
                <Users className="w-10 h-10 text-primary/60 mb-6" />
                <p className="text-lg mb-6 leading-relaxed italic">"{testimonial.quote}"</p>
                <div>
                  <p className="font-bold">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section id="about" className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-primary opacity-20" />
        <div className="container mx-auto px-6 text-center relative z-10">
          <h2 className="text-6xl font-bold mb-8 reveal">
            Ready to stop reading and start doing?
          </h2>
          <Button
            size="lg"
            onClick={() => navigate("/auth")}
            className="reveal text-lg px-12 py-6 bg-primary hover:bg-primary/90 shadow-glow hover:shadow-[0_0_40px_hsl(262_83%_58%/0.6)] smooth-transition"
          >
            Create your free account
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-muted-foreground">
              © 2025 Euphoria. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-muted-foreground hover:text-foreground smooth-transition">
                Terms
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground smooth-transition">
                Privacy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
