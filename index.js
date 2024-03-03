const express = require('express');
const app = express();

//import routes 
const userRoutes = require('./routes/User');
const profileRoutes = require('./routes/Profile');
const coursesRoutes = require('./routes/Courses');
const contactRoutes = require('./routes/');

//env
require('dotenv').config();

//config files
const database = require("./config/database");
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { cloudinaryConnect } = require("./config/cloudinary");
const fileUpload = require('express-fileupload');


const PORT = process.env.PORT || 4000;

//connect db
database.connect();

//setting up middlewares 
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    })
)
app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp",
    })
)

//establishing clodinaty connection 
cloudinaryConnect();

//mounting routes 
app.use(
    "/apiv1/auth", userRoutes
)

app.use(
    "/apiv1/userProfile", profileRoutes
)

app.use(
    "/apiv1/courses", coursesRoutes
)

app.use(
    "/apiv1/contact", contactRoutes
)

//def 
app.get("/", (req, res) => {
    return res.json({
        success: true,
        message: "HomePage"
    })
})

//activate 
app.listen(PORT, () => {
    console.log(`App is running at ${PORT}`);
})



