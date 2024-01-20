const mongoose = require('mongoose');

//define the user schema 

const user = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    courses: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "course"
        }
    ],
    courseProgress: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "courseProgress"
        }
    ],
    additionalDetails: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "profile",
        required: true,
    }

})

//exporting our user schema
modules.exports = mongoose.model('user', user);