import User from "../Model/User.js"
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'
import { createError } from "../Utils/createError.js";


export const Register = async (req, res, next) => {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);
    try {
        const newUser = User({
            username: req.body.username,
            email: req.body.email,
            password: hash,

        });
        await newUser.save();
        res.send({ "status": "ok" });
    } catch (err) {
        next(err)
    }
}

export const Login = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) return next(createError(404, "email Wrong"));

        const ispassword = await bcrypt.compare(req.body.password, user.password);
        if (!ispassword) return next(createError(404, "password Wrong"));

        const { password, ...otherDetails } = user._doc
        res.status(200).json({ ...otherDetails, token: genereteJwt(user.id) });

    } catch (err) {
        next(err)
    }
}

export const Forgetpassword = async (req, res, next) => {
    const { email } = req.body
    try {
        const Olduser = await User.findOne({ email })
        if (!Olduser) {
            res.json({status:"error"})
        }
        if(Olduser){
            res.json({status:"ok"})
        }
        const secret = process.env.JWT + Olduser.password;
        const token = jwt.sign({ email: Olduser.email, id: Olduser._id }, secret, {
            expiresIn: "5m"
        })
        const link = `http://localhost:2006/user/forgetpassword/${Olduser._id}/${token}`
        
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            }
        });

        var mailOptions = {
            from: 'youremail@gmail.com',
            to: email,
            subject: 'Sending Email using Node.js',
            text:link
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
        console.log(link)
    } catch (error) {
        console.log(error)
    }
}









export const getUser = async (req, res, next) => {
    try {
        const response = await User.find(req.user)
        res.status(200).json(response)

    } catch (error) {
        next(error)
    }
}


const genereteJwt = (id) => {
    return jwt.sign({ id }, process.env.JWT, { expiresIn: "30d" })
}



export const Got = async (req, res, next) => {
    try {
        const { id, token } = req.params
        const oldUser = await User.findById({ _id: id })
        if (!oldUser) {
            alert("user not found")
        }
        console.log(req.params)
        const secret = process.env.JWT + oldUser.password;
        try {
            const verfiy = jwt.verify(token, secret)
            if (!verfiy) {
                res.send({ message: " not verified" })
            }
            res.render("index", { email: verfiy.email })
        } catch (error) {
            next(error)
        }
    } catch (error) {
        next(error)
    }

}
export const Gott = async (req, res, next) => {
    const { id, token } = req.params
    const { password } = req.body
    const oldUser = await User.findOne({ _id: id })
    if (!oldUser) {
        alert("user not found")
    }
    const secret = process.env.JWT + oldUser.password;
    try {
        const verfiy = jwt.verify(token, secret)
        const hashed = await bcrypt.hash(password, 10)
        console.log(hashed)
        await User.updateOne({ _id: id }, { $set: { password: hashed } })
        res.json({ message: "Updated" })
    } catch (error) {
        console.log(error)
        res.json({ message: "something went wrong" })
    }


}