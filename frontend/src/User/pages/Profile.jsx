import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import {
  User, Phone, MapPin, Edit2, ShieldCheck,
  Calendar, Mail, Sparkles, Loader2, Camera, CheckCircle2,
  Trash2, Home, Hash, Layers, CreditCard, Building2, X, Lock
} from "lucide-react";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { fetchResidentById, updateResident } from "../../store/slices/residentSlice";
import { PageLoader } from "../../components/PageLoader";

const emptyForm = {
  firstName: "",
  lastName: "",
  mobileNumber: "",
  email: "",
};

const TABS = [
  { id: "Personal", icon: User, label: "Identity" },
  { id: "Contact", icon: Phone, label: "Contact" },
  { id: "Address", icon: MapPin, label: "Property" },
  { id: "Security", icon: Lock, label: "Security" },
];

const BASE_URL = import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:4000";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";
const STRONG_PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;
const PASSWORD_HINT = "Use 8+ characters with uppercase, lowercase, number, and special character.";

const ProfilePage = () => {
  const user = JSON.parse(localStorage.getItem("userData") || "{}");
  const id = user?.profileId || user?._id;

  const [activeTab, setActiveTab] = useState("Personal");
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [previewImg, setPreviewImg] = useState(null);
  const [newImageFile, setNewImageFile] = useState(null);
  const fileInputRef = useRef(null);
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordLoading, setPasswordLoading] = useState(false);

  const dispatch = useDispatch();
  const { singleResident: data, profileLoading, loading } = useSelector((s) => s.resident);

  useEffect(() => {
    if (id) dispatch(fetchResidentById(id));
  }, [id, dispatch]);

  useEffect(() => {
    if (!data || editing) return;
    setForm({
      firstName: data.firstName || "",
      lastName: data.lastName || "",
      mobileNumber: data.mobileNumber != null ? String(data.mobileNumber) : "",
      email: data.email || "",
    });
    
    // If it's a relative path from server, add BASE_URL
    if (data.profileImage && !data.profileImage.startsWith("data:") && !data.profileImage.startsWith("http")) {
      setPreviewImg(`${BASE_URL}/${data.profileImage.replace(/\\/g, "/")}`);
    } else {
      setPreviewImg(data.profileImage || null);
    }
    setNewImageFile(null);
  }, [data, editing]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { toast.error("File must be under 2 MB"); return; }
    
    setNewImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreviewImg(reader.result);
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setPreviewImg(null);
    setNewImageFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleCancel = () => {
    setEditing(false);
    // Reset form to current data
    if (data) {
      setForm({
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        mobileNumber: data.mobileNumber != null ? String(data.mobileNumber) : "",
        email: data.email || "",
      });
      if (data.profileImage && !data.profileImage.startsWith("data:") && !data.profileImage.startsWith("http")) {
        setPreviewImg(`${BASE_URL}/${data.profileImage.replace(/\\/g, "/")}`);
      } else {
        setPreviewImg(data.profileImage || null);
      }
      setNewImageFile(null);
    }
  };

  const handleSave = async () => {
    if (!id) return;
    if (!/^\d{10}$/.test(form.mobileNumber)) {
      toast.error("Enter a valid 10-digit mobile number.");
      return;
    }
    if (!form.firstName.trim() || !form.lastName.trim()) {
      toast.error("First and last name are required.");
      return;
    }

    const formData = new FormData();
    formData.append("firstName", form.firstName.trim());
    formData.append("lastName", form.lastName.trim());
    formData.append("mobileNumber", form.mobileNumber);

    if (newImageFile) {
      formData.append("profileImage", newImageFile);
    } else if (previewImg === null) {
      // Logic for removing image could go here if server supports it via field
      formData.append("profileImage", ""); 
    }

    const result = await dispatch(updateResident({ id, formData }));
    if (result.meta.requestStatus === "fulfilled") {
      toast.success("Profile updated successfully!");
      setEditing(false);
      const u = JSON.parse(localStorage.getItem("userData") || "{}");
      localStorage.setItem("userData", JSON.stringify({ ...u, name: `${form.firstName} ${form.lastName}` }));
      window.dispatchEvent(new Event("esociety-userdata-updated"));
    } else {
      toast.error("Update failed. Please try again.");
    }
  };

  const setField = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const setPasswordField = (key) => (e) =>
    setPasswordForm((f) => ({ ...f, [key]: e.target.value }));

  const handleChangePassword = async (e) => {
    e.preventDefault();
    const { oldPassword, newPassword, confirmPassword } = passwordForm;

    if (!oldPassword) {
      toast.error("Current password is required.");
      return;
    }

    if (!STRONG_PASSWORD_REGEX.test(newPassword)) {
      toast.error(PASSWORD_HINT);
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password must match.");
      return;
    }

    setPasswordLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${API_URL}/auth/change-password`,
        { oldPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res?.data?.success) {
        toast.success("Password changed successfully.");
        setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        toast.error(res?.data?.message || "Failed to change password.");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update password. Verify current password.");
    } finally {
      setPasswordLoading(false);
    }
  };

  const fullName = `${form.firstName} ${form.lastName}`.trim() || "—";
  const initials = [form.firstName?.[0], form.lastName?.[0]].filter(Boolean).join("").toUpperCase() || "?";

  if (profileLoading || !data) return <PageLoader message="Loading profile..." />;

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] font-sans transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pt-16">

        {/* ── Page Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">My Profile</h1>
            <p className="text-sm text-[var(--text-muted)] mt-1">Manage your personal information and settings</p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {editing ? (
              <>
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--border)] text-sm font-medium hover:bg-[var(--bg-hover)] transition-all"
                >
                  <X size={15} /> Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-all disabled:opacity-60 shadow-lg shadow-indigo-500/20"
                >
                  {loading ? <Loader2 size={15} className="animate-spin" /> : <CheckCircle2 size={15} />}
                  Save Changes
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20"
              >
                <Edit2 size={15} /> Edit Profile
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">

          {/* ── Sidebar ── */}
          <aside className="space-y-4">
            {/* Profile Card */}
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">
              {/* Cover */}
              <div className="h-28 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 relative">
                {editing && (
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <span className="text-white/80 text-[10px] font-semibold uppercase tracking-widest">Editing</span>
                  </div>
                )}
              </div>

              <div className="px-6 pb-6">
                {/* Avatar */}
                <div className="relative -mt-12 mb-4 w-fit">
                  <div className={`w-24 h-24 rounded-2xl border-4 border-[var(--card)] overflow-hidden bg-indigo-100 flex items-center justify-center shadow-xl transition-all ${editing ? "ring-2 ring-indigo-500 ring-offset-2 ring-offset-[var(--card)]" : ""}`}>
                    {previewImg ? (
                      <img src={previewImg} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-2xl font-bold text-indigo-600">{initials}</span>
                    )}
                  </div>
                  
                    {editing && (
                      <div
                       
                       
                       
                        className="absolute -bottom-1 -right-1 flex gap-1.5"
                      >
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-lg hover:bg-indigo-500 transition-colors"
                          title="Upload photo"
                        >
                          <Camera size={13} />
                        </button>
                        {previewImg && (
                          <button
                            onClick={handleRemovePhoto}
                            className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-lg hover:bg-rose-500 transition-colors"
                            title="Remove photo"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    )}
                  
                  <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />
                </div>

                <h2 className="text-xl font-bold truncate">{fullName}</h2>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-600 text-[11px] font-semibold border border-indigo-500/20">
                    <ShieldCheck size={11} /> Resident Member
                  </span>
                </div>

                {/* Quick info */}
                <div className="mt-5 space-y-3">
                  <QuickInfoRow icon={Mail} label="Email" value={data.email} color="text-indigo-500" bg="bg-indigo-500/10" />
                  <QuickInfoRow icon={Phone} label="Mobile" value={data.mobileNumber ? `+91 ${data.mobileNumber}` : "—"} color="text-emerald-600" bg="bg-emerald-500/10" />
                  <QuickInfoRow icon={Calendar} label="Member Since" value={data.createdAt ? dayjs(data.createdAt).format("MMM YYYY") : "—"} color="text-amber-600" bg="bg-amber-500/10" />
                </div>
              </div>
            </div>

            {/* Property Summary Card */}
            {/* {data.flat && (
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 space-y-3">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-1">Property</p>
                <div className="grid grid-cols-2 gap-3">
                  <MiniStat label="Wing" value={data.wing || "—"} />
                  <MiniStat label="Flat No." value={data.flatNumber || "—"} />
                  <MiniStat label="Floor" value={data.flat?.floor ?? "—"} />
                  <MiniStat label="Type" value={data.flat?.type || "—"} />
                </div>
              </div> */}
            
          </aside>

          {/* ── Main Content ── */}
          <main>
            {/* Tabs */}
            <div className="flex gap-1 p-1 rounded-xl bg-[var(--card)] border border-[var(--border)] mb-5 overflow-x-auto scrollbar-hide">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`flex flex-1 items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-[12px] font-semibold uppercase tracking-wider whitespace-nowrap transition-all min-w-[80px] ${
                    activeTab === t.id
                      ? "bg-indigo-600 text-white shadow-md"
                      : "text-[var(--text-muted)] hover:bg-[var(--bg)]"
                  }`}
                >
                  <t.icon size={14} />
                  <span>{t.label}</span>
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">
              
                <div
                  key={activeTab}
                 
                 
                 
                 
                >
                  {/* Tab Header */}
                  <div className="px-6 pt-6 pb-4 border-b border-[var(--border)] flex items-center gap-3">
                    {(() => { const T = TABS.find(t => t.id === activeTab); return T ? <T.icon size={18} className="text-indigo-500" /> : null; })()}
                    <div>
                      <h3 className="font-bold text-base">
                        {activeTab === "Personal" && "Identity Information"}
                        {activeTab === "Contact" && "Contact Details"}
                        {activeTab === "Address" && "Property Information"}
                        {activeTab === "Security" && "Security Settings"}
                      </h3>
                      <p className="text-[12px] text-[var(--text-muted)] mt-0.5">
                        {activeTab === "Personal" && "Your core account identity details"}
                        {activeTab === "Contact" && "Phone number and email address"}
                        {activeTab === "Address" && "Your flat details"}
                        {activeTab === "Security" && "Change your password directly from here"}
                      </p>
                    </div>
                  </div>

                  <div className="p-6">

                    {/* ── Personal Tab ── */}
                    {activeTab === "Personal" && (
                      <div className="grid gap-5 sm:grid-cols-2">
                        <FormField
                          label="First Name"
                          value={form.firstName}
                          editing={editing}
                          onChange={setField("firstName")}
                          placeholder="Enter first name"
                        />
                        <FormField
                          label="Last Name"
                          value={form.lastName}
                          editing={editing}
                          onChange={setField("lastName")}
                          placeholder="Enter last name"
                        />
                        <FormField
                          label="Member Since"
                          value={data.createdAt ? dayjs(data.createdAt).format("DD MMM YYYY") : ""}
                          editing={false}
                          display={data.createdAt ? dayjs(data.createdAt).format("DD MMM YYYY") : "—"}
                        />
                        <FormField
                          label="Resident Type"
                          value={data.residentType || ""}
                          editing={false}
                          display={data.residentType || "—"}
                        />
                        <FormField
                          label="Account Status"
                          value={data.status || ""}
                          editing={false}
                          display={data.status || "—"}
                        />
                      </div>
                    )}

                    {/* ── Contact Tab ── */}
                    {activeTab === "Contact" && (
                      <div className="grid gap-5 sm:grid-cols-2">
                        <FormField
                          label="Mobile Number"
                          value={form.mobileNumber}
                          editing={editing}
                          maxLength={10}
                          placeholder="10-digit mobile"
                          onChange={(e) => setForm(f => ({ ...f, mobileNumber: e.target.value.replace(/\D/g, "") }))}
                          display={data.mobileNumber ? `+91 ${data.mobileNumber}` : "—"}
                          prefix={editing ? "+91" : undefined}
                        />
                        <FormField
                          label="Email Address"
                          type="email"
                          value={form.email}
                          editing={false}
                          display={form.email || "—"}
                        />

                        {/* Read-only info */}
                        <div className="sm:col-span-2">
                          <div className="mt-2 p-4 rounded-xl bg-amber-50 border border-amber-200 dark:bg-amber-900/10 dark:border-amber-700/30">
                            <p className="text-[12px] font-medium text-amber-700 dark:text-amber-400 flex items-center gap-2">
                              <ShieldCheck size={13} />
                              Email ID cannot be changed from resident profile. Contact administrator if needed.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ── Address Tab ── */}
                    {activeTab === "Address" && (
                      <div className="space-y-6">
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                          <AddressBox icon={Building2} label="Wing" value={data.wing} color="indigo" />
                          <AddressBox icon={Hash} label="Flat Number" value={data.flatNumber} color="purple" />
                          <AddressBox icon={Layers} label="Floor" value={data.flat?.floor} color="sky" />
                          <AddressBox icon={Home} label="Flat Type" value={data.flat?.type} color="amber" />
                          <AddressBox
                            icon={Home}
                            label="Occupancy Type"
                            value={data.flat?.occupancyType || data.residentType}
                            color="pink"
                          />
                          <AddressBox
                            icon={CreditCard}
                            label="Monthly Maintenance"
                            value={data.flat?.monthlyMaintenance ? `₹${Number(data.flat.monthlyMaintenance).toLocaleString("en-IN")}` : null}
                            color="emerald"
                          />
                        </div>

                        {data.flat?.description && (
                          <div className="p-4 rounded-xl bg-[var(--bg)] border border-[var(--border)]">
                            <p className="text-[11px] font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-2">Description</p>
                            <p className="text-sm leading-relaxed">{data.flat.description}</p>
                          </div>
                        )}

                        <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-200 dark:bg-indigo-900/10 dark:border-indigo-700/30">
                          <p className="text-[12px] text-indigo-700 dark:text-indigo-400 font-medium">
                            Property details are managed by the society administrator and cannot be edited here.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* ── Security Tab ── */}
                    {activeTab === "Security" && (
                      <div className="max-w-xl space-y-4">
                        <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-200 dark:bg-indigo-900/10 dark:border-indigo-700/30">
                          <p className="text-[12px] text-indigo-700 dark:text-indigo-400 font-medium">
                            Update your password from here. Use a strong password to keep your account secure.
                          </p>
                        </div>
                        <form onSubmit={handleChangePassword} className="grid gap-4 sm:grid-cols-2">
                          <FormField
                            label="Current Password"
                            type="password"
                            value={passwordForm.oldPassword}
                            editing
                            onChange={setPasswordField("oldPassword")}
                            placeholder="Enter current password"
                          />
                          <div />
                          <FormField
                            label="New Password"
                            type="password"
                            value={passwordForm.newPassword}
                            editing
                            onChange={setPasswordField("newPassword")}
                            placeholder="Create new password"
                          />
                          <FormField
                            label="Confirm New Password"
                            type="password"
                            value={passwordForm.confirmPassword}
                            editing
                            onChange={setPasswordField("confirmPassword")}
                            placeholder="Repeat new password"
                          />
                          <div className="sm:col-span-2">
                            <p className="text-[11px] text-[var(--text-muted)] mb-3">{PASSWORD_HINT}</p>
                            <button
                              type="submit"
                              disabled={passwordLoading}
                              className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-all disabled:opacity-60"
                            >
                              {passwordLoading ? "Updating..." : "Change Password"}
                            </button>
                          </div>
                        </form>
                      </div>
                    )}

                  </div>
                </div>
              
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

/* ── Helper Components ── */

const QuickInfoRow = ({ icon: Icon, label, value, color, bg }) => (
  <div className="flex items-center gap-3">
    <div className={`w-8 h-8 rounded-lg ${bg} ${color} flex items-center justify-center shrink-0`}>
      <Icon size={14} />
    </div>
    <div className="min-w-0">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)] leading-none mb-0.5">{label}</p>
      <p className="text-sm font-medium truncate">{value || "—"}</p>
    </div>
  </div>
);

const MiniStat = ({ label, value }) => (
  <div className="rounded-xl bg-[var(--bg)] border border-[var(--border)] px-3 py-2.5">
    <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1">{label}</p>
    <p className="text-sm font-bold">{value}</p>
  </div>
);

const DisplayValue = ({ value }) => (
  <div className="px-4 py-3 bg-[var(--bg)] rounded-xl border border-[var(--border)] text-sm font-medium">
    {value || "—"}
  </div>
);

const FormField = ({ label, value, editing, onChange, type = "text", placeholder, maxLength, display, prefix }) => (
  <div className="flex flex-col gap-2">
    <label className="text-[11px] font-semibold uppercase tracking-widest text-[var(--text-muted)]">{label}</label>
    {editing ? (
      <div className={`flex items-center bg-[var(--bg)] border border-[var(--border)] rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 transition-all`}>
        {prefix && (
          <span className="px-3 text-sm text-[var(--text-muted)] font-medium border-r border-[var(--border)] bg-[var(--card)] py-3 shrink-0">
            {prefix}
          </span>
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          maxLength={maxLength}
          placeholder={placeholder}
          className="w-full bg-transparent px-4 py-3 text-sm font-medium outline-none placeholder:text-[var(--text-muted)]/50"
        />
      </div>
    ) : (
      <DisplayValue value={display !== undefined ? display : value} />
    )}
  </div>
);

const colorMap = {
  indigo: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20",
  purple: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  pink:   "bg-pink-500/10 text-pink-600 border-pink-500/20",
  sky:    "bg-sky-500/10 text-sky-600 border-sky-500/20",
  amber:  "bg-amber-500/10 text-amber-600 border-amber-500/20",
  emerald:"bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
};

const AddressBox = ({ icon: Icon, label, value, color }) => (
  <div className="p-5 rounded-xl bg-[var(--bg)] border border-[var(--border)] flex items-start gap-3 hover:border-indigo-500/30 transition-colors">
    <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border ${colorMap[color] || colorMap.indigo}`}>
      <Icon size={15} />
    </div>
    <div className="min-w-0">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-1">{label}</p>
      <p className="text-base font-bold truncate">{value || "—"}</p>
    </div>
  </div>
);

export default ProfilePage;