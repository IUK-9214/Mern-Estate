import express from 'express'
import dotenv from 'dotenv'
import ConnectDB from './ConnectDataBase/ConnectDB.js'

const app = express()


dotenv.config()

app.use(express())

ConnectDB()

app.get("/",(req,res)=>
{
    res.json({
        msg:"i m a get request and on home page "
    })
})

app.listen(5000,()=>{

    console.log("Hello I m listeing ....");
    
})

