import mongoose, { Schema } from "mongoose"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
  {
    username: {
      type: String,isModified,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,        // ← indexed for fast username lookups
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    avatar: {
      type: String,       // ← Cloudinary URL stored as string
      required: true,
    },
    coverImage: {
      type: String,       // ← optional, no `required`
    },
    watchHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",     // ← references the Video model
      },
    ],
    password: {
      type: String,
      required: [true, "Password is required"],  // ← custom error message
    },
    refreshToken: {
      type: String,isModified
    },
  },
  { timestamps: true }
)

userSchema.pre("save", async function (next) {
  if(!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password,10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(this.password,password);
}

userSchema.methods.generateAccessToken = function () {
  jwt.sign({
    _id : this._id ,
    email : this.email,
    username : this.username,
    fullname : this.fullname
  },
  process.env.ACCESS_TOKEN_SECRET ,
  {
    expiresIn : process.env.ACCESS_TOKEN_EXPIRY ,
  }
)
}

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,   // ← only the ID, nothing more
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  )
}

export const User = mongoose.model("User", userSchema)