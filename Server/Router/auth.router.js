import express from 'express'
import { Singup,SingIn, Google } from '../Controller/Auth.js'


const router=express.Router()



router.post("/signup",Singup)
router.post("/signin",SingIn)
router.post("/auth/google",Google)




export default router