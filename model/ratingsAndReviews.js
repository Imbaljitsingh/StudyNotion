const mongoose = require('mongoose')

//define ratingsAndReviews schema 

const ratingsAndReviews = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    rating: {
        type: Number,
        required: true,
    },
    review: {
        type: String,
        required: true
    },
    courses: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "course"
    }
})

//exporting ratingsAndReviews model

modules.export = mongoose.model('ratingsAndReviews', ratingsAndReviews);