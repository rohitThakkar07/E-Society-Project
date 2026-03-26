const PaymentRecord = require("../../../db/models/paymentRecordModal");
const Maintenance = require("../../../db/models/maintenanceModel");

// Create a Payment Record (Standard Payment)
exports.createPayment = async (req, res) => {
    try {
        const { maintenanceId, paymentMethod, transactionId, amountPaid, remarks } = req.body;

        // 1. Find the bill
        const bill = await Maintenance.findById(maintenanceId);
        if (!bill) return res.status(404).json({ success: false, message: "Bill not found" });

        // 2. Generate Receipt Number
        const receiptNumber = `RCPT-${Date.now()}`;

        // 3. Create the Record
        const payment = await PaymentRecord.create({
            maintenance: maintenanceId,
            resident: bill.resident,
            amount: bill.amount,
            lateFee: bill.lateFee,
            totalAmount: amountPaid,
            paymentMethod,
            transactionId,
            paidAt: new Date(),
            receiptNumber,
            remarks
        });

        // 4. Update the Maintenance Bill Status
        bill.status = "Paid";
        bill.paidDate = new Date();
        bill.paymentHistory.push({
            amount: amountPaid,
            mode: paymentMethod,
            transactionId,
            date: new Date()
        });
        await bill.save();

        res.status(201).json({ success: true, data: payment, message: "Payment Successful" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get All Payment Records (Admin)
exports.getAllPayments = async (req, res) => {
    try {
        const payments = await PaymentRecord.find()
            .populate("resident", "firstName lastName flatNumber")
            .populate("maintenance", "month year")
            .sort({ createdAt: -1 });

        res.json({ success: true, data: payments });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get My Payment History (Resident)
exports.getMyPayments = async (req, res) => {
    try {
        const payments = await PaymentRecord.find({ resident: req.user.profileId })
            .populate("maintenance", "month year amount")
            .sort({ createdAt: -1 });

        res.json({ success: true, data: payments });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};