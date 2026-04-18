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

      <div className="space-y-6 px-6 py-6 sm:px-8 sm:py-8 text-[var(--text)]">
        {hasResidentLocation && (
          <div className="grid gap-3 sm:grid-cols-2">
            {residentDetails.wing && (
              <div className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-3.5">
                <div className="mb-1 flex items-center gap-2 text-[9px] font-black uppercase tracking-wide text-slate-400">
                  <Building2 size={12} /> Wing / Block
                </div>
                <p className="text-xs font-black text-[var(--text)]">{residentDetails.wing}</p>
              </div>
            )}
            {residentDetails.flatNumber && (
              <div className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-3.5">
                <div className="mb-1 flex items-center gap-2 text-[9px] font-black uppercase tracking-wide text-slate-400">
                  <MapPin size={12} /> Flat Number
                </div>
                <p className="text-xs font-black text-[var(--text)]">{residentDetails.flatNumber}</p>
              </div>
            )}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-slate-500">Issue Title</label>
            <input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g., Water leakage in bathroom"
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-xs font-bold text-[var(--text)] outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-slate-500">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full appearance-none rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-xs font-bold text-[var(--text)] outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              >
                {Object.keys(categoryColors).map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-slate-500">
                <FileUp size={12} className="mr-1 inline" /> Photo Proof (Optional)
              </label>
              <label className="block w-full cursor-pointer">
                <div className="flex h-11 items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 px-4 text-center transition hover:border-indigo-300 hover:bg-slate-50">
                  <p className="text-[10px] font-black text-slate-500">
                    {form.attachmentPreview ? form.attachment?.name : "Click to upload image"}
                  </p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={onFileChange}
                />
              </label>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-slate-500">Detailed Description</label>
            <textarea
              required
              rows={4}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Describe the issue in detail..."
              className="w-full resize-none rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-xs font-bold text-[var(--text)] outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          {form.attachmentPreview && (
            <div className="relative inline-block overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
              <img
                src={form.attachmentPreview}
                alt="Preview"
                className="h-32 w-48 object-cover"
              />
              <button
                type="button"
                onClick={() => setForm({ ...form, attachment: null, attachmentPreview: null })}
                className="absolute right-2 top-2 rounded-full bg-rose-500 p-1.5 text-white shadow-lg transition hover:bg-rose-600"
              >
                <X size={12} />
              </button>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onReset}
              className="flex-1 rounded-xl border border-[var(--border)] py-3.5 text-[11px] font-black uppercase tracking-widest text-slate-500 transition hover:bg-slate-50"
            >
              Clear
            </button>
            <button
              type="submit"
              disabled={complaintLoading || !form.title || !residentId}
              className="flex-1 rounded-xl bg-indigo-600 py-3.5 text-[11px] font-black uppercase tracking-widest text-white transition hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {complaintLoading ? "Submitting..." : "Send Ticket"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ComplaintFormSection;
