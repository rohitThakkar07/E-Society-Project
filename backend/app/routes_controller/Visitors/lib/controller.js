const Visitor  = require("../../../db/models/visitorModel");
const Resident = require("../../../db/models/residentsModel");

const roleOf = (u) => (u?.role || "").toLowerCase();
const isStaff = (u) => ["guard", "admin"].includes(roleOf(u));

function getResidentIdFromVisitor(visitor) {
  const vr = visitor.visitingResident;
  if (!vr) return "";
  if (typeof vr === "object" && vr._id) return vr._id.toString();
  return vr.toString();
}

/** @returns {null | { status: number, message: string }} */
function assertVisitorVisibleToUser(req, visitor) {
  if (isStaff(req.user)) return null;
  if (roleOf(req.user) === "resident") {
    const vid = getResidentIdFromVisitor(visitor);
    const pid = req.user.profileId?.toString();
    if (vid && pid && vid === pid) return null;
    return { status: 403, message: "Access denied." };
  }
  return { status: 403, message: "Access denied." };
}

function requireStaff(req, res) {
  if (!isStaff(req.user)) {
    res.status(403).json({ success: false, message: "Access denied." });
    return false;
  }
  return true;
}

// ─── OTP HELPER ──────────────────────────────────────────────────────────────
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// ─── SEND OTP via Email ───────────────────────────────────────────────────────
const { sendMail } = require("../../../../utils/sendMail");

