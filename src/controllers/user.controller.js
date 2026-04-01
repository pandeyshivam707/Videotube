// import {asyncHandler} from "../utils/asyncHandler.js";
// import { ApiError } from "../utils/ApiError.js";
// import { User } from "../models/user.models.js";
// // import UserRoute from "../routes/user.routes";
// import { uploadOnCloudinary } from "../utils/cloudinary.js";
// import {ApiResponse} from "../utils/ApiResponse.js";
// import { log } from "console"; 

// const registerUser = asyncHandler(async (req, res) => {
//     // logic 
//     console.log(req.body);
    
//     const { fullname, username, email, password } = req.body;
//     if ([fullname, username, email, password].some((field) => field?.trim() === "")) {
//         throw new ApiError(400, "All field are required !");
//     }


//     const existedUser = await User.findOne({
//         $or: [{ username}, {email }]
//     })

//     if (existedUser) {
//         throw new ApiError(409, "User already exists!");
//     }

//     const avatarLocalPath = req.files?.avatar?.[0]?.path;
//     const coverImageLocalPath = req.files?.coverimage?.[0]?.path;

//     if (!avatarLocalPath) {
//         throw new ApiError(400, "Avatar not uploaded !");
//     }

//     // const avatar = await uploadOnCloudinary(avatarLocalPath);
//     // let coverImage = "";
//     // if (coverImageLocalPath) {
//     //     coverImage = await uploadOnCloudinary(coverImageLocalPath);
//     // } -> earlier old version not good

//     let avatar ;
//     if(avatarLocalPath){
//         try{
//             avatar = await uploadOnCloudinary(avatarLocalPath);
//             console.log(avatar,"uploaded avatar");
            
//         }catch(error){
//             console.log("error uploading avatar",error);
//             throw new ApiError(500,"failed to upload avatar");
//         }
//     }

//     let coverImage ;
//     if(coverImageLocalPath){
//         try{
//             coverImage = await uploadOnCloudinary(coverImageLocalPath);
//             console.log(coverImage,"uploaded coverImage");
            
//         }catch(error){
//             console.log("error uploading coverImage",error);
//             throw new ApiError(500,"failed to upload coverImage");
//         }
//     }

//     const user = await User.create({
//         fullname,
//         avatar: avatar.url,
//         coverImage: coverImage?.url || "",
//         email,
//         password,
//         username: username.toLowercase()
//     })

//     const createdUser = await User.findById(user._id).select(
//         "-password -refreshToken"
//     )

//     if (!createdUser) {
//         throw new ApiError(500, "Something went wrong while registeration")
//     }

//     return res.status(201).json(new ApiResponse(200, createdUser , "User registered Successfully"));
// })

// export { registerUser }; 

import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { User } from "../models/user.models.js"
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js"

const registerUser = asyncHandler(async (req, res) => {
  // 1. Get data from request body
  const { fullNaame, username, email, password } = req.body

  // 2. Validate - no empty fields
  if (
    [fullName, username, email, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required")
  }

  // 3. Check if user already exists
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  })

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists")
  }

  // 4. Get file paths from multer
  const avatarLocalPath = req.files?.avatar?.[0]?.path
  const coverLocalPath = req.files?.coverImage?.[0]?.path

  // Avatar is required
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is missing")
  }

  // 5. Upload to Cloudinary
  let avatar
  let coverImage = ""

  try {
    avatar = await uploadOnCloudinary(avatarLocalPath)

    if (coverLocalPath) {
      coverImage = await uploadOnCloudinary(coverLocalPath)
    }
  } catch (error) {
    // Cleanup if upload fails
    if (avatar) {
      await deleteFromCloudinary(avatar.public_id)
    }
    throw new ApiError(500, "Error while uploading files")
  }

  // 6. Create user in DB
  let user

  try {
    user = await User.create({
      fullName,
      avatar: avatar.url,
      coverImage: coverImage?.url || "",
      email,
      password,
      username: username.toLowerCase(),
    })
  } catch (error) {
    // Cleanup: delete uploaded images if user creation fails
    console.log("User creation failed")
    if (avatar) {
      await deleteFromCloudinary(avatar.public_id)
    }
    if (coverImage) {
      await deleteFromCloudinary(coverImage.public_id)
    }
    throw new ApiError(500, "Something went wrong while registering a user and images were deleted")
  }

  // 7. Fetch created user (excluding password & refreshToken)
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  )

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering a user")
  }

  // 8. Send success response
  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registered successfully"))
})

export { registerUser }