const cloudinary = require('cloudinary').v2;

exports.uploadImage = async (file, folder, quality, height) => {
    const options = { folder, height, quality };
    options.resource_type = "auto";
    return await cloudinary.uploader.upload(file.tempFilePath, options);
}