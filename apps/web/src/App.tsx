import { useState } from "react";
import { TripList } from "./pages/TripList.js";
import { TripDetail } from "./pages/TripDetail.js";

export function App() {
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <h1
          className="text-2xl font-bold text-gray-900 cursor-pointer"
          onClick={() => setSelectedTripId(null)}
        >
          Viator
        </h1>
      </header>

      <main className="max-w-4xl mx-auto py-8 px-4">
        {selectedTripId ? (
          <TripDetail
            tripId={selectedTripId}
            onBack={() => setSelectedTripId(null)}
          />
        ) : (
          <TripList onSelectTrip={setSelectedTripId} />
        )}
      </main>
    </div>
  );
}
