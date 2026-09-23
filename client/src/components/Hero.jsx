import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="relative flex min-h-[calc(100vh-80px)] items-center overflow-hidden bg-[#102a2b] text-white">
      <img
        src="https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1800&q=85"
        alt="City streets illuminated at dusk"
        className="absolute inset-0 h-full w-full object-cover opacity-45"
      />
      <div className="absolute inset-0 bg-[#071a20]/75" />

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-12 px-6 py-24 lg:grid-cols-[1.1fr_0.9fr] lg:px-10">
        <div className="animate-rise">
          <p className="mb-6 inline-flex rounded-full border border-[#a7f36b]/60 bg-[#a7f36b]/10 px-4 py-2 text-sm font-bold uppercase tracking-[0.2em] text-[#d8ffb7]">
            Intelligent journeys, calmer arrivals
          </p>
          <h1 className="max-w-4xl text-5xl font-black leading-[0.98] tracking-tight sm:text-7xl">
            Travel safer with a route that thinks ahead.
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-200 sm:text-xl">
            SafeRoute AI combines road routing, safety signals, and community
            awareness to help you move through the city with more confidence.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              to="/route-planner"
              className="rounded-full bg-[#a7f36b] px-7 py-4 font-black text-[#102a2b] transition hover:-translate-y-1 hover:bg-[#c4ff91]"
            >
              Plan a safer route →
            </Link>
            <a
              href="#features"
              className="rounded-full border border-white/60 px-7 py-4 font-bold text-white transition hover:bg-white hover:text-[#102a2b]"
            >
              Explore the toolkit
            </a>
          </div>

          <div className="mt-12 flex flex-wrap gap-8 border-t border-white/20 pt-6 text-sm text-slate-300">
            <span><strong className="text-2xl text-white">24/7</strong><br />Safety mindset</span>
            <span><strong className="text-2xl text-white">OSRM</strong><br />Road routing</span>
            <span><strong className="text-2xl text-white">AI</strong><br />Safety signals</span>
          </div>
        </div>

        <div className="animate-float hidden lg:block">
          <div className="ml-auto max-w-sm rounded-[2rem] border border-white/20 bg-white/10 p-5 shadow-2xl backdrop-blur-md">
            <div className="rounded-[1.5rem] bg-[#f2f7f5] p-5 text-[#102a2b]">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold uppercase tracking-widest text-[#4c8b47]">Live safety pulse</span>
                <span className="h-3 w-3 rounded-full bg-[#a7f36b] shadow-[0_0_0_6px_rgba(167,243,107,0.2)]" />
              </div>
              <div className="mt-8 flex items-end justify-between">
                <div>
                  <p className="text-6xl font-black">76</p>
                  <p className="mt-1 font-bold text-[#4c8b47]">Moderate route</p>
                </div>
                <span className="rounded-full bg-[#dff7bd] px-3 py-2 text-xs font-bold text-[#315524]">Analyzed</span>
              </div>
              <div className="mt-8 h-2 rounded-full bg-slate-200">
                <div className="h-2 w-3/4 rounded-full bg-[#4c8b47]" />
              </div>
              <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl bg-white p-3"><strong>85%</strong><br /><span className="text-slate-500">Lighting</span></div>
                <div className="rounded-xl bg-white p-3"><strong>70%</strong><br /><span className="text-slate-500">Traffic</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;