import { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

const EMOJI_CATEGORIES: { label: string; icon: string; emojis: string[] }[] = [
  {
    label: "Smileys",
    icon: "😀",
    emojis: ["😀","😃","😄","😁","😆","😅","🤣","😂","🙂","😊","😇","🥰","😍","🤩","😘","😗","😚","😙","🥲","😋","😛","😜","🤪","😝","🤑","🤗","🤭","🤫","🤔","🫡","🤐","🤨","😐","😑","😶","🫥","😏","😒","🙄","😬","🤥","😌","😔","😪","🤤","😴","😷","🤒","🤕","🤢","🤮","🥴","😵","🤯","🥳","🥸","😎","🤓","🧐"],
  },
  {
    label: "Gestures",
    icon: "👋",
    emojis: ["👋","🤚","🖐️","✋","🖖","🫱","🫲","🫳","🫴","👌","🤌","🤏","✌️","🤞","🫰","🤟","🤘","🤙","👈","👉","👆","🖕","👇","☝️","🫵","👍","👎","✊","👊","🤛","🤜","👏","🙌","🫶","👐","🤲","🤝","🙏","💪","🦾"],
  },
  {
    label: "Hearts",
    icon: "❤️",
    emojis: ["❤️","🧡","💛","💚","💙","💜","🖤","🤍","🤎","💔","❤️‍🔥","❤️‍🩹","❣️","💕","💞","💓","💗","💖","💘","💝","💟","♥️","🫀"],
  },
  {
    label: "Animals",
    icon: "🐶",
    emojis: ["🐶","🐱","🐭","🐹","🐰","🦊","🐻","🐼","🐻‍❄️","🐨","🐯","🦁","🐮","🐷","🐸","🐵","🙈","🙉","🙊","🐒","🐔","🐧","🐦","🐤","🦆","🦅","🦉","🦇","🐺","🐗","🐴","🦄","🐝","🪱","🐛","🦋","🐌","🐞"],
  },
  {
    label: "Food",
    icon: "🍕",
    emojis: ["🍎","🍐","🍊","🍋","🍌","🍉","🍇","🍓","🫐","🍈","🍒","🍑","🥭","🍍","🥥","🥝","🍅","🥑","🍕","🍔","🍟","🌭","🍿","🧁","🍰","🎂","🍩","🍪","🍫","🍬","☕","🍵","🧃","🥤","🍺","🍷"],
  },
  {
    label: "Objects",
    icon: "💡",
    emojis: ["⌚","📱","💻","⌨️","🖥️","🖨️","🖱️","💿","📀","🎮","🕹️","🔋","🔌","💡","🔦","📷","📹","🎥","📺","📻","🎵","🎶","🎤","🎧","📚","📖","✏️","📝","📌","📎","🔑","🔒","💰","💎","🏆","🎯","🎲"],
  },
  {
    label: "Symbols",
    icon: "✅",
    emojis: ["✅","❌","⭕","💯","🔥","⚡","💥","✨","🌟","⭐","💫","🎉","🎊","🏁","🚩","🔔","💬","💭","🗯️","♻️","⚠️","🚫","❗","❓","‼️","⁉️","🆗","🆒","🆕","🔝","➡️","⬅️","⬆️","⬇️","↩️","🔄"],
  },
];

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
  onClose: () => void;
}

export const EmojiPicker = ({ onSelect, onClose }: EmojiPickerProps) => {
  const [activeCategory, setActiveCategory] = useState(0);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  const filtered = search.trim()
    ? EMOJI_CATEGORIES.flatMap(c => c.emojis)
    : EMOJI_CATEGORIES[activeCategory].emojis;

  return (
    <div
      ref={ref}
      className="absolute bottom-full right-0 mb-2 w-[300px] max-h-[340px] rounded-xl border border-border/30 bg-card/95 backdrop-blur-xl shadow-lg shadow-black/15 overflow-hidden z-50 flex flex-col"
    >
      {/* Search */}
      <div className="px-3 pt-3 pb-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/50" />
          <input
            type="text"
            placeholder="Search emojis..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-8 pl-8 pr-3 rounded-lg bg-muted/40 border-0 text-xs text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary/30"
          />
        </div>
      </div>

      {/* Category tabs */}
      {!search.trim() && (
        <div className="flex px-2 gap-0.5 pb-1">
          {EMOJI_CATEGORIES.map((cat, i) => (
            <button
              key={cat.label}
              onClick={() => setActiveCategory(i)}
              className={cn(
                "flex-1 py-1.5 text-center text-base rounded-md transition-colors cursor-pointer",
                i === activeCategory ? "bg-primary/10" : "hover:bg-muted/30"
              )}
              title={cat.label}
            >
              {cat.icon}
            </button>
          ))}
        </div>
      )}

      {/* Emoji grid */}
      <div className="flex-1 overflow-y-auto px-2 pb-2 scrollbar-hide">
        {!search.trim() && (
          <p className="text-[10px] font-medium text-muted-foreground/50 uppercase tracking-wider px-1 py-1">
            {EMOJI_CATEGORIES[activeCategory].label}
          </p>
        )}
        <div className="grid grid-cols-8 gap-0.5">
          {filtered.map((emoji, i) => (
            <button
              key={`${emoji}-${i}`}
              onClick={() => {
                onSelect(emoji);
                onClose();
              }}
              className="w-8 h-8 flex items-center justify-center text-xl rounded-md hover:bg-muted/40 transition-colors cursor-pointer"
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
