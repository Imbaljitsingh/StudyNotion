//get the sections model
const section = require('../model/section');
const course = require('../model/courses');
const section = require('../model/section');

//create subsection 
exports.createSection = async (req, res) => {
    try {

        //get the section name from the request body 
        const { sectionName, courseID } = req.body;

        //name validation 
        if (!sectionName || !courseID) {
            return res.status(401).json({
                success: false,
                message: "Something went wrong while creating the section."
            })
        }

        //create the section 
        const response = await section.create({ title: sectionName });

        //send this to the courses 
        const updatedSection = await course.findByIdAndUpdate(courseID, {
            $push: {
                courseContent: response._id
            }
        },
            { new: true }) //popullate so that section and subsection can be updated at one time

        //success return 
        return res.status(200).json({
            success: true,
            message: "Section created successfully"
        })


    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Something went wrong while creating the section"
        })
    }
}

//update the section 

exports.updateSection = async (req, res) => {

    try {
        //get the required data
        const { sectionName, sectionID } = req.body;

        //data validation 
        if (!sectionName || !sectionID) {
            return res.status(401).json({
                success: false,
                message: "Please fill the input required"
            })
        }
        //update the name 
        const section = await section.findByIdAndUpdate({ sectionID }, { title: sectionName }, { new: true });

        //return response 
        return res.status(200).json({
            success: true,
            message: "Section updated successfully"
        })



    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Something went wrong while updating the section"
        })
    }

}

//delete the section  
exports.deleteSection = async (req, res) => {
    try {
        const { sectionID } = req.body;

        //data validation 
        if (!sectionID) {
            return res.status(401).json({
                success: false,
                message: "Please fill the input required"
            })
        }

        //delete the data 
        const deleteSection = await section.findByIdAndDelete({ sectionID });

        //return response 
        return res.status(200).json({
            success: true,
            message: "Section deleted successfully"
        })

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Something went wrong while deleting the section"
        })
    }
}