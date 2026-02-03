import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Megaphone, Send, Bell, Calendar, Clock, Users, Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";

interface CommunicationsPanelProps {
  announcements: any[] | undefined;
  sessions: any[] | undefined;
  onCreateAnnouncement: (announcement: {
    title: string;
    content: string;
    priority: string;
    is_published: boolean;
  }) => void;
  onCreateSession: (session: {
    title: string;
    description?: string;
    session_type: string;
    scheduled_at: string;
    duration_minutes: number;
  }) => void;
  isCreating: boolean;
}

export const CommunicationsPanel = ({
  announcements,
  sessions,
  onCreateAnnouncement,
  onCreateSession,
  isCreating,
}: CommunicationsPanelProps) => {
  const [announcementForm, setAnnouncementForm] = useState({
    title: "",
    content: "",
    priority: "normal",
    is_published: false,
  });

  const [sessionForm, setSessionForm] = useState({
    title: "",
    description: "",
    session_type: "webinar",
    scheduled_at: "",
    duration_minutes: 60,
  });

  const [showAnnouncementDialog, setShowAnnouncementDialog] = useState(false);
  const [showSessionDialog, setShowSessionDialog] = useState(false);

  const handleCreateAnnouncement = () => {
    onCreateAnnouncement(announcementForm);
    setAnnouncementForm({ title: "", content: "", priority: "normal", is_published: false });
    setShowAnnouncementDialog(false);
  };

  const handleCreateSession = () => {
    onCreateSession(sessionForm);
    setSessionForm({ title: "", description: "", session_type: "webinar", scheduled_at: "", duration_minutes: 60 });
    setShowSessionDialog(false);
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "urgent":
        return <Badge variant="destructive">Urgent</Badge>;
      case "high":
        return <Badge className="bg-orange-500">High</Badge>;
      case "normal":
        return <Badge variant="secondary">Normal</Badge>;
      default:
        return <Badge variant="outline">Low</Badge>;
    }
  };

  const getSessionTypeBadge = (type: string) => {
    switch (type) {
      case "webinar":
        return <Badge className="bg-blue-500">Webinar</Badge>;
      case "qa":
        return <Badge className="bg-green-500">Q&A</Badge>;
      case "workshop":
        return <Badge className="bg-purple-500">Workshop</Badge>;
      case "mentoring":
        return <Badge className="bg-orange-500">Mentoring</Badge>;
      default:
        return <Badge variant="secondary">{type}</Badge>;
    }
  };

  const getSessionStatus = (status: string, scheduledAt: string) => {
    const now = new Date();
    const scheduled = new Date(scheduledAt);

    if (status === "cancelled") return <Badge variant="destructive">Cancelled</Badge>;
    if (status === "completed") return <Badge variant="secondary">Completed</Badge>;
    if (status === "live") return <Badge className="bg-red-500 animate-pulse">Live</Badge>;
    if (scheduled < now) return <Badge variant="outline">Past</Badge>;
    return <Badge className="bg-green-500">Upcoming</Badge>;
  };

  const upcomingSessions = sessions?.filter(
    (s) => s.status === "scheduled" && new Date(s.scheduled_at) > new Date()
  ) || [];

  return (
    <Tabs defaultValue="announcements" className="space-y-4">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="announcements" className="flex items-center gap-2">
          <Megaphone className="h-4 w-4" />
          Announcements
        </TabsTrigger>
        <TabsTrigger value="sessions" className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Live Sessions
        </TabsTrigger>
      </TabsList>

      {/* Announcements Tab */}
      <TabsContent value="announcements">
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Megaphone className="h-5 w-5" />
                  Announcements
                </CardTitle>
                <CardDescription>Create and manage announcements for your students</CardDescription>
              </div>
              <Dialog open={showAnnouncementDialog} onOpenChange={setShowAnnouncementDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    New Announcement
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Create Announcement</DialogTitle>
                    <DialogDescription>
                      Create a new announcement for your students
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        value={announcementForm.title}
                        onChange={(e) =>
                          setAnnouncementForm({ ...announcementForm, title: e.target.value })
                        }
                        placeholder="Announcement title"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="content">Content</Label>
                      <Textarea
                        id="content"
                        value={announcementForm.content}
                        onChange={(e) =>
                          setAnnouncementForm({ ...announcementForm, content: e.target.value })
                        }
                        placeholder="Write your announcement..."
                        rows={4}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="priority">Priority</Label>
                      <Select
                        value={announcementForm.priority}
                        onValueChange={(value) =>
                          setAnnouncementForm({ ...announcementForm, priority: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="publish"
                        checked={announcementForm.is_published}
                        onCheckedChange={(checked) =>
                          setAnnouncementForm({ ...announcementForm, is_published: checked })
                        }
                      />
                      <Label htmlFor="publish">Publish immediately</Label>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowAnnouncementDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateAnnouncement} disabled={isCreating}>
                      {isCreating ? "Creating..." : "Create Announcement"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {announcements?.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Megaphone className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No announcements yet</p>
                <p className="text-sm">Create your first announcement to engage with students</p>
              </div>
            ) : (
              <div className="space-y-4">
                {announcements?.map((announcement) => (
                  <div
                    key={announcement.id}
                    className="p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold">{announcement.title}</h4>
                          {getPriorityBadge(announcement.priority)}
                          {announcement.is_published ? (
                            <Badge variant="outline" className="text-green-500 border-green-500">
                              Published
                            </Badge>
                          ) : (
                            <Badge variant="outline">Draft</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {announcement.content}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          Created {format(new Date(announcement.created_at), "MMM d, yyyy 'at' h:mm a")}
                        </p>
                      </div>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      {/* Live Sessions Tab */}
      <TabsContent value="sessions">
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Live Sessions
                </CardTitle>
                <CardDescription>Schedule and manage live learning sessions</CardDescription>
              </div>
              <Dialog open={showSessionDialog} onOpenChange={setShowSessionDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Schedule Session
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Schedule Live Session</DialogTitle>
                    <DialogDescription>Create a new live session for your students</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="session-title">Title</Label>
                      <Input
                        id="session-title"
                        value={sessionForm.title}
                        onChange={(e) => setSessionForm({ ...sessionForm, title: e.target.value })}
                        placeholder="Session title"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="session-description">Description (optional)</Label>
                      <Textarea
                        id="session-description"
                        value={sessionForm.description}
                        onChange={(e) =>
                          setSessionForm({ ...sessionForm, description: e.target.value })
                        }
                        placeholder="Describe what you'll cover..."
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="session-type">Type</Label>
                        <Select
                          value={sessionForm.session_type}
                          onValueChange={(value) =>
                            setSessionForm({ ...sessionForm, session_type: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="webinar">Webinar</SelectItem>
                            <SelectItem value="qa">Q&A Session</SelectItem>
                            <SelectItem value="workshop">Workshop</SelectItem>
                            <SelectItem value="mentoring">Mentoring</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="duration">Duration (minutes)</Label>
                        <Input
                          id="duration"
                          type="number"
                          value={sessionForm.duration_minutes}
                          onChange={(e) =>
                            setSessionForm({
                              ...sessionForm,
                              duration_minutes: parseInt(e.target.value) || 60,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="scheduled-at">Scheduled Date & Time</Label>
                      <Input
                        id="scheduled-at"
                        type="datetime-local"
                        value={sessionForm.scheduled_at}
                        onChange={(e) =>
                          setSessionForm({ ...sessionForm, scheduled_at: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowSessionDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateSession} disabled={isCreating}>
                      {isCreating ? "Scheduling..." : "Schedule Session"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {/* Upcoming Sessions */}
            {upcomingSessions.length > 0 && (
              <div className="mb-6">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Upcoming Sessions ({upcomingSessions.length})
                </h4>
                <div className="space-y-3">
                  {upcomingSessions.map((session) => (
                    <div
                      key={session.id}
                      className="p-4 rounded-lg border bg-primary/5 border-primary/20"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold">{session.title}</h4>
                            {getSessionTypeBadge(session.session_type)}
                            {getSessionStatus(session.status, session.scheduled_at)}
                          </div>
                          {session.description && (
                            <p className="text-sm text-muted-foreground mb-2">
                              {session.description}
                            </p>
                          )}
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {format(new Date(session.scheduled_at), "MMM d, yyyy")}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {format(new Date(session.scheduled_at), "h:mm a")}
                            </span>
                            <span>{session.duration_minutes} min</span>
                          </div>
                        </div>
                        <Button size="sm">Start Session</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* All Sessions */}
            <div>
              <h4 className="font-medium mb-3">All Sessions</h4>
              {sessions?.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No sessions scheduled</p>
                  <p className="text-sm">Schedule your first live session</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {sessions?.map((session) => (
                    <div
                      key={session.id}
                      className="p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{session.title}</h4>
                            {getSessionTypeBadge(session.session_type)}
                            {getSessionStatus(session.status, session.scheduled_at)}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>
                              {format(new Date(session.scheduled_at), "MMM d, yyyy 'at' h:mm a")}
                            </span>
                            <span>{session.duration_minutes} min</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};
