/**
 * Dummy Stripe Payment Gateway
 * Simulates real Stripe behavior without actual API calls.
 * Replace these functions with real stripe SDK calls when going live.
 */

// Simulate network delay
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

/**
 * Create a dummy Payment Intent (mirrors Stripe's createPaymentIntent)
 * @returns { clientSecret, paymentIntentId, amount }
 */
const createPaymentIntent = async ({ amount, currency = "inr", metadata = {} }) => {
  await delay(400); // simulate API latency

  const paymentIntentId = `pi_dummy_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  const clientSecret    = `${paymentIntentId}_secret_dummy`;

  return {
    success:         true,
    paymentIntentId,
    clientSecret,
    amount,
    currency,
    status:"requires_payment_method",
  };
};

/**
 * Confirm a dummy payment (mirrors Stripe's confirmCardPayment)
 * @returns { success, transactionId, error? }
 */
const confirmPayment = async ({ paymentIntentId, paymentMethod }) => {
  await delay(800); // simulate processing time

  // 10% random failure to simulate real-world declines
  const randomFail = Math.random() < 0.1;
  if (randomFail) {
    return { success: false, error: "Payment declined. Please try another method." };
  }

  const transactionId = `txn_dummy_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

  return {
    success:       true,
    transactionId,
    paymentIntentId,
    paymentMethod,
    status:        "succeeded",
    paidAt:        new Date().toISOString(),
  };
};

module.exports = { createPaymentIntent, confirmPayment };