import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEdit, FiTrash2, FiSearch } from "react-icons/fi";

const Flats = () => {
  const navigate = useNavigate();

  const [flats, setFlats] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setFlats([
        {
          _id: "1",
          wing: "A",
          flatNumber: "101",
          floorNumber: 1,
          flatType: "2BHK",
          residentCount: 3,
          status: "Occupied",
        },
        {
          _id: "2",
          wing: "B",
          flatNumber: "203",
          floorNumber: 2,
          flatType: "3BHK",
          residentCount: 2,
          status: "Vacant",
        },
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleDelete = (id) => {
    setFlats(flats.filter((flat) => flat._id !== id));
  };

  // Filter flats based on search
  const filteredFlats = flats.filter((flat) =>
    `${flat.wing}-${flat.flatNumber}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            Flats List
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage society flats, wings, and occupancy status.
          </p>
        </div>

        <button
          onClick={() => navigate("add")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-sm hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5"
        >
          + Add Flat
        </button>
      </div>

      {/* Search Box */}
      <div className="mb-4 relative max-w-sm">
        <FiSearch className="absolute left-3 top-3 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search by Flat Number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-200">
              <th className="px-5 py-4 font-semibold">Flat Info</th>
              <th className="px-5 py-4 font-semibold">Wing</th>
              <th className="px-5 py-4 font-semibold">Floor</th>
              <th className="px-5 py-4 font-semibold">Flat Type</th>
              <th className="px-5 py-4 font-semibold">Residents</th>
              <th className="px-5 py-4 font-semibold">Status</th>
              <th className="px-5 py-4 font-semibold text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 text-sm">
            {isLoading ? (
              <tr>
                <td colSpan="7" className="text-center py-10 text-gray-500">
                  <div className="flex justify-center items-center gap-2">
                    <span className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></span>
                    Loading flats...
                  </div>
                </td>
              </tr>
            ) : filteredFlats.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-12 bg-gray-50/50">
                  <div className="flex flex-col items-center">
                    <span className="text-lg font-medium text-gray-700 mb-1">
                      No Flats Found
                    </span>
                    <span className="text-sm text-gray-400">
                      Try another search or add a flat.
                    </span>
                  </div>
                </td>
              </tr>
            ) : (
              filteredFlats.map((flat) => (
                <tr
                  key={flat._id}
                  className="hover:bg-blue-50/30 transition-colors duration-200 align-middle"
                >
                  <td className="px-5 py-4">
                    <div className="font-semibold text-gray-900">
                      {flat.wing}-{flat.flatNumber}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Floor {flat.floorNumber}
                    </div>
                  </td>

                  <td className="px-5 py-4 font-medium text-gray-700">
                    {flat.wing}
                  </td>

                  <td className="px-5 py-4 text-gray-600">
                    {flat.floorNumber}
                  </td>

                  <td className="px-5 py-4">
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold">
                      {flat.flatType}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-gray-700 font-medium">
                    {flat.residentCount}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        flat.status === "Occupied"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {flat.status}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex gap-3 justify-center">
                      <button
                        onClick={() => navigate(`/admin/flats/edit/${flat._id}`)}
                        className="p-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 hover:text-blue-800 rounded-lg"
                      >
                        <FiEdit size={16} />
                      </button>

                      <button
                        onClick={() => handleDelete(flat._id)}
                        className="p-1.5 text-red-600 bg-red-50 hover:bg-red-100 hover:text-red-800 rounded-lg"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Flats;