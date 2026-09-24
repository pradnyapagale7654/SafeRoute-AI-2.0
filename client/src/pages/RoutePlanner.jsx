import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SosButton from "../components/SosButton";
import { API_BASE_URL } from "../services/api";

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
  const navigate = useNavigate();

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

  const [routes, setRoutes] = useState([]);

  const [selectedRouteId, setSelectedRouteId] =
    useState(null);

  const [routeComparisonLoading, setRouteComparisonLoading] =
    useState(false);

  const [routeComparisonError, setRouteComparisonError] =
    useState("");

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

  const [safetyWarnings, setSafetyWarnings] =
    useState([]);

  const [safetyDataSource, setSafetyDataSource] =
    useState("");

  const [safeZones, setSafeZones] = useState([]);

  const [routeSelected, setRouteSelected] =
    useState(false);

  const [routeSteps, setRouteSteps] =
    useState([]);

  const [routeNotice, setRouteNotice] =
    useState("");

  const [voicePlaying, setVoicePlaying] =
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

        setRoutes([]);

        setSelectedRouteId(null);

        setRouteComparisonError("");

        setRouteSelected(false);

        setRouteSteps([]);

        setRouteNotice("");

        setDistance(null);

        setDuration(null);

        setSafetyScore(null);

        setSafetyLevel("");

        setSafetyAnalysis(null);

        setSafetyError("");

        setSafetyWarnings([]);

        setSafetyDataSource("");

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

      setRoutes([]);

      setSelectedRouteId(null);

      setRouteComparisonError("");

      setRouteSelected(false);

      setRouteSteps([]);

      setRouteNotice("");

      setDistance(null);

      setDuration(null);

      setSafetyScore(null);

      setSafetyLevel("");

      setSafetyAnalysis(null);

      setSafetyError("");

      setSafetyWarnings([]);

      setSafetyDataSource("");

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
  // FIND AND ANALYZE ROUTES
  // ====================================================

  const analyzeRouteOption = async (routeData, index) => {
    const routeCoordinates = routeData.geometry.coordinates.map(
      ([longitude, latitude]) => [latitude, longitude]
    );
    const distanceInKm = routeData.distance / 1000;
    const durationInMinutes = routeData.duration / 60;

    try {
      const safetyResponse = await axios.post(
        `${API_BASE_URL}/safety/analyze`,
        {
          start: {
            latitude: position[0],
            longitude: position[1],
          },
          destination: {
            latitude: destinationPosition[0],
            longitude: destinationPosition[1],
          },
          routeCoordinates,
          distance: distanceInKm,
          duration: durationInMinutes,
          currentTime: new Date().toISOString(),
        }
      );

      return {
        id: `route-${index + 1}`,
        label: `Route ${index + 1}`,
        coordinates: routeCoordinates,
        distance: distanceInKm,
        duration: durationInMinutes,
        steps: routeData.legs?.[0]?.steps || [],
        safety: safetyResponse.data,
        safetyError: "",
      };
    } catch (error) {
      console.error(`Safety analysis failed for route ${index + 1}`, error);

      return {
        id: `route-${index + 1}`,
        label: `Route ${index + 1}`,
        coordinates: routeCoordinates,
        distance: distanceInKm,
        duration: durationInMinutes,
        steps: routeData.legs?.[0]?.steps || [],
        safety: null,
        safetyError: "Safety analysis unavailable",
      };
    }
  };

  const findRoute = async () => {
    if (!destinationPosition) {
      alert("Please search for a destination first.");
      return;
    }

    try {
      setRouteLoading(true);
      setRouteComparisonLoading(true);
      setRouteComparisonError("");
      setRoutes([]);
      setSelectedRouteId(null);

      const url =
        `https://router.project-osrm.org/route/v1/driving/` +
        `${position[1]},${position[0]};` +
        `${destinationPosition[1]},${destinationPosition[0]}`;
      const response = await axios.get(url, {
        params: {
          overview: "full",
          geometries: "geojson",
          steps: true,
          alternatives: true,
        },
      });

      if (!response.data.routes || response.data.routes.length === 0) {
        setRouteComparisonError("No route found for this destination.");
        setRoute([]);
        return;
      }

      const routeOptions = await Promise.all(
        response.data.routes.map(analyzeRouteOption)
      );
      const previewRoute = routeOptions[0];

      setRoutes(routeOptions);
      setRoute(previewRoute.coordinates);
      setDistance(previewRoute.distance);
      setDuration(previewRoute.duration);
      setRouteSteps(previewRoute.steps);
      setRouteSelected(false);
      setRouteNotice("Select a route below to make it active.");
      setSafetyScore(null);
      setSafetyLevel("");
      setSafetyAnalysis(null);
      setSafetyError("");
      setSafetyWarnings([]);
      setSafetyDataSource("");
    } catch (error) {
      console.error(error);
      setRouteComparisonError(
        "Unable to calculate routes. Please try again."
      );
    } finally {
      setRouteLoading(false);
      setRouteComparisonLoading(false);
    }
  };

  const selectRoute = (routeOption) => {
    setSelectedRouteId(routeOption.id);
    setRoute(routeOption.coordinates);
    setDistance(routeOption.distance);
    setDuration(routeOption.duration);
    setRouteSteps(routeOption.steps);
    setRouteSelected(false);
    setRouteNotice(`${routeOption.label} is now the active route.`);

    if (routeOption.safety) {
      setSafetyScore(routeOption.safety.safetyScore);
      setSafetyLevel(routeOption.safety.safetyLevel);
      setSafetyAnalysis(routeOption.safety.factors);
      setSafetyWarnings(routeOption.safety.warnings || []);
      setSafetyDataSource(routeOption.safety.dataSource || "");
      setSafetyError("");
    } else {
      setSafetyScore(null);
      setSafetyLevel("");
      setSafetyAnalysis(null);
      setSafetyWarnings([]);
      setSafetyDataSource("");
      setSafetyError(routeOption.safetyError);
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
          `${API_BASE_URL}/safety/analyze`,
        {
          start: {
            latitude: position[0],
            longitude: position[1],
          },
          destination: {
            latitude: destinationPosition[0],
            longitude: destinationPosition[1],
          },
          routeCoordinates: route,
          distance,
          duration,
          currentTime: new Date().toISOString(),
        }
      );

      const {
        safetyScore: score,
        safetyLevel: level,
        factors,
        warnings,
        dataSource,
      } =
        response.data;

      setSafetyScore(score);
      setSafetyLevel(level);
      setSafetyAnalysis(factors);
      setSafetyWarnings(warnings || []);
      setSafetyDataSource(dataSource || "");

      try {
        const nearbyResponse = await axios.get(
          `${API_BASE_URL}/safe-zones/nearby`,
          {
            params: {
              latitude: position[0],
              longitude: position[1],
              radiusKm: 5,
            },
          }
        );
        setSafeZones(nearbyResponse.data.safeZones || []);
      } catch (safeZoneError) {
        console.error("Safe-zone lookup failed:", safeZoneError);
        setSafeZones([]);
        setRouteNotice("Route safety analyzed. Nearby safe-zone data is unavailable.");
      }
    } catch (error) {
      console.error(error);
      setSafetyError(error.response?.data?.message || error.message || "Unable to analyze route safety. Please try again.");
      setSafeZones([]);
    } finally {
      setSafetyLoading(false);
    }
  };

  const useSafeRoute = () => {
    if (!route.length) {
      return;
    }

    setRouteSelected(true);
    setRouteNotice(
      "Safe route selected. Follow the directions below for your journey."
    );

    if ("Notification" in window) {
      const showNotification = () => {
        new Notification("SafeRoute AI", {
          body: "Your safe route is selected. Turn-by-turn directions are ready.",
        });
      };

      if (Notification.permission === "granted") {
        showNotification();
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            showNotification();
          }
        });
      }
    }
  };

  const speakDirections = () => {
    if (!("speechSynthesis" in window) || routeSteps.length === 0) {
      return;
    }

    window.speechSynthesis.cancel();
    const directionsText = routeSteps
      .map((step, index) => `${index + 1}. ${getStepInstruction(step)}`)
      .join(". ");
    const speech = new SpeechSynthesisUtterance(directionsText);

    speech.rate = 0.95;
    speech.onstart = () => setVoicePlaying(true);
    speech.onend = () => setVoicePlaying(false);
    speech.onerror = () => setVoicePlaying(false);
    window.speechSynthesis.speak(speech);
  };

  const stopDirections = () => {
    window.speechSynthesis.cancel();
    setVoicePlaying(false);
  };

  useEffect(() => {
    return () => window.speechSynthesis?.cancel();
  }, []);

  const getStepInstruction = (step) => {
    const type = step.maneuver?.type;
    const modifier = step.maneuver?.modifier;
    const roadName = step.name || "the road";

    if (type === "depart") {
      return `Start on ${roadName}`;
    }

    if (type === "arrive") {
      return "You have arrived at your destination";
    }

    if (type === "roundabout" || type === "rotary") {
      return `Enter the roundabout and take the ${roadName}`;
    }

    if (type === "merge") {
      return `Merge onto ${roadName}`;
    }

    if (type === "new name" || type === "continue") {
      return `Continue on ${roadName}`;
    }

    return `Turn ${modifier || "ahead"} onto ${roadName}`;
  };

  const shortestRouteId = routes.length
    ? routes.reduce((shortest, current) =>
        current.distance < shortest.distance ? current : shortest
      ).id
    : null;

  const fastestRouteId = routes.length
    ? routes.reduce((fastest, current) =>
        current.duration < fastest.duration ? current : fastest
      ).id
    : null;

  const safeRoutes = routes.filter((routeOption) => routeOption.safety);

  const safestRouteId = safeRoutes.length
    ? safeRoutes.reduce((best, current) =>
        current.safety.safetyScore > best.safety.safetyScore ? current : best
      ).id
    : null;

  const balancedRouteId = safeRoutes.length
    ? safeRoutes.reduce((best, current) => {
        const minScore = Math.min(...safeRoutes.map((route) => route.safety.safetyScore));
        const maxScore = Math.max(...safeRoutes.map((route) => route.safety.safetyScore));
        const minDistance = Math.min(...safeRoutes.map((route) => route.distance));
        const maxDistance = Math.max(...safeRoutes.map((route) => route.distance));
        const minDuration = Math.min(...safeRoutes.map((route) => route.duration));
        const maxDuration = Math.max(...safeRoutes.map((route) => route.duration));

        const safetyRange = maxScore - minScore || 1;
        const distanceRange = maxDistance - minDistance || 1;
        const durationRange = maxDuration - minDuration || 1;

        const scoreForRoute = (route) =>
          ((route.safety.safetyScore - minScore) / safetyRange) * 0.5 +
          ((maxDistance - route.distance) / distanceRange) * 0.25 +
          ((maxDuration - route.duration) / durationRange) * 0.25;

        return scoreForRoute(current) > scoreForRoute(best) ? current : best;
      }).id
    : null;

  const routeTagStyles = {
    Safest: "bg-emerald-100 text-emerald-700",
    Shortest: "bg-blue-100 text-blue-700",
    Fastest: "bg-orange-100 text-orange-700",
    Balanced: "bg-violet-100 text-violet-700",
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

          <div className="mt-5">
            <SosButton />
          </div>

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

            {routeComparisonLoading && (
              <p className="mt-4 rounded-lg bg-blue-50 p-3 text-sm font-semibold text-blue-700">
                Calculating routes and analyzing safety...
              </p>
            )}

            {routeComparisonError && (
              <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                {routeComparisonError}
              </p>
            )}

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

            {routes.length > 0 && !routeComparisonLoading && (
              <div className="mt-6 rounded-xl bg-slate-50 p-4">
                <h3 className="text-xl font-bold text-slate-900">
                  Route Comparison
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Compare the available options and choose the route that fits your journey.
                </p>

                <div className="mt-4 space-y-4">
                  {routes.map((routeOption) => {
                    const isSelected = selectedRouteId === routeOption.id;
                    const safety = routeOption.safety;
                    const routeLabels = [];

                    if (routeOption.id === safestRouteId) routeLabels.push("Safest");
                    if (routeOption.id === shortestRouteId) routeLabels.push("Shortest");
                    if (routeOption.id === fastestRouteId) routeLabels.push("Fastest");
                    if (routeOption.id === balancedRouteId) routeLabels.push("Balanced");

                    return (
                      <button
                        key={routeOption.id}
                        onClick={() => selectRoute(routeOption)}
                        className={`w-full rounded-xl border p-4 text-left transition hover:-translate-y-0.5 hover:shadow ${
                          isSelected
                            ? "border-green-500 bg-green-50 ring-2 ring-green-200"
                            : "border-slate-200 bg-white"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-bold text-slate-900">
                              {routeOption.label}
                            </p>
                            <p className="mt-1 text-sm text-slate-600">
                              {routeOption.distance.toFixed(2)} km · {Math.round(routeOption.duration)} min
                            </p>
                          </div>
                          {isSelected && (
                            <span className="rounded-full bg-green-600 px-3 py-1 text-xs font-bold text-white">
                              Active
                            </span>
                          )}
                        </div>

                        {routeLabels.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
                            {routeLabels.map((label) => (
                              <span
                                key={`${routeOption.id}-${label}`}
                                className={`rounded-full px-2 py-1 ${routeTagStyles[label] || "bg-slate-100 text-slate-700"}`}
                              >
                                {label}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="mt-4 border-t border-slate-200 pt-3">
                          <p className="text-sm text-slate-500">Safety score</p>
                          {safety ? (
                            <p className="mt-1 text-2xl font-black text-green-600">
                              {safety.safetyScore}/100
                              <span className="ml-2 text-sm font-bold">
                                {safety.safetyLevel}
                              </span>
                            </p>
                          ) : (
                            <p className="mt-1 text-sm font-semibold text-amber-700">
                              {routeOption.safetyError}
                            </p>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
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

                <button
                  onClick={() =>
                    navigate("/assistant", {
                      state: {
                        destination: destination || "your destination",
                        routeLabel: selectedRouteId ? `Route ${selectedRouteId}` : "the selected route",
                        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                        startLat: position[0],
                        startLng: position[1],
                        endLat: destinationPosition?.[0],
                        endLng: destinationPosition?.[1],
                        prompt: `What safety risks should I watch for on my trip to ${destination || "my destination"}?`,
                      },
                    })
                  }
                  className="mt-3 w-full rounded-lg border border-[#102a2b] bg-white px-4 py-3 font-bold text-[#102a2b] hover:bg-[#f2f7f5]"
                >
                  🤖 Ask AI Assistant about this route
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

                      {safetyDataSource && (
                        <p className="mt-3 text-xs font-semibold text-amber-700">
                          {safetyDataSource}
                        </p>
                      )}

                  </div>

                  {safetyWarnings.length > 0 && (
                    <div className="mt-5 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
                      {safetyWarnings.map((warning) => (
                        <p key={warning}>⚠️ {warning}</p>
                      ))}
                    </div>
                  )}

                  {safeZones.length > 0 && (
                    <div className="mt-6 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                      <h4 className="text-lg font-bold text-emerald-800">Nearby Safe Zones</h4>
                      <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
                        DEMO DATA - development seed values only
                      </p>
                      <div className="mt-3 space-y-2">
                        {safeZones.map((zone) => (
                          <div key={zone.id} className="rounded-md bg-white p-2 text-sm text-slate-700">
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-semibold text-slate-800">{zone.name}</span>
                              <span className="rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-bold uppercase text-emerald-700">
                                {zone.type}
                              </span>
                            </div>
                            <p className="mt-1 text-xs text-slate-500">{zone.distanceKm} km away</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

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

                  {routeNotice && (
                    <div className="mt-4 rounded-lg bg-blue-50 p-3 text-sm font-semibold text-blue-800">
                      🔔 {routeNotice}
                    </div>
                  )}

                  {routeSelected && routeSteps.length > 0 && (
                    <div className="mt-5 border-t border-slate-200 pt-5">
                      <h4 className="text-lg font-bold text-slate-900">
                        Turn-by-turn directions
                      </h4>
                      <button
                        onClick={voicePlaying ? stopDirections : speakDirections}
                        className="mt-3 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        {voicePlaying
                          ? "🔇 Stop voice directions"
                          : "🔊 Read directions aloud"}
                      </button>
                      <ol className="mt-3 max-h-64 space-y-3 overflow-y-auto pr-2">
                        {routeSteps.map((step, index) => (
                          <li
                            key={`${step.maneuver?.location?.join("-")}-${index}`}
                            className="flex gap-3 text-sm text-slate-700"
                          >
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                              {index + 1}
                            </span>
                            <span>
                              {getStepInstruction(step)}
                              <span className="block text-xs text-slate-500">
                                {Math.round(step.distance)} m
                              </span>
                            </span>
                          </li>
                        ))}
                      </ol>
                    </div>
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

                {/* ROUTES */}

                {routes.length > 0
                  ? routes.map((routeOption) => (
                      <Polyline
                        key={routeOption.id}
                        positions={routeOption.coordinates}
                        eventHandlers={{
                          click: () => selectRoute(routeOption),
                        }}
                        pathOptions={{
                          color:
                            selectedRouteId === routeOption.id
                              ? "#16a34a"
                              : "#64748b",
                          weight:
                            selectedRouteId === routeOption.id
                              ? 7
                              : 4,
                          opacity:
                            selectedRouteId === routeOption.id
                              ? 1
                              : 0.55,
                        }}
                      />
                    ))
                  : route.length > 0 && (
                      <Polyline
                        positions={route}
                        pathOptions={{
                          color: "#2563eb",
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