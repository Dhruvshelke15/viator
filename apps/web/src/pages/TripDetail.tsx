import { useState } from "react";
import { motion } from "framer-motion";
import { trpc } from "../trpc.js";

const typeColors: Record<string, string> = {
  place: "type-place",
  activity: "type-activity",
  food: "type-food",
  transport: "type-transport",
};

export function TripDetail({
  tripId,
  onBack,
}: {
  tripId: string;
  onBack: () => void;
}) {
  const utils = trpc.useUtils();
  const { data: trip, isLoading } = trpc.trips.getById.useQuery({ id: tripId });

  const [dayDate, setDayDate] = useState("");
  const [dayNotes, setDayNotes] = useState("");

  const [activeDayId, setActiveDayId] = useState<string | null>(null);
  const [itemTitle, setItemTitle] = useState("");
  const [itemType, setItemType] = useState<"place" | "activity" | "food" | "transport">("place");
  const [itemTime, setItemTime] = useState("");
  const [itemAddress, setItemAddress] = useState("");

  const addDay = trpc.trips.addDay.useMutation({
    onSuccess: () => {
      utils.trips.getById.invalidate({ id: tripId });
      setDayDate("");
      setDayNotes("");
    },
  });

  const addItem = trpc.trips.addItem.useMutation({
    onSuccess: () => {
      utils.trips.getById.invalidate({ id: tripId });
      setItemTitle("");
      setItemTime("");
      setItemAddress("");
      setActiveDayId(null);
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-8 h-8 border-2 border-ember border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="glass rounded-2xl p-16 text-center">
        <p className="text-danger font-display">Trip not found.</p>
      </div>
    );
  }

  const nextDayNumber = (trip.days?.length ?? 0) + 1;

  return (
    <div>
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={onBack}
        className="flex items-center gap-2 text-text-muted hover:text-ember text-sm font-display tracking-wider uppercase mb-8 transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 18l-6-6 6-6" />
        </svg>
        Back
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <h2 className="font-display text-4xl font-bold tracking-tight gradient-text mb-3">
          {trip.title}
        </h2>
        {trip.description && (
          <p className="text-text-muted text-lg font-normal max-w-2xl">{trip.description}</p>
        )}
        {trip.startDate && (
          <div className="flex items-center gap-3 mt-4">
            <span className="glass px-4 py-2 rounded-lg text-xs font-display tracking-wider text-text-muted">
              {trip.startDate}
            </span>
            {trip.endDate && (
              <>
                <span className="text-text-dim">to</span>
                <span className="glass px-4 py-2 rounded-lg text-xs font-display tracking-wider text-text-muted">
                  {trip.endDate}
                </span>
              </>
            )}
          </div>
        )}
      </motion.div>

      <div className="space-y-6">
        {trip.days?.map((day, i) => (
          <motion.div
            key={day.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="glass rounded-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between px-7 py-5 border-b border-glass-border">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-ember/10 flex items-center justify-center">
                  <span className="font-display text-sm font-bold text-ember">{day.dayNumber}</span>
                </div>
                <div>
                  <h3 className="font-display text-sm font-semibold tracking-tight">
                    Day {day.dayNumber}
                  </h3>
                  {day.date && (
                    <p className="text-text-dim text-xs font-display tracking-wider mt-0.5">{day.date}</p>
                  )}
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveDayId(activeDayId === day.id ? null : day.id)}
                className="text-xs font-display tracking-wider uppercase text-ember hover:text-ember/80 transition-colors"
              >
                + Item
              </motion.button>
            </div>

            {day.notes && (
              <p className="text-text-muted text-sm font-normal px-7 py-3 border-b border-glass-border">
                {day.notes}
              </p>
            )}

            {day.items?.length > 0 && (
              <div className="divide-y divide-glass-border">
                {day.items.map((item) => (
                  <div key={item.id} className="flex items-start gap-4 px-7 py-4">
                    <span className={`type-badge ${typeColors[item.type] || ""}`}>
                      {item.type}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium tracking-tight">
                        {item.startTime && (
                          <span className="text-text-dim mr-3 font-display text-xs">
                            {item.startTime}
                          </span>
                        )}
                        {item.title}
                      </p>
                      {item.address && (
                        <p className="text-text-dim text-xs mt-1 truncate">{item.address}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeDayId === day.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="px-7 py-6 border-t border-glass-border bg-white/[0.02]"
              >
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="What are you doing?"
                    value={itemTitle}
                    onChange={(e) => setItemTitle(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl text-sm"
                  />
                  <div className="flex gap-3">
                    <select
                      value={itemType}
                      onChange={(e) => setItemType(e.target.value as typeof itemType)}
                      className="px-4 py-3 rounded-xl text-sm"
                    >
                      <option value="place">Place</option>
                      <option value="activity">Activity</option>
                      <option value="food">Food</option>
                      <option value="transport">Transport</option>
                    </select>
                    <input
                      type="time"
                      value={itemTime}
                      onChange={(e) => setItemTime(e.target.value)}
                      className="px-4 py-3 rounded-xl text-sm"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Address"
                    value={itemAddress}
                    onChange={(e) => setItemAddress(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl text-sm"
                  />
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() =>
                      addItem.mutate({
                        dayId: day.id,
                        data: {
                          title: itemTitle,
                          type: itemType,
                          startTime: itemTime || undefined,
                          address: itemAddress || undefined,
                        },
                      })
                    }
                    disabled={!itemTitle || addItem.isPending}
                    className="bg-ember text-void font-display text-xs tracking-wider uppercase font-semibold px-6 py-3 rounded-xl disabled:opacity-40 transition-all"
                  >
                    {addItem.isPending ? "Adding..." : "Add Item"}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass rounded-2xl p-8 mt-8"
      >
        <h3 className="font-display text-sm tracking-[0.15em] uppercase text-text-muted font-medium mb-6">
          Add Day {nextDayNumber}
        </h3>
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-xs text-text-dim font-display tracking-wider uppercase mb-2">
                Date
              </label>
              <input
                type="date"
                value={dayDate}
                onChange={(e) => setDayDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-sm"
              />
            </div>
            <div className="flex-[2]">
              <label className="block text-xs text-text-dim font-display tracking-wider uppercase mb-2">
                Notes
              </label>
              <input
                type="text"
                placeholder="What's the plan?"
                value={dayNotes}
                onChange={(e) => setDayNotes(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-sm"
              />
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() =>
              addDay.mutate({
                tripId,
                data: {
                  dayNumber: nextDayNumber,
                  date: dayDate || undefined,
                  notes: dayNotes || undefined,
                },
              })
            }
            disabled={addDay.isPending}
            className="bg-ember text-void font-display text-xs tracking-wider uppercase font-semibold px-6 py-3 rounded-xl disabled:opacity-40 transition-all"
          >
            {addDay.isPending ? "Adding..." : "Add Day"}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
