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

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Title *</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Category</label>
            <select name="category" value={form.category} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>General</option>
              <option>Security</option>
              <option>Maintenance</option>
              <option>Community</option>
              <option>Festival</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Date *</label>
            <input
              name="date"
              type="date"
              value={form.date}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Time</label>
            <input
              name="time"
              type="time"
              value={form.time}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Location</label>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Organizer</label>
            <input
              name="organizer"
              value={form.organizer}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            onClick={() => navigate("/admin/event/list")}
            type="button"
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button type="submit" disabled={loading} className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            {loading ? "Saving..." : isEdit ? "Update Event" : "Create Event"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventForm;
