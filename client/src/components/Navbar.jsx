import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { useLanguage } from "../context/useLanguage";
import LanguageSelect from "./LanguageSelect";

function Navbar() {
  const { isAuthenticated, user, signOut } = useAuth();
  const { translate } = useLanguage();

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
  <Link to="/">{translate("home")}</Link>
  <Link to="/route-planner">{translate("safeRoute")}</Link>
  <Link to="/dashboard">{translate("dashboard")}</Link>
  {user?.role === "admin" && <Link to="/admin">{translate("admin")}</Link>}
</div>

      <div>
        <LanguageSelect />
        {isAuthenticated ? (
          <>
            <span>{user.name}</span>
            <button
              onClick={signOut}
              style={{ marginLeft: "10px" }}
            >
              {translate("logout")}
            </button>
          </>
        ) : (
          <>
            <Link to="/login">
              <button>{translate("login")}</button>
            </Link>

            <Link to="/register">
              <button style={{ marginLeft: "10px" }}>
                {translate("register")}
              </button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;