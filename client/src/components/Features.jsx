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
    <section className="bg-gray-100 py-20">
      <div className="max-w-7xl mx-auto px-6">

        <h2 className="text-4xl font-bold text-center text-gray-900">
          Why Choose SafeRoute AI?
        </h2>

        <p className="text-center text-gray-600 mt-4 mb-12">
          Smart features that make every journey safer.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg p-8 text-center hover:scale-105 hover:shadow-2xl transition-all duration-300"
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