import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "20px 50px",
        backgroundColor: "#0f172a",
        color: "white",
      }}
    >
      <h2>🛡 SafeRoute AI</h2>

      <div style={{ display: "flex", gap: "20px" }}>
        <Link to="/">Home</Link>
        <Link to="/dashboard">Dashboard</Link>
      </div>

      <div>
        <Link to="/login">
          <button>Login</button>
        </Link>

        <Link to="/register">
          <button style={{ marginLeft: "10px" }}>
            Register
          </button>
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;