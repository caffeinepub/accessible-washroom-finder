import { useEffect, useState } from "react";

function formatTimeAgo(ms: number): string {
  const secs = Math.floor(ms / 1000);
  if (secs < 60) return `${secs}s ago`;
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function formatCountdown(ms: number): string {
  if (ms <= 0) return "Due now";
  const secs = Math.floor(ms / 1000);
  if (secs < 60) return `${secs}s`;
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  return `${hrs}h ${mins % 60}m`;
}

export function TimeAgo({ timestamp }: { timestamp: number }) {
  const [label, setLabel] = useState(() =>
    formatTimeAgo(Date.now() - timestamp),
  );

  useEffect(() => {
    const iv = setInterval(
      () => setLabel(formatTimeAgo(Date.now() - timestamp)),
      10_000,
    );
    return () => clearInterval(iv);
  }, [timestamp]);

  return <span>{label}</span>;
}

export function Countdown({ reminderAt }: { reminderAt: number }) {
  const [label, setLabel] = useState(() =>
    formatCountdown(reminderAt - Date.now()),
  );
  const [isDue, setIsDue] = useState(() => reminderAt <= Date.now());

  useEffect(() => {
    const iv = setInterval(() => {
      const remaining = reminderAt - Date.now();
      setLabel(formatCountdown(remaining));
      setIsDue(remaining <= 0);
    }, 5_000);
    return () => clearInterval(iv);
  }, [reminderAt]);

  return (
    <span
      className="text-xs font-semibold px-2 py-0.5 rounded-full"
      style={{
        background: isDue
          ? "oklch(0.76 0.18 65 / 0.2)"
          : "oklch(0.62 0.18 240 / 0.15)",
        color: isDue ? "oklch(0.76 0.18 65)" : "oklch(0.62 0.18 240)",
      }}
    >
      {isDue ? "⏰ Due now" : `⏱ ${label}`}
    </span>
  );
}
