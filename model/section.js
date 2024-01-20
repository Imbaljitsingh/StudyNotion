const mongoose = require('mongoose');

//define the user schema
const sections = new mongoose.Schema({
    title: {
        type: String,
    },
    subSection: [
        {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        }
    ]
})

//exporting the model

module.exports = mongoose.model('sections', sections);