import express from 'express'
import dotenv from 'dotenv'
import ConnectDB from './ConnectDataBase/ConnectDB.js'
import authrouter from './Router/auth.router.js'

dotenv.config()


const app = express()
app.use(express.json())
ConnectDB()

app.use('/api',authrouter)


app.listen(5000,()=>{

    console.log("Hello I m listeing ....");
    
})

