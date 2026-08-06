function Testimonials() {
  const testimonials = [
    {
      name: "Priya Sharma",
      role: "College Student",
      text: "SafeRoute AI helped me find safer routes while returning from college at night.",
    },
    {
      name: "Rahul Verma",
      role: "Software Engineer",
      text: "The live location sharing feature gives my family peace of mind.",
    },
    {
      name: "Ananya Patel",
      role: "Working Professional",
      text: "The emergency SOS feature makes me feel much safer while traveling.",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">

        <h2 className="text-4xl font-bold text-center">
          What Our Users Say
        </h2>

        <p className="text-center text-gray-500 mt-4 mb-12">
          Trusted by people across India.
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((user, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-2xl shadow-lg p-8 hover:shadow-2xl transition duration-300"
            >
              <p className="text-gray-600 italic">
                "{user.text}"
              </p>

              <h3 className="text-xl font-bold mt-6">
                {user.name}
              </h3>

              <p className="text-gray-500">
                {user.role}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default Testimonials;