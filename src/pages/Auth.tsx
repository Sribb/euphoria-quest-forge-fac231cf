import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Loader2, GraduationCap, BookOpen, ArrowLeft, School, Users, BookMarked } from "lucide-react";
import euphoriaLogo from "@/assets/euphoria-logo-button.png";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";

const authSchema = z.object({
  email: z.string().email("Invalid email format").max(255, "Email too long"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password too long")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[0-9]/, "Must contain at least one number"),
});

type SignupRole = "student" | "educator" | null;
type AuthStep = "choose-role" | "form" | "educator-info";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [signupRole, setSignupRole] = useState<SignupRole>(null);
  const [loginRole, setLoginRole] = useState<"student" | "educator">("student");
  const [authStep, setAuthStep] = useState<AuthStep>("form");
  
  // Educator info
  const [schoolName, setSchoolName] = useState("");
  const [subject, setSubject] = useState("");
  const [gradeLevel, setGradeLevel] = useState("");
  const [classSize, setClassSize] = useState("30");

  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get("signup") === "true") {
      handleStartSignup();
    }
  }, []);

  const handleStartSignup = () => {
    setIsLogin(false);
    setAuthStep("choose-role");
  };

  const handleRoleSelect = (role: SignupRole) => {
    setSignupRole(role);
    if (role === "educator") {
      setAuthStep("educator-info");
    } else {
      setAuthStep("form");
    }
  };

  const handleEducatorInfoNext = () => {
    if (!schoolName.trim()) {
      toast({ title: "Required", description: "Please enter your school name.", variant: "destructive" });
      return;
    }
    setAuthStep("form");
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const validation = authSchema.safeParse({ email, password });
      if (!validation.success) {
        throw new Error(validation.error.errors[0].message);
      }

      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email: validation.data.email,
          password: validation.data.password,
        });
        if (error) throw error;
        toast({ title: "Welcome back!", description: "Successfully signed in." });
        navigate("/app");
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: validation.data.email,
          password: validation.data.password,
          options: {
            emailRedirectTo: `${window.location.origin}/app`,
            data: {
              display_name: signupRole === "educator" ? `Prof. ${email.split("@")[0]}` : undefined,
              signup_role: signupRole || "student",
            },
          },
        });
        if (error) throw error;

        // If educator, create educator profile
        if (signupRole === "educator" && data.user) {
          await supabase.from("educator_profiles").insert({
            user_id: data.user.id,
            school_name: schoolName,
            subject: subject || null,
            grade_level: gradeLevel || null,
            estimated_class_size: parseInt(classSize) || 30,
          });
        }

        toast({
          title: "Account created!",
          description: signupRole === "educator"
            ? "Welcome, educator! Set up your premium plan to create classes."
            : "Welcome to Euphoria. Start your learning journey!",
        });
        navigate("/app");
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const resetToLogin = () => {
    setIsLogin(true);
    setAuthStep("form");
    setSignupRole(null);
    setSchoolName("");
    setSubject("");
    setGradeLevel("");
    setClassSize("30");
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background">
      <div className="absolute inset-0 bg-gradient-hero opacity-30 blur-3xl" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(262_83%_58%/0.15),transparent_50%)]" />

      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 z-10 text-foreground/80 hover:text-foreground transition-colors flex items-center gap-2"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Home
      </button>

      <AnimatePresence mode="wait">
        {/* Role Selection */}
        {!isLogin && authStep === "choose-role" && (
          <motion.div
            key="choose-role"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, x: -60 }}
            transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="w-full max-w-lg px-4 relative z-10"
          >
            <Card className="p-8 shadow-glow border-border backdrop-blur-sm bg-card/90">
              <div className="flex items-center justify-center gap-2 mb-8">
                <img src={euphoriaLogo} alt="Euphoria" className="w-12 h-12 object-contain" />
                 <h1 className="text-3xl font-bold">Euphoria</h1>
              </div>

              <h2 className="text-2xl font-bold mb-1 text-center">Join as...</h2>
              <p className="text-muted-foreground text-center mb-8 text-sm">Pick your path — you can always explore later</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={() => handleRoleSelect("student")}
                  className="group p-6 rounded-2xl border-2 border-border hover:border-primary bg-card/50 hover:bg-primary/5 transition-all duration-300 text-left space-y-4 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center transition-colors">
                    <BookOpen className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-1">Student</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Practice trading, take lessons & earn XP, all risk-free
                    </p>
                  </div>
                  <ul className="space-y-1.5 pt-1">
                    <li className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="w-1 h-1 rounded-full bg-primary flex-shrink-0" />AI market simulator
                    </li>
                    <li className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="w-1 h-1 rounded-full bg-primary flex-shrink-0" />25+ interactive lessons
                    </li>
                    <li className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="w-1 h-1 rounded-full bg-primary flex-shrink-0" />Games & achievements
                    </li>
                  </ul>
                </button>

                <button
                  onClick={() => handleRoleSelect("educator")}
                  className="group p-6 rounded-2xl border-2 border-border hover:border-accent bg-card/50 hover:bg-accent/5 transition-all duration-300 text-left space-y-4 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="w-12 h-12 rounded-xl bg-accent/10 group-hover:bg-accent/20 flex items-center justify-center transition-colors">
                    <GraduationCap className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-1">Educator</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Create classes, monitor progress & identify struggling students
                    </p>
                  </div>
                  <ul className="space-y-1.5 pt-1">
                    <li className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="w-1 h-1 rounded-full bg-accent flex-shrink-0" />Class codes & rosters
                    </li>
                    <li className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="w-1 h-1 rounded-full bg-accent flex-shrink-0" />Real-time analytics
                    </li>
                    <li className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="w-1 h-1 rounded-full bg-accent flex-shrink-0" />Struggling student alerts
                    </li>
                  </ul>
                </button>
              </div>

              <div className="mt-6 text-center">
                <button onClick={resetToLogin} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Already have an account? Sign in
                </button>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Educator Info */}
        {!isLogin && authStep === "educator-info" && (
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
                onClick={() => setAuthStep("choose-role")}
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
                  <Label htmlFor="schoolName">School / Institution *</Label>
                  <Input
                    id="schoolName"
                    placeholder="e.g. Lincoln High School"
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    className="bg-background/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    placeholder="e.g. Economics, Business Studies"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="bg-background/50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="gradeLevel">Grade Level</Label>
                    <Input
                      id="gradeLevel"
                      placeholder="e.g. 9-12"
                      value={gradeLevel}
                      onChange={(e) => setGradeLevel(e.target.value)}
                      className="bg-background/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="classSize">Est. Class Size</Label>
                    <Input
                      id="classSize"
                      type="number"
                      placeholder="30"
                      value={classSize}
                      onChange={(e) => setClassSize(e.target.value)}
                      className="bg-background/50"
                    />
                  </div>
                </div>

                <Button onClick={handleEducatorInfoNext} className="w-full bg-gradient-primary hover:opacity-90 shadow-glow mt-2">
                  Continue to Create Account
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Login / Final Signup Form */}
        {(isLogin || authStep === "form") && (
          <motion.div
            key="auth-form"
            initial={{ opacity: 0, scale: 0.95, x: 60 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.95, x: -60 }}
            transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="w-full max-w-md px-4 relative z-10"
          >
            <Card className={`p-8 shadow-glow border-border backdrop-blur-sm bg-card/90 relative overflow-hidden ${
              !isLogin && signupRole === "educator" ? "border-t-2 border-t-accent" : ""
            }`}>
              {/* Educator accent stripe */}
              {!isLogin && signupRole === "educator" && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary" />
              )}

              {!isLogin && (
                <button
                  onClick={() => setAuthStep(signupRole === "educator" ? "educator-info" : "choose-role")}
                  className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
              )}

              <div className="flex items-center justify-center gap-2 mb-8">
                {!isLogin && signupRole === "educator" ? (
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <GraduationCap className="w-7 h-7 text-white" />
                  </div>
                ) : (
                  <img src={euphoriaLogo} alt="Euphoria" className="w-12 h-12 object-contain" />
                )}
                <h1 className="text-3xl font-bold">Euphoria</h1>
              </div>

              {isLogin && (
                <div className="flex rounded-lg border border-border overflow-hidden mb-6">
                  <button
                    type="button"
                    onClick={() => setLoginRole("student")}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-all ${
                      loginRole === "student"
                        ? "bg-primary text-primary-foreground shadow-glow"
                        : "bg-card/50 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <BookOpen className="w-4 h-4" />
                    Student
                  </button>
                  <button
                    type="button"
                    onClick={() => setLoginRole("educator")}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-all ${
                      loginRole === "educator"
                        ? "bg-primary text-primary-foreground shadow-glow"
                        : "bg-card/50 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <GraduationCap className="w-4 h-4" />
                    Educator
                  </button>
                </div>
              )}

              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">
                  {isLogin
                    ? loginRole === "educator" ? "Welcome back, Educator!" : "Welcome back!"
                    : `Create ${signupRole === "educator" ? "educator" : "student"} account`}
                </h2>
                <p className="text-muted-foreground">
                  {isLogin
                    ? loginRole === "educator"
                      ? "Sign in to manage your classes"
                      : "Sign in to continue your learning journey"
                    : signupRole === "educator"
                    ? "You're signing up as an educator"
                    : "Create an account to start learning"}
                </p>
                {!isLogin && signupRole === "educator" && (
                  <div className="mt-2 flex items-center gap-2 text-xs text-primary bg-primary/10 px-3 py-2 rounded-lg">
                    <School className="w-4 h-4" />
                    {schoolName}
                  </div>
                )}
              </div>

              <form onSubmit={handleAuth} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                    className="bg-background/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                    minLength={8}
                    className="bg-background/50"
                  />
                </div>

                <Button type="submit" className="w-full bg-gradient-primary hover:opacity-90 shadow-glow" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {isLogin ? "Signing in..." : "Creating account..."}
                    </>
                  ) : (
                    <>{isLogin ? "Sign in" : "Create account"}</>
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <button
                  onClick={isLogin ? handleStartSignup : resetToLogin}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  disabled={loading}
                >
                  {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                </button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Auth;
