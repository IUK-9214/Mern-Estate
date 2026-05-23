import mongoose from "mongoose";


const UserSchema =  new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
     email:{
        type:String,
        required:true,
        unique:true
    },
     password:{
        type:String,
        required:true,
    },
    avatar:{
        type:String,
        default:"https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D"
    },
},{
    timestamps:true
})

const User= mongoose.model("Users",UserSchema);
export default User