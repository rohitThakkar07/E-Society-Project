import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { Wrench, ArrowLeft, Sparkles } from "lucide-react";
import { createComplaint } from "../../store/slices/complaintSlice";
import { fetchResidentFlat } from "../../store/slices/flatSlice";
import ComplaintFormSection from "../components/ComplaintFormSection";

const categoryColors = {
  Water: "bg-blue-50 text-blue-600",
  Electricity: "bg-amber-50 text-amber-600",
  Security: "bg-red-50 text-red-600",
  Maintenance: "bg-violet-50 text-violet-600",
  Other: "bg-slate-100 text-slate-600",
};

const initialForm = {
  title: "",
  description: "",
  category: "Other",
  attachment: null,
  attachmentPreview: null,
};

const RaiseComplaintForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading: complaintLoading } = useSelector((s) => s.complaint || {});
  const { singleFlat: flat } = useSelector((s) => s.flat || {});

  const user = JSON.parse(localStorage.getItem("userData") || "{}");
  const userId = user?._id || user?.id || "";
  const residentId = user?.profileId || user?.resident?._id || user?.residentId || user?._id || user?.id || "";

  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (userId) {
      dispatch(fetchResidentFlat(userId));
    }
  }, [dispatch, userId]);

  const residentDetails = useMemo(() => {
    const wing = flat?.wing || flat?.block || user?.wing || "";
    const flatNumber = flat?.flatNumber || user?.flatNumber || "";
    return { wing, flatNumber };
  }, [flat, user]);

  const hasResidentLocation = Boolean(residentDetails.wing || residentDetails.flatNumber);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm((prev) => ({
        ...prev,
        attachment: file,
        attachmentPreview: URL.createObjectURL(file),
      }));
    }
  };

  const resetForm = () => {
    if (form.attachmentPreview) {
      URL.revokeObjectURL(form.attachmentPreview);
    }
    setForm(initialForm);
  };

  const handleBack = () => {
    resetForm();
    navigate("/raise-complaint");
  };

  const handleCreate = async (e) => {
    e.preventDefault();

    if (!residentId) {
      alert("Error: Unable to identify user. Please login again.");
      return;
    }

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("category", form.category);
    formData.append("resident", residentId);
    if (form.attachment) formData.append("attachment", form.attachment);

    const result = await dispatch(createComplaint(formData));

    if (result.type.endsWith("fulfilled")) {
      resetForm();
      navigate("/raise-complaint");
    }
  };

  return (
    <div
      style={{ fontFamily: "'DM Sans', sans-serif" }}
      className="user-page-mesh min-h-screen bg-[var(--bg)] p-4 text-[var(--text)] transition-colors duration-300 sm:p-8"
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');`}</style>

      <div className="relative z-[1] mx-auto max-w-5xl">
        <div className="mb-6 mt-4">
          <div className="overflow-hidden rounded-[1.5rem] border border-[var(--border)] bg-[var(--card)] shadow-lg">
            <div className="grid gap-4 px-5 py-6 md:grid-cols-[1fr_auto] md:px-8">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-0.5 text-[9px] font-black uppercase tracking-[0.24em] text-indigo-700">
                  <Sparkles size={11} />
                  New Complaint
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/10">
                    <Wrench size={22} />
                  </div>
                  <div>
                    <h1 className="text-2xl font-black tracking-tighter text-[var(--text)]">Submit Complaint</h1>
                    <p className="text-[11px] text-[var(--text-muted)] opacity-80">Provide details about the issue and attach photo proof.</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <button
                  type="button"
                  onClick={handleBack}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-white px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-700 transition hover:bg-slate-50 w-full sm:w-auto shadow-sm"
                >
                  <ArrowLeft size={14} />
                  Back
                </button>
              </div>
            </div>
          </div>
        </div>

        <ComplaintFormSection
          form={form}
          setForm={setForm}
          residentDetails={residentDetails}
          hasResidentLocation={hasResidentLocation}
          categoryColors={categoryColors}
          complaintLoading={complaintLoading}
          residentId={residentId}
          onReset={resetForm}
          onSubmit={handleCreate}
          onFileChange={handleFileChange}
          onCancel={handleBack}
        />
      </div>
    </div>
  );
};

export default RaiseComplaintForm;
