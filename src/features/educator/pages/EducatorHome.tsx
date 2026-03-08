import { useState } from "react";
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
  Clock, Zap, Target, ChevronRight, UserCheck, AlertTriangle, ShieldCheck
} from "lucide-react";
import { useClassManagement, ClassWithMembers, ClassMember } from "../hooks/useClassManagement";
import { RosterImportDialog } from "../roster-import/RosterImportDialog";
import { ConsentManagementPanel } from "../components/ConsentManagementPanel";
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

const StudentRow = ({ member, onRemove }: { member: ClassMember; onRemove: () => void }) => {
  const isStruggling = member.avg_quiz_score > 0 && member.avg_quiz_score < 50;
  const isExcelling = member.avg_quiz_score >= 80;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      className="group flex items-center gap-3 p-3 rounded-xl bg-muted/20 border border-border/50 hover:border-primary/30 hover:bg-muted/40 transition-all duration-300"
    >
      <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center ring-2 ring-primary/20 shrink-0">
        <span className="text-sm font-bold text-primary-foreground">
          {(member.display_name || "S")[0].toUpperCase()}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-semibold text-sm truncate">{member.display_name || "Student"}</p>
          {isStruggling && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <AlertTriangle className="w-3.5 h-3.5 text-warning" />
                </TooltipTrigger>
                <TooltipContent><p>Needs attention — low quiz scores</p></TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          {isExcelling && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Trophy className="w-3.5 h-3.5 text-warning" />
                </TooltipTrigger>
                <TooltipContent><p>Top performer!</p></TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
          <span className="flex items-center gap-1">
            <Zap className="w-3 h-3" />
            Lv.{member.level}
          </span>
          <span>{member.experience_points.toLocaleString()} XP</span>
          <span>{member.lessons_completed} lessons</span>
        </div>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <div className="text-right hidden sm:block">
          <p className={`text-sm font-bold ${isExcelling ? 'text-success' : isStruggling ? 'text-warning' : 'text-foreground'}`}>
            {member.avg_quiz_score}%
          </p>
          <p className="text-[10px] text-muted-foreground">avg score</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="w-7 h-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-all"
          onClick={onRemove}
        >
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      </div>
    </motion.div>
  );
};

export const EducatorHome = ({ onNavigate }: EducatorHomeProps) => {
  const { classes, isLoading, createClass, deleteClass, removeStudent } = useClassManagement();
  const { stats, isLoading: statsLoading } = useEducatorData();
  const [selectedClass, setSelectedClass] = useState<ClassWithMembers | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newClassName, setNewClassName] = useState("");
  const [newClassDescription, setNewClassDescription] = useState("");
  const [newClassMaxStudents, setNewClassMaxStudents] = useState("30");
  const [newClassGradeLevel, setNewClassGradeLevel] = useState("");
  const [newClassUnder13, setNewClassUnder13] = useState(false);

  const COPPA_GRADES = ["k", "1st", "2nd", "3rd", "4th", "5th", "6th", "7th"];
  const ALL_GRADES = ["K", "1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th", "11th", "12th"];
  const isCoppaGrade = newClassGradeLevel ? COPPA_GRADES.includes(newClassGradeLevel.toLowerCase()) : false;

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
    });
    setNewClassName("");
    setNewClassDescription("");
    setNewClassMaxStudents("30");
    setNewClassGradeLevel("");
    setNewClassUnder13(false);
    setCreateDialogOpen(false);
  };

  const copyClassCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success(`Class code "${code}" copied!`);
  };

  const totalStudents = classes.reduce((acc, c) => acc + c.member_count, 0);

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
              {classes.length} {classes.length === 1 ? 'class' : 'classes'} · {totalStudents} {totalStudents === 1 ? 'student' : 'students'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <RosterImportDialog />
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
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
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
                      Enables COPPA parental consent workflow. Parents must consent before student data is collected.
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
        <KPICard
          label="Total Classes"
          value={classes.length}
          icon={School}
          gradient="bg-gradient-primary"
        />
        <KPICard
          label="Total Students"
          value={totalStudents}
          icon={Users}
          gradient="bg-gradient-success"
        />
        <KPICard
          label="Avg Completion"
          value={`${stats?.avg_lesson_completion || 0}%`}
          icon={Target}
          gradient="bg-gradient-gold"
          subtitle={`${stats?.total_lessons_completed || 0} total lessons`}
        />
        <KPICard
          label="Avg Quiz Score"
          value={`${stats?.avg_quiz_score || 0}%`}
          icon={Trophy}
          gradient="bg-gradient-primary"
          subtitle={`${stats?.active_users_7d || 0} active this week`}
        />
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Class List — Sidebar */}
          <div className="lg:col-span-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Your Classes</h3>
              <Badge variant="secondary" className="text-[10px]">{classes.length}</Badge>
            </div>
            <div className="space-y-2">
              {classes.map((cls, i) => {
                const isSelected = activeClass?.id === cls.id;
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
                      }`}
                      onClick={() => setSelectedClass(cls)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <h4 className="font-bold text-sm truncate">{cls.class_name}</h4>
                            {cls.requires_coppa_consent && (
                              <Badge variant="outline" className="text-[9px] px-1.5 py-0 border-warning/40 text-warning shrink-0">
                                COPPA
                              </Badge>
                            )}
                          </div>
                          {cls.description && (
                            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{cls.description}</p>
                          )}
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
                    {/* Class Header */}
                    <div className="p-6 border-b border-border/50 bg-gradient-hero">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-xl font-bold">{activeClass.class_name}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {activeClass.description || "No description provided"}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
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

                    {/* Student List */}
                    <div className="p-6">
                      {activeClass.members.length === 0 ? (
                        <div className="text-center py-12">
                          <div className="w-14 h-14 rounded-2xl bg-muted/30 flex items-center justify-center mx-auto mb-4">
                            <Users className="w-7 h-7 text-muted-foreground" />
                          </div>
                          <h4 className="font-semibold mb-1">No Students Yet</h4>
                          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                            Share the class code <code className="font-mono text-primary font-bold">{activeClass.class_code}</code> with your students to get started.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Students</h4>
                            <span className="text-xs text-muted-foreground">{activeClass.members.length} enrolled</span>
                          </div>
                          <AnimatePresence>
                            {activeClass.members.map((member) => (
                              <StudentRow
                                key={member.id}
                                member={member}
                                onRemove={() => removeStudent.mutate(member.id)}
                              />
                            ))}
                          </AnimatePresence>
                        </div>
                      )}

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
      )}
    </div>
  );
};
