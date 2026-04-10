import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { User, Phone, FileText, Briefcase, MapPin, MoreVertical, Edit2} from "lucide-react";
import dayjs from 'dayjs'
import { fetchResidentById } from '../../store/slices/residentSlice';
const ProfilePage = () => {

  const user = JSON.parse(localStorage.getItem("userData") || "{}");
  const id = user?.profileId;

  const [activeTab, setActiveTab] = useState("Personal");
  const dispatch = useDispatch();
  const { singleResident: data, loading } = useSelector(
    (state) => state.resident
  );

  useEffect(() => {
    if (id) {
      console.log("Dispatching API with ID:", id);
      dispatch(fetchResidentById(id));
    }
  }, [id, dispatch]);

  const tabs = [
    { id: "Personal", icon: <User size={16} />, label: "Personal" },
    { id: "Contact", icon: <Phone size={16} />, label: "Contact" },
    { id: "Document", icon: <FileText size={16} />, label: "Document" },
    { id: "Address", icon: <MapPin size={16} />, label: "Flat Detail" },
  ];

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-400 text-sm">Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">

        {/* LEFT SIDEBAR */}
        <div className="w-full lg:w-80 bg-white rounded-2xl shadow-sm border p-6 flex flex-col items-center text-center h-fit">

          <div className="relative group">
            <div className="w-32 h-32 rounded-full bg-slate-100 border-4 border-white shadow-md flex items-center justify-center overflow-hidden">
              {data.profileImage ? (
                <img src={data.profileImage} alt="Profile" />
              ) : (
                <User size={64} className="text-slate-300" />
              )}
            </div>
            <button className="absolute bottom-1 right-1 bg-blue-600 text-white p-2 rounded-full hover:scale-110 transition">
              <Edit2 size={14} />
            </button>
          </div>

          <h2 className="mt-4 text-xl font-bold">
            {data.firstName} {data.lastName}
          </h2>

          <div className="mt-4 bg-blue-50 text-blue-700 px-4 py-2 rounded-xl flex items-center gap-2">
            <Briefcase size={16} />
            <span className="font-bold">{data.residentType}</span>
          </div>

          <div className="w-full mt-6 text-left space-y-3 border-t pt-4">
            <DetailRow label="Gender" value={data.gender} />
            <DetailRow label="DOB" value={data.dateOfBirth ? dayjs(data.dateOfBirth).format("DD MMM YYYY") : ""}/>
            <DetailRow label="Email" value={data.email} />
            <DetailRow label="Contact" value={data.mobileNumber} />
            <div className="flex justify-between">
              <span>Status</span>
              <span className={`font-bold ${data.status === "Active" ? "text-green-600" : "text-red-500"}`}>
                {data.status}
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex-1 flex flex-col gap-6">

          {/* TABS */}
          <div className="bg-white p-2 rounded-2xl flex gap-2 flex-wrap">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl flex items-center gap-2 ${activeTab === tab.id ? "bg-black text-white" : "text-gray-500 hover:bg-gray-100"
                  }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* CONTENT */}
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <div className="flex justify-between mb-6">
              <h2 className="font-bold text-lg">{activeTab} Details</h2>
              <MoreVertical />
            </div>

            {activeTab === "Personal" && (
              <div className="grid md:grid-cols-2 gap-4">
                <InputGroup label="First Name" value={data.firstName} />
                <InputGroup label="Last Name" value={data.lastName} />
                <InputGroup label="DOB" value={data.dateOfBirth ? dayjs(data.dateOfBirth).format("DD MMM YYYY") : ""}/>
                <InputGroup label="Gender" value={data.gender} />
                <InputGroup label="Aadhar" value={data.idProofNumber} />
                <InputGroup label="Type" value={data.residentType} />
              </div>
            )}

            {activeTab === "Contact" && (
              <div className="grid md:grid-cols-2 gap-4">
                <InputGroup label="Mobile" value={data.mobileNumber} />
                <InputGroup label="Email" value={data.email} />
                <InputGroup label="Emergency Name" value={data.emergencyContactName} />
                <InputGroup label="Emergency No" value={data.emergencyContactNumber} />
              </div>
            )}

            {activeTab === "Address" && (
              <div className="grid md:grid-cols-2 gap-4">
                <InputGroup label="Wing" value={data.wing} />
                <InputGroup label="Floor" value={data.floorNumber} />
                <InputGroup label="Flat" value={data.flatNumber} />
                <InputGroup label="Type" value={data.flatType} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailRow = ({ label, value }) => (
  <div className="flex justify-between">
    <span className="text-gray-500">{label}</span>
    <span className="font-bold">{value}</span>
  </div>
);

const InputGroup = ({ label, value }) => (
  <div className="flex flex-col">
    <label className="text-xs text-gray-400">{label}</label>
    <input
      value={value || ""}
      readOnly
      className="border rounded px-3 py-2 mt-1 bg-gray-50"
    />
  </div>
);

export default ProfilePage;