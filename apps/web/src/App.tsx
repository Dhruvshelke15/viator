import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { TripList } from "./pages/TripList.js";
import { TripDetail } from "./pages/TripDetail.js";
import { ThemeToggle } from "./components/ThemeToggle.js";

export function App() {
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);

  return (
    <div className="min-h-screen relative">
      <div className="bg-mesh" />
      <div className="noise-overlay" />

      <header className="relative z-10 glass border-b border-glass-border px-8 py-5 flex items-center justify-between">
        <h1
          className="font-display text-xl font-bold cursor-pointer tracking-tight gradient-text"
          onClick={() => setSelectedTripId(null)}
        >
          VIATOR
        </h1>
        <div className="flex items-center gap-4">
          <span className="font-display text-[0.65rem] tracking-[0.2em] uppercase text-text-muted hidden sm:block">
            Travel Planner
          </span>
          <ThemeToggle />
        </div>
      </header>

      <main className="relative z-10 max-w-5xl mx-auto py-10 px-6">
        <AnimatePresence mode="wait">
          {selectedTripId ? (
            <motion.div
              key="detail"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <TripDetail
                tripId={selectedTripId}
                onBack={() => setSelectedTripId(null)}
              />
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <TripList onSelectTrip={setSelectedTripId} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
