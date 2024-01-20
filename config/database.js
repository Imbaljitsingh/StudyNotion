//requiring mongoose 
const mongoose = require('mongoose');

//requiring the dotenv to connect the mongodb link
require('dotenv').config();

//function to connect the database 
async function connectDB() {
    await mongoose.connect(process.env.DB_LINK, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
        .then(
            () => console.log("Database has been connected successfully...")
        )

        .catch(
            () => console.log("Can't connect to database : Something went wrong")
        )
}

//exporthing the connection function to make a connection 
module.exports = connectDB;