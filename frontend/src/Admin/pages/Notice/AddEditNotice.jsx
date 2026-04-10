import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createNotice, updateNotice, fetchNoticeById } from "../../../store/slices/noticeSlice";

const AddEditNotice = () => {
  const navigate  = useNavigate();
  const dispatch  = useDispatch();
  const { id }    = useParams();
  const isEdit    = Boolean(id);
  const { singleNotice, loading } = useSelector((s) => s.notice) ?? {};

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => { if (isEdit && id) dispatch(fetchNoticeById(id)); }, [id, isEdit, dispatch]);

  useEffect(() => {
    if (singleNotice && isEdit) {
      reset({
        title:     singleNotice.title,
        content:   singleNotice.content,
        category:  singleNotice.category,
        priority:  singleNotice.priority,
        expiresAt: singleNotice.expiresAt?.split("T")[0] || "",
      });
    }
  }, [singleNotice, isEdit, reset]);

  const onSubmit = async (data) => {
    const payload = { ...data, expiresAt: data.expiresAt || undefined };
    const res = isEdit
      ? await dispatch(updateNotice({ id, data: payload }))
      : await dispatch(createNotice(payload));
    if (res.type.endsWith("fulfilled")) navigate("/admin/notice/list");
  };

  const inp = (err) => `w-full px-4 py-2.5 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-blue-500 ${err ? "border-red-400 bg-red-50" : "border-gray-200"}`;
  const lbl = "block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5";
  const Err = ({ e }) => e ? <p className="mt-1 text-xs text-red-500">{e.message}</p> : null;

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex items-start justify-center">
      <div className="w-full max-w-2xl">
        <div className="mb-8">
          <button type="button" onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 mb-4">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>Back
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{isEdit ? "Edit Notice" : "Post Notice"}</h1>
              <p className="text-sm text-gray-400">{isEdit ? "Update notice details" : "Create a new announcement"}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-blue-600 to-blue-400" />
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8 space-y-5">

            <div>
              <label className={lbl}>Title *</label>
              <input {...register("title", { required: "Title is required" })} placeholder="Notice title" className={inp(errors.title)} />
              <Err e={errors.title} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={lbl}>Category *</label>
                <select {...register("category", { required: "Required" })} className={inp(errors.category)}>
                  <option value="">Select</option>
                  {["General","Event","Meeting","Maintenance","Emergency","Other"].map(c => <option key={c}>{c}</option>)}
                </select>
                <Err e={errors.category} />
              </div>
              <div>
                <label className={lbl}>Priority *</label>
                <select {...register("priority", { required: "Required" })} className={inp(errors.priority)}>
                  <option value="">Select</option>
                  {["Low","Medium","High"].map(p => <option key={p}>{p}</option>)}
                </select>
                <Err e={errors.priority} />
              </div>
            </div>

            <div>
              <label className={lbl}>Content *</label>
              <textarea rows={5} {...register("content", { required: "Content is required" })}
                placeholder="Write your notice here..." className={`${inp(errors.content)} resize-none`} />
              <Err e={errors.content} />
            </div>

            <div>
              <label className={lbl}>Expires On (Optional)</label>
              <input type="date" {...register("expiresAt")}
                min={new Date().toISOString().split("T")[0]} className={inp(false)} />
            </div>

            <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
              <button type="button" onClick={() => navigate(-1)}
                className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg">Cancel</button>
              <button type="submit" disabled={loading}
                className="px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60 rounded-lg flex items-center gap-2">
                {loading ? <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>Saving...</> : isEdit ? "Update Notice" : "Post Notice"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddEditNotice;