import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Building2,
  Calendar,
  Clock,
  X,
  CheckCircle,
  IndianRupee,
  CreditCard,
} from "lucide-react";
import { fetchFacilities } from "../../store/slices/facilitySlice";
import {
  fetchMyBookings,
  createBooking,
  cancelBooking,
  checkAvailability,
  clearBookedSlots,
  previewBooking,
} from "../../store/slices/facilityBookingSlice";
import FacilityPaymentModal from "../components/FacilityPaymentModal";
import { SkeletonGrid } from "../../components/PageLoader";

function pad(n) {
  return String(n).padStart(2, "0");
}

function toDatetimeLocalValue(d) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function parseHM(str) {
  if (!str || typeof str !== "string") return { h: 6, m: 0 };
  const [h, m] = str.split(":").map((x) => parseInt(x, 10) || 0);
  return { h, m };
}

/** Build 1-hour slot starts on `dateStr` between open/close (facility local wall clock). */
function buildHourSlots(dateStr, openTime, closeTime, bookedRanges) {
  const { h: oh, m: om } = parseHM(openTime);
  const { h: ch, m: cm } = parseHM(closeTime);
  const base = new Date(`${dateStr}T00:00:00`);
  const openMin = oh * 60 + om;
  const closeMin = ch * 60 + cm;
  const slots = [];
  for (let m = openMin; m + 60 <= closeMin; m += 60) {
    const sh = Math.floor(m / 60);
    const sm = m % 60;
    const eh = Math.floor((m + 60) / 60);
    const em = (m + 60) % 60;
    const start = new Date(base);
    start.setHours(sh, sm, 0, 0);
    const end = new Date(base);
    end.setHours(eh, em, 0, 0);
    const blocked = (bookedRanges || []).some((b) => {
      const bs = new Date(b.startDateTime);
      const be = new Date(b.endDateTime);
      return bs < end && be > start;
    });
    slots.push({
      label: `${pad(sh)}:${pad(sm)} – ${pad(eh)}:${pad(em)}`,
      startIso: start.toISOString(),
      endIso: end.toISOString(),
      blocked,
    });
  }
  return slots;
}

