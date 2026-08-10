import { Link } from "react-router-dom";

function CTA() {
  return (
    <section className="bg-slate-900 py-24">
      <div className="max-w-5xl mx-auto text-center px-6">

        <h2 className="text-5xl font-bold text-white">
          Ready to Travel Safely?
        </h2>

        <p className="text-gray-300 mt-6 text-lg">
          Join SafeRoute AI today and make every journey smarter,
          safer, and stress-free.
        </p>

        <div className="mt-10">
          <Link to="/register">
            <button className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-xl text-lg font-semibold transition">
              Get Started Free
            </button>
          </Link>
        </div>

      </div>
    </section>
  );
}

export default CTA;