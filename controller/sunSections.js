const subSections = require('../model/subSections');
const section = require('../model/section');
const uploadImage = require('../utils/uploadImage')
//create subsection 
exports.createSubSection = async (req, res) => {
    try {
        //get all the required data
        const { title, timeDuration, description, sectionID } = req.body;

        const videoFile = req.files.videoFile;

        //validation on the files 
        if (!title || !timeDuration || !description || !videoFile) {
            return res.status(401).json({
                success: false,
                message: "Please provide the required data"
            })
        }

        //upload video to cloudinary
        const videoDetails = await uploadImage(videoFile, process.env.FOLDER_NAME);

        //update the data
        const subSectionData = await subSections.create({
            title: title,
            timeDuration: timeDuration,
            description: description,
            videoURL: videoDetails.secure_url
        })

        //update section with this subsection
        const updatedSection = await section.findByIdAndUpdate({ _id: sectionID }, {
            $push: {
                subSection: subSectionData._id
            }
        }, { new: true }) //HW: use populate

        //return response 
        return res.status(200).json({
            success: true,
            message: "Sub-Section created successfully"
        })
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Something went wrong while updating the section"
        })
    }

}


//HW: update sub section
exports.updateSubSection = async (req, res) => {

    try {
        //get all the required data
        const { title, description } = req.body;

        //perform validation
        if (!title || !description) {
            return res.status(401).json({
                success: false,
                message: "Please, fill all the required fields"
            })
        }

        //get the subSection id 
        const id = await subSections._id;

        //update the subSection based on id
        const updatedSubSection = await subSections.findByIdAndUpdate({ id }, {
            title: title,
            description: description,
        }, { new: true })

        //return response 
        return res.status(200).json({
            success: true,
            message: "Sub-section updated",
            response: updatedSubSection
        })
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Something went wrong while updating the sub-section"
        })
    }
}

//HW: Delete sub section
exports.deleteSubSection = async (req, res) => {
    try {
        //get the id of the subSection you wish to delete
        const subSectionInSection = await section.subSection;
        const subSectionID = await subSections._id;

        //validation 
        if (!subSectionID) {
            return res.status(401).json({
                success: false,
                message: "Please, fill all the required fields"
            })
        }

        //delete from the subsection 
        const deleteFormSubSection = await subSections.findByIdAndDelete({ subSectionID });

        //delete from the sections
        const deleteFromSection = await section.findByIdAndDelete({ subSectionInSection });

        //return response 
        return res.status(200).json({
            success: true,
            message: "Sub-Section Deleted"
        })
    } catch (error) {
        //return response 
        return res.status(400).json({
            success: false,
            message: "Something went wrong while deleting the sub-section"
        })
    }

}