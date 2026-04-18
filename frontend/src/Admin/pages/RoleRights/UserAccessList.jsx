import React, { useState } from "react";

const UserAccessList = () => {
  const [users, setUsers] = useState([
    { id: 1, name: "Rohit", role: "Resident", status: "active" },
    { id: 2, name: "Amit", role: "Guard", status: "blocked" },
  ]);

  const handleToggle = (id) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === id
          ? {
              ...user,
              status: user.status === "active" ? "blocked" : "active",
            }
          : user
      )
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">User Access Management</h1>
        <p className="text-sm text-gray-500">Manage accessibility and block/unblock system users.</p>
      </div>

      <div className="admin-table-wrap shadow-sm">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Status</th>
              <th>Access Control</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="p-4 text-gray-900 font-medium">{user.name}</td>
                <td className="p-4 text-gray-500">{user.role}</td>

                {/* Status Badge */}
                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                      user.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>

                {/* Fixed Toggle Switch */}
                <td className="p-4">
                  {/* The 'relative' class keeps the white dot contained inside this label */}
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={user.status === "active"}
                      // Only use ONE event listener here: onChange
                      onChange={() => handleToggle(user.id)}
                    />
                    
                    {/* The Background Track */}
                    <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-green-500 transition-colors duration-200 ease-in-out"></div>
                    
                    {/* The Sliding White Dot */}
                    <div className="absolute left-[2px] top-[2px] w-5 h-5 bg-white rounded-full transition-transform duration-200 ease-in-out transform peer-checked:translate-x-full shadow-sm"></div>
                  </label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserAccessList;