import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { buildAssistantSummary, getRouteAwarePrompts, normalizeFactorList } from "../utils/assistantUtils";

function AssistantPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const plannerState = location.state || {};
  const [prompt, setPrompt] = useState(
    plannerState.prompt || "I am going to Pune Station at 11 PM."
  );
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hi! I can suggest a safer travel plan based on your route, weather, and time context.",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (plannerState.routeHint) {
      setPrompt((current) => current || plannerState.routeHint);
    }
  }, [plannerState.routeHint]);

  const sendPrompt = async (nextPrompt) => {
    const trimmedPrompt = (nextPrompt || prompt || "").trim();

    if (!trimmedPrompt) {
      setError("Please enter a travel request.");
      return;
    }

    setMessages((current) => [...current, { role: "user", text: trimmedPrompt }]);
    setLoading(true);
    setError("");

    try {
      const response = await axios.post("http://localhost:5000/api/assistant/chat", {
        prompt: trimmedPrompt,
        currentLocation: {
          latitude: plannerState.startLat || 18.5204,
          longitude: plannerState.startLng || 73.8567,
        },
      });

      const data = response.data;
      setResult(data);
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          text: data?.routeAwareSummary || buildAssistantSummary(data, {
            destination: plannerState.destination || data?.destination || "your destination",
            time: plannerState.time || "the selected travel time",
          }),
        },
      ]);
      setPrompt("");
    } catch (assistantError) {
      const message =
        assistantError.response?.data?.message || "Unable to generate travel guidance.";
      setMessages((current) => [
        ...current,
        { role: "assistant", text: message },
      ]);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const presetPrompts = getRouteAwarePrompts({
    destination: plannerState.destination || "Pune Station",
    time: plannerState.time || "evening",
    routeLabel: plannerState.routeLabel || "the selected route",
  });

  return (
    <main className="min-h-screen bg-[#f2f7f5] px-5 py-8 text-slate-900 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-6 flex flex-col gap-4 rounded-[2rem] bg-[#102a2b] p-6 text-white shadow-xl sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#a7f36b]">SafeRoute AI</p>
            <h1 className="mt-2 text-3xl font-black">Travel Assistant</h1>
          </div>
          <button
            onClick={() => navigate("/dashboard")}
            className="rounded-full border border-[#a7f36b] px-5 py-3 font-bold text-[#d8ffb7] hover:bg-[#a7f36b] hover:text-[#102a2b]"
          >
            Back to dashboard
          </button>
        </header>

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <aside className="rounded-3xl bg-white p-5 shadow-sm">
            <h2 className="text-xl font-black text-[#102a2b]">Quick prompts</h2>
            <div className="mt-4 space-y-3">
              {presetPrompts.map((preset) => (
                <button
                  key={preset}
                  onClick={() => sendPrompt(preset)}
                  className="w-full rounded-2xl border border-slate-200 bg-[#f8fafc] px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:border-[#4c8b47] hover:bg-[#eef8e5]"
                >
                  {preset}
                </button>
              ))}
            </div>
          </aside>

          <section className="rounded-3xl bg-white p-5 shadow-sm">
            <div className="max-h-[420px] space-y-3 overflow-y-auto pr-2">
              {messages.map((message, index) => (
                <div
                  key={`${message.role}-${index}`}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                      message.role === "user"
                        ? "bg-[#102a2b] text-white"
                        : "bg-[#f2f7f5] text-slate-700 ring-1 ring-slate-200"
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="rounded-2xl bg-[#f2f7f5] px-4 py-3 text-sm text-slate-700 ring-1 ring-slate-200">
                    Planning a safer trip...
                  </div>
                </div>
              )}
            </div>

            <form
              onSubmit={(event) => {
                event.preventDefault();
                sendPrompt(prompt);
              }}
              className="mt-5 space-y-4"
            >
              <textarea
                rows="3"
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                placeholder="Tell me where you're going and when..."
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-800 outline-none focus:border-[#4c8b47] focus:ring-2 focus:ring-[#dff7bd]"
              />
              <button
                type="submit"
                disabled={loading}
                className="rounded-xl bg-[#102a2b] px-5 py-3 font-bold text-white hover:bg-[#1a4242] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Thinking..." : "Ask assistant"}
              </button>
            </form>

            {error && (
              <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}
          </section>
        </div>

        {result && (
          <section className="mt-6 rounded-3xl bg-[#eef8e5] p-6 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#315524]">Recommendation</p>
                <h3 className="mt-2 text-2xl font-black text-[#102a2b]">{result.destination}</h3>
              </div>
              <div className="rounded-full bg-[#102a2b] px-3 py-2 text-sm font-bold text-[#dff7bd]">
                Safety score: {result.safetyScore ?? "N/A"}
              </div>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl bg-white p-4">
                <p className="text-sm font-bold uppercase tracking-widest text-slate-500">Travel advice</p>
                <p className="mt-2 text-sm leading-6 text-slate-700">{result.timeContext || "No time-context guidance available."}</p>
              </div>
              <div className="rounded-2xl bg-white p-4">
                <p className="text-sm font-bold uppercase tracking-widest text-slate-500">Safety factors</p>
                <ul className="mt-2 space-y-2 text-sm text-slate-700">
                  {normalizeFactorList(result.safetyFactors || result.factors || {}).map((factor) => (
                    <li key={factor} className="list-disc pl-5">{factor}</li>
                  ))}
                </ul>
              </div>
            </div>

            {result.warnings?.length > 0 && (
              <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                <p className="text-sm font-bold uppercase tracking-widest text-amber-700">Warnings</p>
                <ul className="mt-2 space-y-2 text-sm text-amber-900">
                  {result.warnings.map((warning, index) => (
                    <li key={`${warning}-${index}`} className="list-disc pl-5">{warning}</li>
                  ))}
                </ul>
              </div>
            )}

            <p className="mt-4 text-xs text-slate-500">{result.dataNote || "This assistant uses backend data and labeled fallback values."}</p>
          </section>
        )}
      </div>
    </main>
  );
}

export default AssistantPage;
