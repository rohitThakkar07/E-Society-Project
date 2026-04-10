import React, { useEffect, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { fetchAlerts, createAlert, resolveAlert, deleteAlert } from "../../../store/slices/alertSlice";

const SEVERITY_STYLE  = { Critical: "bg-red-100 text-red-700", High: "bg-orange-100 text-orange-700", Medium: "bg-yellow-100 text-yellow-700", Low: "bg-green-100 text-green-700" };
const TYPE_STYLE      = { Fire: "🔥", Flood: "🌊", "Power Outage": "⚡", "Security Breach": "🚨", Medical: "🏥", Other: "⚠️" };

const AlertDashboard = () => {
  const dispatch = useDispatch();
  const { list: alerts, loading } = useSelector((s) => s.alert) ?? {};
  const [statusFilter, setStatusFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => { dispatch(fetchAlerts()); }, [dispatch]);

  const filtered = useMemo(() =>
    (alerts || []).filter((a) => statusFilter === "All" || a.status === statusFilter),
    [alerts, statusFilter]);

  const activeCount   = (alerts || []).filter(a => a.status === "Active").length;
  const resolvedCount = (alerts || []).filter(a => a.status === "Resolved").length;

  const onSubmit = async (data) => {
    const res = await dispatch(createAlert(data));
    if (res.type.endsWith("fulfilled")) { reset(); setShowForm(false); }
  };

  const inp = (err) => `w-full px-4 py-2.5 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-red-400 ${err ? "border-red-400 bg-red-50" : "border-gray-200"}`;
  const lbl = "block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5";
  const Err = ({ e }) => e ? <p className="mt-1 text-xs text-red-500">{e.message}</p> : null;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Emergency Alerts</h1>
          <p className="text-sm text-gray-500">Send and manage emergency notifications</p>
        </div>
        <button onClick={() => setShowForm(true)}
          className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 text-sm font-semibold self-start flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          Send Alert
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-red-50 border border-red-100 rounded-xl p-4">
          <p className="text-xs text-red-500 font-semibold mb-1">Active Alerts</p>
          <p className="text-3xl font-bold text-red-600">{activeCount}</p>
        </div>
        <div className="bg-green-50 border border-green-100 rounded-xl p-4">
          <p className="text-xs text-green-600 font-semibold mb-1">Resolved</p>
          <p className="text-3xl font-bold text-green-600">{resolvedCount}</p>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex gap-3">
        {["All","Active","Resolved"].map(s => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${statusFilter === s ? "bg-red-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
            {s}
          </button>
        ))}
      </div>

      {/* Alerts list */}
      <div className="space-y-4">
        {loading ? (
          [...Array(3)].map((_, i) => <div key={i} className="bg-white rounded-xl p-5 animate-pulse h-24"/>)
        ) : filtered.length > 0 ? (
          filtered.map((alert) => (
            <div key={alert._id} className={`bg-white rounded-xl shadow-sm border p-5 ${alert.status === "Active" ? "border-red-200" : "border-gray-100"}`}>
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-lg">{TYPE_STYLE[alert.type] || "⚠️"}</span>
                    <span className="font-semibold text-gray-900">{alert.title}</span>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${SEVERITY_STYLE[alert.severity]}`}>{alert.severity}</span>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${alert.status === "Active" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>{alert.status}</span>
                  </div>
                  <p className="text-sm text-gray-600">{alert.message}</p>
                  {alert.affectedArea && <p className="text-xs text-gray-400 mt-1">📍 {alert.affectedArea}</p>}
                  <p className="text-xs text-gray-400 mt-1">{new Date(alert.createdAt).toLocaleString("en-IN")}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  {alert.status === "Active" && (
                    <button onClick={() => dispatch(resolveAlert(alert._id))}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold">Resolve</button>
                  )}
                  <button onClick={() => { if (window.confirm("Delete this alert?")) dispatch(deleteAlert(alert._id)); }}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1.5 rounded-lg text-xs font-semibold">Delete</button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-xl p-12 text-center text-gray-400">
            <p className="text-sm">No alerts found</p>
          </div>
        )}
      </div>

      {/* Send Alert Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900">Send Emergency Alert</h3>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className={lbl}>Alert Title *</label>
                <input {...register("title", { required: "Title is required" })} placeholder="e.g. Fire in Block B" className={inp(errors.title)} />
                <Err e={errors.title} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={lbl}>Type *</label>
                  <select {...register("type", { required: "Type is required" })} className={inp(errors.type)}>
                    <option value="">Select</option>
                    {["Fire","Flood","Power Outage","Security Breach","Medical","Other"].map(t => <option key={t}>{t}</option>)}
                  </select>
                  <Err e={errors.type} />
                </div>
                <div>
                  <label className={lbl}>Severity *</label>
                  <select {...register("severity")} className={inp(false)}>
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>
              <div>
                <label className={lbl}>Message *</label>
                <textarea rows={3} {...register("message", { required: "Message is required" })}
                  placeholder="Describe the emergency..." className={`${inp(errors.message)} resize-none`} />
                <Err e={errors.message} />
              </div>
              <div>
                <label className={lbl}>Affected Area</label>
                <input {...register("affectedArea")} placeholder="e.g. Block B, 3rd Floor" className={inp(false)} />
              </div>
              <div className="flex gap-3 mt-2">
                <button type="button" onClick={() => { setShowForm(false); reset(); }}
                  className="flex-1 px-4 py-2.5 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg">Cancel</button>
                <button type="submit" disabled={loading}
                  className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 disabled:opacity-60 rounded-lg">
                  {loading ? "Sending…" : "Send Alert"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlertDashboard;