import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import ConnectDB from './ConnectDataBase/ConnectDB.js'
import authrouter from './Router/authrouter.js'
import ListRouting from './Router/ListRouting.js'
import cookieParser from 'cookie-parser'
import path from 'path' 

dotenv.config()

const app = express()

const __dirname = path.resolve()

app.use(cors({
    origin: process.env.NODE_ENV === 'production'
        ? true
        : 'http://localhost:5173',
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


app.use(express.static(path.join(__dirname, '../Client/dist')))

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../Client/dist', 'index.html'))  // ✅ fixed
})

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal server error"
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    })
})

app.listen(5000, () => {
    console.log("Hello I m listening....");
})