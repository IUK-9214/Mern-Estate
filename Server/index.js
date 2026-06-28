import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import ConnectDB from './ConnectDataBase/ConnectDB.js'
import authrouter from './Router/authrouter.js'
import ListRouting from './Router/ListRouting.js'
import cookieParser from 'cookie-parser'

dotenv.config()

const app = express()

app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
}))

app.use((req, res, next) => {
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups")
    next()
})

app.use(express.json({ limit: '10mb' }))
app.use(cookieParser())
ConnectDB()

app.use('/api', authrouter)
app.use('/api', ListRouting)

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal server error"
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    })
})

app.listen(process.env.PORT || 5000, () => {
    console.log("Hello I m listening....");
})