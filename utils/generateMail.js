const nodemailer = require('nodemailer');

const generateMail = async (email, title, body) => {
    try {

        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            pass: process.env.MAIL_PASS,
        })

        let info = await transporter.sendMail({
            from: "StudyNotion",
            to: `${email}`,
            subject: `${title}`,
            html: `${body}`
        })

        return info;

    } catch (error) {
        console.log("Error occured in generateMail() function :: ", error)
    }
}

//exporing the generateMail function 

module.exports = generateMail;