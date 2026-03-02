import React from "react";
import { useNavigate } from "react-router-dom";

const RoleDashboard = () => {
  const navigate = useNavigate();

  // Dummy Stats
  const stats = {
    totalUsers: 120,
    activeUsers: 110,
    blockedUsers: 5,
    suspendedUsers: 5,
  };

  // Dummy Roles
  const roles = [
    { id: 1, name: "Super Admin", users: 1 },
    { id: 2, name: "Sub Admin", users: 3 },
    { id: 3, name: "Guard", users: 5 },
    { id: 4, name: "Resident", users: 111 },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      {/* HEADER */}
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Role & Rights Overview</h1>

        <button
          onClick={() => navigate("/roles/create-role")}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Create Role
        </button>
      </div>

      {/* STATS CARDS */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Total Users</p>
          <h2 className="text-2xl font-bold">{stats.totalUsers}</h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Active Users</p>
          <h2 className="text-2xl font-bold text-green-600">
            {stats.activeUsers}
          </h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Blocked Users</p>
          <h2 className="text-2xl font-bold text-red-600">
            {stats.blockedUsers}
          </h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Suspended Users</p>
          <h2 className="text-2xl font-bold text-yellow-600">
            {stats.suspendedUsers}
          </h2>
        </div>
      </div>

      {/* ROLE LIST TABLE */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="p-5 border-b">
          <h2 className="text-lg font-semibold">Roles</h2>
        </div>

        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4">Role Name</th>
              <th className="p-4">Assigned Users</th>
              <th className="p-4 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {roles.map((role) => (
              <tr
                key={role.id}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="p-4 font-medium">{role.name}</td>
                <td className="p-4">{role.users}</td>
                <td className="p-4 text-center">
                  <button
                    onClick={() => navigate(`/roles/edit/${role.id}`)}
                    className="text-blue-600 hover:underline"
                  >
                    Edit Permissions
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default RoleDashboard;