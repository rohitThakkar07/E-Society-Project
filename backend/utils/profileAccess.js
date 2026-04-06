const Resident = require("../app/db/models/residentsModel");
const Guard = require("../app/db/models/guardModal");

/**
 * Ensures resident/guard profile allows portal access (Active).
 * User.status is checked separately (login + authMiddleware).
 */
async function assertResidentOrGuardProfileActive(user) {
  if (!user) {
    return { ok: false, message: "Invalid user", status: 403 };
  }

  if (user.role === "resident") {
    const profile = await Resident.findById(user.profileId).select("status");
    if (!profile) {
      return {
        ok: false,
        message: "Resident profile not found. Contact admin.",
        status: 403,
      };
    }
    if (profile.status === "Inactive") {
      return {
        ok: false,
        message: "Your resident account is inactive. Contact admin.",
        status: 403,
      };
    }
  }

  if (user.role === "guard") {
    const profile = await Guard.findById(user.profileId).select("status");
    if (!profile) {
      return {
        ok: false,
        message: "Guard profile not found. Contact admin.",
        status: 403,
      };
    }
    if (profile.status === "Inactive") {
      return {
        ok: false,
        message: "Your guard account is inactive. Contact admin.",
        status: 403,
      };
    }
  }

  return { ok: true };
}

module.exports = { assertResidentOrGuardProfileActive };
