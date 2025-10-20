import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Send, ImagePlus, X, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const CATEGORIES = [
  { value: "strategy", label: "📊 Strategy", icon: "📊" },
  { value: "screenshot", label: "📸 Screenshot", icon: "📸" },
  { value: "question", label: "❓ Question", icon: "❓" },
  { value: "success", label: "🎉 Success Story", icon: "🎉" },
  { value: "discussion", label: "💬 Discussion", icon: "💬" },
  { value: "general", label: "📝 General", icon: "📝" },
];

export const CreatePostDialog = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("general");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image must be less than 5MB");
        return;
      }
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${user?.id}/${Date.now()}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from('community-posts')
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('community-posts')
      .getPublicUrl(fileName);

    return publicUrl;
  };

  const createPostMutation = useMutation({
    mutationFn: async () => {
      if (content.trim().length < 3) {
        throw new Error("Post must be at least 3 characters");
      }

      let imageUrl = null;
      let mediaType = null;

      if (selectedImage) {
        imageUrl = await uploadImage(selectedImage);
        mediaType = selectedImage.type.startsWith('video/') ? 'video' : 'image';
      }

      const { error } = await supabase
        .from("posts")
        .insert({
          user_id: user?.id,
          content: content.trim(),
          category,
          image_url: imageUrl,
          media_type: mediaType,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Post created!");
      setOpen(false);
      setContent("");
      setCategory("general");
      setSelectedImage(null);
      setImagePreview("");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create post");
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="bg-gradient-primary shadow-glow">
          <Send className="w-4 h-4 mr-2" />
          Create Post
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create a New Post</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Content</Label>
            <Textarea
              placeholder="Share your thoughts, strategies, or questions..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              maxLength={2000}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground text-right">
              {content.length}/2000
            </p>
          </div>

          {imagePreview && (
            <div className="relative rounded-lg overflow-hidden border">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full max-h-[300px] object-cover"
              />
              <Button
                size="icon"
                variant="destructive"
                className="absolute top-2 right-2"
                onClick={() => {
                  setSelectedImage(null);
                  setImagePreview("");
                }}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => document.getElementById('post-image-upload')?.click()}
              className="flex-1"
            >
              <ImagePlus className="w-4 h-4 mr-2" />
              {selectedImage ? "Change Image" : "Add Image"}
            </Button>
            <input
              id="post-image-upload"
              type="file"
              accept="image/*,video/*"
              onChange={handleImageSelect}
              className="hidden"
            />
          </div>

          <Button
            onClick={() => createPostMutation.mutate()}
            disabled={!content.trim() || content.trim().length < 3 || createPostMutation.isPending}
            className="w-full bg-gradient-primary"
            size="lg"
          >
            {createPostMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Posting...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Post to Community
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};