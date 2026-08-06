function HowItWorks() {
  const steps = [
    {
      number: "1",
      title: "Enter Destination",
      description: "Enter where you want to travel.",
    },
    {
      number: "2",
      title: "AI Analyzes Routes",
      description: "SafeRoute AI checks crime reports, lighting and traffic.",
    },
    {
      number: "3",
      title: "Choose Safest Route",
      description: "Receive the safest recommended route instantly.",
    },
    {
      number: "4",
      title: "Travel Safely",
      description: "Use live tracking and SOS protection throughout your journey.",
    },
  ];

  return (
    <section className="py-24 bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-6">

        <h2 className="text-4xl font-bold text-center">
          How SafeRoute AI Works
        </h2>

        <p className="text-center text-gray-300 mt-4 mb-16">
          Stay protected in four simple steps.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

          {steps.map((step) => (
            <div
              key={step.number}
              className="bg-slate-800 rounded-2xl p-8 text-center hover:bg-slate-700 transition"
            >
              <div className="w-14 h-14 rounded-full bg-green-500 flex items-center justify-center text-2xl font-bold mx-auto mb-5">
                {step.number}
              </div>

              <h3 className="text-xl font-bold mb-3">
                {step.title}
              </h3>

              <p className="text-gray-300">
                {step.description}
              </p>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}

export default HowItWorks;