import { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";

function LocationMarker({ position }) {
  const map = useMap();

  if (position) {
    map.setView(position, 15);
  }

  return position ? (
    <Marker position={position}>
      <Popup>
        📍 You are here
      </Popup>
    </Marker>
  ) : null;
}

function RoutePlanner() {
  const [position, setPosition] = useState([18.5204, 73.8567]);
  const [loading, setLoading] = useState(false);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      (location) => {
        const latitude = location.coords.latitude;
        const longitude = location.coords.longitude;

        setPosition([latitude, longitude]);
        setLoading(false);
      },
      (error) => {
        console.error(error);
        setLoading(false);

        alert(
          "Unable to get your location. Please allow location access."
        );
      }
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Header */}
      <div className="bg-slate-900 text-white py-10 px-6">
        <div className="max-w-7xl mx-auto">

          <h1 className="text-4xl font-bold">
            🗺️ Safe Route Planner
          </h1>

          <p className="text-gray-300 mt-3">
            Find a safer route to your destination.
          </p>

        </div>
      </div>

      {/* Main */}
      <div className="max-w-7xl mx-auto px-6 py-10">

        <div className="grid lg:grid-cols-3 gap-8">

          {/* Controls */}
          <div className="bg-white rounded-2xl shadow-lg p-6">

            <h2 className="text-2xl font-bold mb-6">
              Plan Your Journey
            </h2>

            <label className="font-semibold">
              Starting Location
            </label>

            <input
              type="text"
              placeholder="Enter starting location"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 mt-2 mb-4"
            />

            <button
              onClick={getCurrentLocation}
              disabled={loading}
              className="text-green-600 font-semibold mb-6"
            >
              {loading
                ? "📍 Getting location..."
                : "📍 Use My Current Location"}
            </button>

            <label className="font-semibold">
              Destination
            </label>

            <input
              type="text"
              placeholder="Where do you want to go?"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 mt-2 mb-6"
            />

            <button className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg transition">
              Find Safest Route
            </button>

          </div>

          {/* Map */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6">

            <h2 className="text-2xl font-bold mb-5">
              Route Map
            </h2>

            <div className="h-96 rounded-xl overflow-hidden">

              <MapContainer
                center={position}
                zoom={13}
                scrollWheelZoom={true}
                className="h-full w-full"
              >

                <TileLayer
                  attribution='&copy; OpenStreetMap contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <LocationMarker position={position} />

              </MapContainer>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default RoutePlanner;