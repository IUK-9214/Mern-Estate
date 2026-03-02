import mongoose from "mongoose";

const ConnectDB=async()=>{
try {
    await mongoose.connect(process.env.MONGO_URL)
    console.log("Data Base Is Connected Thank You");
    

} catch (error) {
    console.log("Error in Connecting");
}

}

export default ConnectDB;