const sendOTPtoResident = async (residentEmail, residentMobile, otp, visitorName) => {
  // Console log always (dev visibility)
  console.log(`OTP [${otp}] for resident mobile ${residentMobile} | visitor: ${visitorName}`);

  // Send email if resident has an email address
  if (!residentEmail) {
    console.warn(" Resident has no email — OTP only logged to console.");
    return true;
  }

  const subject = "Visitor Entry OTP — e-Society";
  const html = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 480px; margin: 0 auto; background: #f8fafc; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0;">
        <div style="background: #1e40af; padding: 28px 32px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 22px; letter-spacing: 1px;">e-Society</h1>
          <p style="color: #bfdbfe; margin: 6px 0 0; font-size: 13px;">Security Gate System</p>
        </div>
        <div style="padding: 32px;">
          <p style="color: #334155; font-size: 15px; margin: 0 0 8px;">Hello Resident,</p>
          <p style="color: #475569; font-size: 14px; margin: 0 0 24px;">
            <strong style="color: #1e293b;">${visitorName}</strong> is at the gate requesting entry. 
            Share this OTP with the security guard to allow entry:
          </p>
          <div style="background: #f1f5f9; border: 2px dashed #93c5fd; border-radius: 12px; text-align: center; padding: 24px; margin-bottom: 24px;">
            <p style="color: #64748b; font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; margin: 0 0 8px;">Your One-Time Password</p>
            <p style="color: #1e40af; font-size: 42px; font-weight: 900; letter-spacing: 10px; margin: 0; font-family: monospace;">${otp}</p>
          </div>
          <div style="background: #fef3c7; border-radius: 10px; padding: 12px 16px; margin-bottom: 24px;">
            <p style="color: #92400e; font-size: 12px; margin: 0;">
              ⏱️ This OTP is valid for <strong>5 minutes</strong>. Do not share it with anyone other than the security guard.
            </p>
          </div>
          <p style="color: #94a3b8; font-size: 12px; margin: 0;">
            If you are not expecting a visitor, please contact security immediately.
          </p>
        </div>
        <div style="background: #f1f5f9; padding: 16px 32px; text-align: center;">
          <p style="color: #94a3b8; font-size: 11px; margin: 0;">e-Society Management System · Do not reply to this email</p>
        </div>
      </div>
    `;

  await sendMail(residentEmail, subject, html);
  console.log(`OTP email sent to ${residentEmail}`);
  return true;
};


// ─── CREATE VISITOR & SEND OTP ───────────────────────────────────────────────
exports.createVisitor = async (req, res) => {
  try {
    if (!requireStaff(req, res)) return;

    const {
      visitorName, mobileNumber, visitingResident,
      wing, flatNumber, purpose, vehicleNumber, loggedBy, notes
    } = req.body;

    // Verify resident exists
    const resident = await Resident.findById(visitingResident)
      .select("email mobileNumber flatNumber")
      .lean();
    if (!resident) {
      return res.status(404).json({ success: false, message: "Resident not found." });
    }

    // Status handling (allow frontend override for Admins)
    const initialStatus = req.body.status || "Pending";

    // Generate OTP only if Pending
    let otp = null;
    let otpExpiresAt = null;
    if (initialStatus === "Pending") {
      otp          = generateOTP();
      otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
    }

    const visitor = await Visitor.create({
      visitorName,
      mobileNumber,
      visitingResident,
      wing,
      flatNumber,
      purpose: purpose || "Visit",
      vehicleNumber:  vehicleNumber  || null,
      loggedBy:       loggedBy       || null,
      notes:          notes          || null,
      otp,
      otpExpiresAt,
      status: initialStatus,
      entryTime: initialStatus === "Inside" ? new Date() : null
    });

    // Send OTP to resident only if Pending
    if (initialStatus === "Pending") {
      sendOTPtoResident(resident.email, resident.mobileNumber, otp, visitorName).catch((err) => {
        console.error("OTP send failed (non-critical):", err.message);
      });
    }

    res.status(201).json({
      success: true,
      message: initialStatus === "Inside" 
        ? "Visitor entry logged directly." 
        : `Visitor entry created. OTP sent to resident (${resident.flatNumber}).`,
      data: visitor
    });
  } catch (error) {
    console.error("createVisitor error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── VERIFY OTP & ALLOW ENTRY ────────────────────────────────────────────────
exports.verifyOTP = async (req, res) => {
  try {
    const { id }  = req.params;
    const { otp } = req.body;

    const visitor = await Visitor.findById(id);
    if (!visitor) {
      return res.status(404).json({ success: false, message: "Visitor not found." });
    }

    const denied = assertVisitorVisibleToUser(req, visitor);
    if (denied) {
      return res.status(denied.status).json({ success: false, message: denied.message });
    }

    if (visitor.status === "Inside" || visitor.otpVerified) {
      return res.status(400).json({ success: false, message: "Visitor already verified and inside." });
    }
    if (visitor.status === "Denied") {
      return res.status(400).json({ success: false, message: "Visitor has been denied entry." });
    }
    if (!visitor.otp || visitor.otp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP." });
    }
    if (new Date() > visitor.otpExpiresAt) {
      return res.status(400).json({ success: false, message: "OTP has expired. Please resend." });
    }

    visitor.otp          = null;
    visitor.otpExpiresAt = null;
    visitor.otpVerified  = true;
    visitor.status       = "Approved";
    visitor.entryTime    = new Date();
    await visitor.save();

    res.json({
      success: true,
      message: "OTP verified! Visitor approved and entry logged.",
      data:    visitor
    });
  } catch (error) {
    console.error("verifyOTP error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── RESEND OTP ───────────────────────────────────────────────────────────────
exports.resendOTP = async (req, res) => {
  try {
    const { id } = req.params;

    const visitor = await Visitor.findById(id).populate("visitingResident");
    if (!visitor) {
      return res.status(404).json({ success: false, message: "Visitor not found." });
    }

    const denied = assertVisitorVisibleToUser(req, visitor);
    if (denied) {
      return res.status(denied.status).json({ success: false, message: denied.message });
    }

    if (visitor.status !== "Pending") {
      return res.status(400).json({ success: false, message: "OTP can only be resent for pending visitors." });
    }

    const otp          = generateOTP();
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);

    visitor.otp          = otp;
    visitor.otpExpiresAt = otpExpiresAt;
    await visitor.save();

    const resident = visitor.visitingResident;
    await sendOTPtoResident(resident.email, resident.mobileNumber, otp, visitor.visitorName);

    res.json({ success: true, message: "OTP resent to resident." });
  } catch (error) {
    console.error("resendOTP error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── DENY VISITOR ─────────────────────────────────────────────────────────────
exports.denyVisitor = async (req, res) => {
  try {
    if (!requireStaff(req, res)) return;

    const { id }    = req.params;
    const { notes } = req.body;

    const visitor = await Visitor.findByIdAndUpdate(
      id,
      { status: "Denied", notes: notes || null, otp: null, otpExpiresAt: null },
      { new: true }
    );
    if (!visitor) {
      return res.status(404).json({ success: false, message: "Visitor not found." });
    }

    res.json({ success: true, message: "Visitor denied.", data: visitor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── ALLOW ENTRY (Manual — bypass OTP, guard override) ───────────────────────
exports.allowEntry = async (req, res) => {
  try {
    if (!requireStaff(req, res)) return;

    const { id } = req.params;

    const visitor = await Visitor.findByIdAndUpdate(
      id,
      { status: "Inside", entryTime: new Date(), otpVerified: true },
      { new: true }
    );
    if (!visitor) {
      return res.status(404).json({ success: false, message: "Visitor not found." });
    }

    res.json({ success: true, message: "Visitor entry allowed.", data: visitor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── MARK EXIT ────────────────────────────────────────────────────────────────
exports.markExit = async (req, res) => {
  try {
    if (!requireStaff(req, res)) return;

    const { id } = req.params;

    const visitor = await Visitor.findById(id);
    if (!visitor) {
      return res.status(404).json({ success: false, message: "Visitor not found." });
    }
    if (visitor.status === "Exited") {
      return res.status(400).json({ success: false, message: "Visitor already exited." });
    }

    visitor.status   = "Exited";
    visitor.exitTime = new Date();
    await visitor.save();

    res.json({ success: true, message: "Visitor exit logged.", data: visitor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── GET ALL VISITORS ─────────────────────────────────────────────────────────
exports.getAllVisitors = async (req, res) => {
  try {
    const { status, wing, date, search } = req.query;
    const filter = {};

    if (status && status !== "All") filter.status = status;
    if (wing)   filter.wing = wing;
    if (date) {
      const d     = new Date(date);
      const start = new Date(d.setHours(0, 0, 0, 0));
      const end   = new Date(d.setHours(23, 59, 59, 999));
      filter.createdAt = { $gte: start, $lte: end };
    }
    if (search) {
      filter.$or = [
        { visitorName:  { $regex: search, $options: "i" } },
        { mobileNumber: { $regex: search, $options: "i" } },
        { flatNumber:   { $regex: search, $options: "i" } }
      ];
    }

    const visitors = await Visitor.find(filter)
      .populate("visitingResident", "firstName lastName mobileNumber flatNumber wing")
      .populate("loggedBy", "name guardId")
      .sort({ createdAt: -1 })
      .lean();

    res.json({ success: true, data: visitors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── GET VISITORS FOR A SPECIFIC RESIDENT ────────────────────────────────────
exports.getMyVisitors = async (req, res) => {
  try {
    const role = roleOf(req.user);
    let residentId;

    if (role === "resident") {
      residentId = req.user.profileId.toString();
      if (req.params.residentId && req.params.residentId !== residentId) {
        return res.status(403).json({ success: false, message: "Access denied." });
      }
    } else if (isStaff(req.user)) {
      residentId = req.params.residentId;
      if (!residentId) {
        return res.status(400).json({ success: false, message: "Resident ID is required." });
      }
    } else {
      return res.status(403).json({ success: false, message: "Access denied." });
    }

    const visitors = await Visitor.find({ visitingResident: residentId })
      .populate("visitingResident", "firstName lastName mobileNumber flatNumber wing")
      .populate("loggedBy", "name guardId")
      .sort({ createdAt: -1 })
      .lean();

    res.json({ success: true, data: visitors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── GET VISITOR BY ID ────────────────────────────────────────────────────────
exports.getVisitorById = async (req, res) => {
  try {
    const visitor = await Visitor.findById(req.params.id)
      .populate("visitingResident", "firstName lastName mobileNumber flatNumber wing")
      .populate("loggedBy", "name guardId")
      .lean();
    if (!visitor) {
      return res.status(404).json({ success: false, message: "Visitor not found." });
    }

    const denied = assertVisitorVisibleToUser(req, visitor);
    if (denied) {
      return res.status(denied.status).json({ success: false, message: denied.message });
    }

    res.json({ success: true, data: visitor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── UPDATE VISITOR ───────────────────────────────────────────────────────────
exports.updateVisitor = async (req, res) => {
  try {
    if (!requireStaff(req, res)) return;

    const visitor = await Visitor.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate("visitingResident", "firstName lastName mobileNumber flatNumber wing");
    if (!visitor) {
      return res.status(404).json({ success: false, message: "Visitor not found." });
    }
    res.json({ success: true, message: "Visitor updated.", data: visitor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── DELETE VISITOR ───────────────────────────────────────────────────────────
exports.deleteVisitor = async (req, res) => {
  try {
    if (!requireStaff(req, res)) return;

    const visitor = await Visitor.findByIdAndDelete(req.params.id);
    if (!visitor) {
      return res.status(404).json({ success: false, message: "Visitor not found." });
    }
    res.json({ success: true, message: "Visitor deleted." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── SEARCH RESIDENTS (for guard to find flat/resident) ──────────────────────
exports.searchResidents = async (req, res) => {
  try {
    if (!requireStaff(req, res)) return;

    const { q } = req.query;
    if (!q || q.length < 2) {
      return res.json({ success: true, data: [] });
    }

    const residents = await Resident.find({
      $or: [
        { firstName:    { $regex: q, $options: "i" } },
        { lastName:     { $regex: q, $options: "i" } },
        { flatNumber:   { $regex: q, $options: "i" } },
        { wing:         { $regex: q, $options: "i" } },
        { mobileNumber: { $regex: q, $options: "i" } }
      ],
      status: "Active"
    })
      .select("firstName lastName flatNumber wing mobileNumber")
      .limit(10)
      .lean();

    res.json({ success: true, data: residents });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── GET TODAY'S SUMMARY STATS ────────────────────────────────────────────────
exports.getTodayStats = async (req, res) => {
  try {
    if (!requireStaff(req, res)) return;

    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const [total, pending, inside, exited, denied] = await Promise.all([
      Visitor.countDocuments({ createdAt: { $gte: start, $lte: end } }),
      Visitor.countDocuments({ status: "Pending", createdAt: { $gte: start, $lte: end } }),
      Visitor.countDocuments({ status: { $in: ["Inside", "Approved"] }, createdAt: { $gte: start, $lte: end } }),
      Visitor.countDocuments({ status: "Exited", createdAt: { $gte: start, $lte: end } }),
      Visitor.countDocuments({ status: "Denied", createdAt: { $gte: start, $lte: end } }),
    ]);

    res.json({ success: true, data: { total, pending, inside, exited, denied } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};