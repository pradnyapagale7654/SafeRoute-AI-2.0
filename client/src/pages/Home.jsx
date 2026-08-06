import Navbar from "../components/Navbar";

function Home() {
  return (
    <>
      <Navbar />

      <div
        style={{
          textAlign: "center",
          marginTop: "100px",
        }}
      >
        <h1>SafeRoute AI 2.0</h1>

        <p>
          Intelligent Personal Safety Platform
        </p>

        <button>Get Started</button>
      </div>
    </>
  );
}

export default Home;