import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  User,
  Phone,
  FileText,
  MapPin,
  Edit2,
  ShieldCheck,
  Calendar,
  Mail,
  Sparkles,
  X,
  Loader2,
} from "lucide-react";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { fetchResidentById, updateResident } from "../../store/slices/residentSlice";
import { PageLoader } from "../../components/PageLoader";

const emptyForm = {
  firstName: "",
  lastName: "",
  gender: "Male",
  dateOfBirth: "",
  mobileNumber: "",
  email: "",
};

const ProfilePage = () => {
  const user = JSON.parse(localStorage.getItem("userData") || "{}");
  const id = user?.profileId;
  const isResident = user?.role?.toLowerCase() === "resident";

  const [activeTab, setActiveTab] = useState("Personal");
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const dispatch = useDispatch();
  const { singleResident: data, profileLoading, loading } = useSelector((state) => state.resident);

  useEffect(() => {
    if (id) {
      dispatch(fetchResidentById(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (!data || editing) return;
    setForm({
      firstName: data.firstName || "",
      lastName: data.lastName || "",
      gender: data.gender === "Female" ? "Female" : "Male",
      dateOfBirth: data.dateOfBirth ? dayjs(data.dateOfBirth).format("YYYY-MM-DD") : "",
      mobileNumber: data.mobileNumber != null ? String(data.mobileNumber) : "",
      email: data.email || "",
    });
  }, [data, editing]);

  const tabs = [
    { id: "Personal", icon: <User size={18} />, label: "Personal" },
    { id: "Contact", icon: <Phone size={18} />, label: "Contact" },
    { id: "Document", icon: <FileText size={18} />, label: "Document" },
    { id: "Address", icon: <MapPin size={18} />, label: "Flat" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "mobileNumber") {
      setForm((prev) => ({ ...prev, [name]: value.replace(/\D/g, "").slice(0, 10) }));
      return;
    }
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => {
    setEditing(false);
    if (data) {
      setForm({
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        gender: data.gender === "Female" ? "Female" : "Male",
        dateOfBirth: data.dateOfBirth ? dayjs(data.dateOfBirth).format("YYYY-MM-DD") : "",
        mobileNumber: data.mobileNumber != null ? String(data.mobileNumber) : "",
        email: data.email || "",
      });
    }
  };

  const handleSave = async () => {
    if (!id) return;
    const payload = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      gender: form.gender,
      dateOfBirth: form.dateOfBirth || null,
      mobileNumber: form.mobileNumber.replace(/\D/g, "").slice(0, 10),
      email: form.email.trim().toLowerCase(),
    };

    if (payload.mobileNumber.length !== 10) {
      toast.error("Enter a valid 10-digit mobile number.");
      return;
    }

    const result = await dispatch(updateResident({ id, formData: payload }));
    if (result.meta.requestStatus === "fulfilled" && result.payload) {
      const updated = result.payload;
      try {
        const u = JSON.parse(localStorage.getItem("userData") || "{}");
        localStorage.setItem(
          "userData",
          JSON.stringify({
            ...u,
            name: `${updated.firstName || ""} ${updated.lastName || ""}`.trim(),
            email: updated.email,
          })
        );
        window.dispatchEvent(new Event("esociety-userdata-updated"));
      } catch {
        /* ignore */
      }
      setEditing(false);
    }
  };

  const mobileValid = useMemo(() => {
    const d = (form.mobileNumber || "").replace(/\D/g, "");
    return d.length === 10;
  }, [form.mobileNumber]);

  if (profileLoading || !data) {
    return <PageLoader message="Loading profile…" />;
  }

  const showEditChrome = isResident;

  return (
    <div className="user-page-mesh min-h-screen bg-[var(--bg)] p-4 font-sans text-[var(--text)] transition-colors duration-300 sm:p-6">
      <div className="relative z-[1] mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <span className="mb-2 inline-flex items-center gap-2 rounded-md border border-[var(--border)] bg-[var(--accent-soft)] px-3 py-1 text-[10px] font-black uppercase tracking-widest text-[var(--accent)]">
              <Sparkles size={12} /> Account
            </span>
            <h1 className="text-3xl font-black tracking-tight text-[var(--text)]">My profile</h1>
            <p className="mt-1 text-sm text-[var(--text-muted)]">
              {showEditChrome
                ? "Update your personal and contact details. Flat assignment is managed by the office."
                : "Your details as registered with the society"}
            </p>
          </div>
        </motion.div>

        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Sidebar card */}
          <motion.aside
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.05 }}
            className="w-full shrink-0 lg:w-[380px]"
          >
            <div className="overflow-hidden rounded-xl border bg-[var(--card)] shadow-[var(--shadow-lg)] transition-colors" style={{ borderColor: "var(--border)" }}>
              <div
                className="relative h-28 w-full"
                style={{
                  background: "linear-gradient(125deg, var(--accent), #6366f1, #8b5cf6)",
                }}
              >
                <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "20px 20px" }} />
              </div>

              <div className="-mt-14 flex flex-col items-center px-6 pb-8 pt-0">
                <div className="relative">
                  <div className="rounded-xl border-4 border-[var(--card)] bg-[var(--card)] p-0.5 shadow-lg">
                    <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-lg bg-[var(--accent-bg)]">
                      {data.profileImage ? (
                        <img src={data.profileImage} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <User size={48} className="text-[var(--text-muted)]" />
                      )}
                    </div>
                  </div>
                </div>

                <h2 className="mt-4 text-center text-xl font-black text-[var(--text)]">
                  {editing ? `${form.firstName} ${form.lastName}`.trim() || "—" : `${data.firstName} ${data.lastName}`}
                </h2>

                <div className="mt-2 inline-flex items-center gap-1.5 rounded-md bg-[var(--accent-soft)] px-3 py-1 text-[10px] font-black uppercase tracking-widest text-[var(--accent)]">
                  <ShieldCheck size={12} />
                  {data.residentType}
                </div>

                <div className="mt-8 w-full space-y-3">
                  <div className="flex items-center gap-3 rounded-md border border-[var(--border)] bg-[var(--accent-bg)] p-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[var(--card)] text-[var(--accent)] shadow-sm">
                      <Mail size={18} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-bold uppercase tracking-tight text-[var(--text-muted)]">Email</p>
                      <p className="truncate text-sm font-bold">{editing ? form.email || "—" : data.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-md border border-[var(--border)] bg-[var(--accent-bg)] p-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[var(--card)] text-emerald-600 shadow-sm">
                      <Phone size={18} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-bold uppercase tracking-tight text-[var(--text-muted)]">Phone</p>
                      <p className="text-sm font-bold">{editing ? form.mobileNumber || "—" : data.mobileNumber}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between rounded-md border border-[var(--border)] px-3 py-2">
                    <span className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">Status</span>
                    <span
                      className={`rounded-md px-3 py-1 text-xs font-black uppercase ${
                        data.status === "Active" ? "bg-emerald-500/15 text-emerald-600" : "bg-red-500/15 text-red-600"
                      }`}
                    >
                      {data.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.aside>

          {/* Main */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="min-w-0 flex-1 space-y-6"
          >
            <div className="flex gap-1 overflow-x-auto rounded-md border border-[var(--border)] bg-[var(--card)] p-1 shadow-sm">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex min-w-[7rem] flex-1 items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-bold transition-all sm:min-w-0 ${
                    activeTab === tab.id
                      ? "bg-[var(--accent)] text-white shadow-md"
                      : "text-[var(--text-muted)] hover:bg-[var(--accent-soft)]"
                  }`}
                >
                  {tab.icon}
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>

            <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow)] sm:p-8">
              <h2 className="mb-6 text-lg font-black text-[var(--text)]">{activeTab}</h2>

              {activeTab === "Personal" && (
                <div className="grid gap-6 md:grid-cols-2">
                  {editing && showEditChrome ? (
                    <>
                      <EditableField label="First name" name="firstName" value={form.firstName} onChange={handleChange} />
                      <EditableField label="Last name" name="lastName" value={form.lastName} onChange={handleChange} />
                      <div className="group flex flex-col">
                        <label className="mb-1.5 px-0.5 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">
                          Date of birth
                        </label>
                        <div className="relative">
                          <input
                            type="date"
                            name="dateOfBirth"
                            value={form.dateOfBirth}
                            onChange={handleChange}
                            className="w-full rounded-md border border-[var(--border)] bg-[var(--bg-alt)] px-3 py-3 text-sm font-bold text-[var(--text)] outline-none transition focus:border-[var(--accent)]"
                          />
                          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
                            <Calendar size={14} />
                          </div>
                        </div>
                      </div>
                      <div className="group flex flex-col">
                        <label className="mb-1.5 px-0.5 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Gender</label>
                        <select
                          name="gender"
                          value={form.gender}
                          onChange={handleChange}
                          className="w-full rounded-md border border-[var(--border)] bg-[var(--bg-alt)] px-3 py-3 text-sm font-bold text-[var(--text)] outline-none transition focus:border-[var(--accent)]"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </select>
                      </div>
                      <InputGroup label="Resident type" value={data.residentType} />
                    </>
                  ) : (
                    <>
                      <InputGroup label="First name" value={data.firstName} />
                      <InputGroup label="Last name" value={data.lastName} />
                      <InputGroup
                        label="Date of birth"
                        icon={<Calendar size={14} />}
                        value={data.dateOfBirth ? dayjs(data.dateOfBirth).format("DD MMM YYYY") : "—"}
                      />
                      <InputGroup label="Gender" value={data.gender} />
                      <InputGroup label="Resident type" value={data.residentType} />
                    </>
                  )}
                </div>
              )}

              {activeTab === "Contact" && (
                <div className="grid gap-6 md:grid-cols-2">
                  {editing && showEditChrome ? (
                    <>
                      <EditableField
                        label="Primary mobile (10 digits)"
                        name="mobileNumber"
                        value={form.mobileNumber}
                        onChange={handleChange}
                        inputMode="numeric"
                        maxLength={10}
                        error={form.mobileNumber.length > 0 && !mobileValid ? "Enter a valid 10-digit mobile number" : null}
                      />
                      <EditableField label="Email" name="email" type="email" value={form.email} onChange={handleChange} />
                    </>
                  ) : (
                    <>
                      <InputGroup label="Primary mobile" value={data.mobileNumber} />
                      <InputGroup label="Email" value={data.email} />
                    </>
                  )}
                </div>
              )}

              {activeTab === "Document" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="rounded-md border border-dashed border-[var(--border)] bg-[var(--accent-bg)]/40 p-8 text-center"
                >
                  <FileText className="mx-auto mb-3 text-[var(--accent)]" size={36} />
                  <p className="font-bold text-[var(--text)]">Documents</p>
                  <p className="mt-2 text-sm text-[var(--text-muted)]">
                    ID and society documents will appear here when uploaded by the office.
                  </p>
                </motion.div>
              )}

              {activeTab === "Address" && (
                <div className="space-y-6">
                  <p className="text-sm text-[var(--text-muted)]">
                    Wing, flat, and billing are assigned by the society office. Contact admin if you need a correction.
                  </p>
                  <div className="grid gap-6 md:grid-cols-2">
                    <InputGroup label="Wing / block" value={data.wing} />
                    <InputGroup label="Floor" value={data.flat?.floor} />
                    <InputGroup label="Flat number" value={data.flatNumber} />
                    <InputGroup label="Flat type (BHK)" value={data.flat?.type} />
                    <InputGroup label="Block" value={data.flat?.block} />
                    <InputGroup
                      label="Monthly maintenance"
                      value={data.flat?.monthlyMaintenance ? `₹${data.flat.monthlyMaintenance}` : "—"}
                    />
                  </div>
                </div>
              )}

              {showEditChrome && (
                <div className="mt-10 flex flex-wrap justify-end gap-3 border-t border-[var(--border)] pt-6">
                  {editing ? (
                    <>
                      <button
                        type="button"
                        onClick={handleCancel}
                        disabled={loading}
                        className="inline-flex items-center gap-2 rounded-md border border-[var(--border)] bg-[var(--bg-alt)] px-5 py-2.5 text-sm font-bold text-[var(--text)] transition hover:bg-[var(--accent-soft)] disabled:opacity-50"
                      >
                        <X size={16} /> Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleSave}
                        disabled={loading || !mobileValid || !form.email.trim()}
                        className="user-btn-primary inline-flex items-center gap-2 rounded-md px-6 py-2.5 disabled:opacity-50"
                      >
                        {loading ? <Loader2 size={16} className="animate-spin" /> : <Edit2 size={16} />}
                        Save changes
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setEditing(true)}
                      className="user-btn-primary inline-flex items-center gap-2 rounded-md px-6 py-2.5"
                    >
                      <Edit2 size={16} /> Edit profile
                    </button>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const InputGroup = ({ label, value, icon }) => (
  <div className="group flex flex-col">
    <label className="mb-1.5 px-0.5 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">{label}</label>
    <div className="relative">
      <input
        readOnly
        value={value || "—"}
        className="w-full rounded-md border border-[var(--border)] bg-[var(--bg-alt)] px-3 py-3 text-sm font-bold text-[var(--text)] outline-none transition group-hover:border-[var(--accent)]"
      />
      {icon && <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">{icon}</div>}
    </div>
  </div>
);

const EditableField = ({ label, name, value, onChange, type = "text", error, inputMode, maxLength }) => (
  <div className="group flex flex-col">
    <label className="mb-1.5 px-0.5 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      inputMode={inputMode}
      maxLength={maxLength}
      className={`w-full rounded-md border bg-[var(--bg-alt)] px-3 py-3 text-sm font-bold text-[var(--text)] outline-none transition focus:border-[var(--accent)] ${
        error ? "border-red-400" : "border-[var(--border)]"
      }`}
    />
    {error && <p className="mt-1 text-xs font-semibold text-red-500">{error}</p>}
  </div>
);

export default ProfilePage;
