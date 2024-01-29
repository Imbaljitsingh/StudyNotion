const course = require("../model/courses");
const Tag = require("../model/tags")
const user = require("../model/user")
const uploadImage = require("../utils/uploadImage");

//create course handler 
exports.createCourse = async (req, res) => {
    try {

        //fetch all the data required

        const { courseName, courseDescription, tag, skillsLearned, price } = req.body;

        //get thumbnail

        const thumbnail = req.files.thumbnailImage;

        //validation
        if (!courseName || !courseDescription || !tag || !skillsLearned || !price || !thumbnail) {
            return res.status(401).json({
                success: false,
                message: "All the data is required about courses"
            })
        }

        //check if it is instructor or not
        const userID = req.user.id;
        const instructorDetails = await user.findById(userID);
        console.log(instructorDetails);

        //instructor details not found 
        if (!instructorDetails) {
            return res.status(401).json({
                success: false,
                message: "Instrctor not found"
            })
        }

        //check if tag is valid or not 
        const tagDetails = await Tag.findById(tag); //we are passing the object id not the tag itself
        if (!tag) {
            return res.status(401).json({
                success: false,
                message: "tag not found"
            })
        }


        //upload img to cloudinaty

        const uploadThumbnail = await uploadImage(thumbnail, process.eventNames.FOLDER_NAME);


        //create an entry for new course
        const newCourse = await course.create({
            courseName,
            courseDescription,
            skillsLearned,
            tag,
            instructor: instructorDetails._id,
            thumbnail: thumbnail.secure_url,
            price,
        })

        //add the new course to the user schema
        await user.findByIdAndUpdate({
            _id: instructorDetails._id,
        },
            {
                $push: {
                    courses: newCourse._id
                }
            },

            { new: true }

        )

        //update tag schema 
        //HW


        //retrun response 
        return res.status(200).json({
            success: true,
            message: "Course created successfully"
        })

    } catch (error) {
        return res.status(200).json({
            success: false,
            message: "something went wrong while creating the course"
        })
    }
}


//get all course

exports.getAllCourses = async (req, res) => {
    try {

        const allCourses = await course.find({})


        return res.status(200).json({
            success: true,
            message: "Courses data fetched successfully"
        })

    } catch (error) {
        return res.status(200).json({
            success: false,
            message: "Cannot fetch course data"
        })
    }
}