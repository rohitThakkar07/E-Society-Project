/**
 * Shared helpers for payment routes (module scope avoids any TDZ issues in large handlers).
 */

function normalizePaymentMode(method) {
  const lower = (method || "").toLowerCase();
  if (lower === "card") return "Card";
  if (lower === "netbanking") return "Net Banking";
  if (lower === "upi") return "UPI";
  if (lower === "wallet") return "Wallet";
  if (lower === "emandate") return "E-Mandate";
  if (lower === "razorpay") return "Razorpay";
  if (lower === "cash") return "Cash";
  return "Other";
}

function toSchemaPaymentMethod(method) {
  const m = String(method || "").toLowerCase();
  const allowed = ["card", "netbanking", "upi", "wallet", "emandate"];
  if (allowed.includes(m)) return m;
  if (m.includes("net")) return "netbanking";
  return "upi";
}

module.exports = { normalizePaymentMode, toSchemaPaymentMethod };
