import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/useAuth";

function AdminDashboard() {
  const navigate = useNavigate();
  const { token, user, signOut } = useAuth();
  const [overview, setOverview] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadOverview = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/admin/overview",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setOverview(response.data.overview);
      } catch (requestError) {
        setError(
          requestError.response?.data?.message ||
            "Unable to load admin overview."
        );
      }
    };

    loadOverview();
  }, [token]);

  const handleLogout = () => {
    signOut();
    navigate("/login");
  };

  return (
    <main className="min-h-screen bg-[#f2f7f5] px-5 py-8 text-slate-900 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="animate-rise flex flex-col justify-between gap-6 rounded-[2rem] bg-[#102a2b] p-7 text-white shadow-xl sm:flex-row sm:items-end sm:p-10">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#a7f36b]">
              Command centre
            </p>
            <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
              Admin overview
            </h1>
            <p className="mt-3 max-w-xl text-slate-300">
              Monitor the SafeRoute community and keep the safety network healthy.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-full border border-[#a7f36b]/40 px-4 py-2 text-sm text-[#d8ffb7]">
              {user.email}
            </span>
            <button
              onClick={handleLogout}
              className="rounded-full bg-[#f3b562] px-4 py-2 text-sm font-bold text-[#102a2b] hover:bg-[#ffc980]"
            >
              Log out
            </button>
          </div>
        </header>

        {error && (
          <p className="mt-5 rounded-xl bg-red-50 p-4 text-red-700">{error}</p>
        )}

        <section className="mt-7 grid gap-5 sm:grid-cols-3">
          <div className="animate-rise delay-1 rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-slate-500">Registered users</p>
            <p className="mt-3 text-4xl font-black text-[#102a2b]">
              {overview?.userCount ?? "--"}
            </p>
          </div>
          <div className="animate-rise delay-2 rounded-3xl bg-[#dff7bd] p-6 shadow-sm">
            <p className="text-sm font-semibold text-[#315524]">Administrators</p>
            <p className="mt-3 text-4xl font-black text-[#102a2b]">
              {overview?.adminCount ?? "--"}
            </p>
          </div>
          <div className="animate-rise delay-3 rounded-3xl bg-[#f3b562] p-6 shadow-sm">
            <p className="text-sm font-semibold text-[#704915]">System status</p>
            <p className="mt-3 text-3xl font-black text-[#102a2b]">
              {overview?.systemStatus ?? "Checking..."}
            </p>
          </div>
        </section>

        <section className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[['Active users', overview?.activeUsers], ['SOS events', overview?.sosEvents], ['Incident reports', overview?.incidentReports], ['Live sessions', overview?.activeLiveSessions]].map(([label, value]) => (
            <div key={label} className="rounded-2xl bg-white p-5 shadow-sm"><p className="text-sm font-bold text-slate-500">{label}</p><p className="mt-2 text-3xl font-black text-[#102a2b]">{value ?? "--"}</p></div>
          ))}
        </section>

        <section className="mt-7 grid gap-5 lg:grid-cols-2">
          <div className="rounded-3xl bg-white p-6 shadow-sm"><h2 className="text-xl font-black">Incident categories</h2><div className="mt-4 space-y-2">{(overview?.incidentCategories || []).map((item) => <div key={item._id} className="flex justify-between rounded-lg bg-slate-50 p-3 text-sm"><span>{item._id}</span><strong>{item.count}</strong></div>)}</div></div>
          <div className="rounded-3xl bg-white p-6 shadow-sm"><h2 className="text-xl font-black">Report status</h2><div className="mt-4 space-y-2">{(overview?.incidentStatuses || []).map((item) => <div key={item._id} className="flex justify-between rounded-lg bg-slate-50 p-3 text-sm"><span>{item._id}</span><strong>{item.count}</strong></div>)}</div></div>
        </section>

        <section className="mt-7 grid gap-5 lg:grid-cols-[1.4fr_0.8fr]">
          <div className="rounded-3xl bg-white p-7 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-widest text-[#4c8b47]">
                  Operations
                </p>
                <h2 className="mt-2 text-2xl font-black">Safety network tools</h2>
              </div>
              <span className="rounded-full bg-[#eef8e5] px-3 py-1 text-xs font-bold text-[#4c8b47]">
                Live foundation
              </span>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <button
                onClick={() => navigate("/route-planner")}
                className="group rounded-2xl bg-[#102a2b] p-5 text-left text-white transition hover:-translate-y-1 hover:bg-[#1a4242]"
              >
                <span className="text-2xl">⌁</span>
                <h3 className="mt-5 text-lg font-bold">Test route intelligence</h3>
                <p className="mt-2 text-sm text-slate-300">
                  Open the live map and verify route safety analysis.
                </p>
              </button>
              <div className="rounded-2xl border border-dashed border-slate-300 p-5">
                <span className="text-2xl">◉</span>
                <h3 className="mt-5 text-lg font-bold">Review incidents</h3>
                <p className="mt-2 text-sm text-slate-500">
                  Community reporting tools are ready for the next release.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-[#e8f1ff] p-7 shadow-sm">
            <p className="text-sm font-bold uppercase tracking-widest text-[#3864a3]">
              Admin note
            </p>
            <h2 className="mt-2 text-2xl font-black text-[#17335c]">
              Keep the data honest.
            </h2>
            <p className="mt-4 text-sm leading-6 text-[#3f5d86]">
              Safety scores are currently development estimates. Connect verified
              public datasets before presenting them as real-world risk statistics.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

export default AdminDashboard;
