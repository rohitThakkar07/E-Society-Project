const FacilityBooking = require("../../../db/models/facilityBookingModel");
const Facility = require("../../../db/models/facilityModel");

// ── Create Booking — saves a facility snapshot so data survives deletion ─────
const createBooking = async (req, res) => {
  try {
    const { facility, resident, bookingDate, startTime, endTime, purpose } = req.body;

    if (!facility || !resident || !bookingDate || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message: "facility, resident, bookingDate, startTime and endTime are all required.",
      });
    }

    // Verify facility still exists and is Available
    const facilityDoc = await Facility.findById(facility);
    if (!facilityDoc) {
      return res.status(404).json({
        success: false,
        message: "Selected facility no longer exists.",
      });
    }
    if (facilityDoc.status !== "Available") {
      return res.status(400).json({
        success: false,
        message: `This facility is currently ${facilityDoc.status} and cannot be booked.`,
      });
    }

    // Conflict check
    const dateStart = new Date(bookingDate); dateStart.setHours(0, 0, 0, 0);
    const dateEnd   = new Date(bookingDate); dateEnd.setHours(23, 59, 59, 999);

    const conflict = await FacilityBooking.findOne({
      facility,
      bookingDate: { $gte: dateStart, $lte: dateEnd },
      status: { $nin: ["Cancelled", "Rejected"] },
      $or: [
        { startTime: { $lte: startTime }, endTime: { $gt: startTime } },
        { startTime: { $lt: endTime },    endTime: { $gte: endTime }  },
        { startTime: { $gte: startTime }, endTime: { $lte: endTime }  },
      ],
    });

    if (conflict) {
      return res.status(409).json({
        success: false,
        message: `Already booked from ${conflict.startTime} to ${conflict.endTime} on this date.`,
      });
    }

    // Save a snapshot of the facility at booking time
    // This means even if the facility is deleted later, the booking still has its details
    const booking = await FacilityBooking.create({
      facility,
      resident,
      bookingDate,
      startTime,
      endTime,
      purpose,
      facilitySnapshot: {
        name:        facilityDoc.name,
        location:    facilityDoc.location,
        openingTime: facilityDoc.openingTime,
        closingTime: facilityDoc.closingTime,
      },
    });

    const populated = await booking.populate(["facility", "resident"]);

    res.status(201).json({
      success: true,
      message: "Facility booked successfully",
      data: populated,
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Check Availability ────────────────────────────────────────────────────────
const checkAvailability = async (req, res) => {
  try {
    const { facilityId, bookingDate } = req.query;

    if (!facilityId || !bookingDate) {
      return res.status(400).json({
        success: false,
        message: "facilityId and bookingDate are required",
      });
    }

    // Also check if facility still exists
    const facility = await Facility.findById(facilityId);
    if (!facility) {
      return res.status(404).json({
        success: false,
        message: "This facility no longer exists.",
      });
    }

    const dateStart = new Date(bookingDate); dateStart.setHours(0, 0, 0, 0);
    const dateEnd   = new Date(bookingDate); dateEnd.setHours(23, 59, 59, 999);

    const bookedSlots = await FacilityBooking.find({
      facility: facilityId,
      bookingDate: { $gte: dateStart, $lte: dateEnd },
      status: { $nin: ["Cancelled", "Rejected"] },
    }).select("startTime endTime status");

    res.json({ success: true, data: bookedSlots });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Get All Bookings ──────────────────────────────────────────────────────────
const getAllBookings = async (req, res) => {
  try {
    // populate("facility") returns null for deleted facilities — handled in frontend
    const bookings = await FacilityBooking.find()
  .populate("facility", "name location status openingTime closingTime")
  .populate({
    path: "resident",
    select: "name profileId",
    populate: {
      path: "profileId",
      model: "Resident",
      select: "firstName lastName flatNumber"
    }
  })
  .sort({ createdAt: -1 });

    res.json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Get Booking by ID ─────────────────────────────────────────────────────────
const getBookingById = async (req, res) => {
  try {
    const booking = await FacilityBooking.findById(req.params.id)
      .populate("facility", "name location openingTime closingTime status")
      .populate("resident", "flatNumber name");

    if (!booking)
      return res.status(404).json({ success: false, message: "Booking not found" });

    res.json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Update Booking ────────────────────────────────────────────────────────────
const updateBooking = async (req, res) => {
  try {
    const allowedUpdates = {
      bookingDate: req.body.bookingDate,
      startTime:   req.body.startTime,
      endTime:     req.body.endTime,
      purpose:     req.body.purpose,
      status:      req.body.status,
      approvedBy:  req.body.approvedBy,
    };
    Object.keys(allowedUpdates).forEach(
      (k) => allowedUpdates[k] === undefined && delete allowedUpdates[k]
    );

    const booking = await FacilityBooking.findByIdAndUpdate(
      req.params.id,
      allowedUpdates,
      { new: true, runValidators: true }
    )
      .populate("facility", "name location status")
      .populate("resident", "flatNumber name");

    if (!booking)
      return res.status(404).json({ success: false, message: "Booking not found" });

    res.json({ success: true, message: "Booking updated", data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Delete Booking ────────────────────────────────────────────────────────────
const deleteBooking = async (req, res) => {
  try {
    const booking = await FacilityBooking.findByIdAndDelete(req.params.id);
    if (!booking)
      return res.status(404).json({ success: false, message: "Booking not found" });
    res.json({ success: true, message: "Booking deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createBooking,
  checkAvailability,
  getAllBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
};