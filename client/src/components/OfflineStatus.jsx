import { useEffect, useState } from "react";

function OfflineStatus() {
  const [online, setOnline] = useState(() => navigator.onLine);
  const [lastLocation, setLastLocation] = useState(() => localStorage.getItem("safeRouteLastLocationAt"));

  useEffect(() => {
    const update = () => {
      setOnline(navigator.onLine);
      setLastLocation(localStorage.getItem("safeRouteLastLocationAt"));
    };
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);

  if (online) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-[2000] rounded-2xl bg-slate-900 p-4 text-sm text-white shadow-xl sm:left-auto sm:max-w-sm">
      <p className="font-black">Offline Emergency Mode</p>
      <p className="mt-1 text-slate-300">Offline. Browser actions only. SMS and live location are unavailable without connectivity.</p>
      <p className="mt-1 text-xs text-slate-400">Last location update: {lastLocation ? new Date(lastLocation).toLocaleString() : "Not available"}</p>
    </div>
  );
}

export default OfflineStatus;
