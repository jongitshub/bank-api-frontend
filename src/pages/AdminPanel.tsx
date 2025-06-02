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

interface ApprovedLoan {
  amount: number;
  approvedAt: string;
  username: string;
}

const AdminPanel = () => {
  const { token, logout } = useAuth();
  const [loanRequests, setLoanRequests] = useState<LoanRequest[]>([]);
  const [approvedLoans, setApprovedLoans] = useState<ApprovedLoan[]>([]);
  const [reserve, setReserve] = useState<number | null>(null);
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

  const fetchApprovedLoans = async () => {
    try {
      const res = await axios.get("/api/loans/approved", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setApprovedLoans(res.data);
    } catch (err) {
      console.error("Failed to fetch approved loans:", err);
    }
  };

  const fetchReserve = async () => {
    try {
      const res = await axios.get("/api/admin/reserve", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setReserve(res.data.reserve);
    } catch (err) {
      console.error("Failed to fetch reserve balance", err);
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
      if (action === "approve") {
        // Refresh both reserve and approved loans
        fetchReserve();
        fetchApprovedLoans();
      }
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
    fetchApprovedLoans();
    fetchReserve();
  }, []);

  const totalLoaned = approvedLoans.reduce(
    (sum, loan) => sum + Number(loan.amount),
    0
  );

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6 bg-white shadow-md rounded">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Admin Panel - Pending Loans</h2>
          {reserve !== null && (
            <p className="text-gray-600 text-sm mt-1">
              🏦 Bank Reserve: <strong>${reserve.toLocaleString()}</strong>
            </p>
          )}
        </div>
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
        <table className="w-full text-left border mb-10">
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

      {/* Approved Loans Section */}
      <div>
        <h2 className="text-xl font-bold mb-2">Currently Loaned Out</h2>
        <p className="text-sm text-gray-700 mb-2">
          💰 Total Loaned Out: <strong>${totalLoaned.toFixed(2)}</strong>
        </p>
        {approvedLoans.length === 0 ? (
          <p>No approved loans.</p>
        ) : (
          <table className="w-full text-left border">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2">User</th>
                <th className="p-2">Amount</th>
                <th className="p-2">Approved At</th>
              </tr>
            </thead>
            <tbody>
              {approvedLoans.map((loan, index) => (
                <tr key={index} className="border-t">
                  <td className="p-2">{loan.username}</td>
                  <td className="p-2">${loan.amount}</td>
                  <td className="p-2">
                    {new Date(loan.approvedAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
