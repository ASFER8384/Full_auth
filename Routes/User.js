import express from 'express'
import {  Forgetpassword, getUser, Got, Gott, Login, Register } from '../Controller/User.js';
import { verfiyToken } from '../Utils/authMiddleware.js';

const router = express()


router.post("/register",Register)
router.post("/login",Login)
router.post("/forgetpassword",Forgetpassword)
router.get("/forgetpassword/:id/:token", Got)
router.post("/forgetpassword/:id/:token", Gott)
router.get("/getuser",verfiyToken,getUser)





export default router;