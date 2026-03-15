import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check, ExternalLink, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ShareMenuProps {
  postId: string;
  children: React.ReactNode;
}

export const ShareMenu = ({ postId, children }: ShareMenuProps) => {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  const postUrl = `${window.location.origin}/post/${postId}`;

  const copyLink = async () => {
    await navigator.clipboard.writeText(postUrl);
    setCopied(true);
    toast.success("Link copied!");
    setTimeout(() => setCopied(false), 2000);
    setOpen(false);
  };

  const shareExternal = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: "Check out this post", url: postUrl });
      } catch { /* user cancelled */ }
    } else {
      copyLink();
    }
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-48 p-1.5" align="end">
        <button
          onClick={copyLink}
          className="flex items-center gap-2 w-full px-3 py-2 text-[13px] text-foreground rounded-md hover:bg-muted transition-colors"
        >
          {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
          {copied ? "Copied!" : "Copy link"}
        </button>
        <button
          onClick={shareExternal}
          className="flex items-center gap-2 w-full px-3 py-2 text-[13px] text-foreground rounded-md hover:bg-muted transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          Share externally
        </button>
      </PopoverContent>
    </Popover>
  );
};
