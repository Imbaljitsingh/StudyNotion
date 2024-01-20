const mongoose = require('mongoose');

//define the user schema
const courseProgress = new mongoose.Schema({

    courseID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "course"
    },
    completedVideos: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "subSections"
        }
    ]
})

//exporting the model

module.exports = mongoose.model('courseProgress', courseProgress);