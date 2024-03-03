const ratingsAndReviews = require("../model/ratingsAndReviews")
const course = require("../model/courses");
const user = require("../model/user");
const mongoose = require('mongoose');

//create rating
exports.createRating = async (req, res) => {

    try {
        const userId = req.user.id; //as user is logged in 
        const { user, rating, review, courseId } = req.body;

        //check if user is enrolled or not

        const courseDetails = await findOne({ courseId }, { studentEnrolled: userId });
        if (!courseDetails) {
            return res.status(401).json({
                success: false,
                message: "User doesn't have the course"
            })
        }

        //check if user had already reviewed the course
        const alreadyReviewed = await ratingsAndReviews.findOne({
            user: userId,
            courses: courseId,
        })
        if (alreadyReviewed) {
            return res.status(401).json({
                success: false,
                message: `${userId} has already reviewd the course`
            })
        }

        //create rating
        const feedbackResponse = await ratingsAndReviews.create({
            user,
            rating,
            review,
            courses: courseId
        })

        //update the course
        const addFeedBack = await course.findById({ _id: courseId }, {
            $push: {
                ratingsAndReviews: feedbackResponse._id
            }
        }, { new: true })

        //return response 
        return res.status(200).json({
            success: true,
            message: "review added successfully"
        })
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Something went wrong while adding the reviews",
            feedback: addFeedBack
        })
    }
}
//get average rating
exports.getAverageRating = async (req, res) => {
    try {
        //get course id
        const courseId = req.body.courseId;

        //aggerigate function 
        const result = await ratingsAndReviews.aggregate([
            {
                $match: new mongoose.Types.ObjectId(courseId)
            },
            {
                $group: {
                    _id: null, //this will give all the id 
                    averageRatings: { $avg: "$rating" }
                }
            }
        ])

        if (result.lenght > 0) {
            return res.status(200).json({
                success: true,
                averageRatings: result[0].averageRatings
            })
        }

        else if (result.length == 0) {
            return res.status(200).json({
                success: true,
                averageRatings: 0
            })
        }


    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Error while creating average ratings"
        })
    }
}

//get all rating

exports.getAllRatings = async (req, res) => {

    try {

        //get all the request


    } catch (error) {

    }

}



