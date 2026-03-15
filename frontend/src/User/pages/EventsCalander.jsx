import React, { useState } from "react";

const EventsCalendar = () => {
  const [events] = useState([
    {
      id: 1,
      title: "Annual General Meeting (AGM)",
      category: "Meeting",
      date: "2026-03-15",
      time: "10:00 AM - 1:00 PM",
      location: "Community Hall",
      description:
        "Discussing annual budget, new committee elections, and resident grievances.",
      image:
        "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    },
    {
      id: 2,
      title: "Holi Celebration: Festival of Colors",
      category: "Cultural",
      date: "2026-03-25",
      time: "9:00 AM - 2:00 PM",
      location: "Central Park / Ground",
      description:
        "Join us for music, dance, and organic colors! Lunch will be served.",
      image:
        "https://images.unsplash.com/photo-1543323204-c5a4789b91e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    },
    {
      id: 3,
      title: "Sunday Yoga Workshop",
      category: "Health",
      date: "2026-02-18",
      time: "6:00 AM - 7:30 AM",
      location: "Clubhouse Terrace",
      description:
        "A beginner-friendly yoga session with Instructor Priya. Bring your own mats.",
      image:
        "https://images.unsplash.com/photo-1544367563-12123d896889?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    },
    {
      id: 4,
      title: "Inter-Tower Cricket Tournament",
      category: "Sports",
      date: "2026-02-22",
      time: "8:00 AM Onwards",
      location: "Sports Arena",
      description:
        "Teams from Block A vs Block B. Come cheer for your neighbors!",
      image:
        "https://images.unsplash.com/photo-1531415074968-036ba1b575da?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    },
  ]);

  const [filter, setFilter] = useState("All");

  const getMonth = (dateString) =>
    new Date(dateString)
      .toLocaleString("default", { month: "short" })
      .toUpperCase();

  const getDay = (dateString) => new Date(dateString).getDate();

  const getBadgeColor = (category) => {
    switch (category) {
      case "Meeting":
        return "bg-blue-600 text-white";
      case "Cultural":
        return "bg-red-600 text-white";
      case "Sports":
        return "bg-green-600 text-white";
      case "Health":
        return "bg-cyan-400 text-black";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const filteredEvents =
    filter === "All"
      ? events
      : events.filter((ev) => ev.category === filter);

  return (
    <div className="max-w-6xl mx-auto my-12 px-4">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 flex items-center">
            <i className="far fa-calendar-check mr-2 text-blue-600"></i>
            Events Calendar
          </h2>
          <p className="text-gray-500">
            Upcoming community gatherings and meetings.
          </p>
        </div>

        {/* FILTER BUTTONS */}
        <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
          {["All", "Meeting", "Cultural", "Sports", "Health"].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded border text-sm font-medium ${
                filter === cat
                  ? "bg-blue-600 text-white border-blue-600"
                  : "border-blue-600 text-blue-600 hover:bg-blue-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* EVENTS GRID */}
      <div className="grid lg:grid-cols-2 gap-6">
        {filteredEvents.map((event) => (
          <div
            key={event.id}
            className="bg-white shadow-sm rounded overflow-hidden h-full"
          >
            <div className="md:flex h-full">
              {/* IMAGE SIDE */}
              <div className="md:w-1/3 relative">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-[220px] md:h-full object-cover"
                />

                {/* DATE BADGE */}
                <div className="absolute top-2 left-2 bg-white p-2 rounded shadow text-center">
                  <h5 className="font-bold text-red-600 text-lg leading-none">
                    {getDay(event.date)}
                  </h5>
                  <small className="font-bold text-gray-500">
                    {getMonth(event.date)}
                  </small>
                </div>
              </div>

              {/* CONTENT SIDE */}
              <div className="md:w-2/3 p-5 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-semibold ${getBadgeColor(
                      event.category
                    )}`}
                  >
                    {event.category}
                  </span>
                  <small className="text-gray-500 flex items-center">
                    <i className="far fa-clock mr-1"></i> {event.time}
                  </small>
                </div>

                <h5 className="font-bold text-lg mb-2">{event.title}</h5>

                <p className="text-gray-600 text-sm mb-4 flex-grow">
                  {event.description}
                </p>

                <div className="flex justify-between items-center border-t pt-3 mt-auto">
                  <small className="text-gray-500 flex items-center">
                    <i className="fas fa-map-marker-alt mr-1 text-red-600"></i>
                    {event.location}
                  </small>

                  <button className="px-4 py-1 border border-gray-800 rounded text-sm hover:bg-gray-100">
                    RSVP / Join
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredEvents.length === 0 && (
          <div className="col-span-2 text-center py-12">
            <h5 className="text-gray-500">
              No events found in this category.
            </h5>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsCalendar;