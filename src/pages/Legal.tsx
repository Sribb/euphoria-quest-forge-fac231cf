import { ArrowLeft, Shield, FileText, Lock, ExternalLink, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import logo from "@/assets/euphoria-logo-button.png";

const pages = [
  {
    icon: Lock,
    title: "Privacy Policy",
    description: "How we collect, use, and protect your personal information. Details on data sharing, cookies, and your rights.",
    href: "/privacy",
    updated: "March 2026",
  },
  {
    icon: FileText,
    title: "Terms & Conditions",
    description: "Rules governing your use of Euphoria, including the educational-only disclaimer, account responsibilities, and intellectual property.",
    href: "/terms",
    updated: "March 2026",
  },
  {
    icon: Shield,
    title: "FERPA Compliance",
    description: "How Euphoria qualifies as a school official under FERPA, student data inventory, retention policies, and downloadable documentation for district reviews.",
    href: "/ferpa",
    updated: "March 2026",
    badge: "For Districts",
  },
];

const Legal = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden bg-background">
      <div className="absolute inset-0 bg-gradient-hero opacity-30 blur-3xl" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(262_83%_58%/0.15),transparent_50%)]" />

      <div className="relative z-10 max-w-2xl mx-auto px-6 py-12">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-10"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to home
        </button>

        <div className="flex items-center gap-3 mb-2">
          <img src={logo} alt="Euphoria" className="w-8 h-8 object-contain" />
          <h1 className="text-3xl font-bold">Legal</h1>
        </div>
        <p className="text-muted-foreground text-sm mb-10">
          Policies, terms, and compliance documentation for students, parents, and school districts.
        </p>

        <div className="space-y-4">
          {pages.map((page) => (
            <Card
              key={page.href}
              className="p-5 border-border/50 hover:border-primary/30 bg-card/60 backdrop-blur-sm cursor-pointer transition-all duration-200 hover:-translate-y-0.5 group"
              onClick={() => navigate(page.href)}
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/15 transition-colors">
                  <page.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="font-semibold text-foreground">{page.title}</h2>
                    {page.badge && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                        {page.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{page.description}</p>
                  <p className="text-xs text-muted-foreground/60 mt-2">Last updated: {page.updated}</p>
                </div>
                <ExternalLink className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary shrink-0 mt-1 transition-colors" />
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-10 p-4 rounded-xl bg-muted/20 border border-border/30">
          <p className="text-xs text-muted-foreground leading-relaxed">
            For legal inquiries, DPA requests, or data deletion requests, contact us at{" "}
            <strong className="text-foreground">privacy@euphoria.edu</strong>.
            We respond to all compliance inquiries within 5 business days.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Legal;
