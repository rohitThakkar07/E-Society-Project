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
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Role & Rights Overview</h1>
          <p className="text-sm text-gray-500">Overview of system roles and user distribution.</p>
        </div>

        <button
          onClick={() => navigate("/roles/create-role")}
          className="admin-btn-primary"
        >
          Create Role
        </button>
      </div>

      {/* STATS CARDS */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Total Users</p>
          <h2 className="text-3xl font-black text-slate-800">{stats.totalUsers}</h2>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-[10px] font-black uppercase tracking-widest text-green-400 mb-1">Active Users</p>
          <h2 className="text-3xl font-black text-green-600">
            {stats.activeUsers}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-[10px] font-black uppercase tracking-widest text-red-400 mb-1">Blocked Users</p>
          <h2 className="text-3xl font-black text-red-600">
            {stats.blockedUsers}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-[10px] font-black uppercase tracking-widest text-amber-400 mb-1">Suspended Users</p>
          <h2 className="text-3xl font-black text-amber-600">
            {stats.suspendedUsers}
          </h2>
        </div>
      </div>

      {/* ROLE LIST TABLE */}
      <div className="admin-table-wrap shadow-sm">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Role Name</th>
              <th>Assigned Users</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {roles.map((role) => (
              <tr
                key={role.id}
                className="hover:bg-slate-50 transition-colors"
              >
                <td className="font-bold text-slate-800">{role.name}</td>
                <td className="text-sm font-bold text-slate-500">{role.users} Recipients</td>
                <td className="text-center">
                  <button
                    onClick={() => navigate(`/roles/edit/${role.id}`)}
                    className="text-xs font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-800 transition"
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