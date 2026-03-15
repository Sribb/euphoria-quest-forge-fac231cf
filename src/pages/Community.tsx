import { useState, useEffect } from "react";
import { IMessageChat } from "@/features/community/components/IMessageChat";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  MessageSquare, Heart, Send, Plus, Users, Image as ImageIcon,
  Loader2, Smile, GraduationCap, Copy, Trash2, UserMinus
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEducatorRole } from "@/features/educator/hooks/useEducatorRole";
import { useClassManagement } from "@/features/educator/hooks/useClassManagement";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { formatDistanceToNow } from "date-fns";

interface CommunityProps {
  onNavigate: (tab: string) => void;
}

const Community = ({ onNavigate }: CommunityProps) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [newPostContent, setNewPostContent] = useState("");
  const [classCode, setClassCode] = useState("");
  const [newClassName, setNewClassName] = useState("");
  const [newClassDesc, setNewClassDesc] = useState("");
  const [newClassMax, setNewClassMax] = useState("");
  const [showCreateClass, setShowCreateClass] = useState(false);
  const { hasEducatorAccess } = useEducatorRole();
  const { classes, isLoading: classesLoading, createClass, deleteClass, removeStudent } = useClassManagement();

  // Fetch posts
  const { data: posts, isLoading: postsLoading } = useQuery({
    queryKey: ["community-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*, profiles(display_name, avatar_url)")
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data;
    },
  });

  // Fetch user's likes
  const { data: userLikes } = useQuery({
    queryKey: ["user-likes", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("likes")
        .select("post_id")
        .eq("user_id", user?.id!);
      if (error) throw error;
      return new Set(data.map((l) => l.post_id));
    },
    enabled: !!user?.id,
  });


  // Fetch student's joined classes
  const { data: studentClasses } = useQuery({
    queryKey: ["student-classes", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data: memberships, error } = await supabase
        .from("class_members")
        .select("id, class_id, joined_at")
        .eq("student_id", user.id);
      if (error) throw error;
      if (!memberships || memberships.length === 0) return [];

      const classIds = memberships.map((m) => m.class_id);
      const { data: classesData } = await supabase
        .from("classes")
        .select("id, class_name, description")
        .in("id", classIds);

      return (classesData || []).map((cls) => {
        const membership = memberships.find((m) => m.class_id === cls.id);
        return { ...cls, membership_id: membership?.id, joined_at: membership?.joined_at };
      });
    },
    enabled: !!user?.id && !hasEducatorAccess,
  });

  // Join class mutation
  const joinClassMutation = useMutation({
    mutationFn: async (code: string) => {
      if (!user?.id) throw new Error("Not authenticated");
      const { data: cls, error: findError } = await supabase
        .from("classes")
        .select("id, class_name, max_students")
        .eq("class_code", code.toUpperCase())
        .single();
      if (findError || !cls) throw new Error("Invalid class code");

      // Check if already joined
      const { data: existing } = await supabase
        .from("class_members")
        .select("id")
        .eq("class_id", cls.id)
        .eq("student_id", user.id);
      if (existing && existing.length > 0) throw new Error("Already in this class");

      const { error } = await supabase.from("class_members").insert({
        class_id: cls.id,
        student_id: user.id,
      });
      if (error) throw error;
      return cls.class_name;
    },
    onSuccess: (name) => {
      setClassCode("");
      queryClient.invalidateQueries({ queryKey: ["student-classes"] });
      toast.success(`Joined "${name}" successfully!`);
    },
    onError: (err) => toast.error(err.message),
  });

  // Leave class mutation
  const leaveClassMutation = useMutation({
    mutationFn: async (membershipId: string) => {
      const { error } = await supabase.from("class_members").delete().eq("id", membershipId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student-classes"] });
      toast.success("Left class");
    },
    onError: () => toast.error("Failed to leave class"),
  });

  // Create post
  const createPostMutation = useMutation({
    mutationFn: async () => {
      if (!newPostContent.trim()) return;
      const { error } = await supabase.from("posts").insert({
        user_id: user?.id!,
        content: newPostContent.trim(),
        category: "general",
      });
      if (error) throw error;
    },
    onSuccess: () => {
      setNewPostContent("");
      queryClient.invalidateQueries({ queryKey: ["community-posts"] });
      toast.success("Post shared!");
    },
    onError: () => toast.error("Failed to create post"),
  });

  // Like/unlike
  const toggleLikeMutation = useMutation({
    mutationFn: async (postId: string) => {
      const liked = userLikes?.has(postId);
      if (liked) {
        await supabase.from("likes").delete().eq("post_id", postId).eq("user_id", user?.id!);
      } else {
        await supabase.from("likes").insert({ post_id: postId, user_id: user?.id! });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-likes"] });
      queryClient.invalidateQueries({ queryKey: ["community-posts"] });
    },
  });


  return (
    <div className="space-y-4 pt-2 pb-20">
      <div className="flex items-center gap-3 animate-fade-in">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
          <Users className="w-5 h-5 md:w-6 md:h-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl md:text-2xl font-bold">Community</h1>
          <p className="text-sm text-muted-foreground">Connect, discuss & grow together</p>
        </div>
      </div>

      <Tabs defaultValue="feed" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="feed" className="text-xs md:text-sm">
            <MessageSquare className="w-4 h-4 mr-1" /> Feed
          </TabsTrigger>
          <TabsTrigger value="dms" className="text-xs md:text-sm">
            <Send className="w-4 h-4 mr-1" /> Messages
          </TabsTrigger>
          <TabsTrigger value="classes" className="text-xs md:text-sm">
            <GraduationCap className="w-4 h-4 mr-1" /> Classes
          </TabsTrigger>
        </TabsList>

        {/* Feed Tab */}
        <TabsContent value="feed" className="space-y-4">
          {/* New Post */}
          <Card className="p-4 border-border">
            <div className="flex gap-3">
              <Avatar className="w-10 h-10">
                <AvatarFallback className="bg-primary/20 text-primary font-bold">
                  {user?.email?.[0]?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-3">
                <Input
                  placeholder="Share a thought, insight, or question..."
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  className="bg-background/50 border-border"
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && createPostMutation.mutate()}
                />
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="text-muted-foreground">
                      <ImageIcon className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-muted-foreground">
                      <Smile className="w-4 h-4" />
                    </Button>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => createPostMutation.mutate()}
                    disabled={!newPostContent.trim() || createPostMutation.isPending}
                    className="bg-gradient-primary shadow-glow"
                  >
                    {createPostMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Post"}
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Posts */}
          {postsLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <AnimatePresence>
              {posts?.map((post: any, i: number) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card className="p-4 border-border hover:border-primary/30 transition-colors">
                    <div className="flex gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback
                          className="font-bold text-white"
                          style={{ backgroundColor: post.profiles?.avatar_url || "#9b87f5" }}
                        >
                          {post.profiles?.display_name?.[0]?.toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold truncate">
                            {post.profiles?.display_name || "Anonymous"}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                          </span>
                          {post.category && post.category !== "general" && (
                            <Badge variant="outline" className="text-[10px]">
                              {post.category}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{post.content}</p>
                        {post.image_url && (
                          <img
                            src={post.image_url}
                            alt="Post"
                            className="mt-3 rounded-lg max-h-64 object-cover w-full"
                          />
                        )}
                        <div className="flex items-center gap-4 mt-3">
                          <button
                            onClick={() => toggleLikeMutation.mutate(post.id)}
                            className={`flex items-center gap-1 text-sm transition-colors ${
                              userLikes?.has(post.id) ? "text-destructive" : "text-muted-foreground hover:text-destructive"
                            }`}
                          >
                            <Heart className={`w-4 h-4 ${userLikes?.has(post.id) ? "fill-current" : ""}`} />
                            {post.likes_count || 0}
                          </button>
                          <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors">
                            <MessageSquare className="w-4 h-4" />
                            {post.comments_count || 0}
                          </button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          )}

          {posts?.length === 0 && !postsLoading && (
            <Card className="p-12 text-center border-border">
              <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No posts yet</h3>
              <p className="text-muted-foreground">Be the first to share something!</p>
            </Card>
          )}
        </TabsContent>

        {/* DMs Tab */}
        <TabsContent value="dms">
          <IMessageChat />
        </TabsContent>

        {/* Classes Tab */}
        <TabsContent value="classes" className="space-y-4">
          {hasEducatorAccess ? (
            /* ── Educator View ── */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Your Classes</h3>
                <Dialog open={showCreateClass} onOpenChange={setShowCreateClass}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="bg-gradient-primary shadow-glow">
                      <Plus className="w-4 h-4 mr-1" /> Create Class
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create a New Class</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-2">
                      <div>
                        <Label>Class Name</Label>
                        <Input value={newClassName} onChange={(e) => setNewClassName(e.target.value)} placeholder="e.g. Finance 101" className="mt-1" />
                      </div>
                      <div>
                        <Label>Description (optional)</Label>
                        <Textarea value={newClassDesc} onChange={(e) => setNewClassDesc(e.target.value)} placeholder="Brief description..." className="mt-1" rows={2} />
                      </div>
                      <div>
                        <Label>Max Students (optional)</Label>
                        <Input value={newClassMax} onChange={(e) => setNewClassMax(e.target.value)} placeholder="e.g. 30" type="number" className="mt-1" />
                      </div>
                      <Button
                        className="w-full bg-gradient-primary shadow-glow"
                        disabled={!newClassName.trim() || createClass.isPending}
                        onClick={() => {
                          createClass.mutate(
                            { className: newClassName, description: newClassDesc || undefined, maxStudents: newClassMax ? parseInt(newClassMax) : undefined },
                            { onSuccess: () => { setShowCreateClass(false); setNewClassName(""); setNewClassDesc(""); setNewClassMax(""); } }
                          );
                        }}
                      >
                        {createClass.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                        Create Class
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {classesLoading ? (
                <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
              ) : classes.length === 0 ? (
                <Card className="p-12 text-center border-border">
                  <GraduationCap className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No classes yet</h3>
                  <p className="text-muted-foreground mb-4">Create a class and share the code with your students</p>
                </Card>
              ) : (
                <div className="space-y-4">
                  {classes.map((cls) => (
                    <Card key={cls.id} className="p-4 border-border">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-lg">{cls.class_name}</h4>
                          {cls.description && <p className="text-sm text-muted-foreground">{cls.description}</p>}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              navigator.clipboard.writeText(cls.class_code);
                              toast.success("Class code copied!");
                            }}
                          >
                            <Copy className="w-4 h-4 mr-1" />
                            {cls.class_code}
                          </Button>
                          <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => deleteClass.mutate(cls.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="outline"><Users className="w-3 h-3 mr-1" />{cls.member_count} students</Badge>
                        {cls.max_students && <Badge variant="outline">Max: {cls.max_students}</Badge>}
                      </div>
                      {cls.members.length > 0 && (
                        <div className="border-t border-border pt-3 space-y-2">
                          {cls.members.map((member) => (
                            <div key={member.id} className="flex items-center justify-between py-1.5">
                              <div className="flex items-center gap-2">
                                <Avatar className="w-7 h-7">
                                  <AvatarFallback className="text-xs bg-primary/20 text-primary font-bold">
                                    {member.display_name?.[0]?.toUpperCase() || "S"}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-sm font-medium">{member.display_name || "Student"}</span>
                                <Badge variant="outline" className="text-[10px]">Lvl {member.level}</Badge>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="text-xs text-muted-foreground">{member.lessons_completed} lessons • {member.avg_quiz_score}% avg</span>
                                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => removeStudent.mutate({ memberId: member.id, studentId: member.student_id, studentName: member.display_name || "Student", classId: cls.id, className: cls.class_name })}>
                                  <UserMinus className="w-3.5 h-3.5" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* ── Student View ── */
            <div className="space-y-4">
              <Card className="p-6 border-border">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-primary" />
                  Join a Class
                </h3>
                <p className="text-sm text-muted-foreground mb-4">Enter the 6-character code provided by your teacher</p>
                <div className="flex gap-2">
                  <Input
                    placeholder="e.g. ABC123"
                    value={classCode}
                    onChange={(e) => setClassCode(e.target.value.toUpperCase())}
                    maxLength={6}
                    className="font-mono text-lg tracking-widest uppercase"
                  />
                  <Button
                    onClick={() => joinClassMutation.mutate(classCode)}
                    disabled={classCode.length !== 6 || joinClassMutation.isPending}
                    className="bg-gradient-primary shadow-glow"
                  >
                    {joinClassMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Join"}
                  </Button>
                </div>
              </Card>

              <h3 className="font-semibold">Your Classes</h3>
              {!studentClasses || studentClasses.length === 0 ? (
                <Card className="p-12 text-center border-border">
                  <GraduationCap className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No classes joined</h3>
                  <p className="text-muted-foreground">Ask your teacher for a class code to get started</p>
                </Card>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {studentClasses.map((cls: any) => (
                    <Card key={cls.id} className="p-4 border-border hover:border-primary/30 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                            <GraduationCap className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-semibold">{cls.class_name}</h4>
                            <p className="text-xs text-muted-foreground">{cls.description || "No description"}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => leaveClassMutation.mutate(cls.membership_id)}>
                          <UserMinus className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Community;
