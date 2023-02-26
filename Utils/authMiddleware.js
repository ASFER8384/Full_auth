import jwt from "jsonwebtoken"
import asyncHandler from "express-async-handler"
import User from "../Model/User.js";
import { createError } from "./createError.js";



 export const verfiyToken = asyncHandler(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1]

            const decoded = jwt.verify(token, process.env.JWT)

            req.user = await User.findById(decoded.id)
            next()
        } catch (err) {
            next(createError(400, "NOT VALID Authorization"))
        }
    }
    if (!token) {
        return next(createError(401, "NO Token Found"))
    }
})

