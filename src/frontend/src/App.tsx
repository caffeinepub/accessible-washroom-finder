import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bell,
  Clock,
  History,
  PhoneIncoming,
  PhoneMissed,
  Plus,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { AddCallModal } from "./components/AddCallModal";
import { ReminderCard } from "./components/ReminderCard";
import { useCallStore } from "./hooks/useCallStore";
import { useNotifications } from "./hooks/useNotifications";
import type { CallEntry } from "./types/call";

function EmptyReminders() {
  return (
    <motion.div
      data-ocid="reminders.empty_state"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 bg-primary/10">
        <Bell size={28} className="text-primary" />
      </div>
      <p className="font-display font-bold text-lg text-foreground mb-1">
        All clear!
      </p>
      <p className="text-sm text-muted-foreground max-w-[200px]">
        No pending reminders. Log a call to get started.
      </p>
    </motion.div>
  );
}

function EmptyHistory() {
  return (
    <motion.div
      data-ocid="history.empty_state"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 bg-muted">
        <History size={28} className="text-muted-foreground" />
      </div>
      <p className="font-display font-bold text-lg text-foreground mb-1">
        No history yet
      </p>
      <p className="text-sm text-muted-foreground max-w-[200px]">
        Dismissed and completed calls will appear here.
      </p>
    </motion.div>
  );
}

export default function App() {
  const { calls, pendingReminders, history, addCall, markDone, deleteCall } =
    useCallStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [tab, setTab] = useState("reminders");

  const handleMarkDone = useCallback(
    (id: string) => {
      markDone(id);
      toast.success("Marked as done", { duration: 2000 });
    },
    [markDone],
  );

  useNotifications(calls, handleMarkDone);

  function handleAdd(entry: Omit<CallEntry, "id">) {
    addCall(entry);
    const hasReminder = entry.reminderAt !== null;
    toast.success(
      hasReminder
        ? `Reminder set for ${entry.callerName}`
        : `Call logged for ${entry.callerName}`,
      { duration: 3000 },
    );
    if (hasReminder) setTab("reminders");
  }

  const dueCount = pendingReminders.filter(
    (c) => c.reminderAt !== null && c.reminderAt <= Date.now(),
  ).length;

  return (
    <div className="min-h-screen flex flex-col">
      <Toaster position="top-center" />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-primary shadow-phone-glow">
              <PhoneIncoming size={17} className="text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display font-bold text-base leading-none text-foreground">
                CallBack
              </h1>
              <p className="text-[11px] text-muted-foreground leading-none mt-0.5">
                Never miss a call back
              </p>
            </div>
          </div>

          <Button
            onClick={() => setModalOpen(true)}
            data-ocid="app.open_modal_button"
            size="sm"
            className="h-9 gap-1.5 text-xs font-semibold rounded-full px-4 bg-primary text-primary-foreground hover:bg-primary/90 hidden sm:flex"
          >
            <Plus size={14} />
            Log Call
          </Button>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 sm:px-6 py-8">
        {/* Hero stats */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-3 gap-3 mb-8"
        >
          {[
            {
              label: "Pending",
              value: pendingReminders.length,
              icon: Bell,
              colorClass: "text-primary",
              bgClass: "bg-primary/10",
            },
            {
              label: "Due Now",
              value: dueCount,
              icon: Clock,
              colorClass: "text-warning",
              bgClass: "bg-warning/10",
            },
            {
              label: "History",
              value: history.length,
              icon: History,
              colorClass: "text-muted-foreground",
              bgClass: "bg-muted",
            },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="bg-white rounded-2xl p-4 text-center card-shadow border border-border"
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center mx-auto mb-2 ${stat.bgClass}`}
                >
                  <Icon size={15} className={stat.colorClass} />
                </div>
                <p
                  className={`font-display font-bold text-2xl leading-none ${stat.colorClass}`}
                >
                  {stat.value}
                </p>
                <p className="text-[11px] text-muted-foreground mt-1 font-medium">
                  {stat.label}
                </p>
              </div>
            );
          })}
        </motion.div>

        {/* Due now banner */}
        <AnimatePresence>
          {dueCount > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: "auto", marginBottom: 24 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              className="overflow-hidden"
            >
              <div className="rounded-2xl px-5 py-3.5 flex items-center gap-3 due-pulse bg-warning/10 border border-warning/30">
                <PhoneMissed size={18} className="text-warning flex-shrink-0" />
                <p className="text-sm font-semibold text-warning">
                  {dueCount} reminder{dueCount > 1 ? "s" : ""} due right now!
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tabs */}
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="w-full h-11 p-1 mb-6 bg-muted rounded-2xl">
            <TabsTrigger
              value="reminders"
              data-ocid="reminders.tab"
              className="flex-1 text-sm font-semibold h-9 gap-2 rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-card"
            >
              <Bell size={14} />
              Reminders
              {pendingReminders.length > 0 && (
                <span className="text-[11px] font-bold px-1.5 py-0.5 rounded-full bg-primary text-primary-foreground leading-none">
                  {pendingReminders.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="history"
              data-ocid="history.tab"
              className="flex-1 text-sm font-semibold h-9 gap-2 rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-card"
            >
              <History size={14} />
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="reminders" className="mt-0">
            {pendingReminders.length === 0 ? (
              <EmptyReminders />
            ) : (
              <motion.div layout className="space-y-3">
                <AnimatePresence mode="popLayout">
                  {pendingReminders
                    .sort((a, b) => (a.reminderAt ?? 0) - (b.reminderAt ?? 0))
                    .map((call, i) => (
                      <ReminderCard
                        key={call.id}
                        call={call}
                        index={i + 1}
                        onDone={handleMarkDone}
                        onDelete={deleteCall}
                      />
                    ))}
                </AnimatePresence>
              </motion.div>
            )}
          </TabsContent>

          <TabsContent value="history" className="mt-0">
            {history.length === 0 ? (
              <EmptyHistory />
            ) : (
              <motion.div layout className="space-y-3">
                <AnimatePresence mode="popLayout">
                  {history
                    .sort((a, b) => b.timestamp - a.timestamp)
                    .map((call, i) => (
                      <ReminderCard
                        key={call.id}
                        call={call}
                        index={i + 1}
                        onDone={handleMarkDone}
                        onDelete={deleteCall}
                        isHistory
                      />
                    ))}
                </AnimatePresence>
              </motion.div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* FAB mobile */}
      <div className="fixed bottom-6 right-5 z-30 sm:hidden">
        <motion.button
          onClick={() => setModalOpen(true)}
          data-ocid="app.primary_button"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          className="w-14 h-14 rounded-2xl flex items-center justify-center bg-primary shadow-phone-glow"
          aria-label="Log a call"
        >
          <Plus size={24} className="text-primary-foreground" />
        </motion.button>
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-5 bg-white/60">
        <p className="text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()}. Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-dotted underline-offset-2 hover:text-foreground transition-colors"
          >
            caffeine.ai
          </a>
        </p>
      </footer>

      <AddCallModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdd={handleAdd}
      />
    </div>
  );
}
