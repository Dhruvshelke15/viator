import { useState } from "react";
import { motion } from "framer-motion";
import { Globe } from "../components/Globe.js";
import { trpc } from "../trpc.js";

export function TripList({ onSelectTrip }: { onSelectTrip: (id: string) => void }) {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const utils = trpc.useUtils();
  const { data: trips, isLoading } = trpc.trips.list.useQuery();

  const createTrip = trpc.trips.create.useMutation({
    onSuccess: () => {
      utils.trips.list.invalidate();
      setShowForm(false);
      setTitle("");
      setDescription("");
      setStartDate("");
      setEndDate("");
    },
  });

  const deleteTrip = trpc.trips.remove.useMutation({
    onSuccess: () => utils.trips.list.invalidate(),
  });

  return (
    <div>
      <div className="flex flex-col lg:flex-row items-center gap-8 mb-16">
        <div className="flex-1">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-5xl font-bold tracking-tight mb-4 leading-tight"
          >
            Your next
            <br />
            <span className="gradient-text">adventure</span>
            <br />
            awaits.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-text-muted text-lg font-normal max-w-md leading-relaxed"
          >
            Plan every detail. From sunrise temples to midnight street food. Your journey, your story.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="w-[360px] h-[360px] lg:w-[420px] lg:h-[420px]"
        >
          <Globe />
        </motion.div>
      </div>

      <div className="flex items-center justify-between mb-8">
        <h3 className="font-display text-sm tracking-[0.15em] uppercase text-text-muted font-medium">
          Your Trips
        </h3>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setShowForm(!showForm)}
          className={`font-display text-xs tracking-wider uppercase px-5 py-3 rounded-xl transition-all duration-200 ${
            showForm
              ? "glass border border-glass-border text-text-muted"
              : "bg-ember text-void font-semibold glow-ember"
          }`}
        >
          {showForm ? "Cancel" : "+ New Trip"}
        </motion.button>
      </div>

      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -10, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, y: -10 }}
          className="glass rounded-2xl p-8 mb-8"
        >
          <div className="space-y-5">
            <input
              type="text"
              placeholder="Where are you going?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-5 py-3.5 rounded-xl text-lg font-normal"
            />
            <textarea
              placeholder="Describe your trip..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-5 py-3.5 rounded-xl font-normal resize-none"
              rows={3}
            />
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-xs text-text-dim font-display tracking-wider uppercase mb-2">
                  Start
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-5 py-3 rounded-xl"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs text-text-dim font-display tracking-wider uppercase mb-2">
                  End
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-5 py-3 rounded-xl"
                />
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() =>
                createTrip.mutate({
                  title,
                  description: description || undefined,
                  startDate: startDate || undefined,
                  endDate: endDate || undefined,
                })
              }
              disabled={!title || createTrip.isPending}
              className="bg-ember text-void font-display text-xs tracking-wider uppercase font-semibold px-8 py-3.5 rounded-xl glow-ember disabled:opacity-40 disabled:shadow-none transition-all"
            >
              {createTrip.isPending ? "Creating..." : "Create Trip"}
            </motion.button>
          </div>
        </motion.div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-ember border-t-transparent rounded-full animate-spin" />
        </div>
      ) : !trips?.length ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass rounded-2xl p-16 text-center"
        >
          <p className="text-text-dim text-lg font-normal">No trips yet.</p>
          <p className="text-text-dim text-sm mt-2">Create your first adventure above.</p>
        </motion.div>
      ) : (
        <div className="grid gap-4">
          {trips.map((trip, i) => (
            <motion.div
              key={trip.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="glass glass-hover rounded-2xl p-6 flex items-center justify-between cursor-pointer group transition-all duration-300"
              onClick={() => onSelectTrip(trip.id)}
            >
              <div className="flex-1">
                <h3 className="font-display text-lg font-semibold tracking-tight group-hover:text-ember transition-colors">
                  {trip.title}
                </h3>
                {trip.description && (
                  <p className="text-text-muted text-sm mt-1.5 font-normal line-clamp-1">
                    {trip.description}
                  </p>
                )}
                {trip.startDate && (
                  <p className="text-text-dim text-xs mt-2 font-display tracking-wider">
                    {trip.startDate} {trip.endDate ? ` \u2192 ${trip.endDate}` : ""}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteTrip.mutate({ id: trip.id });
                  }}
                  className="text-text-dim hover:text-danger text-xs font-display tracking-wider uppercase transition-colors opacity-0 group-hover:opacity-100"
                >
                  Remove
                </button>
                <div className="w-8 h-8 rounded-full glass flex items-center justify-center group-hover:bg-ember/10 transition-colors">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-text-muted group-hover:text-ember transition-colors">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
