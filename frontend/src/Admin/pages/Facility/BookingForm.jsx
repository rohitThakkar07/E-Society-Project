import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  createBooking,
  updateBooking,
  fetchBookingById,
  checkAvailability,
  clearBookedSlots,
  previewBooking,
} from "../../../store/slices/facilityBookingSlice";
import { fetchFacilities } from "../../../store/slices/facilitySlice";

function pad(n) {
  return String(n).padStart(2, "0");
}
function toLocalInput(d) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(
    d.getMinutes()
  )}`;
}

const BookingForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const { singleBooking, loading, bookedSlots, availabilityLoading, preview, previewLoading } =
    useSelector((state) => state.booking);
  const { facilities } = useSelector((state) => state.facility);

  const [residents, setResidents] = useState([]);
  const [residentsLoading, setResidentsLoading] = useState(false);
  const [watchDate, setWatchDate] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  const watchFacility = watch("facility");

  useEffect(() => {
    dispatch(fetchFacilities());
    loadResidents();
    return () => dispatch(clearBookedSlots());
  }, [dispatch]);

  useEffect(() => {
    if (isEditMode && id) dispatch(fetchBookingById(id));
  }, [id, isEditMode, dispatch]);

  useEffect(() => {
    if (singleBooking && isEditMode) {
      const s = singleBooking.startDateTime ? new Date(singleBooking.startDateTime) : null;
      const e = singleBooking.endDateTime ? new Date(singleBooking.endDateTime) : null;
      reset({
        facility: singleBooking.facility?._id || singleBooking.facility || "",
        resident: singleBooking.resident?._id || singleBooking.resident || "",
        startDateTime: s ? toLocalInput(s) : "",
        endDateTime: e ? toLocalInput(e) : "",
        purpose: singleBooking.purpose || "",
      });
      if (s) setWatchDate(s.toISOString().split("T")[0]);
    }
  }, [singleBooking, isEditMode, reset]);

  useEffect(() => {
    if (watchFacility && watchDate) {
      dispatch(checkAvailability({ facilityId: watchFacility, date: watchDate }));
    }
  }, [watchFacility, watchDate, dispatch]);

  const startVal = watch("startDateTime");
  const endVal = watch("endDateTime");
  useEffect(() => {
    if (startVal) setWatchDate(startVal.split("T")[0]);
  }, [startVal]);

  useEffect(() => {
    if (watchFacility && startVal && endVal && new Date(endVal) > new Date(startVal)) {
      const t = setTimeout(() => {
        dispatch(
          previewBooking({
            facilityId: watchFacility,
            startDateTime: new Date(startVal).toISOString(),
            endDateTime: new Date(endVal).toISOString(),
          })
        );
      }, 400);
      return () => clearTimeout(t);
    }
  }, [dispatch, watchFacility, startVal, endVal]);

  const loadResidents = async () => {
    try {
      setResidentsLoading(true);
      const { default: API } = await import("../../../service/api");
      const res = await API.get("/resident/list");
      setResidents(res.data.data || []);
    } catch {
      setResidents([]);
    } finally {
      setResidentsLoading(false);
    }
  };

  const onSubmit = async (data) => {
    const payload = {
      facility: data.facility,
      resident: data.resident,
      startDateTime: new Date(data.startDateTime).toISOString(),
      endDateTime: new Date(data.endDateTime).toISOString(),
      purpose: data.purpose,
    };

    if (isEditMode) {
      const res = await dispatch(
        updateBooking({
          id,
          data: {
            startDateTime: payload.startDateTime,
            endDateTime: payload.endDateTime,
            purpose: payload.purpose,
          },
        })
      );
      if (res.type.endsWith("fulfilled")) navigate("/admin/facility-booking/list");
    } else {
      const res = await dispatch(createBooking(payload));
      if (res.type.endsWith("fulfilled")) {
        reset();
        navigate("/admin/facility-booking/list");
      }
    }
  };

  const inputClass = (hasError) =>
    `w-full px-4 py-2.5 rounded-lg border text-sm text-gray-800 bg-white outline-none focus:ring-2 focus:ring-blue-500 ${
      hasError ? "border-red-400 bg-red-50" : "border-gray-200"
    }`;
  const labelClass = "block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5";

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex items-start justify-center">
      <div className="w-full max-w-4xl">
        <div className="mb-8">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="text-sm text-gray-400 hover:text-gray-600 mb-4"
          >
            ← Back
          </button>
          <h1 className="text-xl font-bold text-gray-900">
            {isEditMode ? "Edit booking" : "New facility booking"}
          </h1>
          <p className="text-sm text-gray-400">Uses start/end datetime, pricing from facility rules</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className={labelClass}>Resident *</label>
              <select
                {...register("resident", { required: "Select resident" })}
                className={inputClass(errors.resident)}
                disabled={residentsLoading || isEditMode}
              >
                <option value="">{residentsLoading ? "Loading…" : "Select resident"}</option>
                {residents.map((r) => (
                  <option key={r._id} value={r._id}>
                    {r.firstName} {r.lastName} — {r.flatNumber || "—"}
                  </option>
                ))}
              </select>
              {errors.resident && (
                <p className="text-xs text-red-500 mt-1">{errors.resident.message}</p>
              )}
            </div>

            <div>
              <label className={labelClass}>Facility *</label>
              <select
                {...register("facility", { required: "Select facility" })}
                className={inputClass(errors.facility)}
                disabled={isEditMode}
              >
                <option value="">Select facility</option>
                {facilities
                  .filter((f) => f.status === "Available")
                  .map((f) => (
                    <option key={f._id} value={f._id}>
                      {f.name} ({f.bookingType || "hourly"})
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>Reference date (availability)</label>
              <input
                type="date"
                value={watchDate}
                onChange={(e) => setWatchDate(e.target.value)}
                className={inputClass(false)}
                min={new Date().toISOString().split("T")[0]}
              />
              {watchFacility && watchDate && (
                <div className="mt-2 text-xs">
                  {availabilityLoading ? (
                    <span className="text-gray-400">Checking…</span>
                  ) : bookedSlots.length === 0 ? (
                    <span className="text-green-600">No conflicts on this day.</span>
                  ) : (
                    <div className="flex flex-wrap gap-1 text-red-600">
                      Booked:{" "}
                      {bookedSlots.map((s, i) => (
                        <span key={i} className="bg-red-50 px-2 py-0.5 rounded">
                          {new Date(s.startDateTime).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}{" "}
                          –{" "}
                          {new Date(s.endDateTime).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Start *</label>
                <input
                  type="datetime-local"
                  {...register("startDateTime", { required: "Required" })}
                  className={inputClass(errors.startDateTime)}
                />
              </div>
              <div>
                <label className={labelClass}>End *</label>
                <input
                  type="datetime-local"
                  {...register("endDateTime", { required: "Required" })}
                  className={inputClass(errors.endDateTime)}
                />
              </div>
            </div>

            {previewLoading && <p className="text-xs text-gray-400">Pricing…</p>}
            {preview && !previewLoading && (
              <div className="rounded-lg bg-blue-50 border border-blue-100 p-3 text-sm text-blue-900">
                <strong>₹{preview.totalAmount?.toLocaleString("en-IN")}</strong>
                <span className="text-xs block mt-1 opacity-80">
                  {preview.pricingBreakdown?.fullDays > 0 &&
                    `${preview.pricingBreakdown.fullDays} day(s) · `}
                  {preview.pricingBreakdown?.extraBillableHours > 0 &&
                    `${preview.pricingBreakdown.extraBillableHours} hr · `}
                  {preview.pricingBreakdown?.totalHours} total hours
                </span>
              </div>
            )}

            <div>
              <label className={labelClass}>Purpose</label>
              <textarea {...register("purpose")} rows={3} className={inputClass(false)} />
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <button type="button" onClick={() => navigate(-1)} className="admin-btn-secondary">
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="admin-btn-primary disabled:opacity-50"
              >
                {loading ? "Saving…" : isEditMode ? "Update" : "Create"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;
