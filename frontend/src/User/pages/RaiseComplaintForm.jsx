import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
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
      className="user-page-mesh min-h-screen bg-[var(--bg)] p-4 text-[var(--text)] transition-colors duration-300 sm:p-6"
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');`}</style>

      <div className="relative z-[1] mx-auto max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="overflow-hidden rounded-[28px] border border-[var(--border)] bg-[var(--card)] shadow-sm">
            <div className="grid gap-6 px-6 py-7 md:grid-cols-[1.2fr_0.8fr] md:px-8">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.24em] text-orange-700">
                  <Sparkles size={13} />
                  New Complaint
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/15">
                    <Wrench size={24} className="text-orange-600" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-black tracking-tight text-[var(--text)]">Create complaint</h1>
                    <p className="text-sm text-[var(--text-muted)]">Submit a new issue and we&apos;ll take you back to your complaint list after save.</p>
                  </div>
                </div>
              </div>

              <div className="flex items-start justify-end">
                <button
                  type="button"
                  onClick={handleBack}
                  className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                >
                  <ArrowLeft size={16} />
                  Back to List
                </button>
              </div>
            </div>
          </div>
        </motion.div>

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
