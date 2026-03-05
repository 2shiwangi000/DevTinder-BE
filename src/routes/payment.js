const express = require("express");
const { userAuth } = require("../middlewares/auth");
const paymentRouter = express.Router();
const razorpayInstance = require("../utils/razorpay");
const Payment = require("../modelsOschemas/payment");
const { membershipAmount } = require("../utils/constants");
const {
  validateWebhookSignature,
} = require("razorpay/dist/utils/razorpay-utils");

paymentRouter.post("/payment/create", userAuth, async (req, res) => {
  try {
    const { membershipType } = req.body;
    const receiptId = `rcpt_${req.user._id}_${membershipType}`;
    var options = {
      amount: membershipAmount[membershipType] * 100,
      currency: "INR",
      receipt: receiptId,
      notes: {
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        membershipType,
        email: req.user.emailId,
      },
    };
    const order = await razorpayInstance.orders.create(options);
    const payment = new Payment({
      userId: req.user._id,
      // paymentId: ,
      orderId: order.id,
      status: order.status,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      notes: order.notes,
    });
    const savedPayment = await payment.save();
    res.json({
      ...savedPayment.toJSON(),
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.log(err);
    res.status(err.statusCode).json({
      code: err.statusCode,
      message: `${err?.error?.reason}:${err?.error?.description}`,
    });
  }
});

paymentRouter.post("/payment/webhook/status", async (req, res) => {
  try {
    const webhookSignature = req.headers["X-Razorpay-Signature"];
    const isWebHookValid = validateWebhookSignature(
      JSON.stringify(req.body),
      webhookSignature,
      process.env.RAZORPAY_WEBHOOK_SECRET,
    );
    if (!isWebHookValid) {
      return res.status(400).json({ message: "Webhook signature is invalid" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: err.message,
    });
  }
});

module.exports = paymentRouter;
