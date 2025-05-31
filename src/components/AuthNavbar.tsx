import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AuthNavbar = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const linkClasses = (path: string) =>
    `px-4 py-2 rounded-md transition ${
      location.pathname === path
        ? "bg-blue-100 text-blue-700 font-medium"
        : "text-gray-700 hover:bg-gray-100"
    }`;

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <Link to="/dashboard" className="text-2xl font-bold text-blue-600">
        BankApp
      </Link>

      <div className="flex items-center gap-6">
        {user && (
          <span className="text-sm text-gray-600">
            Welcome, <strong>{user.username}</strong>
          </span>
        )}

        <Link to="/dashboard" className={linkClasses("/dashboard")}>
          Dashboard
        </Link>
        <Link to="/transfer" className={linkClasses("/transfer")}>
          Transfer
        </Link>
        <Link to="/transactions" className={linkClasses("/transactions")}>
          Transactions
        </Link>

        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default AuthNavbar;
