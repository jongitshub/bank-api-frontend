import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Transfer from "./pages/Transfer";
import Transactions from "./pages/Transactions";
import AdminPanel from "./pages/AdminPanel";

const App = () => {
  const { isAuthenticated, user } = useAuth();
  console.log("user from AuthContext:", user);


  // Prevent routes from rendering until user is fully loaded
  if (isAuthenticated && !user) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={
          !isAuthenticated ? (
            <Login />
          ) : user?.role === "ADMIN" ? (
            <Navigate to="/admin" />
          ) : (
            <Navigate to="/dashboard" />
          )
        }
      />
      <Route
        path="/register"
        element={
          !isAuthenticated ? (
            <Register />
          ) : user?.role === "ADMIN" ? (
            <Navigate to="/admin" />
          ) : (
            <Navigate to="/dashboard" />
          )
        }
      />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          isAuthenticated && user?.role === "USER" ? (
            <Dashboard />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="/transfer"
        element={
          isAuthenticated && user?.role === "USER" ? (
            <Transfer />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="/transactions"
        element={
          isAuthenticated && user?.role === "USER" ? (
            <Transactions />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="/admin"
        element={
          isAuthenticated && user?.role === "ADMIN" ? (
            <AdminPanel />
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      {/* Fallback Route */}
      <Route
        path="*"
        element={
          !isAuthenticated ? (
            <Navigate to="/login" />
          ) : user?.role === "ADMIN" ? (
            <Navigate to="/admin" />
          ) : (
            <Navigate to="/dashboard" />
          )
        }
      />
    </Routes>
  );
};

export default App;
