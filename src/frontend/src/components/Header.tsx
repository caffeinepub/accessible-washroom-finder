import { motion } from "motion/react";

export default function Header() {
  return (
    <header className="relative overflow-hidden" data-ocid="header.section">
      {/* Decorative background */}
      <div
        className="absolute inset-0 petal-bg pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage: `
            radial-gradient(circle at 10% 50%, oklch(0.91 0.07 340 / 0.25) 0%, transparent 40%),
            radial-gradient(circle at 90% 30%, oklch(0.92 0.06 20 / 0.2) 0%, transparent 40%)
          `,
        }}
      />

      <div className="relative max-w-lg mx-auto px-6 pt-12 pb-10 text-center">
        {/* Floating decorative elements */}
        <motion.div
          className="absolute top-6 left-8 text-2xl select-none"
          animate={{ y: [0, -8, 0], rotate: [-5, 5, -5] }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            duration: 4,
            ease: "easeInOut",
          }}
          aria-hidden="true"
        >
          🌸
        </motion.div>
        <motion.div
          className="absolute top-4 right-10 text-xl select-none"
          animate={{ y: [0, -6, 0], rotate: [5, -5, 5] }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            duration: 3.5,
            ease: "easeInOut",
            delay: 0.5,
          }}
          aria-hidden="true"
        >
          💕
        </motion.div>
        <motion.div
          className="absolute bottom-4 left-16 text-lg select-none"
          animate={{ y: [0, -5, 0] }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            duration: 5,
            ease: "easeInOut",
            delay: 1,
          }}
          aria-hidden="true"
        >
          🌷
        </motion.div>
        <motion.div
          className="absolute bottom-6 right-8 text-xl select-none"
          animate={{ y: [0, -7, 0], rotate: [3, -3, 3] }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            duration: 4.5,
            ease: "easeInOut",
            delay: 1.5,
          }}
          aria-hidden="true"
        >
          ✨
        </motion.div>

        {/* Main title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className="font-display text-5xl sm:text-6xl font-bold text-foreground leading-tight mb-3">
            For My Love{" "}
            <span className="inline-block animate-heartbeat" aria-hidden="true">
              💕
            </span>
          </h1>
        </motion.div>

        <motion.p
          className="text-muted-foreground text-lg font-serif italic leading-relaxed"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          little reminders that you are so, so loved 🌷
        </motion.p>

        {/* Decorative divider */}
        <motion.div
          className="mt-6 flex items-center justify-center gap-3"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          aria-hidden="true"
        >
          <div className="h-px flex-1 max-w-[80px] bg-gradient-to-r from-transparent to-border" />
          <span className="text-xl">🌸</span>
          <div className="h-px flex-1 max-w-[80px] bg-gradient-to-l from-transparent to-border" />
        </motion.div>
      </div>
    </header>
  );
}
