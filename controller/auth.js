const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();

//OTP Generator
const otpGenerator = require('otp-generator')

//importing model
const generateMail = require("../utils/generateMail");
const user = require("../model/user");
const otp = require("../model/otp");


//Send OTP Controller

exports.sendOTP = async (req, res) => {

    try {
        //get the email from the req
        const { email } = req.body;

        //email validation -- if the user exits or not

        const User = await user.findOne({ email });

        if (User) {
            return res.status(500).json({
                success: false,
                message: "User already exists..."
            })
        }

        //generate the OTP
        const OTP = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            specialChars: false,
            lowerCaseAlphabets: false
        });


        //check if OTP is unique or !

        const otpResult = await otp.findOne({ otp: OTP });

        while (otpResult) {
            OPT = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                specialChars: false,
                lowerCaseAlphabets: false
            });

            //check again 
            otpResult = await otp.findOne({ otp: OTP });
        }

        const response = await otp.create({ email, OTP });

        res.status(200).json({
            success: true,
            message: "OTP Added",
            response: response
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: `Something went wrong :: ${error.message}`
        })
    }
}

//signup handler

exports.signUP = async (req, res) => {

    try {

        const { firstName, LastName, email, password, confirmPassword, role, otp, contactNumber } = req.body;

        //validate the data 

        if (!firstName || !LastName || !email || !password || !confirmPassword || !role || !otp || !contactNumber) {
            return res.status(500).json({
                success: false,
                message: "Required Data not recived"
            })
        }

        //email 
        const emailExist = await user.findOne({ email })

        if (emailExist) {
            res.status(500).json({
                success: false,
                message: "Email already exists..."
            })
        }

        //password matching 
        if (password !== confirmPassword) {
            res.status(500).json({
                success: false,
                message: "Passwords do not match"
            })
        }

        //find most recent otp

        const recentOTP = await otp.findOne({ email }).sort({ createdAt: -1 }).limit(1);
        //validate otp
        if (recentOTP.length == 0) {
            return res.status(400).json({
                success: false,
                message: "OTP not found"
            })
        } else if (OTP !== recentOTP.otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            })
        }


        //hashing the password

        let hashedPassword;

        try {
            hashedPassword = await bcrypt.hash(password, 10) //para 1 what password to hash and para 2 number of rounds
        }

        catch (error) {
            return res.status(500).json({
                success: false,
                message: "Error in hashing the password"
            })
        }

        const profile = await Profile.create({
            gender: null,
            dateOfBirth: null,
            aboutMe: null,
            contactNumber: null
        })

        //sending the data to user model

        const userResponse = await user.create({
            firstName,
            LastName,
            email,
            password: hashedPassword,
            role,
            additionalDetails: profile._id,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName}${LastName}`
        })

        res.status(200).json({
            success: true,
            message: "User created successfully"
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: `Something went wrong :: ${error.message}`
        })
    }

}

//login 

exports.login = async (req, res) => {
    try {
        //get the data from req
        const { email, password } = req.body;

        //if password / email is not written 
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email/Password not entered"
            })
        }

        //get user 
        const user = await user.findOne({ email });

        //user validation 
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User does not exit. Please, signUP"
            })
        }

        //defining payload

        const payload = {
            email: user.email,
            role: user.role,
            id: user._id
        }

        //match the password and generate password
        if (await bcrypt.compare(password, user.password)) {
            //genrate JWT tokens params 1.payload , 2.jwt secret, 3. options (optional)
            let token = jwt.sign(payload, "johndoe99", { expiresIn: '2h' });
            user.token = token;

            //generate cookie
            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true //not accessable on client side 
            }
            res.cookie("oreo", token, options).status(200).json({
                success: true,
                token,
                user,
                message: "User Logged In!"
            })
        }
        else {
            return res.status(401).json({
                success: false,
                message: 'Password is incorrect'
            })
        }

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Something went wrong while creating the JWT and Cookie'
        })
    }
}

//change password

exports.changePassword = async (req, res) => {
    try {

        //fettching the data from request body
        const { oldPassword, newPassword, confirmPassword } = req.body;

        //validation 

        if (!oldPassword || !newPassword || !confirmPassword) {
            return res.status(401).json({
                success: false,
                message: "Please, fill all the required fields"
            })
        }

        //if old and user password matches 
        if (await bcrypt.compare(oldPassword, user.password)) {
            try {
                //validate newPassword and confirmNewPassword
                if (newPassword != confirmPassword) {
                    return res.status(401).json({
                        success: false,
                        message: "New Password and Confirm Password do not match"
                    })
                }

                //if password matches 

                let newHashedPassword;

                newHashedPassword = await bcrypt.hash(newPassword, 10);

                const response = await user.findOneAndUpdate({ email }, { password: newHashedPassword });

                //send a mail

                generateMail(user.email, "Password Updated", "<p>Your password has been updated successfully!</p>")

                //send a success response 
                res.status(200).json({
                    success: true,
                    message: "Password has been updated"
                })

            } catch (error) {
                return res.status(401).json({
                    success: false,
                    message: "Something went wrong :: Updating Password"
                })
            }
        }

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Something went wrong :: Updating Password"
        })
    }
}

