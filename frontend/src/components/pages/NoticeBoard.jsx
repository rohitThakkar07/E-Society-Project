import React, { useState } from "react";

const NoticeBoard = () => {
  const [notices] = useState([
    {
      id: 1,
      title: "🚨 Urgent: Water Supply Maintenance",
      date: "Feb 10, 2026",
      type: "Urgent",
      postedBy: "Secretary",
      content:
        "Please be informed that the water supply will be interrupted tomorrow from 10:00 AM to 2:00 PM for water tank cleaning. Please store sufficient water.",
      hasAttachment: false,
    },
    {
      id: 2,
      title: "🎉 Annual Holi Celebration",
      date: "Feb 08, 2026",
      type: "Event",
      postedBy: "Cultural Committee",
      content:
        "Get ready for colors! The society is organizing a Holi celebration on the ground floor. Snacks and music will be provided. Contribution: $10 per family.",
      hasAttachment: true,
    },
    {
      id: 3,
      title: "📢 Monthly Maintenance Dues",
      date: "Feb 01, 2026",
      type: "General",
      postedBy: "Treasurer",
      content:
        "This is a gentle reminder to clear your maintenance dues for the month of February by the 15th to avoid late fees.",
      hasAttachment: true,
    },
    {
      id: 4,
      title: "Lift #2 Under Repair",
      date: "Jan 28, 2026",
      type: "Urgent",
      postedBy: "Facility Manager",
      content:
        "Lift #2 (B-Block) is currently down for scheduled maintenance. Technicians are working on it. Expected resolution: 24 hours.",
      hasAttachment: false,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");

  const getBadgeColor = (type) => {
    switch (type) {
      case "Urgent":
        return "bg-red-600 text-white";
      case "Event":
        return "bg-green-600 text-white";
      default:
        return "bg-cyan-400 text-black";
    }
  };

  const filteredNotices = notices.filter(
    (notice) =>
      notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notice.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto my-12 px-4">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-6">
        <div className="md:w-2/3">
          <h2 className="text-3xl font-bold text-gray-800 flex items-center">
            <i className="fas fa-bullhorn mr-2 text-blue-600"></i>
            Society Notice Board
          </h2>
          <p className="text-gray-500">
            Stay updated with the latest announcements and circulars.
          </p>
        </div>

        {/* SEARCH BAR */}
        <div className="md:w-1/3 mt-4 md:mt-0">
          <div className="flex items-center border rounded bg-white">
            <span className="px-3 text-gray-400">
              <i className="fas fa-search"></i>
            </span>
            <input
              type="text"
              placeholder="Search notices..."
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-2 pr-3 outline-none"
            />
          </div>
        </div>
      </div>

      {/* NOTICES */}
      <div>
        {filteredNotices.length > 0 ? (
          filteredNotices.map((notice) => (
            <div key={notice.id} className="mb-4">
              <div className="bg-white shadow-sm border-l-4 border-blue-600 rounded p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="font-bold text-lg mb-1">{notice.title}</h5>

                    <div className="flex items-center gap-3">
                      <span
                        className={`text-xs px-3 py-1 rounded-full font-semibold ${getBadgeColor(
                          notice.type
                        )}`}
                      >
                        {notice.type}
                      </span>

                      <span className="text-gray-500 text-sm flex items-center">
                        <i className="far fa-calendar-alt mr-1"></i>
                        {notice.date}
                      </span>
                    </div>
                  </div>

                  {notice.hasAttachment && (
                    <button className="border px-3 py-1 text-sm rounded hover:bg-gray-100">
                      <i className="fas fa-download mr-1"></i> PDF
                    </button>
                  )}
                </div>

                <p className="text-gray-600 mt-4">{notice.content}</p>

                <div className="flex justify-between items-center mt-4 border-t pt-3">
                  <small className="text-gray-500 italic">
                    Posted by: <strong>{notice.postedBy}</strong>
                  </small>

                  <small className="text-blue-600 cursor-pointer flex items-center">
                    Read More <i className="fas fa-arrow-right ml-1"></i>
                  </small>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No notices found matching your search.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NoticeBoard;