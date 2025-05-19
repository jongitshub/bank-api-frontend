import AuthNavbar from "../components/AuthNavbar";

const Dashboard = () => {
  return (
    <>
      <AuthNavbar />
      <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-md rounded">
        <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
        <p className="text-gray-700">Welcome to your banking dashboard. Use the navigation bar to transfer funds or view your transactions.</p>
      </div>
    </>
  );
};

export default Dashboard;
