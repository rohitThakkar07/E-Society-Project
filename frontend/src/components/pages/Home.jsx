import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      {/* ================= HERO SECTION ================= */}
      <header>
        <div
          className="relative h-[600px] bg-cover bg-center flex items-center justify-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')",
          }}
        >
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/60"></div>

          {/* Content */}
          <div className="relative text-white text-center px-6 max-w-4xl">
            <h1 className="text-5xl font-bold mb-4">Smart Living, Simplified</h1>
            <h4 className="text-xl font-light mb-6">
              The all-in-one platform for Gated Communities. Secure, Transparent,
              and Efficient.
            </h4>

            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
              <Link
                to="/login"
                className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold text-lg"
              >
                Resident Login
              </Link>

              <Link
                to="/contact"
                className="border border-white hover:bg-white hover:text-black px-6 py-3 rounded-lg font-semibold text-lg"
              >
                Contact Admin
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* ================= FEATURES SECTION ================= */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">Core Functionalities</h2>
          <p className="text-gray-500">
            Everything you need to manage your society efficiently
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Card */}
          {[
            {
              icon: "fa-user-shield",
              title: "Visitor Management",
              text: "QR-based entry for guests and delivery personnel. Real-time notifications for residents.",
              color: "text-blue-600",
            },
            {
              icon: "fa-file-invoice-dollar",
              title: "Maintenance & Bills",
              text: "Track monthly payments, generate invoices, and view society expense reports transparently.",
              color: "text-green-600",
            },
            {
              icon: "fa-swimming-pool",
              title: "Facility Booking",
              text: "Check availability and book shared amenities like the clubhouse, gym, or tennis court online.",
              color: "text-yellow-500",
            },
            {
              icon: "fa-tools",
              title: "Complaint Tracking",
              text: "Raise maintenance issues and track resolution status in real-time.",
              color: "text-red-600",
            },
            {
              icon: "fa-bullhorn",
              title: "Digital Notice Board",
              text: "Stay updated with announcements, meeting schedules, and community events instantly.",
              color: "text-cyan-600",
            },
            {
              icon: "fa-shield-alt",
              title: "Emergency Alerts",
              text: "Trigger security alarms and notify guards immediately in case of emergency.",
              color: "text-gray-800",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white shadow-md rounded-xl p-6 text-center hover:shadow-lg transition"
            >
              <div className={`mb-4 ${item.color}`}>
                <i className={`fas ${item.icon} text-4xl`}></i>
              </div>
              <h5 className="text-lg font-bold mb-2">{item.title}</h5>
              <p className="text-gray-500">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= STATS SECTION ================= */}
      <section className="bg-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 text-center gap-8">
          <div>
            <h2 className="text-3xl font-bold text-blue-600">500+</h2>
            <p className="font-semibold text-gray-500">Happy Families</p>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-blue-600">100%</h2>
            <p className="font-semibold text-gray-500">Secure Entry</p>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-blue-600">24/7</h2>
            <p className="font-semibold text-gray-500">Support System</p>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-blue-600">Zero</h2>
            <p className="font-semibold text-gray-500">Paperwork</p>
          </div>
        </div>
      </section>

      {/* ================= CTA SECTION ================= */}
      <section className="py-12 bg-gray-900 text-white text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-4">
            Ready to upgrade your living experience?
          </h2>
          <p className="text-lg mb-6">
            Join the smartest e-Society platform today.
          </p>
          <button className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg text-lg font-semibold">
            Download App
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;