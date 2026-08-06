function Testimonials() {
  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Student",
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
      text: "The emergency SOS feature is something everyone should have.",
    },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center">
          What Users Say
        </h2>

        <p className="text-center text-gray-500 mt-4 mb-12">
          Trusted by people who value safe travel.
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((user, index) => (
            <div
              key={index}
              className="shadow-lg rounded-2xl p-8 hover:shadow-2xl transition"
            >
              <p className="text-gray-600 italic">
                "{user.text}"
              </p>

              <h3 className="font-bold mt-6">{user.name}</h3>

              <p className="text-gray-500">{user.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;