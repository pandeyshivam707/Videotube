import { v2 as cloudinary } from "cloudinary"
import fs from "fs"
import dotenv from "dotenv"

dotenv.config()

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

// ✅ Safe delete — never throws
const safeUnlink = (filePath) => {
  try {
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }
  } catch (err) {
    console.log("Warning: Could not delete temp file:", filePath)
  }
}

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto"
    })

    console.log("File uploaded on Cloudinary:", response.url)
    safeUnlink(localFilePath)   // ✅ safe delete after success
    return response

  } catch (error) {
    console.log("Error uploading on Cloudinary:", error)
    safeUnlink(localFilePath)   // ✅ safe delete after failure
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
    console.log("Error deleting from Cloudinary:", error)
    return null
  }
}

export { uploadOnCloudinary, deleteFromCloudinary }