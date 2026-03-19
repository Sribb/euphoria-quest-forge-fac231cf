import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DpaDashboard } from "@/features/dpa/components/DpaDashboard";
import { DpaForm } from "@/features/dpa/components/DpaForm";
import { DpaPreview } from "@/features/dpa/components/DpaPreview";
import { ComplianceArtifacts } from "@/features/dpa/components/ComplianceArtifacts";
import { useDpaRecords, DpaFormData } from "@/features/dpa/hooks/useDpaRecords";
import logo from "@/assets/euphoria-logo-button.png";

type View = "dashboard" | "form" | "preview";

const DpaPortal = () => {
  const navigate = useNavigate();
  const { data: records = [], isLoading } = useDpaRecords();
  const [view, setView] = useState<View>("dashboard");
  const [formData, setFormData] = useState<DpaFormData | null>(null);

  return (
    <div className="min-h-screen relative overflow-hidden bg-background">
      <div className="absolute inset-0 bg-gradient-hero opacity-30 blur-3xl" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(262_83%_58%/0.15),transparent_50%)]" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">
        <button
          onClick={() => navigate("/legal")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-10"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Legal
        </button>

        <div className="flex items-center gap-3 mb-2">
          <img src={logo} alt="Euphoria" className="w-8 h-8 object-contain" />
          <h1 className="text-3xl font-semibold text-foreground">Data Processing Agreements</h1>
        </div>
        <p className="text-muted-foreground text-sm mb-10">
          Self-service DPA generation for district administrators. No legal back-and-forth — generate, download, and sign instantly.
        </p>

        {view === "dashboard" && (
          <>
            <DpaDashboard
              records={records}
              isLoading={isLoading}
              onNewDpa={() => setView("form")}
            />
            <ComplianceArtifacts />
          </>
        )}

        {view === "form" && (
          <DpaForm
            onBack={() => setView("dashboard")}
            onSubmit={(data) => {
              setFormData(data);
              setView("preview");
            }}
          />
        )}

        {view === "preview" && formData && (
          <DpaPreview
            formData={formData}
            onBack={() => setView("form")}
            onComplete={() => {
              setFormData(null);
              setView("dashboard");
            }}
          />
        )}
      </div>
    </div>
  );
};

export default DpaPortal;
