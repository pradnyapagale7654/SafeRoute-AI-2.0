import { useState } from "react";
import AuthContext from "./contextValue";

const getStoredUser = () => {
  try {
    const storedUser = localStorage.getItem("safeRouteUser");
    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    localStorage.removeItem("safeRouteUser");
    return null;
  }
};

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() =>
    localStorage.getItem("safeRouteToken")
  );
  const [user, setUser] = useState(getStoredUser);

  const signIn = (authToken, authUser) => {
    localStorage.setItem("safeRouteToken", authToken);
    localStorage.setItem("safeRouteUser", JSON.stringify(authUser));
    setToken(authToken);
    setUser(authUser);
  };

  const signOut = () => {
    localStorage.removeItem("safeRouteToken");
    localStorage.removeItem("safeRouteUser");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated: Boolean(token && user),
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
