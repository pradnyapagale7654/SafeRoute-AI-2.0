function Features() {
  const features = [
    {
      icon: "🛡️",
      title: "AI Safety Score",
      description:
        "Our AI analyzes crime reports, lighting, and traffic to recommend the safest route.",
    },
    {
      icon: "🚨",
      title: "Emergency SOS",
      description:
        "Send your live location instantly to trusted contacts during emergencies.",
    },
    {
      icon: "📍",
      title: "Live Location Sharing",
      description:
        "Allow family and friends to track your journey in real time.",
    },
    {
      icon: "👥",
      title: "Community Reports",
      description:
        "Users can report unsafe locations, accidents, and suspicious activities.",
    },
  ];

  return (
    <section id="features" className="bg-[#f2f7f5] py-24">
      <div className="max-w-7xl mx-auto px-6">

        <p className="text-center text-sm font-bold uppercase tracking-[0.2em] text-[#4c8b47]">
          The safety toolkit
        </p>

        <h2 className="mt-3 text-center text-4xl font-black text-[#102a2b]">
          Useful when the journey gets uncertain.
        </h2>

        <p className="mx-auto mt-4 mb-12 max-w-2xl text-center text-gray-600">
          Smart features that make every journey safer.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {features.map((feature, index) => (
            <div
              key={index}
              className="animate-rise rounded-3xl border border-slate-100 bg-white p-8 text-center shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
            >
              <div className="text-5xl mb-5">
                {feature.icon}
              </div>

              <h3 className="text-xl font-bold mb-4">
                {feature.title}
              </h3>

              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}

export default Features;