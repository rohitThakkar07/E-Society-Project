import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-10 text-center md:text-left">

          {/* COLUMN 1: BRAND & ABOUT */}
          <div>
            <h5 className="uppercase mb-4 font-bold text-blue-500 text-lg">
              e-Society
            </h5>
            <p className="text-gray-300">
              A comprehensive solution for managing residential societies.
              We streamline visitor tracking, maintenance payments, and
              community safety into one easy-to-use platform.
            </p>
          </div>

          {/* COLUMN 2: QUICK LINKS */}
          <div>
            <h5 className="uppercase mb-4 font-bold text-yellow-400 text-lg">
              Quick Links
            </h5>
            <div className="space-y-2">
              <p><Link to="/" className="text-white hover:text-gray-300">Home</Link></p>
              <p><Link to="/about" className="text-white hover:text-gray-300">About Us</Link></p>
              <p><Link to="/notices" className="text-white hover:text-gray-300">Notice Board</Link></p>
              <p><Link to="/directory" className="text-white hover:text-gray-300">Resident Directory</Link></p>
            </div>
          </div>

          {/* COLUMN 3: SERVICES */}
          <div>
            <h5 className="uppercase mb-4 font-bold text-yellow-400 text-lg">
              Services
            </h5>
            <div className="space-y-2">
              <p><Link to="/visitors" className="text-white hover:text-gray-300">Visitor Management</Link></p>
              <p><Link to="/facilities" className="text-white hover:text-gray-300">Facility Booking</Link></p>
              <p><Link to="/maintenance" className="text-white hover:text-gray-300">Pay Maintenance</Link></p>
              <p><Link to="/raise-complaint" className="text-white hover:text-gray-300">Help Desk</Link></p>
            </div>
          </div>

          {/* COLUMN 4: CONTACT */}
          <div>
            <h5 className="uppercase mb-4 font-bold text-yellow-400 text-lg">
              Contact
            </h5>
            <p className="mb-2">
              <i className="fas fa-home mr-2"></i> Galaxy Heights, Main Road
            </p>
            <p className="mb-2">
              <i className="fas fa-envelope mr-2"></i> support@esociety.com
            </p>
            <p className="mb-2">
              <i className="fas fa-phone mr-2"></i> +91 98765 43210 (Admin)
            </p>

            {/* Emergency Box */}
            <div className="p-3 mt-4 bg-red-600 rounded text-center">
              <h6 className="font-bold mb-1">EMERGENCY / SECURITY</h6>
              <a href="tel:100" className="text-white font-bold">
                Call Gate: +91 99999 88888
              </a>
            </div>
          </div>
        </div>

        <hr className="my-6 border-gray-700" />

        {/* BOTTOM ROW */}
        <div className="flex flex-col md:flex-row items-center justify-between">
          <p className="text-center md:text-left mb-4 md:mb-0">
            © 2024 <strong>e-Society Management System</strong>. All Rights Reserved.
          </p>

          <div className="flex space-x-5 text-2xl">
            <a href="#" className="hover:text-gray-300"><i className="fab fa-facebook"></i></a>
            <a href="#" className="hover:text-gray-300"><i className="fab fa-twitter"></i></a>
            <a href="#" className="hover:text-gray-300"><i className="fab fa-google-plus"></i></a>
            <a href="#" className="hover:text-gray-300"><i className="fab fa-linkedin-in"></i></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;