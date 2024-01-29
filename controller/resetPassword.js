const user = require("../model/user");
const generateMail = require("../utils/generateMail");
const crypto = require('crypto');


//resetPasswordToken

exports.resetPasswordToken = async (req, res) => {
    try {
        //get the mail from req
        const { email } = req.body;

        //check the email and perform validation 
        const emailExist = await user.findOne({ email: email });

        if (!emailExist) {
            return res.status(401).json({
                success: false,
                message: "User does not exist"
            })
        }

        //if email exist 

        //generate token 
        const token = crypto.randomUUID();

        //add it to the user data

        const response = await user.findOneAndUpdate(
            { email: email },
            {
                token: token,
                resetPasswordExpire: Date.now() + 5 * 60 * 1000
            },
            { new: true } //return updated doc
        )

        //create url 
        const url = `http://localhost:3000/update-password/${token}`;

        //send mail
        await generateMail(user.email, "Reset Password", `<p>${url}</p>`)

        //sending response 
        return res.status(200).json({
            success: true,
            message: "Reset Password email sent"
        })

    } catch (error) {
        res.status(401).json({
            success: false,
            message: "Something went wrong while sending reset password email."
        })
    }
}

//resetPassword

exports.resetPassword = async (req, res) => {
    //get the required data from the email

    const { token, newPassoword, confirmNewPassword } = req.body;




}