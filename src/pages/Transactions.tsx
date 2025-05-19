import { useEffect, useState } from "react";
import axios from "../api/axios";
import AuthNavbar from "../components/AuthNavbar";

interface Transaction {
  id: number;
  type: string;
  amount: number;
  accountId: string;
  recipientId?: string;
  timestamp: string;
}

const Transactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await axios.get("/api/transactions/history");
        setTransactions(res.data);
      } catch (err: any) {
        setError(err.response?.data || "Failed to fetch transactions");
      }
    };

    fetchTransactions();
  }, []);

  return (
    <>
      <AuthNavbar />
      <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-md rounded">
        <h2 className="text-2xl font-semibold mb-4">Transaction History</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="overflow-x-auto">
          <table className="w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Date</th>
                <th className="p-2 border">Type</th>
                <th className="p-2 border">Amount</th>
                <th className="p-2 border">Account</th>
                <th className="p-2 border">Recipient</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((txn) => (
                <tr key={txn.id}>
                  <td className="p-2 border">{new Date(txn.timestamp).toLocaleString()}</td>
                  <td className="p-2 border capitalize">{txn.type}</td>
                  <td className="p-2 border">${txn.amount.toFixed(2)}</td>
                  <td className="p-2 border">{txn.accountId}</td>
                  <td className="p-2 border">{txn.recipientId || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Transactions;
