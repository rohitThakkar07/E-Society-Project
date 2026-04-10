import React from "react";
import { FileUp, MapPin, Building2, MessageSquare, ShieldAlert, X } from "lucide-react";

const ComplaintFormSection = ({
  form,
  setForm,
  residentDetails,
  hasResidentLocation,
  categoryColors,
  complaintLoading,
  residentId,
  onReset,
  onSubmit,
  onFileChange,
  onCancel,
}) => {
  return (
    <div className="overflow-hidden rounded-[30px] border border-[var(--border)] bg-[var(--card)] shadow-sm">
      <div className="border-b border-[var(--border)] bg-[linear-gradient(135deg,#fff7ed_0%,#ffffff_52%,#fffbeb_100%)] px-6 py-6 sm:px-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-orange-700 shadow-sm">
              <MessageSquare size={13} />
              Complaint Form
            </div>
            <h2 className="text-2xl font-black text-[var(--text)]">Create Complaint</h2>
            <p className="mt-1 text-sm text-[var(--text-muted)]">
              Share the issue clearly and add a photo if it helps explain the problem faster.
            </p>
          </div>

          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-[var(--border)] bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-800"
          >
            Close
          </button>
        </div>
      </div>

      <div className="space-y-6 px-6 py-6 sm:px-8 sm:py-8">
        <div className="grid gap-4 md:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--accent-bg)] p-4">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Resident Link</p>
            <p className="mt-2 text-sm font-semibold text-slate-700">
              This complaint will be submitted for your logged-in resident account automatically.
            </p>
          </div>
          <div className="rounded-2xl border border-orange-100 bg-orange-50 p-4">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-orange-700">
              <ShieldAlert size={14} />
              Best Result
            </p>
            <p className="mt-2 text-sm font-medium text-orange-800">
              Use a specific title like "Lift stopped on 3rd floor" instead of a generic complaint title.
            </p>
          </div>
        </div>

        {hasResidentLocation && (
          <div className="grid gap-4 sm:grid-cols-2">
            {residentDetails.wing && (
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-4">
                <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-500">
                  <Building2 size={14} /> Wing / Block
                </div>
                <p className="text-sm font-bold text-[var(--text)]">{residentDetails.wing}</p>
              </div>
            )}
            {residentDetails.flatNumber && (
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-4">
                <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-500">
                  <MapPin size={14} /> Flat Number
                </div>
                <p className="text-sm font-bold text-[var(--text)]">{residentDetails.flatNumber}</p>
              </div>
            )}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-600">Issue Title</label>
            <input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g., Water leakage in bathroom"
              className="w-full rounded-2xl border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-sm text-[var(--text)] outline-none transition focus:border-orange-300 focus:ring-2 focus:ring-orange-500/30"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-600">Description</label>
            <textarea
              required
              rows={5}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Describe the issue in detail..."
              className="w-full resize-none rounded-2xl border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-sm text-[var(--text)] outline-none transition focus:border-orange-300 focus:ring-2 focus:ring-orange-500/30"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-600">Category</label>
            <div className="grid gap-2 sm:grid-cols-2">
              {Object.keys(categoryColors).map((category) => {
                const active = form.category === category;
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setForm({ ...form, category })}
                    className={`rounded-2xl border px-4 py-3 text-left text-sm font-bold transition ${
                      active
                        ? "border-orange-300 bg-orange-50 text-orange-700 shadow-sm"
                        : "border-[var(--border)] bg-[var(--bg)] text-slate-600 hover:border-orange-200 hover:bg-orange-50/50"
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-600">
              <FileUp size={14} className="mr-1 inline" /> Attach Image (Optional)
            </label>
            <div className="space-y-3">
              <label className="block w-full cursor-pointer">
                <div className="rounded-[24px] border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-8 text-center transition hover:border-orange-300 hover:bg-slate-100">
                  <svg className="mx-auto mb-3 h-10 w-10 text-slate-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path d="M12 16.5v-9m0 0l-3 3m3-3l3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33A3 3 0 0116.5 19.5H6.75Z" />
                  </svg>
                  <p className="text-sm font-bold text-slate-700">
                    {form.attachmentPreview ? form.attachment?.name : "Click to upload complaint image"}
                  </p>
                  <p className="mt-1 text-[11px] text-slate-400">JPG, PNG up to 5MB</p>
                </div>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/jpg"
                  className="hidden"
                  onChange={onFileChange}
                />
              </label>

              {form.attachmentPreview && (
                <div className="relative overflow-hidden rounded-[24px] border border-slate-200">
                  <img
                    src={form.attachmentPreview}
                    alt="Preview"
                    className="h-52 w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, attachment: null, attachmentPreview: null })}
                    className="absolute right-3 top-3 rounded-full bg-red-500 p-1.5 text-white transition hover:bg-red-600"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onReset}
              className="flex-1 rounded-2xl border border-[var(--border)] py-3 text-sm font-semibold text-[var(--text-muted)] transition hover:bg-[var(--accent-soft)]"
            >
              Clear
            </button>
            <button
              type="submit"
              disabled={complaintLoading || !form.title || !residentId}
              className="flex-1 rounded-2xl bg-orange-600 py-3 text-sm font-bold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {complaintLoading ? "Submitting..." : "Submit Complaint"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ComplaintFormSection;
