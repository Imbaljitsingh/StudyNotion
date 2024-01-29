const mongoose = require('mongoose')

//define category schema 

const category = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    courses: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "course"
    }

})

//exporting profile model

modules.export = mongoose.model('tags', tags);