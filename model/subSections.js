const mongoose = require('mongoose');

//define the sub section schema
const subSections = new mongoose.Schema({

    title: {
        type: String,
    },
    timeDuration: {
        type: String,
    },
    description: {
        type: String,
    },
    videoURL: {
        type: String
    }
})

//exporting the model

module.exports = mongoose.model('subSections', subSections);