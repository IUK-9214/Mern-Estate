import User from "../Models/UserModel.js"
import bcryptjs from 'bcryptjs'



export const  Singup =async(req,res)=>{

    try {
        const {username,email,password}=req.body
        if(!username||!email){
            return res.json({
                msg:"required username and email",
                success:false
            })
        }

        const hashpassword= bcryptjs.hashSync(password,10);

        const newUser= new User({username,email,password:hashpassword})
        await newUser.save();
        return res.status(201).json({
            msg:"user is created successfull ",
            success:false
        })

    } catch (error) {
        return res.status(500).json({
            msg:error.msg,
            success:false
        })
    }

}