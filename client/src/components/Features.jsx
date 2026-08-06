function Features() {
  return (
    <section
      style={{
        marginTop: "100px",
        textAlign: "center",
      }}
    >
      <h2>Features</h2>

      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          marginTop: "30px",
        }}
      >
        <div>
          <h3>🛡 AI Safety Score</h3>
        </div>

        <div>
          <h3>🚨 Emergency SOS</h3>
        </div>

        <div>
          <h3>📍 Live Tracking</h3>
        </div>

        <div>
          <h3>👥 Community Reports</h3>
        </div>
      </div>
    </section>
  );
}

export default Features;