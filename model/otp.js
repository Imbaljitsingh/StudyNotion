const mongoose = require('mongoose');
const generateMail = require('../utils/generateMail');

//define otp schema 

const otp = new mongoose.Schema({
    email: {
        type: String,
    },
    otp: {
        type: Number,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        expires: 5 * 60
    }
})

//define function to send mail before saving to data base using pre middle ware

async function sendOtpMail(email, otp) {
    try {
        const mailResponse = await generateMail(email, "Account Verification Email", otp);
        console.log("Email sent successfully ", mailResponse);
    } catch (error) {
        console.log("Error occured generating mail :: ", error)
    }
}

otp.pre("save", async function (next) {
    try {
        await sendOtpMail(this.email, this.otp);
        next();
    } catch (error) {
        console.log("Error occured while sending OTP :: ", error);
    }
})

//exporting otp model

module.export = mongoose.model('otp', otp);