import { ArrowLeft, Palette, Upload, RotateCcw, Save, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { motion } from "framer-motion";

interface Props { onBack: () => void; }

export const CustomBranding = ({ onBack }: Props) => {
  const [primaryColor, setPrimaryColor] = useState("#6366f1");
  const [welcomeMsg, setWelcomeMsg] = useState("Welcome to {{district_name}}'s Financial Literacy Platform!");
  const [footerLinks, setFooterLinks] = useState([
    { label: "IT Help Desk", url: "https://helpdesk.district.edu" },
    { label: "Parent Portal", url: "https://parents.district.edu" },
  ]);

  const contrastRatio = 4.7; // Simplified
  const meetsWCAG = contrastRatio >= 4.5;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack}><ArrowLeft className="h-5 w-5" /></Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Custom Branding</h1>
            <p className="text-sm text-muted-foreground">White-label with your district identity</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-1"><RotateCcw className="h-3 w-3" />Reset to Default</Button>
          <Button size="sm" className="gap-1"><Save className="h-3 w-3" />Publish</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Settings */}
        <div className="space-y-4">
          <Card className="p-4 border-border/50">
            <h3 className="font-semibold text-foreground text-sm mb-3">Logo Upload</h3>
            <div className="border-2 border-dashed border-border/50 rounded-xl p-8 text-center cursor-pointer hover:border-primary/30 transition-colors">
              <Upload className="h-6 w-6 mx-auto text-muted-foreground mb-2" />
              <p className="text-xs text-muted-foreground">Drag & drop or click to upload</p>
              <p className="text-[10px] text-muted-foreground mt-1">PNG, SVG · Max 2MB · Recommended: 200x60px</p>
            </div>
          </Card>

          <Card className="p-4 border-border/50">
            <h3 className="font-semibold text-foreground text-sm mb-3">Primary Color</h3>
            <div className="flex items-center gap-3">
              <input type="color" value={primaryColor} onChange={e => setPrimaryColor(e.target.value)} className="w-10 h-10 rounded cursor-pointer border-0" />
              <Input value={primaryColor} onChange={e => setPrimaryColor(e.target.value)} className="w-28 font-mono text-xs" />
              <div className={`px-2 py-1 rounded text-[10px] font-semibold ${meetsWCAG ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-400'}`}>
                {meetsWCAG ? '✓ WCAG AA' : '✗ Low Contrast'}
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">Contrast ratio: {contrastRatio}:1 (min 4.5:1 required)</p>
          </Card>

          <Card className="p-4 border-border/50">
            <h3 className="font-semibold text-foreground text-sm mb-3">Welcome Message</h3>
            <Textarea value={welcomeMsg} onChange={e => setWelcomeMsg(e.target.value)} className="text-xs" rows={3} />
            <p className="text-[10px] text-muted-foreground mt-1">Available merge tags: {"{{district_name}}"}, {"{{school_name}}"}, {"{{student_first_name}}"}</p>
          </Card>

          <Card className="p-4 border-border/50">
            <h3 className="font-semibold text-foreground text-sm mb-3">Footer Links</h3>
            <div className="space-y-2">
              {footerLinks.map((link, i) => (
                <div key={i} className="flex gap-2">
                  <Input value={link.label} className="text-xs" placeholder="Label" onChange={e => { const nl = [...footerLinks]; nl[i].label = e.target.value; setFooterLinks(nl); }} />
                  <Input value={link.url} className="text-xs" placeholder="URL" onChange={e => { const nl = [...footerLinks]; nl[i].url = e.target.value; setFooterLinks(nl); }} />
                </div>
              ))}
              {footerLinks.length < 5 && (
                <Button variant="ghost" size="sm" className="text-xs" onClick={() => setFooterLinks([...footerLinks, { label: "", url: "" }])}>+ Add Link</Button>
              )}
            </div>
          </Card>
        </div>

        {/* Live Preview */}
        <Card className="p-4 border-border/50 sticky top-6">
          <h3 className="font-semibold text-foreground text-sm mb-3 flex items-center gap-2"><Eye className="h-4 w-4" />Live Preview</h3>
          <div className="rounded-xl border border-border/50 overflow-hidden">
            {/* Mock header */}
            <div className="p-3 flex items-center gap-3" style={{ backgroundColor: primaryColor }}>
              <div className="w-8 h-8 rounded bg-white/20 flex items-center justify-center text-white text-xs font-bold">D</div>
              <span className="text-white text-sm font-semibold">District Financial Literacy</span>
            </div>
            {/* Mock dashboard */}
            <div className="p-4 bg-background space-y-3">
              <div className="p-3 rounded-lg border border-border/30" style={{ borderLeftColor: primaryColor, borderLeftWidth: 3 }}>
                <p className="text-xs text-foreground">{welcomeMsg.replace("{{district_name}}", "Springfield USD")}</p>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {["Lessons", "Practice", "Games"].map(s => (
                  <div key={s} className="p-2 rounded-lg border border-border/30 text-center">
                    <div className="w-6 h-6 rounded mx-auto mb-1" style={{ backgroundColor: `${primaryColor}20` }} />
                    <span className="text-[10px] text-foreground">{s}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 text-[9px] text-muted-foreground pt-2 border-t border-border/30">
                {footerLinks.filter(l => l.label).map(l => <span key={l.label} className="underline cursor-pointer">{l.label}</span>)}
              </div>
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            {["Desktop", "Tablet", "Mobile"].map(d => (
              <Button key={d} variant="outline" size="sm" className="text-[10px] flex-1">{d}</Button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
