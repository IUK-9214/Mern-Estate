import User from "../Models/UserModel.js"
import bcryptjs from 'bcryptjs'
import { errorHandler } from "../utils/error.js"
import jwt from "jsonwebtoken"

export const  Singup =async(req,res, next)=>{

    try {
        const {username,email,password}=req.body
        if(!username||!email){
            return res.json({
                msg:"required username and email",
                success:false
            })
        }
        if (password.length<8){
             return next(errorHandler(400, "Password must be at least 8 characters"));
        }

        const hashpassword= bcryptjs.hashSync(password,10);

        const newUser= new User({username,email,password:hashpassword})
        await newUser.save();
        return res.status(201).json({
            msg:"user is created successfull ",
            success:true
        })

    } catch (error) {
       next(error);
    }

} 


export const SingIn = async(req,res,next)=>{
try {
    const {email,password}=req.body;
    const validUser=await User.findOne({email:email});
    if(!validUser) return next(errorHandler(404,"User not found "));
    const validpassword=bcryptjs.compareSync(password,validUser.password);
    if(!validpassword)return next(errorHandler(401,"Wrong credentials "));
    const token =jwt.sign({id:validUser._id},process.env.JWT_SECRET_KEY);
    const {password:pass,...rest}=validUser._doc;

    res.cookie("access_token",token,{ httpOnly:true}).status(200).json(rest)
} catch (error) {
    next(error);

}

}

