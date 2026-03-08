import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  GraduationCap, Plus, Copy, Users, BookOpen, Trophy, 
  TrendingUp, Trash2, BarChart3, School, Sparkles, 
  Clock, Zap, Target, ChevronRight, UserCheck, AlertTriangle, ShieldCheck,
  Settings, Archive, ArchiveRestore, Palette, Filter
} from "lucide-react";
import { useClassManagement, ClassWithMembers, ClassMember } from "../hooks/useClassManagement";
import { RosterImportDialog } from "../roster-import/RosterImportDialog";
import { ConsentManagementPanel } from "../components/ConsentManagementPanel";
import { ClassEditDialog } from "../components/ClassEditDialog";
import { RosterManagementPanel } from "../components/RosterManagementPanel";
import { AssignmentsPanel } from "../components/AssignmentsPanel";
import { TemplatesPanel } from "../components/TemplatesPanel";
import { useEducatorData } from "../hooks/useEducatorData";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface EducatorHomeProps {
  onNavigate: (tab: string) => void;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

const CLASS_COLORS = [
  "#6366f1", "#8b5cf6", "#ec4899", "#f43f5e",
  "#f97316", "#eab308", "#22c55e", "#14b8a6",
  "#06b6d4", "#3b82f6", "#64748b", "#78716c",
];

const PERIODS = ["1st Period", "2nd Period", "3rd Period", "4th Period", "5th Period", "6th Period", "7th Period", "8th Period", "Block A", "Block B", "Block C", "Block D", "Homeroom", "Advisory"];

const KPICard = ({ label, value, icon: Icon, gradient, subtitle }: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  gradient: string;
  subtitle?: string;
}) => (
  <motion.div variants={item}>
    <Card className="relative overflow-hidden border-border/50 bg-card/60 backdrop-blur-xl hover-lift group">
      <div className={`absolute inset-0 opacity-[0.07] group-hover:opacity-[0.12] transition-opacity duration-500 ${gradient}`} />
      <div className="relative p-5">
        <div className="flex items-center justify-between mb-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${gradient} shadow-lg`}>
            <Icon className="w-5 h-5 text-primary-foreground" />
          </div>
          <Sparkles className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary/60 transition-colors" />
        </div>
        <p className="text-2xl md:text-3xl font-bold tracking-tight">{value}</p>
        <p className="text-xs text-muted-foreground mt-1 font-medium uppercase tracking-wider">{label}</p>
        {subtitle && <p className="text-xs text-muted-foreground/70 mt-0.5">{subtitle}</p>}
      </div>
    </Card>
  </motion.div>
);


