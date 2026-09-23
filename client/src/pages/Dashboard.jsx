import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { useLanguage } from "../context/useLanguage";
import LanguageSelect from "../components/LanguageSelect";

function Dashboard() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { translate } = useLanguage();

  const handleLogout = () => {
    signOut();
    navigate("/login");
  };

  return (
    <main className="min-h-screen bg-[#f2f7f5] px-5 py-8 text-slate-900 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="animate-rise relative overflow-hidden rounded-[2rem] bg-[#102a2b] p-7 text-white shadow-xl sm:p-10">
          <img
            src="https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1200&q=80"
            alt="City streets viewed from above"
            className="absolute inset-y-0 right-0 h-full w-2/5 object-cover opacity-20 mix-blend-screen"
          />
          <div className="relative flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div>
              <div className="flex items-center gap-3">
                <span className="animate-soft-pulse rounded-full bg-[#a7f36b] px-3 py-1 text-xs font-black uppercase tracking-widest text-[#102a2b]">
                  {translate("protectedSession")}
                </span>
                {user.role === "admin" && (
                  <span className="rounded-full border border-[#f3b562] px-3 py-1 text-xs font-bold text-[#f3b562]">
                    {translate("adminLabel")}
                  </span>
                )}
              </div>
              <p className="mt-6 text-sm font-bold uppercase tracking-[0.2em] text-[#a7f36b]">
                {translate("personalCockpit")}
              </p>
              <h1 className="mt-3 max-w-2xl text-4xl font-black tracking-tight sm:text-6xl">
                {translate("greeting")}, {user.name.split(" ")[0]}.
              </h1>
              <p className="mt-4 max-w-xl text-lg leading-7 text-slate-300">
                {translate("journeyMessage")}
              </p>
            </div>
            <div className="flex gap-3">
              <LanguageSelect />
              {user.role === "admin" && (
                <button
                  onClick={() => navigate("/admin")}
                  className="rounded-full border border-[#a7f36b] px-5 py-3 font-bold text-[#d8ffb7] hover:bg-[#a7f36b] hover:text-[#102a2b]"
                >
                  {translate("adminView")}
                </button>
              )}
              <button
                onClick={handleLogout}
                className="rounded-full bg-[#f3b562] px-5 py-3 font-bold text-[#102a2b] hover:bg-[#ffc980]"
              >
                {translate("logout")}
              </button>
            </div>
          </div>
        </header>

        <section className="mt-7 grid gap-5 sm:grid-cols-3">
          <div className="animate-rise delay-1 rounded-3xl bg-[#dff7bd] p-6 shadow-sm">
            <p className="text-sm font-bold uppercase tracking-widest text-[#315524]">
              {translate("readiness")}
            </p>
            <p className="mt-4 text-4xl font-black text-[#102a2b]">{translate("ready")}</p>
            <p className="mt-2 text-sm text-[#466b39]">{translate("toolsOnline")}</p>
          </div>
          <div className="animate-rise delay-2 rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm font-bold uppercase tracking-widest text-slate-500">
              {translate("savedRoutes")}
            </p>
            <p className="mt-4 text-4xl font-black text-[#102a2b]">0</p>
            <p className="mt-2 text-sm text-slate-500">{translate("historyNext")}</p>
          </div>
          <div className="animate-rise delay-3 rounded-3xl bg-[#f3b562] p-6 shadow-sm">
            <p className="text-sm font-bold uppercase tracking-widest text-[#704915]">
              {translate("quickAction")}
            </p>
            <p className="mt-4 text-3xl font-black text-[#102a2b]">{translate("sosReady")}</p>
            <p className="mt-2 text-sm text-[#704915]">{translate("simulation")}</p>
          </div>
        </section>

        <section className="mt-7 grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
          <div className="rounded-3xl bg-white p-7 shadow-sm sm:p-8">
            <p className="text-sm font-bold uppercase tracking-widest text-[#4c8b47]">
              {translate("toolkit")}
            </p>
            <h2 className="mt-2 text-3xl font-black text-[#102a2b]">
              {translate("toolkitTitle")}
            </h2>
            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              <button
                onClick={() => navigate("/route-planner")}
                className="group rounded-2xl bg-[#102a2b] p-6 text-left text-white transition duration-300 hover:-translate-y-1 hover:bg-[#1a4242]"
              >
                <span className="text-3xl">⌁</span>
                <h3 className="mt-6 text-xl font-black">{translate("planRoute")}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  {translate("routeDescription")}
                </p>
                <span className="mt-5 inline-block font-bold text-[#a7f36b]">
                  {translate("openPlanner")}
                </span>
              </button>
              <div className="rounded-2xl border border-dashed border-slate-300 p-6">
                <span className="text-3xl">◉</span>
                <h3 className="mt-6 text-xl font-black text-[#102a2b]">
                  {translate("trustedCircle")}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {translate("trustedDescription")}
                </p>
                <span className="mt-5 inline-block font-bold text-[#4c8b47]">
                  {translate("comingNext")}
                </span>
              </div>
            </div>
          </div>

          <aside className="rounded-3xl bg-[#e8f1ff] p-7 shadow-sm">
            <p className="text-sm font-bold uppercase tracking-widest text-[#3864a3]">
              {translate("safetyPulse")}
            </p>
            <h2 className="mt-2 text-2xl font-black text-[#17335c]">
              {translate("pulseTitle")}
            </h2>
            <p className="mt-4 text-sm leading-6 text-[#3f5d86]">
              {translate("pulseDescription")}
            </p>
            <div className="mt-7 h-2 overflow-hidden rounded-full bg-white">
              <div className="h-full w-3/4 rounded-full bg-[#4c8b47]" />
            </div>
            <p className="mt-3 text-xs font-bold uppercase tracking-widest text-[#3864a3]">
              {translate("foundation")}
            </p>
          </aside>
        </section>
      </div>
    </main>
  );
}

export default Dashboard;