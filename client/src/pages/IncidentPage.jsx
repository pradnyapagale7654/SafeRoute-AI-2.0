import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const API_URL = "http://localhost:5000/api/incidents";
const categories = ["harassment", "suspicious activity", "accident", "blocked road", "streetlight outage", "flooding", "dog attack", "unsafe area", "other"];

function IncidentPage() {
  const { token } = useAuth();
  const [position, setPosition] = useState(null);
  const [incidents, setIncidents] = useState([]);
  const [form, setForm] = useState({ category: categories[0], description: "", severity: "medium" });
  const [message, setMessage] = useState("");

  const loadNearby = useCallback(async (coords) => {
    if (!coords) return;
    try {
      const response = await axios.get(`${API_URL}/nearby`, { params: { latitude: coords.latitude, longitude: coords.longitude, radiusKm: 5 } });
      setIncidents(response.data.incidents || []);
    } catch {
      setMessage("Nearby community reports are unavailable right now.");
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (!navigator.geolocation) {
        setMessage("Location is not supported by this browser.");
        return;
      }
      navigator.geolocation.getCurrentPosition(({ coords }) => {
        const next = { latitude: coords.latitude, longitude: coords.longitude };
        setPosition(next);
        loadNearby(next);
      }, () => setMessage("Allow location access to report or view nearby signals."));
    }, 0);
    return () => window.clearTimeout(timer);
  }, [loadNearby]);

  const submit = async (event) => {
    event.preventDefault();
    if (!position) return setMessage("Current location is required for an incident report.");
    try {
      await axios.post(API_URL, { ...form, ...position }, { headers: { Authorization: `Bearer ${token}` } });
      setForm({ category: categories[0], description: "", severity: "medium" });
      setMessage("Report submitted as an unverified community signal.");
      await loadNearby(position);
    } catch (error) {
      setMessage(error.response?.data?.message || "Unable to submit report.");
    }
  };

  const confirm = async (incidentId) => {
    try {
      await axios.post(`${API_URL}/${incidentId}/confirm`, {}, { headers: { Authorization: `Bearer ${token}` } });
      await loadNearby(position);
    } catch (error) {
      setMessage(error.response?.data?.message || "Unable to confirm report.");
    }
  };

  return (
    <main className="min-h-screen bg-[#f2f7f5] px-5 py-8 text-slate-900 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <Link to="/dashboard" className="font-bold text-[#315524]">← Dashboard</Link>
        <header className="mt-5 rounded-3xl bg-[#102a2b] p-7 text-white shadow-xl">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#a7f36b]">Community safety signals</p>
          <h1 className="mt-2 text-4xl font-black">Report what you see.</h1>
          <p className="mt-3 max-w-2xl text-slate-300">Reports are user-generated signals, not verified facts. They expire automatically and should not be treated as confirmed incidents.</p>
        </header>
        <div className="mt-6 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <form onSubmit={submit} className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-black">New report</h2>
            <label className="mt-5 block text-sm font-bold">Category<select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-3">{categories.map((category) => <option key={category}>{category}</option>)}</select></label>
            <label className="mt-4 block text-sm font-bold">Severity<select value={form.severity} onChange={(event) => setForm({ ...form, severity: event.target.value })} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-3"><option>low</option><option>medium</option><option>high</option><option>critical</option></select></label>
            <textarea required minLength={5} rows="5" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="Describe the safety issue" className="mt-4 w-full rounded-xl border border-slate-300 px-3 py-3" />
            <button type="submit" className="mt-4 w-full rounded-xl bg-[#102a2b] px-4 py-3 font-black text-white">Submit unverified report</button>
          </form>
          <section className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4"><h2 className="text-2xl font-black">Nearby reports</h2><span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-800">UNVERIFIED SIGNALS</span></div>
            <div className="mt-5 space-y-3">{incidents.length === 0 ? <p className="text-sm text-slate-500">No active reports found nearby.</p> : incidents.map((incident) => <article key={incident._id} className="rounded-2xl border border-slate-200 p-4"><div className="flex justify-between gap-3"><p className="font-black">{incident.category}</p><span className="text-xs font-bold uppercase text-slate-500">{incident.severity}</span></div><p className="mt-2 text-sm text-slate-600">{incident.description}</p><p className="mt-2 text-xs text-slate-500">{incident.confirmationCount || 0} confirmations · expires {new Date(incident.expiresAt).toLocaleDateString()}</p><button type="button" onClick={() => confirm(incident._id)} className="mt-3 rounded-lg border border-[#4c8b47] px-3 py-2 text-sm font-bold text-[#315524]">Confirm this signal</button></article>)}</div>
          </section>
        </div>
        {message && <p className="mt-5 rounded-xl bg-amber-50 p-4 text-sm font-semibold text-amber-800">{message}</p>}
      </div>
    </main>
  );
}

export default IncidentPage;
