import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { 
  GraduationCap, Plus, Copy, Users, BookOpen, Trophy, 
  TrendingUp, Trash2, BarChart3, School, Sparkles
} from "lucide-react";
import { useClassManagement, ClassWithMembers } from "../hooks/useClassManagement";
import { useEducatorData } from "../hooks/useEducatorData";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface EducatorHomeProps {
  onNavigate: (tab: string) => void;
}

export const EducatorHome = ({ onNavigate }: EducatorHomeProps) => {
  const { classes, isLoading, createClass, deleteClass, removeStudent } = useClassManagement();
  const { stats, isLoading: statsLoading } = useEducatorData();
  const [selectedClass, setSelectedClass] = useState<ClassWithMembers | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newClassName, setNewClassName] = useState("");
  const [newClassDescription, setNewClassDescription] = useState("");
  const [newClassMaxStudents, setNewClassMaxStudents] = useState("30");

  const handleCreateClass = async () => {
    if (!newClassName.trim()) {
      toast.error("Please enter a class name");
      return;
    }
    await createClass.mutateAsync({
      className: newClassName,
      description: newClassDescription || undefined,
      maxStudents: parseInt(newClassMaxStudents) || undefined,
    });
    setNewClassName("");
    setNewClassDescription("");
    setNewClassMaxStudents("30");
    setCreateDialogOpen(false);
  };

  const copyClassCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success(`Code "${code}" copied to clipboard!`);
  };

  return (
    <div className="space-y-6 py-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Educator Dashboard</h1>
            <p className="text-sm text-muted-foreground">Manage your classes and track student progress</p>
          </div>
        </div>
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary shadow-glow gap-2">
              <Plus className="w-4 h-4" />
              Create Class
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Class</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Class Name *</Label>
                <Input
                  placeholder="e.g. Personal Finance 101"
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  placeholder="Brief description of the class"
                  value={newClassDescription}
                  onChange={(e) => setNewClassDescription(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Max Students</Label>
                <Input
                  type="number"
                  placeholder="30"
                  value={newClassMaxStudents}
                  onChange={(e) => setNewClassMaxStudents(e.target.value)}
                />
              </div>
              <Button
                onClick={handleCreateClass}
                disabled={createClass.isPending}
                className="w-full bg-gradient-primary shadow-glow"
              >
                {createClass.isPending ? "Creating..." : "Create Class"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Classes", value: classes.length, icon: School, color: "text-primary" },
          { label: "Total Students", value: classes.reduce((acc, c) => acc + c.member_count, 0), icon: Users, color: "text-emerald-500" },
          { label: "Avg Completion", value: `${stats?.avg_lesson_completion || 0}%`, icon: TrendingUp, color: "text-amber-500" },
          { label: "Avg Quiz Score", value: `${stats?.avg_quiz_score || 0}%`, icon: Trophy, color: "text-primary" },
        ].map((kpi, i) => (
          <Card key={i} className="p-4 border-border bg-card/80 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-2">
              <kpi.icon className={`w-4 h-4 ${kpi.color}`} />
              <span className="text-xs text-muted-foreground">{kpi.label}</span>
            </div>
            <p className="text-2xl font-bold">{kpi.value}</p>
          </Card>
        ))}
      </div>

      {/* Classes */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : classes.length === 0 ? (
        <Card className="p-12 text-center border-dashed border-2 border-border bg-card/50">
          <School className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No Classes Yet</h3>
          <p className="text-muted-foreground mb-4">Create your first class and share the code with students</p>
          <Button onClick={() => setCreateDialogOpen(true)} className="bg-gradient-primary shadow-glow gap-2">
            <Plus className="w-4 h-4" />
            Create First Class
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Class List */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Your Classes</h3>
            {classes.map((cls) => (
              <motion.div key={cls.id} layout>
                <Card
                  className={`p-4 cursor-pointer transition-all border-border hover:border-primary/50 ${
                    selectedClass?.id === cls.id ? "border-primary bg-primary/5" : "bg-card/80"
                  }`}
                  onClick={() => setSelectedClass(cls)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold truncate">{cls.class_name}</h4>
                    <Badge variant="secondary" className="shrink-0">{cls.member_count} students</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="text-xs bg-muted px-2 py-1 rounded font-mono text-primary">{cls.class_code}</code>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-6 h-6"
                      onClick={(e) => { e.stopPropagation(); copyClassCode(cls.class_code); }}
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                  {cls.description && (
                    <p className="text-xs text-muted-foreground mt-2 truncate">{cls.description}</p>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Selected Class Detail */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {selectedClass ? (
                <motion.div
                  key={selectedClass.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <Card className="p-6 border-border bg-card/80 backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-xl font-bold">{selectedClass.class_name}</h3>
                        <p className="text-sm text-muted-foreground">{selectedClass.description || "No description"}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 bg-muted px-3 py-2 rounded-lg">
                          <span className="text-xs text-muted-foreground">Code:</span>
                          <code className="font-mono font-bold text-primary">{selectedClass.class_code}</code>
                          <Button variant="ghost" size="icon" className="w-6 h-6" onClick={() => copyClassCode(selectedClass.class_code)}>
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:bg-destructive/10"
                          onClick={() => {
                            deleteClass.mutate(selectedClass.id);
                            setSelectedClass(null);
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {selectedClass.members.length === 0 ? (
                      <div className="text-center py-8">
                        <Users className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
                        <p className="text-muted-foreground">No students yet. Share the class code to get started!</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>{selectedClass.members.length} Students</span>
                          <span>Avg Score: {Math.round(selectedClass.members.reduce((a, m) => a + m.avg_quiz_score, 0) / selectedClass.members.length || 0)}%</span>
                        </div>
                        <div className="space-y-2">
                          {selectedClass.members.map((member) => (
                            <div
                              key={member.id}
                              className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
                                  <span className="text-xs font-bold text-white">
                                    {(member.display_name || "S")[0].toUpperCase()}
                                  </span>
                                </div>
                                <div>
                                  <p className="font-medium text-sm">{member.display_name || "Student"}</p>
                                  <p className="text-xs text-muted-foreground">Level {member.level} · {member.experience_points} XP</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                <div className="text-right">
                                  <p className="text-sm font-semibold">{member.lessons_completed} lessons</p>
                                  <p className="text-xs text-muted-foreground">Avg: {member.avg_quiz_score}%</p>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="w-7 h-7 text-destructive hover:bg-destructive/10"
                                  onClick={() => removeStudent.mutate(member.id)}
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </Card>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-center h-64"
                >
                  <div className="text-center">
                    <BarChart3 className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
                    <p className="text-muted-foreground">Select a class to view details</p>
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
