import { useEffect, useRef } from "react";
import type { CallEntry } from "../types/call";

export function useNotifications(
  calls: CallEntry[],
  onMarkDone: (id: string) => void,
) {
  const firedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    async function requestPermission() {
      if ("Notification" in window && Notification.permission === "default") {
        await Notification.requestPermission();
      }
    }
    requestPermission();
  }, []);

  useEffect(() => {
    function check() {
      if (!("Notification" in window) || Notification.permission !== "granted")
        return;
      const now = Date.now();
      for (const call of calls) {
        if (
          !call.isDone &&
          call.reminderAt !== null &&
          call.reminderAt <= now &&
          !firedRef.current.has(call.id)
        ) {
          firedRef.current.add(call.id);
          const typeLabel =
            call.direction === "Missed" ? "missed a call" : "tried to call";
          const n = new Notification(
            `📞 You ${typeLabel} from ${call.callerName}`,
            {
              body: "Do you want to call back now?",
              icon: "/favicon.ico",
              tag: call.id,
            },
          );
          n.onclick = () => {
            window.focus();
            onMarkDone(call.id);
            n.close();
          };
        }
      }
    }

    check();
    const interval = setInterval(check, 30_000);
    return () => clearInterval(interval);
  }, [calls, onMarkDone]);
}
