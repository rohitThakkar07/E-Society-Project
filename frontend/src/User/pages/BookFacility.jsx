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
  Sparkles,
  ArrowRight,
  Wallet,
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
      label: `${pad(sh)}:${pad(sm)} - ${pad(eh)}:${pad(em)}`,
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
            `${new Date(res.payload.startDateTime).toLocaleString()} -> ${new Date(
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
    "Swimming Pool": "Pool",
    Gym: "Gym",
    Clubhouse: "Club",
    "Tennis Court": "Court",
    Garden: "Park",
    Parking: "Park",
  };

  const statusColors = {
    Pending: "bg-amber-100 text-amber-800",
    Approved: "bg-emerald-100 text-emerald-800",
    Rejected: "bg-red-100 text-red-700",
    Cancelled: "bg-slate-100 text-slate-500",
  };

  const typeLabel = (t) => ({ hourly: "Hourly", daily: "Daily", both: "Daily + hourly mix" }[t] || t);
  const availableCount = facilities.filter((f) => f.status === "Available").length;
  const unpaidBookings = myBookings.filter((b) => b.paymentStatus !== "paid").length;

  return (
    <div className="min-h-screen bg-[var(--bg)] p-4 text-[var(--text)] transition-colors duration-300 sm:p-6">
      <div className="mx-auto max-w-6xl mt-12">
        <section className="relative overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[linear-gradient(135deg,rgba(99,102,241,0.12),rgba(14,165,233,0.08),rgba(255,255,255,0.02))] p-6 shadow-sm sm:p-8">
          <div className="absolute -right-12 top-0 h-40 w-40 rounded-full bg-indigo-400/10 blur-3xl" />
          <div className="absolute left-1/3 top-1/2 h-44 w-44 -translate-y-1/2 rounded-full bg-sky-400/10 blur-3xl" />
          <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/50 px-3 py-1 text-[11px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] backdrop-blur">
                <Sparkles size={13} className="text-indigo-500" />
                Shared spaces
              </div>
              <h1 className="flex items-center gap-3 text-3xl font-black tracking-tight text-[var(--text)] sm:text-4xl">
                <Building2 className="text-[var(--accent)]" size={30} />
                Book Facility
              </h1>
              <p className="mt-3 max-w-xl text-sm font-medium leading-6 text-[var(--text-muted)] sm:text-base">
                Reserve society spaces, preview charges instantly, and complete your booking payment without leaving the page.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: "Facilities", value: facilities.length, tone: "bg-slate-100 text-slate-600" },
                { label: "Available", value: availableCount, tone: "bg-emerald-50 text-emerald-600" },
                { label: "My Bookings", value: myBookings.length, tone: "bg-sky-50 text-sky-600" },
                { label: "Unpaid", value: unpaidBookings, tone: "bg-amber-50 text-amber-600" },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-sm">
                  <div className={`mb-3 inline-flex rounded-xl px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.2em] ${item.tone}`}>{item.label}</div>
                  <div className="text-2xl font-black text-[var(--text)]">{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="mt-6 inline-flex rounded-2xl border border-[var(--border)] bg-[var(--card)] p-1.5 shadow-sm">
          {[
            ["facilities", `Facilities (${facilities.length})`],
            ["bookings", `My bookings (${myBookings.length})`],
          ].map(([v, l]) => (
            <button
              key={v}
              type="button"
              onClick={() => setActiveTab(v)}
              className={`rounded-xl px-5 py-2.5 text-sm font-black uppercase tracking-[0.18em] transition ${
                activeTab === v ? "bg-[var(--accent)] text-white shadow-sm" : "text-[var(--text-muted)] hover:text-[var(--text)]"
              }`}
            >
              {l}
            </button>
          ))}
        </div>

        {activeTab === "facilities" &&
          (facilityLoading ? (
            <div className="mt-6">
              <SkeletonGrid count={6} gridClassName="grid gap-4 md:grid-cols-2 lg:grid-cols-3" itemClassName="h-48" />
            </div>
          ) : (
            <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {facilities.map((f) => (
                <div
                  key={f._id}
                  className="overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--card)] shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="bg-gradient-to-br from-slate-100 to-slate-50 p-8 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-sm font-black text-slate-600 shadow-sm">
                      {facilityIcons[f.name] || "Space"}
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="mb-1 text-lg font-black text-[var(--text)]">{f.name}</h3>
                    <p className="mb-3 line-clamp-2 text-sm text-[var(--text-muted)]">{f.description}</p>
                    <div className="mb-4 flex flex-wrap gap-1.5 text-[10px] font-black uppercase tracking-[0.16em]">
                      <span className="rounded-full bg-slate-100 px-2 py-1 text-slate-600">{typeLabel(f.bookingType)}</span>
                      <span className="rounded-full bg-indigo-50 px-2 py-1 text-indigo-700">Rs. {f.pricePerHour || 0}/hr</span>
                      <span className="rounded-full bg-violet-50 px-2 py-1 text-violet-700">Rs. {f.pricePerDay || 0}/day</span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase ${
                          f.status === "Available" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"
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
                        className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-black transition ${
                          f.status !== "Available"
                            ? "cursor-not-allowed bg-slate-100 text-slate-400"
                            : "bg-[var(--accent)] text-white hover:opacity-90"
                        }`}
                      >
                        Book <ArrowRight size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}

        {activeTab === "bookings" && (
          <div className="mt-6">
            {bookingLoading ? (
              <p className="py-16 text-center text-slate-400">Loading...</p>
            ) : myBookings.length ? (
              <div className="space-y-3">
                {myBookings.map((b) => (
                  <div
                    key={b._id}
                    className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-xs font-black text-blue-700">
                          {facilityIcons[b.facility?.name] || "Space"}
                        </div>
                        <div>
                          <p className="font-black text-[var(--text)]">{b.facility?.name || "Facility"}</p>
                          <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-[var(--text-muted)]">
                            <span className="flex items-center gap-1"><Calendar size={12} />{new Date(b.startDateTime).toLocaleString()}</span>
                            <span className="flex items-center gap-1"><Clock size={12} />{new Date(b.endDateTime).toLocaleString()}</span>
                          </div>
                          <p className="mt-2 flex items-center gap-1 text-sm font-black text-[var(--text)]">
                            <IndianRupee size={14} />{Number(b.totalAmount || 0).toLocaleString("en-IN")}
                            <span className="ml-2 text-[10px] font-black uppercase tracking-[0.16em] text-[var(--text-muted)]">
                              {b.paymentStatus === "paid" ? "Paid" : "Unpaid"}
                            </span>
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase ${statusColors[b.status] || statusColors.Pending}`}>
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
                                    `${new Date(b.startDateTime).toLocaleString()} - ${new Date(b.endDateTime).toLocaleString()}`,
                                  ],
                                },
                              })
                            }
                            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-black text-white hover:bg-emerald-700"
                          >
                            <Wallet size={14} /> Pay now
                          </button>
                        )}
                        {b.status === "Pending" && (
                          <button
                            type="button"
                            onClick={async () => {
                              await dispatch(cancelBooking(b._id));
                              dispatch(fetchMyBookings());
                            }}
                            className="rounded-xl border border-red-200 px-3 py-2 text-xs font-black text-red-600 hover:bg-red-50"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] py-16 text-center text-[var(--text-muted)] shadow-sm">
                <Building2 size={40} className="mx-auto mb-3 opacity-30" />
                <p className="font-black text-[var(--text)]">No bookings yet</p>
                <button type="button" onClick={() => setActiveTab("facilities")} className="mt-3 text-sm font-black text-[var(--accent)] hover:underline">
                  Browse facilities
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-6 shadow-2xl">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-black text-[var(--text)]">Book {selected.name}</h2>
                <p className="mt-1 text-xs text-[var(--text-muted)]">{typeLabel(selected.bookingType)} � {selected.openTime || "06:00"}-{selected.closeTime || "22:00"}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelected(null);
                  dispatch(clearBookedSlots());
                }}
                className="p-1 text-[var(--text-muted)] hover:text-[var(--text)]"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              {(selected.bookingType === "hourly" || selected.bookingType === "both") && (
                <div>
                  <label className="text-xs font-black uppercase text-[var(--text-muted)]">Date</label>
                  <input
                    type="date"
                    value={dateStr}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setDateStr(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm"
                  />
                  <p className="mt-2 text-[11px] text-[var(--text-muted)]">{availabilityLoading ? "Loading availability..." : "Tap an available slot to autofill your booking time"}</p>
                  <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {hourSlots.map((slot, i) => (
                      <button
                        key={i}
                        type="button"
                        disabled={slot.blocked}
                        onClick={() => handleSlotPick(slot)}
                        className={`rounded-xl border px-2 py-2 text-[11px] font-black transition ${
                          slot.blocked
                            ? "cursor-not-allowed border-red-100 bg-red-50 text-red-400 line-through"
                            : "border-[var(--border)] bg-[var(--bg)] text-[var(--text)] hover:border-[var(--accent)]"
                        }`}
                      >
                        {slot.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-black uppercase text-[var(--text-muted)]">Start</label>
                  <input type="datetime-local" required value={startDT} onChange={(e) => setStartDT(e.target.value)} className="mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="text-xs font-black uppercase text-[var(--text-muted)]">End</label>
                  <input type="datetime-local" required value={endDT} onChange={(e) => setEndDT(e.target.value)} className="mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm" />
                </div>
              </div>

              {previewLoading && <p className="text-xs text-[var(--text-muted)]">Calculating price...</p>}
              {preview && !previewLoading && (
                <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-3 text-sm">
                  <p className="flex items-center gap-1 font-black text-indigo-900"><IndianRupee size={16} />{preview.totalAmount?.toLocaleString("en-IN")}</p>
                  {preview.pricingBreakdown && (
                    <ul className="mt-2 space-y-0.5 text-[11px] text-indigo-800">
                      <li>Total hours: {preview.pricingBreakdown.totalHours}</li>
                      {preview.pricingBreakdown.fullDays > 0 && <li>Full days: {preview.pricingBreakdown.fullDays}</li>}
                      {preview.pricingBreakdown.extraBillableHours > 0 && <li>Extra billable hours: {preview.pricingBreakdown.extraBillableHours}</li>}
                    </ul>
                  )}
                </div>
              )}

              <div>
                <label className="text-xs font-black uppercase text-[var(--text-muted)]">Purpose</label>
                <input value={purpose} onChange={(e) => setPurpose(e.target.value)} placeholder="Event / usage note" className="mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm" />
              </div>

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setSelected(null);
                    dispatch(clearBookedSlots());
                  }}
                  className="flex-1 rounded-xl border border-[var(--border)] py-2.5 text-sm font-black text-[var(--text-muted)]"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={!startDT || !endDT || new Date(endDT) <= new Date(startDT)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[var(--accent)] py-2.5 text-sm font-black text-white disabled:opacity-40"
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
