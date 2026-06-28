import User from "../Models/UserModel.js"
import bcryptjs from 'bcryptjs'
import { errorHandler } from "../utils/error.js"
import jwt from "jsonwebtoken"
import cloudinary from "../config/cloudinary.js"
import Listing from "../Models/listingModel.js"


const cookieOptions = {
    httpOnly: true,
    secure: false,        
    sameSite: 'lax',    
}

export const Singup = async (req, res, next) => {
    try {
        const { username, email, password } = req.body
        if (!username || !email) {
            return res.json({ msg: "required username and email", success: false })
        }
        if (password.length < 8) {
            return next(errorHandler(400, "Password must be at least 8 characters"))
        }

        const hashpassword = bcryptjs.hashSync(password, 10)
        const newUser = new User({ username, email, password: hashpassword })
        await newUser.save()

        return res.status(201).json({ msg: "user is created successfully", success: true })
    } catch (error) {
        next(error)
    }
}

export const SingIn = async (req, res, next) => {
    try {
        const { email, password } = req.body

        const validUser = await User.findOne({ email })
        if (!validUser) return next(errorHandler(404, "User not found"))

        const validpassword = bcryptjs.compareSync(password, validUser.password)
        if (!validpassword) return next(errorHandler(401, "Wrong credentials"))

        // ← use JWT_SECRET (matches verifyToken.js)
        const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET)

        const { password: pass, ...rest } = validUser._doc

        res.cookie("access_token", token, cookieOptions).status(200).json(rest)

    } catch (error) {
        next(error)
    }
}

export const Google = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email })

        if (user) {
            // ← use JWT_SECRET (matches verifyToken.js)
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
            const { password: pass, ...rest } = user._doc
            res.cookie("access_token", token, cookieOptions).status(200).json(rest)

        } else {
            const generatePassword =
                Math.random().toString(36).slice(-8) +
                Math.random().toString(36).slice(-8)
            const hashpassword = bcryptjs.hashSync(generatePassword, 10)

            const newUser = new User({
                username:
                    req.body.name.split(" ").join("").toLowerCase() +
                    Math.random().toString(36).slice(-4),
                email: req.body.email,
                password: hashpassword,
                avatar: req.body.photo,
            })
            await newUser.save()

            // ← use JWT_SECRET (matches verifyToken.js)
            const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET)
            const { password: pass, ...rest } = newUser._doc
            res.cookie("access_token", token, cookieOptions).status(200).json(rest)
        }
    } catch (error) {
        next(error)
    }
}

export const uploadProfileImage = async (req, res, next) => {
    try {
        const { imageUrl } = req.body
        const userId = req.user.id

        if (!imageUrl) return next(errorHandler(400, "No image provided"))

        const uploadResult = await cloudinary.uploader.upload(imageUrl, {
            folder: "profile_images",
            transformation: [{ width: 300, height: 300, crop: "fill" }],
        })

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { avatar: uploadResult.secure_url },
            { new: true }
        )

        const { password, ...rest } = updatedUser._doc
        res.status(200).json({ success: true, user: rest })

    } catch (error) {
        next(error)
    }
}

export const deleteAccount = async (req, res, next) => {
    try {
        const { id } = req.params

        if (req.user.id !== id) {
            return next(errorHandler(403, "You can only delete your own account"))
        }

        await User.findByIdAndDelete(id)
        res.clearCookie("access_token", cookieOptions)
        res.status(200).json({ success: true, message: "Account deleted successfully" })

    } catch (error) {
        next(error)
    }
}

export const signOut = (req, res, next) => {
    try {
        res.clearCookie("access_token", cookieOptions)
        res.status(200).json({ success: true, message: "Signed out successfully" })
    } catch (error) {
        next(error)
    }
}


 export const getUserListings = async (req, res, next) => {
    try {
        if (req.user.id === req.params.id) {
            const listings = await Listing.find({ userRef: req.params.id });
            res.status(200).json(listings);
        } else {
            return next(errorHandler(403, "You can only view your own listings"));
        }
    } catch (error) {
        next(error);
    }
}


export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return next(errorHandler(404, 'User not found'));
    const { password, ...rest } = user._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};