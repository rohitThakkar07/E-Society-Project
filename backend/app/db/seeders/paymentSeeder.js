const connectDB = require("../config/db");
const PaymentRecord = require("../models/paymentRecordModal");
const Maintenance = require("../models/maintenanceModel");
const Resident = require("../models/residentsModel");

const paymentMethods = ["card", "netbanking", "upi", "wallet"];

const seedPayments = async () => {
  try {
    await connectDB();

    // 1. Clear existing payments
    await PaymentRecord.deleteMany({});
    console.log("🗑️ Cleared existing payment records.");

    // 2. Get maintenance records (especially those marked as Paid)
    const bills = await Maintenance.find({ status: "Paid" }).limit(40);
    
    if (bills.length < 40) {
      console.log(`⚠️ Only found ${bills.length} paid bills. Seeding payments for all of them.`);
    }

    const paymentsToInsert = [];

    for (let i = 0; i < bills.length; i++) {
        const bill = bills[i];
        
        // Ensure we have a resident ID
        if (!bill.resident) continue;

        const method = paymentMethods[i % paymentMethods.length];
        const timestamp = Date.now() + i;
        const receiptNumber = `RZP-${timestamp}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        const paymentId = `pay_${Math.random().toString(36).substr(2, 14).toUpperCase()}`;
        const orderId = `order_${Math.random().toString(36).substr(2, 14).toUpperCase()}`;

        paymentsToInsert.push({
            maintenance: bill._id,
            resident: bill.resident,
            totalAmount: bill.amount + (bill.lateFee || 0),
            lateFee: bill.lateFee || 0,
            paymentGateway: "razorpay",
            razorpayOrderId: orderId,
            razorpayPaymentId: paymentId,
            razorpaySignature: "dummy_sig_" + timestamp,
            signature_verified: true,
            paymentMethod: method,
            status: "successful",
            receiptNumber: receiptNumber,
            paidAt: bill.paidDate || new Date(),
            notes: {
                month: bill.month,
                year: bill.year,
                description: `Seeded payment for ${bill.month} ${bill.year}`
            }
        });
    }

    // Add some pending/failed ones if we still have room
    if (paymentsToInsert.length < 40) {
        const pendingBills = await Maintenance.find({ status: "Pending" }).limit(40 - paymentsToInsert.length);
        for (let i = 0; i < pendingBills.length; i++) {
            const bill = pendingBills[i];
            const orderId = `order_pending_${Math.random().toString(36).substr(2, 10).toUpperCase()}`;
            
            paymentsToInsert.push({
                maintenance: bill._id,
                resident: bill.resident,
                totalAmount: bill.amount + (bill.lateFee || 0),
                lateFee: bill.lateFee || 0,
                paymentGateway: "razorpay",
                razorpayOrderId: orderId,
                status: "pending",
                notes: {
                    month: bill.month,
                    year: bill.year,
                    description: `Pending payment for ${bill.month} ${bill.year}`
                }
            });
        }
    }

    if (paymentsToInsert.length === 0) {
        console.log("❌ No maintenance records found to link payments. Please run seed:maintenance first.");
        process.exit(1);
    }

    await PaymentRecord.insertMany(paymentsToInsert);
    console.log(`✅ ${paymentsToInsert.length} Payment records seeded successfully.`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding payments failed:", error);
    process.exit(1);
  }
};

seedPayments();
