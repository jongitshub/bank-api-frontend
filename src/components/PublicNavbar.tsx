import { Link } from "react-router-dom";

const PublicNavbar = () => {
  return (
    <nav className="bg-white shadow py-4 px-6 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-blue-600">
        BankApp
      </Link>
      <div className="space-x-4">
        <Link
          to="/login"
          className="text-gray-700 hover:text-blue-600 transition duration-150"
        >
          Login
        </Link>
        <Link
          to="/register"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-150"
        >
          Register
        </Link>
      </div>
    </nav>
  );
};

export default PublicNavbar;
