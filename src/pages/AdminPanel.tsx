import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";

interface LoanRequest {
  id: number;
  amount: number;
  status: string;
  requestedAt: string;
  user: {
    username: string;
  };
}

const AdminPanel = () => {
  const { token, logout } = useAuth();
  const [loanRequests, setLoanRequests] = useState<LoanRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchPendingLoans = async () => {
    try {
      const res = await axios.get("/api/loans/pending", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setLoanRequests(res.data);
    } catch (err) {
      console.error("Failed to load pending loan requests:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDecision = async (id: number, action: "approve" | "reject") => {
    try {
      await axios.post(`/api/loans/${action}/${id}`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setLoanRequests((prev) => prev.filter((req) => req.id !== id));
    } catch (err) {
      console.error(`Failed to ${action} loan`, err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    fetchPendingLoans();
  }, []);

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-white shadow-md rounded">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Admin Panel - Pending Loans</h2>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : loanRequests.length === 0 ? (
        <p>No pending loan requests.</p>
      ) : (
        <table className="w-full text-left border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">User</th>
              <th className="p-2">Amount</th>
              <th className="p-2">Requested At</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loanRequests.map((request) => (
              <tr key={request.id} className="border-t">
                <td className="p-2">{request.user.username}</td>
                <td className="p-2">${request.amount}</td>
                <td className="p-2">{new Date(request.requestedAt).toLocaleString()}</td>
                <td className="p-2 space-x-2">
                  <button
                    onClick={() => handleDecision(request.id, "approve")}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleDecision(request.id, "reject")}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminPanel;
