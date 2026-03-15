import React, { useState } from "react";

const RaiseComplaint = () => {
  const [formData, setFormData] = useState({
    type: "Maintenance",
    priority: "Low",
    description: "",
    attachment: null,
  });

  const [complaints, setComplaints] = useState([
    {
      id: 101,
      type: "Electrical",
      desc: "Street light blinking near Block A",
      priority: "Medium",
      status: "Resolved",
      date: "2026-02-01",
    },
    {
      id: 102,
      type: "Plumbing",
      desc: "Water leakage in basement pipe",
      priority: "High",
      status: "Pending",
      date: "2026-02-08",
    },
  ]);

  const [activeTab, setActiveTab] = useState("new");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, attachment: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newComplaint = {
      id: complaints.length + 101,
      type: formData.type,
      desc: formData.description,
      priority: formData.priority,
      status: "Pending",
      date: new Date().toISOString().split("T")[0],
    };

    setComplaints([newComplaint, ...complaints]);
    alert("Complaint Registered Successfully! Ticket ID: " + newComplaint.id);
    setFormData({
      type: "Maintenance",
      priority: "Low",
      description: "",
      attachment: null,
    });
    setActiveTab("history");
  };

  const getStatusBadge = (status) => {
    return status === "Resolved"
      ? "bg-green-600 text-white"
      : "bg-yellow-400 text-black";
  };

  return (
    <div className="max-w-6xl mx-auto my-12 px-4">
      <h2 className="text-3xl font-bold text-center mb-6">
        Help Desk & Complaints
      </h2>

      {/* TABS */}
      <div className="flex border-b mb-6">
        <button
          onClick={() => setActiveTab("new")}
          className={`px-5 py-2 font-semibold border-b-2 ${
            activeTab === "new"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-600"
          }`}
        >
          <i className="fas fa-plus-circle mr-2"></i>
          Raise New Complaint
        </button>

        <button
          onClick={() => setActiveTab("history")}
          className={`px-5 py-2 font-semibold border-b-2 ${
            activeTab === "history"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-600"
          }`}
        >
          <i className="fas fa-history mr-2"></i>
          My Complaints History
        </button>
      </div>

      {/* NEW COMPLAINT FORM */}
      {activeTab === "new" && (
        <div className="bg-white shadow-sm rounded p-6">
          <h5 className="font-bold text-blue-600 mb-4">Describe the Issue</h5>

          <form onSubmit={handleSubmit}>
            <div className="grid md:grid-cols-2 gap-4">
              {/* TYPE */}
              <div>
                <label className="font-bold block mb-1">
                  Complaint Type
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="Maintenance">General Maintenance</option>
                  <option value="Electrical">Electrical</option>
                  <option value="Plumbing">Plumbing</option>
                  <option value="Security">Security Concern</option>
                  <option value="Noise">Noise Complaint</option>
                </select>
              </div>

              {/* PRIORITY */}
              <div>
                <label className="font-bold block mb-1">
                  Priority Level
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="Low">Low (Routine)</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High (Urgent)</option>
                </select>
              </div>

              {/* DESCRIPTION */}
              <div className="md:col-span-2">
                <label className="font-bold block mb-1">Description</label>
                <textarea
                  rows="4"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  placeholder="Please describe the issue in detail..."
                  className="w-full border rounded px-3 py-2"
                ></textarea>
              </div>

              {/* FILE */}
              <div className="md:col-span-2">
                <label className="font-bold block mb-1">
                  Attach Photo (Optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              {/* SUBMIT */}
              <div className="md:col-span-2 text-right">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded font-bold hover:bg-blue-700"
                >
                  Submit Complaint
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* HISTORY TABLE */}
      {activeTab === "history" && (
        <div className="overflow-x-auto">
          <table className="w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 border text-left">Ticket ID</th>
                <th className="p-3 border text-left">Type</th>
                <th className="p-3 border text-left">Description</th>
                <th className="p-3 border text-left">Date</th>
                <th className="p-3 border text-left">Priority</th>
                <th className="p-3 border text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="p-3 border font-bold">#{item.id}</td>
                  <td className="p-3 border">{item.type}</td>
                  <td
                    className="p-3 border truncate max-w-[250px]"
                    title={item.desc}
                  >
                    {item.desc}
                  </td>
                  <td className="p-3 border">{item.date}</td>
                  <td className="p-3 border">
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        item.priority === "High"
                          ? "bg-red-600 text-white"
                          : "bg-gray-500 text-white"
                      }`}
                    >
                      {item.priority}
                    </span>
                  </td>
                  <td className="p-3 border">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${getStatusBadge(
                        item.status
                      )}`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RaiseComplaint;