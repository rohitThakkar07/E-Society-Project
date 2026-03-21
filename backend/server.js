// app.js or server.js (FIXED)
const express = require("express");
require("dotenv").config();
const cors = require("cors");
const path = require("path");

const connectDB = require("./app/db/config/db");

// ROUTES
const authRoutes = require("./app/routes_controller/Auth");
const residentRoutes = require("./app/routes_controller/Resident");
const facilityRoutes = require("./app/routes_controller/Facility");
const facilityBookingRoutes = require("./app/routes_controller/FacilityBooking");
const complaintRoutes = require("./app/routes_controller/Complaint");
const guardRoutes = require("./app/routes_controller/Guard");
const flatRoutes = require("./app/routes_controller/Flat");
const visitorRoutes = require("./app/routes_controller/Visitors");
const expenseRoutes = require("./app/routes_controller/Expanse");
const maintenanceRoutes = require("./app/routes_controller/Maintenance");
const noticeRoutes = require("./app/routes_controller/Notice");

// MIDDLEWARE
const errorHandler = require("./app/middlewares/errorMiddleware");
const authMiddleware = require("./app/middlewares/authMiddleware");

const app = express();
const PORT = process.env.PORT || 5000;

/* ============ DATABASE ============ */
connectDB();

/* ============ GLOBAL MIDDLEWARE ============ */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ SERVE UPLOADED FILES
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* ============ ROUTES ============ */
app.use("/api/auth", authRoutes);
app.use("/api/resident", authMiddleware, residentRoutes);
app.use("/api/facility", authMiddleware, facilityRoutes);
app.use("/api/facility-booking", authMiddleware, facilityBookingRoutes);
app.use("/api/complaint", authMiddleware, complaintRoutes);
app.use("/api/guard", authMiddleware, guardRoutes);
app.use("/api/flat", authMiddleware, flatRoutes);
app.use("/api/visitor", authMiddleware, visitorRoutes);
app.use("/api/expense", authMiddleware, expenseRoutes);
app.use("/api/maintenance", authMiddleware, maintenanceRoutes);
app.use("/api/notices", authMiddleware, noticeRoutes);

/* ============ ERROR HANDLER ============ */
app.use(errorHandler);

/* ============ SERVER ============ */
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

module.exports = app;