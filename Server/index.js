import express from 'express'
import dotenv from 'dotenv'
import ConnectDB from './ConnectDataBase/ConnectDB.js'
import authrouter from './Router/auth.router.js'

dotenv.config()


const app = express()
app.use(express.json())
ConnectDB()

app.use('/api',authrouter)

app.use((err,req,res,next)=>{
    const statusCode=err.statusCode || 500;
    const message=err.message || "Internal server error"
    return res.status(statusCode).json({
        success:false,
        statusCode,
        message,
    })
})


app.listen(5000,()=>{

    console.log("Hello I m listeing ....");
    
})

