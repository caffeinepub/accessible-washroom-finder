import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, PhoneCall, X } from "lucide-react";
import { motion } from "motion/react";
import type { CallEntry } from "../types/call";
import { CallTypeIcon } from "./CallTypeIcon";
import { Countdown, TimeAgo } from "./TimeDisplay";

interface Props {
  call: CallEntry;
  index: number;
  onDone: (id: string) => void;
  onDelete: (id: string) => void;
  isHistory?: boolean;
}

export function ReminderCard({
  call,
  index,
  onDone,
  onDelete,
  isHistory,
}: Props) {
  const isDue = call.reminderAt !== null && call.reminderAt <= Date.now();

  function handleCallBack() {
    if (call.callType === "WhatsApp") {
      window.open(
        `https://wa.me/?text=Hey%20${encodeURIComponent(call.callerName)}`,
        "_blank",
      );
    } else {
      window.location.href = `tel:${call.callerName.replace(/\s+/g, "")}`;
    }
    onDone(call.id);
  }

  const isMissed = call.direction === "Missed";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      data-ocid={`reminder.item.${index}`}
      className={[
        "relative bg-white rounded-2xl p-5 border border-border card-shadow transition-shadow duration-200 hover:card-shadow-hover",
        isDue && !isHistory ? "due-pulse border-warning/40 bg-warning/5" : "",
      ].join(" ")}
    >
      <div className="flex items-start gap-4">
        {/* Avatar/Icon */}
        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
            call.callType === "WhatsApp" ? "bg-accent/10" : "bg-primary/10"
          }`}
        >
          <CallTypeIcon type={call.callType} size={20} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-display font-bold text-base text-foreground truncate">
                {call.callerName}
              </p>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <Badge
                  variant="outline"
                  className="text-[11px] px-2 py-0 h-5 border font-semibold"
                  style={{
                    background: isMissed
                      ? "oklch(0.56 0.22 25 / 0.1)"
                      : "oklch(0.60 0.16 290 / 0.1)",
                    borderColor: isMissed
                      ? "oklch(0.56 0.22 25 / 0.3)"
                      : "oklch(0.60 0.16 290 / 0.3)",
                    color: isMissed
                      ? "oklch(0.48 0.22 25)"
                      : "oklch(0.50 0.16 290)",
                  }}
                >
                  {isMissed ? "↙ Missed" : "↗ Busy"}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  <TimeAgo timestamp={call.timestamp} />
                </span>
                {!isHistory && call.reminderAt && (
                  <Countdown reminderAt={call.reminderAt} />
                )}
              </div>
            </div>

            {/* Delete */}
            <button
              type="button"
              onClick={() => onDelete(call.id)}
              data-ocid={`reminder.delete_button.${index}`}
              className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0 p-1.5 -mr-1 -mt-1 rounded-lg hover:bg-muted"
              aria-label="Delete"
            >
              <X size={14} />
            </button>
          </div>

          {/* Actions */}
          {!isHistory && (
            <div className="flex items-center gap-2 mt-4">
              <Button
                size="sm"
                onClick={handleCallBack}
                data-ocid={`reminder.primary_button.${index}`}
                className="h-9 text-sm gap-1.5 flex-1 rounded-full font-semibold"
                style={{
                  background:
                    call.callType === "WhatsApp"
                      ? "oklch(0.55 0.18 145)"
                      : "oklch(0.52 0.22 264)",
                  color: "oklch(0.99 0 0)",
                }}
              >
                <PhoneCall size={13} />
                Call Back Now
                <ArrowUpRight size={13} className="opacity-70" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onDone(call.id)}
                data-ocid={`reminder.secondary_button.${index}`}
                className="h-9 text-sm rounded-full px-5"
              >
                Dismiss
              </Button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
