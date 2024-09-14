import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"

const uploadCloudinary = async (localFilePath) => {

    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.API_KEY , 
        api_secret: process.env.API_SECRET // Click 'View Credentials' below to copy your API secret
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

  
            // // Optimize delivery by resizing and applying auto-format and auto-quality

            // const optimizeUrl = cloudinary.url({
            //     fetch_format: 'auto',
            //     quality: 'auto'
            // });
            
            // console.log(optimizeUrl);
            
            // // Transform the image: auto-crop to square aspect_ratio

            // const autoCropUrl = cloudinary.url('shoes', {
            //     crop: 'auto',
            //     gravity: 'auto',
            //     width: 500,
            //     height: 500,
            // });
            
            // console.log(autoCropUrl);    

    } catch (error) {
        fs.unlinkSync(localFilePath) //remove locally saved file if upload opp fail
        return null
    }
};

export default uploadCloudinary