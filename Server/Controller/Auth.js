import User from "../Models/UserModel.js"
import bcryptjs from 'bcryptjs'
import { errorHandler } from "../utils/error.js"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"

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
    //check the email is correct or not 
    const validUser=await User.findOne({email:email});
    if(!validUser) return next(errorHandler(404,"User not found "));
      //check is the password is correct or not 
    const validpassword=bcryptjs.compareSync(password,validUser.password);
    if(!validpassword)return next(errorHandler(401,"Wrong credentials "));
    //generate a token 
    const token =jwt.sign({id:validUser._id},process.env.JWT_SECRET_KEY);
    //to remove the password from the data which is fetched during the post request for sign in 
    const {password:pass,...rest}=validUser._doc;
    //send the token in the cookie without the password in it 
    res.cookie("access_token",token,{ httpOnly:true}).status(200).json(rest)

  } 
     catch (error) {
         next(error);
}

}


export const Google =async (req,res,next)=>{
try {
    const user=await User.findOne({email:req.body.email})
    if(user){
        const token =jwt.sign({id:user._id},process.env.JWT_SECRET_KEY)
        const {password: pass , ...rest}=user._doc;
        res.cookie("access_Token",token,{httpOnly:ture} ).status(200).json(rest);

    }else{
        const generatePassword=Math.random().toString(36).slice(-8)+Math.random().toString(-8);
        const hashpassword =bcryptjs.hashSync(generatePassword,10);
        const newUser=new user({username:req.body.name.split(" ").join("").toLowerCase()+Math.random().toString(36).slice(-4),email:req.body.email,password:hashpassword,
            avatar:req.body.photo 
        });
          await newUser.save();
          const token =jwt.sign({id:user._id},process.env.JWT_SECRET_KEY);
          const {password:pass,...rest}=newUser._doc;
          res.cookie("access_token",token,{httpOnly:true}).status(200).json(rest);
    }
} catch (error) {
    next(error)
}


}
