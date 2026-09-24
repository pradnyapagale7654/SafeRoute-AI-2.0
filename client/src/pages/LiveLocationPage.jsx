import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { API_BASE_URL } from "../services/api";

const API_URL = `${API_BASE_URL}/location`;
const headers = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

function LiveLocationPage() {
  const { sessionId } = useParams();
  const [searchParams] = useSearchParams();
  const viewerToken = searchParams.get("token");
  const { token } = useAuth();
  const [session, setSession] = useState(null);
  const [shareUrl, setShareUrl] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const watchIdRef = useRef(null);

  const isViewer = Boolean(sessionId && viewerToken);

  const stopWatching = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  }, []);

  const fetchSession = useCallback(async () => {
    if (!sessionId) {
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/session/${sessionId}`, isViewer
        ? { params: { token: viewerToken } }
        : headers(token));
      setSession(response.data.session);
      setStatus(response.data.session.status === "active" ? "active" : "inactive");
      setMessage("");
    } catch (error) {
      setStatus("error");
      setMessage(error.response?.data?.message || "This live-location session is unavailable.");
    }
  }, [isViewer, sessionId, token, viewerToken]);

  useEffect(() => {
    const initialFetch = window.setTimeout(fetchSession, 0);
    if (!isViewer || !sessionId) {
      return () => window.clearTimeout(initialFetch);
    }

    const interval = window.setInterval(fetchSession, 5000);
    return () => {
      window.clearTimeout(initialFetch);
      window.clearInterval(interval);
    };
  }, [fetchSession, isViewer, sessionId]);

  const startSession = () => {
    if (!navigator.geolocation) {
      setStatus("error");
      setMessage("Live location is not supported by this browser.");
      return;
    }

    setStatus("starting");
    setMessage("");
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const response = await axios.post(
            `${API_URL}/session/start`,
            { latitude: coords.latitude, longitude: coords.longitude },
            headers(token)
          );
          const startedSession = response.data.session;
          setSession(startedSession);
          localStorage.setItem("safeRouteLastLocationAt", startedSession.lastUpdatedAt);
          setStatus("active");
          setShareUrl(`${window.location.origin}/live-location/${startedSession.sessionId}?token=${response.data.viewerToken}`);

          watchIdRef.current = navigator.geolocation.watchPosition(
            async ({ coords: nextCoords }) => {
              try {
                const updateResponse = await axios.post(
                  `${API_URL}/session/update`,
                  {
                    sessionId: startedSession.sessionId,
                    latitude: nextCoords.latitude,
                    longitude: nextCoords.longitude,
                  },
                  headers(token)
                );
                setSession(updateResponse.data.session);
                localStorage.setItem("safeRouteLastLocationAt", updateResponse.data.session.lastUpdatedAt);
              } catch {
                setMessage("Location update could not reach the server. Live sharing may be delayed.");
              }
            },
            () => setMessage("Location permission or signal was lost. Live sharing may be delayed."),
            { enableHighAccuracy: true, maximumAge: 10000, timeout: 15000 }
          );
        } catch (error) {
          setStatus("error");
          setMessage(error.response?.data?.message || error.message || "Unable to start live sharing. Check your connection and try again.");
        }
      },
      () => {
        setStatus("error");
        setMessage("Location permission was denied. Live sharing did not start.");
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
    );
  };

  const stopSession = async () => {
    if (!session) {
      return;
    }

    stopWatching();
    try {
      const response = await axios.post(
        `${API_URL}/session/stop`,
        { sessionId: session.sessionId },
        headers(token)
      );
      setSession(response.data.session);
      setStatus("inactive");
      setMessage("Live sharing stopped.");
    } catch (error) {
      setMessage(error.response?.data?.message || error.message || "Unable to stop live sharing. Check your connection and try again.");
    }
  };

  const copyShareUrl = async () => {
    if (!shareUrl || !navigator.clipboard) {
      setMessage("Copy is unavailable. Share the access link manually from the address field.");
      return;
    }
    await navigator.clipboard.writeText(shareUrl);
    setMessage("Authorized session link copied. Share it only with the intended contact.");
  };

  useEffect(() => () => stopWatching(), [stopWatching]);

  return (
    <main className="min-h-screen bg-[#f2f7f5] px-5 py-8 text-slate-900 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <Link to="/dashboard" className="font-bold text-[#315524]">← Dashboard</Link>
        <section className="mt-5 rounded-3xl bg-white p-7 shadow-sm sm:p-9">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#4c8b47]">Live location sharing</p>
          <h1 className="mt-2 text-4xl font-black text-[#102a2b]">A controlled view of your journey.</h1>
          <p className="mt-3 text-slate-600">Only the owner or someone with the session access link can see the latest location. This page does not expose location history.</p>

          {isViewer && <div className="mt-6 rounded-2xl bg-[#e8f1ff] p-4 text-sm font-semibold text-[#17335c]">You are viewing an authorized session. Updates are checked every five seconds while this page is connected.</div>}

          {!isViewer && !session && (
            <button type="button" onClick={startSession} disabled={status === "starting"} className="mt-7 w-full rounded-2xl bg-[#102a2b] px-5 py-4 font-black text-white hover:bg-[#1a4242] disabled:opacity-50">
              {status === "starting" ? "Requesting location..." : "Start live sharing"}
            </button>
          )}

          {session && (
            <div className="mt-7 space-y-4">
              <div className={`rounded-2xl p-5 ${session.status === "active" ? "bg-[#eef8e5]" : "bg-slate-100"}`}>
                <div className="flex items-center justify-between gap-4">
                  <p className="font-black text-[#315524]">{session.status === "active" ? "Live sharing active" : "Session inactive"}</p>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-black uppercase text-slate-600">{status}</span>
                </div>
                <p className="mt-4 text-3xl font-black text-[#102a2b]">{session.latestLatitude.toFixed(5)}, {session.latestLongitude.toFixed(5)}</p>
                <p className="mt-2 text-sm text-slate-600">Last location update: {new Date(session.lastUpdatedAt).toLocaleString()}</p>
                <a className="mt-3 inline-block font-bold text-[#315524]" href={`https://www.google.com/maps/search/?api=1&query=${session.latestLatitude},${session.latestLongitude}`} target="_blank" rel="noreferrer">Open latest location in maps</a>
              </div>

              {!isViewer && session.status === "active" && (
                <>
                  <div className="rounded-2xl border border-slate-200 p-4">
                    <p className="font-black text-slate-900">Authorized viewer link</p>
                    <p className="mt-1 break-all text-xs text-slate-500">Treat this link like a private access key.</p>
                    <button type="button" onClick={copyShareUrl} className="mt-3 rounded-xl bg-[#f3b562] px-4 py-3 font-black text-[#102a2b]">Copy access link</button>
                  </div>
                  <button type="button" onClick={stopSession} className="w-full rounded-xl border border-red-200 px-4 py-3 font-bold text-red-700 hover:bg-red-50">Stop live sharing</button>
                </>
              )}
            </div>
          )}

          {message && <p className="mt-5 rounded-xl bg-amber-50 p-3 text-sm font-semibold text-amber-800">{message}</p>}
          {!isViewer && !token && <p className="mt-5 rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-800">Sign in to start live sharing.</p>}
        </section>
      </div>
    </main>
  );
}

export default LiveLocationPage;
