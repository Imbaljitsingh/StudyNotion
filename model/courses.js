const mongoose = require('mongoose');

//define course schema 

const course = new mongoose.Schema({
    courseName: {
        type: String,
    },
    courseDescription: {
        type: String,
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
    skillsLearned: {
        type: String
    },
    courseContent: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "section"
        }
    ],
    ratingsAndReviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ratingsAndReviews"
        }
    ],
    studentEnrolled: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],

    price: {
        type: Number,
        required: true,
    },

    thumbnail: {
        type: String,
        required: true,
    },

    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "category"
    }
    ,
    tags: {
        type: String,
        required: true
    }

})

module.exports = mongoose.model('course', course)