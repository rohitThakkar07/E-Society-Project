const FacilityBooking = require("../../../db/models/facilityBookingModel");
const Facility = require("../../../db/models/facilityModel");
const {
  validateBookingWindow,
  computePrice,
} = require("../../../../utils/facilityPricing");

const BLOCKING = ["Pending", "Approved"];

function isAdmin(req) {
  return req.user?.role === "admin";
}

function startEndOfDay(dateInput) {
  const d = new Date(dateInput);
  const start = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
  const end = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
  return { start, end };
}

async function hasOverlap(facilityId, start, end, excludeId = null) {
  const q = {
    facility: facilityId,
    status: { $in: BLOCKING },
    startDateTime: { $lt: end },
    endDateTime: { $gt: start },
  };
  if (excludeId) q._id = { $ne: excludeId };
  const found = await FacilityBooking.findOne(q).select("_id");
  return Boolean(found);
}

/** POST /preview — price quote */
exports.previewBooking = async (req, res) => {
  try {
    const { facilityId, startDateTime, endDateTime } = req.body;
    if (!facilityId || !startDateTime || !endDateTime) {
      return res.status(400).json({
        success: false,
        message: "facilityId, startDateTime and endDateTime are required",
      });
    }
    const facility = await Facility.findById(facilityId);
    if (!facility) {
      return res.status(404).json({ success: false, message: "Facility not found" });
    }
    const start = new Date(startDateTime);
    const end = new Date(endDateTime);
    const win = validateBookingWindow(facility, start, end);
    if (!win.ok) {
      return res.status(400).json({ success: false, message: win.message });
    }
    const { totalAmount, pricingBreakdown } = computePrice(facility, start, end);
    return res.json({
      success: true,
      data: {
        totalAmount,
        pricingBreakdown,
        facility: {
          name: facility.name,
          bookingType: facility.bookingType,
          pricePerHour: facility.pricePerHour,
          pricePerDay: facility.pricePerDay,
          openTime: facility.openTime,
          closeTime: facility.closeTime,
        },
      },
    });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};

/** GET /check-availability?facilityId=&date=YYYY-MM-DD */
exports.checkAvailability = async (req, res) => {
  try {
    const { facilityId, date } = req.query;
    if (!facilityId || !date) {
      return res.status(400).json({
        success: false,
        message: "facilityId and date (YYYY-MM-DD) are required",
      });
    }
    const facility = await Facility.findById(facilityId);
    if (!facility) {
      return res.status(404).json({ success: false, message: "Facility not found" });
    }
    const { start, end } = startEndOfDay(date);
    const booked = await FacilityBooking.find({
      facility: facilityId,
      status: { $in: BLOCKING },
      startDateTime: { $lt: end },
      endDateTime: { $gt: start },
    }).select("startDateTime endDateTime status paymentStatus totalAmount");

    res.json({
      success: true,
      data: booked,
      facility: {
        openTime: facility.openTime,
        closeTime: facility.closeTime,
        bookingType: facility.bookingType,
      },
    });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

/** GET /availability-range?facilityId=&from=&to= ISO */
exports.availabilityRange = async (req, res) => {
  try {
    const { facilityId, from, to } = req.query;
    if (!facilityId || !from || !to) {
      return res.status(400).json({
        success: false,
        message: "facilityId, from and to (ISO datetime) are required",
      });
    }
    const start = new Date(from);
    const end = new Date(to);
    const booked = await FacilityBooking.find({
      facility: facilityId,
      status: { $in: BLOCKING },
      startDateTime: { $lt: end },
      endDateTime: { $gt: start },
    }).select("startDateTime endDateTime status");

    res.json({ success: true, data: booked });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

/** GET /my — current resident's bookings */
exports.getMyBookings = async (req, res) => {
  try {
    const rid = req.user?.profileId;
    if (!rid) {
      return res.status(403).json({ success: false, message: "Resident profile required" });
    }
    const bookings = await FacilityBooking.find({ resident: rid })
      .populate("facility", "name status bookingType pricePerHour pricePerDay openTime closeTime")
      .sort({ startDateTime: -1 });

    res.json({ success: true, data: bookings });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

/** GET /list — admin only */
exports.getAllBookings = async (req, res) => {
  try {
    if (!isAdmin(req)) {
      return res.status(403).json({ success: false, message: "Admin only" });
    }
    const bookings = await FacilityBooking.find()
      .populate("facility", "name status bookingType")
      .populate({
        path: "resident",
        select: "firstName lastName flatNumber wing email mobileNumber",
      })
      .populate("approvedBy", "name email")
      .sort({ startDateTime: -1 });

    res.json({ success: true, data: bookings });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

/** GET /:id */
exports.getBookingById = async (req, res) => {
  try {
    const booking = await FacilityBooking.findById(req.params.id)
      .populate("facility")
      .populate("resident", "firstName lastName flatNumber wing email mobileNumber")
      .populate("approvedBy", "name email");

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    if (!isAdmin(req)) {
      const rid = req.user?.profileId?.toString();
      if (!rid || booking.resident?._id?.toString() !== rid) {
        return res.status(403).json({ success: false, message: "Access denied" });
      }
    }

    res.json({ success: true, data: booking });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

/** POST /create */
exports.createBooking = async (req, res) => {
  try {
    const { facility: facilityId, startDateTime, endDateTime, purpose, resident: bodyResident } =
      req.body;

    if (!facilityId || !startDateTime || !endDateTime) {
      return res.status(400).json({
        success: false,
        message: "facility, startDateTime and endDateTime are required",
      });
    }

    const facility = await Facility.findById(facilityId);
    if (!facility) {
      return res.status(404).json({ success: false, message: "Facility not found" });
    }
    if (facility.status !== "Available") {
      return res.status(400).json({
        success: false,
        message: `Facility is ${facility.status} and cannot be booked`,
      });
    }

    const start = new Date(startDateTime);
    const end = new Date(endDateTime);
    const win = validateBookingWindow(facility, start, end);
    if (!win.ok) {
      return res.status(400).json({ success: false, message: win.message });
    }

    const { totalAmount, pricingBreakdown } = computePrice(facility, start, end);
    if (totalAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Computed amount is zero — set facility prices",
      });
    }

    if (await hasOverlap(facilityId, start, end)) {
      return res.status(409).json({
        success: false,
        message: "This time range overlaps an existing booking",
      });
    }

    let residentId = req.user?.profileId;
    if (isAdmin(req) && bodyResident) {
      residentId = bodyResident;
    }
    if (!residentId) {
      return res.status(400).json({
        success: false,
        message: "Resident is required",
      });
    }

    const booking = await FacilityBooking.create({
      facility: facilityId,
      resident: residentId,
      bookedByUser: req.user?._id,
      startDateTime: start,
      endDateTime: end,
      totalAmount,
      pricingBreakdown,
      purpose: purpose || "",
      status: "Pending",
      paymentStatus: "unpaid",
      facilitySnapshot: {
        name: facility.name,
        bookingType: facility.bookingType,
        pricePerHour: facility.pricePerHour,
        pricePerDay: facility.pricePerDay,
      },
    });

    const populated = await FacilityBooking.findById(booking._id)
      .populate("facility", "name status bookingType pricePerHour pricePerDay openTime closeTime")
      .populate("resident", "firstName lastName flatNumber wing email");

    res.status(201).json({
      success: true,
      message: "Booking created — complete payment to confirm",
      data: populated,
    });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

/** PUT /update/:id */
exports.updateBooking = async (req, res) => {
  try {
    const booking = await FacilityBooking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    const admin = isAdmin(req);
    const rid = req.user?.profileId?.toString();
    const owner = booking.resident?.toString() === rid;

    if (req.body.status) {
      const next = req.body.status;
      if (["Approved", "Rejected"].includes(next)) {
        if (!admin) {
          return res.status(403).json({ success: false, message: "Only admin can approve/reject" });
        }
        booking.status = next;
        booking.approvedBy = req.user._id;
      } else if (next === "Cancelled") {
        if (!admin && !owner) {
          return res.status(403).json({ success: false, message: "Access denied" });
        }
        if (!admin && booking.status !== "Pending") {
          return res.status(400).json({
            success: false,
            message: "You can only cancel pending bookings",
          });
        }
        booking.status = "Cancelled";
      } else {
        booking.status = next;
      }
    }

    if (admin && req.body.purpose !== undefined) booking.purpose = req.body.purpose;

    // Admin reschedule (optional)
    if (admin && req.body.startDateTime && req.body.endDateTime) {
      const facility = await Facility.findById(booking.facility);
      const start = new Date(req.body.startDateTime);
      const end = new Date(req.body.endDateTime);
      const win = validateBookingWindow(facility, start, end);
      if (!win.ok) {
        return res.status(400).json({ success: false, message: win.message });
      }
      if (await hasOverlap(booking.facility, start, end, booking._id)) {
        return res.status(409).json({ success: false, message: "Overlap with another booking" });
      }
      const { totalAmount, pricingBreakdown } = computePrice(facility, start, end);
      booking.startDateTime = start;
      booking.endDateTime = end;
      booking.totalAmount = totalAmount;
      booking.pricingBreakdown = pricingBreakdown;
    }
    await booking.save({ validateModifiedOnly: true });
    const out = await FacilityBooking.findById(booking._id)
      .populate("facility", "name status bookingType")
      .populate("resident", "firstName lastName flatNumber wing email")
      .populate("approvedBy", "name email");

    res.json({ success: true, message: "Booking updated", data: out });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

/** DELETE /delete/:id */
exports.deleteBooking = async (req, res) => {
  try {
    if (!isAdmin(req)) {
      return res.status(403).json({ success: false, message: "Admin only" });
    }
    const booking = await FacilityBooking.findByIdAndDelete(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }
    res.json({ success: true, message: "Booking deleted" });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};
