import { useState } from "react";
import { Link } from "react-router-dom";

function MovementSignalPage() {
  const [optedIn, setOptedIn] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  return (
    <main className="min-h-screen bg-[#f2f7f5] px-5 py-8 text-slate-900 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <Link to="/dashboard" className="font-bold text-[#315524]">← Dashboard</Link>
        <section className="mt-5 rounded-3xl bg-white p-7 shadow-sm sm:p-9">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#4c8b47]">Privacy control</p>
          <h1 className="mt-2 text-4xl font-black text-[#102a2b]">Movement pattern signal</h1>
          <p className="mt-4 leading-7 text-slate-600">This is an assistive anomaly signal, not an accusation. It only evaluates repeated proximity between your samples and another authorized, visible device across multiple points.</p>
          <label className="mt-6 flex items-center gap-3 rounded-2xl bg-[#eef8e5] p-4 font-bold text-[#315524]"><input type="checkbox" checked={optedIn} onChange={(event) => setOptedIn(event.target.checked)} /> Opt in to movement-pattern evaluation</label>
          {!dismissed && <div className="mt-5 rounded-2xl border border-slate-200 p-4 text-sm text-slate-600"><p>No signal is active until sufficient authorized device samples exist. Strangers are not identified or tracked.</p><button type="button" onClick={() => setDismissed(true)} className="mt-3 font-bold text-[#315524]">Dismiss</button></div>}
          <p className="mt-6 text-sm font-semibold text-slate-500">Current status: {optedIn ? "Opted in; awaiting authorized samples" : "Opted out"}</p>
        </section>
      </div>
    </main>
  );
}

export default MovementSignalPage;