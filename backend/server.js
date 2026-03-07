const express = require("express");
require("dotenv").config();
const cors = require("cors");

const connectDB = require("./app/db/config/db");
const residentRoutes = require("./app/routes_controller/Resident");
const facilityBookingRoutes = require('./app/routes_controller/FacilityBooking')
const complaintRoutes = require("./app/routes_controller/Complaint")

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Home page");
});

app.use("/api/resident", residentRoutes);
app.use("/api/facility-booking", facilityBookingRoutes);
app.use("/api/complaint", complaintRoutes);


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});