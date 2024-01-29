const Razorpay = require('razorpay');

//config 
exports.instance = new Razorpay({
    key_id: process.env.RAZORPAY_ID,
    key_secret: process.env.SECRET_KEY,
})