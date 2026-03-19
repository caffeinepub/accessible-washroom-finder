import { useCallback, useEffect, useState } from "react";
import type { CallEntry } from "../types/call";

const STORAGE_KEY = "callReminder_calls";

const SEED_DATA: CallEntry[] = [
  {
    id: "seed-1",
    callerName: "Rahul Sharma",
    callType: "Phone",
    direction: "Missed",
    timestamp: Date.now() - 1000 * 60 * 25,
    reminderAt: Date.now() + 1000 * 60 * 5,
    isDone: false,
  },
  {
    id: "seed-2",
    callerName: "Priya Mehta",
    callType: "WhatsApp",
    direction: "Busy",
    timestamp: Date.now() - 1000 * 60 * 45,
    reminderAt: Date.now() + 1000 * 60 * 15,
    isDone: false,
  },
  {
    id: "seed-3",
    callerName: "Ankit Joshi",
    callType: "Phone",
    direction: "Missed",
    timestamp: Date.now() - 1000 * 60 * 90,
    reminderAt: null,
    isDone: true,
  },
  {
    id: "seed-4",
    callerName: "Sneha Patel",
    callType: "WhatsApp",
    direction: "Missed",
    timestamp: Date.now() - 1000 * 60 * 180,
    reminderAt: null,
    isDone: true,
  },
];

function load(): CallEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return SEED_DATA;
    return JSON.parse(raw) as CallEntry[];
  } catch {
    return SEED_DATA;
  }
}

function save(calls: CallEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(calls));
}

export function useCallStore() {
  const [calls, setCalls] = useState<CallEntry[]>(() => load());

  useEffect(() => {
    save(calls);
  }, [calls]);

  const addCall = useCallback((entry: Omit<CallEntry, "id">) => {
    const newEntry: CallEntry = { ...entry, id: String(Date.now()) };
    setCalls((prev) => [newEntry, ...prev]);
    return newEntry;
  }, []);

  const markDone = useCallback((id: string) => {
    setCalls((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, isDone: true, reminderAt: null } : c,
      ),
    );
  }, []);

  const deleteCall = useCallback((id: string) => {
    setCalls((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const pendingReminders = calls.filter(
    (c) => !c.isDone && c.reminderAt !== null,
  );
  const history = calls.filter((c) => c.isDone || c.reminderAt === null);

  return { calls, pendingReminders, history, addCall, markDone, deleteCall };
}
