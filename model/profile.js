const mongoose = require('mongoose')

//define profile schema 

const profile = new mongoose.Schema({
    gender: {
        type: String
    },
    dateOfBirth: {
        type: String
    },
    aboutMe: {
        type: String,
        trim: true,
    },
    contactNumber: {
        type: Number,
    }
})

//exporting profile model

module.export = mongoose.model('profile', profile);