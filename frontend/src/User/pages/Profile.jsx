import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  User, Phone, FileText, MapPin,
  MoreVertical, Edit2, ShieldCheck, Calendar, Mail
} from "lucide-react";
import dayjs from "dayjs";
import { fetchResidentById } from "../../store/slices/residentSlice";

const ProfilePage = () => {
  const user = JSON.parse(localStorage.getItem("userData") || "{}");
  const id   = user?.profileId;

  const [activeTab, setActiveTab] = useState("Personal");
  const dispatch = useDispatch();

  // FIX: Read profileLoading (not loading) from residentSlice.
  // profileLoading is ONLY set by fetchResidentById, so it will never be
  // stuck true because of an unrelated action in another slice or component.
  const { singleResident: data, profileLoading } = useSelector((state) => state.resident);

  useEffect(() => {
    if (id) {
      dispatch(fetchResidentById(id));
    }
  }, [id, dispatch]);

  const tabs = [
    { id: "Personal", icon: <User size={18} />,    label: "Personal"    },
    { id: "Contact",  icon: <Phone size={18} />,   label: "Contact"     },
    { id: "Document", icon: <FileText size={18} />, label: "Document"   },
    { id: "Address",  icon: <MapPin size={18} />,  label: "Flat Detail" },
  ];

  // FIX: Only block on profileLoading — NOT a generic loading flag that
  // any other async action could flip back to true.
  if (profileLoading || !data) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 bg-blue-100 rounded-full mb-4"></div>
          <p className="text-slate-400 font-medium">Loading Profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="p-6 bg-[#f8fafc] min-h-screen">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Fraunces:wght@700;800;900&display=swap');
        .profile-hero-bg { background: linear-gradient(135deg, #0a0f1e 0%, #0d1f3c 100%); }
        .glass-input { background: #f8fafc; border: 1px solid #e2e8f0; transition: all 0.2s ease; }
        .card-shadow { box-shadow: 0 10px 30px -5px rgba(0,0,0,0.04); }
      `}</style>

      <div className="max-w-6xl mx-auto">

        {/* PAGE HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900" style={{ fontFamily: "'Fraunces', serif" }}>
            My Profile
          </h1>
          <p className="text-slate-500 text-sm font-medium">Manage your personal information and preferences</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* LEFT SIDEBAR */}
          <div className="w-full lg:w-96 flex flex-col gap-6">
            <div className="bg-white rounded-[32px] card-shadow border border-slate-100 overflow-hidden">

              <div className="h-24 profile-hero-bg w-full relative">
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "24px 24px" }}></div>
              </div>

              <div className="px-6 pb-8 flex flex-col items-center">
                <div className="relative -mt-12">
                  <div className="w-28 h-28 rounded-[24px] bg-white p-1 shadow-xl">
                    <div className="w-full h-full rounded-[20px] bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-50">
                      {data.profileImage ? (
                        <img src={data.profileImage} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <User size={48} className="text-slate-300" />
                      )}
                    </div>
                  </div>
                  <button className="absolute bottom-1 -right-1 bg-blue-600 text-white p-2 rounded-xl shadow-lg hover:bg-blue-700 transition active:scale-95">
                    <Edit2 size={14} />
                  </button>
                </div>

                <h2 className="mt-4 text-2xl font-bold text-slate-900" style={{ fontFamily: "'Fraunces', serif" }}>
                  {data.firstName} {data.lastName}
                </h2>

                <div className="mt-2 inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                  <ShieldCheck size={12} />
                  {data.residentType}
                </div>

                <div className="w-full mt-8 space-y-4">
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-blue-600 shadow-sm">
                      <Mail size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Email Address</p>
                      <p className="text-sm font-bold text-slate-700 truncate">{data.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-emerald-600 shadow-sm">
                      <Phone size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Phone Number</p>
                      <p className="text-sm font-bold text-slate-700">{data.mobileNumber}</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex justify-between items-center px-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Status</span>
                    <span className={`text-xs font-black uppercase px-3 py-1 rounded-lg ${data.status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                      ● {data.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex-1 flex flex-col gap-6">

            {/* TAB NAVIGATION */}
            <div className="bg-white p-2 rounded-[24px] card-shadow border border-slate-100 flex gap-1 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 rounded-[18px] flex items-center gap-2 text-sm font-bold transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? "bg-slate-900 text-white shadow-lg shadow-slate-200"
                      : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            {/* CONTENT */}
            <div className="bg-white p-8 rounded-[32px] card-shadow border border-slate-100">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-bold text-slate-800" style={{ fontFamily: "'Fraunces', serif" }}>
                  {activeTab} Details
                </h2>
                <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-xl transition">
                  <MoreVertical size={20} />
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-x-8 gap-y-6">
                {activeTab === "Personal" && (
                  <>
                    <InputGroup label="First Name"     value={data.firstName} />
                    <InputGroup label="Last Name"      value={data.lastName} />
                    <InputGroup label="Date of Birth"  icon={<Calendar size={14} />} value={data.dateOfBirth ? dayjs(data.dateOfBirth).format("DD MMM YYYY") : "Not Set"} />
                    <InputGroup label="Gender"         value={data.gender} />
                    <InputGroup label="Resident Type"  value={data.residentType} />
                  </>
                )}

                {activeTab === "Contact" && (
                  <>
                    <InputGroup label="Primary Mobile"          value={data.mobileNumber} />
                    <InputGroup label="Email Address"           value={data.email} />
                    <InputGroup label="Emergency Contact Name"  value={data.emergencyContactName} />
                    <InputGroup label="Emergency Contact No"    value={data.emergencyContactNumber} />
                  </>
                )}

                {activeTab === "Address" && (
                  <>
                    <InputGroup label="Wing / Block"         value={data.wing} />
                    <InputGroup label="Floor Number"         value={data.flat?.floor} />
                    <InputGroup label="Flat Number"          value={data.flatNumber} />
                    <InputGroup label="Flat Type (BHK)"      value={data.flat?.type} />
                    <InputGroup label="Block"                value={data.flat?.block} />
                    <InputGroup label="Monthly Maintenance"  value={data.flat?.monthlyMaintenance ? `₹${data.flat.monthlyMaintenance}` : null} />
                  </>
                )}
              </div>

              <div className="mt-12 pt-6 border-t border-slate-50 flex justify-end">
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-2xl transition-all shadow-lg shadow-blue-100 active:scale-95 flex items-center gap-2">
                  <Edit2 size={16} /> Edit Profile Info
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

const InputGroup = ({ label, value, icon }) => (
  <div className="flex flex-col group">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">
      {label}
    </label>
    <div className="relative">
      <input
        value={value || "—"}
        readOnly
        className="w-full glass-input rounded-2xl px-4 py-3.5 text-sm font-bold text-slate-700 outline-none group-hover:border-blue-200"
      />
      {icon && <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300">{icon}</div>}
    </div>
  </div>
);

export default ProfilePage;