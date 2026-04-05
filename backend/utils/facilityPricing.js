/**
 * Pricing rules:
 * - hourly: ceil(totalHours) × pricePerHour (min 1 hour)
 * - daily: ceil(totalHours / 24) × pricePerDay (min 1 day block)
 * - both: floor(totalHours/24) × pricePerDay + ceil(remainder hours) × pricePerHour (0 extra hours if exact days)
 */

const MS_HOUR = 60 * 60 * 1000;
const MS_DAY = 24 * MS_HOUR;

function parseTimeToMinutes(timeStr) {
  if (!timeStr || typeof timeStr !== "string") return 0;
  const [h, m] = timeStr.split(":").map((x) => parseInt(x, 10) || 0);
  return h * 60 + m;
}

function minutesOfDate(d) {
  return d.getHours() * 60 + d.getMinutes();
}

/**
 * Validate booking window against facility open/close (same rules for every day).
 * - hourly / both (≤24h span): must be same calendar day; within open–close.
 * - daily: may span multiple days; start/end clock times must fall within open–close on first/last day.
 */
function validateBookingWindow(facility, start, end) {
  const open = parseTimeToMinutes(facility.openTime || "06:00");
  const close = parseTimeToMinutes(facility.closeTime || "22:00");
  if (close <= open) {
    return { ok: false, message: "Facility close time must be after open time" };
  }
  if (!(start instanceof Date) || !(end instanceof Date) || isNaN(start) || isNaN(end)) {
    return { ok: false, message: "Invalid start or end datetime" };
  }
  if (end <= start) {
    return { ok: false, message: "End must be after start" };
  }

  const type = facility.bookingType || "hourly";
  const spanMs = end - start;
  const spanHours = spanMs / MS_HOUR;

  if (type === "daily") {
    const sm = minutesOfDate(start);
    const em = minutesOfDate(end);
    if (sm < open || sm >= close) {
      return { ok: false, message: `Start time must be within ${facility.openTime}–${facility.closeTime}` };
    }
    if (em <= open || em > close) {
      return { ok: false, message: `End time must be within ${facility.openTime}–${facility.closeTime}` };
    }
    return { ok: true };
  }

  // both: multi-day allowed (days + leftover hours)
  if (type === "both" && spanHours > 24 + 1e-6) {
    const sm = minutesOfDate(start);
    const em = minutesOfDate(end);
    if (sm < open || sm >= close) {
      return { ok: false, message: `Start time must be within ${facility.openTime}–${facility.closeTime}` };
    }
    if (em <= open || em > close) {
      return { ok: false, message: `End time must be within ${facility.openTime}–${facility.closeTime}` };
    }
    return { ok: true };
  }

  // hourly, or both within one day: same calendar day
  if (start.toDateString() !== end.toDateString()) {
    return {
      ok: false,
      message: "Start and end must be on the same calendar day for this facility type",
    };
  }

  const sm = minutesOfDate(start);
  const em = minutesOfDate(end);
  if (sm < open || em > close) {
    return {
      ok: false,
      message: `Booking must fall between ${facility.openTime} and ${facility.closeTime}`,
    };
  }
  return { ok: true };
}

function computePrice(facility, start, end) {
  const type = facility.bookingType || "hourly";
  const spanMs = end - start;
  const totalHours = spanMs / MS_HOUR;
  const ph = Number(facility.pricePerHour) || 0;
  const pd = Number(facility.pricePerDay) || 0;

  let fullDays = 0;
  let extraBillableHours = 0;
  let hourlySubtotal = 0;
  let dailySubtotal = 0;

  if (type === "hourly") {
    const billableHours = Math.max(1, Math.ceil(totalHours - 1e-9));
    hourlySubtotal = billableHours * ph;
    extraBillableHours = billableHours;
    return {
      totalAmount: Math.round(hourlySubtotal * 100) / 100,
      pricingBreakdown: {
        totalHours: Math.round(totalHours * 100) / 100,
        fullDays: 0,
        extraBillableHours: billableHours,
        hourlySubtotal: Math.round(hourlySubtotal * 100) / 100,
        dailySubtotal: 0,
      },
    };
  }

  if (type === "daily") {
    const billableDays = Math.max(1, Math.ceil(totalHours / 24 - 1e-9));
    dailySubtotal = billableDays * pd;
    fullDays = billableDays;
    return {
      totalAmount: Math.round(dailySubtotal * 100) / 100,
      pricingBreakdown: {
        totalHours: Math.round(totalHours * 100) / 100,
        fullDays: billableDays,
        extraBillableHours: 0,
        hourlySubtotal: 0,
        dailySubtotal: Math.round(dailySubtotal * 100) / 100,
      },
    };
  }

  // both
  fullDays = Math.floor(totalHours / 24);
  const remainder = totalHours - fullDays * 24;
  extraBillableHours = remainder > 1e-6 ? Math.ceil(remainder - 1e-9) : 0;
  dailySubtotal = fullDays * pd;
  hourlySubtotal = extraBillableHours * ph;
  const totalAmount = dailySubtotal + hourlySubtotal;
  return {
    totalAmount: Math.round(totalAmount * 100) / 100,
    pricingBreakdown: {
      totalHours: Math.round(totalHours * 100) / 100,
      fullDays,
      extraBillableHours,
      hourlySubtotal: Math.round(hourlySubtotal * 100) / 100,
      dailySubtotal: Math.round(dailySubtotal * 100) / 100,
    },
  };
}

module.exports = {
  validateBookingWindow,
  computePrice,
  parseTimeToMinutes,
  MS_HOUR,
  MS_DAY,
};
