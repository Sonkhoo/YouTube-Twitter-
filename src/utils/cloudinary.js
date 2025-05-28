import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"

const uploadCloudinary = async (localFilePath) => {

    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY , 
        api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View Credentials' below to copy your API secret
    });

    try {
        if (!localFilePath) return null

            // Upload an image
            const uploadResult = await cloudinary.uploader
            .upload
            ( localFilePath, {
              resource_type: 'auto'
            })
            .catch((error) => {
            console.log(error);
            });

            fs.unlinkSync(localFilePath)
            return uploadResult
    } catch (error) {
        console.log("Error inside uploadCloudinary")
        fs.unlinkSync(localFilePath) //remove locally saved file if upload opp fail
        return null
    }
};

export default uploadCloudinary