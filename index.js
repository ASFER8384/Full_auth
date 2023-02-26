import express from 'express';
import dotenv from "dotenv"
import mongoose from 'mongoose';
import cros from 'cors'
import ejs from 'ejs'


import userRouter from './Routes/User.js'
const app = express()
mongoose.set('strictQuery', false)
dotenv.config()
app.use(express.json())
app.set("view engine", "ejs")
app.use(express.urlencoded({ extended: false }))
app.use(cros())

const Connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("MongoDB Is Connected!!")
    } catch (error) {
        throw (error);
    }
}

mongoose.connection.on("disconnected", () => {
    console.log("MongoDB Is Disconnected")
})

app.use("/user",userRouter)

app.use((err, req, res, next) => {
    const errorStatus = err.status || 500;
    const errorMessage = err.message || "something went wrong";
    res.status(errorStatus).json({
        sucess: false,
        message: err.message,
        stack: err.stack,
        status: err.status,
    })
})

app.listen(2006, () => {
    Connect()
    console.log("Backend Conected!");
})