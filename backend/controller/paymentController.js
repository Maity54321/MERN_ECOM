const Razorpay = require("razorpay");
const crypto = require("crypto");
const { paymentModel } = require("../models/paymentModel");

exports.checksout = async (req, res) => {
  const instance = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY,
    key_secret: process.env.RAZORPAY_SECRET_KEY,
  });
  const options = {
    amount: parseInt(req.body.amount * 100),
    currency: "INR",
  };
  try {
    const order = await instance.orders.create(options);
    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.log(error);
  }
  // console.log(order);
};

exports.paymentVerification = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET_KEY)
    .update(body.toString())
    .digest("hex");

  if (expectedSignature === razorpay_signature) {
    // Save Data to Database

    const paymentDetails = await paymentModel.create({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });
    // console.log(paymentDetails);
    res.redirect(
      `http://localhost:3000/paymentsuccess?reference=${razorpay_payment_id}`
    );
  } else {
    res.status(400).json({ success: false });
  }
};
exports.getKey = (req, res) => {
  res.status(200).send({
    key: process.env.RAZORPAY_API_KEY,
  });
};

exports.paymentSuccess = async (req, res) => {
  const paymentId = await paymentModel.findOne();
};
