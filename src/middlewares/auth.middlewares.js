import jwt from "jsonwebtoken"
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.models.js"
import { asyncHandler } from "../utils/asyncHandler.js"

export const verifyJWT = asyncHandler(async (req, _, next) => {
  // Step 1: Get token from cookie OR Authorization header (for mobile)
  // Mobile sends: Authorization: "Bearer <token>"
  const token =(req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", ""));
  
  console.log(token);

  if (!token) {
    throw new ApiError(401, "Unauthorized request")
  }

  // Step 2: Verify and decode the token
  const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
  
  // Step 3: Find the user — select removes password & refreshToken
  const user = await User.findById(decodedToken?._id).select(
    "-password -refreshToken"
  )

  if (!user) {
    throw new ApiError(401, "Invalid access token")
  }

  // Step 4: INJECT user into req — this is the magic!
  req.user = user
  // console.log(req.user, "middleware");
  
  // Step 5: Pass control to the next middleware/controller
  next()
})