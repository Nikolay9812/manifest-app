import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import userRoutes from './routes/user.route.js'
import authRoutes from './routes/auth.route.js'
import manifestRoutes from './routes/manifest.route.js'
import cookieParser from 'cookie-parser'

dotenv.config()

mongoose.connect(process.env.MONGO)
    .then(() => { console.log('Database is connected!') })
    .catch(err => { console.log(err) })

const app = express()

app.use(express.json()) //This will allow us to use json in POSTMAN!!!
app.use(cookieParser())

app.listen(3000, () => {
    console.log('Server is running on port 3000')
})

app.use('/api/user', userRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/manifest', manifestRoutes)

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500
    const message = err.message || 'Iternal Server Error'
    res.status(statusCode).json({
        success: false,
        statusCode,
        message
    })
})