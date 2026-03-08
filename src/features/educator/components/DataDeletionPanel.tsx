import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Trash2, ShieldAlert, FileText, Clock, CheckCircle2, XCircle,
  Download, AlertTriangle, Users, ChevronLeft
} from "lucide-react";
import { useDataDeletion, DeletionRequest } from "../hooks/useDataDeletion";
import { useClassManagement, ClassWithMembers } from "../hooks/useClassManagement";
import { useAuth } from "@/hooks/useAuth";
import { generateDeletionCertificate } from "../utils/generateDeletionCertificate";
import { motion, AnimatePresence } from "framer-motion";
import { format, formatDistanceToNow } from "date-fns";

interface DataDeletionPanelProps {
  onBack: () => void;
}

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  pending: { label: "Pending", color: "bg-warning/20 text-warning", icon: Clock },
  purged: { label: "Purged", color: "bg-success/20 text-success", icon: CheckCircle2 },
  cancelled: { label: "Cancelled", color: "bg-muted text-muted-foreground", icon: XCircle },
};

export const DataDeletionPanel = ({ onBack }: DataDeletionPanelProps) => {
  const { user } = useAuth();
  const { requests, isLoading, createRequest, createBulkRequests, cancelRequest, pendingCount, purgedCount } = useDataDeletion();
  const { classes } = useClassManagement();
  const [bulkDialogOpen, setBulkDialogOpen] = useState(false);
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [bulkReason, setBulkReason] = useState("End-of-year data purge");
  const [selectAll, setSelectAll] = useState(false);
  const [individualDialogOpen, setIndividualDialogOpen] = useState(false);
  const [selectedClassForIndividual, setSelectedClassForIndividual] = useState<string>("");
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [individualReason, setIndividualReason] = useState("");

  const educatorName = user?.user_metadata?.display_name || "Educator";

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    setSelectedClasses(checked ? classes.map((c) => c.id) : []);
  };

  const toggleClass = (classId: string) => {
    setSelectedClasses((prev) =>
      prev.includes(classId) ? prev.filter((id) => id !== classId) : [...prev, classId]
    );
  };

  const handleBulkDelete = () => {
    const students = classes
      .filter((c) => selectedClasses.includes(c.id))
      .flatMap((c) =>
        c.members.map((m) => ({
          studentId: m.student_id,
          studentName: m.display_name || "Student",
          classId: c.id,
          className: c.class_name,
        }))
      );

    if (students.length === 0) return;

    createBulkRequests.mutate({ students, reason: bulkReason });
    setBulkDialogOpen(false);
    setSelectedClasses([]);
    setSelectAll(false);
    setBulkReason("End-of-year data purge");
  };

  const selectedClass = classes.find((c) => c.id === selectedClassForIndividual);
  const selectedStudent = selectedClass?.members.find((m) => m.student_id === selectedStudentId);

  const handleIndividualDelete = () => {
    if (!selectedStudent || !selectedClass) return;
    createRequest.mutate({
      studentId: selectedStudent.student_id,
      studentName: selectedStudent.display_name || "Student",
      classId: selectedClass.id,
      className: selectedClass.class_name,
      deletionType: "individual",
      reason: individualReason || undefined,
    });
    setIndividualDialogOpen(false);
    setSelectedClassForIndividual("");
    setSelectedStudentId("");
    setIndividualReason("");
  };

  const totalBulkStudents = classes
    .filter((c) => selectedClasses.includes(c.id))
    .reduce((acc, c) => acc + c.members.length, 0);

  return (
    <div className="space-y-6 py-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack} className="shrink-0">
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-destructive/20 flex items-center justify-center">
            <ShieldAlert className="w-6 h-6 text-destructive" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight">Data Deletion Management</h1>
            <p className="text-xs text-muted-foreground">FERPA & COPPA compliant student data removal</p>
          </div>
        </div>
      </motion.div>

      {/* KPI Strip */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Pending", value: pendingCount, icon: Clock, color: "text-warning" },
          { label: "Completed", value: purgedCount, icon: CheckCircle2, color: "text-success" },
          { label: "Total Requests", value: requests.length, icon: FileText, color: "text-primary" },
        ].map((s, i) => (
          <Card key={i} className="p-4 border-border/50 bg-card/60 backdrop-blur-xl">
            <div className="flex items-center gap-2 mb-1">
              <s.icon className={`w-3.5 h-3.5 ${s.color}`} />
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">{s.label}</span>
            </div>
            <p className="text-xl font-bold">{s.value}</p>
          </Card>
        ))}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        {/* Individual Deletion */}
        <Dialog open={individualDialogOpen} onOpenChange={setIndividualDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="gap-2 border-border/50">
              <Trash2 className="w-4 h-4" />
              Delete Individual Student Data
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Trash2 className="w-5 h-5 text-destructive" />
                Delete Student Data
              </DialogTitle>
              <DialogDescription>
                Select a student whose data you want to delete. Data will be permanently removed after a 30-day grace period.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Class</label>
                <Select value={selectedClassForIndividual} onValueChange={(v) => { setSelectedClassForIndividual(v); setSelectedStudentId(""); }}>
                  <SelectTrigger className="bg-muted/30 border-border/50">
                    <SelectValue placeholder="Select a class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.class_name} ({c.member_count} students)</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedClass && (
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Student</label>
                  <Select value={selectedStudentId} onValueChange={setSelectedStudentId}>
                    <SelectTrigger className="bg-muted/30 border-border/50">
                      <SelectValue placeholder="Select a student" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedClass.members.map((m) => (
                        <SelectItem key={m.student_id} value={m.student_id}>{m.display_name || "Student"}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Reason (optional)</label>
                <Textarea
                  placeholder="e.g., Student transferred to another school"
                  value={individualReason}
                  onChange={(e) => setIndividualReason(e.target.value)}
                  className="bg-muted/30 border-border/50 resize-none"
                  rows={2}
                />
              </div>

              {selectedStudent && (
                <div className="p-3 rounded-lg bg-warning/10 border border-warning/30 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-warning mt-0.5 shrink-0" />
                  <p className="text-xs text-warning">
                    All data for <strong>{selectedStudent.display_name}</strong> will be permanently deleted after 30 days. This includes lesson progress, quiz scores, game data, messages, and portfolio data.
                  </p>
                </div>
              )}

              <Button
                onClick={handleIndividualDelete}
                disabled={!selectedStudentId || createRequest.isPending}
                className="w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground"
              >
                {createRequest.isPending ? "Creating..." : "Schedule Deletion"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Bulk Deletion */}
        <Dialog open={bulkDialogOpen} onOpenChange={setBulkDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="gap-2 border-border/50">
              <Users className="w-4 h-4" />
              End-of-Year Bulk Deletion
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-destructive" />
                End-of-Year Bulk Data Deletion
              </DialogTitle>
              <DialogDescription>
                Select classes to purge all student data. Each student's data will be permanently removed after a 30-day grace period.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/20 border border-border/30">
                <Checkbox
                  id="selectAll"
                  checked={selectAll}
                  onCheckedChange={(checked) => handleSelectAll(checked === true)}
                />
                <label htmlFor="selectAll" className="text-sm font-medium cursor-pointer">
                  Select all classes
                </label>
              </div>

              <div className="space-y-2 max-h-[200px] overflow-y-auto">
                {classes.map((cls) => (
                  <div key={cls.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/10 border border-border/20">
                    <Checkbox
                      checked={selectedClasses.includes(cls.id)}
                      onCheckedChange={() => toggleClass(cls.id)}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{cls.class_name}</p>
                      <p className="text-xs text-muted-foreground">{cls.member_count} students{cls.grade_level ? ` · ${cls.grade_level} Grade` : ""}</p>
                    </div>
                  </div>
                ))}
                {classes.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">No classes found.</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Reason</label>
                <Textarea
                  value={bulkReason}
                  onChange={(e) => setBulkReason(e.target.value)}
                  className="bg-muted/30 border-border/50 resize-none"
                  rows={2}
                />
              </div>

              {totalBulkStudents > 0 && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
                  <p className="text-xs text-destructive">
                    This will schedule deletion for <strong>{totalBulkStudents}</strong> student records across{" "}
                    <strong>{selectedClasses.length}</strong> classes. All data will be permanently removed after 30 days.
                  </p>
                </div>
              )}

              <Button
                onClick={handleBulkDelete}
                disabled={selectedClasses.length === 0 || createBulkRequests.isPending}
                className="w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground"
              >
                {createBulkRequests.isPending ? "Creating..." : `Schedule Deletion (${totalBulkStudents} students)`}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Request History */}
      <Card className="border-border/50 bg-card/60 backdrop-blur-xl overflow-hidden">
        <div className="p-4 border-b border-border/50 flex items-center justify-between">
          <h3 className="text-sm font-semibold">Deletion Request History</h3>
          <Badge variant="secondary" className="text-[10px]">{requests.length}</Badge>
        </div>

        {isLoading ? (
          <div className="p-12 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : requests.length === 0 ? (
          <div className="p-12 text-center">
            <ShieldAlert className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No deletion requests yet.</p>
            <p className="text-xs text-muted-foreground/60 mt-1">
              Use the buttons above to schedule student data deletion.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border/30">
            <AnimatePresence>
              {requests.map((req) => {
                const config = statusConfig[req.status] || statusConfig.pending;
                const StatusIcon = config.icon;
                return (
                  <motion.div
                    key={req.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-3 p-4 hover:bg-muted/10 transition-colors"
                  >
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${config.color}`}>
                      <StatusIcon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium truncate">{req.student_name}</p>
                        <Badge variant="outline" className="text-[10px] shrink-0">
                          {req.deletion_type}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                        {req.class_name && <span>{req.class_name}</span>}
                        <span>·</span>
                        <span>Requested {formatDistanceToNow(new Date(req.requested_at), { addSuffix: true })}</span>
                        {req.status === "pending" && (
                          <>
                            <span>·</span>
                            <span>Purge on {format(new Date(req.scheduled_purge_at), "MMM d, yyyy")}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {/* Download Certificate */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-8 h-8"
                        title="Download deletion certificate"
                        onClick={() => generateDeletionCertificate(req, educatorName)}
                      >
                        <Download className="w-4 h-4" />
                      </Button>

                      {/* Cancel (only for pending) */}
                      {req.status === "pending" && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="w-8 h-8 text-muted-foreground hover:text-destructive">
                              <XCircle className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Cancel Deletion Request?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will cancel the scheduled data deletion for {req.student_name}. Their data will be preserved.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Keep Request</AlertDialogCancel>
                              <AlertDialogAction onClick={() => cancelRequest.mutate(req.id)}>
                                Cancel Deletion
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </Card>

      {/* Info Footer */}
      <div className="p-4 rounded-xl bg-muted/20 border border-border/30">
        <p className="text-xs text-muted-foreground leading-relaxed">
          <strong className="text-foreground">30-Day Grace Period:</strong> All deletion requests include a 30-day grace period during which you can cancel the request and preserve the data. After 30 days, data is permanently and irreversibly deleted from all systems. Download a Deletion Certificate for your compliance records at any time.
        </p>
      </div>
    </div>
  );
};
