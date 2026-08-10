import { useState } from "react";
import axios from "axios";

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
      <Popup>📍 Starting Location</Popup>
    </Marker>
  ) : null;
}

function DestinationMarker({ position }) {
  const map = useMap();

  if (position) {
    map.setView(position, 14);
  }

  return position ? (
    <Marker position={position}>
      <Popup>🎯 Destination</Popup>
    </Marker>
  ) : null;
}

function RoutePlanner() {
  const [position, setPosition] = useState([18.5204, 73.8567]);

  const [destination, setDestination] = useState("");
  const [destinationPosition, setDestinationPosition] = useState(null);

  const [loading, setLoading] = useState(false);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (location) => {
        const latitude = location.coords.latitude;
        const longitude = location.coords.longitude;

        setPosition([latitude, longitude]);
      },
      () => {
        alert("Unable to get your location. Please allow location access.");
      }
    );
  };

  const searchDestination = async () => {
    if (!destination.trim()) {
      alert("Please enter a destination.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.get(
        "https://nominatim.openstreetmap.org/search",
        {
          params: {
            q: destination,
            format: "json",
            limit: 1,
          },
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (response.data.length === 0) {
        alert("Destination not found.");
        return;
      }

      const result = response.data[0];

      const latitude = parseFloat(result.lat);
      const longitude = parseFloat(result.lon);

      setDestinationPosition([latitude, longitude]);

    } catch (error) {
      console.error(error);
      alert("Unable to search destination.");
    } finally {
      setLoading(false);
    }
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

            <button
              onClick={getCurrentLocation}
              className="w-full mt-2 mb-6 border border-green-500 text-green-600 py-3 rounded-lg font-semibold hover:bg-green-50"
            >
              📍 Use My Current Location
            </button>

            <label className="font-semibold">
              Destination
            </label>

            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Example: Pune Railway Station"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 mt-2 mb-4"
            />

            <button
              onClick={searchDestination}
              disabled={loading}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg transition"
            >
              {loading ? "Searching..." : "Search Destination"}
            </button>

            {destinationPosition && (
              <div className="mt-6 bg-green-50 p-4 rounded-lg">
                <p className="font-semibold text-green-700">
                  🎯 Destination Found
                </p>

                <p className="text-sm text-gray-600 mt-2">
                  Latitude: {destinationPosition[0].toFixed(5)}
                </p>

                <p className="text-sm text-gray-600">
                  Longitude: {destinationPosition[1].toFixed(5)}
                </p>
              </div>
            )}

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

                <DestinationMarker
                  position={destinationPosition}
                />

              </MapContainer>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default RoutePlanner;