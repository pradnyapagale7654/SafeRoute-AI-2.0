import { useState } from "react";
import axios from "axios";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";

// Move map when a location changes
function MapUpdater({ position, destinationPosition, route }) {
  const map = useMap();

  if (route.length > 0) {
    map.fitBounds(route, {
      padding: [30, 30],
    });
  } else if (destinationPosition) {
    map.fitBounds([position, destinationPosition], {
      padding: [50, 50],
    });
  } else if (position) {
    map.setView(position, 14);
  }

  return null;
}

// Starting location marker
function LocationMarker({ position }) {
  return position ? (
    <Marker position={position}>
      <Popup>
        <strong>📍 Starting Location</strong>
        <br />
        You are here.
      </Popup>
    </Marker>
  ) : null;
}

// Destination marker
function DestinationMarker({ position }) {
  return position ? (
    <Marker position={position}>
      <Popup>
        <strong>🎯 Destination</strong>
      </Popup>
    </Marker>
  ) : null;
}

function RoutePlanner() {
  // Default location: Pune
  const [position, setPosition] = useState([
    18.5204,
    73.8567,
  ]);

  // Destination text
  const [destination, setDestination] = useState("");

  // Destination coordinates
  const [destinationPosition, setDestinationPosition] =
    useState(null);

  // Route coordinates
  const [route, setRoute] = useState([]);

  // Loading states
  const [locationLoading, setLocationLoading] =
    useState(false);

  const [destinationLoading, setDestinationLoading] =
    useState(false);

  const [routeLoading, setRouteLoading] =
    useState(false);

  // Route information
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);

  // --------------------------------------------------
  // GET CURRENT LOCATION
  // --------------------------------------------------

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert(
        "Geolocation is not supported by your browser."
      );
      return;
    }

    setLocationLoading(true);

    navigator.geolocation.getCurrentPosition(
      (location) => {
        const latitude = location.coords.latitude;
        const longitude = location.coords.longitude;

        setPosition([latitude, longitude]);

        // Clear previous route
        setRoute([]);
        setDistance(null);
        setDuration(null);

        setLocationLoading(false);
      },

      (error) => {
        console.error(error);

        setLocationLoading(false);

        if (error.code === 1) {
          alert(
            "Location permission denied. Please allow location access."
          );
        } else {
          alert(
            "Unable to get your current location."
          );
        }
      },

      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  // --------------------------------------------------
  // SEARCH DESTINATION
  // --------------------------------------------------

  const searchDestination = async () => {
    if (!destination.trim()) {
      alert("Please enter a destination.");
      return;
    }

    try {
      setDestinationLoading(true);

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

      if (
        !response.data ||
        response.data.length === 0
      ) {
        alert("Destination not found.");
        return;
      }

      const result = response.data[0];

      const latitude = parseFloat(result.lat);
      const longitude = parseFloat(result.lon);

      setDestinationPosition([
        latitude,
        longitude,
      ]);

      // Clear previous route
      setRoute([]);
      setDistance(null);
      setDuration(null);
    } catch (error) {
      console.error(error);

      alert(
        "Unable to search destination. Please try again."
      );
    } finally {
      setDestinationLoading(false);
    }
  };

  // --------------------------------------------------
  // FIND ROAD ROUTE
  // --------------------------------------------------

  const findRoute = async () => {
    if (!destinationPosition) {
      alert(
        "Please search for a destination first."
      );
      return;
    }

    try {
      setRouteLoading(true);

      const startLatitude = position[0];
      const startLongitude = position[1];

      const destinationLatitude =
        destinationPosition[0];

      const destinationLongitude =
        destinationPosition[1];

      const url =
        `https://router.project-osrm.org/route/v1/driving/` +
        `${startLongitude},${startLatitude};` +
        `${destinationLongitude},${destinationLatitude}`;

      const response = await axios.get(url, {
        params: {
          overview: "full",
          geometries: "geojson",
        },
      });

      if (
        !response.data.routes ||
        response.data.routes.length === 0
      ) {
        alert("No route found.");
        return;
      }

      const routeData =
        response.data.routes[0];

      // OSRM gives coordinates as:
      // [longitude, latitude]

      const coordinates =
        routeData.geometry.coordinates;

      // Leaflet needs:
      // [latitude, longitude]

      const routeCoordinates =
        coordinates.map(
          ([longitude, latitude]) => [
            latitude,
            longitude,
          ]
        );

      setRoute(routeCoordinates);

      // Distance comes in meters
      const distanceInKm =
        routeData.distance / 1000;

      // Duration comes in seconds
      const durationInMinutes =
        routeData.duration / 60;

      setDistance(distanceInKm);
      setDuration(durationInMinutes);
    } catch (error) {
      console.error(error);

      alert(
        "Unable to find route. Please try again."
      );
    } finally {
      setRouteLoading(false);
    }
  };

  // --------------------------------------------------
  // JSX
  // --------------------------------------------------

  return (
    <div className="min-h-screen bg-gray-100">

      {/* HEADER */}
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

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-6 py-10">

        <div className="grid lg:grid-cols-3 gap-8">

          {/* LEFT PANEL */}
          <div className="bg-white rounded-2xl shadow-lg p-6">

            <h2 className="text-2xl font-bold mb-6">
              Plan Your Journey
            </h2>

            {/* CURRENT LOCATION */}

            <label className="font-semibold">
              Starting Location
            </label>

            <button
              onClick={getCurrentLocation}
              disabled={locationLoading}
              className="w-full mt-2 mb-6 border border-green-500 text-green-600 py-3 rounded-lg font-semibold hover:bg-green-50 disabled:opacity-50"
            >
              {locationLoading
                ? "📍 Getting Location..."
                : "📍 Use My Current Location"}
            </button>

            {/* DESTINATION */}

            <label className="font-semibold">
              Destination
            </label>

            <input
              type="text"
              value={destination}
              onChange={(e) =>
                setDestination(e.target.value)
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  searchDestination();
                }
              }}
              placeholder="Example: Pune Railway Station"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 mt-2 mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            {/* SEARCH BUTTON */}

            <button
              onClick={searchDestination}
              disabled={destinationLoading}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg transition disabled:opacity-50"
            >
              {destinationLoading
                ? "Searching..."
                : "🔍 Search Destination"}
            </button>

            {/* FIND ROUTE BUTTON */}

            <button
              onClick={findRoute}
              disabled={
                !destinationPosition ||
                routeLoading
              }
              className="w-full mt-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 rounded-lg transition"
            >
              {routeLoading
                ? "🚗 Finding Route..."
                : "🚗 Find Route"}
            </button>

            {/* DESTINATION INFORMATION */}

            {destinationPosition && (
              <div className="mt-6 bg-green-50 p-4 rounded-lg">

                <p className="font-semibold text-green-700">
                  🎯 Destination Found
                </p>

                <p className="text-sm text-gray-600 mt-2">
                  Latitude:{" "}
                  {destinationPosition[0].toFixed(5)}
                </p>

                <p className="text-sm text-gray-600">
                  Longitude:{" "}
                  {destinationPosition[1].toFixed(5)}
                </p>

              </div>
            )}

            {/* ROUTE INFORMATION */}

            {route.length > 0 && (
              <div className="mt-6 bg-blue-50 p-5 rounded-lg">

                <h3 className="font-bold text-lg mb-3">
                  🚗 Route Information
                </h3>

                <div className="flex justify-between">

                  <div>
                    <p className="text-gray-500 text-sm">
                      Distance
                    </p>

                    <p className="font-bold text-xl">
                      {distance?.toFixed(2)} km
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-500 text-sm">
                      Estimated Time
                    </p>

                    <p className="font-bold text-xl">
                      {Math.round(duration)} min
                    </p>
                  </div>

                </div>

              </div>
            )}

          </div>

          {/* MAP */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6">

            <h2 className="text-2xl font-bold mb-5">
              Route Map
            </h2>

            <div className="h-[500px] rounded-xl overflow-hidden">

              <MapContainer
                center={position}
                zoom={13}
                scrollWheelZoom={true}
                className="h-full w-full"
              >

                {/* OPENSTREETMAP */}

                <TileLayer
                  attribution='&copy; OpenStreetMap contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* START MARKER */}

                <LocationMarker
                  position={position}
                />

                {/* DESTINATION MARKER */}

                <DestinationMarker
                  position={
                    destinationPosition
                  }
                />

                {/* ROUTE LINE */}

                {route.length > 0 && (
                  <Polyline
                    positions={route}
                    pathOptions={{
                      color: "blue",
                      weight: 6,
                    }}
                  />
                )}

                {/* MAP MOVEMENT */}

                <MapUpdater
                  position={position}
                  destinationPosition={
                    destinationPosition
                  }
                  route={route}
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