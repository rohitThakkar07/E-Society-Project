const Event = require("../../../db/models/eventModal");
const { validationResult } = require("express-validator");

/**
 * CREATE EVENT
 */
exports.createEvent = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg,
      });
    }

    const {
      title,
      description,
      date,
      time,
      location,
      organizer,
      category,
    } = req.body;

    const event = await Event.create({
      title,
      description,
      date,
      time,
      location,
      organizer,
      category,
      createdBy: req.user?.id,
    });

    res.status(201).json({
      success: true,
      message: "Event created successfully",
      data: event,
    });
  } catch (error) {
    console.error("Create event error:", error);
    res.status(500).json({
      success: false,
      message: "Unable to create event",
    });
  }
};

/**
 * GET ALL EVENTS
 */
exports.getAllEvents = async (req, res) => {
  try {
    const { category, upcoming } = req.query;

    const filter = {};

    if (category) filter.category = category;

    // Only return upcoming events if query param is set
    if (upcoming === "true") {
      filter.date = { $gte: new Date() };
    }

    const events = await Event.find(filter).sort({ date: 1 });

    res.json({
      success: true,
      data: events,
    });
  } catch (error) {
    console.error("Get all events error:", error);
    res.status(500).json({
      success: false,
      message: "Unable to fetch events",
    });
  }
};

/**
 * GET EVENT BY ID
 */
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    res.json({
      success: true,
      data: event,
    });
  } catch (error) {
    console.error("Get event by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Unable to fetch event",
    });
  }
};

/**
 * UPDATE EVENT
 */
exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    res.json({
      success: true,
      message: "Event updated successfully",
      data: event,
    });
  } catch (error) {
    console.error("Update event error:", error);
    res.status(500).json({
      success: false,
      message: "Unable to update event",
    });
  }
};

/**
 * DELETE EVENT
 */
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    res.json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error) {
    console.error("Delete event error:", error);
    res.status(500).json({
      success: false,
      message: "Unable to delete event",
    });
  }
};