import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ChevronDown, ChevronUp, Send } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

interface NoteFormProps {
  onAdd: (text: string, author: string) => void;
}

export default function NoteForm({ onAdd }: NoteFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState("");
  const [author, setAuthor] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) {
      toast.error("Please write something sweet first 💌");
      return;
    }
    onAdd(trimmed, author.trim() || "Your Love");
    setText("");
    setAuthor("");
    setSubmitted(true);
    setIsOpen(false);
    toast.success("Your love note has been added! 💕");
    setTimeout(() => setSubmitted(false), 2000);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-3xl overflow-hidden shadow-card"
      aria-label="Add a new love note"
      data-ocid="add_note.form"
    >
      {/* Toggle button */}
      <button
        type="button"
        onClick={() => setIsOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-3 px-6 py-5 min-h-0 text-left transition-colors"
        style={{
          background: isOpen ? "oklch(0.96 0.04 340)" : "oklch(0.97 0.025 355)",
          borderBottom: isOpen ? "1.5px solid oklch(0.88 0.05 340)" : "none",
        }}
        aria-expanded={isOpen}
        aria-controls="add-note-form-panel"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl" aria-hidden="true">
            💌
          </span>
          <div>
            <p className="font-display text-lg font-bold text-foreground leading-tight">
              Write a Love Note
            </p>
            <p className="text-sm text-muted-foreground mt-0.5">
              Add your own sweet message
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {submitted && (
            <span className="text-sm font-semibold text-primary animate-fade-in">
              Sent! 💕
            </span>
          )}
          <span
            className="w-8 h-8 min-h-0 flex items-center justify-center rounded-full border border-border bg-card/70 text-muted-foreground"
            aria-hidden="true"
          >
            {isOpen ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </span>
        </div>
      </button>

      {/* Form panel */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id="add-note-form-panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: "hidden" }}
          >
            <form
              onSubmit={handleSubmit}
              className="px-6 pt-5 pb-6 space-y-4"
              style={{ background: "oklch(0.98 0.01 355)" }}
            >
              {/* Message textarea */}
              <div className="space-y-2">
                <label
                  htmlFor="love-note-text"
                  className="text-sm font-semibold text-foreground"
                >
                  Your sweet message ✍️
                </label>
                <Textarea
                  id="love-note-text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Write something sweet, heartfelt, and full of love... 💕"
                  className="min-h-[120px] resize-none rounded-2xl border-border bg-card text-foreground placeholder:text-muted-foreground text-base leading-relaxed focus-visible:ring-ring"
                  maxLength={600}
                  aria-describedby="love-note-char-count"
                  data-ocid="add_note.textarea"
                />
                <p
                  id="love-note-char-count"
                  className="text-xs text-muted-foreground text-right"
                  aria-live="polite"
                >
                  {text.length}/600
                </p>
              </div>

              {/* Author input */}
              <div className="space-y-2">
                <label
                  htmlFor="love-note-author"
                  className="text-sm font-semibold text-foreground"
                >
                  From (optional)
                </label>
                <Input
                  id="love-note-author"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Your Love"
                  className="rounded-2xl border-border bg-card text-foreground placeholder:text-muted-foreground focus-visible:ring-ring"
                  maxLength={50}
                  data-ocid="add_note.input"
                />
              </div>

              {/* Submit button */}
              <Button
                type="submit"
                className="w-full rounded-2xl font-semibold text-base py-3 min-h-[52px] gap-2 shadow-heart transition-transform active:scale-[0.98]"
                style={{
                  background: "oklch(0.52 0.22 10)",
                  color: "oklch(0.98 0.005 355)",
                }}
                data-ocid="add_note.submit_button"
              >
                <Send className="w-4 h-4" aria-hidden="true" />
                Send with Love 💕
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
