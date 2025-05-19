import { useState } from "react";
import axios from "../api/axios";
import AuthNavbar from "../components/AuthNavbar";

const Transfer = () => {
  const [fromAccount, setFromAccount] = useState("");
  const [toAccount, setToAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await axios.post("/api/transactions/transfer", {
        fromAccount,
        toAccount,
        amount: parseFloat(amount),
      });
      setSuccess("Transfer successful!");
      setFromAccount("");
      setToAccount("");
      setAmount("");
    } catch (err: any) {
      setError(err.response?.data || "Transfer failed");
    }
  };

  return (
    <>
      <AuthNavbar />
      <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded">
        <h2 className="text-2xl font-semibold mb-4">Transfer Funds</h2>
        <form onSubmit={handleTransfer} className="space-y-4">
          <input
            type="text"
            placeholder="From Account ID"
            value={fromAccount}
            onChange={(e) => setFromAccount(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
          <input
            type="text"
            placeholder="To Account ID"
            value={toAccount}
            onChange={(e) => setToAccount(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Transfer
          </button>
          {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-green-500">{success}</p>}
        </form>
      </div>
    </>
  );
};

export default Transfer;