const BookFacility = () => {
  const dispatch = useDispatch();
  const { facilities = [], loading: facilityLoading } = useSelector((s) => s.facility || {});
  const {
    myBookings = [],
    loading: bookingLoading,
    bookedSlots = [],
    availabilityLoading,
    availabilityFacilityMeta,
    previewLoading,
    preview,
  } = useSelector((s) => s.booking || {});

  const user = JSON.parse(localStorage.getItem("userData") || "{}");
  const profileId = user?.profileId || user?._id;

  const [selected, setSelected] = useState(null);
  const [activeTab, setActiveTab] = useState("facilities");
  const [dateStr, setDateStr] = useState(() => new Date().toISOString().split("T")[0]);
  const [startDT, setStartDT] = useState("");
  const [endDT, setEndDT] = useState("");
  const [purpose, setPurpose] = useState("");
  const [payModal, setPayModal] = useState({ open: false, bookingId: null, summary: null });

  useEffect(() => {
    dispatch(fetchFacilities());
    dispatch(fetchMyBookings());
  }, [dispatch]);

  useEffect(() => {
    return () => dispatch(clearBookedSlots());
  }, [dispatch]);

  useEffect(() => {
    if (selected?._id && dateStr) {
      dispatch(checkAvailability({ facilityId: selected._id, date: dateStr }));
    }
  }, [dispatch, selected?._id, dateStr]);

  const openMeta = availabilityFacilityMeta || {
    openTime: selected?.openTime || "06:00",
    closeTime: selected?.closeTime || "22:00",
  };

  const hourSlots = useMemo(() => {
    if (!selected || !dateStr) return [];
    const t = selected.bookingType || "hourly";
    if (t === "daily") return [];
    return buildHourSlots(dateStr, openMeta.openTime, openMeta.closeTime, bookedSlots);
  }, [selected, dateStr, openMeta.openTime, openMeta.closeTime, bookedSlots]);

  const runPreview = useCallback(async () => {
    if (!selected || !startDT || !endDT) return;
    const startDateTime = new Date(startDT).toISOString();
    const endDateTime = new Date(endDT).toISOString();
    await dispatch(previewBooking({ facilityId: selected._id, startDateTime, endDateTime }));
  }, [dispatch, selected, startDT, endDT]);

  useEffect(() => {
    if (selected && startDT && endDT && new Date(endDT) > new Date(startDT)) {
      const t = setTimeout(() => runPreview(), 400);
      return () => clearTimeout(t);
    }
  }, [selected, startDT, endDT, runPreview]);

  const handleSlotPick = (slot) => {
    if (slot.blocked) return;
    const s = new Date(slot.startIso);
    const e = new Date(slot.endIso);
    setStartDT(toDatetimeLocalValue(s));
    setEndDT(toDatetimeLocalValue(e));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!profileId) {
      alert("Please log in again.");
      return;
    }
    if (!selected || !startDT || !endDT) return;
    const res = await dispatch(
      createBooking({
        facility: selected._id,
        startDateTime: new Date(startDT).toISOString(),
        endDateTime: new Date(endDT).toISOString(),
        purpose,
      })
    );
    if (res.type.endsWith("fulfilled") && res.payload) {
      dispatch(fetchMyBookings());
      setPayModal({
        open: true,
        bookingId: res.payload._id,
        summary: {
          amount: res.payload.totalAmount,
          label: `${selected.name} booking`,
          lines: [
            `${new Date(res.payload.startDateTime).toLocaleString()} → ${new Date(
              res.payload.endDateTime
            ).toLocaleString()}`,
          ],
        },
      });
      setSelected(null);
      setPurpose("");
      setStartDT("");
      setEndDT("");
      setActiveTab("bookings");
    }
  };

  const facilityIcons = {
    "Swimming Pool": "🏊",
    Gym: "💪",
    Clubhouse: "🏛️",
    "Tennis Court": "🎾",
    Garden: "🌿",
    Parking: "🅿️",
  };

  const statusColors = {
    Pending: "bg-amber-100 text-amber-800",
    Approved: "bg-emerald-100 text-emerald-800",
    Rejected: "bg-red-100 text-red-700",
    Cancelled: "bg-slate-100 text-slate-500",
  };

  const typeLabel = (t) =>
    ({ hourly: "Hourly", daily: "Daily", both: "Daily + hourly mix" }[t] || t);

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] p-4 sm:p-6 transition-colors duration-300">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-2 mb-8">
          <Building2 size={22} className="text-[var(--accent)]" />
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Book facility</h1>
            <p className="text-sm text-slate-500 font-medium">
              Choose slots, pay with Razorpay, wait for admin approval
            </p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl flex p-1 mb-8 w-fit shadow-sm">
          {[
            ["facilities", "Facilities"],
            ["bookings", "My bookings"],
          ].map(([v, l]) => (
            <button
              key={v}
              type="button"
              onClick={() => setActiveTab(v)}
              className={`px-5 py-2 rounded-xl text-sm font-bold transition ${
                activeTab === v
                  ? "bg-[var(--accent)] text-white shadow-sm"
                  : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              {l}
            </button>
          ))}
        </div>

        {activeTab === "facilities" &&
          (facilityLoading ? (
            <SkeletonGrid
              count={6}
              gridClassName="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
              itemClassName="h-48"
            />
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {facilities.map((f) => (
                <div
                  key={f._id}
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition"
                >
                  <div className="bg-gradient-to-br from-slate-100 to-slate-50 p-8 text-center text-4xl">
                    {facilityIcons[f.name] || "🏢"}
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-slate-800 mb-1">{f.name}</h3>
                    <p className="text-xs text-slate-400 mb-2 line-clamp-2">{f.description}</p>
                    <div className="flex flex-wrap gap-1.5 mb-3 text-[10px] font-bold uppercase">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                        {typeLabel(f.bookingType)}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700">
                        ₹{f.pricePerHour || 0}/hr
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-violet-50 text-violet-700">
                        ₹{f.pricePerDay || 0}/day
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                          f.status === "Available"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-red-50 text-red-600"
                        }`}
                      >
                        {f.status}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setSelected(f);
                          setDateStr(new Date().toISOString().split("T")[0]);
                          setStartDT("");
                          setEndDT("");
                        }}
                        disabled={f.status !== "Available"}
                        className={`text-sm font-bold px-4 py-2 rounded-xl transition ${
                          f.status !== "Available"
                            ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                            : "bg-[var(--accent)] text-white hover:opacity-90"
                        }`}
                      >
                        Book
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}

        {activeTab === "bookings" && (
          <div>
            {bookingLoading ? (
              <p className="text-slate-400 text-center py-16">Loading…</p>
            ) : myBookings.length ? (
              <div className="space-y-3">
                {myBookings.map((b) => (
                  <div
                    key={b._id}
                    className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-2xl w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                        {facilityIcons[b.facility?.name] || "🏢"}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{b.facility?.name || "Facility"}</p>
                        <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <Calendar size={12} />
                            {new Date(b.startDateTime).toLocaleString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={12} />→ {new Date(b.endDateTime).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm font-black text-slate-900 mt-2 flex items-center gap-1">
                          <IndianRupee size={14} />
                          {Number(b.totalAmount || 0).toLocaleString("en-IN")}
                          <span className="text-[10px] font-bold uppercase text-slate-400 ml-2">
                            {b.paymentStatus === "paid" ? "Paid" : "Unpaid"}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-lg ${
                          statusColors[b.status] || statusColors.Pending
                        }`}
                      >
                        {b.status}
                      </span>
                      {b.paymentStatus !== "paid" && b.status === "Pending" && (
                        <button
                          type="button"
                          onClick={() =>
                            setPayModal({
                              open: true,
                              bookingId: b._id,
                              summary: {
                                amount: b.totalAmount,
                                label: `${b.facility?.name || "Facility"}`,
                                lines: [
                                  `${new Date(b.startDateTime).toLocaleString()} – ${new Date(
                                    b.endDateTime
                                  ).toLocaleString()}`,
                                ],
                              },
                            })
                          }
                          className="inline-flex items-center gap-1.5 text-xs font-bold bg-emerald-600 text-white px-3 py-2 rounded-xl hover:bg-emerald-700"
                        >
                          <CreditCard size={14} /> Pay now
                        </button>
                      )}
                      {b.status === "Pending" && (
                        <button
                          type="button"
                          onClick={async () => {
                            await dispatch(cancelBooking(b._id));
                            dispatch(fetchMyBookings());
                          }}
                          className="text-xs font-bold text-red-600 border border-red-200 px-3 py-2 rounded-xl hover:bg-red-50"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-2xl border border-slate-100 text-slate-400">
                <Building2 size={40} className="mx-auto mb-3 opacity-30" />
                <p className="font-medium">No bookings yet</p>
                <button
                  type="button"
                  onClick={() => setActiveTab("facilities")}
                  className="mt-3 text-sm text-blue-600 font-bold hover:underline"
                >
                  Browse facilities →
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[130] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 max-h-[92vh] overflow-y-auto border border-slate-100">
            <div className="flex items-start justify-between mb-4 gap-3">
              <div>
                <h2 className="text-lg font-black text-slate-900">Book {selected.name}</h2>
                <p className="text-xs text-slate-500 mt-1">
                  {typeLabel(selected.bookingType)} · {selected.openTime || "06:00"}–
                  {selected.closeTime || "22:00"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelected(null);
                  dispatch(clearBookedSlots());
                }}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              {(selected.bookingType === "hourly" || selected.bookingType === "both") && (
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Date</label>
                  <input
                    type="date"
                    value={dateStr}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setDateStr(e.target.value)}
                    className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-xl text-sm"
                  />
                  <p className="text-[11px] text-slate-400 mt-2">
                    {availabilityLoading ? "Loading availability…" : "Green = free · Red = booked"}
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                    {hourSlots.map((slot, i) => (
                      <button
                        key={i}
                        type="button"
                        disabled={slot.blocked}
                        onClick={() => handleSlotPick(slot)}
                        className={`py-2 px-2 rounded-xl text-[11px] font-bold border ${
                          slot.blocked
                            ? "bg-red-50 text-red-400 border-red-100 cursor-not-allowed line-through"
                            : "bg-slate-50 border-slate-200 hover:border-[var(--accent)] text-slate-700"
                        }`}
                      >
                        {slot.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Start</label>
                  <input
                    type="datetime-local"
                    required
                    value={startDT}
                    onChange={(e) => setStartDT(e.target.value)}
                    className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">End</label>
                  <input
                    type="datetime-local"
                    required
                    value={endDT}
                    onChange={(e) => setEndDT(e.target.value)}
                    className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
              </div>

              {previewLoading && (
                <p className="text-xs text-slate-400">Calculating price…</p>
              )}
              {preview && !previewLoading && (
                <div className="rounded-xl bg-indigo-50 border border-indigo-100 p-3 text-sm">
                  <p className="font-black text-indigo-900 flex items-center gap-1">
                    <IndianRupee size={16} />
                    {preview.totalAmount?.toLocaleString("en-IN")}
                  </p>
                  {preview.pricingBreakdown && (
                    <ul className="text-[11px] text-indigo-800 mt-2 space-y-0.5">
                      <li>Total hours: {preview.pricingBreakdown.totalHours}</li>
                      {preview.pricingBreakdown.fullDays > 0 && (
                        <li>Full days: {preview.pricingBreakdown.fullDays}</li>
                      )}
                      {preview.pricingBreakdown.extraBillableHours > 0 && (
                        <li>Extra billable hours: {preview.pricingBreakdown.extraBillableHours}</li>
                      )}
                    </ul>
                  )}
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Purpose</label>
                <input
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder="Event / usage note"
                  className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-xl text-sm"
                />
              </div>

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setSelected(null);
                    dispatch(clearBookedSlots());
                  }}
                  className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-600"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={!startDT || !endDT || new Date(endDT) <= new Date(startDT)}
                  className="flex-1 py-2.5 bg-[var(--accent)] text-white rounded-xl text-sm font-black disabled:opacity-40 flex items-center justify-center gap-2"
                >
                  <CheckCircle size={16} /> Create &amp; pay
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <FacilityPaymentModal
        isOpen={payModal.open}
        onClose={() => setPayModal({ open: false, bookingId: null, summary: null })}
        facilityBookingId={payModal.bookingId}
        summary={payModal.summary}
        onPaymentSuccess={() => {
          dispatch(fetchMyBookings());
        }}
      />
    </div>
  );
};

export default BookFacility;
