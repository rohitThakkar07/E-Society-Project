import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Building2, Calendar, Clock, Plus, X, CheckCircle, Users, Star } from "lucide-react";
import { fetchFacilities } from "../../store/slices/facilitySlice";
// ✅ UPDATED IMPORTS to match your new slice names
import { 
  fetchBookings, 
  createBooking, 
  cancelBooking 
} from "../../store/slices/facilityBookingSlice";

const BookFacility = () => {
  const dispatch = useDispatch();
  
  // ✅ UPDATE SELECTORS: Ensure these keys match your store.js (usually 'facility' and 'facilityBooking')
  const { facilities, loading: facilityLoading } = useSelector((s) => s.facility);
  const { bookings, loading: bookingLoading } = useSelector((s) => s.facilityBooking);
  
  const user = JSON.parse(localStorage.getItem("userData") || "{}");
  const profileId = user?.profileId;

  const [selected, setSelected] = useState(null);
  const [bookingForm, setBookingForm] = useState({ date: "", timeSlot: "", purpose: "" });
  const [activeTab, setActiveTab] = useState("facilities");

  useEffect(() => {
    dispatch(fetchFacilities());
    // ✅ Updated to new function name
    dispatch(fetchBookings());
  }, [dispatch]);

  // Logic to filter user's specific bookings
  const myBookings = (bookings || []).filter(b => b.residentId === profileId || b.resident?._id === profileId);

  const handleBook = async (e) => {
    e.preventDefault();
    // ✅ Updated to new function name
    await dispatch(createBooking({ facilityId: selected._id, ...bookingForm }));
    setSelected(null);
    setBookingForm({ date: "", timeSlot: "", purpose: "" });
    setActiveTab("bookings");
  };

  const facilityIcons = { "Swimming Pool": "🏊", "Gym": "💪", "Clubhouse": "🏛️", "Tennis Court": "🎾", "Garden": "🌿", "Parking": "🅿️" };

  const statusColors = {
    Pending:   "bg-amber-100 text-amber-700",
    Confirmed: "bg-emerald-100 text-emerald-700",
    Cancelled: "bg-red-100 text-red-600",
    Completed: "bg-slate-100 text-slate-500",
  };

  const timeSlots = ["06:00 - 08:00", "08:00 - 10:00", "10:00 - 12:00", "12:00 - 14:00",
    "14:00 - 16:00", "16:00 - 18:00", "18:00 - 20:00", "20:00 - 22:00"];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }} className="min-h-screen bg-slate-50 p-6">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');`}</style>

      <div className="max-w-5xl mx-auto">
        {/* HEADER */}
        <div className="flex items-center gap-2 mb-8">
          <Building2 size={20} className="text-blue-500" />
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Book Facility</h1>
            <p className="text-sm text-slate-400">Reserve society amenities</p>
          </div>
        </div>

        {/* TABS */}
        <div className="bg-white border border-slate-200 rounded-2xl flex p-1 mb-8 w-fit">
          {[["facilities", "Browse Facilities"], ["bookings", "My Bookings"]].map(([v, l]) => (
            <button key={v} onClick={() => setActiveTab(v)}
              className={`px-5 py-2 rounded-xl text-sm font-semibold transition ${activeTab === v ? "bg-slate-900 text-white" : "text-slate-500 hover:bg-slate-50"}`}>
              {l}
            </button>
          ))}
        </div>

        {/* FACILITIES GRID */}
        {activeTab === "facilities" && (
          facilityLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1,2,3,4,5,6].map(i => <div key={i} className="h-48 bg-white rounded-2xl animate-pulse border border-slate-100" />)}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(facilities || []).map(f => (
                <div key={f._id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition group">
                  <div className="bg-gradient-to-br from-slate-100 to-slate-50 p-8 text-center text-4xl">
                    {facilityIcons[f.name] || "🏢"}
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-slate-800 mb-1">{f.name}</h3>
                    <p className="text-sm text-slate-400 mb-3 line-clamp-2">{f.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs text-slate-400">
                        {f.capacity && <span className="flex items-center gap-1"><Users size={11} />{f.capacity} max</span>}
                        {f.rating && <span className="flex items-center gap-1"><Star size={11} className="text-amber-400 fill-amber-400" />{f.rating}</span>}
                      </div>
                      <button onClick={() => setSelected(f)}
                        className={`text-sm font-semibold px-4 py-2 rounded-xl transition ${
                          f.available === false
                            ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                            : "bg-slate-900 text-white hover:bg-slate-700"
                        }`}
                        disabled={f.available === false}>
                        {f.available === false ? "Unavailable" : "Book"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {/* MY BOOKINGS */}
        {activeTab === "bookings" && (
          <div>
            {bookingLoading ? (
              <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-20 bg-white rounded-2xl animate-pulse border border-slate-100" />)}</div>
            ) : myBookings.length ? (
              <div className="space-y-3">
                {myBookings.map(b => (
                  <div key={b._id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="text-2xl w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                        {facilityIcons[b.facility?.name] || "🏢"}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">{b.facility?.name || "Facility"}</p>
                        <div className="flex items-center gap-2 mt-1 text-xs text-slate-400 flex-wrap">
                          <span className="flex items-center gap-1"><Calendar size={11} />{new Date(b.date).toLocaleDateString("en-IN")}</span>
                          {b.timeSlot && <span className="flex items-center gap-1"><Clock size={11} />{b.timeSlot}</span>}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${statusColors[b.status] || statusColors.Pending}`}>{b.status}</span>
                      {b.status === "Pending" || b.status === "Confirmed" ? (
                        <button onClick={() => dispatch(cancelBooking(b._id))}
                          className="text-xs text-red-500 hover:text-red-700 font-medium border border-red-100 hover:border-red-300 px-3 py-1.5 rounded-lg transition">
                          Cancel
                        </button>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-2xl border border-slate-100 text-slate-400">
                <Building2 size={40} className="mx-auto mb-3 opacity-30" />
                <p className="font-medium">No bookings yet</p>
                <button onClick={() => setActiveTab("facilities")} className="mt-3 text-sm text-blue-500 font-medium hover:underline">Browse facilities →</button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* BOOKING MODAL */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{facilityIcons[selected.name] || "🏢"}</span>
                <div>
                  <h2 className="text-lg font-bold text-slate-800">Book {selected.name}</h2>
                </div>
              </div>
              <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
            </div>
            <form onSubmit={handleBook} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Date</label>
                <input required type="date" min={new Date().toISOString().split("T")[0]} value={bookingForm.date}
                  onChange={e => setBookingForm({ ...bookingForm, date: e.target.value })}
                  className="w-full mt-1 px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-2">Time Slot</label>
                <div className="grid grid-cols-2 gap-2">
                  {timeSlots.map(t => (
                    <button key={t} type="button" onClick={() => setBookingForm({ ...bookingForm, timeSlot: t })}
                      className={`py-2 px-3 rounded-xl text-xs font-medium border transition ${bookingForm.timeSlot === t ? "bg-slate-900 text-white border-slate-900" : "border-slate-200 text-slate-500 hover:bg-slate-50"}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Purpose</label>
                <input value={bookingForm.purpose} onChange={e => setBookingForm({ ...bookingForm, purpose: e.target.value })}
                  placeholder="Birthday party, workout session..."
                  className="w-full mt-1 px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setSelected(null)}
                  className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-500 hover:bg-slate-50 transition">Cancel</button>
                <button type="submit" disabled={!bookingForm.date || !bookingForm.timeSlot}
                  className="flex-1 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-700 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                  <CheckCircle size={15} /> Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookFacility;