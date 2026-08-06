function Hero() {
  return (
    <section className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
      <div className="text-center px-6">
        <h1 className="text-5xl md:text-7xl font-bold">
          Travel Safer with AI
        </h1>

        <p className="mt-6 text-xl text-gray-300 max-w-2xl mx-auto">
          SafeRoute AI helps you discover the safest routes,
          share your live location with trusted contacts,
          and send emergency SOS alerts instantly.
        </p>

        <div className="mt-10 flex justify-center gap-4">
          <button className="bg-green-500 hover:bg-green-600 px-8 py-3 rounded-lg font-semibold">
            Get Started
          </button>

          <button className="border border-white px-8 py-3 rounded-lg hover:bg-white hover:text-black">
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
}

export default Hero;