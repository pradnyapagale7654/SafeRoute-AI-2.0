import {
  BrowserRouter,
  Navigate,
  Routes,
  Route,
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./context/useAuth";
import { LanguageProvider } from "./context/LanguageContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import RoutePlanner from "./pages/RoutePlanner";
import AssistantPage from "./pages/AssistantPage";
import NotFound from "./pages/NotFound";
import LiveLocationPage from "./pages/LiveLocationPage";
import IncidentPage from "./pages/IncidentPage";
import MovementSignalPage from "./pages/MovementSignalPage";

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? (
    children
  ) : (
    <Navigate to="/login" replace />
  );
}

function AdminRoute({ children }) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return user.role === "admin" ? (
    children
  ) : (
    <Navigate to="/dashboard" replace />
  );
}

function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/route-planner"
            element={
              <ProtectedRoute>
                <RoutePlanner />
              </ProtectedRoute>
            }
          />
          <Route
            path="/assistant"
            element={
              <ProtectedRoute>
                <AssistantPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/live-location"
            element={
              <ProtectedRoute>
                <LiveLocationPage />
              </ProtectedRoute>
            }
          />
          <Route path="/live-location/:sessionId" element={<LiveLocationPage />} />
          <Route path="/incidents" element={<ProtectedRoute><IncidentPage /></ProtectedRoute>} />
          <Route path="/movement-signal" element={<ProtectedRoute><MovementSignalPage /></ProtectedRoute>} />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}

export default App;