const profile = require("../model/profile")
const user = require("../model/user")
const cron = require('node-cron');


exports.updateProfile = async (req, res) => {

    try {
        //get all the required data
        const { dateOfBirth = "", aboutMe = "", gender, contactNumber } = req.body;

        //get user id 
        const id = req.user.id;

        //validation 
        if (!contactNumber || !gender || !id) {
            return res.status(401).json({
                success: false,
                message: "Please, provide the required data"
            })
        }

        //user details
        const userDetails = await findById(id);
        const profileId = await userDetails.additionalDetails;

        //profile 
        const profileDetails = await profile.findById(profileId);

        //updation //differance b/w save and findByIdAndUpdate
        const updatedProfile = await profile.findByIdAndUpdate({ profileDetails }, {
            gender,
            contactNumber,
            dateOfBirth,
            aboutMe
        })


        //return response 
        return res.status(200).json({
            success: true,
            message: "Profile updated successfully"
        })



    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Something went wrong while updating profile"
        })
    }
}


//delete account 

exports.deleteProfile = async (req, res) => {
    try {
        //get user id 
        const id = req.user.id;

        //validation of id

        if (!id) {
            return res.status(401).json({
                success: false,
                message: "Please, Login first"
            })
        }

        //delete profile 
        const userDetails = await user.findById(id);
        const profileID = await userDetails.additionalDetails;

        cron.schedule('60 60 5 * *', async () => {

            await profile.findByIdAndDelete({ _id: profileID });
            //user delete
            await user.findByIdAndDelete({ _id: id });
            //return response 
            return res.status(200).json({
                success: true,
                message: "User Deleted Successfull"
            })

        })
        //delete user from student enrolled

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Something went wrong while deleting profile"
        })
    }
}


//get all the user details 
exports.getAllUserDetails = async (req, res) => {
    try {

        //get the user id 
        const id = req.body;

        //get the user details
        const userDetails = await user.findById(id).populate("additionalDetails").exec();
        //return response 
        return res.status(401).json({
            success: true,
            message: "All user details are fetched successfully"
        })


    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Something went wrong while fetching user profile"
        })
    }
}
