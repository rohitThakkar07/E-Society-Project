import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createEvent, updateEvent, fetchEventById } from "../../../store/slices/eventSlice";

const EventForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { singleEvent, loading } = useSelector((state) => state.event);

  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    organizer: "",
    category: "General",
  });

  useEffect(() => {
    if (isEdit) {
      dispatch(fetchEventById(id));
    }
  }, [dispatch, id, isEdit]);

  useEffect(() => {
    if (singleEvent && isEdit) {
      setForm({
        title: singleEvent.title || "",
        description: singleEvent.description || "",
        date: singleEvent.date ? singleEvent.date.split("T")[0] : "",
        time: singleEvent.time || "",
        location: singleEvent.location || "",
        organizer: singleEvent.organizer || "",
        category: singleEvent.category || "General",
      });
    }
  }, [singleEvent, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.date) {
      alert("Title and date are required");
      return;
    }

    if (isEdit) {
      const result = await dispatch(updateEvent({ id, formData: form }));
      if (result.type.endsWith("fulfilled")) navigate("/admin/event/list");
    } else {
      const result = await dispatch(createEvent(form));
      if (result.type.endsWith("fulfilled")) navigate("/admin/event/list");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{isEdit ? "Edit" : "Add"} Event</h1>
          <p className="text-sm text-gray-500">{isEdit ? "Update" : "Create"} community event details.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-2xl border border-gray-100 shadow-sm max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
          <div className="admin-form-group">
            <label className="admin-label">Event Title *</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className="admin-input"
              placeholder="e.g. Annual General Meeting"
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-label">Category</label>
            <select name="category" value={form.category} onChange={handleChange} className="admin-input">
              <option>General</option>
              <option>Security</option>
              <option>Maintenance</option>
              <option>Community</option>
              <option>Festival</option>
            </select>
          </div>

          <div className="admin-form-group">
            <label className="admin-label">Date *</label>
            <input
              name="date"
              type="date"
              value={form.date}
              onChange={handleChange}
              required
              className="admin-input"
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-label">Time</label>
            <input
              name="time"
              type="time"
              value={form.time}
              onChange={handleChange}
              className="admin-input"
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-label">Location</label>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              className="admin-input"
              placeholder="e.g. Community Hall"
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-label">Organizer</label>
            <input
              name="organizer"
              value={form.organizer}
              onChange={handleChange}
              className="admin-input"
              placeholder="e.g. Cultural Committee"
            />
          </div>

          <div className="admin-form-group md:col-span-2">
            <label className="admin-label">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              className="admin-input resize-none"
              placeholder="Details about the event..."
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-50">
          <button
            onClick={() => navigate("/admin/event/list")}
            type="button"
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-bold text-sm hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            disabled={loading} 
            className="admin-btn-primary"
          >
            {loading ? "Saving..." : isEdit ? "Update Event" : "Create Event"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventForm;
