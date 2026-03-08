import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  BookTemplate, Plus, CalendarIcon, Play, Trash2, Loader2, Clock,
  ChevronRight, Sparkles, FileText, GraduationCap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useAssignmentTemplates, AssignmentTemplate } from "../hooks/useAssignmentTemplates";
import { SaveTemplateDialog } from "./SaveTemplateDialog";
import { ApplyTemplateDialog } from "./ApplyTemplateDialog";
import type { ClassWithMembers } from "../hooks/useClassManagement";
import { motion } from "framer-motion";

interface TemplatesPanelProps {
  classes: ClassWithMembers[];
}

const TYPE_STYLES: Record<string, string> = {
  custom: "bg-primary/10 text-primary border-primary/30",
  semester: "bg-success/10 text-success border-success/30",
  year: "bg-warning/10 text-warning border-warning/30",
};

const TYPE_LABELS: Record<string, string> = {
  custom: "Custom",
  semester: "Semester Pacing",
  year: "Year-Long Pacing",
};

export const TemplatesPanel = ({ classes }: TemplatesPanelProps) => {
  const { templates, isLoading, deleteTemplate, applyTemplate } = useAssignmentTemplates();
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [applyDialogOpen, setApplyDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<AssignmentTemplate | null>(null);

  const activeClasses = classes.filter(c => !c.archived_at);
  const myTemplates = templates.filter(t => !t.is_public);
  const publicGuides = templates.filter(t => t.is_public);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
            <BookTemplate className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-bold tracking-tight">Assignment Templates</h3>
            <p className="text-xs text-muted-foreground">Save sequences & adopt pacing guides</p>
          </div>
        </div>
        <Button onClick={() => setSaveDialogOpen(true)} className="bg-gradient-primary gap-1.5 font-semibold">
          <Plus className="w-4 h-4" /> New Template
        </Button>
      </div>

      {/* Pre-built Pacing Guides */}
      {publicGuides.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
            <GraduationCap className="w-3.5 h-3.5" /> Pre-Built Pacing Guides
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {publicGuides.map(t => (
              <TemplateCard
                key={t.id}
                template={t}
                onApply={() => { setSelectedTemplate(t); setApplyDialogOpen(true); }}
                isPublic
              />
            ))}
          </div>
        </div>
      )}

      {/* My Templates */}
      <div className="space-y-2">
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5" /> My Templates
        </h4>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
          </div>
        ) : myTemplates.length === 0 ? (
          <Card className="p-8 text-center border-dashed border-2 border-border/50 bg-card/40">
            <BookTemplate className="w-8 h-8 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground mb-1">No templates yet</p>
            <p className="text-xs text-muted-foreground/70">
              Save your assignment sequences as reusable templates
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {myTemplates.map(t => (
              <TemplateCard
                key={t.id}
                template={t}
                onApply={() => { setSelectedTemplate(t); setApplyDialogOpen(true); }}
                onDelete={() => deleteTemplate.mutate(t.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Dialogs */}
      <SaveTemplateDialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen} />
      
      {selectedTemplate && (
        <ApplyTemplateDialog
          open={applyDialogOpen}
          onOpenChange={setApplyDialogOpen}
          template={selectedTemplate}
          classes={activeClasses}
          onApply={(classIds, startDate) => {
            applyTemplate.mutate({
              templateId: selectedTemplate.id,
              classIds,
              startDate,
            });
            setApplyDialogOpen(false);
          }}
          isPending={applyTemplate.isPending}
        />
      )}
    </div>
  );
};

// Sub-component for template cards
const TemplateCard = ({
  template,
  onApply,
  onDelete,
  isPublic,
}: {
  template: AssignmentTemplate;
  onApply: () => void;
  onDelete?: () => void;
  isPublic?: boolean;
}) => (
  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
    <Card className="p-4 border-border/50 bg-card/60 hover:border-primary/30 transition-all group">
      <div className="flex items-start justify-between mb-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <p className="font-semibold text-sm truncate">{template.name}</p>
            <Badge variant="outline" className={`text-[9px] shrink-0 ${TYPE_STYLES[template.template_type] || ""}`}>
              {TYPE_LABELS[template.template_type] || template.template_type}
            </Badge>
          </div>
          {template.description && (
            <p className="text-xs text-muted-foreground line-clamp-1">{template.description}</p>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-0.5">
            <BookTemplate className="w-3 h-3" /> {template.items.length} quests
          </span>
          {template.meeting_days.length > 0 && (
            <span className="flex items-center gap-0.5">
              <Clock className="w-3 h-3" /> {template.meeting_days.map(d => d.slice(0, 3)).join(", ")}
            </span>
          )}
          {template.items.length > 0 && (
            <span>
              {Math.max(...template.items.map(i => i.week_offset)) + 1} weeks
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {onDelete && (
            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={onDelete}>
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          )}
          <Button size="sm" className="h-7 text-xs gap-1 bg-gradient-primary" onClick={onApply}>
            <Play className="w-3 h-3" /> Apply
          </Button>
        </div>
      </div>
    </Card>
  </motion.div>
);
