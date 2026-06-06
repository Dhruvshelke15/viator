import { useState } from "react";
import { trpc } from "../trpc.js";

export function TripList({
  onSelectTrip,
}: {
  onSelectTrip: (id: string) => void;
}) {
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

  if (isLoading) return <p className="text-gray-500">Loading trips...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Your Trips</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          {showForm ? "Cancel" : "New Trip"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Trip title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <textarea
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
            <div className="flex gap-4">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={() =>
                createTrip.mutate({
                  title,
                  description: description || undefined,
                  startDate: startDate || undefined,
                  endDate: endDate || undefined,
                })
              }
              disabled={!title || createTrip.isPending}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              {createTrip.isPending ? "Creating..." : "Create Trip"}
            </button>
          </div>
        </div>
      )}

      {!trips?.length ? (
        <p className="text-gray-500">No trips yet. Create your first one!</p>
      ) : (
        <div className="space-y-3">
          {trips.map((trip) => (
            <div
              key={trip.id}
              className="bg-white rounded-lg border border-gray-200 p-4 flex items-center justify-between hover:border-blue-300 transition-colors"
            >
              <div
                className="cursor-pointer flex-1"
                onClick={() => onSelectTrip(trip.id)}
              >
                <h3 className="font-medium text-gray-900">{trip.title}</h3>
                {trip.description && (
                  <p className="text-sm text-gray-500 mt-1">
                    {trip.description}
                  </p>
                )}
                {trip.startDate && (
                  <p className="text-xs text-gray-400 mt-1">
                    {trip.startDate} {trip.endDate ? `- ${trip.endDate}` : ""}
                  </p>
                )}
              </div>
              <button
                onClick={() => deleteTrip.mutate({ id: trip.id })}
                className="text-red-500 hover:text-red-700 ml-4 text-sm"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
