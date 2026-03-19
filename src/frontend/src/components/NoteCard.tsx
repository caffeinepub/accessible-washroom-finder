import { Heart, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

export interface LoveNote {
  id: number;
  text: string;
  author: string;
  timestamp: Date;
  likes: number;
  imageIndex: number;
  liked: boolean;
}

const COUPLE_IMAGES = [
  "/assets/generated/couple_hug.dim_600x400.jpg",
  "/assets/generated/couple_flowers.dim_600x400.jpg",
  "/assets/generated/couple_umbrella.dim_600x400.jpg",
  "/assets/generated/couple_sunset.dim_600x400.jpg",
  "/assets/generated/couple_picnic.dim_600x400.jpg",
];

interface NoteCardProps {
  note: LoveNote;
  index: number;
  onLike: () => void;
  onDelete: () => void;
}

function formatTimestamp(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

// Use deterministic positions 1-6, beyond 6 we map to 1-3 cyclically
const CARD_OCID_INDEX = (index: number) => Math.min(index + 1, 6);

export default function NoteCard({
  note,
  index,
  onLike,
  onDelete,
}: NoteCardProps) {
  const [heartAnimKey, setHeartAnimKey] = useState(0);
  const imgSrc = COUPLE_IMAGES[note.imageIndex % COUPLE_IMAGES.length];
  const ocidIdx = CARD_OCID_INDEX(index);

  const handleLike = () => {
    setHeartAnimKey((k) => k + 1);
    onLike();
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 28, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.92, y: -16 }}
      transition={{
        duration: 0.45,
        ease: [0.16, 1, 0.3, 1],
        delay: index < 4 ? index * 0.08 : 0,
      }}
      className="bg-card rounded-3xl overflow-hidden shadow-card hover:shadow-card-hover transition-shadow duration-300"
      data-ocid={`note.card.${ocidIdx}`}
      aria-label={`Love note from ${note.author}`}
    >
      {/* Couple image */}
      <div className="relative w-full aspect-[3/2] overflow-hidden">
        <img
          src={imgSrc}
          alt="A sweet couple moment"
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {/* Soft gradient overlay at bottom */}
        <div
          className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, oklch(1 0 0 / 0.7), transparent)",
          }}
          aria-hidden="true"
        />
        {/* Author badge */}
        <div className="absolute bottom-3 left-4">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-card/90 backdrop-blur-sm text-xs font-semibold text-foreground shadow-xs border border-border">
            <span aria-hidden="true">✍️</span>
            {note.author}
          </span>
        </div>
        {/* Delete button */}
        <button
          type="button"
          onClick={onDelete}
          className="absolute top-3 right-3 w-8 h-8 min-h-0 flex items-center justify-center rounded-full bg-card/80 backdrop-blur-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors border border-border/50"
          aria-label="Delete this love note"
          data-ocid={`note.delete_button.${ocidIdx}`}
        >
          <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
      </div>

      {/* Card content */}
      <div className="px-6 pt-5 pb-5">
        {/* Message text */}
        <blockquote className="font-serif text-foreground text-lg leading-relaxed mb-4 relative">
          <span
            className="absolute -top-2 -left-1 text-5xl leading-none text-primary/20 font-display select-none"
            aria-hidden="true"
          >
            "
          </span>
          <span className="relative z-10 block pl-4">{note.text}</span>
          <span
            className="absolute -bottom-4 right-0 text-5xl leading-none text-primary/20 font-display select-none"
            aria-hidden="true"
          >
            "
          </span>
        </blockquote>

        {/* Footer: timestamp + like button */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
          <time
            dateTime={note.timestamp.toISOString()}
            className="text-sm text-muted-foreground"
          >
            {formatTimestamp(note.timestamp)}
          </time>

          <button
            type="button"
            onClick={handleLike}
            className="flex items-center gap-2 px-4 py-2 min-h-0 rounded-full transition-all duration-200 hover:scale-105 active:scale-95 group"
            style={{
              background: note.liked
                ? "oklch(0.97 0.04 355)"
                : "oklch(0.96 0.015 355)",
              border: `1.5px solid ${note.liked ? "oklch(0.75 0.15 10)" : "oklch(0.88 0.03 355)"}`,
            }}
            aria-label={`${note.liked ? "Unlike" : "Like"} this note. ${note.likes} likes`}
            aria-pressed={note.liked}
            data-ocid={`note.like_button.${ocidIdx}`}
          >
            <motion.span
              key={heartAnimKey}
              animate={heartAnimKey > 0 ? { scale: [1, 1.6, 1] } : {}}
              transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
              className="flex items-center"
            >
              <Heart
                className={`w-4 h-4 transition-colors ${
                  note.liked
                    ? "text-primary fill-primary"
                    : "text-muted-foreground group-hover:text-primary"
                }`}
                aria-hidden="true"
              />
            </motion.span>
            <span
              className={`text-sm font-semibold tabular-nums transition-colors ${
                note.liked ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {note.likes}
            </span>
          </button>
        </div>
      </div>
    </motion.article>
  );
}
