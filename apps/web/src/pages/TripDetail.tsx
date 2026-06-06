import { useState } from "react";
import { trpc } from "../trpc.js";

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
  const [itemType, setItemType] = useState<
    "place" | "activity" | "food" | "transport"
  >("place");
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

  if (isLoading) return <p className="text-gray-500">Loading trip...</p>;
  if (!trip) return <p className="text-red-500">Trip not found.</p>;

  const nextDayNumber = (trip.days?.length ?? 0) + 1;

  return (
    <div>
      <button
        onClick={onBack}
        className="text-blue-600 hover:text-blue-800 mb-4 text-sm"
      >
        Back to trips
      </button>

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">{trip.title}</h2>
        {trip.description && (
          <p className="text-gray-600 mt-1">{trip.description}</p>
        )}
        {trip.startDate && (
          <p className="text-sm text-gray-400 mt-1">
            {trip.startDate} {trip.endDate ? `to ${trip.endDate}` : ""}
          </p>
        )}
      </div>

      <div className="space-y-6">
        {trip.days?.map((day) => (
          <div
            key={day.id}
            className="bg-white rounded-lg border border-gray-200 p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">
                Day {day.dayNumber}
                {day.date && (
                  <span className="text-gray-400 font-normal ml-2">
                    {day.date}
                  </span>
                )}
              </h3>
              <button
                onClick={() =>
                  setActiveDayId(activeDayId === day.id ? null : day.id)
                }
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                + Add item
              </button>
            </div>

            {day.notes && (
              <p className="text-sm text-gray-500 mb-3">{day.notes}</p>
            )}

            {day.items?.length > 0 && (
              <div className="space-y-2">
                {day.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start gap-3 py-2 border-t border-gray-100"
                  >
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded uppercase">
                      {item.type}
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">
                        {item.startTime && (
                          <span className="text-gray-400 mr-2">
                            {item.startTime}
                          </span>
                        )}
                        {item.title}
                      </p>
                      {item.address && (
                        <p className="text-xs text-gray-400">{item.address}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeDayId === day.id && (
              <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
                <input
                  type="text"
                  placeholder="Item title"
                  value={itemTitle}
                  onChange={(e) => setItemTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex gap-3">
                  <select
                    value={itemType}
                    onChange={(e) =>
                      setItemType(e.target.value as typeof itemType)
                    }
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Address (optional)"
                  value={itemAddress}
                  onChange={(e) => setItemAddress(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
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
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {addItem.isPending ? "Adding..." : "Add Item"}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 bg-white rounded-lg border border-gray-200 p-5">
        <h3 className="font-semibold text-gray-900 mb-4">
          Add Day {nextDayNumber}
        </h3>
        <div className="space-y-3">
          <input
            type="date"
            value={dayDate}
            onChange={(e) => setDayDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Notes for this day (optional)"
            value={dayNotes}
            onChange={(e) => setDayNotes(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
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
            className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            {addDay.isPending ? "Adding..." : "Add Day"}
          </button>
        </div>
      </div>
    </div>
  );
}
