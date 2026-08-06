function Navbar() {
  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "20px 40px",
        background: "#0f172a",
        color: "white",
      }}
    >
      <h2>SafeRoute AI</h2>

      <div>
        <button>Login</button>
        <button style={{ marginLeft: "15px" }}>Register</button>
      </div>
    </nav>
  );
}

export default Navbar;