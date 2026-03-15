import { forwardRef } from "react";
import { Award, Shield, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProfessionalCertificateProps {
  recipientName: string;
  title: string;
  description: string;
  issueDate: string;
  credentialId: string;
  tier: string;
}

const tierAccent: Record<string, string> = {
  beginner: "from-emerald-400 to-teal-500",
  advanced: "from-blue-400 to-indigo-500",
  elite: "from-purple-400 to-violet-500",
  fellow: "from-amber-400 to-orange-500",
  easy: "from-emerald-400 to-teal-500",
  medium: "from-blue-400 to-indigo-500",
  hard: "from-purple-400 to-violet-500",
  master: "from-amber-400 to-orange-500",
};

const tierLabel: Record<string, string> = {
  beginner: "Beginner",
  advanced: "Advanced",
  elite: "Elite",
  fellow: "Fellow",
  easy: "Beginner",
  medium: "Advanced",
  hard: "Elite",
  master: "Fellow",
};

export const ProfessionalCertificate = forwardRef<HTMLDivElement, ProfessionalCertificateProps>(
  ({ recipientName, title, description, issueDate, credentialId, tier }, ref) => {
    const accent = tierAccent[tier] || tierAccent.beginner;
    const label = tierLabel[tier] || "Certificate";
    const verifyUrl = `${window.location.origin}/verify/${credentialId}`;

    return (
      <div
        ref={ref}
        className="w-[900px] h-[636px] relative overflow-hidden bg-gradient-to-br from-[hsl(240,10%,8%)] to-[hsl(240,15%,12%)] text-white"
        style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
      >
        {/* Decorative border */}
        <div className="absolute inset-3 border border-white/10 rounded-sm" />
        <div className="absolute inset-5 border border-white/5 rounded-sm" />

        {/* Corner ornaments */}
        <div className={cn("absolute top-6 left-6 w-16 h-16 border-t-2 border-l-2 rounded-tl-sm border-transparent bg-gradient-to-br", accent)} style={{ borderImage: `linear-gradient(135deg, hsl(263,84%,58%), hsl(273,84%,65%)) 1` }} />
        <div className={cn("absolute top-6 right-6 w-16 h-16 border-t-2 border-r-2 rounded-tr-sm")} style={{ borderImage: `linear-gradient(135deg, hsl(263,84%,58%), hsl(273,84%,65%)) 1` }} />
        <div className={cn("absolute bottom-6 left-6 w-16 h-16 border-b-2 border-l-2 rounded-bl-sm")} style={{ borderImage: `linear-gradient(135deg, hsl(263,84%,58%), hsl(273,84%,65%)) 1` }} />
        <div className={cn("absolute bottom-6 right-6 w-16 h-16 border-b-2 border-r-2 rounded-br-sm")} style={{ borderImage: `linear-gradient(135deg, hsl(263,84%,58%), hsl(273,84%,65%)) 1` }} />

        {/* Subtle radial glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(263,84%,58%,0.08)_0%,transparent_70%)]" />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full px-16 text-center">
          {/* Logo / Org */}
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[hsl(263,84%,58%)] to-[hsl(273,84%,65%)] flex items-center justify-center">
              <Award className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl tracking-[0.3em] uppercase text-white/60 font-light">Euphoria</span>
          </div>

          {/* Title */}
          <h2 className="text-sm tracking-[0.4em] uppercase text-white/40 mt-6 mb-2 font-light">
            Certificate of Achievement
          </h2>

          <div className={cn("inline-flex items-center gap-2 px-4 py-1 rounded-full text-xs tracking-wider uppercase mb-6 bg-gradient-to-r text-white", accent)}>
            <Shield className="w-3 h-3" />
            {label} Level
          </div>

          {/* Recipient */}
          <p className="text-sm text-white/50 mb-1 tracking-wider uppercase">This certifies that</p>
          <h1 className="text-4xl font-bold mb-2 tracking-wide" style={{ fontFamily: "'Georgia', serif" }}>
            {recipientName}
          </h1>
          <div className="w-48 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent mb-6" />

          {/* Achievement */}
          <p className="text-sm text-white/50 mb-2 tracking-wider uppercase">has successfully completed</p>
          <h3 className="text-2xl font-semibold text-white mb-3">{title}</h3>
          <p className="text-sm text-white/40 max-w-lg leading-relaxed mb-8">{description}</p>

          {/* Footer */}
          <div className="flex items-center justify-between w-full max-w-2xl mt-auto mb-2">
            <div className="text-left">
              <p className="text-xs text-white/30 uppercase tracking-wider mb-1">Issue Date</p>
              <p className="text-sm text-white/70">{new Date(issueDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
            </div>

            <div className="text-center">
              <div className="w-32 h-[1px] bg-white/20 mb-1" />
              <p className="text-xs text-white/30">Euphoria Leadership</p>
            </div>

            <div className="text-right">
              <p className="text-xs text-white/30 uppercase tracking-wider mb-1">Credential ID</p>
              <p className="text-sm text-white/70 font-mono">{credentialId}</p>
            </div>
          </div>

          {/* Verification */}
          <div className="mt-2 flex items-center gap-2">
            <Star className="w-3 h-3 text-white/20" />
            <p className="text-[10px] text-white/20 tracking-wider">
              Verify at {verifyUrl}
            </p>
            <Star className="w-3 h-3 text-white/20" />
          </div>
        </div>
      </div>
    );
  }
);

ProfessionalCertificate.displayName = "ProfessionalCertificate";
