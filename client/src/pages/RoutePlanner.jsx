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

// ======================================================
// MAP UPDATER
// ======================================================

function MapUpdater({
  position,
  destinationPosition,
  route,
}) {
  const map = useMap();

  if (route.length > 0) {
    map.fitBounds(route, {
      padding: [30, 30],
    });
  } else if (destinationPosition) {
    map.fitBounds(
      [position, destinationPosition],
      {
        padding: [50, 50],
      }
    );
  } else if (position) {
    map.setView(position, 14);
  }

  return null;
}

// ======================================================
// STARTING LOCATION MARKER
// ======================================================

function LocationMarker({ position }) {
  if (!position) {
    return null;
  }

  return (
    <Marker position={position}>
      <Popup>
        <strong>📍 Starting Location</strong>
        <br />
        You are here.
      </Popup>
    </Marker>
  );
}

// ======================================================
// DESTINATION MARKER
// ======================================================

function DestinationMarker({ position }) {
  if (!position) {
    return null;
  }

  return (
    <Marker position={position}>
      <Popup>
        <strong>🎯 Destination</strong>
      </Popup>
    </Marker>
  );
}

// ======================================================
// MAIN COMPONENT
// ======================================================

function RoutePlanner() {

  // ----------------------------------------------------
  // LOCATION
  // ----------------------------------------------------

  const [position, setPosition] = useState([
    18.5204,
    73.8567,
  ]);

  // ----------------------------------------------------
  // DESTINATION
  // ----------------------------------------------------

  const [destination, setDestination] =
    useState("");

  const [
    destinationPosition,
    setDestinationPosition,
  ] = useState(null);

  // ----------------------------------------------------
  // ROUTE
  // ----------------------------------------------------

  const [route, setRoute] = useState([]);

  const [distance, setDistance] =
    useState(null);

  const [duration, setDuration] =
    useState(null);

  // ----------------------------------------------------
  // LOADING STATES
  // ----------------------------------------------------

  const [locationLoading, setLocationLoading] =
    useState(false);

  const [destinationLoading, setDestinationLoading] =
    useState(false);

  const [routeLoading, setRouteLoading] =
    useState(false);

  // ----------------------------------------------------
  // SAFETY ANALYSIS
  // ----------------------------------------------------

  const [safetyScore, setSafetyScore] =
    useState(null);

  const [safetyLevel, setSafetyLevel] =
    useState("");

  const [safetyAnalysis, setSafetyAnalysis] =
    useState(null);

  const [safetyLoading, setSafetyLoading] =
    useState(false);

  const [safetyError, setSafetyError] =
    useState("");

  const [routeSelected, setRouteSelected] =
    useState(false);

  // ====================================================
  // GET CURRENT LOCATION
  // ====================================================

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

        const latitude =
          location.coords.latitude;

        const longitude =
          location.coords.longitude;

        setPosition([
          latitude,
          longitude,
        ]);

        // Clear previous route

        setRoute([]);

        setRouteSelected(false);

        setDistance(null);

        setDuration(null);

        setSafetyScore(null);

        setSafetyLevel("");

        setSafetyAnalysis(null);

        setSafetyError("");

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

  // ====================================================
  // SEARCH DESTINATION
  // ====================================================

  const searchDestination = async () => {

    if (!destination.trim()) {

      alert(
        "Please enter a destination."
      );

      return;
    }

    try {

      setDestinationLoading(true);

      const response =
        await axios.get(
          "https://nominatim.openstreetmap.org/search",
          {
            params: {
              q: destination,
              format: "json",
              limit: 1,
            },

            headers: {
              Accept:
                "application/json",
            },
          }
        );

      if (
        !response.data ||
        response.data.length === 0
      ) {

        alert(
          "Destination not found."
        );

        return;
      }

      const result =
        response.data[0];

      const latitude =
        parseFloat(result.lat);

      const longitude =
        parseFloat(result.lon);

      setDestinationPosition([
        latitude,
        longitude,
      ]);

      // Clear old route

      setRoute([]);

      setRouteSelected(false);

      setDistance(null);

      setDuration(null);

      setSafetyScore(null);

      setSafetyLevel("");

      setSafetyAnalysis(null);

      setSafetyError("");

    } catch (error) {

      console.error(error);

      alert(
        "Unable to search destination. Please try again."
      );

    } finally {

      setDestinationLoading(false);
    }
  };

  // ====================================================
  // FIND ROUTE
  // ====================================================

  const findRoute = async () => {

    if (!destinationPosition) {

      alert(
        "Please search for a destination first."
      );

      return;
    }

    try {

      setRouteLoading(true);

      const startLatitude =
        position[0];

      const startLongitude =
        position[1];

      const destinationLatitude =
        destinationPosition[0];

      const destinationLongitude =
        destinationPosition[1];

      const url =
        `https://router.project-osrm.org/route/v1/driving/` +
        `${startLongitude},${startLatitude};` +
        `${destinationLongitude},${destinationLatitude}`;

      const response =
        await axios.get(url, {
          params: {
            overview: "full",
            geometries: "geojson",
          },
        });

      if (
        !response.data.routes ||
        response.data.routes.length === 0
      ) {

        alert(
          "No route found."
        );

        return;
      }

      const routeData =
        response.data.routes[0];

      // OSRM returns:
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

      setRoute(
        routeCoordinates
      );

      setRouteSelected(false);

      // Distance in meters
      const distanceInKm =
        routeData.distance / 1000;

      // Duration in seconds
      const durationInMinutes =
        routeData.duration / 60;

      setDistance(
        distanceInKm
      );

      setDuration(
        durationInMinutes
      );

      // Clear previous safety result

      setSafetyScore(null);

      setSafetyLevel("");

      setSafetyAnalysis(null);

      setSafetyError("");

    } catch (error) {

      console.error(error);

      alert(
        "Unable to find route. Please try again."
      );

    } finally {

      setRouteLoading(false);
    }
  };

  // ====================================================
  // ANALYZE ROUTE SAFETY
  // ====================================================

  const analyzeSafety = async () => {

    if (!route.length) {

      alert(
        "Please find a route first."
      );

      return;
    }

    try {
      setSafetyLoading(true);
      setSafetyError("");

      const response = await axios.post(
        "http://localhost:5000/api/safety/analyze"
      );

      const { safetyScore: score, safetyLevel: level, factors } =
        response.data;

      setSafetyScore(score);
      setSafetyLevel(level);
      setSafetyAnalysis(factors);
    } catch (error) {
      console.error(error);
      setSafetyError(
        "Unable to analyze route safety. Please try again."
      );
    } finally {
      setSafetyLoading(false);
    }
  };

  const useSafeRoute = () => {
    if (!route.length) {
      return;
    }

    setRouteSelected(true);
  };

  // ====================================================
  // UI
  // ====================================================

  return (

    <div className="min-h-screen bg-gray-100">

      {/* =================================================
          HEADER
      ================================================= */}

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

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <div className="max-w-7xl mx-auto px-6 py-10">

        <div className="grid lg:grid-cols-3 gap-8">

          {/* =================================================
              LEFT CONTROL PANEL
          ================================================= */}

          <div className="bg-white rounded-2xl shadow-lg p-6">

            <h2 className="text-2xl font-bold mb-6">
              Plan Your Journey
            </h2>

            {/* -----------------------------------------------
                STARTING LOCATION
            ------------------------------------------------ */}

            <label className="font-semibold">
              Starting Location
            </label>

            <button
              onClick={
                getCurrentLocation
              }
              disabled={
                locationLoading
              }
              className="w-full mt-2 mb-6 border border-green-500 text-green-600 py-3 rounded-lg font-semibold hover:bg-green-50 disabled:opacity-50"
            >

              {locationLoading
                ? "📍 Getting Location..."
                : "📍 Use My Current Location"}

            </button>

            {/* -----------------------------------------------
                DESTINATION
            ------------------------------------------------ */}

            <label className="font-semibold">
              Destination
            </label>

            <input
              type="text"
              value={destination}
              onChange={(e) =>
                setDestination(
                  e.target.value
                )
              }
              onKeyDown={(e) => {

                if (e.key === "Enter") {

                  searchDestination();

                }

              }}
              placeholder="Example: Pune Railway Station"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 mt-2 mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            {/* SEARCH DESTINATION */}

            <button
              onClick={
                searchDestination
              }
              disabled={
                destinationLoading
              }
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg transition disabled:opacity-50"
            >

              {destinationLoading
                ? "Searching..."
                : "🔍 Search Destination"}

            </button>

            {/* FIND ROUTE */}

            <button
              onClick={
                findRoute
              }
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

            {/* -----------------------------------------------
                DESTINATION INFORMATION
            ------------------------------------------------ */}

            {destinationPosition && (

              <div className="mt-6 bg-green-50 p-4 rounded-lg">

                <p className="font-semibold text-green-700">
                  🎯 Destination Found
                </p>

                <p className="text-sm text-gray-600 mt-2">
                  Latitude:{" "}
                  {destinationPosition[0].toFixed(
                    5
                  )}
                </p>

                <p className="text-sm text-gray-600">
                  Longitude:{" "}
                  {destinationPosition[1].toFixed(
                    5
                  )}
                </p>

              </div>

            )}

            {/* -----------------------------------------------
                ROUTE INFORMATION
            ------------------------------------------------ */}

            {route.length > 0 && (

              <div className="mt-6 bg-blue-50 p-5 rounded-lg">

                <h3 className="font-bold text-lg mb-4">
                  🚗 Route Information
                </h3>

                <div className="flex justify-between">

                  <div>

                    <p className="text-gray-500 text-sm">
                      Distance
                    </p>

                    <p className="font-bold text-xl">
                      {distance !== null
                        ? `${distance.toFixed(
                            2
                          )} km`
                        : "--"}
                    </p>

                  </div>

                  <div>

                    <p className="text-gray-500 text-sm">
                      Estimated Time
                    </p>

                    <p className="font-bold text-xl">
                      {duration !== null
                        ? `${Math.round(
                            duration
                          )} min`
                        : "--"}
                    </p>

                  </div>

                </div>

                {/* ANALYZE SAFETY BUTTON */}

                <button
                  onClick={
                    analyzeSafety
                  }
                  disabled={safetyLoading}
                  className="w-full mt-5 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg transition"
                >
                  {safetyLoading
                    ? "Analyzing Route..."
                    : "🛡️ Analyze Route Safety"}
                </button>

                {safetyError && (
                  <p className="mt-3 text-sm text-red-600">
                    {safetyError}
                  </p>
                )}

              </div>

            )}

            {/* =================================================
                SAFETY ANALYSIS
            ================================================= */}

            {safetyScore !== null &&
              safetyAnalysis && (

                <div className="mt-6 bg-white border-2 border-green-200 rounded-xl p-5 shadow">

                  <h3 className="text-2xl font-bold mb-5">
                    🛡️ Route Safety Analysis
                  </h3>

                  {/* SAFETY SCORE */}

                  <div className="text-center mb-6">

                    <p className="text-gray-500">
                      Safety Score
                    </p>

                    <p className="text-5xl font-bold text-green-600 mt-2">
                      {safetyScore}/100
                    </p>

                    <p className="text-green-600 font-semibold mt-2">
                      {safetyLevel}
                    </p>

                  </div>

                  {/* SAFETY FACTORS */}

                  <div className="space-y-4">

                    {/* CRIME */}

                    <div className="flex justify-between items-center">

                      <span>
                        🚨 Crime Risk
                      </span>

                      <span className="font-semibold text-green-600">
                        {
                          safetyAnalysis.crimeRisk
                        }
                      </span>

                    </div>

                    {/* LIGHTING */}

                    <div className="flex justify-between items-center">

                      <span>
                        💡 Street Lighting
                      </span>

                      <span className="font-semibold text-green-600">
                        {
                          safetyAnalysis.lighting
                        }
                      </span>

                    </div>

                    {/* TRAFFIC */}

                    <div className="flex justify-between items-center">

                      <span>
                        🚗 Traffic
                      </span>

                      <span className="font-semibold text-green-600">
                        {
                          safetyAnalysis.traffic
                        }
                      </span>

                    </div>

                    {/* COMMUNITY REPORTS */}

                    <div className="flex justify-between items-center">

                      <span>
                        👥 Community Reports
                      </span>

                      <span className="font-semibold text-green-600">
                        {
                          safetyAnalysis.communityReports
                        }
                      </span>

                    </div>

                  </div>

                  {/* USE ROUTE BUTTON */}

                  <button
                    onClick={useSafeRoute}
                    disabled={routeSelected}
                    className="w-full mt-6 bg-green-600 hover:bg-green-700 disabled:bg-green-700 text-white font-bold py-3 rounded-lg transition"
                  >
                    {routeSelected
                      ? "✅ Safe Route Selected"
                      : "✅ Use This Safe Route"}
                  </button>

                  {routeSelected && (
                    <p className="mt-3 text-center text-sm font-semibold text-green-700">
                      This route is selected for your journey.
                    </p>
                  )}

                </div>

              )}

          </div>

          {/* =================================================
              MAP
          ================================================= */}

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

                {/* STARTING LOCATION */}

                <LocationMarker
                  position={
                    position
                  }
                />

                {/* DESTINATION */}

                <DestinationMarker
                  position={
                    destinationPosition
                  }
                />

                {/* ROUTE */}

                {route.length > 0 && (

                  <Polyline
                    positions={
                      route
                    }
                    pathOptions={{
                      color: "blue",
                      weight: 6,
                    }}
                  />

                )}

                {/* UPDATE MAP */}

                <MapUpdater
                  position={
                    position
                  }
                  destinationPosition={
                    destinationPosition
                  }
                  route={
                    route
                  }
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