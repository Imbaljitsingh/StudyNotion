const Category = require("../model/category");

//create tag function 

exports.createCategory = async (req, res) => {
    try {
        //get all the required data
        const { name, description } = req.body;

        //validate the data
        if (!name || !description) {
            res.status(400).json({
                success: false,
                message: "All the fields are required"
            })
        }

        //create entry in db
        const CategoryDeatils = await Category.create({
            name: name,
            description: description
        })

        console.log(CategoryDeatils);

        //return success response 
        return res.status(200).json({
            success: true,
            message: "Tag created successfully!"
        })
    } catch (error) {
        return res.status(200).json({
            success: false,
            message: "Something went wrong while creating the tag"
        })
    }
}

//get all tags

exports.getAllCategory = async (req, res) => {
    try {
        //get all the tags
        const allCategory = await Category.find({}, { name: true, description: true });

        //return success response 
        return res.status(200).json({
            success: true,
            message: `${allCategory}`
        })
    } catch (error) {
        return res.status(401).json({
            success: true,
            message: "Something went wrong while getting all the data"
        })
    }
}