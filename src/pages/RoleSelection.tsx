import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useNeedsRoleSelection } from "@/hooks/useNeedsRoleSelection";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { BookOpen, GraduationCap, School, ArrowLeft, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import euphoriaLogo from "@/assets/euphoria-logo-button.png";

type RoleStep = "choose" | "educator-info";

const RoleSelection = () => {
  const { user } = useAuth();
  const { markRoleChosen } = useNeedsRoleSelection();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState<RoleStep>("choose");
  const [loading, setLoading] = useState(false);

  // Educator fields
  const [schoolName, setSchoolName] = useState("");
  const [subject, setSubject] = useState("");
  const [gradeLevel, setGradeLevel] = useState("");
  const [classSize, setClassSize] = useState("30");

  const handleSelectStudent = async () => {
    if (!user) return;
    setLoading(true);
    try {
      // User role is already assigned by default via handle_new_user trigger
      navigate("/app");
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectEducator = () => {
    setStep("educator-info");
  };

  const handleEducatorSubmit = async () => {
    if (!user) return;
    if (!schoolName.trim()) {
      toast({ title: "Required", description: "Please enter your school name.", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      // Update role to educator
      // First delete existing 'user' role, then insert 'educator'
      await supabase.from("user_roles").delete().eq("user_id", user.id);
      await supabase.from("user_roles").insert({ user_id: user.id, role: "educator" });

      // Create educator profile
      await supabase.from("educator_profiles").insert({
        user_id: user.id,
        school_name: schoolName.trim(),
        subject: subject.trim() || null,
        grade_level: gradeLevel.trim() || null,
        estimated_class_size: parseInt(classSize) || 30,
      });

      toast({ title: "Welcome, Educator!", description: "Your educator account is ready." });
      navigate("/app");
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background">
      <div className="absolute inset-0 bg-gradient-hero opacity-30 blur-3xl" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(262_83%_58%/0.15),transparent_50%)]" />

      <AnimatePresence mode="wait">
        {step === "choose" && (
          <motion.div
            key="choose"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, x: -60 }}
            transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="w-full max-w-lg px-4 relative z-10"
          >
            <Card className="p-8 shadow-glow border-border backdrop-blur-sm bg-card/90">
              <div className="flex items-center justify-center gap-2 mb-6">
                <img src={euphoriaLogo} alt="Euphoria" className="w-12 h-12 object-contain" />
                <h1 className="text-3xl font-bold">Euphoria</h1>
              </div>

              <h2 className="text-2xl font-bold mb-1 text-center">One last step!</h2>
              <p className="text-muted-foreground text-center mb-8 text-sm">
                Tell us how you'll use Euphoria
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={handleSelectStudent}
                  disabled={loading}
                  className="group p-6 rounded-2xl border-2 border-border hover:border-primary bg-card/50 hover:bg-primary/5 transition-all duration-300 text-left space-y-4 hover:-translate-y-1 hover:shadow-lg disabled:opacity-50"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center transition-colors">
                    <BookOpen className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-1">I'm a Student</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Practice trading, take lessons & earn XP, all risk-free
                    </p>
                  </div>
                </button>

                <button
                  onClick={handleSelectEducator}
                  disabled={loading}
                  className="group p-6 rounded-2xl border-2 border-border hover:border-accent bg-card/50 hover:bg-accent/5 transition-all duration-300 text-left space-y-4 hover:-translate-y-1 hover:shadow-lg disabled:opacity-50"
                >
                  <div className="w-12 h-12 rounded-xl bg-accent/10 group-hover:bg-accent/20 flex items-center justify-center transition-colors">
                    <GraduationCap className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-1">I'm an Educator</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Create classes, monitor progress & track students
                    </p>
                  </div>
                </button>
              </div>

              {loading && (
                <div className="flex items-center justify-center mt-4">
                  <Loader2 className="w-5 h-5 animate-spin text-primary" />
                </div>
              )}
            </Card>
          </motion.div>
        )}

        {step === "educator-info" && (
          <motion.div
            key="educator-info"
            initial={{ opacity: 0, scale: 0.95, x: 60 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.95, x: -60 }}
            transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="w-full max-w-md px-4 relative z-10"
          >
            <Card className="p-8 shadow-glow border-border backdrop-blur-sm bg-card/90">
              <button
                onClick={() => setStep("choose")}
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <School className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">School Details</h2>
                  <p className="text-sm text-muted-foreground">Tell us about your teaching</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>School / Institution *</Label>
                  <Input
                    placeholder="e.g. Lincoln High School"
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    className="bg-background/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Subject</Label>
                  <Input
                    placeholder="e.g. Economics, Business Studies"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="bg-background/50"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Grade Level</Label>
                    <Input
                      placeholder="e.g. 9-12"
                      value={gradeLevel}
                      onChange={(e) => setGradeLevel(e.target.value)}
                      className="bg-background/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Est. Class Size</Label>
                    <Input
                      type="number"
                      placeholder="30"
                      value={classSize}
                      onChange={(e) => setClassSize(e.target.value)}
                      className="bg-background/50"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleEducatorSubmit}
                  disabled={loading}
                  className="w-full bg-gradient-primary hover:opacity-90 shadow-glow mt-2"
                >
                  {loading ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Setting up...</>
                  ) : (
                    "Complete Setup"
                  )}
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RoleSelection;
