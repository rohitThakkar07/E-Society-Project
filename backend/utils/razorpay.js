/**
 * Razorpay Payment Gateway Helper
 * Handles Razorpay order creation, payment verification, and refunds
 */

const Razorpay = require("razorpay");
const crypto = require("crypto");

// Initialize Razorpay with test credentials
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_SZ3mYhzzSVN0ov",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "AIRHhjrRFnEuq4o2pIoQoYiz",
});

/**
 * Create a Razorpay Order
 * @param {number} amount - Amount in paise (e.g., 50000 for ₹500)
 * @param {string} currency - Currency code (default: 'INR')
 * @param {object} metadata - Additional metadata
 * @returns {object} - Order details with id, amount, currency
 */
const createOrder = async ({ amount, currency = "INR", metadata = {} }) => {
  try {
    const amountInPaise = Math.round(Number(amount) * 100); // Convert rupees to paise

    const order = await razorpayInstance.orders.create({
      amount: amountInPaise,
      currency: currency.toUpperCase(),
      receipt: `receipt_${Date.now()}`,
      notes: {
        maintenanceId: metadata.maintenanceId,
        resident: metadata.resident,
        flatNumber: metadata.flatNumber,
        month: metadata.month,
        year: metadata.year,
      },
    });

    return {
      success: true,
      orderId: order.id,
      amount: amount,
      amountInPaise,
      currency: currency.toUpperCase(),
      status: order.status,
      createdAt: order.created_at,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Verify Razorpay Payment Signature
 * This is critical for security - ensures payment came from Razorpay
 * @param {string} orderId - Razorpay Order ID
 * @param {string} paymentId - Razorpay Payment ID
 * @param {string} signature - Razorpay Signature from payment response
 * @returns {boolean} - True if signature is valid
 */
const verifyPaymentSignature = ({ orderId, paymentId, signature }) => {
  try {
    const body = orderId + "|" + paymentId;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "AIRHhjrRFnEuq4o2pIoQoYiz")
      .update(body)
      .digest("hex");

    const isSignatureValid = expectedSignature === signature;
    return isSignatureValid;
  } catch (error) {
    console.error("Signature verification error:", error);
    return false;
  }
};

/**
 * Fetch Payment Details from Razorpay
 * @param {string} paymentId - Razorpay Payment ID
 * @returns {object} - Payment details
 */
const fetchPaymentDetails = async (paymentId) => {
  try {
    const payment = await razorpayInstance.payments.fetch(paymentId);
    return {
      success: true,
      paymentId: payment.id,
      orderId: payment.order_id,
      amount: payment.amount / 100, // Convert from paise to rupees
      currency: payment.currency,
      status: payment.status,
      method: payment.method,
      email: payment.email,
      contact: payment.contact,
      cardId: payment.card_id,
      vpa: payment.vpa,
      acquirerData: payment.acquirer_data,
      createdAt: new Date(payment.created_at * 1000),
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Create Refund for a Payment
 * @param {string} paymentId - Razorpay Payment ID
 * @param {number} amount - Optional refund amount in rupees (full refund if not specified)
 * @returns {object} - Refund details
 */
const createRefund = async (paymentId, amount = null) => {
  try {
    const refundOptions = {
      payment_id: paymentId,
    };

    if (amount) {
      refundOptions.amount = Math.round(Number(amount) * 100); // Convert to paise
    }

    const refund = await razorpayInstance.payments.refund(paymentId, refundOptions);

    return {
      success: true,
      refundId: refund.id,
      paymentId: refund.payment_id,
      amount: refund.amount / 100,
      currency: refund.currency,
      status: refund.status,
      notes: refund.notes,
      createdAt: new Date(refund.created_at * 1000),
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Get Razorpay API Key (frontend only - to initialize Razorpay checkout)
 * @returns {string} - Razorpay Key ID
 */
const getKeyId = () => {
  return process.env.RAZORPAY_KEY_ID || "rzp_test_SZ3mYhzzSVN0ov";
};

module.exports = {
  createOrder,
  verifyPaymentSignature,
  fetchPaymentDetails,
  createRefund,
  getKeyId,
};
