const express = require("express");
require("dotenv").config();
const cors = require("cors");

const connectDB = require("./app/db/config/db");

// ROUTES
const authRoutes = require("./app/routes_controller/Auth")
const residentRoutes = require("./app/routes_controller/Resident");
const facilityBookingRoutes = require("./app/routes_controller/FacilityBooking");
const complaintRoutes = require("./app/routes_controller/Complaint");

// MIDDLEWARE
const errorHandler = require("./app/middlewares/errorMiddleware");
const authMiddleware = require("./app/middlewares/authMiddleware")

const app = express();
const PORT = process.env.PORT || 5000;

/* ---------------- DATABASE ---------------- */

connectDB();

/* ---------------- GLOBAL MIDDLEWARE ---------------- */

app.use(cors());
app.use(express.json());

/* ---------------- ROUTES ---------------- */

app.use("/api/auth", authRoutes );
app.use("/api/resident",authMiddleware, residentRoutes);
app.use("/api/facility-booking",authMiddleware, facilityBookingRoutes);
app.use("/api/complaint",authMiddleware, complaintRoutes);

/* ---------------- ERROR HANDLER ---------------- */

app.use(errorHandler);

/* ---------------- SERVER ---------------- */

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});