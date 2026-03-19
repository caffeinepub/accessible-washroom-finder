export type CallType = "Phone" | "WhatsApp";
export type CallDirection = "Missed" | "Busy";

export interface CallEntry {
  id: string;
  callerName: string;
  callType: CallType;
  direction: CallDirection;
  timestamp: number;
  reminderAt: number | null;
  isDone: boolean;
}

export type ReminderOption = "none" | "10" | "30" | "60" | "120";

export const REMINDER_OPTIONS: { value: ReminderOption; label: string }[] = [
  { value: "none", label: "No reminder" },
  { value: "10", label: "10 minutes" },
  { value: "30", label: "30 minutes" },
  { value: "60", label: "1 hour" },
  { value: "120", label: "2 hours" },
];
