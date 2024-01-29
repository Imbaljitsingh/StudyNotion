const { default: mongoose } = require("mongoose");
const { instance } = require("../config/razorpay")
const course = require("../model/courses");
const user = require("../model/user");
const generateMail = require("../utils/generateMail");
const courseEnrollment = require("../mail/templates/courseEnrollmentEmail")
//course enrollment email 

//capture the payment and initiate the razorpay order
exports.capturePayment = async (req, res) => {

    try {

        const { courseId } = req.body;
        const userId = req.user.id;

        //validation 
        if (!courseId) {
            return res.status(404).json({
                success: false,
                message: "please provide the details"
            })
        }

        //course details verification 
        let course;
        try {
            course = await course.findById(courseId);

            //validation on course details 
            if (!course) {
                return res.status(404).json({
                    success: false,
                    message: "please provide the course details"
                })
            }

            //get the student enrolled
            const uid = new mongoose.Types.ObjectId(userId);
            if (course.studentEnrolled.includes(uid)) {
                return res.status(404).json({
                    success: false,
                    message: "user already exists"
                })
            }
        } catch (error) {
            return console.error(error)
        }

        //order create
        const amt = course.price;
        const currency = "CAD";

        const options = {
            amount: amt * 100,
            currency,
            recipt: Math.random(Date.now()).toString(),
            notes: {
                courseId,
                userId,
            }
        }


        //function call for order create 
        try {
            const paymentResponse = await instance.orders.create(options);
            console.log(paymentResponse);

            //return response
            return res.status(200).json({
                success: true,
                message: "Order created successfully!",
                orderID: paymentResponse.id
            })


        } catch (error) {
            console.error(error)
            res.json({
                success: false,
                message: "Something went while creating an order."
            })
        }
    } catch (error) {
        console.error(error)
        res.json({
            success: false,
            message: "Something went while creating an order."
        })
    }
}

//verify signature
exports.verifySignature = async (req, res) => {
    try {

        //webtoken 
        const webhook = "12345"; //server secret
        const signature = req.headers["x-razorpay-signature"]; //razorpay signature (encrypted)

        const shasum = crypto.createHmac("sha256", webhook);
        shasum.update(JSON.stringify(req.body)); //read more
        const digest = shasum.digest("hex"); //to convert secret to a hex 

        if (signature === digest) {
            //clg
            console.log("Payment has been authorised.")

            //add student to the course and add student in course from notes we sent 
            const { courseId, userId } = req.body.payload.payment.entity.notes; //path for our notes

            const enrolled = await course.findOne({ _id: courseId }, { $push: { studentEnrolled: userId } }, { new: true })

            //validate
            if (!enrolled) {
                res.status(400).json({
                    success: false,
                    message: "Course not found"
                })
            }

            const studentCourses = await user.findOne({ _id: userId }, { $push: { courses: courseId } }, { new: true })

            if (!studentCourses) {
                res.status(400).json({
                    success: false,
                    message: "User not found"
                })
            }
        }

        //send mail
        const email = await user.findById({ userId }, { email })
        generateMail(email, "Payment Successfull - StudyNotion", courseEnrollment());

        //verify signature res
        res.status(200).json({
            success: true,
            message: "Course added successfully"
        })


    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Something went wrong while verifying the signature"
        })
    }
}