export const EducatorHome = ({ onNavigate }: EducatorHomeProps) => {
  const { classes, isLoading, createClass, updateClass, archiveClass, deleteClass, removeStudent } = useClassManagement();
  const queryClient = useQueryClient();
  const { stats, isLoading: statsLoading } = useEducatorData();
  const [selectedClass, setSelectedClass] = useState<ClassWithMembers | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const [filterPeriod, setFilterPeriod] = useState<string>("all");
  const [newClassName, setNewClassName] = useState("");
  const [newClassDescription, setNewClassDescription] = useState("");
  const [newClassMaxStudents, setNewClassMaxStudents] = useState("30");
  const [newClassGradeLevel, setNewClassGradeLevel] = useState("");
  const [newClassUnder13, setNewClassUnder13] = useState(false);
  const [newClassPeriod, setNewClassPeriod] = useState("");
  const [newClassColor, setNewClassColor] = useState("#6366f1");

  const COPPA_GRADES = ["k", "1st", "2nd", "3rd", "4th", "5th", "6th", "7th"];
  const ALL_GRADES = ["K", "1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th", "11th", "12th"];
  const isCoppaGrade = newClassGradeLevel ? COPPA_GRADES.includes(newClassGradeLevel.toLowerCase()) : false;

  // Filter classes
  const activeClasses = classes.filter(c => !c.archived_at);
  const archivedClasses = classes.filter(c => !!c.archived_at);
  const displayClasses = showArchived ? archivedClasses : activeClasses;
  const filteredClasses = filterPeriod === "all"
    ? displayClasses
    : displayClasses.filter(c => c.period_block === filterPeriod);

  // Unique periods for filter
  const usedPeriods = [...new Set(classes.map(c => c.period_block).filter(Boolean))] as string[];

  const handleCreateClass = async () => {
    if (!newClassName.trim()) {
      toast.error("Please enter a class name");
      return;
    }
    await createClass.mutateAsync({
      className: newClassName,
      description: newClassDescription || undefined,
      maxStudents: parseInt(newClassMaxStudents) || undefined,
      gradeLevel: newClassGradeLevel || undefined,
      requiresCoppaConsent: newClassUnder13,
      periodBlock: newClassPeriod || undefined,
      displayColor: newClassColor,
    });
    setNewClassName("");
    setNewClassDescription("");
    setNewClassMaxStudents("30");
    setNewClassGradeLevel("");
    setNewClassUnder13(false);
    setNewClassPeriod("");
    setNewClassColor("#6366f1");
    setCreateDialogOpen(false);
  };

  const copyClassCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success(`Class code "${code}" copied!`);
  };

  const totalStudents = activeClasses.reduce((acc, c) => acc + c.member_count, 0);

  // Keep selected class in sync
  const activeClass = selectedClass 
    ? classes.find(c => c.id === selectedClass.id) || selectedClass 
    : null;

  return (
    <div className="space-y-8 py-6">
      {/* Hero Header */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow">
            <GraduationCap className="w-7 h-7 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Educator Hub</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {activeClasses.length} {activeClasses.length === 1 ? 'class' : 'classes'} · {totalStudents} {totalStudents === 1 ? 'student' : 'students'}
              {archivedClasses.length > 0 && ` · ${archivedClasses.length} archived`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <RosterImportDialog />
          <Button
            variant="outline"
            className="gap-2 border-border/50"
            onClick={() => onNavigate("educator-data-deletion")}
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">Data Deletion</span>
          </Button>
          <Button
            variant="outline"
            className="gap-2 border-border/50"
            onClick={() => onNavigate("educator-lti")}
          >
            <School className="w-4 h-4" />
            <span className="hidden sm:inline">Canvas LTI</span>
          </Button>
          <Button
            variant="outline"
            className="gap-2 border-border/50"
            onClick={() => onNavigate("educator-analytics")}
          >
            <BarChart3 className="w-4 h-4" />
            <span className="hidden sm:inline">Analytics</span>
          </Button>
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary shadow-glow gap-2 font-semibold">
                <Plus className="w-4 h-4" />
                New Class
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <School className="w-5 h-5 text-primary" />
                  Create New Class
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-2">
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground">Class Name *</Label>
                  <Input
                    placeholder="e.g. Personal Finance 101"
                    value={newClassName}
                    onChange={(e) => setNewClassName(e.target.value)}
                    className="bg-muted/30 border-border/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground">Description</Label>
                  <Textarea
                    placeholder="Brief description of the class..."
                    value={newClassDescription}
                    onChange={(e) => setNewClassDescription(e.target.value)}
                    className="bg-muted/30 border-border/50 resize-none"
                    rows={2}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-wider text-muted-foreground">Period / Block</Label>
                    <Select value={newClassPeriod} onValueChange={setNewClassPeriod}>
                      <SelectTrigger className="bg-muted/30 border-border/50">
                        <SelectValue placeholder="Select period" />
                      </SelectTrigger>
                      <SelectContent>
                        {PERIODS.map((p) => (
                          <SelectItem key={p} value={p}>{p}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-wider text-muted-foreground">Grade Level</Label>
                    <Select value={newClassGradeLevel} onValueChange={setNewClassGradeLevel}>
                      <SelectTrigger className="bg-muted/30 border-border/50">
                        <SelectValue placeholder="Select grade" />
                      </SelectTrigger>
                      <SelectContent>
                        {ALL_GRADES.map((g) => (
                          <SelectItem key={g} value={g}>{g} Grade</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground">Max Students</Label>
                  <Input
                    type="number"
                    placeholder="30"
                    value={newClassMaxStudents}
                    onChange={(e) => setNewClassMaxStudents(e.target.value)}
                    className="bg-muted/30 border-border/50"
                  />
                </div>
                {/* Color picker */}
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5" /> Class Color
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {CLASS_COLORS.map((color) => (
                      <button
                        key={color}
                        className={`w-7 h-7 rounded-lg transition-all duration-200 ${newClassColor === color ? "ring-2 ring-offset-2 ring-offset-background ring-primary scale-110" : "hover:scale-105"}`}
                        style={{ backgroundColor: color }}
                        onClick={() => setNewClassColor(color)}
                      />
                    ))}
                  </div>
                </div>
                {isCoppaGrade && (
                  <div className="p-3 rounded-lg bg-warning/10 border border-warning/30 flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 text-warning mt-0.5 shrink-0" />
                    <p className="text-xs text-warning">
                      Grade {newClassGradeLevel} typically includes students under 13. COPPA parental consent will be required for students in this class.
                    </p>
                  </div>
                )}
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/20 border border-border/30">
                  <Checkbox
                    id="under13"
                    checked={newClassUnder13 || isCoppaGrade}
                    disabled={isCoppaGrade}
                    onCheckedChange={(checked) => setNewClassUnder13(checked === true)}
                  />
                  <div>
                    <label htmlFor="under13" className="text-sm font-medium cursor-pointer">
                      This class contains students under 13
                    </label>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Enables COPPA parental consent workflow.
                    </p>
                  </div>
                </div>
                <Button
                  onClick={handleCreateClass}
                  disabled={createClass.isPending}
                  className="w-full bg-gradient-primary shadow-glow font-semibold h-11"
                >
                  {createClass.isPending ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                      Creating...
                    </div>
                  ) : "Create Class"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>

      {/* KPI Grid */}
      <motion.div 
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <KPICard label="Total Classes" value={activeClasses.length} icon={School} gradient="bg-gradient-primary" />
        <KPICard label="Total Students" value={totalStudents} icon={Users} gradient="bg-gradient-success" />
        <KPICard label="Avg Completion" value={`${stats?.avg_lesson_completion || 0}%`} icon={Target} gradient="bg-gradient-gold" subtitle={`${stats?.total_lessons_completed || 0} total lessons`} />
        <KPICard label="Avg Quiz Score" value={`${stats?.avg_quiz_score || 0}%`} icon={Trophy} gradient="bg-gradient-primary" subtitle={`${stats?.active_users_7d || 0} active this week`} />
      </motion.div>

      {/* Main Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-muted-foreground">Loading your classes...</p>
          </div>
        </div>
      ) : classes.length === 0 ? (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <Card className="p-12 md:p-16 text-center border-dashed border-2 border-border/50 bg-card/40 backdrop-blur-sm">
            <div className="w-16 h-16 rounded-2xl bg-gradient-primary/10 flex items-center justify-center mx-auto mb-5">
              <School className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Create Your First Class</h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              Create a class and share the unique code with your students. You'll be able to track their progress, quiz scores, and engagement in real-time.
            </p>
            <Button onClick={() => setCreateDialogOpen(true)} className="bg-gradient-primary shadow-glow gap-2 h-11 px-6 font-semibold">
              <Plus className="w-4 h-4" />
              Create First Class
            </Button>
          </Card>
        </motion.div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Class List — Sidebar */}
            <div className="lg:col-span-4 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                  {showArchived ? "Archived Classes" : "Your Classes"}
                </h3>
                <div className="flex items-center gap-1.5">
                  {archivedClasses.length > 0 && (
                    <Button
                      variant={showArchived ? "secondary" : "ghost"}
                      size="sm"
                      className="h-7 text-xs gap-1 px-2"
                      onClick={() => { setShowArchived(!showArchived); setSelectedClass(null); }}
                    >
                      <Archive className="w-3 h-3" />
                      {archivedClasses.length}
                    </Button>
                  )}
                  {usedPeriods.length > 0 && (
                    <Select value={filterPeriod} onValueChange={setFilterPeriod}>
                      <SelectTrigger className="h-7 text-xs w-auto gap-1 px-2 border-border/50">
                        <Filter className="w-3 h-3" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Periods</SelectItem>
                        {usedPeriods.map(p => (
                          <SelectItem key={p} value={p}>{p}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  <Badge variant="secondary" className="text-[10px]">{filteredClasses.length}</Badge>
                </div>
              </div>
              <div className="space-y-2">
                {filteredClasses.map((cls, i) => {
                  const isSelected = activeClass?.id === cls.id;
                  const color = cls.display_color || "#6366f1";
                  return (
                    <motion.div
                      key={cls.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Card
                        className={`p-4 cursor-pointer transition-all duration-300 border-border/50 hover:border-primary/40 group ${
                          isSelected 
                            ? "border-primary/60 bg-primary/5 shadow-glow-soft" 
                            : "bg-card/50 backdrop-blur-sm hover:bg-card/80"
                        } ${cls.archived_at ? "opacity-70" : ""}`}
                        onClick={() => setSelectedClass(cls)}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2.5 flex-1 min-w-0">
                            <div className="w-3 h-8 rounded-full shrink-0" style={{ backgroundColor: color }} />
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <h4 className="font-bold text-sm truncate">{cls.class_name}</h4>
                                {cls.requires_coppa_consent && (
                                  <Badge variant="outline" className="text-[9px] px-1.5 py-0 border-warning/40 text-warning shrink-0">
                                    COPPA
                                  </Badge>
                                )}
                                {cls.archived_at && (
                                  <Badge variant="outline" className="text-[9px] px-1.5 py-0 shrink-0">
                                    Archived
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-2 mt-0.5">
                                {cls.period_block && (
                                  <span className="text-[10px] text-muted-foreground font-medium">{cls.period_block}</span>
                                )}
                                {cls.grade_level && (
                                  <span className="text-[10px] text-muted-foreground">{cls.grade_level} Grade</span>
                                )}
                              </div>
                            </div>
                          </div>
                          <ChevronRight className={`w-4 h-4 text-muted-foreground shrink-0 mt-0.5 transition-transform duration-300 ${isSelected ? 'rotate-90 text-primary' : 'group-hover:translate-x-0.5'}`} />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <button
                              className="flex items-center gap-1 bg-muted/50 hover:bg-muted px-2 py-1 rounded-md transition-colors"
                              onClick={(e) => { e.stopPropagation(); copyClassCode(cls.class_code); }}
                            >
                              <code className="text-[11px] font-mono font-bold text-primary">{cls.class_code}</code>
                              <Copy className="w-3 h-3 text-muted-foreground" />
                            </button>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <UserCheck className="w-3.5 h-3.5" />
                            <span className="font-medium">{cls.member_count}</span>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
                {filteredClasses.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    {showArchived ? "No archived classes" : "No classes match this filter"}
                  </p>
                )}
              </div>
            </div>

            {/* Class Detail Panel */}
            <div className="lg:col-span-8">
              <AnimatePresence mode="wait">
                {activeClass ? (
                  <motion.div
                    key={activeClass.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.25 }}
                  >
                    <Card className="border-border/50 bg-card/60 backdrop-blur-xl overflow-hidden">
                      {/* Class Header with color accent */}
                      <div className="relative">
                        <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: activeClass.display_color || "#6366f1" }} />
                        <div className="p-6 border-b border-border/50 bg-gradient-hero pt-7">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="text-xl font-bold">{activeClass.class_name}</h3>
                                {activeClass.period_block && (
                                  <Badge variant="secondary" className="text-[10px]">{activeClass.period_block}</Badge>
                                )}
                                {activeClass.archived_at && (
                                  <Badge variant="outline" className="text-[10px]">Archived</Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                {activeClass.description || "No description provided"}
                              </p>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <button
                                className="flex items-center gap-2 bg-muted/40 hover:bg-muted/70 px-3 py-2 rounded-lg transition-colors"
                                onClick={() => copyClassCode(activeClass.class_code)}
                              >
                                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Code</span>
                                <code className="font-mono font-bold text-primary text-sm">{activeClass.class_code}</code>
                                <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                              </button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-muted-foreground hover:text-primary hover:bg-primary/10"
                                onClick={() => setEditDialogOpen(true)}
                              >
                                <Settings className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-muted-foreground hover:text-primary hover:bg-primary/10"
                                onClick={() => {
                                  archiveClass.mutate({ classId: activeClass.id, archive: !activeClass.archived_at });
                                }}
                              >
                                {activeClass.archived_at ? <ArchiveRestore className="w-4 h-4" /> : <Archive className="w-4 h-4" />}
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                onClick={() => {
                                  deleteClass.mutate(activeClass.id);
                                  setSelectedClass(null);
                                }}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>

                          {/* Quick Stats */}
                          {activeClass.members.length > 0 && (
                            <div className="flex items-center gap-6 mt-4 pt-4 border-t border-border/30">
                              <div>
                                <p className="text-lg font-bold">{activeClass.members.length}</p>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Students</p>
                              </div>
                              <div>
                                <p className="text-lg font-bold">
                                  {Math.round(activeClass.members.reduce((a, m) => a + m.lessons_completed, 0) / activeClass.members.length)}
                                </p>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Avg Lessons</p>
                              </div>
                              <div>
                                <p className="text-lg font-bold">
                                  {Math.round(activeClass.members.reduce((a, m) => a + m.avg_quiz_score, 0) / activeClass.members.length)}%
                                </p>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Avg Score</p>
                              </div>
                              <div>
                                <p className="text-lg font-bold">
                                  Lv.{Math.round(activeClass.members.reduce((a, m) => a + m.level, 0) / activeClass.members.length)}
                                </p>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Avg Level</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Roster Management */}
                      <div className="p-6">
                        <RosterManagementPanel
                          activeClass={activeClass}
                          allClasses={classes}
                          onRemoveStudent={(params) => removeStudent.mutate(params)}
                          onRefresh={() => queryClient.invalidateQueries({ queryKey: ["educator-classes"] })}
                        />

                        {/* COPPA Consent Panel */}
                        {activeClass.requires_coppa_consent && activeClass.members.length > 0 && (
                          <div className="mt-6 pt-6 border-t border-border/50">
                            <ConsentManagementPanel
                              classId={activeClass.id}
                              className={activeClass.class_name}
                              members={activeClass.members}
                            />
                          </div>
                        )}
                      </div>
                    </Card>

                    {/* Edit Dialog */}
                    <ClassEditDialog
                      cls={activeClass}
                      open={editDialogOpen}
                      onOpenChange={setEditDialogOpen}
                      onSave={(classId, updates) => updateClass.mutate({ classId, updates })}
                      isPending={updateClass.isPending}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center justify-center h-80 lg:h-96"
                  >
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-2xl bg-muted/20 flex items-center justify-center mx-auto mb-4">
                        <BarChart3 className="w-8 h-8 text-muted-foreground/50" />
                      </div>
                      <h4 className="font-semibold text-muted-foreground mb-1">Select a Class</h4>
                      <p className="text-sm text-muted-foreground/70">Choose a class to view student details and analytics</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Assignments Panel */}
          <div className="mt-6">
            <AssignmentsPanel classes={classes} />
          </div>

          {/* Templates & Pacing Guides */}
          <div className="mt-6">
            <TemplatesPanel classes={classes} />
          </div>
        </>
      )}
    </div>
  );
};
