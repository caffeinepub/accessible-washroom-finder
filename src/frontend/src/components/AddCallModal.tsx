import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Phone } from "lucide-react";
import { useState } from "react";
import { SiWhatsapp } from "react-icons/si";
import type {
  CallDirection,
  CallEntry,
  CallType,
  ReminderOption,
} from "../types/call";
import { REMINDER_OPTIONS } from "../types/call";

interface Props {
  open: boolean;
  onClose: () => void;
  onAdd: (entry: Omit<CallEntry, "id">) => void;
}

export function AddCallModal({ open, onClose, onAdd }: Props) {
  const [name, setName] = useState("");
  const [callType, setCallType] = useState<CallType>("Phone");
  const [direction, setDirection] = useState<CallDirection>("Missed");
  const [reminder, setReminder] = useState<ReminderOption>("30");
  const [busyChoice, setBusyChoice] = useState<"yes" | "no" | null>(null);
  const [nameError, setNameError] = useState("");

  const isBusy = direction === "Busy";

  function reset() {
    setName("");
    setCallType("Phone");
    setDirection("Missed");
    setReminder("30");
    setBusyChoice(null);
    setNameError("");
  }

  function handleClose() {
    reset();
    onClose();
  }

  function handleSubmit() {
    if (!name.trim()) {
      setNameError("Please enter a caller name");
      return;
    }
    setNameError("");

    let effectiveReminder: ReminderOption = reminder;
    if (isBusy && busyChoice === "yes") effectiveReminder = "30";
    else if (isBusy && busyChoice === "no") effectiveReminder = "none";

    const reminderAt =
      effectiveReminder === "none"
        ? null
        : Date.now() + Number(effectiveReminder) * 60 * 1000;

    onAdd({
      callerName: name.trim(),
      callType,
      direction,
      timestamp: Date.now(),
      reminderAt,
      isDone: false,
    });
    handleClose();
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent
        data-ocid="addcall.dialog"
        className="max-w-md w-full p-0 overflow-hidden rounded-3xl border-border"
      >
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border bg-muted/40">
          <DialogTitle className="font-display text-xl">Log a Call</DialogTitle>
          <p className="text-sm text-muted-foreground mt-0.5">
            Track missed or busy calls
          </p>
        </DialogHeader>

        <div className="px-6 py-5 space-y-5">
          {/* Name */}
          <div className="space-y-2">
            <Label
              htmlFor="caller-name"
              className="text-sm font-semibold text-foreground"
            >
              Caller Name
            </Label>
            <Input
              id="caller-name"
              data-ocid="addcall.input"
              placeholder="e.g. Rahul Sharma"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setNameError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              className="h-11 rounded-xl bg-muted/50 border-border"
            />
            {nameError && (
              <p
                data-ocid="addcall.error_state"
                className="text-xs text-destructive font-medium"
              >
                {nameError}
              </p>
            )}
          </div>

          {/* Call Medium */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-foreground">
              Call Medium
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {(["Phone", "WhatsApp"] as CallType[]).map((t) => (
                <button
                  type="button"
                  key={t}
                  data-ocid={`addcall.${t.toLowerCase()}.toggle`}
                  onClick={() => setCallType(t)}
                  className="flex items-center justify-center gap-2 h-11 rounded-xl border text-sm font-semibold transition-all"
                  style={{
                    background:
                      callType === t
                        ? t === "WhatsApp"
                          ? "oklch(0.55 0.18 145 / 0.12)"
                          : "oklch(0.52 0.22 264 / 0.1)"
                        : "oklch(0.95 0.008 240)",
                    borderColor:
                      callType === t
                        ? t === "WhatsApp"
                          ? "oklch(0.55 0.18 145 / 0.5)"
                          : "oklch(0.52 0.22 264 / 0.5)"
                        : "oklch(0.90 0.012 240)",
                    color:
                      callType === t
                        ? t === "WhatsApp"
                          ? "oklch(0.45 0.18 145)"
                          : "oklch(0.42 0.22 264)"
                        : "oklch(0.45 0.01 250)",
                  }}
                >
                  {t === "WhatsApp" ? (
                    <SiWhatsapp size={15} />
                  ) : (
                    <Phone size={15} />
                  )}
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Direction */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-foreground">
              What happened?
            </Label>
            <div className="space-y-2">
              {(
                [
                  {
                    value: "Missed",
                    label: "They called me (Missed)",
                    icon: "↙",
                    color: "oklch(0.56 0.22 25)",
                  },
                  {
                    value: "Busy",
                    label: "I called them (Busy / No Answer)",
                    icon: "↗",
                    color: "oklch(0.60 0.16 290)",
                  },
                ] as {
                  value: CallDirection;
                  label: string;
                  icon: string;
                  color: string;
                }[]
              ).map((opt) => (
                <button
                  type="button"
                  key={opt.value}
                  data-ocid={`addcall.${opt.value.toLowerCase()}.toggle`}
                  onClick={() => {
                    setDirection(opt.value);
                    setBusyChoice(null);
                  }}
                  className="w-full flex items-center gap-3 h-11 px-4 rounded-xl border text-sm font-medium text-left transition-all"
                  style={{
                    background:
                      direction === opt.value
                        ? `${opt.color.replace(")", " / 0.08)")}`
                        : "oklch(0.95 0.008 240)",
                    borderColor:
                      direction === opt.value
                        ? `${opt.color.replace(")", " / 0.4)")}`
                        : "oklch(0.90 0.012 240)",
                    color:
                      direction === opt.value
                        ? opt.color
                        : "oklch(0.45 0.01 250)",
                  }}
                >
                  <span className="text-base">{opt.icon}</span>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Busy Call Prompt */}
          {isBusy && (
            <div className="rounded-2xl p-4 fade-up bg-primary/5 border border-primary/20">
              <p className="font-semibold text-sm text-primary mb-3">
                📞 Set a call-back reminder?
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  data-ocid="addcall.busy_yes.button"
                  onClick={() => setBusyChoice("yes")}
                  className="flex-1 h-9 rounded-full text-xs font-bold transition-all"
                  style={{
                    background:
                      busyChoice === "yes"
                        ? "oklch(0.52 0.22 264)"
                        : "oklch(0.52 0.22 264 / 0.12)",
                    color:
                      busyChoice === "yes"
                        ? "oklch(0.99 0 0)"
                        : "oklch(0.42 0.22 264)",
                  }}
                >
                  Yes, in 30 min
                </button>
                <button
                  type="button"
                  data-ocid="addcall.busy_no.button"
                  onClick={() => setBusyChoice("no")}
                  className="flex-1 h-9 rounded-full text-xs font-bold transition-all"
                  style={{
                    background:
                      busyChoice === "no"
                        ? "oklch(0.55 0.01 250)"
                        : "oklch(0.55 0.01 250 / 0.12)",
                    color:
                      busyChoice === "no"
                        ? "oklch(0.99 0 0)"
                        : "oklch(0.45 0.01 250)",
                  }}
                >
                  No thanks
                </button>
              </div>
            </div>
          )}

          {/* Reminder Time */}
          {(!isBusy || busyChoice === "no") && (
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-foreground">
                Remind me in
              </Label>
              <Select
                value={reminder}
                onValueChange={(v) => setReminder(v as ReminderOption)}
              >
                <SelectTrigger
                  data-ocid="addcall.select"
                  className="h-11 rounded-xl bg-muted/50 border-border"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {REMINDER_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex gap-3 border-t border-border pt-4">
          <Button
            variant="outline"
            onClick={handleClose}
            data-ocid="addcall.cancel_button"
            className="flex-1 h-11 rounded-full"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            data-ocid="addcall.submit_button"
            className="flex-1 h-11 rounded-full font-bold bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Log Call
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
