const user = require("../models/user");
const razorpayInstance = require("../utils/razorpay");
const validators = require('../utils/validators');
const { successResponse } = require('../utils/responseHandler');
const Payment = require('../models/payment');
const User = require('../models/user');
const { validateWebhookSignature } = require("razorpay/dist/utils/razorpay-utils");

const createPaymentOrder = async (req, res, next) => {

    try {
        validators.createPaymentOrderValidator(req.body);
        const { firstName, lastName, emailId } = req.user;

        const order = await razorpayInstance.orders.create({
            amount: req.body.amount * 100,
            currency: "INR",
            receipt: "receipt#1",
            notes: {
                firstName,
                lastName,
                emailId,
                subscriptionType: req.body.subscriptionType,
            },
        });

        console.log("Payment order created:", order);

        const payment = new Payment({
            userId: req.user._id,
            orderId: order.id,
            status: order.status,
            amount: order.amount,
            currency: order.currency,
            receipt: order.receipt,
            notes: order.notes
        });

        const savedPayment = await payment.save();
        console.log("Payment saved:", savedPayment);

        successResponse(res, "Payment order created successfully", 200, {
            ...savedPayment.toJSON(),
            keyId: process.env.RAZORPAY_KEY
        });

    } catch (error) {
        console.error("Error creating payment order:", error.message);
        next(error);
    }
}

const paymentWebhook = async (req, res, next) => {
    try {
        const webhookSignature = req.get("X-Razorpay-Signature");

        const isWebhookValid = validateWebhookSignature(
            JSON.stringify(req.body),
            webhookSignature,
            process.env.RAZORPAY_WEBHOOK_SECRET
        );

        if (!isWebhookValid) {
            throw new AppError("Invalid webhook signature", 400);
        };

        const paymentDetails = req.body.payload.payment.entity;

        const dbPayment = await Payment.findOne({ orderId: paymentDetails.order_id });

        dbPayment.status = paymentDetails.status;
        dbPayment.paymentId = paymentDetails.id;

        await dbPayment.save();

        console.log("Payment updated in DB:", dbPayment);

        const user = await User.findOne({ _id: dbPayment.userId });

        user.isPremium = true;
        user.subscriptionType = dbPayment.notes.subscriptionType;

        user.skipFieldValidation = true;

        await user.save();

        // Update the user as premium

        // if (req.body.event == "payment.captured") {
        // }
        // if (req.body.event == "payment.failed") {
        // }

        // return success response to razorpay

        successResponse(res, "Webhook received successfully", 200);

    } catch (error) {
        console.error("Error in webhook :", error.message);
        next(error);
    }
}

const verifyPayment = async (req, res, next) => {
    try {
        const user = req.user.toJSON();
        if (user.isPremium) {
            return successResponse(res, "You are already a premium user", 200, user);
        }
        return successResponse(res, "You are not a premium user", 200, user);
    } catch (error) {
        console.error("Error :", error);
        next(error);
    }
}

module.exports = {
    createPaymentOrder,
    paymentWebhook,
    verifyPayment
}