const FacilityBooking = require("../../../db/models/facilityBookingModel");

// Create Booking
const createBooking = async (req, res) => {
  try {

    const booking = await FacilityBooking.create(req.body);

    res.status(201).json({
      success: true,
      message: "Facility booked successfully",
      data: booking
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get All Bookings
const getAllBookings = async (req, res) => {
  try {

    const bookings = await FacilityBooking.find()
      .populate("facility")
      .populate("resident")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: bookings
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get Booking by ID
const getBookingById = async (req, res) => {
  try {

    const booking = await FacilityBooking.findById(req.params.id)
      .populate("facility")
      .populate("resident");

    res.json({
      success: true,
      data: booking
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Update Booking
const updateBooking = async (req, res) => {
  try {

    const booking = await FacilityBooking.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({
      success: true,
      message: "Booking updated",
      data: booking
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Delete Booking
const deleteBooking = async (req, res) => {
  try {

    await FacilityBooking.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Booking deleted"
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBooking,
  deleteBooking
};