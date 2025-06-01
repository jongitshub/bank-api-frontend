import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import AuthNavbar from "../components/AuthNavbar";
import axios from "../api/axios";

const Dashboard = () => {
  const { user, token } = useAuth();
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleLoanRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!amount || isNaN(+amount)) {
      setError("Please enter a valid amount.");
      return;
    }

    try {
      await axios.post(
        "/api/loans/request",
        { amount: parseFloat(amount) },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage("Loan request submitted!");
      setAmount("");
    } catch (err: any) {
      setError(err.response?.data || "Failed to submit loan request.");
    }
  };

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

        <p className="text-gray-700 mb-6">
          Use the navigation bar to transfer funds or view your transactions.
        </p>

        {/* Loan Request Form */}
        <form onSubmit={handleLoanRequest} className="space-y-4">
          <h3 className="text-xl font-semibold">Request a Loan</h3>
          <input
            type="number"
            placeholder="Enter loan amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Submit Loan Request
          </button>
          {message && <p className="text-green-600">{message}</p>}
          {error && <p className="text-red-500">{error}</p>}
        </form>
      </div>
    </>
  );
};

export default Dashboard;
