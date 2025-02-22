const instance = require("../middlewares/razorpay");
const crypto = require("crypto");
const Payment = require("../models/paymentSchema");

const paymentCheckout = async (req, res) => {
    const options = {
        amount: Number(req.body.amount * 100),
        currency: "INR",
    };
    const order = await instance.orders.create(options);

    res.status(200).json({
        success: true,
        order,
    });
};

const paymentVerification = async (req, res) => {

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
        req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
        .update(body.toString())
        .digest("hex");

    // console.log("Signature received: ", razorpay_signature);
    // console.log("Signature generated: ", expectedSignature);

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
        // Database comes here
        await Payment.create({
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
        });

        res.status(200).json({
            success: true,
            message: "Payment verified!",
        });
    } else {
        res.status(400).json({
            success: false,
            message: "Payment verification failed!",
        });
    }
};

module.exports = {
    paymentCheckout,
    paymentVerification,
};