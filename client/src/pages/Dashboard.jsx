import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { useLanguage } from "../context/useLanguage";
import LanguageSelect from "../components/LanguageSelect";
import SosButton from "../components/SosButton";
import { API_BASE_URL } from "../services/api";

function Dashboard() {
  const navigate = useNavigate();
  const { user, token, signOut } = useAuth();
  const { translate } = useLanguage();
  const [contacts, setContacts] = useState([]);
  const [contactForm, setContactForm] = useState({ name: "", email: "", phone: "", relationship: "trusted contact" });
  const [editingContactId, setEditingContactId] = useState(null);
  const [contactMessage, setContactMessage] = useState("");

  useEffect(() => {
    axios.get(`${API_BASE_URL}/trusted-circle`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then((response) => {
      const nextContacts = response.data.contacts || [];
      setContacts(nextContacts);
      localStorage.setItem("safeRouteTrustedContacts", JSON.stringify(nextContacts));
    }).catch(() => setContacts([]));
  }, [token]);

  const saveContact = async (event) => {
    event.preventDefault();
    try {
      const response = await axios({
        method: editingContactId ? "patch" : "post",
        url: editingContactId
          ? `${API_BASE_URL}/trusted-circle/${editingContactId}`
          : `${API_BASE_URL}/trusted-circle`,
        data: contactForm,
        headers: { Authorization: `Bearer ${token}` },
      });
      setContacts((current) => editingContactId
        ? current.map((item) => item.id === editingContactId ? response.data.contact : item)
        : [response.data.contact, ...current]);
      setContactForm({ name: "", email: "", phone: "", relationship: "trusted contact" });
      setEditingContactId(null);
    } catch {
      setContactMessage("Unable to save trusted contact.");
    }
  };

  const removeContact = async (contactId) => {
    await axios.delete(`${API_BASE_URL}/trusted-circle/${contactId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setContacts((current) => current.filter((item) => item.id !== contactId));
  };

  const markEmergencyContact = async (contactId) => {
    const response = await axios.patch(`${API_BASE_URL}/trusted-circle/${contactId}/emergency`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setContacts((current) => current.map((item) => ({ ...item, isEmergencyContact: item.id === response.data.contact.id })));
  };

  const editContact = (contact) => {
    setEditingContactId(contact.id);
    setContactForm({
      name: contact.name,
      email: contact.email || "",
      phone: contact.phone,
      relationship: contact.relationship || "trusted contact",
    });
    setContactMessage("");
  };

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
              <SosButton />
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
              <button
                onClick={() => navigate("/live-location")}
                className="rounded-2xl border border-[#4c8b47] bg-[#eef8e5] p-6 text-left transition hover:-translate-y-1 hover:shadow"
              >
                <span className="text-3xl">⌖</span>
                <h3 className="mt-6 text-xl font-black text-[#102a2b]">Live location sharing</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">Share your latest location with an authorized person while you travel.</p>
                <span className="mt-5 inline-block font-bold text-[#315524]">Open live sharing</span>
              </button>
              <button
                onClick={() => navigate("/incidents")}
                className="rounded-2xl border border-amber-300 bg-amber-50 p-6 text-left transition hover:-translate-y-1 hover:shadow"
              >
                <span className="text-3xl">!</span>
                <h3 className="mt-6 text-xl font-black text-[#102a2b]">Community reports</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">Report and review nearby user-generated safety signals.</p>
                <span className="mt-5 inline-block font-bold text-amber-800">Open reports</span>
              </button>
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

        <section className="mt-7 rounded-3xl bg-white p-7 shadow-sm sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-[#4c8b47]">
                AI travel assistant
              </p>
              <h2 className="mt-2 text-3xl font-black text-[#102a2b]">
                Ask for safer trip guidance.
              </h2>
            </div>
            <button
              type="button"
              onClick={() => navigate("/assistant")}
              className="rounded-full bg-[#102a2b] px-5 py-3 font-bold text-white hover:bg-[#1a4242]"
            >
              Open full assistant
            </button>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-[#f7faf7] p-4 text-sm text-slate-600">
            Open the full assistant page for the complete travel chat, quick prompts, and route-aware suggestions.
          </div>
        </section>

        <section className="mt-7 rounded-3xl bg-white p-7 shadow-sm sm:p-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-[#4c8b47]">
                Emergency circle
              </p>
              <h2 className="mt-2 text-3xl font-black text-[#102a2b]">
                Keep one trusted contact close.
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                This development version stores one contact on this device only.
                Server-backed encrypted contacts can be added before production.
              </p>
            </div>
            {contacts[0] && (
              <a
                href={`tel:${contacts[0].phone}`}
                className="rounded-full bg-[#f3b562] px-5 py-3 text-center font-bold text-[#102a2b] hover:bg-[#ffc980]"
              >
                Call {contacts[0].name}
              </a>
            )}
          </div>

          {contacts.length > 0 && (
            <div className="mt-6 space-y-3">
              {contacts.map((item) => (
                <div key={item.id} className="flex flex-col justify-between gap-4 rounded-2xl bg-[#eef8e5] p-5 sm:flex-row sm:items-center">
                  <div><p className="font-bold text-[#315524]">{item.name} {item.isEmergencyContact ? "· Emergency" : ""}</p><p className="mt-1 text-sm text-[#466b39]">{item.phone}{item.email ? ` · ${item.email}` : ""}</p></div>
                  <div className="flex gap-2"><button onClick={() => editContact(item)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-bold text-slate-700">Edit</button><button onClick={() => markEmergencyContact(item.id)} className="rounded-lg border border-[#4c8b47] px-3 py-2 text-sm font-bold text-[#315524]">Mark emergency</button><button onClick={() => removeContact(item.id)} className="rounded-lg border border-red-200 px-3 py-2 text-sm font-bold text-red-700">Remove</button></div>
                </div>
              ))}
            </div>
          )}
          <form onSubmit={saveContact} className="mt-6 grid gap-4 sm:grid-cols-2">
              <input
                required
                type="text"
                placeholder="Contact name"
                value={contactForm.name}
                onChange={(event) =>
                  setContactForm({ ...contactForm, name: event.target.value })
                }
                className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-[#4c8b47] focus:ring-2 focus:ring-[#dff7bd]"
              />
              <input
                type="email"
                placeholder="Contact email (optional)"
                value={contactForm.email}
                onChange={(event) => setContactForm({ ...contactForm, email: event.target.value })}
                className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-[#4c8b47] focus:ring-2 focus:ring-[#dff7bd]"
              />
              <input
                required
                type="tel"
                placeholder="Phone number"
                value={contactForm.phone}
                onChange={(event) =>
                  setContactForm({ ...contactForm, phone: event.target.value })
                }
                className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-[#4c8b47] focus:ring-2 focus:ring-[#dff7bd]"
              />
              <button
                type="submit"
                className="rounded-xl bg-[#102a2b] px-5 py-3 font-bold text-white hover:bg-[#1a4242] sm:col-span-2"
              >
                {editingContactId ? "Update contact" : "Save contact"}
              </button>
          </form>
              {contactMessage && <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">{contactMessage}</p>}
        </section>
      </div>
    </main>
  );
}

export default Dashboard;