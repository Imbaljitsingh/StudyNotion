const Razorpay = require("razorpay");

require('dotenv').config();

exports.instance = new Razorpay({
    key_id: RAZORPAY_KEY,
    key_secret: RAZORPAY_SECRET,
});