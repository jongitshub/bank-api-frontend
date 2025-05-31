import { useAuth } from "../context/AuthContext";
import AuthNavbar from "../components/AuthNavbar";

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <>
      <AuthNavbar />
      <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-md rounded">
        <h2 className="text-2xl font-bold mb-4">Dashboard</h2>

        {user ? (
          <div className="mb-6">
            <p className="text-gray-700"><strong>Welcome,</strong> {user.username}</p>
            <p className="text-gray-700"><strong>Account Number:</strong> {user.accountNumber}</p>
            <p className="text-gray-700"><strong>Account Type:</strong> {user.accountType}</p>
            <p className="text-gray-700"><strong>Balance:</strong> ${user.balance}</p>
          </div>
        ) : (
          <p className="text-gray-500">Loading account info...</p>
        )}

        <p className="text-gray-700">
          Use the navigation bar to transfer funds or view your transactions.
        </p>
      </div>
    </>
  );
};

export default Dashboard;
