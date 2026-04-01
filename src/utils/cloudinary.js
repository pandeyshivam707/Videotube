import { v2 as cloudinary } from "cloudinary"
import fs from "fs"
import dotenv from "dotenv";

dotenv.config();

// Configure once at module load
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null   // ← guard: no file path? bail out

    // Upload the file to Cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",          // ← auto-detect image/video/raw
    })

    // File uploaded successfully — log and delete the local temp file
    console.log("File uploaded on Cloudinary:", response.url)
    fs.unlinkSync(localFilePath)      // ← delete temp file after successful upload

    return response                   // ← return full response (has .url, .duration, etc.)

  } catch (error) {
    fs.unlinkSync(localFilePath)      // ← ALSO delete temp file if upload FAILS
    return null
  }
}

const deleteFromCloudinary = async (publicId) => {
  try {
    if (!publicId) return null

    const result = await cloudinary.uploader.destroy(publicId)
    console.log("Deleted from Cloudinary, public ID:", publicId)
    return result

  } catch (error) {
    console.log("Error deleting from Cloudinary", error)
    return null
  }
}

export { uploadOnCloudinary, deleteFromCloudinary }
 